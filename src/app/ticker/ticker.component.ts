import { Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, map, retry, Subscription } from 'rxjs';
import { FinancialPage } from '../Common/FinancialPage';
import { WatchItem } from '../Models/WatchItem';
import { TickerService } from '../Services/ticker-service.service';
import { WatchlistService } from '../Services/watchlist.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent extends FinancialPage implements OnInit, OnDestroy {

  private url = 'https://cloud-sse.iexapis.com/stable/stocksUS5Second?token=sk_228dd2709a5341768a6920468437f264&symbols=snap';
  public watchList: WatchItem[] = [];
  private baseUrl = environment.baseApiUrl;

  constructor(private watchlistService: WatchlistService, private tickerService: TickerService, private http: HttpClient) { 
    super();
  }

  ngOnInit(): void {

    // Add safe, URL encoded search parameter if there is a search term
    let stocks: string[] = []


    this.tickerService.startConnection();
    this.tickerService.addQuoteListener();


    this.http.get(`${this.baseUrl}watchitems/realtime`).subscribe(res => {
      console.log(res);
    });

    // this.watchlistService.getWatchList().pipe(
    //   //pluck(x => x.symbol),
    //   map(x => x.map(watchItem => watchItem.symbol)),
    //   retry(2)
    // ).subscribe(watchItems => {
    //   let stocks = encodeURIComponent(JSON.stringify(watchItems));
    //   let options = { params: new HttpParams().set('stocks', stocks) };

    // });
    

  

    // let sub1 = this.watchlistService.getWatchList().
    // subscribe({
    //   next: (response) => {
    //     this.watchList = response;
    //     this.tickerService.getServerSentEvent(this.url).
    //     subscribe(
    //       data => console.log(data)
    //     );
    //   },
    //   error: (error) => {
    //     console.log('(component)Error getting watchlist for ticker', error);
    //   },
    //   complete: () => { console.log('(component) watchlist retrieved for ticker');}
    // })
    // this.subscriptions.push(sub1)
  }

}
