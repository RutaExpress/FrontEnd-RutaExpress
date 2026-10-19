import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeService, Me } from '../../services/me.service';
import { ShipmentService, Shipment, ShipmentStatus, NEXT } from '../../services/shipment.service';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold mb-0">Gestión de Envíos</h2>
        @if (canCreate) {
          <button class="btn btn-primary" (click)="toggleForm()">
            <i class="bi bi-plus-circle me-2"></i>{{ showForm ? 'Cancelar' : 'Nuevo Envío' }}
          </button>
        }
      </div>

      <!-- Formulario de Creación -->
      @if (showForm && canCreate) {
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-3">Crear Nuevo Envío</h5>
            <form [formGroup]="createForm" (ngSubmit)="onSubmit()" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Servicio (ID)</label>
                <input type="text" class="form-control" formControlName="serviceId" placeholder="Ej: SRV-EXPRESS">
              </div>
              <div class="col-md-6">
                <label class="form-label">Destinatario</label>
                <input type="text" class="form-control" formControlName="recipientName">
              </div>
              <div class="col-md-6">
                <label class="form-label">Email Destinatario</label>
                <input type="email" class="form-control" formControlName="recipientEmail">
              </div>
              <div class="col-md-6">
                <label class="form-label">Dirección Origen</label>
                <input type="text" class="form-control" formControlName="originAddress">
              </div>
              <div class="col-md-6">
                <label class="form-label">Dirección Destino</label>
                <input type="text" class="form-control" formControlName="destinationAddress">
              </div>
              <div class="col-12 text-end">
                <button type="submit" class="btn btn-success" [disabled]="createForm.invalid">Crear Envío</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Tabla y Filtros -->
      <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3 d-flex flex-wrap gap-3 align-items-center">
          <span class="fw-bold">Filtrar por estado:</span>
          <select class="form-select w-auto" (change)="onFilterChange($event)">
            <option value="">Todos</option>
            <option value="CREADO">CREADO</option>
            <option value="ACEPTADO">ACEPTADO</option>
            <option value="EN_BODEGA">EN_BODEGA</option>
            <option value="EN_RUTA">EN_RUTA</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Tracking</th>
                <th>Destinatario</th>
                <th>Destino</th>
                <th>Estado</th>
                <th>Fecha</th>
                @if (canChangeStatus) { <th class="text-end">Acciones</th> }
              </tr>
            </thead>
            <tbody>
              @for (s of shipments; track s.id) {
                <tr>
                  <td class="fw-bold">{{ s.trackingNumber }}</td>
                  <td>{{ s.recipientName }}</td>
                  <td>{{ s.destinationAddress }}</td>
                  <td><span class="badge" [ngClass]="getStatusBadge(s.status)">{{ s.status }}</span></td>
                  <td>{{ s.createdAt | date:'short' }}</td>
                  
                  @if (canChangeStatus) {
                    <td class="text-end">
                      @for (next of getNextStatuses(s.status); track next) {
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="updateStatus(s.id, next)">
                          {{ next }}
                        </button>
                      }
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center py-4 text-muted">No hay envíos para mostrar.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ShipmentsComponent implements OnInit {
  shipments: Shipment[] = [];
  me: Me | null = null;
  showForm = false;
  createForm: FormGroup;
  currentFilter: ShipmentStatus | undefined;

  constructor(
    private fb: FormBuilder,
    private meService: MeService,
    private shipmentService: ShipmentService
  ) {
    this.createForm = this.fb.group({
      serviceId: ['', Validators.required],
      originAddress: ['', Validators.required],
      destinationAddress: ['', Validators.required],
      recipientName: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.meService.getMe().subscribe(me => {
      this.me = me;
      this.loadShipments();
    });
  }

  get canCreate(): boolean {
    return !!this.me?.roles.some(r => ['ROLE_CLIENTE', 'ROLE_OPERADOR', 'ROLE_ADMIN'].includes(r));
  }

  get canChangeStatus(): boolean {
    return !!this.me?.roles.some(r => ['ROLE_OPERADOR', 'ROLE_ADMIN'].includes(r));
  }

  loadShipments(): void {
    this.shipmentService.list(this.currentFilter).subscribe(data => {
      this.shipments = data;
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onFilterChange(event: any): void {
    this.currentFilter = event.target.value || undefined;
    this.loadShipments();
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;
    this.shipmentService.create(this.createForm.value).subscribe({
      next: () => {
        alert('Envío creado con éxito');
        this.showForm = false;
        this.createForm.reset();
        this.loadShipments();
      }
    });
  }

  updateStatus(id: number, status: ShipmentStatus): void {
    if (!confirm(`¿Cambiar estado a ${status}?`)) return;
    this.shipmentService.changeStatus(id, status).subscribe({
      next: () => {
        alert('Estado actualizado');
        this.loadShipments();
      }
    });
  }

  getNextStatuses(current: ShipmentStatus): ShipmentStatus[] {
    return NEXT[current] || [];
  }

  getStatusBadge(status: ShipmentStatus): string {
    switch (status) {
      case 'CREADO': return 'bg-secondary';
      case 'ACEPTADO': return 'bg-info text-dark';
      case 'EN_BODEGA': return 'bg-primary';
      case 'EN_RUTA': return 'bg-warning text-dark';
      case 'ENTREGADO': return 'bg-success';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}