import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../Models/Order';
import { OrderHistoryDataService } from '../Services/order-history-data.service';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryResolverService implements Resolve<Array<Order>> {

  constructor(private orderHistoryDataService: OrderHistoryDataService) {}

  resolve(): Observable<Array<Order>> | Observable<never> {
    return this.orderHistoryDataService.getAllOrders()
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return of([]);
  }
}
