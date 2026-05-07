#!/bin/bash
# 使用代理构建 Docker 镜像

export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1"

echo "使用代理构建..."
echo "HTTP_PROXY: $HTTP_PROXY"
echo "HTTPS_PROXY: $HTTPS_PROXY"
echo ""
echo "注意：此方案使用本地 node_modules，需要在本地先安装依赖"
echo ""

# 检查本地是否有 node_modules
if [ ! -d "node_modules" ]; then
    echo "⚠️  本地 node_modules 不存在，正在安装依赖..."
    npm install
fi

# 构建并启动
docker-compose up -d --build

echo ""
echo "✅ 构建完成！"
echo "访问 http://localhost:3000 查看应用"
