import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionsDataService } from '../Services/options-data.service';
import { Option } from '../Models/Option';
import { HoldingService } from '../Services/holding-data.service';
import { OrderConstants, SecurityConstants } from '../Models/Constants';
import { Holding } from '../Models/Holding';
import { PortfolioDataService } from '../Services/portfolio-data.service';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public errorMsg: string = "";
  public otherMsg = "";
  public expiryDates: string[] = [];
  public optionChain: Option[] = [];
  public callChain: Option[] = [];
  public putChain: Option[] = [];
  // public chooseMsg: string = '';
  public selectedOption: Option | undefined = <Option>{};
  public portfolios: Portfolio[] = [];
  public currentlyLoadingExps: boolean = false;

  public optionsForm = new FormGroup({
    optionSymbolControl: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(8)
    ]),
    optionExpiryControl: new FormControl('',[
      Validators.required
    ])
  });

  public orderForm = new FormGroup({
    orderNameControl: new FormControl('',[
      Validators.required
    ]),
    orderStrikeControl: new FormControl('',[
      Validators.required
    ]),
    orderExpControl: new FormControl('',[
      Validators.required
    ]),
    orderQuantityControl: new FormControl(1, [
      Validators.required,
      Validators.min(1)
    ]),
    orderPortfolioControl: new FormControl('', [
      Validators.required
    ])
  });

  constructor(private location: Location,
    private optionsDataService: OptionsDataService,
    private holdingService: HoldingService,
    private route: ActivatedRoute) { }

  get optionSymbolControl() { return this.optionsForm.get('optionSymbolControl'); }

  get optionExpiryControl() { return this.optionsForm.get('optionExpiryControl'); }

  get orderNameControl() { return this.orderForm.get('orderNameControl'); }

  get orderStrikeControl() { return this.orderForm.get('orderStrikeControl'); }

  get orderExpControl() { return this.orderForm.get('orderExpControl'); }

  get orderQuantityControl() { return this.orderForm.get('orderQuantityControl'); }

  get orderPortfolioControl() { return this.orderForm.get('orderPortfolioControl'); }

  ngOnInit(): void {
    let sub: Subscription = new Subscription();

    sub = this.route.data.subscribe(
      (data) =>{
        this.portfolios = data.portfolios;
      },
      (error) => {
        console.log(`(component)Error getting portoflios for options page: ${error}`);
        this.errorMsg = `${error.error.title}`;
      },
      () => { console.log("(component)portfolios retrieved for options component"); }
    );
  }

  goBack(): void {
    this.location.back();
  }

  messageClick() {
    this.errorMsg = '';
    this.otherMsg = '';
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }     
      });
    }
  } 

  public onExpiryChange(input: string){
    this.submitForm();
  }

  public getExpirys(): void {
    this.currentlyLoadingExps = true;
    let sub: Subscription = new Subscription();

    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    sub = this.optionsDataService.getExpiryDates(symbol).subscribe(
      (dates) => {
        this.expiryDates = dates;
        // this.chooseMsg = "Choose an Exp. Date";
      },
      (error) => {
        console.log('(component)Error getting options expiry dates: ', error);
        this.errorMsg = `${error.error}`;
      },
      () => {
        "(component)Option Expiry Dates complete";
        this.currentlyLoadingExps = false;
      }
    );
    this.subscriptions.push(sub)
  }

  public submitForm(): void {
    let sub: Subscription = new Subscription();

    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    let expiry = this.optionExpiryControl?.value;
    sub = this.optionsDataService.getOptionsChain(symbol, expiry).subscribe(
      (chain) => {
        this.optionChain = chain;
        this.callChain = chain.filter(o => o.side=="call").sort((n1, n2) =>  n1.strikePrice - n2.strikePrice);
        this.putChain = chain.filter(o => o.side=="put").sort((n1, n2) =>  n1.strikePrice - n2.strikePrice);
      },
      (error) => {
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
      },
      () => {
        "(component)Option Chain retrieved"
      }
    );
    this.subscriptions.push(sub)
  }

  public choose(event: any, id: string){
    this.selectedOption = this.optionChain.find(option => option.id === id);
    this.orderNameControl?.setValue(this.selectedOption?.id);
    this.orderStrikeControl?.setValue(this.selectedOption?.strikePrice);
    this.orderExpControl?.setValue(this.selectedOption?.expirationDate);
  }

  public submitOrder(): void {
    let sub: Subscription = new Subscription();

    let year = this.orderExpControl?.value.substr(0,4);
    let month = this.orderExpControl?.value.substr(4,2);
    let day = this.orderExpControl?.value.substr(6,2);

    let date: Date = new Date(`${year}-${month}-${day}`);

    let optionHolding: Holding = {
      orderType: OrderConstants.Buy,
      strikePrice: this.selectedOption?.strikePrice,
      contractName: this.selectedOption?.id,
      symbol: this.selectedOption!.symbol,
      quantity: this.orderQuantityControl?.value,
      expirationDate: date,
      securityType: this.selectedOption!.side,
      reinvestDivs: false,
      currentPrice: this.selectedOption!.ask,
      costBasis: this.selectedOption!.ask,
      portfolioId: this.orderPortfolioControl?.value
    };

    sub = this.holdingService.addHolding(optionHolding).subscribe(
      (data) => { console.log(data);
        this.otherMsg = 'Option purchased'
      },
      (error) => {
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
      },
      () => {"(component)Option added"}
    );
    this.subscriptions.push(sub);
  }

  refresh(): void {
    location.reload();
  }

  public formatDate(input: Date) : string{
    let inputDate: Date = new Date(input);
    return `${new Date(inputDate).getMonth()}/${new Date(inputDate).getDate()}/${new Date(inputDate).getFullYear()}`;
  }

}
