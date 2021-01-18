import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionsDataService } from '../Services/options-data.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public errorMsg: string = "";

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

  public submitForm(): void{
    let symbol = this.optionSymbolControl?.value.trim().toUpperCase();
    this.optionsDataService.getExpiryDates(symbol).subscribe(expirations => {
      console.log(expirations);
    });

  }

}
