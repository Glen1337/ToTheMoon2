import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TickerService {

  private hubConnection: signalR.HubConnection;
  private baseUrl = environment.baseApiUrl;
  public quotes: any;

  constructor(){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.baseUrl}hub`)
    .build();

    this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addQuoteListener = () => {
    this.hubConnection.on('ReceiveQuote', (quotes) => {
      this.quotes = quotes;
      console.log(quotes);
    });
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(`${this.baseUrl}hub`)
                            .build();
                            
    this.hubConnection
    .start()
    .then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err))

    
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
  }
}
