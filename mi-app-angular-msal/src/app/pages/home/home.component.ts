import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <!-- Hero -->
      <div class="row align-items-center mb-5">
        <div class="col-lg-7">
          <span class="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2">
            <i class="bi bi-rocket-takeoff me-1"></i> Plataforma Cloud Native
          </span>
          <h1 class="display-4 fw-bold mb-3">
            Bienvenido a <span class="text-primary">RutaExpress</span>
          </h1>
          <p class="lead text-muted mb-4">
            Plataforma unificada para envíos de última milla. Crea, gestiona y rastrea tus envíos en tiempo real.
          </p>
          <div class="d-flex gap-2 flex-wrap">
            <a routerLink="/dashboard" class="btn btn-primary btn-lg">
              <i class="bi bi-speedometer2 me-2"></i> Ir al Panel
            </a>
          </div>
        </div>
        <div class="col-lg-5 text-center d-none d-lg-block">
          <i class="bi bi-truck text-primary" style="font-size: 12rem;"></i>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}