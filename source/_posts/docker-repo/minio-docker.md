---
title: Docker 部署 minio 最佳实践
date: 2025-03-11 15:42:01
type: "dockers"         # 分类标识
categories:
  - 技术文档
  - docker-libs # 关联到专题名分类
tags:
  - Docker
  - Minio
---

# minio 的docker compose
```yml
version: "3.7"
services:
  minio:
    image: "quay.io/minio/minio:RELEASE.2022-08-02T23-59-16Z"
    ports:
      - "2590:2590"
      - "2591:2591"
    volumes:
      - "./minio/data1:/data1"
      # - "./minio/data2:/data2"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=c9jA9ZvNXLwfs6n6fog6EJ0396Q77TbEm6G1XeDQbFG02GYwBsMh5wcTeJFzquD6sYE5saMGsrLnXernC5VaxjNfUuKqZxGRh9wf
      # 弃用了
      # - MINIO_ACCESS_KEY=SBM/79pj3tpKU86dcKKPE9LDq4JHv1LxD4dxJY2aNV0Jz3HCMTatYXpFNj8fN3d0UHFQwmnnZAfpKmpdo5zd5Qw4Q671RcJsCun6376v
      # - MINIO_SECRET_KEY=SBM/No7M8syBVYDJDyW9ni6d5oyT1Bn7WzTsQRxQ2RrxKxg46s6BbCartAK4fss4KrWt2p3GrTTXywctNg8cvngKVXNPrK4onL7Eehdu
    command: server /data1 --console-address ":2590" --address ":2591" # --console-address web 为界面端口 --address api请求端口
```