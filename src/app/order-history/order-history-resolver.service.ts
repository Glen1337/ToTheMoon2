import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../Models/Order';
import { OrderHistoryDataService } from '../Services/order-history-data.service';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryResolverService implements Resolve<Array<Order>> {

  constructor(private orderHistoryDataService: OrderHistoryDataService) {}

  resolve(): Observable<Array<Order>> | Observable<never> {
    return this.orderHistoryDataService.getAllOrders();
  }
}
