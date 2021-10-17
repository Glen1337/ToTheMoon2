import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WatchItem } from '../Models/WatchItem';
import { TickerService } from '../Services/ticker-service.service';
import { WatchlistService } from '../Services/watchlist.service';

@Component({
  selector: 'ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit, OnDestroy {

  private url = 'https://cloud-sse.iexapis.com/stable/stocksUS5Second?token=sk_228dd2709a5341768a6920468437f264&symbols=snap';
  public watchList: WatchItem[] = [];
  private subscriptions: Subscription[] = []

  constructor(private watchlistService: WatchlistService, private tickerService: TickerService) { }

  ngOnInit(): void {
    let sub1 = this.watchlistService.getWatchList().
    subscribe(
      (response) => {
        this.watchList = response;
        this.tickerService.getServerSentEvent(this.url).
        subscribe(
          data => console.log(data)
        );
      },
      (error) => {
        console.log('(component)Error getting watchlist for ticker', error);
      },
      () => { console.log('(component) watchlist retrieved for ticker');}
    )
    this.subscriptions.push(sub1)
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }
      });
    }
  }

}
