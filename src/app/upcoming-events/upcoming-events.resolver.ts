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
    return this.researchService.getUpcomingEvents('2021-09-22', '2021-11-21')
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    return of({});
  }

}
