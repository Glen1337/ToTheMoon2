import { Component, OnInit } from '@angular/core';
import { FinancialPage } from '../Common/FinancialPage';
import { Trade } from '../Models/Quote';
import { TickerService } from '../Services/ticker-service.service';

@Component({
  selector: 'ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent extends FinancialPage implements OnInit {

  public trades: Trade[] = [];

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
    this.trades.push(trade1, trade2, trade3, trade4);
  }

  ngOnInit(): void {

    // Add safe, URL encoded search parameter if there is a search term
    this.tickerService.addQuoteListener();
    this.tickerService.callApi();

    let sub = this.tickerService.quoteObservable$.subscribe({
      next: (quote => {
        this.trades.push(quote);
        let indexOfAddedTrade: number = this.trades.findIndex((trade) => {return trade.tradeId == quote.tradeId});
        setTimeout(()=> { this.trades.splice(indexOfAddedTrade, 1)} , 10_000);
        console.log((new Date).toTimeString(), quote);
      })
    });
    this.subscriptions.push(sub);
  }
  
}
