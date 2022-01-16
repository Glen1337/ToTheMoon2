import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, take, throwError } from 'rxjs';
import { SymbolLookup } from '../Models/SymbolLookup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SymbolLookupService {

  private baseUrl = environment.baseApiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public lookupSymbol(input: string): Observable<SymbolLookup[]> {

    let options =  {
      headers: { 'Content-Type': 'application/json' },
      params: new HttpParams().set('input', input)
    };

    return this.http.get<SymbolLookup[]>(`${this.baseUrl}Research/market/lookup`, options)
      .pipe(
        (take(10)),
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
    //return throwError(error);
  }
}
