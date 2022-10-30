import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';
import { PortfolioTypes, SecurityConstants } from '../Models/Constants';
import { FinancialPage } from '../Common/FinancialPage';
import { DateConverter } from '../Utilities/DateConverter';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent extends FinancialPage implements OnInit, OnDestroy {

  public portfolios: Array<Portfolio> = [];

  public portfolioForm = new FormGroup({
    portfolioTitleControl: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
      ],
      nonNullable: true
    }),
    portfolioTypeControl: new FormControl('', {
      validators: [
        Validators.min(1.00),
        Validators.maxLength(30),
        Validators.required
      ],
      nonNullable: true
    })
  });

  portfolioTypes = [
    PortfolioTypes.DayTrading,
    PortfolioTypes.Investment,
    PortfolioTypes.Retirement,
    PortfolioTypes.SwingTrading,
    PortfolioTypes.Other,
    PortfolioTypes.Speculation
  ];

  constructor(private route: ActivatedRoute, public location: Location, private portfolioDataService: PortfolioDataService, public dateConverter: DateConverter) {
    super();
  }

  get portfolioTitleControl() { return this.portfolioForm.get('portfolioTitleControl')!; }

  get portfolioTypeControl() { return this.portfolioForm.get('portfolioTypeControl')!; }

  ngOnInit(): void {
    let sub: Subscription = new Subscription();

    sub = this.route.data.subscribe({
      next: (data) => {
        this.portfolios = data.portfolios;
        if (data.portfolios.length === 0) {
        // this.errorMsg = "Could not retrieve portfolios from server"
        }
      },
      error: (error) => {
        console.log(`(component)Error getting portfolio list:${error}`);
        this.errorMsg = error.error;
      },
      complete: () => { console.log('Completed retrieval of portfolio list'); }
    });

    this.subscriptions.push(sub)
  }

  deletePortfolio(event: any, portfolioId: number): void {
    let subscription3: Subscription = new Subscription();
    subscription3 = this.portfolioDataService.deletePortfolio(portfolioId).subscribe({
      next: (response) => {
        this.portfolios.forEach((port, index) => {
          if (port.portfolioId === portfolioId) {
            this.portfolios.splice(index, 1);
          }
        });
        console.log(`Portfolio deleted: ${portfolioId}`);
      },
      error: (error) => {
        this.errorMsg = `${error.error}`;
        console.log('(component)Error in deletePortfolio ', error);
      },
      complete: () => { console.log(`(component)Delete Portfolio complete`); }
    });

    this.subscriptions.push(subscription3);
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
    };

    console.log('(component)Sending portfolio post to API: ', port);

    subscription2 = this.portfolioDataService.addPortfolio(port).subscribe({
      next: (returnedPort) => { this.portfolios.push(returnedPort); },
      error: (error) => {
        console.log('(component)Error in onSubmitPortfolio: ', error);
        this.errorMsg = `${error.error}`;
      },
      complete: () => { console.log(`addportfolio completed`); }
    });
    this.subscriptions.push(subscription2);
  }

  GetOptionCount(id: number) {
    return this.portfolios.find(port => port.portfolioId === id)?.holdings.filter(h => h.securityType === SecurityConstants.Call || h.securityType === SecurityConstants.Put).length;
  }

  GetEquityCount(id: number) {
    return this.portfolios.find(port => port.portfolioId === id)?.holdings.filter(h => h.securityType === SecurityConstants.Share).length;
  }

}
