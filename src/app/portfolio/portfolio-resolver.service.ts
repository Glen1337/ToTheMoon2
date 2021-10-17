import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioResolverService implements Resolve<Portfolio | {}> {

  constructor(private portfolioDataService: PortfolioDataService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Portfolio> | Observable<{}>{
    // console.log(route.paramMap);
    const id = route.paramMap.get('id');
    return this.portfolioDataService.getPortfolio(id)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return of({});
  }
}
