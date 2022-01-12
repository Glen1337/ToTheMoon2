import { Component, OnInit } from '@angular/core';
import { FinancialPage } from '../Common/FinancialPage';
import { TickerService } from '../Services/ticker-service.service';

@Component({
  selector: 'ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent extends FinancialPage implements OnInit {

  constructor(private tickerService: TickerService) { 
    super();
  }

  ngOnInit(): void {

    // Add safe, URL encoded search parameter if there is a search term
    this.tickerService.addQuoteListener();
    this.tickerService.callApi();

    let sub = this.tickerService.quoteObservable$.subscribe({
      next: (quote => {
        console.log((new Date).toTimeString(), quote);
      })
    });
    this.subscriptions.push(sub);
  }
  
}
