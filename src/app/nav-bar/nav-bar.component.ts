import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthButtonComponent } from '../auth/login-button';
import { SymbolLookup } from '../Models/SymbolLookup';
import { SymbolLookupService } from '../Services/symbol-lookup.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  public lookupResults: SymbolLookup[] = [];

  lookupControl : UntypedFormControl;

  public NavItems: Array<{ label: string, link: string[] }>;
  public title = 'ToTheMoon';

  constructor(private lookupService: SymbolLookupService) {
    this.lookupControl = new UntypedFormControl('');

    this.NavItems = [
      { label: 'Portfolios', link: ['/portfolios'] },
      { label: 'Research', link: ['/research'] },
      { label: 'Orders', link: ['/orders'] },
      { label: 'Company', link: ['/company'] },
      { label: 'Market', link: ['/market'] },
      { label: 'Watchlist', link: ['/watchlist'] },
      { label: 'Options', link: ['/options'] },
      { label: 'Events', link: ['/events'] },
      { label: 'Machine Learning', link: ['/prediction'] }
    ];

    this.lookupControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(input => {
        if (!input.trim()) {
          this.lookupResults = [];
        } else {
          lookupService.lookupSymbol(input).subscribe((searchResults: SymbolLookup[]) => {
            this.lookupResults = [];
            searchResults.forEach((result) => {
              result.securityName = result.securityName.substring(0, 24);
              this.lookupResults.push(result);
            });
            //this.lookupResults = searchResults
          });
        }
      });

  }

  public selectCompany(event: any, companySelection: SymbolLookup) {
    console.log(event);
    console.log(companySelection);
    window.alert(`Company: ${companySelection.securityName}\n
                  Exchange: ${companySelection.exchange}\n
                  Region: ${companySelection.region}\n
                  Sector: ${companySelection.sector}\n
                  Security Type: ${companySelection.securityType}\n
                  Symbol: ${companySelection.symbol}`);
  }

}
