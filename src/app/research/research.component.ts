import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResearchDataService } from '../Services/research-data.service';
import { Location } from '@angular/common';
import { IAgg } from '../Models/ResearchData';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  historicalStockData: IAgg[] = [];

  public researchForm = new FormGroup({
    researchSymbolControl: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(8)
    ])
  });

  constructor(private researchService: ResearchDataService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  get researchSymbolControl() { return this.researchForm.get('researchSymbolControl'); }

  onGetData(): void {
    let symbol: string = this.researchSymbolControl!.value;
    this.researchService.getHistoricalstockData(symbol).subscribe(data =>{
      console.log(data);
      this.historicalStockData = data;
    });
  }

  ConvertDate(date: Date){
    return new Date(date).toLocaleDateString();
  }

  goBack(): void {
    this.location.back();
  }

}
