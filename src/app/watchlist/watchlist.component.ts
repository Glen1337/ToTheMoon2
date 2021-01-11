import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent{

  subscriptions: Subscription[] = [];
  public errorMsg: string = '';
  public refreshMsg: string = '';

  public watchItemForm = new FormGroup({
    watchItemSymbolControl: new FormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ])
  })
  
  constructor(private location: Location) { }

  messageClick() {
    this.refreshMsg = '';
    this.errorMsg = '';
  }

  onSubmitWatchItem(){
    let sub: Subscription = new Subscription();

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
