#!/bin/bash
# 完全修复 Docker 500 错误

echo "=== Docker 完全修复脚本 ==="
echo ""

# 1. 停止 Docker Desktop
echo "1. 停止 Docker Desktop..."
osascript -e 'quit app "Docker"' 2>/dev/null
sleep 5

# 2. 强制结束所有 Docker 进程
echo "2. 结束残留进程..."
sudo pkill -9 -f "Docker" 2>/dev/null
sudo pkill -9 -f "docker" 2>/dev/null
sleep 3

# 3. 清理 Docker 数据
echo "3. 清理 Docker 数据..."
rm -rf ~/Library/Containers/com.docker.docker 2>/dev/null
rm -rf ~/.docker 2>/dev/null
rm -rf /var/run/docker.sock 2>/dev/null

# 4. 重新创建 Docker 配置目录
echo "4. 创建新的配置..."
mkdir -p ~/.docker

# 5. 创建最小化配置
cat > ~/.docker/daemon.json << 'EOF'
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false
}
EOF

echo ""
echo "=== 修复完成 ==="
echo ""
echo "请手动启动 Docker Desktop:"
echo "  open -a Docker"
echo ""
echo "等待 Docker 完全启动后，再尝试拉取镜像:"
echo "  docker pull alpine:3.20"
