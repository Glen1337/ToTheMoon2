import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Order } from '../Models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryDataService {

  // move this to environment config
  private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Array<Order>>{
    return this.http.get<Array<Order>>(`${this.baseUrl}orders`)
    .pipe(
      tap(_ => {console.log('In service, Getting list of historical orders');}),
      retry(2),
      catchError(this.handleError)
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
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

}
