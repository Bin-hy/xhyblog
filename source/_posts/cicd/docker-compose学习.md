---
title: docker-compose语法学习
date: 2025-07-2 11:23:22
categories:
  - CI/CD
  - docker
tags:
  - 容器
  - 一键部署容器
keywords:
top_img: # /images/ganzhou/1.png # 建议添加顶部横幅图
description: docker-compose编写语法 
cover: # /images/ganzhou/1.png
---
## cnb 链接
[CNB教程](https://cnb.cool/Bin-hy/docker-exercises/-/blob/main/5_compose/README.md)

## 深入浅出 Docker Compose：一键部署多容器应用的利器

在 Docker 的世界里，当我们处理单个容器时，`Dockerfile` 表现出色。但当你的应用程序变得更加复杂，包含多个相互依赖的服务（例如，一个 Web 应用、一个数据库、一个缓存服务），手动管理这些容器的启动、链接和配置就会变得异常繁琐且容易出错。

这时，**Docker Compose** 就登场了！它是一个定义和运行多容器 Docker 应用程序的工具。通过一个简单的 YAML 文件，你可以配置所有应用服务，然后使用一个命令从配置中创建并启动所有服务。本文将带你全面学习 Docker Compose，助你轻松管理你的多容器应用。

-----

### 为什么选择 Docker Compose？

想象一下你的应用程序需要以下组件：

  * 一个前端 Web 服务器 (Nginx)
  * 一个后端 API 服务 (Node.js/Python/Java)
  * 一个数据库 (PostgreSQL/MySQL)
  * 一个缓存服务 (Redis)

如果没有 Docker Compose，你需要：

1.  为每个服务编写独立的 `Dockerfile`。
2.  分别构建每个镜像。
3.  使用 `docker run` 命令启动每个容器，并手动设置网络、端口映射、卷挂载等。
4.  确保它们能正确地相互通信。

这简直是一场噩梦！Docker Compose 的出现解决了这些痛点：

  * **集中配置：** 将所有服务的配置统一在一个 `docker-compose.yml` 文件中。
  * **一键部署：** 使用 `docker compose up` 命令即可启动所有服务，无需手动逐个启动。
  * **服务发现：** 容器之间可以自动通过服务名称进行通信，无需复杂的 IP 配置。
  * **环境隔离：** 轻松创建隔离的开发、测试和生产环境。
  * **版本控制：** 将 `docker-compose.yml` 文件纳入版本控制，方便团队协作和回溯。

-----

### Docker Compose 的核心：`docker-compose.yml` 文件

`docker-compose.yml` 文件是 Docker Compose 的核心，它使用 YAML 格式定义了你的多容器应用程序。让我们来看一个典型的结构：

```yaml
version: '3.8' # Docker Compose 文件格式版本

services:    # 定义所有服务
  web:       # 服务名称
    build: . # 从当前目录的 Dockerfile 构建镜像
    ports:
      - "80:80" # 端口映射：宿主机端口:容器端口
    depends_on: # 依赖关系，确保 db 服务先启动
      - db
    environment: # 环境变量
      NODE_ENV: production
      DATABASE_URL: postgres://user:password@db:5432/mydatabase
    volumes: # 卷挂载
      - ./app:/app # 宿主机路径:容器路径

  db:
    image: postgres:14 # 使用 Docker Hub 上的 PostgreSQL 镜像
    environment:
      POSTGRES_DB: mydatabase
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data # 持久化数据卷

  cache:
    image: redis:latest # 使用 Redis 镜像
    ports:
      - "6379:6379"

volumes: # 定义命名卷，用于持久化数据
  db_data:
```

-----

### `docker-compose.yml` 关键指令详解

#### 1\. `version`：文件格式版本

这是 `docker-compose.yml` 文件的顶层键，指定了 Docker Compose 文件的格式版本。建议使用最新的稳定版本，例如 `'3.8'`。不同版本支持的指令和功能可能有所不同。

#### 2\. `services`：定义你的应用程序服务

`services` 部分是 Docker Compose 文件的核心，它定义了你的应用程序中所有的服务。每个服务都是一个独立的容器。

在每个服务下，你可以定义以下常用选项：

  * **`build`：**

      * **语法：** `build: <path>` 或 `build: { context: <path>, dockerfile: <filename>, args: { <key>: <value> } }`
      * **作用：** 指定 Dockerfile 的路径，Docker Compose 将会在此路径下构建镜像。
      * **示例：** `build: .` (表示当前目录的 Dockerfile)

  * **`image`：**

      * **语法：** `image: <image_name>[:<tag>]`
      * **作用：** 指定要使用的 Docker 镜像。如果同时指定 `build`，则优先使用 `build` 构建的镜像。
      * **示例：** `image: nginx:latest`

  * **`ports`：**

      * **语法：** `- "<host_port>:<container_port>"`
      * **作用：** 将宿主机端口映射到容器端口。
      * **示例：** `- "8080:80"` (将宿主机的 8080 端口映射到容器的 80 端口)

  * **`volumes`：**

      * **语法：**
          * `- "<host_path>:<container_path>"` (绑定挂载)
          * `- "<volume_name>:<container_path>"` (命名卷挂载)
      * **作用：** 用于持久化数据或共享数据。
      * **示例：**
          * `- ./data:/app/data` (将当前目录的 `data` 目录挂载到容器的 `/app/data`)
          * `- db_data:/var/lib/postgresql/data` (将名为 `db_data` 的命名卷挂载到容器的 `/var/lib/postgresql/data`)

  * **`environment`：**

      * **语法：**
          * `- <KEY>=<VALUE>`
          * `<KEY>: <VALUE>`
      * **作用：** 设置容器内部的环境变量。
      * **示例：** `environment: - DEBUG=true`

  * **`depends_on`：**

      * **语法：** `- <service_name>`
      * **作用：** 定义服务之间的启动依赖关系。Docker Compose 会确保依赖的服务先启动。
      * **注意：** `depends_on` 只保证服务的启动顺序，不保证服务内部的应用程序已经完全就绪。对于应用程序的就绪检查，你需要结合 `healthcheck` (在服务定义中) 或在你的应用程序代码中实现重试机制。
      * **示例：** `depends_on: - db`

  * **`networks`：**

      * **语法：** `- <network_name>`
      * **作用：** 指定服务连接的网络。Docker Compose 默认会创建一个内部网络，允许服务通过服务名称互相通信。
      * **示例：** `networks: - my_app_net`

  * **`env_file`：**

      * **语法：** `env_file: <path_to_env_file>`
      * **作用：** 从外部 `.env` 文件加载环境变量。
      * **示例：** `env_file: ./.env`

  * **`restart`：**

      * **语法：** `restart: <policy>`
      * **作用：** 定义容器的重启策略。常用的策略有 `no` (不重启)、`on-failure` (退出码非零时重启)、`always` (总是重启)、`unless-stopped` (除非手动停止)。
      * **示例：** `restart: always`

#### 3\. `networks`：定义网络

`networks` 部分用于自定义网络。Docker Compose 默认会为你的项目创建一个内部桥接网络，允许服务通过服务名称相互发现。如果你需要更复杂的网络配置（例如，将容器连接到现有的外部网络），可以在这里定义。

  * **语法：**
    ```yaml
    networks:
      <network_name>:
        driver: <driver_name> # 桥接、host、overlay等
        external: true        # 使用已存在的外部网络
    ```
  * **示例：**
    ```yaml
    networks:
      my_custom_network:
        driver: bridge
      existing_network:
        external: true
        name: my-pre-existing-network
    ```

#### 4\. `volumes`：定义命名卷

`volumes` 部分用于定义命名卷 (Named Volumes)。命名卷是 Docker 管理的数据存储，推荐用于持久化数据，因为它不依赖于宿主机的文件系统路径，更易于管理和备份。

  * **语法：**
    ```yaml
    volumes:
      <volume_name>:
        driver: <driver_name> # 可选，默认为 local
    ```
  * **示例：**
    ```yaml
    volumes:
      db_data:
        driver: local
      logs:
    ```

-----

### Docker Compose 常用命令

掌握以下 Docker Compose 命令，你就能轻松管理你的多容器应用：

  * **`docker compose up`：**

      * **作用：** 构建（如果需要）并启动所有服务。
      * **常用选项：**
          * `-d`：后台运行容器 (detached mode)。
          * `--build`：强制重新构建服务镜像。
          * `--no-recreate`：如果容器已经存在且配置没有改变，则不重新创建。
          * `--force-recreate`：强制重新创建容器。
      * **示例：** `docker compose up -d`

  * **`docker compose down`：**

      * **作用：** 停止并移除由 `up` 命令创建的容器、网络、卷和镜像。
      * **常用选项：**
          * `-v`：同时移除匿名卷和命名卷。
          * `--rmi all`：移除所有服务镜像。
      * **示例：** `docker compose down -v`

  * **`docker compose ps`：**

      * **作用：** 列出所有服务的运行状态。
      * **示例：** `docker compose ps`

  * **`docker compose logs [service_name]`：**

      * **作用：** 查看服务的日志输出。
      * **常用选项：**
          * `-f`：跟踪日志输出 (follow)。
      * **示例：** `docker compose logs web`

  * **`docker compose exec <service_name> <command>`：**

      * **作用：** 在运行中的服务容器内执行命令。
      * **示例：** `docker compose exec db psql -U user mydatabase`

  * **`docker compose build [service_name]`：**

      * **作用：** 构建（或重新构建）服务镜像。
      * **示例：** `docker compose build web`

  * **`docker compose pull [service_name]`：**

      * **作用：** 拉取服务所需的镜像。
      * **示例：** `docker compose pull db`

-----

### Docker Compose 的工作流

典型的 Docker Compose 工作流如下：

1.  **编写 `Dockerfile`：** 为每个服务（如果需要自定义镜像）编写 `Dockerfile`。
2.  **编写 `docker-compose.yml`：** 定义所有服务、端口、卷、网络等配置。
3.  **启动应用程序：** 在 `docker-compose.yml` 所在的目录运行 `docker compose up -d`。
4.  **查看状态和日志：** 使用 `docker compose ps` 和 `docker compose logs` 监控应用程序。
5.  **停止和移除：** 当不再需要应用程序时，运行 `docker compose down`。
6.  **迭代和修改：** 修改 `Dockerfile` 或 `docker-compose.yml` 后，再次运行 `docker compose up --build -d` 来更新和部署。

-----

### 最佳实践与高级用法

  * **项目结构：** 建议将 `docker-compose.yml` 文件放在项目根目录，每个服务的 `Dockerfile` 放在对应的子目录中。
  * **环境变量：** 优先使用 `.env` 文件来管理敏感信息或不同环境的配置，并通过 `env_file` 指令加载。
  * **健康检查 (Healthcheck)：** 在服务定义中添加 `healthcheck` 可以帮助 Docker Compose 更好地判断服务是否真正就绪，而不是仅仅启动。
    ```yaml
    services:
      web:
        # ...
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost/health"]
          interval: 30s
          timeout: 10s
          retries: 3
    ```
  * **扩展性：** 使用 `extends` 或多个 Compose 文件来管理复杂的配置，例如：
      * `docker-compose.yml` (基础配置)
      * `docker-compose.dev.yml` (开发环境特定配置，如挂载代码)
      * `docker-compose.prod.yml` (生产环境特定配置)
        然后使用 `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` 来启动。
  * **命名卷：** 总是使用命名卷来持久化数据库数据等重要信息，而不是绑定挂载到宿主机特定路径。
  * **服务名称：** 服务名称在 Compose 内部就是 DNS 名称，可以直接用于服务间的通信。

-----

### 总结

Docker Compose 极大地简化了多容器 Docker 应用程序的开发、测试和部署。通过一个简单的 YAML 文件，你就能定义整个应用的架构，并通过一条命令启动所有服务。掌握 Docker Compose 是成为 Docker 高手的必经之路，它将让你从繁琐的手动管理中解脱出来，专注于你的应用程序本身。

现在，是时候将你的多容器应用程序用 Docker Compose 组织起来，体验它带来的便利和效率了！