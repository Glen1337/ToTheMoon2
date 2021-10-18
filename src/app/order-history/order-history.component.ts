import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '../Models/Order';
import { financialifyNumber } from '../Utilities/utilities';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public orders: Order[] = [];
  public errorMsg: string = '';

  constructor(private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();

    subscription1 = this.route.data.subscribe(
      (data) => {
        this.orders = data.orders;
        console.log('(component)Order history retrieved');
      },
      (error) => {
        console.log(`(component)Error getting order history: ${error}`);
        this.errorMsg = `${error.error.title}`;
      },
      () => { console.log('(component)Order history retrieved'); }
    );

    this.subscriptions.push(subscription1)
  }

  messageClick(): void {
    this.errorMsg = '';
  }

  goBack(): void {
    this.location.back();
  }

  ConvertDate(date?: Date){
    return(date ? new Date(date).toLocaleString() : '');
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        if (!sub.closed) { sub.unsubscribe(); }
      });
    }
  }

  refresh(): void {
    location.reload();
  }

}
