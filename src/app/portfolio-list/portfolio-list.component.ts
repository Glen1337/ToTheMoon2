import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';

@Component({
  selector: 'portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {

  portfolios: Array<Portfolio> = [];
  subscription1: Subscription = new Subscription();
  subscriptions: Subscription[] = []
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
     this.subscription1 = this.route.data.subscribe( data => {
      //console.log(data);
      this.portfolios = data.portfolios
    },
    (error) => {
      console.log(`Error getting portfolio list:${error}`);
    });

    this.subscriptions.push(this.subscription1)
    //this.subscriptions.push(this.subscription2)
  }
    
  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  }

}
