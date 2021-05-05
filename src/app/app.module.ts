import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortfolioListComponent } from './portfolio-list/portfolio-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular'
import { AuthButtonComponent } from './auth/login-button';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { ResearchComponent } from './research/research.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { MessageComponent } from './message/message.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { TickerComponent } from './ticker/ticker.component';
import { CompanyComponent } from './company/company.component';
import { MarketComponent } from './market/market.component';
import { OptionsComponent } from './options/options.component';
import { FooterComponent } from './footer/footer.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioListComponent,
    LandingPageComponent,
    NavBarComponent,
    PageNotFoundComponent,
    PortfolioComponent,
    AuthButtonComponent,
    ResearchComponent,
    OrderHistoryComponent,
    MessageComponent,
    WatchlistComponent,
    TickerComponent,
    CompanyComponent,
    MarketComponent,
    OptionsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      domain: 'dev-d-9d27fb.us.auth0.com',
      clientId: '1Zz6hQdfw9OLWgffy7eplT4FgrGsCBgo',
      // Request this audience at user authentication time
      audience: 'https://DegenApp.com/api',

      // Request this scope at user authentication time
      //scope: 'create:data',

      // Specify configuration for the interceptor              
      httpInterceptor: {
        allowedList: [
          // Holdings
          {
            uri: `${environment.baseApiUrl}holdings*`,
            tokenOptions: { audience: 'https://DegenApp.com/api' }
          },
          // Portfolios
          {
            uri: `${environment.baseApiUrl}portfolios*`,
            tokenOptions: { audience: 'https://DegenApp.com/api' }
          },
          // Orders
          {
            uri: `${environment.baseApiUrl}orders*`,
            tokenOptions: { audience: 'https://DegenApp.com/api' }
          },
          //Watchlist
          {
            uri: `${environment.baseApiUrl}watchitems*`,
            tokenOptions: { audience: 'https://DegenApp.com/api' }
          },
          // Options
          {
            uri: `${environment.baseApiUrl}Options*`,
            tokenOptions: { audience: 'https://DegenApp.com/api' }
          },
          // User Balance
          {
            uri: `${environment.baseApiUrl}UserBalance*`,
            tokenOptions: { audience: 'https://DegenApp.com/api' }
          }
        ]
      }
    }),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }



// @NgModule({
//   declarations: [
//     AppComponent,
//     PortfolioListComponent,
//     LandingPageComponent,
//     NavBarComponent,
//     PageNotFoundComponent,
//     PortfolioComponent,
//     AuthButtonComponent,
//     ResearchComponent
//   ],
//   imports: [
//     BrowserModule,
//     AuthModule.forRoot({
//       domain: 'dev-d-9d27fb.us.auth0.com',
//       clientId: '1Zz6hQdfw9OLWgffy7eplT4FgrGsCBgo',
//         // Request this audience at user authentication time
//         audience: 'https://DegenApp.com/api',

//         // Request this scope at user authentication time
//         scope: 'create:data',

//         // Specify configuration for the interceptor              
//         httpInterceptor: {
//         allowedList: [
//         {
//           // Match any request that starts 'https://dev-d-9d27fb.us.auth0.com/api/v2/' (note the asterisk)
//           uri: 'https://localhost:5001/api/*',
//           tokenOptions: {
//             // The attached token should target this audience
//             audience: 'https://DegenApp.com/api',

//             // The attached token should have these scopes
//             scope: 'create:data'
//           }
//         }]
//       }
//     }),
//     HttpClientModule,
//     AppRoutingModule,
//     FormsModule,
//     ReactiveFormsModule
//   ],
//   providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
