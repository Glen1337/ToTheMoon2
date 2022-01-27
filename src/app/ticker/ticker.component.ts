import { Component, Input, OnInit } from '@angular/core';
import { FinancialPage } from '../Common/FinancialPage';
import { Trade } from '../Models/Quote';
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
    this.trades.push(trade1, trade2, trade3, trade4, trade5, trade6);
  }

  ngOnInit(): void {

    // Add safe, URL encoded search parameter if there is a search term
    this.tickerService.addQuoteListener();
    this.tickerService.callApi();

    //console.log("WatchItems: ", this.watchList);

    let sub = this.tickerService.quoteObservable$.subscribe({
      next: (quote => {

        let watchItem = this.watchList.find(watchItem => watchItem.symbol===quote.symbol)
        if(watchItem && watchItem.previousClose){
          quote.isUp = (quote.price > watchItem.previousClose) ? true : false;
        }

       // this.trades.push(quote);

        // push quote to array and remove 9 seconds later
        //let indexOfAddedTrade: number = this.trades.findIndex((trade) => {return trade.tradeId == quote.tradeId});
          //setTimeout(()=> { this.trades.splice(indexOfAddedTrade, 1)} , 7_000);

        console.log((new Date).toTimeString(), quote);
      })
    });
    this.subscriptions.push(sub);
  }
  
}
