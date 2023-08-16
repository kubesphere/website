---
title: 'KubeSphere 部署 Zookeeper 实战教程'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, Zookeeper '
description: '本文详细介绍了 Zookeeper 单节点和集群模式在基于 KubeSphere 部署的 K8s 集群上的安装部署、测试验证的过程'
createTime: '2023-08-11'
author: '老 Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/zookeeper-on-kubesphere-cover.png'
---

## 前言

### 知识点

- 定级：**入门级**
- 如何利用 **AI 助手**辅助运维工作
- 单节点 Zookeeper 安装部署
- 集群模式 Zookeeper 安装部署
- 开源应用选型思想

### 实战服务器配置(架构 1:1 复刻小规模生产环境，配置略有不同)

|   主机名    |      IP      | CPU | 内存 | 系统盘 | 数据盘 |                    用途                    |
| :---------: | :----------: | :-: | :--: | :----: | :----: | :----------------------------------------: |
| ks-master-0 | 192.168.9.91 |  4  |  8   |   50   |  100   |           KubeSphere/k8s-master            |
| ks-master-1 | 192.168.9.92 |  4  |  8   |   50   |  100   |           KubeSphere/k8s-master            |
| ks-master-2 | 192.168.9.93 |  4  |  8   |   50   |  100   |           KubeSphere/k8s-master            |
| ks-worker-0 | 192.168.9.95 |  4  |  16  |   50   |  100   |               k8s-worker/CI                |
| ks-worker-1 | 192.168.9.96 |  4  |  16  |   50   |  100   |                 k8s-worker                 |
| ks-worker-2 | 192.168.9.97 |  4  |  16  |   50   |  100   |                 k8s-worker                 |
|  storage-0  | 192.168.9.81 |  2  |  4   |   50   |  100+  | ElasticSearch/GlusterFS/Ceph/Longhorn/NFS/ |
|  storage-1  | 192.168.9.82 |  2  |  4   |   50   |  100+  |   ElasticSearch/GlusterFS/Ceph/Longhorn    |
|  storage-2  | 192.168.9.83 |  2  |  4   |   50   |  100+  |   ElasticSearch/GlusterFS/Ceph/Longhorn    |
|  registry   | 192.168.9.80 |  2  |  4   |   50   |  200   |              Sonatype Nexus 3              |
|    合计     |      10      | 32  |  88  |  500   | 1100+  |                                            |

## 实战环境涉及软件版本信息

- 操作系统：**openEuler 22.03 LTS SP2 x86_64**
- KubeSphere：**3.3.2**
- Kubernetes：**v1.24.12**
- Containerd：**1.6.4**
- GlusterFS：**10.0-8**
- KubeKey: **v3.0.8**
- Zookeeper：**3.8.2**

## 简介

今天我们的实战内容采用**场景模拟**的形式，模拟真实运维工作中，**必然会**遇到的一个场景。

作为一个初入职场刚接触云原生运维的运维小白，Boss 今天给我安排了一个**高难度**的任务，对，你没看错就是**高难度**的。

**高难度** = **2 M 1 D**= **听过、没见过、没干过、时间短**。

Boss 提出的任务要求整理如下（都是我根据 Boss 的原话，自己理解、猜测、搜索整理的，实际上 Boos 根本没说几个字）：

- 在 K8s 集群上部署一个单节点模式的 Zookeeper
- 在 K8s 集群上部署集群模式的 Zookeeper
- 使用场景：**研发、测试（后期很有可能直接转生产）**
- 任务交付期：**明天（领导认为很简单）**
- **核心要求：能用就行（自己理解的）**

既然不能拒绝，时间紧任务重，那就干吧，冲冲冲！！！

## 2. 任务实现思路分析

工欲善其事，必先利其器。既然是 **2 M 1 D** 级别的任务，先搬出 **AI 时代**运维三板斧中的前两板，看看是否能解决问题。

> 由于只用了两板斧就搞定了，所以就没用到第三板。

### 第一板斧——AI 助手

**提示词：** "我要在 K8s 上部署 zookeerper。分别给我一个单节点和集群模式的部署方案，注意需要使用存储类 glusterfs、需要有 SVC、需要有 zoo.cfg 的 ConfigMap"

> **重点说明：** 本人学艺不精，**AI 助手**玩的还不熟，提示词写的不好，所以最终效果也不是太好。

输入上面的提示词以后，**AI 助手-3.5** 吧啦吧啦返回了一堆文字给我，我只取了精华作为展示。

- 单节点部署配置文件（`zookeeper-single.yaml`）

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: zookeeper-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: glusterfs
  resources:
    requests:
      storage: 10Gi

---
apiVersion: v1
kind: Service
metadata:
  name: zookeeper
spec:
  selector:
    app: zookeeper
  ports:
    - protocol: TCP
      port: 2181
      targetPort: 2181

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: zookeeper-config
data:
  zoo.cfg: |
    tickTime=2000
    dataDir=/data
    clientPort=2181

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zookeeper
spec:
  replicas: 1
  selector:
    matchLabels:
      app: zookeeper
  template:
    metadata:
      labels:
        app: zookeeper
    spec:
      containers:
      - name: zookeeper
        image: zookeeper:3.7.0
        resources:
          requests:
            cpu: 100m
            memory: 1Gi
        ports:
        - containerPort: 2181
        volumeMounts:
        - name: zookeeper-data
          mountPath: /data
        env:
        - name: ZOOKEEPER_CONFIG_FILE
          value: /opt/zookeeper-3.7.0/conf/zoo.cfg
        - name: ZOO_SERVERS
          value: "server.1=zookeeper-0.zookeeper.default.svc.cluster.local:2888:3888;2181"
      volumes:
      - name: zookeeper-data
        persistentVolumeClaim:
          claimName: zookeeper-data
      - name: zookeeper-config
        configMap:
          name: zookeeper-config
```

- 集群模式部署配置文件（`zookeeper-cluster.yaml`）：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: zookeeper-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: glusterfs
  resources:
    requests:
      storage: 10Gi

---
apiVersion: v1
kind: Service
metadata:
  name: zookeeper
spec:
  selector:
    app: zookeeper
  ports:
    - protocol: TCP
      port: 2181
      targetPort: 2181

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: zookeeper-config
data:
  zoo.cfg: |
    tickTime=2000
    dataDir=/data
    clientPort=2181
    initLimit=5
    syncLimit=2
    server.1=zookeeper-0.zookeeper.default.svc.cluster.local:2888:3888
    server.2=zookeeper-1.zookeeper.default.svc.cluster.local:2888:3888
    server.3=zookeeper-2.zookeeper.default.svc.cluster.local:2888:3888

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: zookeeper
spec:
  serviceName: zookeeper
  replicas: 3
  selector:
    matchLabels:
      app: zookeeper
  template:
    metadata:
      labels:
        app: zookeeper
    spec:
      containers:
      - name: zookeeper
        image: zookeeper:3.7.0
        resources:
          requests:
            cpu: 100m
            memory: 1Gi
        ports:
        - containerPort: 2181
        volumeMounts:
        - name: zookeeper-data
          mountPath: /data
        env:
        - name: ZOOKEEPER_CONFIG_FILE
          value: /opt/zookeeper-3.7.0/conf/zoo.cfg
      volumes:
      - name: zookeeper-data
        persistentVolumeClaim:
          claimName: zookeeper-data
      - name: zookeeper-config
        configMap:
          name: zookeeper-config
```

分析完内容，我发现我好像懂了点，但是又没有完全懂，返回的结果中单节点和集群模式的配置文件看着差不太多，分析一下结果，顺便捋一下思路：

- kind 类型不同： 单节点是 **Deployment**， 集群模式是 **StatefulSet**，这个目前看起来没毛病，思路是对的
- Deployment 副本数为 1，StatefulSet 副本数为 3
- 集群模式没有使用 **volumeClaimTemplates**
- 集群模式 zoo.cfg 配置文件中多了几个 server 的配置项，但是好像没有实现 **myid** 的处理

> 必须有一定的 K8s 和 Zookeeper 相关知识积累才能分析出 **AI 助手** 给出的结果是否符合需求，否则根本看不懂。

### 第二板斧——搜索引擎

搜索引擎，在**AI 助手**出来以前在运维辅助中排名第一，现在暂居第二了，估计也没机会重回巅峰了（谨代表个人排名意见）。

看完了 **AI 助手** 的输出结果，觉得整体结构内容没问题，但是感觉细节上还是差那么点意思，尤其是集群模式的部署。我们会在本文第三小节验证。

同时，我还发现了一点 `image: zookeeper:3.7.0`，既然引用的 Image 是 DockerHub 官方的，那么 DockerHub 上一定有对应的 Image 及容器化部署的使用方法。

这也就带来一个新的灵感和一种新的学习方法，同时也是**最简单直接的** Docker 部署转化为 Kubernetes 部署的方法，直接去看 Docker 的部署命令、启动命令、相关参数，然后直接搬到 K8s 上就可以。

直接转到 **DokcerHub 官网**，我们直接用关键词 **zookeeper** 搜索一下。

搜索结果截图：

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//DockerHub-Repository-%20zookeeper.png)

简单的思考分析一下搜索结果：

- 排名最高的两个 zookeeper 镜像，下载量都超过 **100M+**, 分别是 Docker 官方和 **Bitnami** 出品的。

- 上周下载量最多的是 Bitnami 出品的 zookeeper，下载量高达 1,140,215，比 DockerHub 出品的 zookeeper 下载量 681,115，多了一倍还多。

> 小提示：**Bitnami**， 十几年前我就开始用，它们出品的一键部署安装包，当时就是很牛的一键部署中间件解决方案服务商，现在应该是更全面、更牛了。

**为什么要做上面的分析？**

- 当我们做开源技术选型的时候，主要的决定因素之一就是**使用者数量**，使用者太少说明产品还不成熟，代表着出了问题你都没地方寻求帮助。
- 我的技术选型几个原则：**首选官方**(Apache 官方没有，只能选 DockerHub 官方)、**用户量大**(100M+)、**维护更新频繁**(7 days ago)。
- 除了 **DockerHub** 出品的 **zookeeper** 镜像之外，**Bitnami** 出品的镜像也是一个很好的选择，群众的眼睛是雪亮的，如果不好用也不可能这么多人推荐、下载。
- **AI 助手** 给出的示例用的是 DockerHub 官方的镜像。

上面说了那么多，好像没有说到**第二板斧**的重点**搜索引擎**，**AI 助手** 给出的结果中，单节点模式看着没什么问题，但是集群模式总感觉少点啥，重点的 **myid** 的处理方式我就没看到。因此，我又用关键词 **StatefulSet 部署 Zookeeper** 在搜索引擎中搜索了一番。

搜索结果中有两个方向的思路比较有参考价值：

- 基于 K8s 官方文档给出的 Zookeeper 部署方案。

K8s 官网的一个教程案例 [Running ZooKeeper, A Distributed System Coordinator](https://kubernetes.io/docs/tutorials/stateful-application/zookeeper/ "Running ZooKeeper, A Distributed System Coordinator")，这个例子看着比较复杂，而且引入了几个新的技术。

- 基于 Bitnami 制作的镜像提供的 Zookeeper 集群部署方案

梳理清楚已经获取的信息，为了快速完成领导交付的任务，今天的验证测试方案顺序如下：

- **AI 助手** 提供的单节点部署配置
- **AI 助手** 提供的集群模式部署配置
- **Bitnami** 提供的集群模式部署方案
- K8s 官网 Zookeeper 部署案例

因为，单节点部署比较简单。所以，测试问题重点就在于 **AI 助手**和 **Bitnami** 提供的集群模式部署配置是否可行，如果方案可行就没官网案例什么事了，如果不行再去实验 **K8s 官网 Zookeeper 部署案例**，但是说实话我暂时还很不想碰，因为这个案例里有个技术点我压根儿就没听过，真要搞的话又会引入新的问题。

## Zookeeper 单节点部署

我觉得 **AI 助手** 返回的单节点的部署方案和配置文件看着还可以没啥问题。但是，也不要直接复制、粘贴，拿来即用。一定要多参考 DockerHub 官网的 [Zookeeper 相关示例](https://hub.docker.com/_/zookeeper "Zookeeper 相关示例")，二者相结合，写出来的才是更靠谱的资源清单。

### 思路梳理

在 K8s 集群上部一套单节点的 Zookeeper 需要的资源清单如下：

- PersistentVolumeClaim

- ConfigMap：zoo.cfg

- Deployment

- Cluster Service

- External Service（可选）

知道了需要完成的任务目标，接下来结合 **AI 助手**给出的配置和官方配置参数，生成一套资源配置清单。

**注意：** 实践证明，**AI 助手** 给出的也只是一个大概，细节还是有很多不足的地方，下面示例中的所有资源配置清单，都是参考官方配置参数和实际使用需求整理的。

简单说一下修改了哪些内容。

- Zookeeper 版本选择，使用了落后官方最新的稳定版 3.9.0 一个版本的 **3.8.2** 替换 AI 助手给出的配置方案中的 **3.7.0**
- 增加了 **dataLog** 的配置
- 完善了资源限制的配置
- 完善了 **zoo.cfg** 的配置

### 资源配置清单

**如无特殊说明，所有涉及 K8s 的操作都在 Master-0 节点上执行 , 配置文件根目录为 /srv/opsman/k8s-yaml**。

- 创建资源清单文件夹

```shell
cd /srv/opsman/k8s-yaml
mkdir -p zookeeper/single
cd zookeeper/single
```

- vi **zookeeper-pvc.yaml**

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: zookeeper-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: glusterfs
  resources:
    requests:
      storage: 1Gi

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: zookeeper-datalog
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: glusterfs
  resources:
    requests:
      storage: 2Gi
```

> **说明：** 后端存储类使用的 **GlusterFS**。

- vi **zookeeper-cm.yaml**

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: zookeeper-config
data:
  zoo-cfg: |
    tickTime=2000
    dataDir=/data
    dataLogDir=/datalog
    clientPort=2181
    initLimit=10
    syncLimit=5
```

- vi **zookeeper-deploy.yaml**

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zookeeper
spec:
  replicas: 1
  selector:
    matchLabels:
      app: zookeeper
  template:
    metadata:
      labels:
        app: zookeeper
    spec:
      containers:
      - name: zookeeper
        image: zookeeper:3.8.2
        resources:
          requests:
            cpu: 50m
            memory: 500Mi
          limits:
            cpu: '2'
            memory: 4000Mi
        ports:
        - name: zookeeper-2181
          containerPort: 2181
          protocol: TCP
        volumeMounts:
          - name: config
            mountPath: /conf
          - name: data
            mountPath: /data
          - name: datalog
            mountPath: /datalog
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: zookeeper-data
      - name: datalog
        persistentVolumeClaim:
          claimName: zookeeper-datalog
      - name: config
        configMap:
          name: zookeeper-config
          items:
            - key: zoo-cfg
              path: zoo.cfg

---
apiVersion: v1
kind: Service
metadata:
  name: zookeeper
spec:
  ports:
    - name: zookeeper-2181
      protocol: TCP
      port: 2181
      targetPort: 2181
  selector:
    app: zookeeper
  type: ClusterIP
```

> Deployment 和 Cluster Service 放在了一个配置文件。

- vi **zookeeper-external-svc.yaml**

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: zookeeper-external-svc
  labels:
    app: zookeeper-external-svc
spec:
  ports:
    - name: tcp-zookeeper-external
      protocol: TCP
      port: 2181
      targetPort: 2181
      nodePort: 32181
  selector:
    app: zookeeper
  type: NodePort
```

> **注意：可选配置项**，如果不需要被 K8s 集群之外的服务访问，则不需要配置。

### 部署资源

- 部署 PersistentVolumeClaim

```shell
kubectl apply -f zookeeper-pvc.yaml
```

- 部署 ConfigMap

```shell
kubectl apply -f zookeeper-cm.yaml
```

- 部署 Deployment

```shell
kubectl apply -f zookeeper-deploy.yaml
```

- 部署 External Service

```shell
kubectl apply -f zookeeper-svc.yaml
```

### K8s 部署资源验证

- 验证 PersistentVolumeClaim

```shell
[root@ks-master-0 single]# kubectl get pvc -o wide
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE   VOLUMEMODE
zookeeper-data      Bound    pvc-371c9406-1757-451a-9c89-bed47ac71dd4   1Gi        RWO            glusterfs      12s   Filesystem
zookeeper-datalog   Bound    pvc-457a134c-0db2-4efc-902c-555daba2057e   2Gi        RWO            glusterfs      11s   Filesystem
```

- 验证 Deployment

```shell
[root@ks-master-0 single]#  kubectl get deploy -o wide
NAME        READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS   IMAGES            SELECTOR
zookeeper   1/1     1            1           5m1s   zookeeper    zookeeper:3.8.2   app=zookeeper
```

- 验证 Pod

```shell
[root@ks-master-0 single]#  kubectl get pod -o wide
NAME                         READY   STATUS        RESTARTS        AGE     IP             NODE          NOMINATED NODE   READINESS GATES
zookeeper-bcfc6cc5c-bh56m    1/1     Running       0               54s     10.233.120.8   ks-worker-1   <none>           <none>
```

- 验证 Service

```shell
[root@ks-master-0 single]# kubectl get svc -o wide
NAME                                                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE    SELECTOR
zookeeper                                                ClusterIP   10.233.58.30    <none>        2181/TCP         59s    app=zookeeper
zookeeper-external-svc                                   NodePort    10.233.40.37    <none>        2181:32181/TCP   59s    app=zookeeper
```

### Zookeeper 服务可用性验证

**在 K8s 集群内部验证**。

- 在 K8s 上创建一个 Zookeeper Client Pod 验证

```shell
kubectl run zookeeper-client --image=zookeeper:3.8.2
```

- 验证 Zookeeper Server 连通性

```shell
# 进入 Zookeeper Client 容器内部
kubectl exec -it zookeeper-client -- bash

# 连接 Zookeeper Server
bin/zkCli.sh -server 10.233.58.30:2181

# 成功结果如下
[root@ks-master-0 single]# kubectl exec -it zookeeper-client -- bash
root@zookeeper-client:/apache-zookeeper-3.8.2-bin# bin/zkCli.sh -server 10.233.58.30:2181
Connecting to 10.233.58.30:2181
2023-08-07 07:44:16,110 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:zookeeper.version=3.8.2-139d619b58292d7734b4fc83a0f44be4e7b0c986, built on 2023-07-05 19:24 UTC
2023-08-07 07:44:16,117 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:host.name=zookeeper-client
2023-08-07 07:44:16,117 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.version=11.0.20
2023-08-07 07:44:16,117 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.vendor=Eclipse Adoptium
2023-08-07 07:44:16,117 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.home=/opt/java/openjdk
2023-08-07 07:44:16,117 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.class.path=/apache-zookeeper-3.8.2-bin/bin/......(此处有省略)
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.library.path=/usr/java/packages/lib:/usr/lib64:/lib64:/lib:/usr/lib
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.io.tmpdir=/tmp
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:java.compiler=<NA>
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:os.name=Linux
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:os.arch=amd64
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:os.version=5.10.0-153.12.0.92.oe2203sp2.x86_64
2023-08-07 07:44:16,118 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:user.name=root
2023-08-07 07:44:16,119 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:user.home=/root
2023-08-07 07:44:16,119 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:user.dir=/apache-zookeeper-3.8.2-bin
2023-08-07 07:44:16,119 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:os.memory.free=42MB
2023-08-07 07:44:16,119 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:os.memory.max=256MB
2023-08-07 07:44:16,120 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:os.memory.total=48MB
2023-08-07 07:44:16,123 [myid:] - INFO  [main:o.a.z.ZooKeeper@637] - Initiating client connection, connectString=10.233.58.30:2181 sessionTimeout=30000 watcher=org.apache.zookeeper.ZooKeeperMain$MyWatcher@18bf3d14
2023-08-07 07:44:16,128 [myid:] - INFO  [main:o.a.z.c.X509Util@78] - Setting -D jdk.tls.rejectClientInitiatedRenegotiation=true to disable client-initiated TLS renegotiation
2023-08-07 07:44:16,134 [myid:] - INFO  [main:o.a.z.ClientCnxnSocket@239] - jute.maxbuffer value is 1048575 Bytes
2023-08-07 07:44:16,143 [myid:] - INFO  [main:o.a.z.ClientCnxn@1741] - zookeeper.request.timeout value is 0. feature enabled=false
Welcome to ZooKeeper!
2023-08-07 07:44:16,171 [myid:10.233.58.30:2181] - INFO  [main-SendThread(10.233.58.30:2181):o.a.z.ClientCnxn$SendThread@1177] - Opening socket connection to server zookeeper.default.svc.cluster.local/10.233.58.30:2181.
2023-08-07 07:44:16,173 [myid:10.233.58.30:2181] - INFO  [main-SendThread(10.233.58.30:2181):o.a.z.ClientCnxn$SendThread@1179] - SASL config status: Will not attempt to authenticate using SASL (unknown error)
2023-08-07 07:44:16,185 [myid:10.233.58.30:2181] - INFO  [main-SendThread(10.233.58.30:2181):o.a.z.ClientCnxn$SendThread@1011] - Socket connection established, initiating session, client: /10.233.118.8:55022, server: zookeeper.default.svc.cluster.local/10.233.58.30:2181
JLine support is enabled
2023-08-07 07:44:16,251 [myid:10.233.58.30:2181] - INFO  [main-SendThread(10.233.58.30:2181):o.a.z.ClientCnxn$SendThread@1452] - Session establishment complete on server zookeeper.default.svc.cluster.local/10.233.58.30:2181, session id = 0x1000178f5af0000, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 10.233.58.30:2181(CONNECTED) 0]
```

- 创建测试数据，验证服务可用性

```shell
# 创建测试数据
[zk: 10.233.58.30:2181(CONNECTED) 0] create /test test-data1
Created /test

# 读取测试数据
[zk: 10.233.58.30:2181(CONNECTED) 1] get /test
test-data1
```

**在 K8s 集群外部验证。**

**本文直接使用 K8s Master-0 节点安装 Zookeeper 客户端进行测试验证。**

- 安装 openjdk，仅限于测试验证。

```shell
yum install java-11-openjdk
```

- 安装 Zookeeper 客户端，到 [Zookeeper 官网](https://zookeeper.apache.org/releases.html "Zookeeper 官网")找相应版本的软件包。本文选择 **3.8.2** 作为测试版本。

```shell
# 下载并解压 Zookeeper（在国内源下载）
wget https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.8.2/apache-zookeeper-3.8.2-bin.tar.gz

tar xvf apache-zookeeper-3.8.2-bin.tar.gz
```

- 验证 Zookeeper Server 连通性

```shell
cd apache-zookeeper-3.8.2-bin/bin/
./zkCli.sh -server 192.168.9.91:32181

# 成功结果如下（结果有省略）
[root@ks-master-0 bin]# ./zkCli.sh -server 192.168.9.91:32181
/usr/bin/java
Connecting to 192.168.9.91:32181
2023-08-07 15:46:53,156 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:zookeeper.version=3.8.2-139d619b58292d7734b4fc83a0f44be4e7b0c986, built on 2023-07-05 19:24 UTC
......

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 192.168.9.91:32181(CONNECTED) 0]
```

- 创建测试数据，验证服务可用性

```shell
# 创建测试数据
[zk: 192.168.9.91:32181(CONNECTED) 0] create /test2 test2-data1
Created /test2

# 读取测试数据
[zk: 192.168.9.91:32181(CONNECTED) 1] get /test2
test2-data1
```

至此，Boss 交代的任务完成了一半，已经实现了单节点 Zookeeper 的部署，并在 K8s 集群内部和外部分别做了连通性、可用性测试。

但是，时间已超期，已经来到了第二天，所以说啊，对于一个未知的任务，实现起来，根本没有 Boss 想象的那么简单。

不过，由于完成了单节点的任务，先上交汇报给 Boss，并说明一下实现思路、过程，部署过程中遇到的问题及解决方案（切记不要直接跟 Boss 说这个很难，你预估的时间有问题，那么说纯属找抽）。

按上面的套路汇报完，得到了 Boss 的理解和认可（Boss 其实还是很好说话的，只要你能以理说服他），让我先把单节点的 Zookeeper 环境交给测试使用，再去继续研究集群模式的部署方案。

这波操作不仅没有受到批评，还给自己争取了时间，完美！！！

## 集群模式 Zookeeper 部署

单节点部署 Zookeeper 的任务完成以后，接下来开始研究集群模式的 Zookeeper 部署，**AI 助手**给出的默认示例根本就不靠谱，我也懒得再调教他了。

**为什么这么说？**

因为我利用 AI 助手给的方案，利用 DockerHub 提供的 Zookeeper 去尝试在 K8s 集群上部署 Zookeeper 集群，耗时 **2** 天（主要是犯病了，钻了牛角尖，就想搞定它，无奈能力又不够！）

接下来简单说一下，我被折磨疯了的两天都做了哪些尝试、遇到了哪些问题、有哪些心得体会（逼得我都差点祭出第三板斧了）。

- 集群模式的关键解决 myid 和 servers 的配置
- servers 的配置这个没有问题很好解决，可以在配置文件中直接写入或是用 ENV 的方式注入
- myid 是重点，DockHub 镜像仓库中提供的 Zookeeper 镜像，节点 myid 不能动态配置
- 在实验中尝试了 **initContainers** 、**SidecarContainer**、ConfigMap 挂载启动脚本等方式，都没有起到效果
- 不是说 DockHub 镜像彻底不能用，只是需要进行启动脚本改造，甚至需要重新打 Image，太麻烦了，已经耗时 **2** 天了，不得不暂时放弃
- 上面几种尝试以及最后的成品资源配置清单的编写，都是在 KubeSphere 的图形化管理控制台下测试验证的，比命令行界面方便了太多
- **心得：** 通往成功的路有千万条，一条不通时可以尝试换条路，**不要死磕到底**。我们的目的是为了解决问题，**能解决问题的办法就是好办法**，钻牛角尖的精神也要分情况

最终只能另寻出路，好在之前的调研中，已经找到了另外两种可能的解决方案。

- 使用 Bitnami 制作的镜像部署 Zookeeper 集群（**最终选择**）。
- Kubernetes 官方文档示例中介绍的方案，该方案使用镜像 **registry.k8s.io/kubernetes-zookeeper:1.0-3.4.10**，使用 **PodDisruptionBudget** 确保服务可用性。

**说一下最终的选型理由**：

- **Pod Disruption Budget**，有点复杂不太适合我目前段位。

Pod Disruption Budget (Pod 干扰 预算) 简称 PDB，Kubernetes version **>= 1.21** 才可以使用 PodDisruptionBudget。PDB 的作用是将限制在同一时间因自愿干扰导致的多副本应用中发生宕机的 Pod 数量。

具体的知识点，本文不细说了，反正我目前也不打算用了（唉！主要是说不明白难免误人子弟），有兴趣的可以参考官方文档的 [PDB 介绍](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget "PDB 介绍")和 [PDB 配置案例](https://kubernetes.io/zh-cn/docs/tasks/run-application/configure-pdb/ "PDB 配置案例")。

- Bitnami 制作的镜像部署 Zookeeper 集群，该方案网上的参考案例有很多，而且该方案采用 Zookeeper 原生部署方案，没有额外的 K8S 机制，减少了复杂度。**这个也是选择的重点**。

接下来，我就开始尝试使用 Bitnami 制作的 **Zookeeper** 镜像完成 **Zookeeper** 集群的部署。

### 思路梳理

在 K8s 集群上部一套 Zookeeper 集群需要的资源清单如下：

- **StatefulSet**
- **Headless Service**

- ConfigMap：zoo.cfg（没有使用，所有的配置都使用 ENV 的形式）
- **ConfigMap：setup.sh（启动脚本，计划使用实际没有使用，最终采取了 ENV 和 Command 方式）**
- **External Service（可选）**

**注意：由于本文配置方案没有考虑安全配置仅适用于开发、测试环境。不要把本文的示例直接拿到生产环境使用，必须参考官方配置文档增加相应的 ENV 配置，方可用于生产**。

### 资源配置清单

**如无特殊说明，所有涉及 K8s 的操作都在 Master-0 节点上执行 , 配置文件根目录为 /srv/opsman/k8s-yaml**。

- 创建资源清单文件夹

```shell
cd /srv/opsman/k8s-yaml
mkdir -p zookeeper/cluster
cd zookeeper/cluster
```

- **vi zookeeper-svc.yaml**

```yaml
---
# Headless Service，用于 Zookeeper 集群之间相互通讯
apiVersion: v1
kind: Service
metadata:
  name: zk-hs
  labels:
    app: zookeeper
spec:
  ports:
    - name: tcp-client
      protocol: TCP
      port: 2181
      targetPort: 2181
    - name: tcp-follower
      port: 2888
      targetPort: 2888
    - name: tcp-election
      port: 3888
      targetPort: 3888
  selector:
    app: zookeeper
  clusterIP: None
  type: ClusterIP

---
# Client Service，用于 K8S 集群内的应用访问 Zookeeper
apiVersion: v1
kind: Service
metadata:
  name: zk-cs
  labels:
    app: zookeeper
spec:
  ports:
    - name: tcp-client
      protocol: TCP
      port: 2181
      targetPort: 2181
  selector:
    app: zookeeper
  type: ClusterIP
```

- **vi zookeeper-sts.yaml**

```yaml
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: zookeeper
  labels:
    app: zookeeper
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zookeeper
  serviceName: zk-hs
  template:
    metadata:
      name: zookeeper
      labels:
        app: zookeeper
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values:
                    - zookeeper
              topologyKey: "kubernetes.io/hostname"
      containers:
        - name: zookeeper
          image: bitnami/zookeeper:3.8.2
          command:
            - bash
            - '-ec'
            - |
              HOSTNAME="$(hostname -s)"
              if [[ $HOSTNAME =~ (.*)-([0-9]+)$ ]]; then
                ORD=${BASH_REMATCH[2]}
                export ZOO_SERVER_ID="$((ORD + 1 ))"
              else
                echo "Failed to get index from hostname $HOST"
                exit 1
              fi
              exec /entrypoint.sh /run.sh
          resources:
            limits:
              cpu: 1
              memory: 2Gi
            requests:
              cpu: 50m
              memory: 500Mi
          env:
            - name: ZOO_ENABLE_AUTH
              value: "no"
            - name: ALLOW_ANONYMOUS_LOGIN
              value: "yes"
            - name: ZOO_SERVERS
              value: >
                zookeeper-0.zk-hs.default.svc.cluster.local:2888:3888
                zookeeper-1.zk-hs.default.svc.cluster.local:2888:3888
                zookeeper-2.zk-hs.ddefault.svc.cluster.local:2888:3888
          ports:
            - name: client
              containerPort: 2181
            - name: follower
              containerPort: 2888
            - name: election
              containerPort: 3888
          livenessProbe:
            tcpSocket:
              port: client
            failureThreshold: 6
            initialDelaySeconds: 30
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 5
          readinessProbe:
            tcpSocket:
              port: client
            failureThreshold: 6
            initialDelaySeconds: 5
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 5
          volumeMounts:
            - name: data
              mountPath: /bitnami/zookeeper
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ "ReadWriteOnce" ]
        storageClassName: "glusterfs"
        resources:
          requests:
            storage: 2Gi
```

> **说明：**
>
> - **ENV** 的配置我只用了最基本的，重点就是 **ZOO_SERVERS**，更多参数的用法请参考 [Bitnami 官方文档](https://hub.docker.com/r/bitnami/zookeeper "Bitnami 官方文档")
> - **Command** 里直接写了启动命令，也可以做成 ConfigMap 挂载为脚本
> - **default.svc.cluster.local**，注意 FQDN 只能这么写，不要写成自定义的，哪怕我的集群域名是 **opsman.top**（这个是遗留问题，来不及细看了，回头再说）

- vi zookeeper-external-svc.yaml

```yaml
---
# External Client Service，用于 K8S 集群外部访问 Zookeeper
apiVersion: v1
kind: Service
metadata:
  name: zookeeper-external-svc
  labels:
    app: zookeeper-external-svc
spec:
  ports:
    - name: tcp-zookeeper-external
      protocol: TCP
      port: 2181
      targetPort: 2181
      nodePort: 32181
  selector:
    app: zookeeper
  type: NodePort
```

> **注意：可选配置项**，如果不需要被 K8s 集群之外的服务访问，则不需要配置。

### 部署资源

- 部署 Cluster 和 Headless Service

```shell
kubectl apply -f zookeeper-svc.yaml
```

- 部署 StatefulSet

```shell
kubectl apply -f zookeeper-sts.yaml
```

- 部署外部 Services

```shell
kubectl apply -f zookeeper-external-svc.yaml
```

### K8s 部署资源验证

- 验证 PersistentVolumeClaim

```shell
[root@ks-master-0 cluster]# kubectl get pvc -o wide
NAME               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE    VOLUMEMODE
data-zookeeper-0   Bound    pvc-342c3869-17ca-40c7-9db0-755d5af0f85f   2Gi        RWO            glusterfs      2m7s   Filesystem
data-zookeeper-1   Bound    pvc-6744813f-0f5b-4138-8ffc-387f63044af3   2Gi        RWO            glusterfs      47s    Filesystem
data-zookeeper-2   Bound    pvc-731edc8d-189a-4601-aa64-a8d6754d93ec   2Gi        RWO            glusterfs      28s    Filesystem
```

- 验证 StatefulSet

```shell
[root@ks-master-0 cluster]# kubectl get sts -o wide
NAME        READY   AGE    CONTAINERS   IMAGES
zookeeper   3/3     2m3s   zookeeper    bitnami/zookeeper:3.8.2
```

- 验证 Pod

```shell
[root@ks-master-0 cluster]# kubectl get pod -o wide
NAME               READY   STATUS    RESTARTS   AGE     IP              NODE          NOMINATED NODE   READINESS GATES
zookeeper-0        1/1     Running   0          2m42s   10.233.118.45   ks-worker-2   <none>           <none>
zookeeper-1        1/1     Running   0          83s     10.233.120.17   ks-worker-1   <none>           <none>
zookeeper-2        1/1     Running   0          64s     10.233.115.99   ks-worker-0   <none>           <none>
```

- 验证 Service

```shell
[root@ks-master-0 cluster]# kubectl get svc -o wide
NAME                                                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE     SELECTOR
zk-cs                                                    ClusterIP   10.233.43.229   <none>        2181/TCP                     3m58s   app=zookeeper
zk-hs                                                    ClusterIP   None            <none>        2181/TCP,2888/TCP,3888/TCP   3m58s   app=zookeeper
zookeeper-external-svc                                   NodePort    10.233.45.5     <none>        2181:32181/TCP               10s     app=zookeeper
```

### Zookeeper 集群状态验证

- 验证 StatefulSet 创建的 Pod 配置的主机名

```shell
[root@ks-master-0 cluster]# for i in 0 1 2; do kubectl exec zookeeper-$i -- hostname; done
zookeeper-0
zookeeper-1
zookeeper-2
```

- 验证 StatefulSet 创建的 Pod 配置的完全限定域名（Fully Qualified Domain Name，FQDN）

```shell
[root@ks-master-0 cluster]# for i in 0 1 2; do kubectl exec zookeeper-$i -- hostname -f; done
zookeeper-0.zk-hs.default.svc.cluster.local
zookeeper-1.zk-hs.default.svc.cluster.local
zookeeper-2.zk-hs.default.svc.cluster.local
```

- 验证每个 Zookeeper 服务的 myid 文件内容

```shell
[root@ks-master-0 cluster]# for i in 0 1 2; do echo "myid zookeeper-$i";kubectl exec zookeeper-$i -- cat /bitnami/zookeeper/data/myid; done
myid zookeeper-0
1
myid zookeeper-1
2
myid zookeeper-2
3
```

- 验证 Zookeeper 生成的配置文件

```shell
[root@ks-master-0 cluster]# kubectl exec -it zookeeper-0 --  cat /opt/bitnami/zookeeper/conf/zoo.cfg | grep -vE "^#|^$"
tickTime=2000
initLimit=10
syncLimit=5
dataDir=/bitnami/zookeeper/data
clientPort=2181
maxClientCnxns=60
autopurge.snapRetainCount=3
autopurge.purgeInterval=0

preAllocSize=65536
snapCount=100000
maxCnxns=0
reconfigEnabled=false
quorumListenOnAllIPs=false
4lw.commands.whitelist=srvr, mntr
maxSessionTimeout=40000
admin.serverPort=8080
admin.enableServer=true
server.1=zookeeper-0.zk-hs.default.svc.cluster.local:2888:3888;2181
server.2=zookeeper-1.zk-hs.default.svc.cluster.local:2888:3888;2181
server.3=zookeeper-2.zk-hs.default.svc.cluster.local:2888:3888;2181
```

- 验证集群状态

```shell
[root@ks-master-0 cluster]# for i in 0 1 2; do echo -e "# myid zookeeper-$i \n";kubectl exec zookeeper-$i -- /opt/bitnami/zookeeper/bin/zkServer.sh status;echo -e "\n"; done
# myid zookeeper-0

/opt/bitnami/java/bin/java
ZooKeeper JMX enabled by default
Using config: /opt/bitnami/zookeeper/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost. Client SSL: false.
Mode: leader


# myid zookeeper-1

/opt/bitnami/java/bin/java
ZooKeeper JMX enabled by default
Using config: /opt/bitnami/zookeeper/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost. Client SSL: false.
Mode: follower


# myid zookeeper-2

/opt/bitnami/java/bin/java
ZooKeeper JMX enabled by default
Using config: /opt/bitnami/zookeeper/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost. Client SSL: false.
Mode: follower

```

### Zookeeper 服务可用性验证

**在 K8s 集群内部验证**。

- 在 K8s 上创建一个 Zookeeper Client Pod 验证（单节点验证时创建过，不需要再创建了）

```shell
kubectl run zookeeper-client --image=zookeeper:3.8.2
```

- 验证 Zookeeper Server 连通性

```shell
# 进入 Zookeeper Client 容器内部
kubectl exec -it zookeeper-client -- bash

# 连接 Zookeeper Server（ 10.233.43.229 是 Cluster Service 的 IP）
bin/zkCli.sh -server 10.233.43.229:2181

# 成功结果如下(内容有省略)
[root@ks-master-0 cluster]# kubectl exec -it zookeeper-client -- bash
root@zookeeper-client:/apache-zookeeper-3.8.2-bin# bin/zkCli.sh -server 10.233.43.229:2181
Connecting to 10.233.43.229:2181
2023-08-08 10:08:40,864 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:zookeeper.version=3.8.2-139d619b58292d7734b4fc83a0f44be4e7b0c986, built on 2023-07-05 19:24 UTC
.....
2023-08-08 10:08:40,872 [myid:] - INFO  [main:o.a.z.ZooKeeper@637] - Initiating client connection, connectString=10.233.43.229:2181 sessionTimeout=30000 watcher=org.apache.zookeeper.ZooKeeperMain$MyWatcher@18bf3d14
2023-08-08 10:08:40,886 [myid:] - INFO  [main:o.a.z.c.X509Util@78] - Setting -D jdk.tls.rejectClientInitiatedRenegotiation=true to disable client-initiated TLS renegotiation
2023-08-08 10:08:40,892 [myid:] - INFO  [main:o.a.z.ClientCnxnSocket@239] - jute.maxbuffer value is 1048575 Bytes
2023-08-08 10:08:40,903 [myid:] - INFO  [main:o.a.z.ClientCnxn@1741] - zookeeper.request.timeout value is 0. feature enabled=false
Welcome to ZooKeeper!
2023-08-08 10:08:40,920 [myid:10.233.43.229:2181] - INFO  [main-SendThread(10.233.43.229:2181):o.a.z.ClientCnxn$SendThread@1177] - Opening socket connection to server zk-cs.default.svc.cluster.local/10.233.43.229:2181.
2023-08-08 10:08:40,923 [myid:10.233.43.229:2181] - INFO  [main-SendThread(10.233.43.229:2181):o.a.z.ClientCnxn$SendThread@1179] - SASL config status: Will not attempt to authenticate using SASL (unknown error)
JLine support is enabled
2023-08-08 10:08:40,948 [myid:10.233.43.229:2181] - INFO  [main-SendThread(10.233.43.229:2181):o.a.z.ClientCnxn$SendThread@1011] - Socket connection established, initiating session, client: /10.233.118.8:38050, server: zk-cs.default.svc.cluster.local/10.233.43.229:2181
2023-08-08 10:08:41,064 [myid:10.233.43.229:2181] - INFO  [main-SendThread(10.233.43.229:2181):o.a.z.ClientCnxn$SendThread@1452] - Session establishment complete on server zk-cs.default.svc.cluster.local/10.233.43.229:2181, session id = 0x10007253d840000, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 10.233.43.229:2181(CONNECTED) 0]
```

- 创建测试数据，验证服务可用性

```shell
# 创建测试数据
[zk: 10.233.43.229:2181(CONNECTED) 0] create /test test-data1
Created /test

# 读取测试数据
[zk: 10.233.43.229:2181(CONNECTED) 1] get /test
test-data1
```

**在 K8s 集群外部验证。**

- 验证 Zookeeper Server 连通性

```shell
# 进入 Zookeeper 安装包的 bin 目录
cd apache-zookeeper-3.8.2-bin/bin/

# 连接 Zookeeper Server（ 192.168.9.91 是 K8S Master-0 节点的 IP，32181 是 External Service 定义的 NodePort 端口号）
./zkCli.sh -server 192.168.9.91:32181

# 成功结果如下（结果有省略）
[root@ks-master-0 bin]# ./zkCli.sh -server 192.168.9.91:32181
/usr/bin/java
Connecting to 192.168.9.91:32181
2023-08-08 18:13:52,650 [myid:] - INFO  [main:o.a.z.Environment@98] - Client environment:zookeeper.version=3.8.2-139d619b58292d7734b4fc83a0f44be4e7b0c986, built on 2023-07-05 19:24 UTC
......
2023-08-08 18:13:52,660 [myid:] - INFO  [main:o.a.z.ZooKeeper@637] - Initiating client connection, connectString=192.168.9.91:32181 sessionTimeout=30000 watcher=org.apache.zookeeper.ZooKeeperMain$MyWatcher@5c072e3f
2023-08-08 18:13:52,666 [myid:] - INFO  [main:o.a.z.c.X509Util@78] - Setting -D jdk.tls.rejectClientInitiatedRenegotiation=true to disable client-initiated TLS renegotiation
2023-08-08 18:13:52,671 [myid:] - INFO  [main:o.a.z.ClientCnxnSocket@239] - jute.maxbuffer value is 1048575 Bytes
2023-08-08 18:13:52,686 [myid:] - INFO  [main:o.a.z.ClientCnxn@1741] - zookeeper.request.timeout value is 0. feature enabled=false
Welcome to ZooKeeper!
2023-08-08 18:13:52,708 [myid:192.168.9.91:32181] - INFO  [main-SendThread(192.168.9.91:32181):o.a.z.ClientCnxn$SendThread@1177] - Opening socket connection to server ks-master-0/192.168.9.91:32181.
2023-08-08 18:13:52,709 [myid:192.168.9.91:32181] - INFO  [main-SendThread(192.168.9.91:32181):o.a.z.ClientCnxn$SendThread@1179] - SASL config status: Will not attempt to authenticate using SASL (unknown error)
JLine support is enabled
2023-08-08 18:13:52,721 [myid:192.168.9.91:32181] - INFO  [main-SendThread(192.168.9.91:32181):o.a.z.ClientCnxn$SendThread@1011] - Socket connection established, initiating session, client: /192.168.9.91:45004, server: ks-master-0/192.168.9.91:32181
2023-08-08 18:13:52,776 [myid:192.168.9.91:32181] - INFO  [main-SendThread(192.168.9.91:32181):o.a.z.ClientCnxn$SendThread@1452] - Session establishment complete on server ks-master-0/192.168.9.91:32181, session id = 0x10007253d840001, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 192.168.9.91:32181(CONNECTED) 0]

```

- 创建测试数据，验证服务可用性

```shell
# 创建测试数据
[zk: 192.168.9.91:32181(CONNECTED) 0] create /test2 test2-data1
Created /test2

# 读取测试数据（读取了 2次 测试数据）
[zk: 192.168.9.91:32181(CONNECTED) 1] get /test
test-data1
[zk: 192.168.9.91:32181(CONNECTED) 2] get /test2
test2-data1
```

至此，实现了 Zookeeper 集群模式部署，并在 K8S 集群内部和外部分别做了连通性、可用性测试。

### 在 KubeSphere 管理控制台验证

看一看 Zookeeper 相关资源在 KubeSphere 管理控制台中展示效果。

- StatefulSet

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-sts-zk-res-status.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-sts-zk-monitors.png)

- Pods

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-pods-zk-0-res-status.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-pods-zk-0-monitors.png)

- Service

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-zk-hs-res-status.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-zk-cs-res-status.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-zk-exts-res-status.png)

## 总结

本文详细介绍了 Zookeeper 单节点和集群模式在基于 KubeSphere 部署的 K8s 集群上的安装部署、测试验证的过程。具体涉及的内容总结如下：

- 如何利用 **AI 助手** 和 搜索引擎辅助完成运维工作。
- 如何利用 DockerHub 官方提供的 Zookeeper 镜像，在 K8s 集群上部署单节点 Zookeeper 服务并验证测试。
- 如何利用 Bitnami 提供的 Zookeeper 镜像，在 K8s 集群上部署 Zookeeper 集群服务并验证测试。
- 介绍了一种使用 **PodDisruptionBudget** 部署 Zookeeper 集群的示例，但是并未实际验证。

**本文的配置方案可直接用于开发测试环境，对于生产环境也有一定的借鉴意义。**
