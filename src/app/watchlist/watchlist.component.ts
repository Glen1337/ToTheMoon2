import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WatchlistService } from '../Services/watchlist.service';
import { WatchItem } from '../Models/WatchItem';
import { OutlookConstants } from '../Models/Constants';
import { ActivatedRoute } from '@angular/router';
import { messageEnabled } from '../Common/message-enabled';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent extends messageEnabled implements OnInit, OnDestroy{

  subscriptions: Subscription[] = [];
  public errorMsg: string = '';
  public refreshMsg: string = '';
  public dropDownOptions = [OutlookConstants.Positive, OutlookConstants.Negative];
  public watchList: WatchItem[] = [];

  public watchItemForm = new FormGroup({
    watchItemSymbolControl: new FormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ]),
    watchItemOutlookControl: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute, public location: Location, private watchListService: WatchlistService) {
    super();
  }

  get watchItemSymbolControl(): AbstractControl | null { return this.watchItemForm.get('watchItemSymbolControl'); }
  get watchItemOutlookControl(): AbstractControl | null  { return this.watchItemForm.get('watchItemOutlookControl'); }

  ngOnInit(): void {
    let sub: Subscription = new Subscription();
    sub = this.route.data.subscribe({
      next: (data) => {
        this.watchList = data.watchList;
        console.log(data.watchList);
        if (!data.watchList.length){
          // this.errorMsg = "Could not retrieve watchlist from server"
        }
      },
      error: (error) => {
        console.log(`(component)Error getting watchlist:${error}`);
        this.errorMsg = error.error;
      },
      complete: () => { console.log('Completed retrieval of watchlist'); }
    });
    this.subscriptions.push(sub);
  }

  Select(event: any): void {
    // console.log(event.target.value);
  }

  messageClick(): void {
    this.refreshMsg = '';
    this.errorMsg = '';
  }

  onSubmitWatchItem(): void{
    let sub: Subscription = new Subscription();
    console.log('Adding item to watchlist: ', this.watchItemSymbolControl?.value.trim().toUpperCase());
    console.log(this.watchItemOutlookControl?.value);

    let watchItem: WatchItem = {
      outlook : this.watchItemOutlookControl?.value,
      symbol : this.watchItemSymbolControl?.value
    };

    sub = this.watchListService.addWatchItem(watchItem).subscribe({
      next: (addedWatchItem) => { this.watchList.push(addedWatchItem); },
      error: (error) => {
        console.log('(component)Error in watchlist submit:', error);
        this.errorMsg = `${error.error}`;
      },
      complete: () => {
        console.log('(component)watch item added to watchlist');
        this.refreshMsg = `${watchItem.symbol.trim().toUpperCase()} added to watchlist`;
      }
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

  isPredictionCorrect(item: WatchItem): boolean {
    return ((item.priceChange! >= 0 && item.outlook === 'Positive') || (item.priceChange! <= 0 && item.outlook === 'Negative'));
  }

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    location.reload();
  }

}
