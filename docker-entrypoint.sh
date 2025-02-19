#!/bin/sh

# Executar migrations
npx prisma migrate deploy

# Iniciar a aplicação
exec node dist/main.js 