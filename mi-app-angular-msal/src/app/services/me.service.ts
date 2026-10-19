import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Me {
  userId: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class MeService {
  private readonly base = `${environment.apiUrl}/api/v1/me`;

  constructor(private http: HttpClient) {}

  getMe(): Observable<Me> {
    return this.http.get<Me>(this.base);
  }

  // Helper para verificar roles en el frontend (solo para ocultar botones, no para seguridad real)
  hasRole(me: Me, role: string): boolean {
    return me.roles.includes(role);
  }
}