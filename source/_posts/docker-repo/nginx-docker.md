---
title: Docker 部署 Nginx 最佳实践
date: 2025-03-11 15:22:29
type: "dockers"         # 分类标识
categories:
  - 技术文档
  - docker-libs # 关联到专题名分类
tags:
  - Docker
  - Nginx
---
```yml
version: '3'
services:
  nginx:
    restart: always
    container_name: nginx
    image: nginx
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./website/html:/usr/share/nginx/html
      #- /usr/local/nginx/www:/var/www
      #- /usr/local/nginx/logs:/var/log/nginx
      # 有可能会出现不能挂载，这个时候用手动拷贝配置文件就行
      - ./nginx.conf:/etc/nginx/nginx.conf
      #- /usr/local/nginx/etc/cert:/etc/nginx/cert
      #- /usr/local/nginx/conf.d:/etc/nginx/conf.d
    environment:
      - NGINX_PORT=80
      - TZ=Asia/Shanghai
    privileged: true
```

```conf
server{
       listen 80;
       server_name localhost huai-xhy.site; # 博客路有
       charset utf-8;

       location / {
          # 此处一定要改成nginx容器中的目录地址，宿主机上的地址容器访问不到
          # 命令必须用 root, 不能用 alias
          root   /usr/share/nginx/html/blogdist;
          try_files $uri $uri/ =404;
          index  index.html index.htm;
       }
       
       #error_page  404              /404.html;

       # redirect server error pages to the static page /50x.html
       #
       error_page   500 502 503 504  /50x.html;
       location = /50x.html {
           root   html;
       }
    }
```