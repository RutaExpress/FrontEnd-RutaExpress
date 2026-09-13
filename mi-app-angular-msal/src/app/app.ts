import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <- 1. Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  
  msalReady = false;

  constructor(
    private authService: MsalService,
    private cdr: ChangeDetectorRef // <- 2. Inyectamos el detector de cambios
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Intentamos inicializar Microsoft
      await this.authService.instance.initialize();
    } catch (e) {
      // Si ya estaba inicializado o da error, lo atrapamos para que no rompa nada
      console.warn('Nota MSAL:', e);
    } finally {
      // 3. PASE LO QUE PASE (éxito o error), encendemos la bandera
      this.msalReady = true;
      
      // 4. OBLIGAMOS a Angular a redibujar el HTML en este exacto milisegundo
      this.cdr.detectChanges(); 
    }

    // 5. Dejamos que revise los redireccionamientos en segundo plano
    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result && result.account) {
          this.authService.instance.setActiveAccount(result.account);
        }
      },
      error: (error) => console.error('Error MSAL en redirección:', error)
    });
  }
}