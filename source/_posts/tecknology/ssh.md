---
title: ssh
date: 2025-03-11 19:20:44
tags: 
  - 服务器
  - 非对称加密
categories:
  - 技术文档 
  - ssh使用
keywords: 
  - ssh
  - 服务器
top_img:
cover:
---

# Ubuntu 使用 SSH 创建公私钥

## 1. 打开终端

首先，打开你的 Ubuntu 终端。

## 2. 生成 SSH 密钥对

使用 `ssh-keygen` 命令生成 SSH 密钥对。默认情况下，密钥会生成在 `~/.ssh/` 目录下。以下命令使用 Ed25519 算法（更现代且安全，推荐使用），并添加注释：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**参数说明：**

- `-t ed25519`：指定密钥类型为 Ed25519（更高效，推荐使用）。注意，原博客中错误地将 `-t ed_25519` 写成了 `ed_25519`，且 Ed25519 不需要 `-b 4096` 参数，因为它固定使用 256 位。
- `-C "your_email@example.com"`：添加注释，通常使用你的电子邮件地址。

如果需要使用 RSA 算法（例如，某些旧系统不支持 Ed25519），可以使用以下命令：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**参数说明：**

- `-t rsa`：指定密钥类型为 RSA。
- `-b 4096`：指定密钥长度为 4096 位（更安全）。

## 3. 选择保存位置

系统会提示你选择保存密钥的位置，默认是 `~/.ssh/id_ed25519`（Ed25519 算法）或 `~/.ssh/id_rsa`（RSA 算法）。你可以直接按 Enter 键使用默认位置，或者指定自定义路径。

```bash
Enter file in which to save the key (/home/yourusername/.ssh/id_ed25519):
```

## 4. 设置密码（可选）

系统会提示你为私钥设置密码。直接按 Enter 跳过（无密码），或输入密码以增加安全性。

```bash
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

## 5. 生成密钥

完成上述步骤后，系统会生成 SSH 密钥对，并显示类似以下信息：

```bash
Your identification has been saved in /home/yourusername/.ssh/id_ed25519.
Your public key has been saved in /home/yourusername/.ssh/id_ed25519.pub.
The key fingerprint is:
SHA256:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX your_email@example.com
The key's randomart image is:
+---[ED25519 256]----+
|                 |
|                 |
|                 |
|                 |
|                 |
|                 |
|                 |
|                 |
|                 |
+----[SHA256]-----+
```

## 6. 查看生成的密钥

生成的密钥对保存在 `~/.ssh/` 目录下：

- `id_ed25519`（或 `id_rsa`）：私钥文件，**切勿分享**。
- `id_ed25519.pub`（或 `id_rsa.pub`）：公钥文件，可分享给远程服务器。

使用以下命令查看公钥内容：

```bash
cat ~/.ssh/id_ed25519.pub
```

## 7. 将公钥添加到远程服务器

使用 `ssh-copy-id` 命令将公钥添加到远程服务器的 `~/.ssh/authorized_keys` 文件，实现无密码登录：

```bash
ssh-copy-id username@remote_host
```

替换 `username` 为你的用户名，`remote_host` 为服务器的 IP 地址或域名。

## 8. 测试 SSH 连接

测试是否可以无密码登录远程服务器：

```bash
ssh username@remote_host
```

如果配置正确，你将无需输入密码即可登录。

## 9. 修改 ~/.ssh 目录的权限（可选）

为确保安全性，建议设置 `~/.ssh` 目录和私钥文件的权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
```

**说明：**

- `chmod 700 ~/.ssh`：确保只有你能访问 `~/.ssh` 目录。
- `chmod 600 ~/.ssh/id_ed25519`：确保私钥文件只有你能读写。

## 10. 配置快捷访问

为了简化 SSH 登录（如用 `ssh myserver` 替代 `ssh username@ip`），可以在 `~/.ssh/` 下创建或编辑 `config` 文件：

```bash
vim ~/.ssh/config
```

添加以下内容：

```text
Host myserver
    HostName 192.168.0.1
    Port 22
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
```


```bash
chmod 600 ~/.ssh/config
```

保存后，你可以用以下命令快速登录：

```bash
ssh myserver
```