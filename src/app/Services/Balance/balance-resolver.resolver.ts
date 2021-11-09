import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BalanceService } from './balance-service.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceResolver implements Resolve<number | {}> {

  constructor(private balanceService: BalanceService, private router: Router){ }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<{}> {
    return this.balanceService.getBalance()
    .pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    return of({});
  }
}
