import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OptionsDataService } from '../Services/options-data.service';
import { RefOption } from '../Models/Option';
import { HoldingService } from '../Services/holding-data.service';
import { OrderConstants, SecurityConstants } from '../Models/Constants';
import { Holding } from '../Models/Holding';
import { PortfolioDataService } from '../Services/portfolio-data.service';
import { ActivatedRoute } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';
import { formatDate, Location } from '@angular/common';
import { FiFormatPipe } from '../Utilities/fi-format.pipe';
import { FinancialPage } from '../Common/FinancialPage';
import { DateConverter } from '../Utilities/DateConverter';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
  providers: [FiFormatPipe]
})
export class OptionsComponent extends FinancialPage implements OnInit, OnDestroy {

  public expiryDates: string[] = [];
  //public optionChainByExp: Chain = {} as Chain;
  public optionChain: RefOption[] = [];
  public callSideChain: RefOption[] = [];
  public putSideChain: RefOption[] = [];
  public selectedOption: RefOption | undefined = {} as RefOption;
  public portfolios: Portfolio[] = [];
  public currentlyLoadingChain: boolean = false;

  public optionsForm = new FormGroup({
    optionSymbolControl: new FormControl('', {
      validators: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(8)
      ],
      nonNullable: true
    }),
    optionExpiryControl: new FormControl('', {
      validators: [
      Validators.required
      ],
      nonNullable: true
    })
  });

  public orderForm = new UntypedFormGroup({
    orderNameControl: new UntypedFormControl('', [
      Validators.required
    ]),
    orderStrikeControl: new UntypedFormControl('', [
      Validators.required
    ]),
    orderExpControl: new UntypedFormControl('', [
      Validators.required
    ]),
    orderQuantityControl: new UntypedFormControl(1, [
      Validators.required,
      Validators.min(1)
    ]),
    orderPortfolioControl: new UntypedFormControl('', [
      Validators.required
    ])
  });

  constructor(public location: Location,
    private optionsDataService: OptionsDataService,
    private holdingService: HoldingService,
    private route: ActivatedRoute,
    private fiFormat: FiFormatPipe,
    public dateConverter: DateConverter) {
      super(); 
      this.optionExpiryControl?.disable();
  }

  get optionSymbolControl() { return this.optionsForm.get('optionSymbolControl')!; }

  get optionExpiryControl() { return this.optionsForm.get('optionExpiryControl')!; }

  get orderNameControl(): AbstractControl | null { return this.orderForm.get('orderNameControl'); }

  get orderStrikeControl(): AbstractControl | null { return this.orderForm.get('orderStrikeControl'); }

  get orderExpControl(): AbstractControl | null { return this.orderForm.get('orderExpControl'); }

  get orderQuantityControl(): AbstractControl | null { return this.orderForm.get('orderQuantityControl'); }

  get orderPortfolioControl(): AbstractControl | null { return this.orderForm.get('orderPortfolioControl'); }

  ngOnInit(): void {
    let sub: Subscription = new Subscription();

    sub = this.route.data.subscribe({
      next: (data) => {
        this.portfolios = data.portfolios;
      },
      error: (error) => {
        console.log(`(component)Error getting portoflios for options page: ${error}`);
        this.errorMsg = `${error.error.title}`;
      },
      complete: () => { 
        console.log('(component)portfolios retrieved for options component');
      }
    });
  }

  public onExpiryChange(input: string): void{
    this.submitForm();
  }

  public getExpirys(): void {
    this.currentlyLoadingChain = true;
    let sub: Subscription = new Subscription();
    let symbol = this.optionSymbolControl!.value.trim().toUpperCase();
    sub = this.optionsDataService.getExpirys(symbol).subscribe({
      next: (exps) => {
        this.expiryDates = exps;
        this.currentlyLoadingChain = false;
        this.optionExpiryControl?.enable();
        //this.optionChainByExp.optionsByExp = chainByExp;
        ///console.log(Object.keys(chainByExp));
        // Array.prototype.forEach.call(this.optionChainByExp.optionsByExp, optionsForDate =>{
        //   expirys.push(optionsForDate.key);
        //  // this.expiryDates.push(optionsForDate.key);
        //   console.log(optionsForDate);
        // });
        // Array.prototype.forEach.call(chainByExp, (optionsForDate) =>{
        //   expirys.push(optionsForDate.key);
        //  // this.expiryDates.push(optionsForDate.key);
        //   console.log(optionsForDate);
        // });
        //this.expiryDates = expirys;
        //console.log(expirys);
        //this.optionChainByExp.optionsByExp.map(function(a){return a.key; });
        //this.expiryDates = this.optionChainByExp.optionsByExp. map(function(a) {return a.key; });
        // this.chooseMsg = "Choose an Exp. Date";
      },
      error: (error) => {
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
        this.currentlyLoadingChain = false;
      },
      complete: () => {
        '(component)Option chain retrieval complete';
        this.currentlyLoadingChain = false;
      }
    });
    this.subscriptions.push(sub);
  }

  // public getExpirys(): void {
  //   this.currentlyLoadingChain = true;
  //   let sub: Subscription = new Subscription();
  //   let expirys: string[] = [];
  //   let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
  //   sub = this.optionsDataService.getOptionsChainByExp(symbol).subscribe(
  //     (chainByExp) => {
  //       this.optionChainByExp.optionsByExp = chainByExp;
  //       console.log(Object.keys(chainByExp));
  //       Array.prototype.forEach.call(this.optionChainByExp.optionsByExp, optionsForDate =>{
  //         expirys.push(optionsForDate.key);
  //        // this.expiryDates.push(optionsForDate.key);
  //         console.log(optionsForDate);
  //       });
  //       Array.prototype.forEach.call(chainByExp, (optionsForDate) =>{
  //         expirys.push(optionsForDate.key);
  //        // this.expiryDates.push(optionsForDate.key);
  //         console.log(optionsForDate);
  //       });
  //       this.currentlyLoadingChain = false;
  //       //this.expiryDates = expirys;
  //       //console.log(expirys);
  //       //this.optionChainByExp.optionsByExp.map(function(a){return a.key; });
  //       //this.expiryDates = this.optionChainByExp.optionsByExp. map(function(a) {return a.key; });
  //       // this.chooseMsg = "Choose an Exp. Date";
  //     },

  public submitForm(): void {
    this.currentlyLoadingChain = true;

    let sub: Subscription = new Subscription();

    let symbol: string = this.optionSymbolControl.value.trim().toUpperCase();
    let expiry: string = this.optionExpiryControl.value.trim().replace('-','');

    sub = this.optionsDataService.getChain(symbol, expiry).subscribe({
      next: (chain) => {
        this.currentlyLoadingChain = false;
        this.optionChain = chain;
        this.callSideChain = chain.filter(o => o.side === SecurityConstants.Call ).sort((n1, n2) =>  n1.strike - n2.strike);
        this.putSideChain = chain.filter(o => o.side === SecurityConstants.Put).sort((n1, n2) =>  n1.strike - n2.strike);
      },
      error: (error) => {
        this.currentlyLoadingChain = false;
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
      },
      complete: () => {
        this.currentlyLoadingChain = false;
        console.log('(component)Option Chain retrieved');
      }
    });
    this.subscriptions.push(sub);
  }

  public choose(event: any, symbol: string): void {
    this.selectedOption = this.optionChain.find(option => option.symbol === symbol);
    console.log(this.selectedOption?.symbol);
    if (this.selectedOption) {
      this.orderNameControl?.setValue(this.selectedOption.symbol);
      this.orderStrikeControl?.setValue(this.fiFormat.transform(this.selectedOption.strike, '$', '', false, true));
      this.orderExpControl?.setValue(this.dateConverter.formatDate(this.selectedOption.expirationDate));
    }
  }

  public submitOrder(): void {
    let sub: Subscription = new Subscription();

    // let year = this.orderExpControl?.value.substr(0, 4);
    // let month = this.orderExpControl?.value.substr(4, 2);
    // let day = this.orderExpControl?.value.substr(6, 2);
    let expiration = new Date(this.selectedOption!.expirationDate);
    // let date: Date = new Date(`${year}-${month}-${day}`);

    let optionHolding: Holding = {
      //userId: '-1',
      orderType: OrderConstants.Buy,
      strikePrice: this.selectedOption?.strike,
      contractName: this.selectedOption?.symbol,
      symbol: this.selectedOption!.underlying,
      quantity: this.orderQuantityControl?.value,
      expirationDate: expiration,
      securityType: this.selectedOption!.side,//(this.selectedOption?.side.toLowerCase().trim() === 'call' ) ? SecurityConstants.Call : SecurityConstants.Put,
      reinvestDivs: false,
      currentPrice: this.selectedOption!.currentMarketPrice,
      costBasis: this.selectedOption!.currentMarketPrice,
      portfolioId: this.orderPortfolioControl?.value
    };

    sub = this.holdingService.addHolding(optionHolding).subscribe({
      next: (data) => { console.log(data);
        this.noticeMsg = 'Option purchased';
      },
      error: (error) => {
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
      },
      complete: () => {'(component)Option added'; }
    });
    this.subscriptions.push(sub);
  }

  // public displayExpirationDate(input: string): string {
  //   let output = input.toLocaleString();
  //   return output;
  // }
}
