# Build stage
FROM node:22-alpine AS builder

ARG ARG_VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$ARG_VITE_BACKEND_URL

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts eslint.config.js index.html ./
COPY src ./src
COPY public ./public

RUN npm ci
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]