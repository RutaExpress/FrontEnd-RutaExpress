# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine

# Eliminar configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar la configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de Angular
COPY --from=build /app/dist/mi-app-angular-msal/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]