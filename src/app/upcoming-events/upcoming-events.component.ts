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

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent implements OnInit, OnDestroy {

  public errorMsg: string = '';
  public refreshMsg: string = '';
  private subscriptions: Subscription[] = [];
  public upcomingEvents: UpcomingEvents = {} as UpcomingEvents;
  public currentlyLoading: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.calendarEvents = this.calendarEvents.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  
  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  calendarEvents: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      title: "Earnings",
      color: colors.blue,
      allDay: false,
      resizable: {
          beforeStart: false,
          afterEnd: false,
      },
      draggable: false,
    }
  ];

  handleEvent(action: string, event: CalendarEvent): void {

  }


  public upcomingEventsForm = new FormGroup({
    startDateControl: new FormControl(this.getInitialStartDate(), [Validators.required]),
    endDateControl: new FormControl(this.getInitialEndDate(), [Validators.required])
  });

  constructor(private location: Location,
              private researchService: ResearchDataService,
              private route: ActivatedRoute) {
              }

  ngOnInit(): void {
    // let sub$: Subscription = new Subscription();
    // sub$ = this.route.data.subscribe(
    //   (data) => {
    //   },
    //   (error) => {
    //   },
    //   () => { }
    // );
    // this.subscriptions.push(sub$);
  }

  get startDateControl(): AbstractControl { return this.upcomingEventsForm.get('startDateControl')!; }

  get endDateControl(): AbstractControl | null { return this.upcomingEventsForm.get('endDateControl')!; }

  submitForm(): void{
    // Set calendar dates to form control days
    //add calendar event object for each day by default
    this.currentlyLoading = true;
    let startDate = this.startDateControl.value;
    let endDate = this.endDateControl?.value;
    let upcomingEvents$ = this.researchService.getUpcomingEvents(startDate, endDate).subscribe(
      (events) => {
        this.upcomingEvents = events;
        this.upcomingEvents.earnings.forEach((announcement) => {
          //add announcement to proper day's calendar event object
          this.calendarEvents[0].title = this.calendarEvents[0].title.concat(`<br>${announcement.symbol}`);
        });
        console.log(this.upcomingEvents);
        
      },
      (error) => {
        this.currentlyLoading = false;
        console.log(`(component)Error getting upcoming event data:${error}`);
        this.errorMsg = `${error.error}`;
      },
      () => {
        this.currentlyLoading = false;
      }
    );
    this.subscriptions.push(upcomingEvents$);
  }

  private getInitialStartDate(): string {
    let today = new Date();
    let start = new Date(today.setDate(today.getDate() - 10)).toISOString().split('T')[0]; // .replace(/-/g, '');
    return start;
  }

  private getInitialEndDate(): string{
    let today = new Date();
    let end = new Date(today.setDate(today.getDate() + 10)).toISOString().split('T')[0]; // .replace(/-/g, '');
    return end;
  }

  messageClick(): void {
    this.refreshMsg = '';
    this.errorMsg = '';
  }

  goBack(): void {
  this.location.back();
  }

  refreshPage(): void {
    location.reload();
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
