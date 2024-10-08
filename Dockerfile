# SS Etapa 1
FROM node:18-alpine as build

# Habilitar corepack y preparar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Instalar yarn si no está ya instalado
RUN yarn --version || npm install -g yarn
# Establecer la variable de entorno para pnpm
ENV PNPM_HOME=/usr/local/bin
# Establecer el directorio de trabajo
WORKDIR /app
# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
# Instalar dependencias del proyecto
RUN pnpm install --frozen-lockfile
# Copiar el resto del código de la aplicación
COPY . .

# SS Etapa 2
FROM node:18-alpine

# Install PM2 globally using PNPM
RUN npm install pm2 -g

# Establecer el directorio de trabajo
WORKDIR /app
# Instalar dependencias del sistema
RUN apk add --no-cache
# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/ /app
# Exponer el puerto de la aplicación
EXPOSE 3001
# Conocer si esta en un un contenedor
ENV RUNNING_IN_DOCKER=true
# Comando para ejecutar la aplicación

CMD ["pm2-runtime", "start", "app.js", "--cron", "0 3 * * *"]
#CMD ["npm", "start"]
