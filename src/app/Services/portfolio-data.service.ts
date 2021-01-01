import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Portfolio } from '../Models/Portfolio';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  // move this to environment config
  private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getAllPortfolios(): Observable<Array<Portfolio>>{
    return this.http.get<Array<Portfolio>>(`${this.baseUrl}portfolios`)
    .pipe(
      tap(_ => console.log('Getting list of portfolios')),
      catchError(this.handleError<any>('getAllPortfolios'))
    );
  }

  getPortfolio(id: number | string | null): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.baseUrl}portfolios/${id}`)
    .pipe(
      tap(_ => console.log('Getting portfolio '+id)),
      catchError(this.handleError<any>('getPortfolio'))
    );
  }

  addPortfolio(portfolio: Portfolio): Observable<Portfolio> {
    let url = `${this.baseUrl}portfolios`;

    return this.http.post<Portfolio>(url, portfolio)
    .pipe(
      tap((newPortfolio) => console.log(`Added a new holding with id: ${newPortfolio.portfolioId}`)),
      catchError<Portfolio, Observable<Portfolio>>(this.handleError("addPortfolio"))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`(service) ${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
