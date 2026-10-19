import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MeService, Me } from '../../services/me.service';
import { ShipmentService, Shipment } from '../../services/shipment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <!-- Bienvenida -->
      @if (me) {
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm bg-primary text-white">
              <div class="card-body p-4 d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h2 class="mb-1 fw-bold">Hola, {{ me.name }}</h2>
                  <p class="mb-0 opacity-75">{{ me.email }}</p>
                </div>
                <div class="mt-3 mt-md-0">
                  <span class="badge bg-light text-dark fs-6 px-3 py-2">
                    <i class="bi bi-shield-check me-1"></i> {{ me.roles.join(', ') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Vista para CLIENTE -->
      @if (isCliente) {
        <div class="row">
          <div class="col-12">
            <div class="card shadow-sm border-0">
              <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 class="mb-0 fw-bold"><i class="bi bi-box-seam me-2 text-primary"></i>Mis Últimos Envíos</h5>
                <a routerLink="/shipments" class="btn btn-sm btn-outline-primary">Ver todos</a>
              </div>
              <div class="card-body p-0">
                @if (shipments.length === 0) {
                  <div class="text-center py-5 text-muted">No tienes envíos registrados aún.</div>
                } @else {
                  <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                      <thead class="table-light">
                        <tr>
                          <th>Tracking</th>
                          <th>Destino</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (s of shipments; track s.id) {
                          <tr>
                            <td class="fw-bold">{{ s.trackingNumber }}</td>
                            <td>{{ s.destinationAddress }}</td>
                            <td><span class="badge bg-secondary">{{ s.status }}</span></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Vista para OPERADOR / ADMIN -->
      @if (isOperador) {
        <div class="row g-4">
          <div class="col-12">
            <h4 class="fw-bold mb-3">Resumen de Operaciones</h4>
          </div>
          @for (stat of stats; track stat.status) {
            <div class="col-md-4 col-lg-3">
              <div class="card shadow-sm border-0 h-100 text-center">
                <div class="card-body">
                  <h6 class="text-muted text-uppercase mb-2">{{ stat.status }}</h6>
                  <h2 class="display-5 fw-bold text-primary mb-0">{{ stat.count }}</h2>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  me: Me | null = null;
  shipments: Shipment[] = [];
  stats: { status: string, count: number }[] = [];

  constructor(
    private meService: MeService,
    private shipmentService: ShipmentService
  ) {}

  ngOnInit(): void {
    this.meService.getMe().subscribe({
      next: (meData) => {
        this.me = meData;
        if (this.isCliente) {
          this.loadClienteData();
        } else if (this.isOperador) {
          this.loadOperadorData();
        }
      },
      error: (err) => console.error('Error cargando /me', err)
    });
  }

  get isCliente(): boolean {
    return this.me?.roles.includes('ROLE_CLIENTE') || false;
  }

  get isOperador(): boolean {
    return (this.me?.roles.includes('ROLE_OPERADOR') || this.me?.roles.includes('ROLE_ADMIN')) || false;
  }

  private loadClienteData(): void {
    this.shipmentService.list().subscribe(s => {
      this.shipments = s.slice(0, 5); // Solo los últimos 5
    });
  }

  private loadOperadorData(): void {
    this.shipmentService.list().subscribe(s => {
      const counts: Record<string, number> = {};
      s.forEach(item => {
        counts[item.status] = (counts[item.status] || 0) + 1;
      });
      this.stats = Object.keys(counts).map(status => ({
        status,
        count: counts[status]
      }));
    });
  }
}