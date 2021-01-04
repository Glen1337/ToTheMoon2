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

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'portfolios', component: PortfolioListComponent, resolve: { portfolios: PortfolioListResolverService }, canActivate: [AuthGuard] },
  { path: 'portfolio/:id', component: PortfolioComponent, resolve: { portfolio: PortfolioResolverService }, canActivate: [AuthGuard] },
  { path: 'research', component: ResearchComponent },
  { path: 'orders', component: OrderHistoryComponent, resolve: { orders: OrderHistoryResolverService}, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
