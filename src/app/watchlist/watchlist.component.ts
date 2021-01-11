import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WatchlistService } from '../Services/watchlist.service';
import { WatchItem } from '../Models/WatchItem';
import { OutlookConstants } from '../Models/Constants';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent{

  subscriptions: Subscription[] = [];
  public errorMsg: string = '';
  public refreshMsg: string = '';
  public dropDownOptions = [OutlookConstants.Positive, OutlookConstants.Negative];

  public watchItemForm = new FormGroup({
    watchItemSymbolControl: new FormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ]),
    watchItemOutlookControl: new FormControl('',[Validators.required])
  })
  
  constructor(private location: Location, private watchListService: WatchlistService) { }

  get watchItemSymbolControl() { return this.watchItemForm.get('watchItemSymbolControl'); }
  get watchItemOutlookControl() { return this.watchItemForm.get('watchItemOutlookControl'); }

  Select(event: any): void {
    //console.log(event.target.value);
  }

  messageClick() {
    this.refreshMsg = '';
    this.errorMsg = '';
  }

  onSubmitWatchItem(){
    let sub: Subscription = new Subscription();
    console.log('Adding item to watchlist: ', this.watchItemSymbolControl?.value.trim().toUpperCase());
    console.log(this.watchItemOutlookControl?.value);
    // let watchItem: WatchItem = {

    // };
    this.subscriptions.push(sub)
  }

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

  refresh(): void {
    location.reload();
  }

}
