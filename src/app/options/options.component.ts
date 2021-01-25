import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionsDataService } from '../Services/options-data.service';
import { Option } from '../Models/Option';
import { HoldingService } from '../Services/holding-data.service';
import { OrderConstants, SecurityConstants } from '../Models/Constants';
import { Holding } from '../Models/Holding';


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public errorMsg: string = "";
  public expiryDates: string[] = [];
  public optionChain: Option[] = [];
  public callChain: Option[] = [];
  public putChain: Option[] = [];
  public chooseMsg: string = '';
  public selectedOption: Option | undefined = <Option>{};

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
      Validators.required
    ])
  });

  constructor(private location: Location, private optionsDataService: OptionsDataService, private holdingService: HoldingService) { }

  get optionSymbolControl() { return this.optionsForm.get('optionSymbolControl'); }

  get optionExpiryControl() { return this.optionsForm.get('optionExpiryControl'); }

  get orderNameControl() { return this.orderForm.get('orderNameControl'); }

  get orderStrikeControl() { return this.orderForm.get('orderStrikeControl'); }

  get orderExpControl() { return this.orderForm.get('orderExpControl'); }

  get orderQuantityControl() { return this.orderForm.get('orderQuantityControl'); }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }

  messageClick() {
    this.errorMsg = '';
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
    let sub: Subscription = new Subscription();

    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    sub = this.optionsDataService.getExpiryDates(symbol).subscribe(
      (dates) => {
        this.expiryDates = dates;
        this.chooseMsg = "Choose an Exp.Date";
      },
      (error) => {
        console.log('(component)Error getting options expiry dates: ', error);
        this.errorMsg = `${error.error}`;
      },
      () => {"(component)Option Expiry Dates complete"}
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
        this.callChain = chain.filter(o => o.side=="call");
        this.putChain = chain.filter(o => o.side=="put");
      },
      (error) => {
        console.log('(component)Error getting options chain: ', error);
        this.errorMsg = `${error.error}`;
      },
      () => {"(component)Option Chain retrieved"}
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

    // let optionHolding: Holding = {
    //   orderType: OrderConstants.Buy,
    //   strikePrice: this.selectedOption?.strikePrice,
    //   contractName: this.selectedOption?.id,
    //   symbol: this.selectedOption!.symbol,
    //   quantity: this.orderQuantityControl?.value,
    //   expirationDate: this.orderExpControl?.value,
    //   securityType: this.selectedOption!.side,
    //   reinvestDivs: false,
    //   currentPrice: this.selectedOption!.ask,
    //   costBasis: this.selectedOption!.ask

    // };
  }

}
