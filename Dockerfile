# Multi-stage build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Produção com Nginx
FROM nginx:alpine AS production

# Copiar build para Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração Nginx customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
