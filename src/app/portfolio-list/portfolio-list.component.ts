import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Portfolio } from '../Models/Portfolio';

@Component({
  selector: 'portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit {

  portfolios: Array<Portfolio> = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    //this.portfolios$ 
     this.route.data.subscribe( data => {
      console.log(data);
      this.portfolios = data.portfolios
    });
    
  }

}
