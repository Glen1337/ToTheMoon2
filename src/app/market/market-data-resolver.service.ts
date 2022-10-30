import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MarketData } from '../Models/MarketData';
import { ResearchDataService } from '../Services/research-data.service';

@Injectable({
  providedIn: 'root'
})
export class MarketDataResolverService implements Resolve<MarketData | {}> {

  constructor(private researchDataService: ResearchDataService) { }

  resolve(): Observable<MarketData> | Observable<{}> {
    return this.researchDataService.getMarketInfo()
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return of({});
  }
}
