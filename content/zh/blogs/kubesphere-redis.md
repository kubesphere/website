---
title: '在 KubeSphere 中部署高可用 Redis 集群'
tag: 'KubeSphere'
keywords: 'KubeSphere, Redis, Kubernetes, 云原生'
description: '我这里新建了一个 test-project 的项目空间来做 Redis 集群所有安装资源的放置，后续在 DNS 上会用到项目空间名称，会标注这一部分，需要注意用自己的项目空间名。'
createTime: '2022-09-24'
author: '余生大大'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-redis-cover.png'
---

## 前言

`Redis` 是在开发过程中经常用到的**缓存中间件**，在生产环境中为了考虑**稳定性**和**高可用**一般为集群模式的部署。

常规部署在虚拟机上的方式配置繁琐并且需要手动重启节点，而使用 `K8s` 进行 `Redis` 集群的部署有以下优点：

- **安装便捷**：使用镜像或者 `yaml` 配置文件即可一件安装
- **自动调度**：容器挂掉后会自动调度重启和资源分配
- **缩扩容方便**：在 `扩容`、`缩容` 方面的优点无需多说，一键伸缩
- **稳定高效**：`K8s` 在整个集群上进行调度，只要整个集群不挂掉总会调度到合适节点重启容器服务

## 安装 Redis 集群

我这里新建了一个 `test-project` 的项目空间来做 `Redis` 集群所有安装资源的放置，后续在 `DNS` 上会用到项目空间名称，会标注这一部分，需要注意用自己的项目空间名。

安装集群大概分为以下几步：

1. 配置 `redis.conf` 字典；
2. 创建 `redis` 服务；
3. 容器组配置；
4. 存储设置；
5. 高级设置。

现在从第一步开始。

### 配置 redis.conf 字典

在项目空间的 `配置` → `配置字典` → `创建` 进行配置字典的创建。

![](https://pek3b.qingstor.com/kubesphere-community/images/8300ba2ab7ae4cb6aa7911b9e239326b.png)

名称就叫 `redis-conf` 然后下一步 添加键值对数据。

![](https://pek3b.qingstor.com/kubesphere-community/images/d793fa7f942846228973287d86047edf.png)

`key` 值的内容为 `redis.conf`，`value` 值为：
```cpp
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-require-full-coverage no
cluster-migration-barrier 1
appendonly yes
```

### 创建 Redis 服务

在项目空间的 `应用负载` → `服务` → `创建` 进行 **Redis** 服务的创建。

![](https://pek3b.qingstor.com/kubesphere-community/images/c194c72b03a54db9b4147f917b942ee3.png)

选择`有状态服务`，需要数据存储的服务基本都是有状态的服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/a3cdd551367041b6b4fa463aa3853cd0.png)

基本设置里名称就叫 `redis-cluster` 然后进行重头戏，下一步的`容器组配置`。

### 容器组配置

这一步的核心就是配置 Redis 的容器，集群数量就选择常规的三主三从，那容器的副本数量就是 6 个。

![](https://pek3b.qingstor.com/kubesphere-community/images/cafa6de6d3f843d9beb46043e61e3f1d.png)

容器组副本数量调到 6 个，点击添加容器。

![](https://pek3b.qingstor.com/kubesphere-community/images/51c2b101bca74953be8121d4b779b082.png)

镜像选择 `docker hub` 中 `redis` 的 `6.2.3` 版本，并选择使用默认端口，CPU 和内存可以选择性预留，如果不预留就是调度公共资源。

![](https://pek3b.qingstor.com/kubesphere-community/images/cb39404b8c96471d8160871034fa71f0.png)

选择`使用默认端口`的话下面的端口设置就是如上图一样都会使用 `6379`，还有就是配置启动命令。

如上图配置：
- 命令：`redis-server`
- 参数：`/etc/redis/redis.conf`

参数指向的就是之前字典配置的内容，但是需要下一步`存储设置`里进行配置字典才能使用。

![](https://pek3b.qingstor.com/kubesphere-community/images/9370b7804c004fb78fd956eb0e6601b6.png)

其他内容没有什么需要配置的，选择对勾完成容器配置。

![](https://pek3b.qingstor.com/kubesphere-community/images/3a42345e3d314ffe947e15124f9cec16.png)

更新策略就是推荐的`滚动更新`，其他也没什么需要修改的，点击下一步配置`存储设置`。

### 存储设置

在这一步有两个操作
- `添加持久卷声明模板`
- `挂载配置字典`

![](https://pek3b.qingstor.com/kubesphere-community/images/6134fbc621e74b7aad80b648318224d3.png)

#### 添加持久卷声明模板

**PVC 名称前缀**：redis-pvc

**容量**：10G

**挂载路径**：
- **权限**：读写

- **地址**：/data

  ![](https://pek3b.qingstor.com/kubesphere-community/images/529031090283453bbc8d2aad557a2c8a.png)
  主要是挂载路径选好，配置好后点击对勾完成配置

#### 挂载配置字典

这一步是挂载我们之前配置的字典 `redis-conf`，也是我们 `redis` 启动命令的参数内容。

![](https://pek3b.qingstor.com/kubesphere-community/images/168a1df6e7b1473d96c1533f3ac60d86.png)

选择 `redis` 的配置字典。

![](https://pek3b.qingstor.com/kubesphere-community/images/304b27cb0fd14786a2d92ef5158bf60f.png)

挂载权限为：`只读`，地址为：`/etc/redis`；跟上面的命令参数的配置相对应。

![](https://pek3b.qingstor.com/kubesphere-community/images/e356f8c10f9046879b164646346dfbab.png)

特定键选择 `redis.conf`  后面同名 `redis.conf`，完成后点击对勾回到存储设置。

![](https://pek3b.qingstor.com/kubesphere-community/images/2876b6f7847342c1b6849c6fc650f567.png)

配置好后就入上图，点击下一步进入最后的高级设置。

![](https://pek3b.qingstor.com/kubesphere-community/images/ed059b009d754787ae78e11ada3d30dd.png)

`高级设置`里是一些额外配置，可以根据自己场景选择调整配置，调成完成后点击`创建`  **进行 Redis 集群容器的创建**。

## 初始化 Redis 集群

创建完 **Redis 服务**后点击 `redis` 的服务名称进入 `redis` 服务详情，详情如下图：

![](https://pek3b.qingstor.com/kubesphere-community/images/8c9173e78607480eb2951213eadf8085.png)

6 个 `redis` 的容器组都启动成功了，接下来就是初始化集群；因为我们配置的 `redis` 的服务是`有状态服务 (Headless)` 所以访问模式可以通过内部 DNS，访问格式是：**(容器名称).( 容器 DNS).svc.cluster.local**。

![](https://pek3b.qingstor.com/kubesphere-community/images/284a13c2f95c4164a41358150e99748f.png)

按上图示例 比如访问**集群 1 节点**访问地址就是 `redis-cluster-v1-1`  加 `DNS` 地址  `redis-cluster.test-project` 加 `svc.cluster.local`，完整地址如下：

```powershell
redis-cluster-v1-1.redis-cluster.test-project.svc.cluster.local
```
在 redis 集群的非第一节点的其他节点终端内通过这个地址进行访问验证他们是否互通，进入 3 节点的终端，如下图：

![](https://pek3b.qingstor.com/kubesphere-community/images/725e8b46a81c4b3a95cbc878cec54888.png)

进入终端，执行命令：

```powershell
redis-cli -h redis-cluster-v1-1.redis-cluster.test-project.svc.clusterredis.local
```

如果能如下图一样跳转到 `v1-1` 的节点上就代表这两个节点互通。

![](https://pek3b.qingstor.com/kubesphere-community/images/714d44c1c8064ec9ba5789cacb68f4dd.png)

执行命令：`cluster info`  查看节点的集群情况。

![](https://pek3b.qingstor.com/kubesphere-community/images/3031fb1f34cb4367aed7f2d0f96d429e.png)

主要看上图的这两个参数，`nodes` 为 `1` 表明当前节点只有 `1` 个，`cluster_size` 表明当前没有 `master` 节点，所以目前还不是集群结构，`info` 属性的详解在此列出：

- `cluster_state`：ok 状态表示集群可以正常接受查询请求。fail 状态表示，至少有一个哈希槽没有被绑定（说明有哈希槽没有被绑定到任意一个节点），或者在错误的状态（节点可以提供服务但是带有 FAIL 标记），或者该节点无法联系到多数 master 节点。
- `cluster_slots_assigned`：已分配到集群节点的哈希槽数量（不是没有被绑定的数量）。16384 个哈希槽全部被分配到集群节点是集群正常运行的必要条件。
- `cluster_slots_ok`：哈希槽状态不是 FAIL 和 PFAIL 的数量。
- `cluster_slots_pfail`：哈希槽状态是 PFAIL 的数量。只要哈希槽状态没有被升级到 FAIL 状态，这些哈希槽仍然可以被正常处理。PFAIL 状态表示我们当前不能和节点进行交互，但这种状态只是临时的错误状态。
- `cluster_slots_fail`： 哈希槽状态是 FAIL 的数量。如果值不是 0，那么集群节点将无法提供查询服务，除非 cluster-require-full-coverage 被设置为 no。
- `cluster_known_nodes`：集群中节点数量，包括处于握手状态还没有成为集群正式成员的节点。
- `cluster_size`：至少包含一个哈希槽且能够提供服务的 master 节点数量。
- `cluster_current_epoch`：集群本地 Current Epoch 变量的值。这个值在节点故障转移过程时有用，它总是递增和唯一的。
- `cluster_my_epoch`：当前正在使用的节点的 Config Epoch 值。这个是关联在本节点的版本值。
- `cluster_stats_messages_sent`：通过 node-to-node 二进制总线发送的消息数量。
- `cluster_stats_messages_received`：通过 node-to-node 二进制总线接收的消息数量。

### IP 地址初始化集群

先尝试使用 `ip + port` 的方式初始化集群，但是在 `K8s` 中启动服务 `ip` 都会变化，所以最终的结果还是要用 `DNS` 方式进行集群初始化。

执行本步后再想修改为 DNS 地址初始化需要从来一遍，如果不想麻烦的同学可以直接跳过。

![](https://pek3b.qingstor.com/kubesphere-community/images/61d2674565534d3e8e908abb8c0775e7.png)
记录 `redis` 集群的所有 `ip+port`，初始化命令如下：

```powershell
redis-cli --cluster create 10.233.70.30:6379 10.233.70.32:6379 10.233.90.41:6379 10.233.90.43:6379 10.233.96.47:6379 10.233.96.50:6379 --cluster-replicas 1
```
进入 `redis` 集群随意一个节点的`终端`执行上面的命令。

![](https://pek3b.qingstor.com/kubesphere-community/images/e536bfa4cca24021b4b88e239bbd7a35.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/955b84b55cef48858c9b3727f4948b5d.png)

如上图集群初始化就完成了，再输入命令 `redis-cli` 进入命令端，再执行 `cluster info` 查看集群信息。

![](https://pek3b.qingstor.com/kubesphere-community/images/f78f637039214270a52c8b3f4e6f6e8a.png)

现在我们的集群节点有了 `6` 个，`master` 节点也有了三个，集群建立完成，后面的操作选择 `master` 节点进行操作。

![](https://pek3b.qingstor.com/kubesphere-community/images/b49992759d9a45ffb58ae8d8215551ee.png)

在对集群节点进行验证的时候如果遇到上图的错误 `(error) MOVED 2589 10.233.70.30:6379` 是因为 `redis-cli` 没有开启集群模式，将命令修改为 `redis-cli -c` 就切换为集群模式了。

### 使用内部 DNS 初始化

使用 `ip` 地址的方式在每次 `K8s` 调度 `redis` 后 `ip` 都会发生变化，所以在 `K8s` 集群中使用 `ip` 方式初始化集群并不太合适，但是如果使用内部 `DNS` 直接跟上面一样初始化集群会出现错误，因为 `redis` 对域名的支持并不太好，所以这时候可以用 `Redis-tribe`。

#### 创建 Redis-tribe 服务

创建自定义服务，选择`编辑 YAML`。

![](https://pek3b.qingstor.com/kubesphere-community/images/066b19aef09f42539124a7fcb1288070.png)

参数 `namespace` 就写项目名称：

![](https://pek3b.qingstor.com/kubesphere-community/images/2a5b3e9bd9ab43bc952415bd726dc8d0.png)

具体 `YAML` 内容如下：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: test-project
  labels:
    app: redis-cluster-tools
  name: redis-cluster-tools
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis-cluster-tools
  template:
    metadata:
      labels:
        app: redis-cluster-tools
      name: pos-redis
    spec:
     containers:
     - name: pos-redis
       image: sunnywang/redis-tools-ubuntu:v0.5.1
       imagePullPolicy: IfNotPresent
       args:
       - /bin/bash
       - -c
       - sleep 3600
```

创建好后在容器组内找到 `redis-cluster-tools`。

![](https://pek3b.qingstor.com/kubesphere-community/images/41ba190e767a45419e7b3b1512206245.png)

#### 初始化集群

点击容器名称进入容器详情再进入到终端里。

![](https://pek3b.qingstor.com/kubesphere-community/images/1b96c4dad53543228d929f7817eb3942.png)

先执行以下命令初始化 `master` 节点，这时候之前的内部 `DNS` 的域名就有用了。

```cpp
redis-trib.py create `dig +short redis-cluster-v1-0.redis-cluster.test-project.svc.cluster.local`:6379 `dig +short redis-cluster-v1-1.redis-cluster.test-project.svc.cluster.local`:6379 `dig +short redis-cluster-v1-2.redis-cluster.test-project.svc.cluster.local`:6379
```
执行结果如下图：

![](https://pek3b.qingstor.com/kubesphere-community/images/fde59f7849324163a4432901074127ed.png)

接下来给每个 `master` 节点绑定对应的副本节点，总共三个：

**0 节点->3 节点**

```cpp
redis-trib.py replicate --master-addr `dig +short redis-cluster-v1-0.redis-cluster.test-project.svc.cluster.local`:6379 --slave-addr `dig +short redis-cluster-v1-3.redis-cluster.test-project.svc.cluster.local`:6379
```

**1 节点->4 节点**

```cpp
redis-trib.py replicate  --master-addr `dig +short redis-cluster-v1-1.redis-cluster.test-project.svc.cluster.local`:6379 --slave-addr `dig +short redis-cluster-v1-4.redis-cluster.test-project.svc.cluster.local`:6379
```

**2 节点->5 节点**

```cpp
redis-trib.py replicate --master-addr `dig +short redis-cluster-v1-2.redis-cluster.test-project.svc.cluster.local`:6379 --slave-addr `dig +short redis-cluster-v1-5.redis-cluster.test-project.svc.cluster.local`:6379
```

执行结果如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/21f86ed6266141b490e07f80d8042bb3.png)

#### 验证

随便进入一个集群节点的终端，还是执行 `cluster info` 命令，查看集群信息。

![](https://pek3b.qingstor.com/kubesphere-community/images/6255f07aa1bc4c1eb8cfc6d569857c98.png)

使用基础命令进行验证，验证集群模式的 `redis-cli` 需要加`-c`。

![](https://pek3b.qingstor.com/kubesphere-community/images/f51175b2601043b1984f098fefee21d0.png)

验证集群模式可以正常使用。