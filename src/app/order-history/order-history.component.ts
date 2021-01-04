import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from '../Models/Order';
import { financialifyNumber } from'../Utilities/utilities';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: Order[] = [];
  public financiafyNumber: any;

  constructor(private route: ActivatedRoute, private location: Location) {
    this.financiafyNumber = financialifyNumber;
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => { this.orders = data.orders; console.log(this.orders);}
    );
  }

  goBack(): void {
    this.location.back();
  }

  ConvertDate(date?: Date){
    return(date ? new Date(date).toLocaleString() : '');
  }

}
