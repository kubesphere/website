---
title: '揭秘！KubeSphere 背后的“超级大脑”：etcd 的魅力与力量'
tag: 'KubeSphere, etcd'
keywords: 'KubeSphere,  Kubernetes, etcd'
description: '我们将深入探索 etcd 如何巧妙地融入 KubeSphere 生态系统，并通过实际应用场景展示其对提升平台工作效率和可靠性的关键作用。'
createTime: '2024-02-23'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-etcd-cover-20230223.png'
---

> 作者：尹珉，KubeSphere Ambassador & Contributor，KubeSphere 社区用户委员会杭州站站长。

## 1. 开篇：揭开神秘面纱，etcd 如何驱动 KubeSphere 高效运转

在云原生时代，etcd 作为 Kubernetes 生态中不可或缺的核心组件，扮演着 KubeSphere 集群“神经系统”的角色。它利用 Raft 一致性算法提供强大的分布式键值存储能力，确保集群状态信息的实时同步和持久化。

每当在 KubeSphere 中执行资源操作时，这些指令首先通过 etcd 进行处理和分发，从而实现对整个集群状态的瞬时更新与管理。正是由于 etcd 的存在，KubeSphere 才得以在大规模容器编排中展现卓越的性能和稳定性。

接下来，我们将深入探索 etcd 如何巧妙地融入 KubeSphere 生态系统，并通过实际应用场景展示其对提升平台工作效率和可靠性的关键作用。

## 2. 时光机：从诞生到崛起，etcd 如何在云原生时代崭露头角

etcd 的旅程始于 2013 年 CoreOS 团队的一项创新尝试，随着其 V1 和 V2 版本的发展，逐渐奠定了在分布式系统数据一致性解决方案中的地位。从 etcd V1、V2 到 V3 版本的迭代过程中，性能不断提升，稳定性日益增强，功能上也不断丰富和完善。

经历数次重要升级后，etcd V3 版本尤其显著地解决了 Kubernetes 发展过程中面临的存储瓶颈问题。在性能方面，通过优化实现了更快的数据读写速度；在稳定性上，引入了更为健壮的一致性保证机制；在功能上，则扩展了 API 接口，增强了安全性与可管理性。

因此，etcd 凭借这些改进，在性能、稳定性和功能上的卓越表现成功捍卫了作为 Kubernetes 核心存储组件的地位，并在云原生时代中扮演着不可或缺的角色，持续推动整个生态系统的进步与发展。

## 3. 深度剖析：etcd 核心原理与架构设计，它是如何做到数据存储的万无一失

### 3.1 基础架构图

etcd 是典型的读多写少存储，实际业务场景中，读一般占据 2/3 以上的请求。为了让大家对 etcd 每个模块有一定的初步了解，简单介绍一下每个模块的功能作用。

![](https://pek3b.qingstor.com/kubesphere-community/images/768d18b78a2371bb1e2515c4eb0714bd.png)

- Client 层：etcd 提供了 v2 和 v3 两个版本的 API 客户端库，通过负载均衡、节点故障自动转移等机制简化了业务集成过程，有效提升了开发效率与服务稳定性。

- API 网络层：该层处理客户端与服务器以及服务器间的通信。v2 API 基于 HTTP/1.x 协议，而 v3 API 则使用 gRPC 协议，并通过 grpc-gateway 支持 HTTP/1.x 调用以满足多语言需求。此外，Raft 一致性算法驱动下的服务器间通信也采用 HTTP 协议来实现数据复制和 Leader 选举等功能。

- Raft 算法层：这一关键层实现了诸如 Leader 选举、日志复制及 ReadIndex 等核心特性，确保了 etcd 集群中多个节点间的数据一致性和高可用性。

- 功能逻辑层：在此层面上，etcd 的核心模块包括 KV 存储、多版本并发控制（MVCC）、权限验证（Auth）、租约管理（Lease）以及数据压缩（Compactor）等组件，其中 MVCC 模块由 treeIndex 和 boltdb 组成，用于高效且安全地处理键值操作。

- 存储层：为保证数据安全性与持久化，存储层包含预写日志（WAL）和快照（Snapshot）机制，以及用于存储元数据和用户数据的 boltdb 数据库。WAL 防止 etcd 在崩溃后丢失数据，而 boltdb 则负责实际的数据存储与检索。

### 3.2 etcd 实现高可用、数据一致性的秘诀

秘诀就是 Raft 算法，旨在简化分布式系统中的共识问题理解与实现。它将复杂的共识过程分解为三个关键环节：

- Leader 选举：确保在 Leader 节点失效时能快速重新选举出新的 Leader。

- 日志复制：通过仅允许 Leader 节点写入日志，并负责向 Follower 节点复制日志记录，以保证集群内部数据一致性。

- 安全性：在安全性方面，Raft 算法设计了严格的规则，例如一个任期内仅产生一个有效的 Leader、先前已提交的日志条目在新 Leader 上必定存在，且所有节点的状态机应用的相同位置应具有相同的日志内容。这一系列机制共同保障了分布式系统的稳定性和一致性。

### 3.3 探秘 etcd 读请求：一次闪电般的数据检索之旅

在分布式系统背景下，看似简单的数据读取操作实则蕴含复杂机制。对于 etcd 这类追求高可用与强一致性的键值存储系统，每一次读请求均是对底层技术细节和算法智慧的深度实践。面对大规模集群环境，当客户端发送读取指令时，etcd 如何确保快速准确地响应呢？接下来，我们一起揭示 etcd 读请求背后的核心技术流程。

- 客户端发起请求：应用通过 etcd 的 v2 或 v3 版本 API 客户端库发送读取键值对的请求，支持 HTTP/1.x 和 gRPC 协议。

- Raft 算法交互：对于读操作，etcd 采用 ReadIndex 机制。客户端将读请求发送至当前 Leader 节点，Leader 节点先记录下这次读请求，然后在提交一个新的日志条目后，再响应客户端的读请求，确保在此期间没有新的写入导致集群状态改变。

- 一致性保证：Leader 节点根据 Raft 算法确保所有已提交的日志条目已被集群内所有 Follower 节点复制，并达到一致状态。

- KV 存储查询：Leader 节点从内部 MVCC（多版本并发控制）模块中的 boltdb 数据库中检索对应键的最新有效版本数据。

- 返回结果：一旦获取到数据，Leader 节点将结果返回给客户端，完成读取操作。

在深入探讨 etcd 的读流程时，我们触及到了其核心机制——线性读与串行读。这两种读模式分别应对不同的一致性需求场景。接下来，我们只对它们的含义做一个简单的解释：

- 串行读（Serializable Read）适用于对数据实时性要求不严苛的情况，直接从节点状态机中获取数据，实现低延迟、高吞吐，但可能存在一定的数据一致性风险。

- 线性读（Linearizable Read）则是为了满足关键业务操作对强一致性的需求，确保任何更新后的值都能被后续请求及时准确地访问到，即使集群中有多个节点，客户端通过线性读也能如同访问单一节点般获得最新且已达成共识的数据。尽管相比串行读可能带来更高的延时和较低的吞吐，但在要求严格数据一致性的场景下，线性读是 etcd 默认且理想的读取方式。

## 4. 实战演练：构建 KubeSphere 环境下的 etcd 服务

### 4.1 什么是 KubeSphere？

KubeSphere 是在 Kubernetes 之上构建的面向云原生应用的分布式操作系统，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维能力，简化企业的 DevOps 工作流。它的架构可以非常方便地使第三方应用与云原生生态组件进行即插即用 (plug-and-play) 的集成。

### 4.2 架构说明

KubeSphere 将前端与后端分开，实现了面向云原生的设计，后端的各个功能组件可通过 REST API 对接外部系统。可参考 API 文档。下图是系统架构图。KubeSphere 无底层的基础设施依赖，可以运行在任何 Kubernetes、私有云、公有云、VM 或物理环境（BM）之上。此外，它可以部署在任何 Kubernetes 发行版上。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190810073322.png)

### 4.3 为什么选择 KubeKey

KubeKey 由 Go 语言开发，使用便捷、轻量，支持多种主流 Linux 发行版。KubeKey 支持多种集群部署模式，例如 All-in-One、多节点、高可用以及离线集群部署。KubeKey 也支持快速构建离线安装包，加速离线交付场景下的集群交付效率。KubeKey 实现多节点并行安装，且利用 Kubeadm 对集群和节点进行初始化，极大地节省了集群部署时间，同时也遵循了 Kubernetes 社区主流集群部署方法。KubeKey 提供内置高可用模式，支持一键部署高可用 Kubernetes 集群。

### 4.4 环境准备

为了演示效果使用 all-in-one 快速部署。

#### 4.4.1 获取 KubeKey

```yaml
export KKZONE=cn
```

```yaml
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.13 sh -
```

```yaml
chmod +x kk
```

#### 4.4.2 安装 Kubernetes+KubeSphere

```yaml
./kk create cluster --with-kubernetes v1.22.12 --with-kubesphere v3.4.1
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-etcd-20240222-3.png)

#### 4.4.3 检查集群状态

![](https://pek3b.qingstor.com/kubesphere-community/images/image-etcd-20240222-4.png)

#### 4.4.4 安装 etcdctl 工具（可选）

使用 KubeKey 部署集群会默认安装 etcdctl。

```yaml
https://github.com/etcd-io/etcd/releases  #自行下载
```

```yaml
tar -zxvf etcd-v3.5.11-linux-amd64.tar.gz
```

```yaml
cp etcdctl /usr/local/bin/
```

#### 4.4.5 获取证书并查看 etcd 状态

说明：KubeKey 安装集群时默认 etcd 使用二进制安装，证书路径默认在此处。

```yaml
/etc/ssl/etcd/ssl
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-etcd-20240222-5.png)

通过采用 KubeKey 工具实施最小化部署案例，展示了如何运用安全证书机制来实现对 etcd 的访问以监控集 etcd 服务状态。尽管此处演示以单一实例呈现，但在实际生产环境中，etcd 服务必然是基于高可用集群模式运行，始终坚守着高可靠性的核心原则。

### 4.6 etcd 部署建议

#### 4.6.1 系统要求

为保证 etcd 性能，推荐使用 SSD 硬盘，并通过工具（如 fio）进行磁盘速度评估。建议系统配置至少与默认存储配额（2GB）相等的 RAM，一般推荐 8GB 以上以避免性能下降。典型部署中，etcd 集群应在具有双核 CPU、2GB 内存和 80GB SSD 的专用服务器上运行。请根据实际工作负载对硬件配置进行调整并预先测试，确保生产环境性能达标。

#### 4.6.2 集群成员数量尽量为奇数

etcd 集群达成状态更新共识需要多数节点参与，即至少（n/2）+1 个成员在具有 n 个节点的集群中。对于奇数节点数量的集群，增加一个节点虽表面上增强了系统规模，但实际上降低了容错性：相同数量节点故障时仍能保持仲裁，但更多节点故障可能导致仲裁丢失。因此，在集群无法容忍额外故障且新节点可能注册失败的情况下，贸然添加节点是危险的，因为这可能导致永久性的仲裁损失。

#### 4.6.3 最大集群大小不超过 7 个

理论上，etcd 集群规模无明确上限，但实践中推荐不超过 7 个节点。参照 Google 内部广泛部署的 Chubby 锁服务经验，建议维持 5 节点配置。这样的集群能容忍两个成员故障，通常已满足需求。尽管更大集群提升容错性，但会因数据在更多节点上的复制而导致写入性能下降。

## 5. etcd 集群运维那些事儿

### 5.1 监控及告警

在构建和运维 etcd 集群时，监控是确保业务稳定性和提前识别风险的关键步骤。

etcd 提供了众多 metrics，按模块划分包括磁盘、网络、MVCC 事务、gRPC RPC 和 etcdserver 等核心指标，用于展示集群健康状况。为了有效监控这些指标，推荐使用 Prometheus 服务采集 etcd 2379 端口的 metrics 数据，并可通过静态或动态配置实现。

#### 5.1.1 静态配置

静态配置需手动在 Prometheus 配置文件中的 scrape_configs 下添加新 job，内容包含被监控的 etcd 集群地址，如开启了认证还需配置证书等。

示例：

```yaml
scrape_configs:
  - job_name: 'etcd'
    static_configs:
      - targets: ['<etcd-node-1>:2379', '<etcd-node-2>:2379', '<etcd-node-3>:2379']
    metrics_path: '/metrics'
    scheme: 'https'
    tls_config:
      ca_file: /path/to/prometheus-server/ca.pem  # 在Prometheus服务器上的CA证书路径
      cert_file: /path/to/prometheus-server/client.pem  # 客户端证书路径
      key_file: /path/to/prometheus-server/client-key.pem  # 客户端密钥路径
```

#### 5.1.2 动态配置

动态配置借助 Prometheus-Operator 的 ServiceMonitor 机制，可自动发现并采集 Kubernetes 集群中的 etcd 服务 metrics。通过创建 ServiceMonitor 资源，Prometheus 可根据 Namespace 和 Labels 自动关联待监控的服务 Endpoint。

示例：

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: etcd-service-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: etcd # 根据服务标签选择匹配的服务
  endpoints:
  - port: http-metrics
    scheme: https
    tlsConfig:
      caFile: /etc/prometheus/secrets/etcd-certs/ca.crt
      certFile: /etc/prometheus/secrets/etcd-certs/client.crt
      keyFile: /etc/prometheus/secrets/etcd-certs/client.key
      insecureSkipVerify: true
  namespaceSelector:
    matchNames:
    - kube-system # 指定监控哪个命名空间下的服务
```

![](https://pek3b.qingstor.com/kubesphere-community/images/image-etcd-20240222-6.png)

获取监控数据后，利用 Prometheus 与 Alertmanager 组件设置告警规则至关重要，重点关注影响集群可用性的核心 metric，例如 Leader 状态、切换次数及 WAL 和事务操作延时等。社区提供了一些参考告警规则。

最后，为了提升运维效率和问题定位能力，可以基于收集到的 metrics，在 Grafana 中创建可视化面板，展示集群 Leader 状态、key 总数、watcher 数、出流量以及 WAL 持久化延时等关键运行状态指标。

![](https://pek3b.qingstor.com/kubesphere-community/images/image-etcd-20240222-7.png)

### 5.2 数据及还原

在完成监控与告警设置后，确保 etcd 集群在生产环境安全使用还需进行数据备份。针对数据备份，有以下几种方法：

#### 5.2.1 手动备份恢复

通过指定端口、证书进行手动备份。

```yaml
etcdCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```

使用备份的数据进行恢复。

```yaml
etcdCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  restore save <backup-file-location>
```

#### 5.2.2 定时自动备份

建议每小时至少备份一次，可通过定时任务实现。

#### 5.2.3 自动化备份

利用 etcd-backup-operator 工具，通过创建备份任务 CRD 实现自动化备份管理，例如配置备份频率、最大保留备份数量以及 S3 存储等参数。

示例：

```yaml
apiVersion: "etcd.database.coreos.com/v1beta2"
kind: etcdBackup
metadata:
  name: example-etcd-cluster-backup
spec:
  etcdEndpoints: ["http://etcd-cluster-endpoint:2379"] # 替换为你的etcd集群实际端点
  storageType: S3
  backupPolicy:
    backupIntervalInSecond: 3600 # 每小时执行一次备份（这里仅为示例，可自定义间隔时间）
    maxBackups: 5 # 最多保留5个备份文件
  s3:
    path: "my-s3-bucket/etcd/backups" # 替换为S3存储桶路径
    awsSecret: qy-credentials # 替换为引用qy凭据 secret 的名称
```

最后，为了实现跨地域热备，可在 etcd 集群中添加 Learner 节点。Learner 节点作为非投票成员，不影响集群性能，其原理是跟随 Leader 节点同步日志信息。不过请注意，在 etcd 3.4 版本中，仅支持一个 Learner 节点且串行读取。

## 6. 未来可期：展望 etcd 在 Kubernetes 生态系统中持续创新的可能性与挑战

在 Kubernetes 生态系统中，etcd 作为核心组件起着不可或缺的作用。随着云原生技术的持续演进，etcd 在 Kubernetes 体系中的创新空间及潜在挑战值得关注。面对未来，etcd 同样需要应对诸多挑战，包括如何高效处理海量数据增长、如何更好地兼容异构基础设施接入，以及如何有效抵御不断演变的安全风险。但相信在广大开发者的共同努力下，etcd 将持续突破，在 Kubernetes 生态系统内推动技术创新，稳固其基石地位。