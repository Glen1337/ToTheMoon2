import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Holding } from '../Models/Holding';
import { HoldingService } from '../Services/holding-data.service';
import { OrderConstants, SecurityConstants } from '../Models/Constants';
import { financialifyNumber } from '../Utilities/utilities';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {

  public portfolio = <Portfolio>{};
  portfolioId: number = 0;
  subscriptions: Subscription[] = [];
  public financiafy: any;
  public errorMsg: string = "";

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
    this.financiafy = financialifyNumber;
  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();
    subscription1 = this.route.data.subscribe(
      (data) => {
        if (Object.keys(data.portfolio).length == 0) {
          this.errorMsg="Could not load Portfolio";
        }else {
          data.portfolio.holdings = data.portfolio.holdings;
          this.portfolio = data.portfolio
        }
      },
      (error) => {
        console.log(`(component)Error getting portfolio:${error}`);
      },
      () => { console.log("Portfolio retrieved"); }
    );

    this.subscriptions.push(subscription1);
  }

  get symbolControl() { return this.holdingForm.get('holdingSymbolControl'); }

  get quantityControl() { return this.holdingForm.get('holdingQuantityControl'); }

  get dividendControl() { return this.holdingForm.get('holdingDividendControl'); }

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    location.reload();
  }

  onSubmitHolding(): void {
    let sub: Subscription = new Subscription();
    let order$: Observable<Holding>;

    let holding: Holding = {
      costBasis: 0,
      currentPrice: 0,
      quantity: this.quantityControl?.value,
      reinvestDivs: this.dividendControl?.value ? true : false,
      symbol: String(this.symbolControl?.value).trim().toUpperCase(),
      portfolioId: this.portfolio.portfolioId,
      orderType: OrderConstants.Buy,
      securityType: SecurityConstants.Share
    }
    console.log("(component)Sending order to API: ", holding);

    // is holding in list of holdings already?
    let found = this.portfolio.holdings.find(existingHolding => existingHolding.symbol === holding.symbol);

    if (found) {
      holding.holdingId = found.holdingId;
      order$ = this.holdingService.updateHolding(holding, found.holdingId!)
    } else {
      order$ = this.holdingService.addHolding(holding)
    }

    sub = order$.subscribe(
      (returnedHolding) => {
        if (!found) {
          this.portfolio.holdings.push(returnedHolding);
        }else{
          let index: number = this.portfolio.holdings.indexOf(found);
          this.portfolio.holdings[index].quantity += Number(holding.quantity);
        }
      },
      (error) => {
        console.log('(component)Error in onSubmitHolding ', error);
        this.errorMsg = `Error: ${error.status}`
      },
      () => { console.log(`(component)holding add complete`); }
    );

    this.subscriptions.push(sub)
  }

  onDeleteHolding(event: any, holdingId: number) {
    let subscription3: Subscription = new Subscription();

    subscription3 = this.holdingService.deleteHolding(holdingId).subscribe(
      (response) => {
        console.log(`Holding deleted: ${holdingId}`);
        this.portfolio.holdings.forEach((holding, index) => {
          if(holding.holdingId === holdingId) this.portfolio.holdings.splice(index,1);
        });
      },
      (error) => { 
        this.errorMsg = `Error: ${error.status}`
        console.log('(component)Error while deleting holding ', error);
      },
      () => { console.log(`(component)deleting holding - complete`); }
    );

    this.subscriptions.push(subscription3)
  }

  ngOnDestroy(): void {
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
