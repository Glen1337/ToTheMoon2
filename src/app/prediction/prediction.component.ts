import { Component, OnInit } from '@angular/core';
import { FinancialPage } from '../Common/FinancialPage';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PredictionService } from '../Services/prediction.service';
import { MLPrediction } from '../Models/MLPrediction';
import { DateConverter } from '../Utilities/DateConverter';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent extends FinancialPage{

  public currentlyLoading: boolean = false;
  public predictionForm: FormGroup;
  public predictionResult: MLPrediction = {} as MLPrediction;

  constructor(public location: Location, public dateConverter: DateConverter, private predictionService: PredictionService) {
    super(); 

    this.predictionForm = new FormGroup({
      predictionControl: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
      ])
    });
  }

  get predictionControl() { return this.predictionForm.get('predictionControl'); }

  public submitForm(): void {
    this.currentlyLoading = true;
    
    let sub: Subscription = new Subscription();
    let symbol: string = this.predictionControl?.value.trim().toUpperCase();
    
    sub = this.predictionService.getPredictionResults(symbol).subscribe({
      next: (data) => {
        this.predictionResult = data as MLPrediction;
        console.log(this.predictionResult);
      },
      error: (error) => {
        console.log('(component)Error getting ML prediction: ', error);
      },
      complete: () =>{
        '(component)ML prediction result received';
        this.currentlyLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  public IsResultEmpty(): boolean{
    return Object.keys(this.predictionResult).length === 0;
  }

  
}
