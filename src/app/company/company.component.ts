import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResearchDataService } from '../Services/research-data.service';
import { CompanyResearch } from '../Models/CompanyResearch';
import { financialifyNumber } from '../Utilities/utilities';
import { messageEnabled } from '../Common/message-enabled';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent extends messageEnabled implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public companyResearch: CompanyResearch = {} as CompanyResearch;
  public imgUrl: string = '';
  public financiafy: any;
  public currentlyLoading: boolean = false;

  public companyResearchForm = new FormGroup({
    companySymbolControl: new FormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ])
  });

  constructor(public location: Location, private researchService: ResearchDataService) {
    super();
    this.financiafy = financialifyNumber;
  }

  get companySymbolControl(): AbstractControl | null { return this.companyResearchForm.get('companySymbolControl'); }

  public submitForm(): void {
    this.currentlyLoading = true;

    let sub: Subscription = new Subscription();
    let symbol: string = this.companySymbolControl?.value.trim().toUpperCase();

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
  }

  ngOnInit(): void {
  }

  ConvertDate(date: Date): string{
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
