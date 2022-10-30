import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@microsoft/signalr';
import { throwError } from 'rxjs';
import { FinancialPage } from '../Common/FinancialPage';
import { Trade } from '../Models/Trade';
import { WatchItem } from '../Models/WatchItem';
import { TickerService } from '../Services/ticker-service.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent extends FinancialPage implements OnInit {

  public trades: Trade[] = [];
  @Input() watchList: WatchItem[] = [];

  constructor(private tickerService: TickerService) { 
    super();

    let trade1: Trade = {
      symbol: 'M',
      exchange: 'NYSE',
      price: 26.74,
      conditions: ['v'],
      tradeId: 50002,
      size: 200,
      timestampUtc: new Date(),
      tape: 'tape1'
    };
    let trade2: Trade = {
      symbol: 'SNAP',
      exchange: 'NASDAQ',
      price: 43.55,
      conditions: ['v'],
      tradeId: 7985423,
      size: 50,
      timestampUtc: new Date(),
      tape: 'tape1'
    }
    let trade3: Trade = {
      symbol: 'SPCE',
      exchange: 'NASDAQ',
      price: 9.00,
      conditions: ['v'],
      tradeId: 53450,
      size: 400,
      timestampUtc: new Date(),
      tape: 'tape1'
    };
    let trade4: Trade = {
      symbol: 'O',
      exchange: 'NYSE',
      price: 46.20,
      conditions: ['v'],
      tradeId: 53450,
      size: 800,
      timestampUtc: new Date(),
      tape: 'tape1'
    };
    let trade5: Trade = {
      symbol: 'DASH',
      exchange: 'NYSE',
      price: 49.53,
      conditions: ['v'],
      tradeId: 50,
      size: 900,
      timestampUtc: new Date(),
      tape: 'tape1'
    };
    let trade6: Trade = {
      symbol: 'OCGN',
      exchange: 'NYSE',
      price: 5.62,
      conditions: ['v'],
      tradeId: 200,
      size: 1200,
      timestampUtc: new Date(),
      tape: 'tape1'
    };
   // this.trades.push(trade1, trade2, trade3, trade4, trade5, trade6);
  }

  ngOnInit(): void {
    console.log('ticker watchlist being initialized from within watchlist component');

    // Add safe, URL encoded search parameter if there is a search term
    this.tickerService.addQuoteListener();
    let api$ = this.tickerService.callApi();
    let apiSub = api$.subscribe({
      next: (val) => { console.log(`Watchlist api call complete for setting up signalR realtime: ${val}`); },
      error: (error: HttpErrorResponse) => { 
        this.trades.push( { symbol: error.error, timestampUtc: new Date(), exchange: '', size: -1, tradeId: 0, conditions: [''], price: 0, tape: '' } as Trade); 
        console.log(`Watchlist api call ERROR while setting up signalR realtime: ${error} : ${error.error}`);
      },
    });

    let bufferedSub = this.tickerService.bufferedQuoteObservable$.subscribe({
      next: (quoteArray) => {
        //TODO: fix this
        if(quoteArray.length < 1 && this.trades[0].size === -1){
          throw('market is closed!');
        }
        console.log('consuming array: ', quoteArray);
        this.trades = quoteArray.map((trade) => this.MarkAsUpOrDown(trade));
      },
      error: (error) => {console.log(error);},
      complete: () => {console.log("done listening to ticker service's observable");}
    })

    this.subscriptions.push(apiSub);
    this.subscriptions.push(bufferedSub);
  }

  private MarkAsUpOrDown(quote: Trade){
    let watchItem = this.watchList.find(watchItem => watchItem.symbol===quote.symbol)
    
    if(watchItem && watchItem.previousClose){
      quote.isUp = (quote.price >= watchItem.previousClose) ? true : false;
    }

    return quote;
  }
  
}
