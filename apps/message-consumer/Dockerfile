FROM node:20-alpine AS builder

WORKDIR /app

# Copiar todo o contexto necessário
COPY . .

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Build da aplicação
RUN npm run build message-consumer

# Imagem de produção
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar build da aplicação
COPY --from=builder /app/dist/apps/message-consumer ./dist

# Variável de ambiente para conexão com RabbitMQ
ENV RABBITMQ_URL=amqp://rabbitmq:5672

CMD ["node", "dist/main.js"]