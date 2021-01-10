import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';

@Component({
  selector: 'portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {

  portfolios: Array<Portfolio> = [];
  subscriptions: Subscription[] = []
  public errorMsg: string = "";

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
    let subscription1: Subscription = new Subscription();

    subscription1 = this.route.data.subscribe(
      (data) => {
        this.portfolios = data.portfolios;
        if (data.portfolios.length === 0){
          this.errorMsg = "Could not retrieve portfolios from server"
        }
      },
      (error) => {
        console.log(`(component)Error getting portfolio list:${error}`);
        this.errorMsg = error.status;
      },
      () => { console.log("Completed retrieval of portfolio list");}
    );

    this.subscriptions.push(subscription1)
  }

  deletePortfolio(event: any, portfolioId: number){
    let subscription3: Subscription = new Subscription();
    subscription3 = this.portfolioDataService.deletePortfolio(portfolioId).subscribe(
      (response) => {
        this.portfolios.forEach((port, index) => {
          if(port.portfolioId === portfolioId) this.portfolios.splice(index,1);
        });
        console.log(`Portfolio deleted: ${portfolioId}`);
      },
      (error) => { 
        this.errorMsg = `Error: ${error.status}`
        console.log('(component)Error in deletePortfolio ', error);
      },
      () => { console.log(`(component)error deleting Portfolio`); }
    );
    
    this.subscriptions.push(subscription3)
  }

  onSubmitPortfolio(): void {
    let subscription2: Subscription = new Subscription();

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

    subscription2 = this.portfolioDataService.addPortfolio(port)
      .subscribe(
        (returnedPort) => { this.portfolios.push(returnedPort); },
        (error) => {
          console.log('(component)Error in onSubmitPortfolio: ', error);
          this.errorMsg = `Error: ${error.status}`;
        },
        () => { console.log(`addportfolio completed`); }
      );
    this.subscriptions.push(subscription2)
  }
    
  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  }

  ConvertDate(date?: Date){
    return(date ? new Date(date).toLocaleString() : '');
  }

}
