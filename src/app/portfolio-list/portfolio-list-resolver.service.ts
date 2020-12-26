import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Portfolio } from '../Models/Portfolio';

@Injectable({
  providedIn: 'root'
})
export class PortfolioListResolverService implements Resolve<Array<Portfolio>> {

  constructor() { }

  resolve(){
    //TODO: create service and call it here
  }
}
