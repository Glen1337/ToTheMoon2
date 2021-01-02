import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResolveData } from '@angular/router';
import { Observable } from 'rxjs';
import { ResearchData } from '../Models/ResearchData';

@Injectable({
  providedIn: 'root'
})
export class ResearchDataService {

  // move this to environment config
  private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getData(ticker: string): Observable<ResearchData>{
    let symbol = ticker.trim().toUpperCase();
    return this.http.get<ResearchData>(`${this.baseUrl}/Research/${ticker}`)
  }
}
