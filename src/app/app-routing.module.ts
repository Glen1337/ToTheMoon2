import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioListComponent } from '../app/portfolio-list/portfolio-list.component';
import { LandingPageComponent } from '../app/landing-page/landing-page.component';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component'
import { PortfolioListResolverService } from './portfolio-list/portfolio-list-resolver.service';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'portfolios', component: PortfolioListComponent, resolve: { portfolios: PortfolioListResolverService } },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
