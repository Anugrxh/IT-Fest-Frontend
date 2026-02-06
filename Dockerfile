FROM node:22-alpine AS builder

ARG ARG_VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$ARG_VITE_BACKEND_URL

RUN echo "VITE_BACKEND_URL: $VITE_BACKEND_URL"

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
COPY tsconfig.app.json /app/tsconfig.app.json
COPY tsconfig.node.json /app/tsconfig.node.json
COPY vite.config.ts /app/vite.config.ts
COPY eslint.config.js /app/eslint.config.js
COPY index.html /app/index.html

RUN npm ci

COPY src /app/src
COPY public /app/public

ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine

ARG ARG_VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$ARG_VITE_BACKEND_URL

RUN echo "VITE_BACKEND_URL: $VITE_BACKEND_URL"

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist /app/dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
