import { Component, OnInit } from '@angular/core';
import { MarketData } from '../Models/MarketData';
import { ResearchDataService } from '../Services/research-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  //marketDataJsonString: string = "";
  marketData: MarketData = <MarketData>{};
  errorMsg: string = "";
  constructor(private researchdataService: ResearchDataService, private location: Location) { }

  ngOnInit(): void {
    this.researchdataService.getMarketInfo().subscribe(
      (marketDataJson) => {
        this.marketData = marketDataJson as any;
      },
      (error) => {
        this.errorMsg = `${error.error}`
        console.log("(component)Error getting market perf. data");
      },
      () => { console.log("Market Perf. Data retrieved"); }
    );
  }

  messageClick() {
    this.errorMsg = '';
  }

  goBack(): void {
    this.location.back();
  }

}
