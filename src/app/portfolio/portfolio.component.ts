import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {

  public portfolio = <Portfolio>{};
  portfolioId: Number = 0;
  subscription1: Subscription = new Subscription;
  subscriptions: Subscription[] = [];

  constructor(http: HttpClient,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription1 = this.route.data.subscribe( data => {
      //console.log(data);
      this.portfolio = data.portfolio
    },
    (error) => {
      console.log(`Error getting portfolio list:${error}`);
    });

    this.subscriptions.push(this.subscription1)
    //this.subscriptions.push(this.subscription2)
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

}
