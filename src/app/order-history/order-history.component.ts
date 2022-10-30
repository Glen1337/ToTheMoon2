import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '../Models/Order';
import { of, Subscription } from 'rxjs';
import { FinancialPage } from '../Common/FinancialPage';
import { DateConverter } from '../Utilities/DateConverter';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent extends FinancialPage implements OnInit, OnDestroy {

  public orders: Order[] = [];

  constructor(private route: ActivatedRoute, public location: Location, public dateConverter: DateConverter) {
    super();
  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();

    subscription1 = this.route.data.subscribe({
      next: (data) => {
        this.orders = data.orders;
        console.log('(component)Order history retrieved');
      },
      error: (error) => {
        console.log(`(component)Error getting order history: ${error}`);
        this.errorMsg = `${error.error.title}`;
      },
      complete: () => { console.log('(component)Order history retrieved'); }
    });

    this.subscriptions.push(subscription1)
  }

}
