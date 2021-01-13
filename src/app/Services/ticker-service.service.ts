import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TickerService {

  constructor() { }

  getServerSentEvent(url: string): Observable<any> {
    return new Observable(observer => {
      const eventSource = this.getEventSource(url);

      eventSource.onmessage = event => {
        observer.next(event);
      };
      eventSource.onerror = error => {
        observer.error(error);
      };
    
    });
  }
  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}
