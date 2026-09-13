export const environment = {
  production: false,
  azure: {
    clientId: '5421b650-58dc-4ae6-863e-a34f55e0177a',
    tenantId: '70d90397-3549-4694-8a16-70f45020c6fa',
    redirectUri: 'http://localhost:4200',
    // DEBES INCLUIR EL SCOPE DE TU API:
    scopes: ['api://5421b650-58dc-4ae6-863e-a34f55e0177a/access_as_user'] 
  }
};