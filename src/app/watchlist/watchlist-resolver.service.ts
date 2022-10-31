import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WatchItem } from '../Models/WatchItem';
import { WatchlistService } from '../Services/watchlist.service';

@Injectable({
  providedIn: 'root'
})
export class WatchlistResolverService {

  constructor(private watchListService: WatchlistService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<WatchItem>> | Observable<never> {
    // console.log(route.paramMap);
    return this.watchListService.getWatchList()
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return of([]);
  }
}
