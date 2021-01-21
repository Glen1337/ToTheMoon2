import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionsDataService } from '../Services/options-data.service';
import { Option } from '../Models/Option';

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

  constructor(private location: Location, private optionsDataService: OptionsDataService) { }

  get optionSymbolControl() { return this.optionsForm.get('optionSymbolControl'); }

  get optionExpiryControl() { return this.optionsForm.get('optionExpiryControl'); }

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

  public getExpirys(): void {
    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    this.optionsDataService.getExpiryDates(symbol).subscribe(
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
  }

  public submitForm(): void {
    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    let expiry = this.optionExpiryControl?.value;
    this.optionsDataService.getOptionsChain(symbol, expiry).subscribe(
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
  }

  public choose(event: any, id: string){

  }

}
