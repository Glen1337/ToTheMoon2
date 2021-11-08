import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { ResearchDataService } from '../Services/research-data.service';
import { formatDate, Location } from '@angular/common';
import { UpcomingEvents } from '../Models/UpcomingEvents';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

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


  public upcomingEventsForm = new FormGroup({
    startDateControl: new FormControl(this.getInitialStartDate(), [Validators.required]),
    endDateControl: new FormControl(this.getInitialEndDate(), [Validators.required])
  });

  constructor(private location: Location,
              private researchService: ResearchDataService,
              private route: ActivatedRoute) {
              }

  ngOnInit(): void {
    let sub: Subscription = new Subscription();
    sub = this.route.data.subscribe(
      (data) => {
        this.upcomingEvents = data.upcomingEvents as UpcomingEvents;
        console.log(this.upcomingEvents);
      },
      (error) => {
        console.log(`(component)Error getting upcoming event data:${error}`);
        this.errorMsg = `${error.error}`;
      },
      () => {console.log('Finsished retrieving upcoming event data'); }
    );
    this.subscriptions.push(sub);
  }

  get startDateControl(): AbstractControl | null { return this.upcomingEventsForm.get('startDateControl'); }

  get endDateControl(): AbstractControl | null { return this.upcomingEventsForm.get('endDateControl'); }

  submitForm(): void{
    this.currentlyLoading = true;
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

  refresh(): void {
    location.reload();
  }

  public removeTime(date: Date): string {
    let x = formatDate(date , 'MM/dd/yyyy', 'en-US', 'UTC');
    return x;
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }
      });
    }
  }

}
