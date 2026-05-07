#!/bin/bash
# 配置 Docker 使用代理

echo "=== Docker 代理配置脚本 ==="
echo ""

# 检测系统代理设置
echo "检测系统代理设置..."

# 检查常见的代理环境变量
HTTP_PROXY_VALUE=""
HTTPS_PROXY_VALUE=""

if [ -n "$http_proxy" ]; then
    HTTP_PROXY_VALUE="$http_proxy"
elif [ -n "$HTTP_PROXY" ]; then
    HTTP_PROXY_VALUE="$HTTP_PROXY"
fi

if [ -n "$https_proxy" ]; then
    HTTPS_PROXY_VALUE="$https_proxy"
elif [ -n "$HTTPS_PROXY" ]; then
    HTTPS_PROXY_VALUE="$HTTPS_PROXY"
fi

# 如果没有检测到，使用常见的代理端口
if [ -z "$HTTP_PROXY_VALUE" ]; then
    echo "未检测到系统代理环境变量"
    echo "请手动输入代理地址（例如：http://127.0.0.1:7890）"
    read -p "HTTP 代理地址: " HTTP_PROXY_VALUE
fi

if [ -z "$HTTPS_PROXY_VALUE" ]; then
    HTTPS_PROXY_VALUE="$HTTP_PROXY_VALUE"
fi

echo ""
echo "使用代理地址:"
echo "  HTTP_PROXY: $HTTP_PROXY_VALUE"
echo "  HTTPS_PROXY: $HTTPS_PROXY_VALUE"
echo ""

# 创建 Docker 代理配置目录
mkdir -p ~/.docker

# 配置 Docker Desktop 使用代理
echo "配置 Docker Desktop..."

# 方法1：通过 Docker Desktop 设置（推荐）
cat << EOF

=== 方法一：Docker Desktop 图形界面设置（推荐）===

1. 打开 Docker Desktop
2. 点击设置（Settings）
3. 选择 Resources → Proxies
4. 勾选 "Manual proxy configuration"
5. 填写：
   - Web Server (HTTP): $HTTP_PROXY_VALUE
   - Secure Web Server (HTTPS): $HTTPS_PROXY_VALUE
   - Bypass proxy settings for these hosts: localhost,127.0.0.1
6. 点击 Apply & Restart

=== 方法二：命令行设置环境变量 ===

在构建前执行以下命令：

export HTTP_PROXY="$HTTP_PROXY_VALUE"
export HTTPS_PROXY="$HTTPS_PROXY_VALUE"
export NO_PROXY="localhost,127.0.0.1"

然后运行：
docker-compose up -d --build

=== 方法三：创建 docker-compose 代理配置 ===

EOF

# 创建带代理的 docker-compose 配置
cat > docker-compose.proxy.yml << COMPOSEEOF
services:
  jewelry-shop:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - HTTP_PROXY=${HTTP_PROXY_VALUE}
        - HTTPS_PROXY=${HTTPS_PROXY_VALUE}
        - http_proxy=${HTTP_PROXY_VALUE}
        - https_proxy=${HTTPS_PROXY_VALUE}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - HTTP_PROXY=${HTTP_PROXY_VALUE}
      - HTTPS_PROXY=${HTTPS_PROXY_VALUE}
    volumes:
      - .:/app
      - /app/node_modules
    working_dir: /app
    stdin_open: true
    tty: true
    restart: unless-stopped
COMPOSEEOF

echo "已创建 docker-compose.proxy.yml"
echo ""
echo "使用方法三构建："
echo "  docker-compose -f docker-compose.proxy.yml up -d --build"
echo ""

# 创建便捷脚本
cat > build-with-proxy.sh << BUILDEOF
#!/bin/bash
# 使用代理构建 Docker 镜像

export HTTP_PROXY="$HTTP_PROXY_VALUE"
export HTTPS_PROXY="$HTTPS_PROXY_VALUE"
export NO_PROXY="localhost,127.0.0.1,.docker.io"

echo "使用代理构建..."
echo "HTTP_PROXY: \$HTTP_PROXY"
echo "HTTPS_PROXY: \$HTTPS_PROXY"

docker-compose up -d --build
BUILDEOF

chmod +x build-with-proxy.sh

echo "已创建 build-with-proxy.sh 脚本"
echo "直接运行 ./build-with-proxy.sh 即可使用代理构建"
