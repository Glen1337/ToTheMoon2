import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { ResearchDataService } from '../Services/research-data.service';
import { Location } from '@angular/common';
import { UpcomingEvents } from '../Models/UpcomingEvents';

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

  constructor(private location: Location,
              private researchService: ResearchDataService,
              private route: ActivatedRoute) { }

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

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }
      });
    }
  }

}
