import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent {

  @Input() location: Location;
  @Input() title: string;
  @Input() iconClass: string;

  constructor() { 
    this.location = {} as Location;
    this.title = '';
    this.iconClass = '';
  }

  public goBack(): void {
    this.location.back();
  }

  public refresh(): void {
    location.reload();
  }

}
