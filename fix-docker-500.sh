#!/bin/bash
# 修复 Docker 500 Internal Server Error

echo "=== Docker 500 错误修复脚本 ==="
echo ""

# 1. 停止所有 Docker 相关进程
echo "1. 停止 Docker Desktop..."
osascript -e 'quit app "Docker"' 2>/dev/null
sleep 3

# 2. 强制结束 Docker 进程
echo "2. 强制结束残留进程..."
pkill -f "Docker Desktop" 2>/dev/null
pkill -f "com.docker" 2>/dev/null
sleep 2

# 3. 清理 Docker 构建缓存
echo "3. 清理构建缓存..."
rm -rf ~/.docker/buildx 2>/dev/null
rm -rf ~/.docker/desktop 2>/dev/null

# 4. 清理项目相关的 Docker 文件
echo "4. 清理项目构建缓存..."
cd /Users/tan/web/jewelry-shop
rm -rf .dockerignore

# 5. 重新创建 .dockerignore
cat > .dockerignore << 'EOF'
# 依赖文件
node_modules
npm-debug.log*

# 构建输出
.next/
out/
build/

# 环境文件
.env
.env.local
.env.*.local

# 日志文件
*.log

# 缓存文件
.cache/

# IDE 文件
.vscode/
.idea/

# 操作系统文件
.DS_Store

# Git
.git/

# Docker 相关
Dockerfile*
docker-compose*

# 测试文件
coverage/
EOF

echo "5. 清理完成"
echo ""
echo "=== 请手动启动 Docker Desktop ==="
echo "启动命令: open -a Docker"
echo ""
echo "等待 Docker 完全启动后（状态栏图标变绿），再运行:"
echo "  docker-compose up -d --build"