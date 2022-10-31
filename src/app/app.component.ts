import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

declare function introJs(): any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'ToTheMoon'
  // public currentlyLoading: boolean = false;
  public isLoaded: boolean = false;
  public isHttpLoaded: boolean = false;


  constructor(private route: Router) {}

  // ngAfterViewInit(){
  //   this.currentlyLoading = false;
  // }
  ngOnInit(): void {

    // Start tour
    //this.currentlyLoading = true;
    this.route.events.subscribe({
      next: (event) => {
      if (event instanceof NavigationStart) {
        this.isLoaded = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoaded = false;
      }
    },
    error: (error) => {
      this.isLoaded = false;
      console.log(`Error in app component: ${error}`);
    }
  });


    introJs().start();
  }

}
