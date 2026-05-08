# 开发环境 Dockerfile for Next.js Jewelry Shop

FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache \
    git \
    bash \
    curl

COPY . /app/repo

WORKDIR /app/repo

RUN npm ci

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=development

CMD ["bash", "-lc", "if [ ! -d .git ]; then git init; fi && npm run dev"]