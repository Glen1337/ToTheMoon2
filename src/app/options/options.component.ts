import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionsDataService } from '../Services/options-data.service';
import { RefOption } from '../Models/Option';
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
export class OptionsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public errorMsg: string = '';
  public otherMsg = '';
  public expiryDates: string[] = [];
  //public optionChainByExp: Chain = {} as Chain;
  public optionChain: RefOption[] = [];
  public callSideChain: RefOption[] = [];
  public putSideChain: RefOption[] = [];
  // public chooseMsg: string = '';
  public selectedOption: RefOption | undefined = {} as RefOption;
  public portfolios: Portfolio[] = [];
  public currentlyLoadingChain: boolean = false;

  public optionsForm = new FormGroup({
    optionSymbolControl: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(8)
    ]),
    optionExpiryControl: new FormControl('', [
      Validators.required
    ])
  });

  public orderForm = new FormGroup({
    orderNameControl: new FormControl('', [
      Validators.required
    ]),
    orderStrikeControl: new FormControl('', [
      Validators.required
    ]),
    orderExpControl: new FormControl('', [
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
              private route: ActivatedRoute) { 

              }

  get optionSymbolControl(): AbstractControl | null { return this.optionsForm.get('optionSymbolControl'); }

  get optionExpiryControl(): AbstractControl | null { return this.optionsForm.get('optionExpiryControl'); }

  get orderNameControl(): AbstractControl | null { return this.orderForm.get('orderNameControl'); }

  get orderStrikeControl(): AbstractControl | null { return this.orderForm.get('orderStrikeControl'); }

  get orderExpControl(): AbstractControl | null { return this.orderForm.get('orderExpControl'); }

  get orderQuantityControl(): AbstractControl | null { return this.orderForm.get('orderQuantityControl'); }

  get orderPortfolioControl(): AbstractControl | null { return this.orderForm.get('orderPortfolioControl'); }

  ngOnInit(): void {
    let sub: Subscription = new Subscription();

    sub = this.route.data.subscribe(
      (data) => {
        this.portfolios = data.portfolios;
      },
      (error) => {
        console.log(`(component)Error getting portoflios for options page: ${error}`);
        this.errorMsg = `${error.error.title}`;
      },
      () => { console.log('(component)portfolios retrieved for options component'); }
    );
  }

  goBack(): void {
    this.location.back();
  }

  messageClick(): void {
    this.errorMsg = '';
    this.otherMsg = '';
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      });
    }
  }

  public onExpiryChange(input: string): void{
    this.submitForm();
  }

  public getExpirys(): void {
    this.currentlyLoadingChain = true;
    let sub: Subscription = new Subscription();
    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    sub = this.optionsDataService.getExpirys(symbol).subscribe(
      (exps) => {
        this.expiryDates = exps;
        this.currentlyLoadingChain = false;
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
      (error) => {
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
        this.currentlyLoadingChain = false;
      },
      () => {
        '(component)Option chain retrieval complete';
        this.currentlyLoadingChain = false;
      }
    );
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

    let symbol: string = this.optionSymbolControl?.value.trim().toUpperCase();
    let expiry: string = this.optionExpiryControl?.value.trim().replaceAll('-','');

    sub = this.optionsDataService.getChain(symbol, expiry).subscribe(
      (chain) => {
        this.currentlyLoadingChain = false;
        this.optionChain = chain;
        this.callSideChain = chain.filter(o => o.side === 'call').sort((n1, n2) =>  n1.strike - n2.strike);
        this.putSideChain = chain.filter(o => o.side === 'put').sort((n1, n2) =>  n1.strike - n2.strike);
      },
      (error) => {
        this.currentlyLoadingChain = false;
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
      },
      () => {
        this.currentlyLoadingChain = false;
        console.log('(component)Option Chain retrieved');
      }
    );
    this.subscriptions.push(sub);
  }

  public choose(event: any, symbol: string): void{
     this.selectedOption = this.optionChain.find(option => option.symbol === symbol);
     console.log(this.selectedOption?.symbol);
    // if (this.selectedOption) {
    //   this.orderNameControl?.setValue(this.selectedOption.id);
    //   this.orderStrikeControl?.setValue(this.selectedOption.strikePrice);
    //   this.orderExpControl?.setValue(this.selectedOption.expirationDate);
    // }
  }

  public submitOrder(): void {
    // let sub: Subscription = new Subscription();

    // let year = this.orderExpControl?.value.substr(0, 4);
    // let month = this.orderExpControl?.value.substr(4, 2);
    // let day = this.orderExpControl?.value.substr(6, 2);

    // let date: Date = new Date(`${year}-${month}-${day}`);

    // let optionHolding: Holding = {
    //   userId: '-1',
    //   orderType: OrderConstants.Buy,
    //   strikePrice: this.selectedOption?.strikePrice,
    //   contractName: this.selectedOption?.id,
    //   symbol: this.selectedOption!.symbol,
    //   quantity: this.orderQuantityControl?.value,
    //   expirationDate: date,
    //   securityType: (this.selectedOption!.side.toLocaleLowerCase().trim() === 'call' ) ? SecurityConstants.Call : SecurityConstants.Put,
    //   reinvestDivs: false,
    //   currentPrice: this.selectedOption!.ask,
    //   costBasis: this.selectedOption!.ask,
    //   portfolioId: this.orderPortfolioControl?.value
    // };

    // sub = this.holdingService.addHolding(optionHolding).subscribe(
    //   (data) => { console.log(data);
    //               this.otherMsg = 'Option purchased';
    //   },
    //   (error) => {
    //     console.log('(component)Error getting options chain: ', error);
    //     this.errorMsg = `${error.error}`;
    //   },
    //   () => {'(component)Option added'; }
    // );
    // this.subscriptions.push(sub);
  }

  refresh(): void {
    location.reload();
  }

  public formatDate(input: Date): string{
    let inputDate: Date = new Date(input);
    return `${new Date(inputDate).getMonth()}/${new Date(inputDate).getDate()}/${new Date(inputDate).getFullYear()}`;
  }

}
