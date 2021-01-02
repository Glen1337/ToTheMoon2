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
  subscription2: Subscription = new Subscription();
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
     this.subscription1 = this.route.data.subscribe(data => {
      //console.log(data);
      this.portfolios = this.AddDateStringsToPorts(data.portfolios);
    },
    (error) => {
      console.log(`Error getting portfolio list:${error}`);
    });

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

    console.log("Sending portfolio post to API: ", port);

    this.subscription2 = this.portfolioDataService.addPortfolio(port)
      .subscribe(
        (returnedPort) => { 
          returnedPort = this.AddDateStringsToPort(returnedPort);
          this.portfolios.push(returnedPort);
        },
        (error) => { console.log('Error in onSubmitPortfolio: ' + error) },
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

  private AddDateStringsToPorts(ports: Portfolio[]): Portfolio[] {
    ports.forEach(port =>{
      if(port.creationDate) {
        port.creationDateString = new Date(port.creationDate!).toLocaleString();
      } else {
        port.creationDateString = '';
      }
    });
    return ports;
  }

  private AddDateStringsToPort(port: Portfolio): Portfolio {
    if (port.creationDate) {
      port.creationDateString = new Date(port.creationDate!).toLocaleString();
    } else {
      port.creationDateString = '';
    }
    return port;
  }

}
