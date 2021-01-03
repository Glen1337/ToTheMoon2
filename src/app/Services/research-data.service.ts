import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { IAgg, ResearchData } from '../Models/ResearchData';

@Injectable({
  providedIn: 'root'
})
export class ResearchDataService {

  // move this to environment config
  private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getHistoricalstockData(ticker: string): Observable<IAgg[]>{

    let options =  { params: new HttpParams().set('symbol', ticker.trim())}

    return this.http.get<IAgg[]>(`${this.baseUrl}research/`, options)
    .pipe(
      tap(_ => console.log(`Getting data for: ${ticker}`)),
      retry(2),
      catchError(this.handleError)
    );
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