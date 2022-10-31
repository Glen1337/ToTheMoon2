import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { RETRY_COUNT } from 'src/app/Models/Constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
    // move this to environment config
    private baseUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getBalance(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}UserBalance`).pipe(
      tap(_ => console.log('(service)Getting balance ')),
      retry(RETRY_COUNT),
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
    return throwError(() => new Error(error.message));
  }

}
