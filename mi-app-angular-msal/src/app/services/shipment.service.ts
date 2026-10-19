import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ShipmentStatus = 'CREADO' | 'ACEPTADO' | 'EN_BODEGA' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';

export interface Shipment {
  id: number;
  trackingNumber: string;
  serviceId: string;
  originAddress: string;
  destinationAddress: string;
  recipientName: string;
  recipientEmail: string;
  customerId: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShipmentRequest {
  serviceId: string;
  originAddress: string;
  destinationAddress: string;
  recipientName: string;
  recipientEmail: string;
}

// Regla de transiciones (del PDF)
export const NEXT: Record<ShipmentStatus, ShipmentStatus[]> = {
  CREADO: ['ACEPTADO', 'CANCELADO'],
  ACEPTADO: ['EN_BODEGA', 'EN_RUTA', 'CANCELADO'],
  EN_BODEGA: ['EN_RUTA', 'CANCELADO'],
  EN_RUTA: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: []
};

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private readonly base = `${environment.apiUrl}/api/v1/shipments`;

  constructor(private http: HttpClient) {}

  list(status?: ShipmentStatus): Observable<Shipment[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Shipment[]>(this.base, { params });
  }

  get(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.base}/${id}`);
  }

  create(req: CreateShipmentRequest): Observable<Shipment> {
    return this.http.post<Shipment>(this.base, req);
  }

  changeStatus(id: number, status: ShipmentStatus): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.base}/${id}/status`, { status });
  }
}