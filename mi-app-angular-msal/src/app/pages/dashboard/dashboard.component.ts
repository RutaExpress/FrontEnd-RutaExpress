import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <- 1. Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h2>Panel de Control Seguro</h2>
      <p>Si ves esto, estás autenticado correctamente con Microsoft.</p>
      
      <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h3>Datos del Backend (Spring Boot):</h3>
        
        <!-- Angular 17 Control Flow -->
        @if (datosBackend) {
          <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin-bottom: 10px;"><strong>Mensaje del Servidor:</strong> <span style="color: #28a745; font-weight: bold;">{{ datosBackend.mensaje }}</span></p>
            <p style="margin-bottom: 10px;"><strong>Roles Autorizados:</strong> {{ datosBackend.roles_detectados }}</p>
            <p style="margin: 0;"><strong>ID de Sesión:</strong> <span style="font-family: monospace; color: #6c757d;">{{ datosBackend.usuario_id }}</span></p>
          </div>
        } @else if (error) {
          <p style="color: red; font-weight: bold;">{{ error }}</p>
        } @else {
          <p>Cargando datos del servidor...</p>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  datosBackend: any = null;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef // <- 2. Lo inyectamos en el constructor
  ) {}

  ngOnInit(): void {
    this.apiService.getClienteDashboard().subscribe({
      next: (response) => {
        console.log('¡Datos recibidos con éxito!', response);
        
        // Asignamos la respuesta
        if (typeof response === 'string') {
          try {
            this.datosBackend = JSON.parse(response);
          } catch(e) {
            this.datosBackend = response;
          }
        } else {
          this.datosBackend = response;
        }

        // 3. ¡Obligamos a Angular a actualizar el HTML INMEDIATAMENTE!
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar el BFF:', err);
        this.error = 'No se pudieron cargar los datos. Revisa la consola (F12).';
        
        // También obligamos a redibujar si hay error
        this.cdr.detectChanges(); 
      }
    });
  }
}