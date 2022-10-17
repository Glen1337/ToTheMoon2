import { Component, OnInit } from '@angular/core';
declare function introJs(): any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ToTheMoon'
  public currentlyLoading: boolean = true;

  constructor(){
    //this.currentlyLoading = true;
    
  }
  ngOnInit(): void {
    // Start tour
    introJs().start();
  }

}
