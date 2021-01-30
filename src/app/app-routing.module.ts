import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioListComponent } from '../app/portfolio-list/portfolio-list.component';
import { LandingPageComponent } from '../app/landing-page/landing-page.component';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component'
import { PortfolioListResolverService } from './portfolio-list/portfolio-list-resolver.service';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioResolverService } from './portfolio/portfolio-resolver.service';
import { AuthGuard } from '@auth0/auth0-angular';
import { ResearchComponent } from './research/research.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderHistoryResolverService } from './order-history/order-history-resolver.service';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistResolverService } from './watchlist/watchlist-resolver.service';
import { CompanyComponent } from './company/company.component';
import { MarketComponent } from './market/market.component';
import { OptionsComponent } from './options/options.component';
import { MarketDataResolverService } from './market/market-data-resolver.service';
import { OptionsResolverService } from './options/options-resolver.service';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'portfolios', component: PortfolioListComponent, resolve: { portfolios: PortfolioListResolverService }, canActivate: [AuthGuard] },
  { path: 'portfolio/:id', component: PortfolioComponent, resolve: { portfolio: PortfolioResolverService }, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderHistoryComponent, resolve: { orders: OrderHistoryResolverService }, canActivate: [AuthGuard] },
  { path: 'watchlist', component: WatchlistComponent, resolve: { watchList: WatchlistResolverService }, canActivate: [AuthGuard] },
  { path: 'research', component: ResearchComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'market', component: MarketComponent, resolve: { marketData: MarketDataResolverService} },
  { path: 'options', component: OptionsComponent, resolve: { portfolios: OptionsResolverService}, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
