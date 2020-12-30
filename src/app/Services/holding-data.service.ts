import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Holding } from '../Models/Holding';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {

    // move this to config
    private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  addHolding(holding: Holding): Observable<Holding> {
    const hOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    let url = `${this.baseUrl}holdings`;

    return this.http.post<Holding>(url, holding, hOptions)
    .pipe(
      tap((newHolding ) => console.log(`Added a new holding with id: ${newHolding.holdingId}`)),
      catchError<Holding, Observable<Holding>>(this.handleError("addHolding"))
    );
    // .subscribe({
    //   next(response) { console.log('Response:' + response); },
    //   error(err) { console.error('Error posting holding: ');}
    // });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
