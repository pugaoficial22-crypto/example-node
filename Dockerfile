FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache de Docker)
COPY package*.json ./
RUN npm ci --only=production

# Copiar el resto del código
COPY app.js ./
COPY routes/ ./routes/
COPY src/    ./src/
COPY lib/    ./lib/
COPY public/ ./public/
COPY bin/    ./bin/

EXPOSE 3000

USER node

CMD ["node", "bin/www"]