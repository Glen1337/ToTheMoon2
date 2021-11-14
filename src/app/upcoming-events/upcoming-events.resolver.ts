import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ResearchDataService } from '../Services/research-data.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UpcomingEvents } from '../Models/UpcomingEvents';


@Injectable({
  providedIn: 'root'
})
export class UpcomingEventsResolverService implements Resolve<UpcomingEvents> {

  constructor(private researchService: ResearchDataService, private router: Router){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UpcomingEvents> {
    //todo: remove
    let today = new Date();
    let begin = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]; // .replace(/-/g, '');
    let end = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]; // .replace(/-/g, '');
    // let end = new Date(today.setDate(today.getDate() + 10)).toDateString().split('T')[0];
    // to localeString
    return this.researchService.getUpcomingEvents(begin, end)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    return of({});
  }

}
