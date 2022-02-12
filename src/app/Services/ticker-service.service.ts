import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { buffer, bufferCount, bufferTime, distinct, Observable, Subject, take, throttleTime } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Trade } from '../Models/Quote';

@Injectable({
  providedIn: 'root'
})
export class TickerService implements OnDestroy{

  private hubConnection: signalR.HubConnection;
  private baseUrl = environment.baseApiUrl;
  //private quoteReceived = new EventEmitter<Trade>();
  private tradeReceived = new Subject<Trade>();

  public quoteObservable$: Observable<Trade> = new Observable<Trade>();
  public bufferedQuoteObservable$: Observable<Trade[]> = new Observable<Trade[]>();

  constructor(private http: HttpClient){

    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`${this.baseUrl}hub`).build();

    this.hubConnection
    .start()
    .then(() => console.log('Hub Connection Started'))
    .catch(err => console.log('Error while starting connection: ' + err))

    this.quoteObservable$ = this.tradeReceived
      .pipe(
        //Only accept 1 trade per given time length, in ms
        (throttleTime(1000)),
        //Only accept trades with unique trade ids
        (distinct((e: Trade) => e.tradeId)),
      );

    this.bufferedQuoteObservable$ = this.tradeReceived
    .pipe(
      // Add trades to buffer until 8 seconds go by, then emit first 8 trades at once
      (distinct((e: Trade) => e.tradeId)),
      (bufferTime(8000)),
      (take(8))
      //(throttleTime(8000)),
      //(bufferCount(8))
    );

      this.hubConnection.onclose(error => {
        console.log(`Closing Hub Connection ${error ? error.message : ''}`);
      });
  }

  public addQuoteListener = () => {
    this.hubConnection.on('ReceiveQuote', (quote: Trade) => {
      //this.quoteReceived.emit(quote);
      this.tradeReceived.next(quote);
    });
  }

  public callApi(): void {
    this.http.get(`${this.baseUrl}watchitems/realtime`).subscribe(res => {
      console.log("API Response: ", res);
    });
  }

  ngOnDestroy(){
    this.hubConnection.stop();
  }

}

  // }
  // getServerSentEvent(url: string): Observable<any> {
  //   return new Observable(observer => {
  //     const eventSource = this.getEventSource(url);

  //     eventSource.onmessage = event => {
  //       observer.next(event);
  //     };
  //     eventSource.onerror = error => {
  //       observer.error(error);
  //     };
  //   });
  // }
  // private getEventSource(url: string): EventSource {
  //   return new EventSource(url);
  // }
  