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
import { UpcomingEventsComponent } from './upcoming-events.component';


@Injectable({
  providedIn: 'root'
})
export class UpcomingEventsResolverService implements Resolve<UpcomingEvents> {

  constructor(private researchService: ResearchDataService, private router: Router){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UpcomingEvents> {
    let begin = new Date(new Date().setDate(new Date().getDate() - UpcomingEventsComponent.daysBehind)).toISOString().split('T')[0]; // .replace(/-/g, '');
    let end = new Date(new Date().setDate(new Date().getDate() + UpcomingEventsComponent.daysAhead)).toISOString().split('T')[0]; // .replace(/-/g, '');

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
