import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Option } from '../Models/Option';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OptionsDataService {

    private baseUrl = environment.baseApiUrl;

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

  constructor(private http: HttpClient) { }

  public getExpiryDates(symbol: string): Observable<string[]> {

    let params = new HttpParams();
    params.set('symbol', symbol.trim());

    let paramOptions =  symbol ? { params: new HttpParams().set('symbol', symbol) } : {};

    return this.http.get<string[]>(`${this.baseUrl}Options/Expiry`, paramOptions)
    .pipe(
      tap(_ => console.log('(service)Getting options expiration dates for ' + symbol)),
      retry(2),
      catchError(this.handleError)
    );
  }

  public getOptionsChain(symbol: string, expiration: string): Observable<Option[]> {

    const params = new HttpParams()
      .set('symbol', symbol.trim())
      .set('expiration', expiration);

    return this.http.get<Option[]>(`${this.baseUrl}Options/Chain`, {params}).pipe(
      tap(_ => console.log('(service)Getting options chain ')),
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
        `Backend returned code ${error.status}, `,
        `body was: ${error.message}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

}
