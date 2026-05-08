# 开发环境 Dockerfile for Next.js Jewelry Shop

FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache \
    git \
    bash \
    curl

# 将仓库复制到容器内的 /app/repo，后续所有操作都基于该目录
COPY . /app/repo

WORKDIR /app/repo

RUN npm ci

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=development

CMD ["bash", "-lc", "if [ ! -d .git ]; then git init; fi && npm run dev"]
