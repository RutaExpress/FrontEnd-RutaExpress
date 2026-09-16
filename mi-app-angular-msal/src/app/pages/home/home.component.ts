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
            <a href="#features" class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-info-circle me-2"></i> Más Información
            </a>
          </div>
        </div>
        <div class="col-lg-5 text-center d-none d-lg-block">
          <i class="bi bi-truck text-primary" style="font-size: 12rem;"></i>
        </div>
      </div>

      <!-- Features -->
      <div id="features" class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                <i class="bi bi-box-seam text-primary fs-2"></i>
              </div>
              <h5 class="card-title fw-bold">Gestión de Envíos</h5>
              <p class="card-text text-muted">
                Crea, acepta y rastrea envíos con seguimiento en tiempo real y control de estados.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                <i class="bi bi-truck text-success fs-2"></i>
              </div>
              <h5 class="card-title fw-bold">Flota Optimizada</h5>
              <p class="card-text text-muted">
                Administra la capacidad de tu flota y optimiza las rutas de entrega.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                <i class="bi bi-graph-up-arrow text-warning fs-2"></i>
              </div>
              <h5 class="card-title fw-bold">Analítica en Vivo</h5>
              <p class="card-text text-muted">
                KPIs y reportes en tiempo real sobre tus operaciones logísticas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to action -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card border-0 bg-primary text-white shadow">
            <div class="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h4 class="fw-bold mb-1">¿Listo para comenzar?</h4>
                <p class="mb-0 text-white-50">Inicia sesión para acceder al panel de control completo.</p>
              </div>
              <i class="bi bi-arrow-right-circle" style="font-size: 3rem; opacity: 0.5;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}