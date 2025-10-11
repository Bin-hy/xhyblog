---
title: FRP 配置及 systemd 自启实现内网穿透
date: 2025-10-10
tags: [FRP, Hexo, Linux, Systemd, 内网穿透, 教程]
---
> 本文整理了 FRP 的服务器端与客户端配置，并提供 systemd 开机自启的配置示例，方便在 Linux 系统上使用。

## 文档
[FRP 文档](https://gofrp.org/zh-cn/docs/setup/)
[FRP 安装包](https://github.com/fatedier/frp/releases)

FRP 安装路径示例：
> `/etc/frp/` 为 FRP 安装路径，包含 `frps` 和 `frpc` 可执行文件，以及配置文件 `frps.toml` 和 `frpc.toml`。

## FRP 服务器端配置 (frps)
### 1. systemd 配置

创建 frps.service 文件：

```bash
sudo vim /etc/systemd/system/frps.service
```

内容如下：

```toml
[Unit]
# 服务名称，可自定义
Description = frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动 frps 的命令，需修改为您的 frps 安装路径
ExecStart = /etc/frp/frps -c /etc/frp/frps.toml
User= root
Restart= on-failure
RestartSec = 5s

[Install]
WantedBy = multi-user.target
```

### 2. frps.toml 配置示例
```toml
bindPort = 7000 # 填写frps配置的端口
auth.token = "auth-token" # 填写自己的token

# 默认为 127.0.0.1，如果需要公网访问，修改为 0.0.0.0
webServer.addr = "0.0.0.0"
webServer.port = 7500 # 管理界面端口，启动frps后，可通过 http://ip:7500 访问
webServer.user = "admin" # 管理界面用户名
webServer.password = "admin" # 管理界面密码

# 允许的端口范围，可根据需要修改
allowPorts = [
    { start = 7001, end = 7100 },
]
```

### 3. systemd 指令管理 FRP
#### 启动 FRP
```bash
sudo systemctl start frps
```

#### 停止 FRP
```bash
sudo systemctl stop frps
```

#### 重启 FRP
```bash
sudo systemctl restart frps
```

#### 查看 FRP 状态
```bash
sudo systemctl status frps
```

## FRP 客户端配置 (frpc)
### 1. frpc.toml 配置示例
```toml
serverAddr = "www.xxx.com 或者 xxx.xxx.xxx.xxx" # 填写frps服务器的IP地址或域名
serverPort = 7000 # 填写frps配置的端口
auth.method = "token"
auth.token = "auth-token" # 填写frps配置的token

[[proxies]]
name = "device-${port}" # 这个端口代理的名称
type = "tcp"
localIP = "127.0.0.1"
localPort = 22 # $ {port} ，代理出去的端口
remotePort = 7001 # frps 服务器映射的端口 
```

### 2. systemd 配置（客户端开机自启）

创建 frpc.service 文件：
```bash
sudo vim /etc/systemd/system/frpc.service
```


内容如下：
```toml
[Unit]
# 服务名称，可自定义
Description = frp client
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动 frpc 的命令，需修改为您的 frpc 安装路径
ExecStart = /etc/frp/frpc -c /etc/frp/frpc.toml
User= root
Restart= on-failure
RestartSec = 5s

[Install]
WantedBy = multi-user.target
```

### 3. systemd 指令管理 FRP 客户端
#### 设置开机自启
```bash
sudo systemctl enable frpc
```

#### 启动 FRP 客户端
```bash
sudo systemctl start frpc
```

#### 停止 FRP 客户端
```bash
sudo systemctl stop frpc
```

#### 重启 FRP 客户端
```bash
sudo systemctl restart frpc
```

#### 查看状态
```bash
sudo systemctl status frpc
```


通过以上配置，你可以在 Linux 上轻松部署 FRP 的服务端和客户端，并实现开机自启管理。