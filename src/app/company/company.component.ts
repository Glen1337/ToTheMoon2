import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResearchDataService } from '../Services/research-data.service';
import { CompanyResearch } from '../Models/CompanyResearch';
//import { financialifyNumber } from '../Utilities/utilities';
import { FinancialPage } from '../Common/FinancialPage';
import { DateConverter } from '../Utilities/DateConverter';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent extends FinancialPage implements OnDestroy {

  public companyResearch: CompanyResearch = {} as CompanyResearch;
  public imgUrl: string = '';
  public financiafy: any;
  public currentlyLoading: boolean = false;

  public companyResearchForm = new FormGroup({
    companySymbolControl: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(8)
      ],
      nonNullable: true
    })
  });

  constructor(public location: Location, private researchService: ResearchDataService, public dateConverter: DateConverter) {
    super();
    //this.financiafy = financialifyNumber;
  }

  get companySymbolControl() { return this.companyResearchForm.get('companySymbolControl')!; }

  public submitForm(): void {
    this.currentlyLoading = true;

    let sub: Subscription = new Subscription();
    let symbol: string = this.companySymbolControl.value.trim().toUpperCase();

    sub = this.researchService.getCompanyStats(symbol).subscribe({
      next: (data) => {
        this.companyResearch = data;
        this.imgUrl = data.logo.url;
        console.log(this.companyResearch);
      },
      error:(error) => {
        console.log('(component)Error getting company research: ', error);
        this.errorMsg = `${error.error}`;
        this.currentlyLoading = false;
      },
      complete:() => {
        '(component)Company Research complete';
        this.currentlyLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

}
