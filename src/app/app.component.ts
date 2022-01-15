import { AfterViewChecked, Component, OnInit } from '@angular/core';

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

  ngOnInit(){
    // introJs().start();
  }

  // ngAfterViewChecked(){
  //   this.currentlyLoading = false;
  // }

}
