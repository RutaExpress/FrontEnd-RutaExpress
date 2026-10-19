# Etapa 1: compila Angular (Angular 21 requiere Node 20.19+ o 22)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: nginx con HTTPS autofirmado
FROM nginx:alpine
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/selfsigned.key -out /etc/nginx/selfsigned.crt \
    -subj "/CN=rutaexpress"
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/mi-app-angular-msal/browser /usr/share/nginx/html
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]