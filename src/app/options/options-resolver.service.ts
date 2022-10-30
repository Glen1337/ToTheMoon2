import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsResolverService implements Resolve<Portfolio[]> {

  constructor(private portfolioDataService: PortfolioDataService) { }

  resolve(): Observable<Portfolio[]> | Observable<never> {
    return this.portfolioDataService.getAllPortfolios()
    .pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    return of([]);
  }
}
