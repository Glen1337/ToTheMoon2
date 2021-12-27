import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '../Models/Order';
import { of, Subscription } from 'rxjs';
import { messageEnabled } from '../Common/message-enabled';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent extends messageEnabled implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public orders: Order[] = [];
  public errorMsg: string = '';

  constructor(private route: ActivatedRoute, public location: Location) {
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
  
}
