import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { buffer, bufferCount, bufferTime, concatMap, distinct, filter, first, from, map, mergeMap, Observable, of, Subject, switchMap, take, tap, throttle, throttleTime } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Trade } from '../Models/Trade';

@Injectable({
  providedIn: 'root'
})
export class TickerService implements OnDestroy{

  private hubConnection: signalR.HubConnection;
  private baseUrl = environment.baseApiUrl;
  private tradeReceived = new Subject<Trade>();

  public bufferedQuoteObservable$: Observable<Trade[]> = new Observable<Trade[]>();

  constructor(private http: HttpClient){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}hub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
    .start()
    .then(() => console.log('Hub Connection Started'))
    .catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.onclose((err?: Error) => {
      if (err) {
          // An error occurs
          console.log(`Closing Hub Connection ${err ? err.message : ''}`);
          this.tradeReceived.error(err); 
      } else {
          // No more events to be sent.
          this.tradeReceived.complete();
      }
    });

    this.bufferedQuoteObservable$ = this.tradeReceived
      .pipe(
          tap(trade => console.log("recieving trade: ",  trade)),
          distinct((e: Trade) => e.tradeId),
          // Buffer for 10 seconds
          bufferTime(10000),
          // Only emit the last 5 values from the buffer.
          map(buffer => buffer.slice(-6))

        // Add trades to buffer until 8 seconds go by, then emit first 8 trades as an array. Then clear/ignore all of the trades(if any) that
        //are waiting to be added into the buffer.
        // tap(v => console.log('pipe-start: ', v)),
        // distinct((e: Trade) => e.tradeId),
        // bufferTime(10000),
        // concatMap((tradeArray) => {
        //   return from(tradeArray);
        // }),
        // tap(v => console.log("Count post concat-map: " + v)),
        // bufferCount(5),
        // tap(v => console.log('pipe-end: ', v))

      // this.hubConnection.onclose(error => {
      //   console.log(`Closing Hub Connection ${error ? error.message : ''}`);
      // });
      );
  }

  public addQuoteListener = () => {
    this.hubConnection.on('ReceiveQuote', (quote: Trade) => {
      this.tradeReceived.next(quote);
    });
  }

  public callApi(): Observable<any> {
    return this.http.get(`${this.baseUrl}watchitems/realtime`);
  }

  ngOnDestroy(){
    this.hubConnection.stop();
  }

  filterTradesByCount(counter: number, max: number): boolean {
    counter++;
    return (counter <= max);
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
  