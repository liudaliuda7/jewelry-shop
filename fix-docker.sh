#!/bin/bash
# 修复 Docker 镜像源配置

echo "正在修复 Docker 配置..."

# 备份原配置
if [ -f ~/.docker/daemon.json ]; then
    cp ~/.docker/daemon.json ~/.docker/daemon.json.backup
    echo "已备份原配置到 ~/.docker/daemon.json.backup"
fi

# 创建新的配置（移除镜像加速器）
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

echo "已更新 Docker 配置"
echo "请重启 Docker Desktop 后再次尝试构建"
echo ""
echo "重启命令:"
echo "  osascript -e 'quit app \"Docker\"'"
echo "  sleep 5"
echo "  open -a Docker"