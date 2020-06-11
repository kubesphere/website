---
title: '基于 Kubernetes 部署 node.js APP'
tag: 'Kubernetes'
createTime: '2019-08-25'
author: 'Leo Liu'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20190930145646.png'
---


### 什么是 Kubernetes

Kubernetes 是一个开源容器编排引擎，可以帮助开发者或运维人员部署和管理容器化的应用，能够轻松完成日常开发运维过程中诸如 滚动更新，横向自动扩容，服务发现，负载均衡等需求。[了解更多](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

### 安装 Kubernetes

可以通过快速安装 kubernetes 集群：

- [KubeSphere Installer](https://github.com/kubesphere/kubesphere)
- [minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)
- [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

### Kubernetes 术语介绍

#### [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/)
Pod 是 Kubernetes 最小调度单位，是一个或一组容器的集合。

#### [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
提供对 Pod 的声明式副本控制。指定 Pod 模版，Pod 副本数量, 更新策略等。

#### [Service](https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/)
Service 定义了 Pod 的逻辑分组和一种可以访问它们的策略。借助Service，应用可以方便的实现服务发现与负载均衡。

#### [Label & Selector](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
Kubernetes 中使用 Label 去关联各个资源。

1. 通过资源对象(Deployment, etc.)上定义的 Label Selector 来筛选 Pod 数量。
2. 通过 Service 的 Label Selector 来选择对应的 Pod， 自动建立起每个 Service 到对应 Pod 的请求转发路由表。
3. 通过对某些 Node 定义特定的 Label，并且在 Pod 中添加 NodeSelector 属性，可以实现 Pod 的定向调度(运行在哪些节点上)。

### Nodejs 模板项目
[node-express-realworld-example-app](https://github.com/gothinkster/node-express-realworld-example-app) 是一款 node.js 编写的后端示例应用。使用 Express 作为网络框架，使用 mongodb 持久化数据，使用 jwt 作用户认证等。

#### 项目分析

1. 分析 package.json, 将使用 ``npm start`` 作为容器启动命令，并依赖于一个 ``realworld-mongo`` 的容器服务。

```json
{
  "scripts": {
    "mongo:start": "docker run --name realworld-mongo -p 27017:27017 mongo & sleep 5",
    "start": "node ./app.js",
    "dev": "nodemon ./app.js",
    "test": "newman run ./tests/api-tests.postman.json -e ./tests/env-api-tests.postman.json",
    "stop": "lsof -ti :3000 | xargs kill",
    "mongo:stop": "docker stop realworld-mongo && docker rm realworld-mongo"
  },
}
```

2. 全局搜索 ``process.env.``并分析代码, 生产环境需要 的环境变量有:

```shell
NODE_ENV                # 应设置为 production
MONGODB_URI             # mondodb 服务路径
PORT                    # nodejs 服务端口, 默认3000
SECRET                  # jwt token 的私钥
```

#### 在项目根目录添加 Dockerfile:
```Dockerfile
FROM mhart/alpine-node:8
WORKDIR /root/demo
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### 打包镜像
```shell
docker build -t example-app .
```

#### 推送镜像到 [Docker Hub](https://hub.docker.com/)

```shell
docker login -u $DOCKERHUB_USER -p $DOCKERHUB_PASSWORD
docker tag example-app $DOCKERHUB_USER/example-app:v0.1.0
docker push $DOCKERHUB_USER/example-app:v0.1.0
```

### 部署 MongoDB

此应用将分为两个服务部署，一个是包含 Nodejs 主程序的 example-app 服务，一个提供存储的 mognodb 服务。

mongodb 使用 https://hub.docker.com/_/mongo 作为镜像，因为有持久化数据，在单节点模式下可以使用 HostPath 挂载存储（多节点模式或挂载 PVC 存储形式推荐使用 [KubeSphere](https://kubesphere.io/) 部署集群, 省去繁琐的配置），通过 Service 将服务暴露到 k8s 内部。

mongodb.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: default
  labels: &ref_0
    app: mongodb
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels: *ref_0
  template:
    metadata:
      labels: *ref_0
    spec:
      containers:
        - name: container-ur9rxw
          image: mongo
          imagePullPolicy: IfNotPresent
          ports:
            - name: http-mongo
              protocol: TCP
              containerPort: 27017
          volumeMounts:
            - readOnly: false
              mountPath: /data/db
              name: mongodb
      serviceAccount: default
      volumes:
      - hostPath:
          path: /data/db
          type: DirectoryOrCreate
        name: mongodb-pvc
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate

```

配置文件中主要包含：
1. 定义了 Pod 运行时的镜像 ``mongo``，
2. 暴露 mognodb 服务到 27017 端口
3. 声明了一个 hostPath，将主机上的 /data/db 路径挂载到容器的 /data/db 路径上(mongodb 默认数据存放路径)。

在 kubernetes 集群中执行 kubectl 部署
```shell
kubectl apply -f mongodb.yaml
```

查看 pod 运行情况：
```shell
root@i-auleonob:/home/ubuntu# kubectl get pods
NAME                       READY   STATUS    RESTARTS   AGE
mongodb-54f949cb5c-r48bj   1/1     Running   0          42s
```

pod 已成功运行起来

查看 mongodb 服务日志:
```shell
root@i-auleonob:/home/ubuntu# kubectl logs mongodb-54f949cb5c-r48bj
2019-09-09T14:05:05.127+0000 I  CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
2019-09-09T14:05:05.132+0000 I  CONTROL  [initandlisten] MongoDB starting : pid=1 port=27017 dbpath=/data/db 64-bit host=mongodb-54f949cb5c-r48bj
2019-09-09T14:05:05.132+0000 I  CONTROL  [initandlisten] db version v4.2.0
2019-09-09T14:05:05.132+0000 I  CONTROL  [initandlisten] git version: a4b751dcf51dd249c5865812b390cfd1c0129c30
2019-09-09T14:05:05.132+0000 I  CONTROL  [initandlisten] OpenSSL version: OpenSSL 1.1.1  11 Sep 2018
...
2019-09-09T14:05:06.180+0000 I  NETWORK  [initandlisten] Listening on 0.0.0.0
2019-09-09T14:05:06.180+0000 I  NETWORK  [initandlisten] waiting for connections on port 27017
...
```
从日志可以看到 mongodb 已成功启动，并监听 27017 端口,  但此时在集群中还无法访问该端口，需要创建一个服务将端口映射到集群。

### 创建 MongoDB 服务

mongodb-service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  namespace: default
  labels: &ref_0
    app: mongodb
  name: mongodb-service
spec:
  type: ClusterIP
  sessionAffinity: None
  selector: *ref_0
  ports:
    - name: http-mongo
      protocol: TCP
      port: 27017
      targetPort: 27017

```

在 kubernetes 集群中执行 kubectl 创建服务
```shell
kubectl apply -f mongodb-service.yaml
```

查看服务详情
```shell
root@i-auleonob:/home/ubuntu# kubectl describe svc/mongodb-service
Name:              mongodb-service
Namespace:         default
Labels:            app=mongodb
Annotations:       kubectl.kubernetes.io/last-applied-configuration:
                     {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"app":"mongodb"},"name":"mongodb-service","namespace":"default"...
Selector:          app=mongodb
Type:              ClusterIP
IP:                10.102.156.99
Port:              http-mongo  27017/TCP
TargetPort:        27017/TCP
Endpoints:         192.168.219.10:27017
Session Affinity:  None
Events:            <none>
```

透过 [Kubernetes DNS](https://kubernetes.io/docs/concepts/services-networking/service/#dns)，在集群内部可以使用 ``mongodb-service.default:27017`` 访问到 mongodb 服务。

### 部署 Example App

example-app 无需挂载存储卷，但容器的启动时需要必要的环境变量。在 env 中填入必要的环境变量，通过 mongodb-service.default 来访问 mongodb 服务。该端口无需暴露到主机上，service 类型选择使用 [ClusterIP](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)。

example-app.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: default
  labels:
    version: v1
    app: example-app
  name: example-app-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: example-app
  template:
    metadata:
      labels:
        version: v1
        app: example-app
    spec:
      containers:
      - name: container-l6cx0m
        image: leoendlessx/example-app:v0.1.0
        imagePullPolicy: IfNotPresent
        ports:
        - name: http-app
          protocol: TCP
          containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: MONGODB_URI
          value: mongodb-service.default    # 使 用kubernetes 内部 DNS 来访问 mongodb 服务
        - name: SECRET
          value: asecretkey
      serviceAccount: default
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%

```

在 kubernetes 集群中执行 kubectl 部署
```shell
kubectl apply -f example-app.yaml
```

查看 Pod 状态及日志
```shell
root@i-auleonob:/home/ubuntu# kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
example-app-v1-5678d8db79-7nhkd   1/1     Running   0          26s
mongodb-54f949cb5c-r48bj          1/1     Running   0          71m
root@i-auleonob:/home/ubuntu# kubectl logs example-app-v1-5678d8db79-7nhkd

> conduit-node@1.0.0 start /root/demo
> node ./app.js

Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
Listening on port 3000
```

example-app 程序已成功启动，现在需将服务暴露主机节点上访问，以便主机网络将端口映射到外网。service 类型选择 [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)

### 创建 Example App 服务到并暴露到主机

```yaml
apiVersion: v1
kind: Service
metadata:
  namespace: default
  labels: &ref_0
    version: v1
    app: example-app
  name: example-app
spec:
  type: NodePort
  sessionAffinity: ClientIP
  selector: *ref_0
  ports:
    - name: http-app
      protocol: TCP
      port: 3000
      targetPort: 3000

```

在 kubernetes 集群中执行 kubectl 创建服务
```shell
kubectl apply -f example-app-service.yaml
```

查看服务详情
```shell
root@i-auleonob:/home/ubuntu# kubectl describe svc/example-app
Name:                     example-app
Namespace:                default
Labels:                   app=example-app
                          version=v1
Annotations:              kubectl.kubernetes.io/last-applied-configuration:
                            {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"app":"example-app","version":"v1"},"name":"example-app","names...
Selector:                 app=example-app,version=v1
Type:                     NodePort
IP:                       10.106.109.178
Port:                     http-app  3000/TCP
TargetPort:               3000/TCP
NodePort:                 http-app  30375/TCP
Endpoints:                192.168.219.48:3000
Session Affinity:         ClientIP
External Traffic Policy:  Cluster
Events:                   <none>
```

在节点上访问：
```shell
root@i-auleonob:/home/ubuntu# curl 127.0.0.1:30375
{"errors":{"message":"Not Found","error":{}}}
```
可见 example-app 可以正常访问，不过仍需要确认是否能正常访问 mongodb。

> example-app 容器需要等待 mongodb service 可用时, 才可以正常启动。在 mongodb service 可用后, 手动删除旧的 example-app Pod 即可。

### 测试 Example App 服务
#### 注册用户
```shell
curl -X POST \
  'http://127.0.0.1:30375/api/users' \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache' \
  -d '{"user":{"email":"john@jacob.com", "password":"johnnyjacob", "username":"johnjacob"}}'
{"user":{"username":"johnjacob","email":"john@jacob.com","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzY3MmMzMzdjNGI5MTAwMGVhZmIzYyIsInVzZXJuYW1lIjoiam9obmphY29iIiwiZXhwIjoxNTczMjI3NzE1LCJpYXQiOjE1NjgwNDM3MTV9.24OGisacl8-n4SooYr8kdcAOYTBvz27sC1mUyU3VkKM"}}
```

#### 登录
```shell
curl -X POST \
  'http://127.0.0.1:30375/api/users/login' \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache' \
  -d '{"user":{"email":"john@jacob.com", "password":"johnnyjacob"}}'
{"user":{"username":"johnjacob","email":"john@jacob.com","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzY3MmMzMzdjNGI5MTAwMGVhZmIzYyIsInVzZXJuYW1lIjoiam9obmphY29iIiwiZXhwIjoxNTczMjI3ODcwLCJpYXQiOjE1NjgwNDM4NzB9.a5p0mCLZLSNbTCECjK9j-5hrgg-tA7mI5iENKdik5Xc"}}
```

#### 创建 Article
```shell
curl -X POST \
  'http://127.0.0.1:30375/api/articles' \
  -H 'Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzY3MmMzMzdjNGI5MTAwMGVhZmIzYyIsInVzZXJuYW1lIjoiam9obmphY29iIiwiZXhwIjoxNTczMjI3ODcwLCJpYXQiOjE1NjgwNDM4NzB9.a5p0mCLZLSNbTCECjK9j-5hrgg-tA7mI5iENKdik5Xc' \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache' \
  -d '{"article":{"title":"How to train your dragon", "description":"Ever wonder how?", "body":"Very carefully.", "tagList":["dragons","training"]}}'
{"article":{"slug":"how-to-train-your-dragon-estl69","title":"How to train your dragon","description":"Ever wonder how?","body":"Very carefully.","createdAt":"2019-09-09T15:46:26.935Z","updatedAt":"2019-09-09T15:46:26.935Z","tagList":["dragons","training"],"favorited":false,"favoritesCount":0,"author":{"username":"johnjacob","image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false}}}
```

#### 获取所有 Articles
```shell
curl -X GET \
  'http://127.0.0.1:30375/api/articles' \
  -H 'Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzY3MmMzMzdjNGI5MTAwMGVhZmIzYyIsInVzZXJuYW1lIjoiam9obmphY29iIiwiZXhwIjoxNTczMjI3ODcwLCJpYXQiOjE1NjgwNDM4NzB9.a5p0mCLZLSNbTCECjK9j-5hrgg-tA7mI5iENKdik5Xc' \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
{"articles":[{"slug":"how-to-train-your-dragon-estl69","title":"How to train your dragon","description":"Ever wonder how?","body":"Very carefully.","createdAt":"2019-09-09T15:46:26.935Z","updatedAt":"2019-09-09T15:46:26.935Z","tagList":["dragons","training"],"favorited":false,"favoritesCount":0,"author":{"username":"johnjacob","image":"https://static.productionready.io/images/smiley-cyrus.jpg","following":false}}],"articlesCount":1}
```

通过测试可发现 example-app 与 mongodb 服务运行正常。

<!-- ### 使用 KubeSphere UI 部署服务
[KubeSphere](https://kubesphere.io/) 是一款简单易用的 kubernetes 开源发行版, 可视化的部署操作大大降低运维难度。 -->
