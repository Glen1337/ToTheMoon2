import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
    // move this to environment config
    private baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getBalance(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}`);
  }

}
