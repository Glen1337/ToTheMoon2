import { Component, OnInit } from '@angular/core';
import { AuthButtonComponent } from '../auth/login-button'
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public NavItems: Array<{ label: string, link: string[] }>;
  title = 'DegenAppUI';

  constructor() {
    this.NavItems = [
      { label: 'Portfolios', link: ['/portfolios'] },
    ];
  }

  ngOnInit(): void { }

}
