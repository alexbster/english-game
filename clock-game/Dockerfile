# Usa una imagen base de Nginx
FROM nginx:alpine

# Copia los archivos compilados al directorio público de Nginx
COPY dist/clock-game/browser/ /usr/share/nginx/html

# (Opcional) Copia tu configuración personalizada de Nginx
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
