import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RETRY_COUNT } from '../Models/Constants';


@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private baseUrl = environment.baseApiUrl;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  public getPredictionResults(ticker: string) {
    let options = { params: new HttpParams().set('symbol', ticker),
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.get(`${this.baseUrl}StockPredict/GetPrediction`, options)
    .pipe(
      tap(_ => console.log(`(service)Getting ML predictions for: ${ticker}`)),
      retry(RETRY_COUNT),
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
    return throwError(() => new Error(error.message));
  }

}
