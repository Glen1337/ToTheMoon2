import { Component, OnInit } from '@angular/core';
import { MarketData } from '../Models/MarketData';
import { ResearchDataService } from '../Services/research-data.service';
import { Location } from '@angular/common';
import { financialifyNumber } from '../Utilities/utilities'

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  //marketDataJsonString: string = "";
  public marketData: MarketData = <MarketData>{};
  errorMsg: string = "";
  financiafy: any;

  constructor(private researchdataService: ResearchDataService, private location: Location) { 
    this.financiafy = financialifyNumber;
  }

  ngOnInit(): void {
    this.researchdataService.getMarketInfo().subscribe(
      (marketDataJson) => {
        this.marketData = marketDataJson;
        console.log(typeof marketDataJson);
        //this.marketData = marketDataJson as MarketData;
        // this.marketData.sectorPerformances.forEach(sp => {
        //   sp.performancePercentage = parseFloat(sp.performance) * 100
        // });
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
