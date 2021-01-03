import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Holding } from '../Models/Holding';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {

    // move this to environment config
    private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  addHolding(holding: Holding): Observable<Holding> {
      // Setting request headers to JSON
      // headers = new HttpHeaders()
      // .set('Content-Type', 'application/json')
      // .set('Accept', 'application/json');
    const hOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    let url = `${this.baseUrl}holdings`;

    return this.http.post<Holding>(url, holding, hOptions)
    .pipe(
      tap((newHolding) => console.log(`Added a new holding with id: ${newHolding.holdingId}`)),
      retry(2),
      catchError<Holding, Observable<Holding>>(this.handleError("addHolding"))
    );
    // .subscribe({
    //   next(response) { console.log('Response:' + response); },
    //   error(err) { console.error('Error posting holding: ');}
    // });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', error.error.message);
        console.log(error); // log to console instead
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.log(`Backend returned code ${error.status},`+`body was: ${error.error}`);
      }
      // TODO: better job of transforming error for user consumption
      console.log(`(service) ${operation} failed: ${error.message}`);
      
      // Return an observable with a user-facing error message.
      return throwError(error);
      // Let the app keep running by returning an empty result.
      // return of(result as T);
    };
  }
}
