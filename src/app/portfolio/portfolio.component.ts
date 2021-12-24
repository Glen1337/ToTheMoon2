import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { Observable, Subscription } from 'rxjs';
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

  private subscriptions: Subscription[] = [];
  public portfolio: Portfolio = {} as Portfolio;
  public errorMsg: string = '';
  public refreshMsg: string = '';
  public buyingPower: number = 0;

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

  messageClick(): void{
    this.refreshMsg = '';
    this.errorMsg = '';
  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();
    subscription1 = this.route.data.subscribe({
      next: (data) => {
        if (Object.keys(data.portfolio).length === 0) {
          this.errorMsg = 'Could not load Portfolio';
        }else {
          // data.portfolio.holdings = data.portfolio.holdings;
          this.buyingPower = data.balance;
          this.portfolio = data.portfolio;
        }
      },
      error: (error) => {
        console.log(`(component)Error getting portfolio:${error}`);
        this.errorMsg = `${error.error}`;
      },
      complete: () => { console.log('Portfolio retrieved'); }
    });

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
      userId: '-1',
      costBasis: 0,
      currentPrice: 0,
      quantity: this.quantityControl?.value,
      reinvestDivs: this.dividendControl?.value ? true : false,
      symbol: String(this.symbolControl?.value).trim().toUpperCase(),
      portfolioId: this.portfolio.portfolioId,
      orderType: OrderConstants.Buy,
      securityType: SecurityConstants.Share
    };
    console.log('(component)Sending order to API: ', holding);

    // is holding in list of holdings already?
    let found = this.portfolio.holdings.find(existingHolding => existingHolding.symbol === holding.symbol);

    if (found) {
      holding.holdingId = found.holdingId;
      order$ = this.holdingService.updateHolding(holding, found.holdingId!)
    } else {
      order$ = this.holdingService.addHolding(holding);
    }

    sub = order$.subscribe({
      next: (returnedHolding) => {
        if (!found) {
          this.portfolio.holdings.push(returnedHolding);

          let totalMarketValueAddition = 0;
          let buyingPowerSubtraction = 0;

          totalMarketValueAddition = (returnedHolding.quantity * returnedHolding.costBasis);
          buyingPowerSubtraction = totalMarketValueAddition;

          if (returnedHolding.securityType === SecurityConstants.Call || returnedHolding.securityType === SecurityConstants.Put){
            totalMarketValueAddition *= 100;
            buyingPowerSubtraction *= 100;
          }

          this.portfolio.totalMarketValue += totalMarketValueAddition;
          this.buyingPower -= buyingPowerSubtraction;
        }else{
          let index: number = this.portfolio.holdings.indexOf(found);
          let transactionPrice = (returnedHolding.quantity - this.portfolio.holdings[index].quantity) * returnedHolding.currentPrice;
          this.portfolio.totalMarketValue += transactionPrice;
          this.portfolio.holdings[index] = returnedHolding;

          this.buyingPower -= transactionPrice;
        }
      },
      error: (error) => {
        console.log('(component)Error in onSubmitHolding ', error);
        this.errorMsg = `${error.error}`;
      },
      complete: () => { console.log(`(component)holding add complete`); }
    });

    this.subscriptions.push(sub);
  }

  onDeleteHolding(event: any, holdingId: number): void {
    let sub: Subscription = new Subscription();

    sub = this.holdingService.deleteHolding(holdingId).subscribe({
      next: (response) => {
        console.log(`Holding deleted: ${holdingId}`);
        this.portfolio.holdings.forEach((holding, index) => {
          if (holding.holdingId === holdingId) {
            this.portfolio.holdings.splice(index, 1);
            if (holding.securityType === SecurityConstants.Call || holding.securityType === SecurityConstants.Put){
              this.portfolio.totalMarketValue -= (holding.quantity * holding.currentPrice) * 100;
              this.buyingPower += (holding.quantity * holding.currentPrice) * 100;
            }else{
              this.portfolio.totalMarketValue -= (holding.quantity * holding.currentPrice);
              this.buyingPower += (holding.quantity * holding.currentPrice);
            }
          }
        });
      },
      error: (error) => {
        this.errorMsg = `${error.error}`;
        console.log('(component)Error while deleting holding ', error);
      },
      complete: () => { console.log(`(component)deleting holding - complete`); }
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }
      });
    }
  }

  ConvertDate(date?: Date): string{
    return(date ? new Date(date).toLocaleString() : '');
  }
}
