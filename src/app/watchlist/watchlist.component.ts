import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { WatchlistService } from '../Services/watchlist.service';
import { WatchItem } from '../Models/WatchItem';
import { OutlookConstants } from '../Models/Constants';
import { ActivatedRoute } from '@angular/router';
import { FinancialPage } from '../Common/FinancialPage';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent extends FinancialPage implements OnInit, OnDestroy{

  public dropDownOptions = [OutlookConstants.Positive, OutlookConstants.Negative];
  public watchList: WatchItem[] = [];

  public watchItemForm = new UntypedFormGroup({
    watchItemSymbolControl: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ]),
    watchItemOutlookControl: new UntypedFormControl('', [Validators.required])
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
        //console.log(data.watchList);
        if (!data.watchList.length){
          this.errorMsg = "Could not retrieve watchlist from server"
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
        console.log('(component)Error in watchlist submit:', error.message);
        this.errorMsg = `${error.message}`;
      },
      complete: () => {
        console.log('(component)watch item added to watchlist');
        this.noticeMsg = `${watchItem.symbol.trim().toUpperCase()} added to watchlist`;
      }
    });

    this.subscriptions.push(sub);
  }

  isPredictionCorrect(item: WatchItem): boolean {
    return ((item.priceChange! >= 0 && item.outlook === 'Positive') || (item.priceChange! <= 0 && item.outlook === 'Negative'));
  }

}
