# 开发环境 Dockerfile for Next.js Jewelry Shop
# 离线构建方案 - 使用 Alpine Linux 基础镜像

FROM alpine:3.20

# 设置工作目录
WORKDIR /app

# 安装基础工具和 Node.js
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    bash \
    curl \
    && npm install -g npm@latest

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# 复制当前仓库到容器内
COPY . /app

# 确保 Git 初始化并设置正确的分支
RUN git init && \
    git config --global user.email "agent@docker.local" && \
    git config --global user.name "Docker Agent" && \
    git add . && \
    git commit -m "Initial container state"

# 安装项目依赖
RUN npm ci

# 设置权限
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV development

# 提供默认 shell 和开发命令
CMD ["bash", "-c", "npm run dev & bash"]