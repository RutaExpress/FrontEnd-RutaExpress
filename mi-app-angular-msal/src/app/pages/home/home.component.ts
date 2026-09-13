import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1>Bienvenido a RutaExpress</h1>
      <p>Esta es la página pública. Por favor, inicia sesión para acceder al sistema.</p>
    </div>
  `
})
export class HomeComponent {}