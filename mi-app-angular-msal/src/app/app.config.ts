import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { 
  MsalInterceptor, 
  MsalInterceptorConfiguration, 
  MSAL_INSTANCE, 
  MSAL_INTERCEPTOR_CONFIG, 
  MSAL_GUARD_CONFIG, 
  MsalGuardConfiguration,
  MsalService,
  MsalGuard,
  MsalBroadcastService
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { environment } from '../environments/environment';

// IMPORTANTE: Verifica que esta ruta sea exacta (con el ./ adelante)
import { ErrorInterceptor } from './interceptor/error.interceptor'; 

// 1. Instancia de MSAL
export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      redirectUri: window.location.origin,
    }
  });
}

// 2. Configuración del Interceptor
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  
  protectedResourceMap.set(`${environment.apiUrl}/api/v1/shipments*`, environment.azure.scopes);
  protectedResourceMap.set(`${environment.apiUrl}/api/v1/me`, environment.azure.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

// 3. Configuración del Guard
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: environment.azure.scopes
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      // AQUI ESTA EL INTERCEPTOR DE ERRORES
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor, 
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};