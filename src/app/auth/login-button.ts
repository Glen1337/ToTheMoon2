import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  template: `
    <div>
        <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
        <button class="btn btn-primary" (click)="auth.logout({ returnTo: document.location.origin })">
            Log out
        </button>
        </ng-container>

        <ng-template #loggedOut>
        <button class="btn btn-primary" (click)="auth.loginWithRedirect()">Log in</button>
        </ng-template>
        <ul *ngIf="auth.user$ | async as user">
          <!--
            <p>Logged in as: </p>
            <li>Name: {{ user.name }}</li>
            <li>Email: {{ user.email }}</li> 

            <li>User Id: {{ user.user_id }}</li>
            <li>User meta: {{ user.user_metadata }}</li>
            <li>Username: {{ user.username }}</li>
            
            <li>Last IP: {{ user.last_ip }}</li>
            <li>Identities: {{ user.identities }}</li>
            <li>App Meta: {{ user.app_metadata }}</li>
            <li>Last login: {{ user.last_login }}</li>
          -->
        </ul>
    </div>
  `,
  styles: [],
})
export class AuthButtonComponent implements OnInit {
    profileJson: string = 'null';
    isCollapsed = true;
    
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe((profile) => {
        this.profileJson = JSON.stringify(profile, null, 2)
        console.log("Profile: ", profile)
    });

    this.auth.idTokenClaims$.subscribe((claims) => { 
        console.log("ID Token Claims (Claims within the provided ID Token:)", claims);
    });
  }

  loginWithRedirect() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ returnTo: this.document.location.origin });
  }

}