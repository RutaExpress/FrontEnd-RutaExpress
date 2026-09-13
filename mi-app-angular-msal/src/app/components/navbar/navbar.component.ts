import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Agrega Router 
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // Ajusta esta ruta si es necesario


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav style="display: flex; justify-content: space-between; padding: 20px; background-color: #f8f9fa; border-bottom: 1px solid #ddd;">
      <div>
        <h2 style="margin: 0;">RutaExpress</h2>
        <a routerLink="/" style="margin-right: 15px;">Inicio</a>
        @if (loginDisplay) {
          <a routerLink="/dashboard">Panel de Control</a>
        }
      </div>
      <div>
        @if (!loginDisplay) {
          <button (click)="login()" style="padding: 8px 16px; cursor: pointer;">Iniciar Sesión</button>
        } @else {
          <span style="color: green; font-weight: bold; margin-right: 15px;">¡Sesión Activa!</span>
          <button (click)="logout()" style="padding: 8px 16px; cursor: pointer; background: #dc3545; color: white; border: none; border-radius: 4px;">Cerrar Sesión</button>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  loginDisplay = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
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
      this.router.navigate(['/dashboard']);
    } else {
      this.loginDisplay = !!activeAccount || accounts.length > 0;
    }
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