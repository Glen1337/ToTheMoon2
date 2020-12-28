import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Holding } from '../Models/Holding';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {

  public portfolio = <Portfolio>{};
  portfolioId: number = 0;
  subscription1: Subscription = new Subscription;
  subscriptions: Subscription[] = [];

  public holdingForm = new FormGroup({
    holdingSymbolControl: new FormControl('',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(8)
      ]),
    holdingQuantityControl: new FormControl('',
      [
        Validators.required,
        Validators.min(1.00)
      ]),
    holdingDividendControl: new FormControl('')
  });

  constructor(http: HttpClient,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription1 = this.route.data.subscribe( data => {
      //console.log(data);
      this.portfolio = data.portfolio
    },
    (error) => {
      console.log(`Error getting portfolio:${error}`);
    });

    this.subscriptions.push(this.subscription1)
    //this.subscriptions.push(this.subscription2)
  }

  get symbolControl() { return this.holdingForm.get('holdingSymbolControl'); }

  get quantityControl() { return this.holdingForm.get('holdingQuantityControl'); }

  get dividendControl() { return this.holdingForm.get('holdingDividendControl'); }

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

  onSubmitHolding() {
    let holding: Holding = {
      quantity: this.quantityControl?.value,
      reinvestDivs: this.dividendControl?.value,
      symbol: this.symbolControl?.value,
      portfolioId: this.portfolioId,
      orderType: 'Buy',
      securityType: 'Share'
    }
    console.log("Sending buy order to API: " + holding);
  }

}
