import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // Ajusta la ruta a tu entorno

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // En AWS usará "/api/v1" y en local "http://localhost:8082/api/v1"
  private baseUrl = `${environment.apiUrl}/v1`;

  constructor(private http: HttpClient) {}

  getClienteDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clientes/dashboard`, { responseType: 'text' });
  }
}