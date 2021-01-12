import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { WatchItem } from '../Models/WatchItem';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  // move this to environment config
  private baseUrl = 'https://localhost:5001/api/'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getWatchList(): Observable<Array<WatchItem>> {
    let url = `${this.baseUrl}watchitems`;
    return this.http.get<Array<WatchItem>>(url, this.httpOptions)
    .pipe(
      tap(_ => console.log('(service)Getting watchlist')),
      retry(2),
      catchError(this.handleError)
    );
  }

  addWatchItem(watchItem: WatchItem): Observable<WatchItem> {
    let url = `${this.baseUrl}watchitems`;

    return this.http.post<WatchItem>(url, watchItem, this.httpOptions)
    .pipe(
      tap(() => console.log(`(service)Adding a new watch item: ${watchItem.symbol}`)),
      retry(2),
      catchError<WatchItem, Observable<WatchItem>>(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(
        `Backend returned code ${error.status}, `,
        `body was: ${error.message}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

}
