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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule, AuthHttpInterceptor  } from '@auth0/auth0-angular'
import { AuthButtonComponent } from './auth/login-button';
import { ResearchComponent } from './research/research.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { MessageComponent } from './Common/message/message.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { TickerComponent } from './ticker/ticker.component';
import { CompanyComponent } from './company/company.component';
import { MarketComponent } from './market/market.component';
import { OptionsComponent } from './options/options.component';
import { FooterComponent } from './footer/footer.component';
import { environment } from 'src/environments/environment';
//import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { FiFormatPipe } from './Utilities/fi-format.pipe';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HeadingComponent } from './Common/heading/heading.component';
import { DateConverter } from './Utilities/DateConverter';
import { PredictionComponent } from './prediction/prediction.component';
import { SymbolControlComponent } from './Common/symbol-control/symbol-control.component';

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
    FooterComponent,
    UpcomingEventsComponent,
    FiFormatPipe,
    HeadingComponent,
    PredictionComponent,
    SymbolControlComponent
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      domain: 'dev-d-9d27fb.us.auth0.com',
      clientId: '1Zz6hQdfw9OLWgffy7eplT4FgrGsCBgo',
      // Request this audience at user authentication time
      audience: 'https://DegenApp.com/api',

      // Request this scope at user authentication time
      // scope: 'create:data',

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
          // Watchlist
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
    ReactiveFormsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],

  // , {provide: LocationStrategy, useClass: HashLocationStrategy}
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }, DateConverter],
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
