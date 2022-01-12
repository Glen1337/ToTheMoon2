import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { distinct, Observable, throttleTime } from 'rxjs';
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
  private quoteReceived = new EventEmitter<Trade>();
  public quoteObservable$: Observable<Trade> = new Observable<Trade>();

  constructor(private http: HttpClient){

    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`${this.baseUrl}hub`).build();

    this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err))

    this.quoteObservable$ = this.quoteReceived.asObservable()
      .pipe(
        //Only accept 1 trade per half second
        (throttleTime(500)),
        //Only accept trades with unique trade ids
        (distinct((e: Trade) => e.tradeId)),
      );
  }

  public addQuoteListener = () => {
    this.hubConnection.on('ReceiveQuote', (quote: Trade) => {
      this.quoteReceived.emit(quote);
    });
  }

  public callApi(): void {
    this.http.get(`${this.baseUrl}watchitems/realtime`).subscribe(res => {
      console.log("API Response: " + res);
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
  