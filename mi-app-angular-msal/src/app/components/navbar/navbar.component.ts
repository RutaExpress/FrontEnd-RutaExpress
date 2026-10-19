import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; // <-- Agregamos RouterLinkActive
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MeService, Me } from '../../services/me.service'; // <-- Importamos el servicio de usuario

@Component({
  selector: 'app-navbar',
  standalone: true,
  // IMPORTANTE: Agregar RouterLinkActive aquí para que no falle la compilación
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center fw-bold" routerLink="/">
          <i class="bi bi-truck me-2 fs-4"></i>
          RutaExpress
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <i class="bi bi-house-door me-1"></i> Inicio
              </a>
            </li>
            
            @if (loginDisplay) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                  <i class="bi bi-speedometer2 me-1"></i> Dashboard
                </a>
              </li>
              
              <!-- Solo mostramos Envíos si el usuario tiene el rol correcto -->
              @if (isClienteOrOperador) {
                <li class="nav-item">
                  <a class="nav-link" routerLink="/shipments" routerLinkActive="active">
                    <i class="bi bi-box-seam me-1"></i> Envíos
                  </a>
                </li>
              }
            }
          </ul>

          <div class="d-flex align-items-center gap-2">
            @if (!loginDisplay) {
              <button class="btn btn-light fw-semibold" (click)="login()">
                <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
              </button>
            } @else {
              <span class="badge bg-success fs-6 me-2">
                <i class="bi bi-check-circle me-1"></i> Sesión Activa
              </span>
              <button class="btn btn-outline-light" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
              </button>
            }
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  loginDisplay = false;
  me: Me | null = null;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private meService: MeService // <-- Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    this.checkAndSetActiveAccount();
    this.msalBroadcastService.inProgress$
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  checkAndSetActiveAccount(): void {
    const activeAccount = this.authService.instance.getActiveAccount();
    const accounts = this.authService.instance.getAllAccounts();
    
    if (!activeAccount && accounts.length > 0) {
      this.authService.instance.setActiveAccount(accounts[0]);
      this.loginDisplay = true;
      this.loadMe();
      this.router.navigate(['/dashboard']);
    } else {
      this.loginDisplay = !!activeAccount || accounts.length > 0;
      if (this.loginDisplay) {
        this.loadMe();
      }
    }
  }

  // Método para pedir el usuario y sus roles al backend
  private loadMe(): void {
    this.meService.getMe().subscribe({
      next: (data) => this.me = data,
      error: (err) => console.error('Error cargando datos del usuario', err)
    });
  }

  // Validamos si tiene permisos para ver la pestaña
  get isClienteOrOperador(): boolean {
    if (!this.me || !this.me.roles) return false;
    return this.me.roles.some(role => 
      ['ROLE_CLIENTE', 'ROLE_OPERADOR', 'ROLE_ADMIN'].includes(role)
    );
  }

  login(): void {
    if (this.authService.instance.getActiveAccount()) {
      this.loginDisplay = true;
      return;
    }
    const loginRequest: RedirectRequest = { scopes: environment.azure.scopes };
    this.authService.loginRedirect(loginRequest);
  }

  logout(): void {
    this.authService.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  }
}