FROM node:20-alpine AS builder

WORKDIR /app

# Copiar todo o contexto necessário
COPY . .

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Gerar cliente Prisma durante o build
RUN npx prisma generate

# Build da aplicação
RUN npm run build jet-test-senior

# Imagem de produção
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./
# Copiar diretório prisma
COPY prisma ./prisma

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar build da aplicação
COPY --from=builder /app/dist/apps/jet-test-senior ./dist

# Definir variáveis de ambiente
ENV PORT=3000
ENV NODE_ENV=production

# Expor a porta da aplicação
EXPOSE 3000

# Adicionar script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]