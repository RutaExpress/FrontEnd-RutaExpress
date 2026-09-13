import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Asegúrate de que el puerto coincida con tu Spring Boot local
  private baseUrl = 'http://localhost:8082/api/v1';

  constructor(private http: HttpClient) {}

  getClienteDashboard(): Observable<any> {
    // any, porque tu backend devuelve  un JSON
    return this.http.get(`${this.baseUrl}/clientes/dashboard`, { responseType: 'text' });
  }
}