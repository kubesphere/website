---
title: 'KubeSphere 部署向量数据库 Milvus 实战指南'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, Milvus'
description: '如何在 KubeSphere 管理的 Kubernetes 集群上，高效地部署和管理 Milvus 集群，让您的应用能够充分利用 Milvus 的强大功能。'
createTime: '2024-07-30'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/milvus-kubesphere-20240730-cover.png'
---

Milvus 是一个为通用人工智能（GenAI）应用而构建的开源向量数据库。它以卓越的性能和灵活性，提供了一个强大的平台，用于存储、搜索和管理大规模的向量数据。Milvus 能够执行高速搜索，并以最小的性能损失扩展到数百亿向量。其分布式架构确保了系统的高可用性和水平可扩展性，满足不断增长的数据需求。同时，Milvus 提供了丰富的 API 和集成选项，使其成为机器学习、计算机视觉和自然语言处理等 AI 应用的理想选择。

随着 AI 大模型的兴起，Milvus 成为了众多 AI 应用的首选向量数据库。本文将引导您探索，如何在 KubeSphere 管理的 Kubernetes 集群上，高效地部署和管理 Milvus 集群，让您的应用能够充分利用 Milvus 的强大功能。

**实战服务器配置(架构 1:1 复刻小规模生产环境，配置略有不同)**

|      主机名      |      IP       | CPU | 内存 | 系统盘 | 数据盘 |                    用途                    |
| :--------------: | :-----------: | :-: | :--: | :----: | :----: | :----------------------------------------: |
|   ksp-registry   | 192.168.9.90  |  4  |  8   |   40   |  200   |              Harbor 镜像仓库               |
|  ksp-control-1   | 192.168.9.91  |  4  |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|  ksp-control-2   | 192.168.9.92  |  4  |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|  ksp-control-3   | 192.168.9.93  |  4  |  8   |   40   |  100   |        KubeSphere/k8s-control-plane        |
|   ksp-worker-1   | 192.168.9.94  |  8  |  16  |   40   |  100   |               k8s-worker/CI                |
|   ksp-worker-2   | 192.168.9.95  |  8  |  16  |   40   |  100   |                 k8s-worker                 |
|   ksp-worker-3   | 192.168.9.96  |  8  |  16  |   40   |  100   |                 k8s-worker                 |
|  ksp-storage-1   | 192.168.9.97  |  4  |  8   |   40   |  400+  |      ElasticSearch/Longhorn/Ceph/NFS       |
|  ksp-storage-2   | 192.168.9.98  |  4  |  8   |   40   |  300+  |        ElasticSearch/Longhorn/Ceph         |
|  ksp-storage-3   | 192.168.9.99  |  4  |  8   |   40   |  300+  |        ElasticSearch/Longhorn/Ceph         |
| ksp-gpu-worker-1 | 192.168.9.101 |  4  |  16  |   40   |  100   |    k8s-worker(GPU NVIDIA Tesla M40 24G)    |
| ksp-gpu-worker-2 | 192.168.9.102 |  4  |  16  |   40   |  100   |   k8s-worker(GPU NVIDIA Tesla P100 16G)    |
|  ksp-gateway-1   | 192.168.9.103 |  2  |  4   |   40   |        |  自建应用服务代理网关/VIP：192.168.9.100   |
|  ksp-gateway-2   | 192.168.9.104 |  2  |  4   |   40   |        |  自建应用服务代理网关/VIP：192.168.9.100   |
|     ksp-mid      | 192.168.9.105 |  4  |  8   |   40   |  100   | 部署在 k8s 集群之外的服务节点（Gitlab 等） |
|       合计       |      15       | 68  | 152  |  600   | 2100+  |                                            |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3 x86_64**
- KubeSphere：**v3.4.1**
- Kubernetes：**v1.28.8**
- KubeKey: **v3.1.1**
- Milvus Helm Charts：**4.2.0**
- Milvus： **v.2.4.6**

## 1. Milvus 部署规划

**部署目标：官方架构图所示的 Milvus 集群（不包含 Load Balancer）。**

![milvus-architecture-overview](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-architecture-overview.png)

由于是初次安装部署，对 Milvus 的架构、组件关系仅有一个初步的了解，所以第一次部署只做如下考虑：

- 使用 Helm 的方式，大部分配置采用默认的 Values 部署
- 更改组件镜像地址为本地私有仓库
- 持久化存储使用自定义的 NFS 存储类 `nfs-sc`（生产不建议用，可能会造成磁盘 IO 不满足 etcd 的需求）
- coordinators 没有选择 **mixCoordinator**，而是使用多个独立的 **coordinators**，这种方案运维成本高，维护麻烦
- 消息队列使用官方默认推荐的 **pulsar**，不选择 **kafka**

后续会深入研究，更正式的部署考虑：

- 使用 Helm 和自定义 values 生成部署资源清单，修改清单，使用原生 kubectl 方式部署
- 使用 Ceph 或是其它高性能存储，不使用 NFS 存储
- 消息队列继续使用官方推荐的 **pulsar**
- 使用社区官方推荐的包含所有 coordinators 的 **mixCoordinator** ，降低运维成本
- 合理规划 Minio、Etcd、pulsar 等组件使用持久化存储时所分配的存储空间，默认配置不可能满足所有场景
- Milvus 日志存储到持久化存储，适配没有集中日志采集能力的 k8s 集群

**重要说明：** 本文的内容对于安装部署 Milvus 有一定的借鉴意义，但**切勿将本文的实战过程直接用于任何类型的正式环境**。

## 2. 前置条件

以下内容来自 [Milvus 官方环境需求文档](https://milvus.io/docs/v2.3.x/prerequisite-helm.md)，比较好理解，不做翻译了。

### 2.1 硬件需求

| Component           | Requirement                                   | Recommendation                                    | Note                                                                                                                                                                                                                                                                                                                                   |
| :------------------ | :-------------------------------------------- | :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU                 | Intel 2nd Gen Core CPU or higherApple Silicon | Standalone: 4 core or moreCluster: 8 core or more |                                                                                                                                                                                                                                                                                                                                        |
| CPU instruction set | SSE4.2AVXAVX2AVX-512                          | SSE4.2AVXAVX2AVX-512                              | Vector similarity search and index building within Milvus require CPU's support of single instruction, multiple data (SIMD) extension sets. Ensure that the CPU supports at least one of the SIMD extensions listed. See [CPUs with AVX](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX) for more information. |
| RAM                 | Standalone: 8GCluster: 32G                    | Standalone: 16GCluster: 128G                      | The size of RAM depends on the data volume.                                                                                                                                                                                                                                                                                            |
| Hard drive          | SATA 3.0 SSD or CloudStorage                  | NVMe SSD or higher                                | The size of hard drive depends on the data volume.                                                                                                                                                                                                                                                                                     |

### 2.2 软件需求

| Operating system | Software                                                                                                                        | Note                                                         |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------- |
| Linux platforms  | Kubernetes 1.16 or laterkubectlHelm 3.0.0 or laterminikube (for Milvus standalone)Docker 19.03 or later (for Milvus standalone) | See [Helm Docs](https://helm.sh/docs/) for more information. |

| Software | Version                      | Note                                                                                                                 |
| :------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| etcd     | 3.5.0                        | See [additional disk requirements](https://milvus.io/docs/v2.3.x/prerequisite-helm.md#Additional-disk-requirements). |
| MinIO    | RELEASE.2023-03-20T20-16-18Z |                                                                                                                      |
| Pulsar   | 2.8.2                        |                                                                                                                      |

### 2.3 磁盘需求

磁盘性能对 etcd 至关重要。官方强烈建议使用本地 NVMe SSD 磁盘。较慢的磁盘响应可能导致频繁的集群选举，最终降低 etcd 服务的性能，甚至是集群的崩溃。

这个需求比较重要，我刚接触 Milvus 时，由于时间比较仓促，在略知一二的情况下，使用默认配置部署了一套半生产的 Milvus 集群。

因为选择了 NFS 存储且没有测试磁盘 IO 性能，经常会出现 etcd 服务异常，响应慢，被 Kubernetes 的存活检测机制判断为不可用，导致频繁自动重建 etcd 集群。

因此，在 K8s 上创建 Milvus 集群时最好先测试一下集群持久化存储的性能。

Milvus 官方给出的测试磁盘性能的工具和命令如下：

```bash
mkdir test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=test-data --size=2200m --bs=2300 --name=mytest
```

测试结果，理想情况下，您的磁盘应该达到 **500 IOPS** 以上，99th percentile fsync latency 低于 10ms。请阅读 [etcd 官方文档](https://etcd.io/docs/v3.5/op-guide/hardware/#disks) 了解更详细的需求。

具体的磁盘性能测试过程，请参考下文。

### 2.4 Kubernetes 集群配置

k8s 集群一定要配置默认存储类，Milvus 的 Helm 控制 storageClass 的参数不够灵活，最好直接使用默认存储类，简化配置。

## 3. 持久化存储性能测试

实战环境使用了自建的 NFS 存储，部署 Milvus 之前，先测试存储性能：

官方建议的测试工具是 `fio` ，为了在 K8s 中模拟测试，我选择了 openEBS 官方提供的 `openebs/tests-fio:latest` 作为测试镜像，创建测试 Pod。

### 3.1 创建测试 pvc

编辑测试 PVC 资源清单，`vi test-nfs-fio-pvc.yaml`

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-nfs-fio-pvc
spec:
  storageClassName: nfs-sc
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
```

执行命令，创建 PVC。

```bash
kubectl apply -f test-nfs-fio-pvc.yaml
```

### 3.2 创建测试 Pod

编辑测试 Pod 资源清单，`vi test-nfs-fio-pod.yaml`

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: test-nfs-fio-pod
spec:
  containers:
  - name: test-nfs-fio-pod
    image: openebs/tests-fio:latest
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "touch /mnt/SUCCESS && sleep 86400"
    volumeMounts:
      - name: nfs-fio-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: nfs-fio-pvc
      persistentVolumeClaim:
        claimName: test-nfs-fio-pvc
```

执行命令，创建 Pod。

```bash
kubectl apply -f test-nfs-fio-pod.yaml
```

### 3.3 连接测试 Pod 终端

执行下面的命令，打开 fio 测试 Pod 终端。

```bash
kubectl exec -it test-nfs-fio-pod -- /bin/bash
```

查看已经挂载的 NFS 存储。

```bas
root@test-nfs-fio-pod:/# df -h
Filesystem                                                                                   Size  Used Avail Use% Mounted on
overlay                                                                                      100G  6.5G   94G   7% /
tmpfs                                                                                         64M     0   64M   0% /dev
tmpfs                                                                                        7.6G     0  7.6G   0% /sys/fs/cgroup
192.168.9.97:/datanfs/k8s/default-test-nfs-fio-pvc-pvc-7158aa17-f003-47a2-b6d6-07c69d014178  100G  746M  100G   1% /mnt
/dev/mapper/openeuler-root                                                                    35G  2.3G   31G   7% /etc/hosts
/dev/mapper/data-lvdata                                                                      100G  6.5G   94G   7% /etc/hostname
shm                                                                                           64M     0   64M   0% /dev/shm
tmpfs                                                                                         14G   12K   14G   1% /run/secrets/kubernetes.io/serviceaccount
tmpfs                                                                                        7.6G     0  7.6G   0% /proc/acpi
tmpfs                                                                                        7.6G     0  7.6G   0% /proc/scsi
tmpfs                                                                                        7.6G     0  7.6G   0% /sys/firmware
```

### 3.4 测试磁盘性能

执行下面的测试命令。

```bash
mkdir /mnt/test-data
fio --rw=write --ioengine=sync --fdatasync=1 --directory=/mnt/test-data --size=2200m --bs=2300 --name=nfstest
```

**测试结果：**

```bash
root@test-nfs-fio-pod:/# fio --rw=write --ioengine=sync --fdatasync=1 --directory=/mnt/test-data --size=2200m --bs=2300 --name=nfstest
nfstest: (g=0): rw=write, bs=2300-2300/2300-2300/2300-2300, ioengine=sync, iodepth=1
fio-2.2.10
Starting 1 process
nfstest: Laying out IO file(s) (1 file(s) / 2200MB)
Jobs: 1 (f=1): [W(1)] [100.0% done] [0KB/956KB/0KB /s] [0/426/0 iops] [eta 00m:00s]
nfstest: (groupid=0, jobs=1): err= 0: pid=26: Tue Jul 23 02:55:35 2024
  write: io=2199.2MB, bw=870003B/s, iops=378, runt=2651558msec
    clat (usec): min=4, max=87472, avg=224.30, stdev=309.99
     lat (usec): min=4, max=87473, avg=224.71, stdev=310.00
    clat percentiles (usec):
     |  1.00th=[    7],  5.00th=[    8], 10.00th=[    8], 20.00th=[    9],
     | 30.00th=[   10], 40.00th=[   12], 50.00th=[  302], 60.00th=[  338],
     | 70.00th=[  366], 80.00th=[  398], 90.00th=[  442], 95.00th=[  482],
     | 99.00th=[  588], 99.50th=[  700], 99.90th=[ 1848], 99.95th=[ 3120],
     | 99.99th=[ 7008]
    bw (KB  /s): min=    1, max= 1078, per=100.00%, avg=873.03, stdev=221.69
    lat (usec) : 10=25.84%, 20=16.33%, 50=1.64%, 100=0.03%, 250=0.23%
    lat (usec) : 500=52.30%, 750=3.19%, 1000=0.15%
    lat (msec) : 2=0.20%, 4=0.05%, 10=0.03%, 20=0.01%, 50=0.01%
    lat (msec) : 100=0.01%
  cpu          : usr=0.38%, sys=1.56%, ctx=1567342, majf=0, minf=12
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued    : total=r=0/w=1002985/d=0, short=r=0/w=0/d=0, drop=r=0/w=0/d=0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: io=2199.2MB, aggrb=849KB/s, minb=849KB/s, maxb=849KB/s, mint=2651558msec, maxt=2651558msec
```

**测试结果说明：** 测试结果明显不符合官方建议的最低值。由于，是个人测试环境也就无所谓了。**生产环境请严谨测试、评估**。

## 4. 使用 Helm 安装 Milvus 集群

Milvus 官方提供了 Operator、Helm 等多种方式的集群安装文档。本文实战演示了 Helm 的安装方式。其他方式请参考 [Milvus 官方文档](https://milvus.io/docs/v2.3.x/install_cluster-milvusoperator.md)。

### 4.1 安装 Milvus Helm Chart

添加 Milvus Helm repository。

```bash
helm repo add milvus https://zilliztech.github.io/milvus-helm/
```

更新本地 charts。

```bash
helm repo update milvus
```

### 4.2 安装 Milvus

官方默认安装命令（**仅供参考，本文未用**）。

```bash
helm install my-release milvus/milvus
```

按规划设置自定义配置项，执行下面的安装命令：

```bash
helm install --namespace opsxlab --create-namespace opsxlab milvus/milvus \
    --set image.all.repository="milvusdb/milvus" \
    --set image.tools.repository="milvusdb/milvus-config-tool" \
    --set etcd.image.registry="docker.io" \
    --set etcd.image.repository="milvusdb/etcd" \
    --set pulsar.images.broker.repository="milvusdb/pulsar" \
    --set pulsar.images.autorecovery.repository="milvusdb/pulsar" \
    --set pulsar.images.zookeeper.repository="milvusdb/pulsar" \
    --set pulsar.images.bookie.repository="milvusdb/pulsar" \
    --set pulsar.images.proxy.repository="milvusdb/pulsar" \
    --set pulsar.images.pulsar_manager.repository="milvusdb/pulsar-manager" \
    --set pulsar.pulsar_metadata.image.repository="milvusdb/pulsar" \
    --set minio.image.repository="milvusdb/minio" \
    --set etcd.persistence.storageClass="nfs-sc" \
    --set minio.persistence.storageClass="nfs-sc" \
    --set pulsar.zookeeper.volumes.data.storageClassName="nfs-sc" \
    --set pulsar.bookkeeper.volumes.journal.storageClassName="nfs-sc"
```

自定义配置说明：

- 指定并自动创建命名空间 **opsxlab**
- 设置组件的镜像地址，本文为了演示修改方法，保留了默认值，**实际使用中可以修改为自己的镜像仓库地址**
- etcd 的镜像地址比较特殊，有两个配置项，请注意
- 设置持久化存储类为 `nfs-sc`，适用于 k8s 有多种存储类，需要部署到指定存储类的场景
- 所有配置仅供参考，请参考官方文档查看更详细的配置

**附录：** 默认安装的组件镜像地址及版本：

| 序号 |      组件名称      |       默认 repository       |           组件版本           |
| :--: | :----------------: | :-------------------------: | :--------------------------: |
|  1   |       milvus       |       milvusdb/milvus       |            v2.4.6            |
|  2   | milvus-config-tool | milvusdb/milvus-config-tool |            v0.1.2            |
|  3   |        etcd        |        milvusdb/etcd        |           3.5.5-r4           |
|  4   |       pulsar       |     apachepulsar/pulsar     |            2.9.5             |
|  5   |   pulsar-manager   | apachepulsar/pulsar-manager |            v0.1.0            |
|  6   |       minio        |         minio/minio         | RELEASE.2023-03-20T20-16-18Z |

### 4.3 查看安装结果

Helm 安装命令成功执行后，观察 Pod 运行状态。

```bash
kubectl get pods -n opsxlab
```

**安装成功后，输出结果如下：**

```bash
$ kubectl get pods -n opsxlab
NAME                                         READY   STATUS      RESTARTS        AGE
opsxlab-etcd-0                               1/1     Running     0               8m9s
opsxlab-etcd-1                               1/1     Running     0               8m20s
opsxlab-etcd-2                               1/1     Running     0               11m
opsxlab-milvus-datacoord-6cd875684d-fbkgx    1/1     Running     6 (9m19s ago)   13m
opsxlab-milvus-datanode-5c5558cbc7-r24vj     1/1     Running     6 (9m40s ago)   13m
opsxlab-milvus-indexcoord-f48d66647-52crb    1/1     Running     0               13m
opsxlab-milvus-indexnode-c6979d59b-rvm5p     1/1     Running     6 (9m44s ago)   13m
opsxlab-milvus-proxy-79997676f9-hftdf        1/1     Running     6 (9m22s ago)   13m
opsxlab-milvus-querycoord-5d94f97dc4-tv52n   1/1     Running     6 (9m43s ago)   13m
opsxlab-milvus-querynode-59b9bd7c8b-7qljj    1/1     Running     6 (9m26s ago)   13m
opsxlab-milvus-rootcoord-745b9fbb68-mr7st    1/1     Running     6 (9m36s ago)   13m
opsxlab-minio-0                              1/1     Running     0               13m
opsxlab-minio-1                              1/1     Running     0               13m
opsxlab-minio-2                              1/1     Running     0               13m
opsxlab-minio-3                              1/1     Running     0               13m
opsxlab-pulsar-bookie-0                      1/1     Running     0               13m
opsxlab-pulsar-bookie-1                      1/1     Running     0               13m
opsxlab-pulsar-bookie-2                      1/1     Running     0               13m
opsxlab-pulsar-bookie-init-7l4kh             0/1     Completed   0               13m
opsxlab-pulsar-broker-0                      1/1     Running     0               13m
opsxlab-pulsar-proxy-0                       1/1     Running     0               13m
opsxlab-pulsar-pulsar-init-ntbh8             0/1     Completed   0               13m
opsxlab-pulsar-recovery-0                    1/1     Running     0               13m
opsxlab-pulsar-zookeeper-0                   1/1     Running     0               13m
opsxlab-pulsar-zookeeper-1                   1/1     Running     0               13m
opsxlab-pulsar-zookeeper-2                   1/1     Running     0               12m
```

KubeSphere 管理控制台查看部署的组件信息。

- Depolyment（**8 个**）

![milvus-deployments-v2.4.6](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-deployments-v2.4.6.png)

- StatefulSet（**7 个**）

![milvus-statefulsets-v2.4.6](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-statefulsets-v2.4.6.png)

- Services（**17 个**）

![milvus-services-v2.4.6](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-services-v2.4.6.png)

从上面的 Deployment、StatefulSet、Services 资源数量来看，默认部署的 Milvus 组件还是比较多的，后期运维成本比较高。

### 4.4 配置认证并开启外部访问

默认配置部署的 Milvus，没有启用安全认证，**任何人都可以随意读写**。这不符合生产环境要求，因此，需要增加认证配置。

创建并编辑 Helm 自定义 values 配置文件，`vi custom-milvus.yaml`。

```yaml
extraConfigFiles:
  user.yaml: |+
    common:
      security:
        authorizationEnabled: true
```

执行 helm 命令更新配置。

```bash
helm upgrade opsxlab milvus/milvus --values custom-milvus.yaml -n opsxlab
```

> **注意：** 如果安装时自定义了镜像地址，上面的操作会导致所有组件的镜像地址被**还原成 helm 默认值**，请谨慎使用。

默认配置部署的 Milvus 只能被 K8s 集群内部资源访问，如果开放给集群外部，需要定义外部访问方式，本文选择最简单的 NodePort 方式。

创建并编辑外部访问 svc 资源清单，`vi milvus-external-svc.yaml`。

```yaml
kind: Service
apiVersion: v1
metadata:
  name: opsxlab-milvus-external
  namespace: opsxlab
  labels:
    app: opsxlab-milvus-external
    app.kubernetes.io/name: milvus
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31011
  selector:
    app.kubernetes.io/instance: opsxlab
    app.kubernetes.io/name: milvus
    component: proxy
  clusterIP:
  type: NodePort
```

执行命令，创建外部服务。

```bash
kubectl apply -f milvus-external-svc.yaml
```

### 4.5 验证测试 Milvus 服务可用性

Milvus 官方默认提供了 `hello_milvus.py` 工具，用来测试数据库的连接和读写。

工具获取方式：

```bash
wget https://raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py
```

该脚本运行需要 Python 环境，为了测试方便，我自己制作了一个 Docker 镜像，可用于在 Docker、k8s 环境中进行测试。

创建并编辑 milvus 测试 Pod 资源清单，`vi test-milvus-pod.yaml`。

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: test-milvus-pod
spec:
  containers:
  - name: test-milvus-pod
    image: opsxlab/milvus-hello:v2.3.7-amd64
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "sleep 86400"
  restartPolicy: "Never"
```

执行命令，创建测试 Pod。

```bash
kubectl apply -f test-milvus-pod.yam
```

登录测试容器终端（等待一段时间，确认 Pod 创建成功后执行）。

```bash
kubectl exec -it test-milvus-pod -- /bin/bash
```

官方`hello_milvus.py` 脚本，默认连接**不带密码认证**的 Milvus 集群。我们的集群增加了认证，需要修改脚本，添加认证配置，默认的用户名和密码为 `root/Milvus` 。

```python
# 原内容（32行）
 connections.connect("default", host="localhost", port="19530")

# 修改为
connections.connect("default", host="192.168.9.91", port="31011", user="root", password='Milvus')
```

执行测试命令。

```bash
python hello_milvus.py
```

**正确执行后，输出结果如下 :**

```bash
root@test-milvus-pod:/app# python hello_milvus.py

=== start connecting to Milvus     ===

Does collection hello_milvus exist in Milvus: False

=== Create collection `hello_milvus` ===


=== Start inserting entities       ===

Number of entities in Milvus: 3001

=== Start Creating index IVF_FLAT  ===


=== Start loading                  ===


=== Start searching based on vector similarity ===

hit: id: 2998, distance: 0.0, entity: {'random': 0.9728033590489911}, random field: 0.9728033590489911
hit: id: 999, distance: 0.09934990108013153, entity: {'random': 0.9519034206569449}, random field: 0.9519034206569449
hit: id: 1310, distance: 0.10135537385940552, entity: {'random': 0.26669865443188623}, random field: 0.26669865443188623
hit: id: 2999, distance: 0.0, entity: {'random': 0.02316334456872482}, random field: 0.02316334456872482
hit: id: 2502, distance: 0.13083189725875854, entity: {'random': 0.9289998713260136}, random field: 0.9289998713260136
hit: id: 2669, distance: 0.1590736210346222, entity: {'random': 0.6080847854541138}, random field: 0.6080847854541138
search latency = 0.2742s

=== Start querying with `random > 0.5` ===

query result:
-{'random': 0.6378742006852851, 'embeddings': [np.float32(0.8367804), np.float32(0.20963514), np.float32(0.6766955), np.float32(0.39746654), np.float32(0.8180806), np.float32(0.1201905), np.float32(0.9467144), np.float32(0.6947491)], 'pk': '0'}
search latency = 0.2361s
query pagination(limit=4):
        [{'random': 0.6378742006852851, 'pk': '0'}, {'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]
query pagination(offset=1, limit=3):
        [{'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]

=== Start hybrid searching with `random > 0.5` ===

hit: id: 2998, distance: 0.0, entity: {'random': 0.9728033590489911}, random field: 0.9728033590489911
hit: id: 999, distance: 0.09934990108013153, entity: {'random': 0.9519034206569449}, random field: 0.9519034206569449
hit: id: 1553, distance: 0.12913644313812256, entity: {'random': 0.7723335927084438}, random field: 0.7723335927084438
hit: id: 2502, distance: 0.13083189725875854, entity: {'random': 0.9289998713260136}, random field: 0.9289998713260136
hit: id: 2669, distance: 0.1590736210346222, entity: {'random': 0.6080847854541138}, random field: 0.6080847854541138
hit: id: 2628, distance: 0.1914074569940567, entity: {'random': 0.940077754658375}, random field: 0.940077754658375
search latency = 0.2026s

=== Start deleting with expr `pk in ["0" , "1"]` ===

query before delete by expr=`pk in ["0" , "1"]` -> result:
-{'embeddings': [np.float32(0.8367804), np.float32(0.20963514), np.float32(0.6766955), np.float32(0.39746654), np.float32(0.8180806), np.float32(0.1201905), np.float32(0.9467144), np.float32(0.6947491)], 'pk': '0', 'random': 0.6378742006852851}
-{'embeddings': [np.float32(0.27875876), np.float32(0.95355743), np.float32(0.976228), np.float32(0.54545516), np.float32(0.16776836), np.float32(0.82360446), np.float32(0.65080017), np.float32(0.21096307)], 'pk': '1', 'random': 0.43925103574669633}

query after delete by expr=`pk in ["0" , "1"]` -> result: []

=== Drop collection `hello_milvus` ===
```

## 5. 部署可视化管理工具 Attu

Milvus 的可视化（GUI）管理工具官方推荐 Attu。它是一款 all-in-one 的 Milvus 管理工具。使用 Attu，可以显著的降低 Milvus 运维管理成本。

### 5.1 安装 Attu

Milvus Helm Chart 自带 Attu 的部署能力，默认是禁用的。我本人比较喜欢手工安装，所以下面介绍 kubectl 原生安装 Attu 的方法。

创建并编辑 Attu 部署资源清单， `vi milvus-attu.yaml`。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: milvus-attu-external
  namespace: opsxlab
  labels:
    app: attu
spec:
  type: NodePort
  clusterIP:
  ports:
  - name: attu
    protocol: TCP
    port: 3000
    targetPort: 3000
    nodePort: 31012
  selector:
    app: attu

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: milvus-attu
  namespace: opsxlab
  labels:
    app: attu
spec:
  replicas: 1
  selector:
    matchLabels:
      app: attu
  template:
    metadata:
      labels:
        app: attu
    spec:
      containers:
      - name: attu
        image: zilliz/attu:v2.4
        imagePullPolicy: IfNotPresent
        ports:
        - name: attu
          containerPort: 3000
          protocol: TCP
        env:
        - name: MILVUS_URL
          value: "opsxlab-milvus:19530"
```

执行命令，创建 Attu 资源。

```bash
kubectl apply -f milvus-attu.yaml
```

### 5.2 登录 Attu 管理控制台

打开浏览器，访问 K8s 集群任意节点 IP 的 **31012** 端口，例如 http://192.168.9.91:31012，默认用户名密码 `root/Milvus`。**登录后请立即修改密码**。

下面以一组 Attu 管理界面的预览截图，结束本文。请各位自己探究 Attu 的强大功能。

- 登录页面

![milvus-attu-login-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-login-v2.4.png)

- 首页

![milvus-attu-home-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-home-v2.4.png)

- 系统视图

![milvus-attu-system-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-system-v2.4.png)

- 数据库-概览

![milvus-attu-databases-default-overview-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-databases-default-overview-v2.4.png)

- 数据库-向量搜索

![milvus-attu-databases-default-search-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-databases-default-search-v2.4.png)

- 数据库-数据

![milvus-attu-databases-default-data-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-databases-default-data-v2.4.png)

- 数据库-分区

![milvus-attu-databases-default-partitions-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-databases-default-partitions-v2.4.png)

- 数据库-数据段

![milvus-attu-databases-default-segments-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-databases-default-segments-v2.4.png)

- 数据库-属性

![milvus-attu-databases-default-properties-v2.4](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//milvus-attu-databases-default-properties-v2.4.png)

**免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！
