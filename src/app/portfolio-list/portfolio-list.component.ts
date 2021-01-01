import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';
import { PortfolioListResolverService } from './portfolio-list-resolver.service';

@Component({
  selector: 'portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {

  portfolios: Array<Portfolio> = [];
  subscription1: Subscription = new Subscription();
  subscriptions: Subscription[] = []

  public portfolioForm = new FormGroup({
    portfolioTitleControl: new FormControl('',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
      ]),
    portfolioTypeControl: new FormControl('',
      [
        Validators.min(1.00),
        Validators.maxLength(30)
      ])
  });
  
  constructor(private route: ActivatedRoute, private portfolioDataService: PortfolioDataService) { }

  get portfolioTitleControl() { return this.portfolioForm.get('portfolioTitleControl'); }
  get portfolioTypeControl() { return this.portfolioForm.get('portfolioTypeControl'); }


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

  onSubmitPortfolio(): void{
    let port: Portfolio = {
      title: String(this.portfolioTitleControl?.value).trim(),
      portfolioId: 0,
      creationDate: new Date(),
      totalMarketValue: 0,
      gainLoss: 0,
      orders: [],
      holdings: [],
      type: String(this.portfolioTypeControl?.value).trim()
    }

    console.log("Sending portfolio post to API: ");
    console.log(port)
    this.portfolioDataService.addPortfolio(port)
      .subscribe(
        (returnedPort) => { this.portfolios.push(returnedPort); },
        (error) => { console.log('Error in onSubmitPortfolio: ' + error) },
        () => { console.log(`addportfolio completed`); }
      );
  }
    
  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  }

}
