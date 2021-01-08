import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';

@Component({
  selector: 'portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {

  portfolios: Array<Portfolio> = [];
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscriptions: Subscription[] = []

  public portfolioForm = new FormGroup({
    portfolioTitleControl: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
    ]),
    portfolioTypeControl: new FormControl('',[
      Validators.min(1.00),
      Validators.maxLength(30)
    ])
  });
  
  constructor(private route: ActivatedRoute, private location: Location, private portfolioDataService: PortfolioDataService) {}

  get portfolioTitleControl() { return this.portfolioForm.get('portfolioTitleControl'); }
  
  get portfolioTypeControl() { return this.portfolioForm.get('portfolioTypeControl'); }

  ngOnInit(): void {
    this.subscription1 = this.route.data.subscribe(
      (data) => { this.portfolios = data.portfolios; },
      (error) => {
        console.log(`(component)Error getting portfolio list:${error}`);
        return of([]);
      },
      () => { console.log("Completed retrieval of portfolio list");}
    );

    this.subscriptions.push(this.subscription1)
  }

  onSubmitPortfolio(): void{
    let port: Portfolio = {
      title: String(this.portfolioTitleControl?.value).trim(),
      portfolioId: 0,
      totalMarketValue: 0,
      gainLoss: 0,
      orders: [],
      holdings: [],
      type: String(this.portfolioTypeControl?.value).trim()
    }

    console.log("(component)Sending portfolio post to API: ", port);

    this.subscription2 = this.portfolioDataService.addPortfolio(port)
      .subscribe(
        (returnedPort) => { this.portfolios.push(returnedPort); },
        (error) => {
          console.log('(component)Error in onSubmitPortfolio: ', error);
          // TODO assign user friendly error message string here
          return of([]);
        },
        () => { console.log(`addportfolio completed`); }
      );
    this.subscriptions.push(this.subscription2)
  }
    
  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  }

  // private AddDateStringsToPorts(ports: Portfolio[]): Portfolio[] {
  //   ports.forEach(port =>{
  //     if(port.creationDate) {
  //       port.creationDateString = new Date(port.creationDate).toLocaleString();
  //     } else {
  //       port.creationDateString = '';
  //     }
  //   });
  //   return ports;
  // }
  
  ConvertDate(date?: Date){
    return(date ? new Date(date).toLocaleString() : '');
  }

}
