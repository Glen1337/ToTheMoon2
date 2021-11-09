import { Component, OnDestroy, OnInit } from '@angular/core';
import { MarketData } from '../Models/MarketData';
import { ResearchDataService } from '../Services/research-data.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit, OnDestroy {

  public marketData: MarketData = {} as MarketData;
  errorMsg: string = '';
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private researchdataService: ResearchDataService, private location: Location) {
  }

  ngOnInit(): void {
    let sub1: Subscription = this.route.data.subscribe(
      (data) => {
        console.log(data.marketData);
        this.marketData = data.marketData;
      },
      (error) => {
        this.errorMsg = `${error.name}`;
        console.log('(component)Error getting market perf. data');
      },
      () => { console.log('Market Perf. Data retrieved'); }
    );
    this.subscriptions.push(sub1);
  }

  //   let sub: Subscription = new Subscription();
  //   sub = this.researchdataService.getMarketInfo().subscribe(
  //     (marketDataJson) => {
  //       this.marketData = marketDataJson;
  //       console.log(this.marketData);
  //     },
  //     (error) => {
  //       this.errorMsg = `${error.name}`;
  //       console.log('(component)Error getting market perf. data');
  //     },
  //     () => { console.log('Market Perf. Data retrieved'); }
  //   );
  //   this.subscriptions.push(sub);
  // }

  messageClick(): void {
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
