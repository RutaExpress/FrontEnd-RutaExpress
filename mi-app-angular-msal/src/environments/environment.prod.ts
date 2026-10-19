export const environment = {
  production: true,
  apiUrl: '__API_URL__', // <-- El despliegue lo reemplaza por la URL real del Gateway
  azure: {
    clientId: '5421b650-58dc-4ae6-863e-a34f55e0177a',
    tenantId: '70d90397-3549-4694-8a16-70f45020c6fa',
    authority: 'https://login.microsoftonline.com/70d90397-3549-4694-8a16-70f45020c6fa',
    scopes: ['api://5421b650-58dc-4ae6-863e-a34f55e0177a/access_as_user']
  }
};