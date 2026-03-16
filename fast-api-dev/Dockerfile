FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo producción
RUN npm ci --only=production --legacy-peer-deps

# Copiar carpetas del código (Esto ya incluye src y bin)
COPY bin/ ./bin/
COPY src/ ./src/
COPY routes/ ./routes/
COPY public/ ./public/

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]