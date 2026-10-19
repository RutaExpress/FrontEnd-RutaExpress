import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensaje = 'Ocurrió un error inesperado.';
        switch (error.status) {
          case 401: mensaje = 'Tu sesión expiró. Vuelve a iniciar sesión.'; break;
          case 403: mensaje = 'No tienes permiso para esta acción.'; break;
          case 404: mensaje = 'Envío no encontrado.'; break;
          case 409: mensaje = error.error?.detail || 'Transición de estado inválida.'; break;
          case 400: mensaje = 'Datos inválidos. Revisa el formulario.'; break;
          case 503: mensaje = 'Servicio no disponible. Intenta más tarde.'; break;
        }
        alert(mensaje); // Luego podemos cambiarlo por un Toast de Bootstrap más bonito
        return throwError(() => error);
      })
    );
  }
}