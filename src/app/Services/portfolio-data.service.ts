import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Portfolio } from '../Models/Portfolio';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  // move this to environment config
  private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getAllPortfolios(): Observable<Array<Portfolio>> {
    return this.http.get<Array<Portfolio>>(`${this.baseUrl}portfolios`)
    .pipe(
      tap(_ => console.log('Getting list of portfolios')),
      retry(2),
      catchError(this.handleError)
    );
  }

  getPortfolio(id: number | string | null): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.baseUrl}portfolios/${id}`)
    .pipe(
      //map(p => ({...p, creationDateString: p.creationDate?.toLocaleString() })),
      tap(_ => console.log('Getting portfolio '+id)),
      retry(2),
      catchError(this.handleError)
    );
  }

  addPortfolio(portfolio: Portfolio): Observable<Portfolio> {
    let url = `${this.baseUrl}portfolios`;

    return this.http.post<Portfolio>(url, portfolio)
    .pipe(
      tap((newPortfolio) => console.log(`Added a new holding with id: ${newPortfolio.portfolioId}`)),
      retry(2),
      catchError<Portfolio, Observable<Portfolio>>(this.handleError)
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




// private handleError<T>(operation = 'operation', result?: T) {
//   return (error: any): Observable<T> => {

//     // TODO: send the error to remote logging infrastructure
//     console.error(error); // log to console instead

//     // TODO: better job of transforming error for user consumption
//     console.log(`(service) ${operation} failed: ${error.message}`);

//     // Return an observable with a user-facing error message.
//     return throwError(error);

//     // Let the app keep running by returning an empty result.
//     // return of(result as T);
//   };
// }