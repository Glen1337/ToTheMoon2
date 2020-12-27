import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';
import { PortfolioDataService } from '../Services/portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioListResolverService implements Resolve<Array<Portfolio>> {

  constructor(private portfolioDataService: PortfolioDataService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Portfolio>> | Observable<never> {
    return this.portfolioDataService.getAllPortfolios();

  }
}
