import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '../Models/Order';
import { financialifyNumber } from'../Utilities/utilities';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: Order[] = [];
  public financiafyNumber: any;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private location: Location) {
    this.financiafyNumber = financialifyNumber;
  }

  ngOnInit(): void {
    let subscription1: Subscription = new Subscription();
    
    subscription1 = this.route.data.subscribe(
      (data) => { this.orders = data.orders; console.log(this.orders);},
      (error) => {
        console.log(`(component)Error getting order history: ${error}`);
        return of([]);
      },
      () => { console.log("(component)Order history retrieved"); }
    );

    this.subscriptions.push(subscription1)
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

}
