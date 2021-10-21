import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CompanyResearch } from '../Models/CompanyResearch';
import { MarketData } from '../Models/MarketData';
import { IAgg, ResearchData } from '../Models/ResearchData';

@Injectable({
  providedIn: 'root'
})
export class ResearchDataService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // move this to environment config
  private baseUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  public getUpcomingEvents(start: string, end: string): Observable<any>{
      // Add safe, URL encoded search parameter if there is a search term
    let options = { params: new HttpParams().set('begin', start).set('end', end) };

    return this.http.get(`${this.baseUrl}research/upcomingEvents`, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public getHistoricalstockData(ticker: string): Observable<IAgg[]>{
  // let params: HttpParams = new HttpParams().set('symbol', ticker.trim());
  // let options =  { params: new HttpParams().set('symbol', ticker.trim()) }

    let options =  {
      headers: { 'Content-Type': 'application/json' },
      params: new HttpParams().set('symbol', ticker.trim())
    };

    return this.http.get<IAgg[]>(`${this.baseUrl}research/chart`, options)
    .pipe(
      // map((agg) => [agg.] ),
      tap(_ => console.log(`Getting data for: ${ticker}`)),
      retry(2),
      catchError(this.handleError)
    );
  }

  public getCompanyStats(symbol: string): Observable<CompanyResearch> {
    let options =  {
      headers: { 'Content-Type': 'application/json' },
      params: new HttpParams().set('symbol', symbol.trim())
    };

    return this.http.get<CompanyResearch>(`${this.baseUrl}research/CompanyStats`, options).pipe(
      tap(_ => console.log('(service)Getting options chain ')),
      retry(2),
      catchError(this.handleError)
    );
  }

  public getMarketInfo(): Observable<MarketData>{
    return this.http.get<MarketData>(`${this.baseUrl}research/market`, this.httpOptions)
    .pipe(
      tap(_ => console.log(`Getting market data`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent || error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(
        `Backend returned code ${error.status}, ` +
        `. Body was: ${error.message}` +
        `. Inner error:  ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }
}

//   private handleError(error: HttpErrorResponse) {
//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred. Handle it accordingly.
//       console.error('An error occurred:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code.
//       // The response body may contain clues as to what went wrong.
//       console.log(
//         `Backend returned code ${error.status}, ` +
//         `body was: ${error.error}`);
//     }
//     // Return an observable with a user-facing error message.
//     return throwError('Something bad happened; please try again later.');
//   }
// }
