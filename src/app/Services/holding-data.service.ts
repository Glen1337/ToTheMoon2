import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Holding } from '../Models/Holding';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {

  private baseUrl = environment.baseApiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  addOption(optionHolding: Holding): Observable<Holding> {
    let url = `${this.baseUrl}holdings/options`;

    return this.http.post<Holding>(url, optionHolding, this.httpOptions)
    .pipe(
      tap((newHolding) => console.log(`(service)Adding a new option with id: ${newHolding.holdingId}`)),
      retry(1),
      catchError<Holding, Observable<Holding>>(this.handleError)
    )
  }

  addHolding(holding: Holding): Observable<Holding> {
      // Setting request headers to JSON
      // headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    const hOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    let url = `${this.baseUrl}holdings`;

    return this.http.post<Holding>(url, holding, hOptions)
    .pipe(
      tap((newHolding) => console.log(`(service)Adding a new holding with id: ${newHolding.holdingId}`)),
      retry(1),
      catchError<Holding, Observable<Holding>>(this.handleError)
    );
  }

  updateHolding(holding: Holding, id?: number): Observable<Holding> {
    let url = `${this.baseUrl}holdings/${id}`;

    return this.http.put<Holding>(url, holding, this.httpOptions).pipe(
      tap(_ => console.log(`(service)Updating holding with id: ${id}`)),
      retry(1),
      catchError<Holding, Observable<Holding>>(this.handleError)
    );
  }

  deleteHolding(id: number): Observable<Holding> {
    let url = `${this.baseUrl}holdings/${id}`;
    console.log('(service)Sending delete request to API for holding: ' + id);
    return this.http.delete<Holding>(url, this.httpOptions).pipe(
      tap(_ => console.log(`(service)Deleting holding with id: ${id}`)),
      retry(1),
      catchError<Holding, Observable<Holding>>(this.handleError)
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
    return throwError(() => new Error(error.message));
  }
}
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     if (error.error instanceof ErrorEvent) {
  //       // A client-side or network error occurred. Handle it accordingly.
  //       console.log('An error occurred:', error.error.message);
  //       console.log(error); // log to console instead
  //     } else {
  //       // The backend returned an unsuccessful response code.
  //       // The response body may contain clues as to what went wrong.
  //       console.log(`Backend returned code ${error.status},`+`body was: ${error.error}`);
  //     }
  //     // TODO: better job of transforming error for user consumption
  //     console.log(`(service) ${operation} failed: ${error.message}`);

  //     // Return an observable with a user-facing error message.
  //     return throwError(error);
  //     // Let the app keep running by returning an empty result.
  //     // return of(result as T);
  //   };
  // }
