---
title: '使用 KubeSphere 部署高可用 RocketMQ 集群'
tag: 'KubeSphere, Kubernetes, RocketMQ'
keywords: 'KubeSphere, Kubernetes, RocketMQ'
description: '本文重点介绍 单 Master 模式和多 Master 多 Slave-异步复制模式在 K8s 集群上的部署方案。'
createTime: '2022-11-18'
author: '张延英'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-k8s-cover.png'
---

> 作者：老Z，云原生爱好者，目前专注于云原生运维，KubeSphere Ambassador。

Spring Cloud Alibaba 全家桶之 RocketMQ  是一款典型的分布式架构下的消息中间件产品，使用异步通信方式和发布订阅的消息传输模型。

很多基于 Spring Cloud 开发的项目都喜欢采用 RocketMQ 作为消息中间件。

RocketMQ 常用的部署模式如下：

- 单 Master 模式
- 多 Master 无 Slave 模式
- 多 Master 多 Slave 模式-异步复制
- 多 Master 多 Slave 模式-同步双写

更多的部署方案详细信息可以参考[官方文档](https://gitee.com/apache/rocketmq/blob/master/docs/cn/operation.md#运维管理 "官方文档")。

本文重点介绍 单 Master 模式和多 Master 多 Slave-异步复制模式在 K8s 集群上的部署方案。

### 单 Master 模式

这种部署方式风险较大，仅部署一个 NameServer 和一个 Broker，一旦 Broker 重启或者宕机时，会导致整个服务不可用，不建议线上生产环境使用，仅可以用于开发和测试环境。

部署方案参考官方[rocketmq-docker](https://github.com/apache/rocketmq-docker "rocketmq-docker")项目中使用的容器化部署方案涉及的镜像、启动方式、定制化配置。

### 多 Master 多 Slave-异步复制模式

每个 Master 配置一个 Slave，有多对 Master-Slave，HA 采用异步复制方式，主备有短暂消息延迟（毫秒级），这种模式的优缺点如下：

- 优点：即使磁盘损坏，消息丢失的非常少，且消息实时性不会受影响，同时 Master 宕机后，消费者仍然可以从 Slave 消费，而且此过程对应用透明，不需要人工干预，性能同多 Master 模式几乎一样；
- 缺点：Master 宕机，磁盘损坏情况下会丢失少量消息。

多 Master 多 Slave-异步复制模式适用于生产环境，部署方案采用官方提供的 [RocketMQ Operator](https://github.com/apache/rocketmq-operator#rocketmq-operator "RocketMQ Operator")。

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-operator-arch.png)

## 离线镜像制作

此过程为可选项，离线内网环境可用，如果不配置内网镜像，后续的资源配置清单中注意容器的 image 参数请使用默认值。

本文分别介绍了单 Master 模式和多 Master 多 Slave-异步复制模式部署 RocketMQ 使用的离线镜像的制作方式。

- 单 Master 模式直接采用 RocketMQ 官方文档中介绍的容器化部署方案中使用的镜像。
- 多 Master 多 Slave-异步复制模式的离线镜像制作方式采用 RocketMQ Operator 官方自带的镜像制作工具制作打包，制作过程中很多包都需要到国外网络下载，但是受限于国外网络访问，默认成功率较低，需要多次尝试或采取特殊手段 ( 懂的都懂)。

  > 也可以用传统的方式手工的 Pull Docker Hub 上已有的镜像，然后再 Push 到私有镜像仓库。

在一台能同时访问互联网和内网 Harbor 仓库的服务器上进行下面的操作。

### 在 Harbor 中创建项目

本人习惯内网离线镜像的命名空间跟应用镜像默认的命名空间保持一致，因此，在 Harbor 中创建 **apache** 和 **apacherocketmq** 两个项目，可以在 Harbor 管理界面中手工创建项目，也可以用下面命令行的方式自动化创建。

```bash
curl -u "admin:Harbor12345" -X POST -H "Content-Type: application/json" https://registry.zdevops.com.cn/api/v2.0/projects -d '{ "project_name": "apache", "public": true}'
curl -u "admin:Harbor12345" -X POST -H "Content-Type: application/json" https://registry.zdevops.com.cn/api/v2.0/projects -d '{ "project_name": "apacherocketmq", "public": true}'
```

### 安装 Go 1.16

RocketMQ Operator 自定义镜像制作需要用到 Go 环境，需要先安装配置。

下载 Go 1.16 系列的最新版：

```bash
cd /opt/
wget https://golang.google.cn/dl/go1.16.15.linux-amd64.tar.gz
```

解压源代码到指定目录：

```bash
tar zxvf go1.16.15.linux-amd64.tar.gz -C /usr/local/
```

配置环境变量：

```bash
cat >> /etc/profile.d/go.sh << EOF
# go environment
export GOROOT=/usr/local/go
export GOPATH=/srv/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
EOF
```

> **GOPATH** 为工作目录也是代码的存放目录，可以根据自己的习惯配置

配置 Go：

```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

验证：

```bash
source /etc/profile.d/go.sh
go verison
```

### 获取 RocketMQ Operator

从 Apache 官方 GitHub 仓库获取 rocketmq-operator 代码。

```bash
cd /srv
git clone -b 0.3.0 https://github.com/apache/rocketmq-operator.git
```

### 制作 RocketMQ Operator Image

修改 DockerFile：

```bash
cd /srv/rocketmq-operator
vi Dockerfile
```

> **Notice:** 构建镜像的过程需访问国外的软件源和镜像仓库，在国内访问有时会受限制，因此可以提前修改为国内的软件源和镜像仓库。
>
> 此操作为可选项，如果访问不受限则不需要配置。

**必要的修改内容**：

```dockerfile
# 第 10 行（修改代理地址为国内地址，加速访问）
# 修改前
RUN go mod download

# 修改后
RUN go env -w GOPROXY=https://goproxy.cn,direct && go mod download

# 第 25 行（修改源地址为国内源）
# 修改前
RUN apk add --no-cache bash gettext nmap-ncat openssl busybox-extras

# 修改后
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk add --no-cache bash gettext nmap-ncat openssl busybox-extras
```

**可选的修改内容**：

```dockerfile
# 默认安装的 ROCKETMQ版本为 4.9.4，可以修改为指定版本
# 第 28 行，修改 4.9.4
ENV ROCKETMQ_VERSION 4.9.4
```

制作镜像：

```bash
yum install gcc
cd /srv/rocketmq-operator
go mod tidy
IMAGE_URL=registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0
make docker-build IMG=${IMAGE_URL}
```

验证镜像构建成功：

```bash
docker images | grep rocketmq-operator
```

推送镜像：

```bash
make docker-push IMG=${IMAGE_URL}
```

清理临时镜像

```bash
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0
```

### 制作 RocketMQ Broker Image

修改 DockerFile(可选)：

```bash
cd /srv/rocketmq-operator/images/broker/alpine
vi Dockerfile
```

> **此操作为可选项，主要是为了安装软件加速，如果访问不受限则不需要配置。**

```dockerfile
# 第 20 行（修改源地址为国内源）
# 修改前
RUN apk add --no-cache bash gettext nmap-ncat openssl busybox-extras

# 修改后
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk add --no-cache bash gettext nmap-ncat openssl busybox-extras
```

修改镜像构建脚本：

```bash
# 修改镜像仓库地址为内网地址

sed -i 's#apacherocketmq#registry.zdevops.com.cn/apacherocketmq#g' build-broker-image.sh
```

构建并推送镜像：

```bash
./build-broker-image.sh 4.9.4
```

验证镜像构建成功：

```bash
docker images | grep rocketmq-broker
```

清理临时镜像：

```bash
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
```

### 制作 RocketMQ Name Server Image

修改 DockerFile(可选)：

```bash
cd /srv/rocketmq-operator/images/namesrv/alpine
vi Dockerfile
```

> **此操作为可选项，主要是为了安装软件加速，如果访问不受限则不需要配置。**

```dockerfile
# 第 20 行（修改源地址为国内源）
# 修改前
RUN apk add --no-cache bash gettext nmap-ncat openssl busybox-extras

# 修改后
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk add --no-cache bash gettext nmap-ncat openssl busybox-extras
```

修改镜像构建脚本：

```bash
# 修改镜像仓库地址为内网地址

sed -i 's#apacherocketmq#registry.zdevops.com.cn/apacherocketmq#g' build-namesrv-image.sh
```

构建并推送镜像：

```bash
./build-namesrv-image.sh 4.9.4
```

验证镜像构建成功：

```bash
docker images | grep rocketmq-nameserver
```

清理临时镜像：

```bash
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.9.4-alpine-operator-0.3.0
```

### 根据官方已有镜像制作离线镜像

上面的 RocketMQ 多 Master 多 Slave-异步复制模式部署方案中用到的离线镜像制作方案更适合于本地修改定制的场景，如果单纯的只想把官方已有镜像不做修改的下载并推送到本地仓库，可以参考下面的方案。

下载镜像：

```bash
docker pull apache/rocketmq-operator:0.3.0
docker pull apacherocketmq/rocketmq-nameserver:4.5.0-alpine-operator-0.3.0
docker pull apacherocketmq/rocketmq-broker:4.5.0-alpine-operator-0.3.0
```

> Notice: 官方仓库最新版的镜像是 2 年前的 **4.5.0**.

重新打 tag：

```bash
docker tag apache/rocketmq-operator:0.3.0-snapshot registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0
docker tag apacherocketmq/rocketmq-nameserver:4.5.0-alpine-operator-0.3.0 registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.5.0-alpine-operator-0.3.0
docker tag apacherocketmq/rocketmq-broker:4.5.0-alpine-operator-0.3.0 registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.5.0-alpine-operator-0.3.0
```

推送到私有镜像仓库：

```bash
docker push registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0
docker push registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.9.4-alpine-operator-0.3.0
docker push registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
```

清理临时镜像：

```bash
docker rmi apache/rocketmq-operator:0.3.0
docker rmi apacherocketmq/rocketmq-nameserver:4.5.0-alpine-operator-0.3.0
docker rmi apacherocketmq/rocketmq-broker:4.5.0-alpine-operator-0.3.0
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.5.0-alpine-operator-0.3.0
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.5.0-alpine-operator-0.3.0
```

### 制作 RocketMQ Console Image

本文直接拉取官方镜像作为本地离线镜像，如果需要修改内容并重构，可以参考 RocketMQ Console 使用的 [官方 Dockerfile](https://github.com/apache/rocketmq-docker/blob/master/image-build/Dockerfile-centos-dashboard "官方 Dockerfile")自行构建。

下载镜像：

```bash
docker pull apacherocketmq/rocketmq-console:2.0.0
```

重新打 tag：

```bash
docker tag apacherocketmq/rocketmq-console:2.0.0 registry.zdevops.com.cn/apacherocketmq/rocketmq-console:2.0.0
```

推送到私有镜像仓库：

```bash
docker push registry.zdevops.com.cn/apacherocketmq/rocketmq-console:2.0.0
```

清理临时镜像：

```bash
docker rmi apacherocketmq/rocketmq-console:2.0.0
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-console:2.0.0
```

### 准备单 Master RocketMQ 部署方案涉及的离线镜像

单 Master RocketMQ 部署方案涉及的镜像跟集群模式部署方案采用的 RocketMQ Operator 中使用的镜像不同，在制作离线镜像时，直接从官方镜像库拉取然后重新打 tag，再推送本地镜像仓库。

二者具体不同说明如下：

- 单 Master 方案使用的是 Docker Hub 中 apache 命名空间下的镜像，并且镜像名称不区分 nameserver 和 broker，RocketMQ Operator 使用的是 apacherocketmq 命名空间下的镜像，镜像名称区分 nameserver 和 broker。

- 单 Master 方案和 RocketMQ Operator 方案中管理工具使用的镜像也不同，单 Master 方案使用的是 apacherocketmq 命名空间下的 rocketmq-dashboard 镜像，RocketMQ Operator 使用的是 apacherocketmq 命名空间下的 rocketmq-console 镜像。

具体的离线镜像制作流程如下：

#### 下载镜像

```bash
docker pull apache/rocketmq:4.9.4
docker pull apacherocketmq/rocketmq-dashboard:1.0.0
```

#### 重新打 tag

```bash
docker tag apache/rocketmq:4.9.4 registry.zdevops.com.cn/apache/rocketmq:4.9.4
docker tag apacherocketmq/rocketmq-dashboard:1.0.0 registry.zdevops.com.cn/apacherocketmq/rocketmq-dashboard:1.0.0
```

#### 推送到私有镜像仓库

```bash
docker push registry.zdevops.com.cn/apache/rocketmq:4.9.4
docker push registry.zdevops.com.cn/apacherocketmq/rocketmq-dashboard:1.0.0
```

#### 清理临时镜像

```bash
docker rmi apache/rocketmq:4.9.4
docker rmi apacherocketmq/rocketmq-dashboard:1.0.0
docker rmi registry.zdevops.com.cn/apache/rocketmq:4.9.4
docker rmi registry.zdevops.com.cn/apacherocketmq/rocketmq-dashboard:1.0.0
```

## 单 Master 模式部署

### 思路梳理

根据 RocketMQ 服务使用的组件，需要部署以下资源

- Broker StatefulSet
- NameServer StatefulSet
- NameServer Cluster Service：内部服务
- Dashboard Deployment
- Dashboard External Service：Dashboard 外部管理用
- ConfigMap：Broker 自定义配置文件

### 资源配置清单

参考 GitHub 中 Apache [rocketmq-docker](https://github.com/apache/rocketmq-docker "rocketmq-docker")项目中介绍的容器化启动示例配置，编写适用于 K8S 的资源配置清单。

> **Notice:** 每个人技术能力、技术习惯、服务环境有所不同，这里介绍的只是我采用的一种简单方式，并不一定是最优的方案，大家可以根据实际情况编写适合自己的配置。

**rocketmq-cm.yaml**：

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: rocketmq-broker-config
  namespace: zdevops
data:
  BROKER_MEM: ' -Xms2g -Xmx2g -Xmn1g '
  broker-common.conf: |-
    brokerClusterName = DefaultCluster
    brokerName = broker-0
    brokerId = 0
    deleteWhen = 04
    fileReservedTime = 48
    brokerRole = ASYNC_MASTER
    flushDiskType = ASYNC_FLUSH

```

**rocketmq-name-service-sts.yaml**：

```yaml
kind: StatefulSet
apiVersion: apps/v1
metadata:
  name: rocketmq-name-service
  namespace: zdevops
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rocketmq-name-service
      name_service_cr: rocketmq-name-service
  template:
    metadata:
      labels:
        app: rocketmq-name-service
        name_service_cr: rocketmq-name-service
    spec:
      volumes:
        - name: host-time
          hostPath:
            path: /etc/localtime
            type: ''
      containers:
        - name: rocketmq-name-service
          image: 'registry.zdevops.com.cn/apache/rocketmq:4.9.4'
          command:
            - /bin/sh
          args:
            - mqnamesrv
          ports:
            - name: tcp-9876
              containerPort: 9876
              protocol: TCP
          resources:
            limits:
              cpu: 500m
              memory: 1Gi
            requests:
              cpu: 250m
              memory: 512Mi
          volumeMounts:
            - name: rocketmq-namesrv-storage
              mountPath: /home/rocketmq/logs
              subPath: logs
            - name: host-time
              readOnly: true
              mountPath: /etc/localtime
          imagePullPolicy: Always
  volumeClaimTemplates:
    - kind: PersistentVolumeClaim
      apiVersion: v1
      metadata:
        name: rocketmq-namesrv-storage
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
        storageClassName: glusterfs
        volumeMode: Filesystem
  serviceName: ''

---
kind: Service
apiVersion: v1
metadata:
  name: rocketmq-name-server-service
  namespace: zdevops
spec:
  ports:
    - name: tcp-9876
      protocol: TCP
      port: 9876
      targetPort: 9876
  selector:
    name_service_cr: rocketmq-name-service
  type: ClusterIP

```

**rocketmq-broker-sts.yaml**：

```yaml
kind: StatefulSet
apiVersion: apps/v1
metadata:
  name: rocketmq-broker-0-master
  namespace: zdevops
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rocketmq-broker
      broker_cr: rocketmq-broker
  template:
    metadata:
      labels:
        app: rocketmq-broker
        broker_cr: rocketmq-broker
    spec:
      volumes:
        - name: rocketmq-broker-config
          configMap:
            name: rocketmq-broker-config
            items:
              - key: broker-common.conf
                path: broker-common.conf
            defaultMode: 420
        - name: host-time
          hostPath:
            path: /etc/localtime
            type: ''
      containers:
        - name: rocketmq-broker
          image: 'apache/rocketmq:4.9.4'
          command:
            - /bin/sh
          args:
            - mqbroker
            - "-c"
            - /home/rocketmq/conf/broker-common.conf
          ports:
            - name: tcp-vip-10909
              containerPort: 10909
              protocol: TCP
            - name: tcp-main-10911
              containerPort: 10911
              protocol: TCP
            - name: tcp-ha-10912
              containerPort: 10912
              protocol: TCP
          env:
            - name: NAMESRV_ADDR
              value: 'rocketmq-name-server-service.zdevops:9876'
            - name: BROKER_MEM
              valueFrom:
                configMapKeyRef:
                  name: rocketmq-broker-config
                  key: BROKER_MEM
          resources:
            limits:
              cpu: 500m
              memory: 12Gi
            requests:
              cpu: 250m
              memory: 2Gi
          volumeMounts:
            - name: host-time
              readOnly: true
              mountPath: /etc/localtime
            - name: rocketmq-broker-storage
              mountPath: /home/rocketmq/logs
              subPath: logs/broker-0-master
            - name: rocketmq-broker-storage
              mountPath: /home/rocketmq/store
              subPath: store/broker-0-master
            - name: rocketmq-broker-config
              mountPath: /home/rocketmq/conf/broker-common.conf
              subPath: broker-common.conf
          imagePullPolicy: Always
  volumeClaimTemplates:
    - kind: PersistentVolumeClaim
      apiVersion: v1
      metadata:
        name: rocketmq-broker-storage
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 8Gi
        storageClassName: glusterfs
        volumeMode: Filesystem
  serviceName: ''

```

**rocketmq-dashboard.yaml**：

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: rocketmq-dashboard
  namespace: zdevops
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rocketmq-dashboard
  template:
    metadata:
      labels:
        app: rocketmq-dashboard
    spec:
      containers:
        - name: rocketmq-dashboard
          image: 'registry.zdevops.com.cn/apacherocketmq/rocketmq-dashboard:1.0.0'
          ports:
            - name: http-8080
              containerPort: 8080
              protocol: TCP
          env:
            - name: JAVA_OPTS
              value: >-
                -Drocketmq.namesrv.addr=rocketmq-name-server-service.zdevops:9876
                -Dcom.rocketmq.sendMessageWithVIPChannel=false
          resources:
            limits:
              cpu: 500m
              memory: 2Gi
            requests:
              cpu: 50m
              memory: 512Mi
          imagePullPolicy: Always

---
kind: Service
apiVersion: v1
metadata:
  name: rocketmq-dashboard-service
  namespace: zdevops
spec:
  ports:
    - name: http-8080
      protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 31080
  selector:
    app: rocketmq-dashboard
  type: NodePort

```

### GitOps

本操作为**可选项**，本人习惯在个人开发服务器上编辑或修改资源配置清单，然后提交到 Git 服务器 (Gitlab、Gitee、GitHub 等)，然后在 k8s 节点上从 Git 服务器拉取资源配置清单并执行，从而实现资源配置清单的版本化管理，简单的实现运维 GitOps。

本系列文档的所有 k8s 资源配置清单文件，为了演示和操作方便，都放在了统一的 k8s-yaml 仓库中，实际工作中都是一个应用一个 Git 仓库，更便于应用配置的版本控制。

大家在实际使用中可以忽略本步骤，直接在 k8s 节点上编写资源配置清单并执行，也可以参考我的使用方式，实现简单的 GitOps。

**在个人运维开发服务器上操作**：

```bash
# 在已有代码仓库创建 rocketmq/single 目录
mkdir -p rocketmq/single

# 编辑资源配置清单
vi rocketmq/single/rocketmq-cm.yaml
vi rocketmq/single/rocketmq-name-service-sts.yaml
vi rocketmq/single/rocketmq-broker-sts.yaml
vi rocketmq/single/rocketmq-dashboard.yaml

# 提交 Git
git add rocketmq
git commit -am '添加 rocketmq 单节点资源配置清单'
git push
```

### 部署资源

**在 k8s 集群 Master 节点上或是独立的运维管理服务器上操作**。

#### 更新镜像仓库代码

```bash
cd /srv/k8s-yaml
git pull
```

#### 部署资源 (分步式，二选一)

测试环境使用分步单独部署的方式，以便测试资源配置清单的准确性。

```bash
cd /srv/k8s-yaml
kubectl apply -f rocketmq/single/rocketmq-cm.yaml
kubectl apply -f rocketmq/single/rocketmq-name-service-sts.yaml
kubectl apply -f rocketmq/single/rocketmq-broker-sts.yaml
kubectl apply -f rocketmq/single/rocketmq-dashboard.yaml
```

#### 部署资源 (一键式，二选一)

实际使用中，可以直接 apply 整个目录，实现一键式自动部署，在正式研发和生产环境中使用目录的方式实现快速部署。

```bash
kubectl apply -f rocketmq/single/
```

### 验证

ConfigMap：

```bash
$ kubectl get cm -n zdevops

NAME                     DATA   AGE
kube-root-ca.crt         1      17d
rocketmq-broker-config   2      22s
```

StatefulSet：

```bash
$ kubectl get sts -o wide -n zdevops

NAME                       READY   AGE   CONTAINERS              IMAGES
rocketmq-broker-0-master   1/1     11s   rocketmq-broker         registry.zdevops.com.cn/apache/rocketmq:4.9.4
rocketmq-name-service      1/1     12s   rocketmq-name-service   registry.zdevops.com.cn/apache/rocketmq:4.9.4
```

Deployment：

```bash
$ kubectl get deploy -o wide -n zdevops

NAME                 READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS           IMAGES                                                            SELECTOR
rocketmq-dashboard   1/1     1            1           31s   rocketmq-dashboard   registry.zdevops.com.cn/apacherocketmq/rocketmq-dashboard:1.0.0   app=rocketmq-dashboard
```

Pods：

```bash
$ kubectl get pods -o wide -n zdevops

NAME                                 READY   STATUS    RESTARTS   AGE   IP               NODE              NOMINATED NODE   READINESS GATES
rocketmq-broker-0-master-0           1/1     Running   0          77s   10.233.116.103   ks-k8s-master-2   <none>           <none>
rocketmq-dashboard-b5dbb9d88-cwhqc   1/1     Running   0          3s    10.233.87.115    ks-k8s-master-1   <none>           <none>
rocketmq-name-service-0              1/1     Running   0          78s   10.233.116.102   ks-k8s-master-2   <none>           <none>
```

Service：

```bash
$ kubectl get svc -o wide -n zdevops

NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE     SELECTOR
rocketmq-dashboard-service     NodePort    10.233.5.237    <none>        8080:31080/TCP   74s     app=rocketmq-dashboard
rocketmq-name-server-service   ClusterIP   10.233.3.61     <none>        9876/TCP         2m29s   name_service_cr=rocketmq-name-service
```

通过浏览器打开 K8S 集群中任意节点的 **IP:31080**，可以看到 RocketMQ 控制台的管理界面。

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-dashboard.png)

### 清理资源

卸载 RocketMQ 或是安装失败需要清理后重新安装，可以在 K8S 集群上使用下面的流程清理资源。

清理 StatefulSet：

```bash
kubectl delete sts rocketmq-broker-0-master -n zdevops
kubectl delete sts rocketmq-name-service -n zdevops
```

清理 Deployment：

```bash
kubectl delete deployments rocketmq-dashboard -n zdevops
```

清理 ConfigMap：

```bash
kubectl delete cm rocketmq-broker-config -n zdevops
```

清理服务：

```bash
kubectl delete svc rocketmq-name-server-service -n zdevops 
kubectl delete svc rocketmq-dashboard-service -n zdevops 
```

清理存储卷：

```bash
kubectl delete pvc rocketmq-namesrv-storage-rocketmq-name-service-0 -n zdevops
kubectl delete pvc rocketmq-broker-storage-rocketmq-broker-0-master-0 -n zdevops
```

当然，也可以利用资源配置清单清理资源，更简单快捷 (存储卷无法自动清理，需要手工清理)。

```bash
$ kubectl delete -f rocketmq/single/

statefulset.apps "rocketmq-broker-0-master" deleted
configmap "rocketmq-broker-config" deleted
deployment.apps "rocketmq-dashboard" deleted
service "rocketmq-dashboard-service" deleted
statefulset.apps "rocketmq-name-service" deleted
service "rocketmq-name-server-service" deleted
```

## 多 Master 多 Slave-异步复制模式部署

### 思路梳理

多 Master 多 Slave-异步复制模式的 RocketMQ 部署，使用官方提供的 [RocketMQ Operator](https://github.com/apache/rocketmq-operator#rocketmq-operator "RocketMQ Operator")，部署起来比较快速便捷，扩容也比较方便。

默认配置会部署 1 个 Master 和 1 个对应的 Slave，部署完成后可以根据需求扩容 Master 和 Slave。

### 获取 RocketMQ Operator

```bash
# git 获取代码时指定版本
cd /srv 
git clone -b 0.3.0 https://github.com/apache/rocketmq-operator.git
```

### 准备资源配置清单

本文演示的资源配置清单都是直接修改 rocketmq-operator 默认的配置，生产环境应根据默认配置修改一套适合自己环境的标准配置文件，并存放于 git 仓库中。

为 deploy 资源配置清单文件增加或修改命名空间：

```bash
cd /srv/rocketmq-operator
sed -i 'N;8 a \  namespace: zdevops' deploy/crds/rocketmq.apache.org_brokers.yaml
sed -i 'N;8 a \  namespace: zdevops' deploy/crds/rocketmq.apache.org_consoles.yaml
sed -i 'N;8 a \  namespace: zdevops' deploy/crds/rocketmq.apache.org_nameservices.yaml
sed -i 'N;8 a \  namespace: zdevops' deploy/crds/rocketmq.apache.org_topictransfers.yaml
sed -i 'N;18 a \  namespace: zdevops' deploy/operator.yaml
sed -i 'N;18 a \  namespace: zdevops' deploy/role_binding.yaml
sed -i 's/namespace: default/namespace: zdevops/g' deploy/role_binding.yaml
sed -i 'N;18 a \  namespace: zdevops' deploy/service_account.yaml
sed -i 'N;20 a \  namespace: zdevops' deploy/role.yaml
```

> 切记此步骤只能执行一次，如果失败了则需要删掉后重新执行。
>
> **执行完成后一定要查看一下结果是否符合预期** `grep -r zdevops deploy/*`。

修改 example 资源配置清单文件中的命名空间：

```bash
sed -i 's/namespace: default/namespace: zdevops/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml
sed -i 'N;18 a \  namespace: zdevops' example/rocketmq_v1alpha1_cluster_service.yaml
```

修改镜像地址为内网地址：

```bash
sed -i 's#apache/rocketmq-operator:0.3.0#registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0#g' deploy/operator.yaml
sed -i 's#apacherocketmq#registry.zdevops.com.cn/apacherocketmq#g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml 
```

修改 RocketMQ 版本 (可选)：

```bash
sed -i 's/4.5.0/4.9.4/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml 
```

> Notice: 默认的资源配置清单示例中部署 RocketMQ 集群的版本为 **4.5.0**, 实际使用时请根据需求调整。

修改 NameService 网络模式 (可选)：

```bash
sed -i 's/hostNetwork: true/hostNetwork: false/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml 
sed -i 's/dnsPolicy: ClusterFirstWithHostNet/dnsPolicy: ClusterFirst/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml
```

> Notice: 官方示例默认配置使用 hostNetwork 模式 , 适用于同时给 K8S 集群内、外应用提供服务 , 实际使用时请根据需求调整 .
>
> 个人倾向于禁用 hostNetwork 模式 , 不跟外部应用混用 . 如果需要混用 , 则倾向于在外部独立部署 RocketMQ。

修改 storageClassName 为 glusterfs：

```bash
sed -i 's/storageClassName: rocketmq-storage/storageClassName: glusterfs/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml
sed -i 's/storageMode: EmptyDir/storageMode: StorageClass/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml
```

> Notice: 演示环境 GlusterFS 存储对应的 storageClassName 为 glusterfs，请根据实际情况修改。

修改 nameServers 为域名的形式：

```bash
sed -i 's/nameServers: ""/nameServers: "name-server-service.zdevops:9876"/g' example/rocketmq_v1alpha1_rocketmq_cluster.yaml
```

> Notice: name-server-service.zdevops 是 NameServer service 名称 + 项目名称的组合
>
> 默认配置采用 pod [ip:port] 的形式 , 一旦 Pod IP 发生变化 ,Console 就没法管理集群了 , 且 Console 不会自动变更配置，如果设置为空的话可能还会出现随便配置的情况，因此一定要提前修改。

修改 RocketMQ Console 外部访问的 NodePort：

```bash
sed -i 's/nodePort: 30000/nodePort: 31080/g' example/rocketmq_v1alpha1_cluster_service.yaml
```

> Notice: 官方示例默认配置端口号为 30000, 实际使用时请根据需求调整。

修改 RocketMQ NameServer 和 Console 的 service 配置：

```bash
sed -i '32,46s/^#//g' example/rocketmq_v1alpha1_cluster_service.yaml
sed -i 's/nodePort: 30001/nodePort: 31081/g' example/rocketmq_v1alpha1_cluster_service.yaml
sed -i 's/namespace: default/namespace: zdevops/g' example/rocketmq_v1alpha1_cluster_service.yaml
```

> NameServer 默认使用了 NodePort 的形式，单纯在 K8S 集群内部使用的话，可以修改为集群模式。

### GitOps

生产环境实际使用时建议将上面编辑整理后的资源配置清单，单独整理，删除 rocketmq-operator 项目中多余的文件，行成一套适合于自己业务需要的资源配置清单，并使用 Git 进行版本控制。

单 Master 模式部署方案中已经详细介绍过操作流程，此处不再多做介绍。

### 4.5. 部署 RocketMQ Operator (自动)

官方介绍的自动部署方法，适用于能连接互联网的环境，部署过程中需要下载 controller-gen 和 kustomize 二进制文件，同时会下载一堆 go 依赖。

不适合于内网离线环境，这里只是简单介绍，本文重点采用后面的手动部署的方案。

部署 RocketMQ Operator：

```bash
make deploy
```

### 部署 RocketMQ Operator (手动)

部署 RocketMQ Operator：

```bash
kubectl create -f deploy/crds/rocketmq.apache.org_brokers.yaml
kubectl create -f deploy/crds/rocketmq.apache.org_nameservices.yaml
kubectl create -f deploy/crds/rocketmq.apache.org_consoles.yaml
kubectl create -f deploy/crds/rocketmq.apache.org_topictransfers.yaml
kubectl create -f deploy/service_account.yaml
kubectl create -f deploy/role.yaml
kubectl create -f deploy/role_binding.yaml
kubectl create -f deploy/operator.yaml
```

验证 CRDS：

```bash
$ kubectl get crd | grep rocketmq.apache.org

brokers.rocketmq.apache.org                           2022-11-09T02:54:52Z
consoles.rocketmq.apache.org                          2022-11-09T02:54:54Z
nameservices.rocketmq.apache.org                      2022-11-09T02:54:53Z
topictransfers.rocketmq.apache.org                    2022-11-09T02:54:54Z
```

验证 RocketMQ Operator：

```bash
$ kubectl get deploy -n zdevops -o wide

NAME                READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS   IMAGES                                                           SELECTOR
rocketmq-operator   1/1     1            1           6m46s   manager      registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0   name=rocketmq-operator

$ kubectl get pods -n zdevops -o wide

NAME                                 READY   STATUS    RESTARTS   AGE     IP              NODE              NOMINATED NODE   READINESS GATES
rocketmq-operator-7cc6b48796-htpk8   1/1     Running   0          2m28s   10.233.116.70   ks-k8s-master-2   <none>           <none>
```

### 部署 RocketMQ 集群

创建服务：

```bash
$ kubectl apply -f example/rocketmq_v1alpha1_cluster_service.yaml

service/console-service created
service/name-server-service created
```

创建集群：

```bash
$ kubectl apply -f example/rocketmq_v1alpha1_rocketmq_cluster.yaml

configmap/broker-config created
broker.rocketmq.apache.org/broker created
nameservice.rocketmq.apache.org/name-service created
console.rocketmq.apache.org/console created
```

### 验证

StatefulSet：

```bash
$ kubectl get sts -o wide -n zdevops

NAME                 READY   AGE   CONTAINERS     IMAGES
broker-0-master      1/1     27s   broker         registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
broker-0-replica-1   1/1     27s   broker         registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
name-service         1/1     27s   name-service   registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.9.4-alpine-operator-0.3.0

```

Deployment：

```bash
$ kubectl get deploy -o wide -n zdevops

NAME                READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS   IMAGES                                                           SELECTOR
console             1/1     1            1           52s     console      registry.zdevops.com.cn/apacherocketmq/rocketmq-console:2.0.0    app=rocketmq-console
rocketmq-operator   1/1     1            1           4h43m   manager      registry.zdevops.com.cn/apacherocketmq/rocketmq-operator:0.3.0   name=rocketmq-operator
```

Pod：

```bash
$ kubectl get pods -o wide -n zdevops

NAME                                 READY   STATUS    RESTARTS      AGE     IP              NODE              NOMINATED NODE   READINESS GATES
broker-0-master-0                    1/1     Running   0             47s     10.233.87.24    ks-k8s-master-1   <none>           <none>
broker-0-replica-1-0                 1/1     Running   0             17s     10.233.117.28   ks-k8s-master-0   <none>           <none>
console-8d685798f-5pwct              1/1     Running   0             116s    10.233.116.84   ks-k8s-master-2   <none>           <none>
name-service-0                       1/1     Running   0             96s     10.233.116.85   ks-k8s-master-2   <none>           <none>
rocketmq-operator-7cc6b48796-htpk8   1/1     Running   2 (98s ago)   4h39m   10.233.116.70   ks-k8s-master-2   <none>           <none>
```

Services：

```bash
$ kubectl get svc -o wide -n zdevops

NAME                                                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE   SELECTOR
console-service                                          NodePort    10.233.38.15    <none>        8080:31080/TCP   21m   app=rocketmq-console
name-server-service                                      NodePort    10.233.56.238   <none>        9876:31081/TCP   21m   name_service_cr=name-service   
```

通过浏览器打开 K8S 集群中任意节点的 **IP:31080**，可以看到 RocketMQ 控制台的管理界面。

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-console-0.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-console-1.png)

### 清理资源

#### 清理 RocketMQ Cluster

部署集群失败或是需要重新部署时，采用下面的顺序清理删除。

```bash
kubectl delete -f example/rocketmq_v1alpha1_rocketmq_cluster.yaml
kubectl delete -f example/rocketmq_v1alpha1_cluster_service.yaml
```

#### 清理 RocketMQ Operator

```bash
kubectl delete -f deploy/crds/rocketmq.apache.org_brokers.yaml
kubectl delete -f deploy/crds/rocketmq.apache.org_nameservices.yaml
kubectl delete -f deploy/crds/rocketmq.apache.org_consoles.yaml
kubectl delete -f deploy/crds/rocketmq.apache.org_topictransfers.yaml
kubectl delete -f deploy/service_account.yaml
kubectl delete -f deploy/role.yaml
kubectl delete -f deploy/role_binding.yaml
kubectl delete -f deploy/operator.yaml
```

#### 清理存储卷

需要手工查找 Broker 和 NameServer 相关的存储卷并删除。

```bash
# 查找存储卷
$ kubectl get pvc -n zdevops

NAME                                  STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
broker-storage-broker-0-master-0      Bound    pvc-6a78b573-d72a-47ca-9012-5bc888dfcb0f   8Gi        RWO            glusterfs      3m54s
broker-storage-broker-0-replica-1-0   Bound    pvc-4f096942-505d-4e34-ac7f-b871b9f33df3   8Gi        RWO            glusterfs      3m54s
namesrv-storage-name-service-0        Bound    pvc-2c45a77e-3ca1-4eab-bb57-8374aa9068d3   1Gi        RWO            glusterfs      3m54s

# 删除存储卷
kubectl delete pvc namesrv-storage-name-service-0 -n zdevops
kubectl delete pvc broker-storage-broker-0-master-0 -n zdevops
kubectl delete pvc broker-storage-broker-0-replica-1-0 -n zdevops
```

### 扩容 NameServer

如果当前的 name service 集群规模不能满足您的需求，您可以简单地使用 RocketMQ-Operator 来扩大或缩小 name service 集群的规模。

扩容 name service 需要编写并执行独立的资源配置清单，参考官方示例[Name Server Cluster Scale](https://github.com/apache/rocketmq-operator#name-server-cluster-scale "Name Server Cluster Scale")，并结合自己实际环境的 rocketmq-operator 配置修改。

> **Notice:** 不要在已部署的资源中直接修改副本数，直接修改不会生效，会被 Operator 干掉。

编辑扩容 NameServer 资源配置清单 , **rocketmq_v1alpha1_nameservice_cr.yaml**：

```yaml
apiVersion: rocketmq.apache.org/v1alpha1
kind: NameService
metadata:
  name: name-service
  namespace: zdevops
spec:
  size: 2
  nameServiceImage: registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.9.4-alpine-operator-0.3.0
  imagePullPolicy: Always
  hostNetwork: false
  dnsPolicy: ClusterFirst
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1024Mi"
      cpu: "500m"
  storageMode: StorageClass
  hostPath: /data/rocketmq/nameserver
  volumeClaimTemplates:
    - metadata:
        name: namesrv-storage
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: glusterfs
        resources:
          requests:
            storage: 1Gi
```

执行扩容操作：

```bash
kubectl apply -f rocketmq/cluster/rocketmq_v1alpha1_nameservice_cr.yaml
```

验证 StatefulSet：

```bash
$ kubectl get sts name-service -o wide -n zdevops

NAME           READY   AGE   CONTAINERS     IMAGES
name-service   2/2     16m   name-service   registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.9.4-alpine-operator-0.3.0
```

验证 Pods：

```bash
$ kubectl get pods -o wide -n zdevops

NAME                                 READY   STATUS    RESTARTS   AGE    IP               NODE              NOMINATED NODE   READINESS GATES
broker-0-master-0                    1/1     Running   0          18m    10.233.87.117    ks-k8s-master-1   <none>           <none>
broker-0-replica-1-0                 1/1     Running   0          43s    10.233.117.99    ks-k8s-master-0   <none>           <none>
console-8d685798f-hnmvg              1/1     Running   0          18m    10.233.116.113   ks-k8s-master-2   <none>           <none>
name-service-0                       1/1     Running   0          18m    10.233.116.114   ks-k8s-master-2   <none>           <none>
name-service-1                       1/1     Running   0          110s   10.233.87.120    ks-k8s-master-1   <none>           <none>
rocketmq-operator-6db8ccc685-5hkk8   1/1     Running   0          18m    10.233.116.112   ks-k8s-master-2   <none>           <none>
```

#### 特别说明

NameServer 扩容一定要**慎重**，在实际验证测试中发现 NameServer 扩容会导致重建已有的除了 Broker-0 的 Master 之外的其他 Broker 的 Master 和 所有的 Slave。按官方文档上的说明，应该是 Operator 通知所有的 Broker 更新 name service list parameters，以便它们可以注册到新的 NameServer Service。

同时，在 allowRestart: true 策略下，Broker 将逐渐更新，因此更新过程也不会被生产者和消费者客户端感知，也就是说理论上不会影响业务(未实际测试)。

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-namesrv-scale-0.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-namesrv-scale-1.png)

但是，所有 Broker 的 Master 和 Slave 重建后，查看集群状态时，集群节点的信息不稳定，有的时候能看到 3 个节点，有的时候则能看到 4 个节点。

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-namesrv-scale-2.png)

因此，生产环境最好在初次部署的时候就配置 NameServer 的副本数为 2 或是 3，尽量不要在后期扩容，除非你能搞定扩容造成的一切后果。

### 扩容 Broker

通常情况下，随着业务的发展，现有的 Broker 集群规模可能不再满足您的业务需求。你可以简单地使用 RocketMQ-Operator 来升级、扩容 Broker 集群。

扩容 Broker 需要编写并执行独立的资源配置清单，参考官方示例[Broker Cluster Scale](https://github.com/apache/rocketmq-operator#broker-cluster-scale "Broker Cluster Scale")，并结合自己实际环境的 rocketmq-operator 配置修改。

编辑扩容 Broker 资源配置清单 , **rocketmq_v1alpha1_broker_cr.yaml**：

```yaml
apiVersion: rocketmq.apache.org/v1alpha1
kind: Broker
metadata:
  name: broker
  namespace: zdevops
spec:
  size: 2
  nameServers: "name-server-service.zdevops::9876"
  replicaPerGroup: 1
  brokerImage: registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
  imagePullPolicy: Always
  resources:
    requests:
      memory: "2048Mi"
      cpu: "250m"
    limits:
      memory: "12288Mi"
      cpu: "500m"
  allowRestart: true
  storageMode: StorageClass
  hostPath: /data/rocketmq/broker
  # scalePodName is [Broker name]-[broker group number]-master-0
  scalePodName: broker-0-master-0
  env:
    - name: BROKER_MEM
      valueFrom:
        configMapKeyRef:
          name: broker-config
          key: BROKER_MEM
  volumes:
    - name: broker-config
      configMap:
        name: broker-config
        items:
          - key: broker-common.conf
            path: broker-common.conf
  volumeClaimTemplates:
    - metadata:
        name: broker-storage
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: glusterfs
        resources:
          requests:
            storage: 8Gi
```

> **Notice:** 注意重点字段 **scalePodName**: broker-0-master-0。
>
> 选择源 Broker pod，将从其中将主题和订阅信息数据等旧元数据传输到新创建的 Broker。

执行扩容 Broker：

```bash
kubectl apply -f rocketmq/cluster/rocketmq_v1alpha1_broker_cr.yaml
```

> Notice: 执行成功后将部署一个新的 Broker Pod 组，同时 Operator 将在启动新 Broker 之前将源 Broker Pod 中的元数据复制到新创建的 Broker Pod 中，因此新 Broker 将重新加载已有的主题和订阅信息。

验证 StatefulSet：

```bash
$ kubectl get sts  -o wide -n zdevops
NAME                 READY   AGE   CONTAINERS     IMAGES
broker-0-master      1/1     43m   broker         registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
broker-0-replica-1   1/1     43m   broker         registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
broker-1-master      1/1     27s   broker         registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
broker-1-replica-1   1/1     27s   broker         registry.zdevops.com.cn/apacherocketmq/rocketmq-broker:4.9.4-alpine-operator-0.3.0
name-service         2/2     43m   name-service   registry.zdevops.com.cn/apacherocketmq/rocketmq-nameserver:4.9.4-alpine-operator-0.3.0
```

验证 Pods：

```bash
$ kubectl get pods -o wide -n zdevops

NAME                                 READY   STATUS    RESTARTS   AGE   IP               NODE              NOMINATED NODE   READINESS GATES
broker-0-master-0                    1/1     Running   0          44m   10.233.87.117    ks-k8s-master-1   <none>           <none>
broker-0-replica-1-0                 1/1     Running   0          26m   10.233.117.99    ks-k8s-master-0   <none>           <none>
broker-1-master-0                    1/1     Running   0          72s   10.233.116.117   ks-k8s-master-2   <none>           <none>
broker-1-replica-1-0                 1/1     Running   0          72s   10.233.117.100   ks-k8s-master-0   <none>           <none>
console-8d685798f-hnmvg              1/1     Running   0          44m   10.233.116.113   ks-k8s-master-2   <none>           <none>
name-service-0                       1/1     Running   0          44m   10.233.116.114   ks-k8s-master-2   <none>           <none>
name-service-1                       1/1     Running   0          27m   10.233.87.120    ks-k8s-master-1   <none>           <none>
rocketmq-operator-6db8ccc685-5hkk8   1/1     Running   0          44m   10.233.116.112   ks-k8s-master-2   <none>           <none>
```

在 KubeSphere 控制台验证：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-rocketmq.png)

在 RocketMQ 控制台验证：

![](https://pek3b.qingstor.com/kubesphere-community/images/rocketmq-console-2master.png)

## 常见问题

### 没装 gcc 编译工具

报错信息：

```bash
[root@zdevops-master rocketmq-operator]# make docker-build IMG=${IMAGE_URL}
/data/k8s-yaml/rocketmq-operator/bin/controller-gen rbac:roleName=rocketmq-operator crd:generateEmbeddedObjectMeta=true webhook paths="./..." output:dir=deploy output:crd:artifacts:config=deploy/crds
head -n 14 deploy/role_binding.yaml > deploy/role.yaml.bak
cat deploy/role.yaml >> deploy/role.yaml.bak
rm deploy/role.yaml && mv deploy/role.yaml.bak deploy/role.yaml
/data/k8s-yaml/rocketmq-operator/bin/controller-gen object:headerFile="hack/boilerplate.go.txt" paths="./..."
/usr/local/go/src/net/cgo_linux.go:12:8: no such package located
Error: not all generators ran successfully
run `controller-gen object:headerFile=hack/boilerplate.go.txt paths=./... -w` to see all available markers, or `controller-gen object:headerFile=hack/boilerplate.go.txt paths=./... -h` for usage
make: *** [generate] Error 1
```

解决方案：

```bash
$ yum install gcc
```

### go mod 错误

报错信息：

```bash
# 执行 make docker-build IMG=${IMAGE_URL} 报错

go: creating new go.mod: module tmp
Downloading sigs.k8s.io/controller-tools/cmd/controller-gen@v0.7.0
go get: added sigs.k8s.io/controller-tools v0.7.0
/data/build/rocketmq-operator/bin/controller-gen rbac:roleName=rocketmq-operator crd:generateEmbeddedObjectMeta=true webhook paths="./..." output:dir=deploy output:crd:artifacts:config=deploy/crds
Error: err: exit status 1: stderr: go: github.com/google/uuid@v1.1.2: missing go.sum entry; to add it:
        go mod download github.com/google/uuid

Usage:
  controller-gen [flags]
  
......

output rules (optionally as output:<generator>:...)

+output:artifacts[:code=<string>],config=<string>  package  outputs artifacts to different locations, depending on whether they're package-associated or not.   
+output:dir=<string>                               package  outputs each artifact to the given directory, regardless of if it's package-associated or not.      
+output:none                                       package  skips outputting anything.                                                                          
+output:stdout                                     package  outputs everything to standard-out, with no separation.                                             

run `controller-gen rbac:roleName=rocketmq-operator crd:generateEmbeddedObjectMeta=true webhook paths=./... output:dir=deploy output:crd:artifacts:config=deploy/crds -w` to see all available markers, or `controller-gen rbac:roleName=rocketmq-operator crd:generateEmbeddedObjectMeta=true webhook paths=./... output:dir=deploy output:crd:artifacts:config=deploy/crds -h` for usage
make: *** [manifests] Error 1
```

解决方案：

```bash
go mod tidy
```

## 结束语

本文只是初步介绍了 RocketMQ 在 K8s 平台上的单 Master 节点和多 Master 多 Slave-异步复制模式部署的方法，属于入门级。

在生产环境中还需要根据实际环境优化配置，例如调整集群的 Broker 数量、Master 和 Slave 的分配、性能调优、配置优化等。