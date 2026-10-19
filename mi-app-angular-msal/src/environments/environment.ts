export const environment = {
  production: false,
  // URL del API Gateway (el PDF dice que te la pasarán, pero usa la de tu README como placeholder)
  apiUrl: 'https://a9kmdqgude.execute-api.us-east-1.amazonaws.com/rutaexpress',
  azure: {
    clientId: '5421b650-58dc-4ae6-863e-a34f55e0177a',
    tenantId: '70d90397-3549-4694-8a16-70f45020c6fa',
    // Authority por tenant, NUNCA /common
    authority: 'https://login.microsoftonline.com/70d90397-3549-4694-8a16-70f45020c6fa',
    scopes: ['api://5421b650-58dc-4ae6-863e-a34f55e0177a/access_as_user']
  }
};