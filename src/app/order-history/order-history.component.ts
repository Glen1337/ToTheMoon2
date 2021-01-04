import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => { console.log(data); }
    );
  }

  goBack(): void {
    this.location.back();
  }

}
