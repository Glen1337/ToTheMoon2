import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { Observable, Subscription } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Holding } from '../Models/Holding';
import { HoldingService } from '../Services/holding-data.service';
import { MAX_STOCK_LENGTH, MIN_STOCK_LENGTH, OrderConstants, SecurityConstants } from '../Models/Constants';
import { FinancialPage } from '../Common/FinancialPage';
import { DateConverter } from '../Utilities/DateConverter';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent extends FinancialPage implements OnInit, OnDestroy {

  public portfolio: Portfolio = {} as Portfolio;
  public buyingPower: number = 0;

  get symbolControl() { return this.holdingForm.get('holdingSymbolControl'); }
  get quantityControl() { return this.holdingForm.get('holdingQuantityControl'); }
  get dividendControl() { return this.holdingForm.get('holdingDividendControl'); }

  public holdingForm = new UntypedFormGroup({
    holdingSymbolControl: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(MIN_STOCK_LENGTH),
      Validators.maxLength(MAX_STOCK_LENGTH)
    ]),
    holdingQuantityControl: new UntypedFormControl('', [
      Validators.required,
      Validators.min(1.00)
    ]),
    holdingDividendControl: new UntypedFormControl('')
  });

  constructor(public location: Location, private route: ActivatedRoute, private holdingService: HoldingService, public dateConverter: DateConverter) {
    super();
  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();
    subscription1 = this.route.data.subscribe({
      next: (data) => {
        if (Object.keys(data.portfolio).length === 0) {
          this.errorMsg = 'Could not load Portfolio';
        } else {
          this.buyingPower = data.balance;
          this.portfolio = data.portfolio;
          this.createChart();
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

  onSubmitHolding(): void {
    let sub: Subscription = new Subscription();
    let order$: Observable<Holding>;

    let holding: Holding = {
      //userId: '-1',
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
    let retrievedHolding = this.portfolio.holdings.find(existingHolding => existingHolding.symbol === holding.symbol);

    if (retrievedHolding) {
      holding.holdingId = retrievedHolding.holdingId;
      order$ = this.holdingService.updateHolding(holding, retrievedHolding.holdingId!)
    } else {
      order$ = this.holdingService.addHolding(holding);
    }

    sub = order$.subscribe({
      next: (returnedHolding) => {
        if (!retrievedHolding) {
          this.portfolio.holdings.push(returnedHolding);

          let holdingCost = 0;

          holdingCost = returnedHolding.quantity * returnedHolding.costBasis;

          if (returnedHolding.securityType === SecurityConstants.Call || returnedHolding.securityType === SecurityConstants.Put) {
            holdingCost *= 100;
          }

          this.portfolio.totalMarketValue += holdingCost;
          this.buyingPower -= holdingCost;
        } else {
          let index: number = this.portfolio.holdings.indexOf(retrievedHolding);
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
            if (holding.securityType === SecurityConstants.Call || holding.securityType === SecurityConstants.Put) {
              this.portfolio.totalMarketValue -= holding.quantity * holding.currentPrice * 100;
              this.buyingPower += holding.quantity * holding.currentPrice * 100;
            } else {
              this.portfolio.totalMarketValue -= holding.quantity * holding.currentPrice;
              this.buyingPower += holding.quantity * holding.currentPrice;
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

  public percentageOfPort(holding: Holding): number {
    let holdingValue = holding.quantity * holding.currentPrice;
    if (holding.securityType == SecurityConstants.Call || holding.securityType == SecurityConstants.Put) {
      holdingValue = holdingValue * 100;
    }
    if (this.portfolio.totalMarketValue == 0) {
      return 0;
    }
    return holdingValue / this.portfolio.totalMarketValue * 100;
  }

  private createChart(): void {

    let data = this.portfolio.holdings.map(holding => {
      return {
        x: `${holding.symbol} ${holding.contractName ? 'Option' : 'Shares'}`,
        value: this.percentageOfPort(holding)
      }
    });

    let chart = anychart.pie(data);

    chart.title(`Breakdown of ${this.portfolio.title}`);
    chart.background().fill('#9EBEE0');
    chart.container("container");
    chart.labels().position('inside');

    chart.draw();
  }

}
