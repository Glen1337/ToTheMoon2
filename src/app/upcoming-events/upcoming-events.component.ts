import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription, Subject } from 'rxjs';
import { ResearchDataService } from '../Services/research-data.service';
import { formatDate, Location } from '@angular/common';
import { UpcomingEvents } from '../Models/UpcomingEvents';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { FinancialPage } from '../Common/FinancialPage';
import { DateConverter } from '../Utilities/DateConverter';

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

const daysBehind: number = 7;
const daysAhead: number = 7;

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent extends FinancialPage implements OnInit, OnDestroy {

  public upcomingEvents: UpcomingEvents = {} as UpcomingEvents;
  public currentlyLoading: boolean = false;

  public static readonly daysBehind: number = daysAhead;
  public static readonly daysAhead: number = daysBehind;

  private BeginDate: Date = new Date(new Date().setDate(new Date().getDate() - daysBehind))
  private EndDate: Date = new Date(new Date().setDate(new Date().getDate() + daysAhead))
  
  view: CalendarView = CalendarView.Week;

  // Sets calendar current date
  viewDate: Date = new Date();

  calendarEvents: CalendarEvent[] = [];

  public upcomingEventsForm = new UntypedFormGroup({
    startDateControl: new UntypedFormControl(this.getInitialStartDate(), [Validators.required]),
    endDateControl: new UntypedFormControl(this.getInitialEndDate(), [Validators.required])
  });

  constructor(public location: Location, private researchService: ResearchDataService, private route: ActivatedRoute, public dateService: DateConverter) {
    super();
  }

  ngOnInit(): void {
    this.currentlyLoading = true;
    let sub$: Subscription = new Subscription();
    this.calendarEvents = this.createDays();
    sub$ = this.route.data.subscribe({
      next: (data) => {
        this.upcomingEvents = data.upcomingEvents as UpcomingEvents;

        this.upcomingEvents.ipo.forEach((ipo) => {
          let foundCalendarEvent = this.calendarEvents.find(day => new Date(ipo.offeringDate).getDate() == day.start.getDate());
          if(foundCalendarEvent){
            foundCalendarEvent!.title = foundCalendarEvent!.title+=`<br>IPO: ${ipo.symbol}`;
            // foundCalendarEvent.title. fontcolor("ff6347");
          }
        });

        this.upcomingEvents.earnings.forEach((announcement) => {
          let foundCalendarEvent = this.calendarEvents.find(day => new Date(announcement.reportDate).getDate() == day.start.getDate());
          if(foundCalendarEvent){
            foundCalendarEvent!.title = foundCalendarEvent!.title+=`<br>Earnings: ${announcement.symbol}`;
            //foundCalendarEvent.title.fontcolor("green");
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

  private getInitialStartDate(): string {
    return this.BeginDate.toISOString().split('T')[0]; // .replace(/-/g, '');
  }

  private getInitialEndDate(): string{
    return this.EndDate.toISOString().split('T')[0]; // .replace(/-/g, '');
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

}
