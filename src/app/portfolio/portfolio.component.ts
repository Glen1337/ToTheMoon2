import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { of, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Holding } from '../Models/Holding';
import { HoldingService } from '../Services/holding-data.service';
import { OrderConstants, SecurityConstants } from '../Models/Constants';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {

  public portfolio = <Portfolio>{};
  portfolioId: number = 0;
  subscriptions: Subscription[] = [];

  public holdingForm = new FormGroup({
    holdingSymbolControl: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(8)
    ]),
    holdingQuantityControl: new FormControl('', [
      Validators.required,
      Validators.min(1.00)
    ]),
    holdingDividendControl: new FormControl('')
  });

  constructor(private location: Location, private route: ActivatedRoute, private holdingService: HoldingService) {

  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();
    subscription1 = this.route.data.subscribe(
      (data) => {
        data.portfolio.holdings = this.AddDateStringsToHoldings(data.portfolio.holdings);
        this.portfolio = data.portfolio
      },
      (error) => {
        console.log(`Error getting portfolio:${error}`);
        return of([]);
      },
      () => { console.log("Portfolio retrieved"); }
    );

    this.subscriptions.push(subscription1)
  }

  get symbolControl() { return this.holdingForm.get('holdingSymbolControl'); }

  get quantityControl() { return this.holdingForm.get('holdingQuantityControl'); }

  get dividendControl() { return this.holdingForm.get('holdingDividendControl'); }

  goBack(): void {
    this.location.back();
  }

  onSubmitHolding(): void {
    let subscription2: Subscription = new Subscription();

    let holding: Holding = {
      costBasis: 0,
      currentPrice: 0,
      quantity: this.quantityControl?.value,
      reinvestDivs: this.dividendControl?.value ? true : false,
      symbol: String(this.symbolControl?.value).trim(),
      portfolioId: this.portfolio.portfolioId,
      orderType: OrderConstants.Buy,
      securityType: SecurityConstants.Share
    }
    console.log("Sending buy order to API: " + holding);
    
    subscription2 = this.holdingService.addHolding(holding).subscribe(
      (returnedHolding) => { 
        returnedHolding = this.AddDateStringsToHolding(returnedHolding);
        this.portfolio.holdings.push(returnedHolding);
      },
      (error) => {
        console.log('Error in onSubmitHolding ' + error);
        return of([]);
      },
      () => { console.log(`holding add complete`); }
    );

    this.subscriptions.push(subscription2)
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  }

  private AddDateStringsToHoldings(holdings: Holding[]): Holding[] {
    holdings.forEach(holding => {
      if(holding.transactionDate) {
        holding.transactionDateString = new Date(holding.transactionDate!).toLocaleString();
      } else {
        holding.transactionDateString = '';
      }
    });
    return holdings;
  }

  private AddDateStringsToHolding(holding: Holding): Holding {
    if (holding.transactionDate) {
      holding.transactionDateString = new Date(holding.transactionDate!).toLocaleString();
    } else {
      holding.transactionDateString = '';
    }
    return holding;
  }

  financialifyNumber(input: number, prependSymbol: string = '', addSign: boolean = false,) {
    let nombre: number = parseFloat(input.toFixed(2));
  
    if (nombre > 0) {
      return `${(addSign ? '+' : '')}${prependSymbol}${nombre.toLocaleString()}`;
    }
    if (nombre < 0) {
      return `${(addSign ? '-' : '')}${prependSymbol}${Math.abs(nombre).toLocaleString()}`;
    } else {
      return `${prependSymbol}0`;
    }
  }

}
