# 开发环境 Dockerfile for Next.js Jewelry Shop
# 使用本地 Node.js 运行时，无需下载镜像

# 尝试使用多种基础镜像
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装基础工具
RUN apk add --no-cache \
    git \
    bash \
    curl

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# 设置权限
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=development

# 默认命令
CMD ["bash", "-c", "if [ ! -d .git ]; then git init && git config user.email 'agent@docker.local' && git config user.name 'Docker Agent' && git add . && git commit -m 'Initial container state' 2>/dev/null || true; fi && npm run dev"]
