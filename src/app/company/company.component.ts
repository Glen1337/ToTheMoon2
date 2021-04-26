import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResearchDataService } from '../Services/research-data.service';
import { CompanyResearch } from '../Models/CompanyResearch';
import { financialifyNumber } from '../Utilities/utilities'

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  public errorMsg: string = "";
  private subscriptions: Subscription[] = [];
  public companyResearch: CompanyResearch = <CompanyResearch>{};
  public imgUrl: string = "";
  public financiafy: any;

  public companyResearchForm = new FormGroup({
    companySymbolControl: new FormControl('', [
      Validators.required,
      Validators.maxLength(8)
    ])
  });

  constructor(private location: Location, private researchService: ResearchDataService) {
    this.financiafy = financialifyNumber;
  }

  get companySymbolControl() { return this.companyResearchForm.get('companySymbolControl'); }

  public submitForm(): void {
    let sub: Subscription = new Subscription;
    let symbol: string = this.companySymbolControl?.value.trim().toUpperCase();

    sub = this.researchService.getCompanyStats(symbol).subscribe(
      (data) => {
        this.companyResearch = data;
        this.imgUrl = data.logo.url;
        console.log(this.companyResearch);
      },
      (error) => {
        console.log('(component)Error getting company research: ', error);
        this.errorMsg = `${error.message}`;
      },
      () => {"(component)Company Research complete"}
    );
  }

  ngOnInit(): void {
  }

  refresh(): void {
    location.reload();
  }

  goBack(): void {
    this.location.back();
  }

  messageClick() {
    this.errorMsg = '';
  }

  ConvertDate(date: Date){
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
