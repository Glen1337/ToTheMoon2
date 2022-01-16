import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'ToTheMoon'
  public currentlyLoading: boolean = true;

  constructor(){
    //this.currentlyLoading = true;
    
  }

  // ngAfterViewChecked(){
  //   this.currentlyLoading = false;
  // }

}
