---
title: hexo初始化使用文档
date: 2025-03-11 17:11:39
tags:
  - hexo
categories: 
  - 技术文档 
  - hexo
keywords:
top_img:
cover:
---

# hexo 环境准备
[hexo文档](https://hexo.io/zh-cn/docs/)
```bash
npm init -y # 初始化npm
npm install -g hexo-cli # 可以使用全局
hexo init xhyblog
cd xhyblog
bun install # 
```
# Butterfly 安装依赖
[Butterfly文档](https://butterfly.js.org/)
```bash
# 安装 Butterfly 主题
# 在项目目录下运行以下命令，克隆 Butterfly 主题到 themes/butterfly 目录：
# /xhyblog 中 git clone
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

Butterfly 主题依赖 Pug 和 Stylus 渲染器，需要安装以下插件：
```bash
bun add hexo-renderer-pug hexo-renderer-stylus --save
```
## 配置主题
{% img /images/documents/hexo-framework.webp 360 360 '' '' %}
打开 Hexo 的配置文件 _config.yml，将主题设置为 butterfly：
```bash
theme: butterfly
```
## 本地预览
在项目目录下运行以下命令，启动本地服务器：
```bash
hexo server
```
[butterfly主题配置文档](https://butterfly.js.org/posts/4aa8abbe/#%E6%90%9C%E7%B4%A2)

```bash
bun add hexo-generator-search --save
```

## 音乐插件
[音乐插件文档](https://butterfly.js.org/posts/4073eda/#%E9%9F%B3%E6%A8%82)
[对应github](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md)

```bash
bun add --save hexo-tag-aplayer
```