# 🚀 RutaExpress — Frontend

![Angular](https://img.shields.io/badge/Angular-17+-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)
![MSAL](https://img.shields.io/badge/MSAL-Angular-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Nginx-blue.svg)
![AWS](https://img.shields.io/badge/AWS-API%20Gateway-yellow.svg)
![Status](https://img.shields.io/badge/estado-funcionando-success.svg)

Cliente Angular para la plataforma **RutaExpress**, un sistema de gestión de envíos de última milla para una red de 20 couriers PyME.

Este repositorio contiene el frontend SPA con autenticación federada mediante **Microsoft Entra ID** (Azure AD) y **MSAL Angular**, consumiendo un backend Spring Boot (BFF) a través de **AWS API Gateway** con validación de JWT.

---

## 📑 Índice

1. [Arquitectura](#-arquitectura)
2. [Stack tecnológico](#-stack-tecnológico)
3. [Estructura del proyecto](#-estructura-del-proyecto)
4. [Flujo de autenticación](#-flujo-de-autenticación)
5. [Puesta en marcha local](#-puesta-en-marcha-local)
6. [Puesta en marcha en producción](#-puesta-en-marcha-en-producción)
7. [Variables de entorno](#-variables-de-entorno)
8. [Endpoints consumidos](#-endpoints-consumidos)
9. [Pipeline CI/CD](#-pipeline-cicd)
10. [Troubleshooting](#-troubleshooting)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario (navegador)                                        │
└────────────────────────┬────────────────────────────────────┘
                         │ 1. Click "Iniciar Sesión"
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Microsoft Entra ID                                         │
│  - Autenticación OAuth2 + PKCE                              │
│  - Emite JWT con claims (aud, iss, scp, roles)              │
└────────────────────────┬────────────────────────────────────┘
                         │ 2. access_token (JWT)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Angular 17+ (MSAL + MsalInterceptor)                       │
│  - Almacena el token en localStorage                        │
│  - Inyecta Bearer en cada request al BFF                    │
└────────────────────────┬────────────────────────────────────┘
                         │ 3. HTTPS + Authorization: Bearer ...
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  AWS API Gateway (a9kmdqgude)                               │
│  - JWT Authorizer valida el token (perimetral)              │
└────────────────────────┬────────────────────────────────────┘
                         │ 4. HTTP (reenvío)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  BFF Spring Boot (EC2)                                      │
│  - Segunda validación del JWT                               │
│  - Autorización por rol                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack tecnológico

| Componente | Versión | Uso |
| :--- | :--- | :--- |
| **Angular** | 17+ | Framework SPA con standalone components |
| **TypeScript** | 5.x | Tipado estricto |
| **MSAL Angular** | 3.x | Autenticación OAuth2/OIDC |
| **MSAL Browser** | 3.x | Cliente OAuth2 |
| **RxJS** | 7.x | Programación reactiva |
| **Nginx** | alpine | Servidor del bundle compilado |
| **Docker** | Multi-stage | Build + runtime |
| **Node** | 20 | Build de Angular |

---

## 📁 Estructura del proyecto

```
mi-app-angular-msal/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── navbar/           # Barra superior con login/logout
│   │   ├── pages/
│   │   │   ├── home/             # Página pública
│   │   │   └── dashboard/        # Página protegida
│   │   ├── services/
│   │   │   └── api.service.ts    # Llamadas HTTP al BFF
│   │   ├── app.config.ts         # Config MSAL + interceptor
│   │   ├── app.routes.ts         # Rutas + MsalGuard
│   │   ├── app.ts                # Componente raíz
│   │   └── app.html              # Template raíz
│   ├── environments/
│   │   ├── environment.ts        # Dev (localhost)
│   │   └── environment.prod.ts   # Prod (Gateway)
│   ├── main.ts                   # Bootstrap
│   └── styles.css                # Estilos globales
├── nginx.conf                    # Config de Nginx (SPA + try_files)
├── Dockerfile                    # Multi-stage build
├── angular.json                  # Config Angular CLI
└── package.json                  # Dependencias
```

---

## 🔐 Flujo de autenticación

### 1. Login (MSAL)

El usuario hace clic en **"Iniciar Sesión"** en el navbar. Angular redirige a Entra ID usando el flujo **Authorization Code + PKCE**.

### 2. Token JWT

Entra ID devuelve un `access_token` firmado con los siguientes claims:

```json
{
  "aud": "5421b650-58dc-4ae6-863e-a34f55e0177a",
  "iss": "https://login.microsoftonline.com/70d90397-3549-4694-8a16-70f45020c6fa/v2.0",
  "scp": "access_as_user",
  "roles": ["ROLE_OPERADOR"],
  "preferred_username": "usuario@dominio.com"
}
```

### 3. Inyección automática

El `MsalInterceptor` adjunta el token a cualquier petición HTTP que empiece con `environment.apiUrl`:

```typescript
protectedResourceMap.set(environment.apiUrl + '/*', environment.azure.scopes);
```

### 4. Protección de rutas

El `MsalGuard` protege las rutas que lo requieran:

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [MsalGuard]
}
```

---

## 🚀 Puesta en marcha local

### Prerrequisitos

- Node.js 20+
- Angular CLI 17+ (`npm install -g @angular/cli`)
- BFF corriendo en `http://localhost:8082` (ver repo `ms-rutaexpress-bff`)

### 1. Clonar e instalar

```bash
git clone https://github.com/RutaExpress/frontend-rutaexpress.git
cd frontend-rutaexpress/mi-app-angular-msal
npm install
```

### 2. Configurar `environment.ts`

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8082/api',
  azure: {
    clientId: '5421b650-58dc-4ae6-863e-a34f55e0177a',
    tenantId: '70d90397-3549-4694-8a16-70f45020c6fa',
    redirectUri: 'http://localhost:4200',
    scopes: ['api://5421b650-58dc-4ae6-863e-a34f55e0177a/access_as_user']
  }
};
```

### 3. Levantar el front

```bash
npm start
```

Abrir `http://localhost:4200`.

### 4. Verificar el login

1. Clic **Iniciar Sesión**.
2. Autenticarse con Microsoft.
3. Vuelve a `/dashboard`.
4. Debe mostrar datos del BFF local.

---

## ☁️ Puesta en marcha en producción

### Opción A — Acceso por API Gateway

El front se sirve desde el mismo dominio del Gateway:

```
https://a9kmdqgude.execute-api.us-east-1.amazonaws.com/
```

Editar `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://a9kmdqgude.execute-api.us-east-1.amazonaws.com/api',
  azure: {
    clientId: '5421b650-58dc-4ae6-863e-a34f55e0177a',
    tenantId: '70d90397-3549-4694-8a16-70f45020c6fa',
    redirectUri: 'https://a9kmdqgude.execute-api.us-east-1.amazonaws.com',
    scopes: ['api://5421b650-58dc-4ae6-863e-a34f55e0177a/access_as_user']
  }
};
```

### Opción B — Docker en EC2

```bash
docker build -t rutaexpress-frontend .
docker run -p 80:80 rutaexpress-frontend
```

El contenedor sirve el bundle Angular vía Nginx con `try_files` para SPA.

---

## ⚙️ Variables de entorno

| Variable | Descripción | Valor |
| :--- | :--- | :--- |
| `apiUrl` | URL base del BFF | `http://localhost:8082/api` (local) / `https://a9kmdqgude.../api` (prod) |
| `clientId` | Client ID de la App Registration | `5421b650-58dc-4ae6-863e-a34f55e0177a` |
| `tenantId` | Tenant ID de Entra ID | `70d90397-3549-4694-8a16-70f45020c6fa` |
| `redirectUri` | URI de redirección post-login | `window.location.origin` |
| `scopes` | Scope OAuth2 solicitado | `api://5421b650-.../access_as_user` |

---

## 🌐 Endpoints consumidos

| Endpoint | Método | Auth | Descripción |
| :--- | :--- | :---: | :--- |
| `/api/v1/public/status` | GET | ❌ | Estado del BFF |
| `/api/v1/clientes/dashboard` | GET | ✅ | Datos del cliente |
| `/api/v1/operadores/panel` | GET | ✅ | Panel de operadores (requiere `ROLE_OPERADOR`) |

---

## 🔄 Pipeline CI/CD

Cada push a `main` dispara un workflow en GitHub Actions que:

1. Hace checkout del código.
2. Configura credenciales AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`).
3. Se autentica en Amazon ECR.
4. Construye la imagen Docker (multi-stage: Node build → Nginx).
5. Publica en ECR como `rutaexpress-frontend:latest`.

---

## 🐛 Troubleshooting

| Error | Causa | Solución |
| :--- | :--- | :--- |
| `crypto_nonexistent` | HTTP plano a IP | Usar HTTPS o `localhost` |
| `state_mismatch` | Caché vieja de MSAL | Clear site data o incógnito |
| `AADSTS50011` | Redirect URI no registrada | Agregar en Entra ID |
| CORS error | Origen no permitido en Gateway o BFF | Verificar configuración CORS |
| 401 en el dashboard | MsalInterceptor no adjunta el token | Verificar `protectedResourceMap` con `environment.apiUrl + '/*'` |
| `net::ERR_CONNECTION_REFUSED` | `apiUrl` mal configurado | Verificar `environment.ts` |
| Dashboard 404 al recargar (F5) | Falta `try_files` en Nginx | Verificar `nginx.conf` |

---

## 📄 Licencia

Proyecto académico — Duoc UC, Subdirección de Diseño Instruccional, 2026.

---

**Última actualización:** Septiembre 2026