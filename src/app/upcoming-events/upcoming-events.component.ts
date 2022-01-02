import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription, Subject } from 'rxjs';
import { ResearchDataService } from '../Services/research-data.service';
import { formatDate, Location } from '@angular/common';
import { UpcomingEvents } from '../Models/UpcomingEvents';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarWeekViewAllDayEvent,
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { messageEnabled } from '../Common/message-enabled';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

const BeginDate: Date = new Date(new Date().setDate(new Date().getDate() - 7))
const EndDate: Date = new Date(new Date().setDate(new Date().getDate() + 8))

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent extends messageEnabled implements OnInit, OnDestroy {

  public static readonly daysBehind: number = 7;
  public static readonly daysAhead: number = 7;
  private subscriptions: Subscription[] = [];
  public upcomingEvents: UpcomingEvents = {} as UpcomingEvents;
  public currentlyLoading: boolean = false;

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.calendarEvents = this.calendarEvents.filter((iEvent) => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];
  
  view: CalendarView = CalendarView.Week;

  //CalendarView = CalendarView;

  // Sets calendar current date
  viewDate: Date = new Date();

  calendarEvents: CalendarEvent[] = [];

  handleEvent(action: string, event: CalendarEvent): void {

  }

  public upcomingEventsForm = new FormGroup({
    startDateControl: new FormControl(this.getInitialStartDate(), [Validators.required]),
    endDateControl: new FormControl(this.getInitialEndDate(), [Validators.required])
  });

  constructor(public location: Location, private researchService: ResearchDataService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.currentlyLoading = true;
    let sub$: Subscription = new Subscription();
    this.calendarEvents = this.createDays();
    sub$ = this.route.data.subscribe({
      next: (data) => {
        this.upcomingEvents = data.upcomingEvents as UpcomingEvents;
        this.upcomingEvents.earnings.forEach((announcement) => {
          let foundCalendarEvent = this.calendarEvents.find(day => new Date(announcement.reportDate).getDate() == day.start.getDate());
          if(foundCalendarEvent){
            foundCalendarEvent!.title = foundCalendarEvent!.title+=`<br>Earnings: ${announcement.symbol}`;
            foundCalendarEvent.title.fontcolor("green");
          }
        });
        this.upcomingEvents.ipo.forEach((ipo) => {
          let foundCalendarEvent = this.calendarEvents.find(day => new Date(ipo.offeringDate).getDate() == day.start.getDate());
          if(foundCalendarEvent){
            foundCalendarEvent!.title = foundCalendarEvent!.title+=`<br>IPO: ${ipo.symbol}`;
            foundCalendarEvent.title.fontcolor("ff6347");
          }
        });
        this.currentlyLoading = false;
        console.log(this.upcomingEvents);
      },
      error: (error) => {
        console.log(`(component)Error getting upcoming event data:${error}`);
        this.errorMsg = `${error.error}`;
        this.currentlyLoading = false;
      },
      complete: () => {console.log('Finsished retrieving upcoming event data'); }
    });
    this.subscriptions.push(sub$);
  }

  get startDateControl(): AbstractControl { return this.upcomingEventsForm.get('startDateControl')!; }

  get endDateControl(): AbstractControl | null { return this.upcomingEventsForm.get('endDateControl')!; }

  submitForm(): void{
    //add calendar event object for each day by default
    this.currentlyLoading = true;
    let startDate = this.startDateControl.value;
    let endDate = this.endDateControl?.value;
    let upcomingEvents$ = this.researchService.getUpcomingEvents(startDate, endDate).subscribe({
      next: (events) => {
        this.upcomingEvents = events;
        console.log(this.upcomingEvents);
        
      },
      error: (error) => {
        this.currentlyLoading = false;
        console.log(`(component)Error getting upcoming event data:${error}`);
        this.errorMsg = `${error.error}`;
      },
      complete: () => {
        this.currentlyLoading = false;
      }
    });
    this.subscriptions.push(upcomingEvents$);
  }

  private getInitialStartDate(): string {
    return BeginDate.toISOString().split('T')[0]; // .replace(/-/g, '');
  }

  private getInitialEndDate(): string{
    return EndDate.toISOString().split('T')[0]; // .replace(/-/g, '');
  }

  private createDays(): CalendarEvent[]{
    let days: CalendarEvent[] = [];

    for (let i = -7; i <=7; i++) {
      let day = {
        start: startOfDay(addDays(new Date(),i)),
        end: endOfDay(addDays(new Date(),i)),
        title: "<strong><u>IPOs & Earnings</u></strong>",
        color: colors.blue,
        allDay: false,
        resizable: {
            beforeStart: false,
            afterEnd: false,
        },
        draggable: false,
      }
      days.push(day)
    }
    return days;
  }

  //TODO: make this into pipe
  public formatDate(input: any): string {
    if(!input) {
      return '';
    }
    if (typeof input === typeof Date) {
      input = input.toLocaleString('');
    }
    //let tempDate: Date = new Date(input);
    //return `${tempDate.getUTCMonth()+1}/${tempDate.getUTCDate()}/${tempDate.getUTCFullYear()}`
    return formatDate(input, 'MM/dd/yyyy', 'en-US', 'UTC')
    // return formatDate(date , 'MM/dd/yyyy hh:mm aa', 'en-US', 'UTC');
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }
      });
    }
  }

}
