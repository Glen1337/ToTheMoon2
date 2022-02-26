import { Component, Input, OnInit } from '@angular/core';
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
  public tradeBuffer: Trade[] = [];
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

    // Add safe, URL encoded search parameter if there is a search term
    this.tickerService.addQuoteListener();
    this.tickerService.callApi();

    let bufferedSub = this.tickerService.bufferedQuoteObservable$.subscribe({
      next: (quoteArray) => {
        console.log('consuming array', quoteArray);
        quoteArray =  quoteArray.map((trade) => this.MarkAsUpOrDown(trade))
        this.trades = quoteArray;
      },
      error: (error) => {console.log(error);},
      complete: () => {console.log("done listening to ticker service's observable");}
    })

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
