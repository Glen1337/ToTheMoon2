import { Component, OnInit } from '@angular/core';
import { FinancialPage } from '../Common/FinancialPage';
import { Location } from '@angular/common';


@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent extends FinancialPage{

  constructor(public location: Location) {
    super(); 
  }

}
