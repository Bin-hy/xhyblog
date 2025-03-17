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
使用 ssh-keygen 命令生成 SSH 密钥对。默认情况下，密钥会生成在 ~/.ssh/ 目录下。
```bash
ssh-keygen -t ed_25519 -b 4096 -C "your_email@example.com"
```

-   -t rsa：指定密钥类型为 RSA。
-   -b 4096：指定密钥长度为 4096 位（推荐）。
-   -C "your_email@example.com"：添加注释，通常使用你的电子邮件地址。

## 3. 选择保存位置

系统会提示你选择保存密钥的位置，默认是 ~/.ssh/id_rsa。你可以直接按 Enter 键使用默认位置，或者指定一个自定义路径。

```bash
Enter file in which to save the key (/home/yourusername/.ssh/id_rsa):
```
## 5. 生成密钥
完成上述步骤后，系统会生成 SSH 密钥对，并显示如下信息：
```bash
Your identification has been saved in /home/yourusername/.ssh/id_rsa.
Your public key has been saved in /home/yourusername/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX your_email@example.com
The key's randomart image is:
+---[RSA 4096]----+
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
生成的密钥对会保存在 ~/.ssh/ 目录下：

-    id_rsa：私钥文件，​不要分享给任何人。
-    id_rsa.pub：公钥文件，可以分享给需要连接的服务器。

你可以使用以下命令查看公钥内容：
```bash
cat ~/.ssh/id_rsa.pub
```

## 7. 将公钥添加到远程服务器
要将公钥添加到远程服务器，可以使用 ssh-copy-id 命令：

```bash
ssh-copy-id username@remote_host
```
这将把你的公钥复制到远程服务器的 `~/.ssh/authorized_keys` 文件中，从而实现无密码登录。

## 8. 测试 SSH 连接
现在你可以尝试通过 SSH 连接到远程服务器，看看是否不需要输入密码：
```bash
ssh username@remote_host
```

## 9. 修改 ~/.ssh 目录的权限（可选）
为了确保安全性，建议将 ~/.ssh 目录的权限设置为 700，并将私钥文件的权限设置为 600：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
```

## 10. 配置快捷访问
原来的 `ssh <username>@<ip>` 记忆 ip太复杂了
可以简化为 ： `ssh myserver`
可以在本地电脑的`~/.ssh`下创建一个` ~/.ssh/config`文件
```bash
vim ~/.ssh.config
```
编辑别名
```
Host myserver # 别名
    HostName 192.168.0.1 # <ip>
    Port 22 # 端口
    User ubuntu # 用户名 <username>
    IdentityFile /home/sbm/.ssh/id_ed25519 # 私钥地址 
```