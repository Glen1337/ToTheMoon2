import { Component, OnInit, AfterViewInit } from '@angular/core';

declare function introJs(): any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ToTheMoon'
  public currentlyLoading: boolean = false;

  constructor(){
  }

  // ngAfterViewInit(){
  //   this.currentlyLoading = false;
  // }
  ngOnInit(): void {
    // Start tour
    //this.currentlyLoading = true;

    introJs().start();
  }

}
