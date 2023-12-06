---
title: 'KubeKey 升级 KubeSphere 和 Kubernetes 补丁版本实战指南'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, KubeKey '
description: '本文通过实战演示了 KubeKey 部署的 KubeSphere 和 Kubernetes 升级补丁版本的详细过程，以及可能遇到的问题和对应的解决方案。'
createTime: '2023-12-05'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-upgrades-kubesphere-and-k8s-patch-versions-cover.png'
---

## 前言

### 知识点

- 定级：**入门级**
- KubeKey 如何升级 KubeSphere 补丁版本
- KubeKey 如何升级 Kubernetes 补丁版本
- KubeSphere 和 Kubernetes 升级准备及验证
- KubeKey 升级 KubeSphere 和 Kubernetes 的常见问题

### 实战服务器配置 (架构 1:1 复刻小规模生产环境，配置略有不同)

|    主机名     |      IP      | CPU  | 内存 | 系统盘 |       数据盘        |                      用途                       |
| :-----------: | :----------: | :--: | :--: | :----: | :-----------------: | :---------------------------------------------: |
| k8s-master-1  | 192.168.9.91 |  4   |  16  |   40   |         100         |              KubeSphere/k8s-master              |
| k8s-master-2  | 192.168.9.92 |  4   |  16  |   40   |         100         |              KubeSphere/k8s-master              |
| k8s-master-3  | 192.168.9.93 |  4   |  16  |   40   |         100         |              KubeSphere/k8s-master              |
| k8s-worker-1  | 192.168.9.95 |  8   |  16  |   40   |         100         |                  k8s-worker/CI                  |
| k8s-worker-2  | 192.168.9.96 |  8   |  16  |   40   |         100         |                   k8s-worker                    |
| k8s-worker-3  | 192.168.9.97 |  8   |  16  |   40   |         100         |                   k8s-worker                    |
| k8s-storage-1 | 192.168.9.81 |  4   |  16  |   40   | 100/100/100/100/100 | ElasticSearch/GlusterFS/Ceph-Rook/Longhorn/NFS/ |
| k8s-storage-2 | 192.168.9.82 |  4   |  16  |   40   |   100/100/100/100   |   ElasticSearch/GlusterFS/Ceph-Rook/Longhorn/   |
| k8s-storage-3 | 192.168.9.83 |  4   |  16  |   40   |   100/100/100/100   |   ElasticSearch/GlusterFS/Ceph-Rook/Longhorn/   |
|   registry    | 192.168.9.80 |  4   |  8   |   40   |         100         |                Sonatype Nexus 3                 |
|     合计      |      10      |  52  | 152  |  400   |        2000         |                                                 |

### 实战环境涉及软件版本信息

- 操作系统：**CentOS 7.9 x86_64**
- KubeSphere：**v3.4.0** to **v3.4.1**
- Kubernetes：**v1.24.12** to **v1.24.14**
- Containerd：**1.6.4**
- KubeKey:  **v3.0.13**

## 1. 简介

### 1.1 Kubernetes 版本升级概述

KubeSphere v3.4.1 已于 2023 年 11 月 10 日正式发布，升级说明详见 [Releases-v3.4.1 发布说明](https://github.com/kubesphere/kubesphere/releases/tag/v3.4.1)。该发布版修复了 v3.4.0 中存在的许多问题，建议所有人更新。

[KubeSphere 官方的升级文档](https://www.kubesphere.io/zh/docs/v3.4/upgrade/upgrade-with-kubekey/) 操作比较简单。但是，实际升级过程还是遇到 2 个小问题。正好借此机会，写一篇完整版的 KubeSphere 和 Kubernetes **补丁版本**升级完全实战指南。

为什么强调**补丁版本**？这里就要简单点介绍一下 Kubernetes 版本命名规则及升级策略。

Kubernetes 版本以 **x.y.z** 表示，其中 **x** 是主要版本， **y** 是次要版本，**z** 是补丁版本。Kubernetes 跨版本升级从 v1.28 开始支持 3 个次要版本，v1.28 以前支持 2 个次要版本。但是在升级时，高可用性（HA）集群 和 单节点集群，不同组件之间的偏差要求也不尽相同，具体信息可参考 Kubernetes 官方文档的[版本偏差策略](https://kubernetes.io/zh-cn/releases/version-skew-policy/)。

原生的 Kubeadm 和 Kubekey 都支持跨次版本升级，当使用 KubeKey 升级 Kubernetes 次要版本时，将从一个次要版本升级到下一个次要版本，直到目标版本。例如，v1.22 升级到 v.1.24 您会发现升级过程先从 v1.22 先升级到 v1.23 然后再升级到 v1.24，而不是直接从 v1.22 升级到 v1.24。

本文只适用于 KubeSphere 和 Kubernetes 组件的补丁版本升级，**不涉及次要版本升级**。

- KubeSphere v3.4.0 升级到 v3.4.1
- Kubernetes v1.24.x 升级到 v1.24.y
- 且只适用于小规模集群，中大规模集群有待验证

本期为什么暂时不涉及次要版本升级（仅作为个人观点）？

- 没有十足把握，生产环境不建议升级次要版本，尤其是跨越多个次要版本
- 必须要升级时，建议采用「建设新版本集群 + 迁移业务应用 」的解决方案（**适用于有全局负载或是网关，存算分离即 Kubernetes 和 后端存储耦合性不强的场景**）
- 一定要原地跨次要版本升级，在做好充分备份、测试验证后，自求多福吧
- 升级有风险，操作需谨慎

当然，为了技术学习，也为了积累原地升级的实战经验，后期还是会推出次要版本升级指南。

KubeKey 支持 **All-in-One 集群**和多节点集群两种升级场景，本文只实战演示多节点集群的升级场景， All-in-One 集群请参考[官方升级指南](https://www.kubesphere.io/zh/docs/v3.4/upgrade/upgrade-with-kubekey/#all-in-one-集群)。

### 1.2 KubeSphere 和 Kubernetes 升级流程概述

本文演示多节点集群升级场景。在该场景下我们**分别升级** KubeSphere 和 Kubernetes。 KubeKey 本身支持一键直接升级 KubeSphere 和 Kubernetes。但是，个人建议**生产环境建议分别升级、分别验证**。

具体的升级流程如下：

- 备份（**必须**）
- 下载最新版 KubeKey
- 生成集群部署配置文件并修改
- 升级并验证 KubeSphere
- 升级并验证 Kubernetes
- 验证测试

第一步，备份是一定要做的。具体备份啥？本文没有涉及，这个没有通用标准。我个人理解 Kubernetes 相关的 Etcd、集群配置是必须的，再有其他业务重要数据。可用备份迁移工具 Velero 完整备份，但是这也需要大量的额外存储。KubeKey 部署的 Kubernetes 集群自带定时备份 Etcd 的策略。

对于备份有以下想法意见仅供参考：

- 无论集群规模大小，只要是生产集群，就有必要建立日常备份、重大操作备份的备份方案
- 如果日常有备份的习惯建议定期根据备份做恢复演练，验证备份是否可用（**实操很难**）
- 现有的备份方案是否真的能恢复集群？能恢复集群到什么状态？
- 自用 Kubernetes 集群，建议将所有集群管理 YAMl 和业务部署 YAML 存入 GitLab 进行版本控制（**利于备份恢复失败或无备份时快速重建业务，但是数据另算**）
- 尽量设计存算分离的架构，让计算集群和存储集群松耦合，避免计算集群崩溃造成数据丢失。同时，也有利于计算集群崩溃重建的业务快速恢复。

## 2. 升级实战前提条件

为了进行实战演示，我们将使用 KubeKey 工具提前安装和部署一套 KubeSphere 和 Kubernetes 集群。同时，为了模拟真实的业务场景，我们将创建一些测试资源。在验证之前，我们还需要记录当前集群的一些关键信息。

### 2.1 集群环境

- 安装 v3.4.0 KubeSphere，并启用大部分插件
- 安装 v1.24.x 的 Kubernetes 集群（本文使用 v1.24.12）
- 对接 NFS 存储或是其他存储作为持久化存储（本文测试环境选用 NFS）

### 2.2 查看当前集群环境信息

下面查看的当前集群环境信息并不充分，只是查看几个具有代表性的资源，肯定有被忽略的组件和信息。

- 查看所有的 Deployment 使用的 Image，方便升级后对比

```bash
# 受限于篇幅，输出结果略，请自己保存结果
kubectl get deploy -A -o wide
```

- 查看命名空间 `kubesphere-system` 内的常用资源（**还有其他命名规则 kubesphere- 的命名空间，本文略**）

```bash
[root@k8s-master-1 ~]# kubectl get pod,deployment,sts,ds -o wide -n kubesphere-system
NAME                                         READY   STATUS      RESTARTS       AGE     IP              NODE           NOMINATED NODE   READINESS GATES
pod/ks-apiserver-7d7f8c7456-cr6hs            1/1     Running     3 (143m ago)   4d23h   10.233.88.111   k8s-worker-1   <none>           <none>
pod/ks-console-697f467f5c-bkfkl              1/1     Running     3 (143m ago)   4d23h   10.233.88.115   k8s-worker-1   <none>           <none>
pod/ks-controller-manager-755cbdf744-xllxj   1/1     Running     8 (141m ago)   4d23h   10.233.88.116   k8s-worker-1   <none>           <none>
pod/ks-installer-69b7c7cf6c-kkz8w            1/1     Running     5 (143m ago)   4d23h   10.233.74.87    k8s-worker-2   <none>           <none>
pod/minio-746f646bfb-4h7xj                   1/1     Running     3 (143m ago)   4d23h   10.233.88.119   k8s-worker-1   <none>           <none>
pod/openldap-0                               1/1     Running     4 (143m ago)   4d23h   10.233.88.100   k8s-worker-1   <none>           <none>
pod/openpitrix-import-job-plzc5              0/1     Completed   0              139m    10.233.85.48    k8s-master-2   <none>           <none>

NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS              IMAGES                                                                             SELECTOR
deployment.apps/ks-apiserver            1/1     1            1           4d23h   ks-apiserver            registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.4.0                  app=ks-apiserver,tier=backend
deployment.apps/ks-console              1/1     1            1           4d23h   ks-console              registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.4.0                    app=ks-console,tier=frontend
deployment.apps/ks-controller-manager   1/1     1            1           4d23h   ks-controller-manager   registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.4.0         app=ks-controller-manager,tier=backend
deployment.apps/ks-installer            1/1     1            1           4d23h   installer               registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.4.0                  app=ks-installer
deployment.apps/minio                   1/1     1            1           4d23h   minio                   registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z   app=minio,release=ks-minio

NAME                        READY   AGE     CONTAINERS    IMAGES
statefulset.apps/openldap   1/1     4d23h   openldap-ha   registry.cn-beijing.aliyuncs.com/kubesphereio/openldap:1.3.0
```

- 查看 Kubernetes 资源（**受限于篇幅，不展示 pod 结果**）

```bash
[root@k8s-master-1 ~]# kubectl get pods,deployment,sts,ds -o wide -n kube-system
NAME                                          READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS                     IMAGES                                                                    SELECTOR
deployment.apps/calico-kube-controllers       1/1     1            1           4d23h   calico-kube-controllers        registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.26.1    k8s-app=calico-kube-controllers
deployment.apps/coredns                       2/2     2            2           4d23h   coredns                        registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.6               k8s-app=kube-dns
deployment.apps/metrics-server                1/1     1            1           4d23h   metrics-server                 registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2       k8s-app=metrics-server
deployment.apps/openebs-localpv-provisioner   1/1     1            1           4d23h   openebs-provisioner-hostpath   registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0   name=openebs-localpv-provisioner,openebs.io/component-name=openebs-localpv-provisioner

NAME                                   READY   AGE     CONTAINERS            IMAGES
statefulset.apps/snapshot-controller   1/1     4d23h   snapshot-controller   registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0

NAME                          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE     CONTAINERS    IMAGES                                                                     SELECTOR
daemonset.apps/calico-node    6         6         6       6            6           kubernetes.io/os=linux   4d23h   calico-node   registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.26.1                 k8s-app=calico-node
daemonset.apps/kube-proxy     6         6         6       6            6           kubernetes.io/os=linux   4d23h   kube-proxy    registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.24.12          k8s-app=kube-proxy
daemonset.apps/nodelocaldns   6         6         6       6            6           <none>                   4d23h   node-cache    registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12   k8s-app=nodelocaldns
```

- 查看二进制文件

```bash
[root@k8s-master-1 ~]# ll /usr/local/bin/
total 352428
-rwxr-xr-x 1 kube root  65770992 Nov 29 11:42 calicoctl
-rwxr-xr-x 1 root root  23847904 Nov 29 13:50 etcd
-rwxr-xr-x 1 kube root  17620576 Nov 29 13:50 etcdctl
-rwxr-xr-x 1 kube root  46182400 Nov 29 11:42 helm
-rwxr-xr-x 1 kube root  44744704 Nov 29 11:42 kubeadm
-rwxr-xr-x 1 kube root  46075904 Nov 29 11:42 kubectl
-rwxr-xr-x 1 kube root 116637176 Nov 29 11:42 kubelet
drwxr-xr-x 2 kube root        71 Nov 29 13:51 kube-scripts
```

### 2.3 创建测试验证资源

- 创建测试命名空间 `upgrade-test`

```bash
kubectl create ns upgrade-test
```

- 创建测试资源文件，使用镜像 **nginx:latest** 创建 1 个 6 副本的测试业务（包含 pvc），每个副本分布在 1 台 Worker 节点，`vi nginx-test.yaml`

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: test-nginx
  namespace: upgrade-test
spec:
  selector:
    matchLabels:
      app: nginx
  serviceName: "nginx"
  replicas: 6
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: nfs-volume
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: nfs-volume
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "nfs-sc"
      resources:
        requests:
          storage: 1Gi
```

- 创建测试资源

```bash
kubectl apply -f nginx-test.yaml
```

- 写入 index 主页文件

```bash
for id in $(seq 0 1 5);do kubectl exec -it test-nginx-$id -n upgrade-test  -- sh -c "echo I test-nginx-$id > /usr/share/nginx/html/index.html";done
```

- 查看测试资源

```bash
# 查看 Pod（每个节点一个副本）
[root@k8s-master-1 ~]# kubectl get pods -o wide -n upgrade-test
NAME           READY   STATUS    RESTARTS   AGE    IP              NODE           NOMINATED NODE   READINESS GATES
test-nginx-0   1/1     Running   0          2m3s   10.233.85.56    k8s-master-2   <none>           <none>
test-nginx-1   1/1     Running   0          101s   10.233.80.32    k8s-master-1   <none>           <none>
test-nginx-2   1/1     Running   0          79s    10.233.96.16    k8s-master-3   <none>           <none>
test-nginx-3   1/1     Running   0          57s    10.233.74.99    k8s-worker-2   <none>           <none>
test-nginx-4   1/1     Running   0          35s    10.233.87.68    k8s-worker-3   <none>           <none>
test-nginx-5   1/1     Running   0          13s    10.233.88.130   k8s-worker-1   <none>           <none>

# 查看 PVC
[root@k8s-master-1 ~]# kubectl get pvc -o wide -n upgrade-test
NAME                      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE     VOLUMEMODE
nfs-volume-test-nginx-0   Bound    pvc-569f3eea-7e91-4ae0-8bdf-3f38b9ab3ee5   1Gi        RWO            nfs-sc         2m32s   Filesystem
nfs-volume-test-nginx-1   Bound    pvc-f1ef2599-7a7a-45c4-bdd6-8f3884f1fa7b   1Gi        RWO            nfs-sc         2m10s   Filesystem
nfs-volume-test-nginx-2   Bound    pvc-78bdb52c-1efc-425f-9533-445d8aadc495   1Gi        RWO            nfs-sc         108s    Filesystem
nfs-volume-test-nginx-3   Bound    pvc-1ce168eb-22fb-41a1-bb39-d252dbca4b39   1Gi        RWO            nfs-sc         86s     Filesystem
nfs-volume-test-nginx-4   Bound    pvc-553e2e5a-bf6c-4995-8856-9fd5d0ab2623   1Gi        RWO            nfs-sc         64s     Filesystem
nfs-volume-test-nginx-5   Bound    pvc-fa12b4b2-25e0-4860-a5dd-81c4eaf6e7f0   1Gi        RWO            nfs-sc         42s     Filesystem

# 查看 index.html
[root@k8s-master-1 ~]# for id in $(seq 0 1 5);do kubectl exec -it test-nginx-$id -n upgrade-test  -- cat /usr/share/nginx/html/index.html;done
I test-nginx-0
I test-nginx-1
I test-nginx-2
I test-nginx-3
I test-nginx-4
I test-nginx-5
```

### 2.4 升级时观测集群和业务状态

本文的观测并不一定全面充分，所以各位在实际升级验证测试时，需要根据真实环境补充。

- 观察集群节点状态

```bash
 watch kubectl get nodes
```

- 观查测试命名空间的资源状态

```bash
kubectl get pods -o wide -n upgrade-test
```

- ping 测模拟的业务 IP（随机找一个 Pod）

```bash
ping 10.233.80.31
```

- curl 模拟的业务 IP（随机找一个 Pod，跟 Ping 测的不同）

```bash
watch curl 10.233.88.130
```

- 观测模拟的业务磁盘挂载情况（没验证写入）

```bash
watch kubectl exec -it test-nginx-3 -n upgrade-test  -- df -h
```

## 3. 下载 KubeKey

升级集群前执行以下命令，下载最新版或是指定版本的 KubeKey。

```bash
export KKZONE=cn
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.13 sh -
```

## 4. 生成集群部署配置文件

### 4.1 使用 KubeKey 生成配置文件

升级之前需要准备集群部署文件，**首选**，建议使用 KubeKey 部署 KubeSphere 和 Kubernetes 集群时使用的配置文件。

如果部署时使用的配置丢失，可以执行以下命令，基于现有集群创建一个 `sample.yaml` 配置文件（**本文重点演示**）。

```bash
./kk create config --from-cluster
```

> **备注 :**
>
> 本文假设 kubeconfig 位于 `~/.kube/config`。您可以通过 `--kubeconfig` 标志进行修改。

实际命令执行结果如下：

```bash
[root@k8s-master-1 kubekey]# ./kk create config --from-cluster
Notice: /root/kubekey/sample.yaml has been created. Some parameters need to be filled in by yourself, please complete it.
```

生成的配置文件 `sample.yaml`

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  ##You should complete the ssh information of the hosts
  - {name: k8s-master-1, address: 192.168.9.91, internalAddress: 192.168.9.91}
  - {name: k8s-master-2, address: 192.168.9.92, internalAddress: 192.168.9.92}
  - {name: k8s-master-3, address: 192.168.9.93, internalAddress: 192.168.9.93}
  - {name: k8s-worker-1, address: 192.168.9.95, internalAddress: 192.168.9.95}
  - {name: k8s-worker-2, address: 192.168.9.96, internalAddress: 192.168.9.96}
  - {name: k8s-worker-3, address: 192.168.9.97, internalAddress: 192.168.9.97}
  roleGroups:
    etcd:
    - SHOULD_BE_REPLACED
    master:
    worker:
    - k8s-master-1
    - k8s-master-2
    - k8s-master-3
    - k8s-worker-1
    - k8s-worker-2
    - k8s-worker-3
  controlPlaneEndpoint:
    ##Internal loadbalancer for apiservers
    #internalLoadbalancer: haproxy

    ##If the external loadbalancer was used, 'address' should be set to loadbalancer's ip.
    domain: lb.opsman.top
    address: ""
    port: 6443
  kubernetes:
    version: v1.24.12
    clusterName: opsman.top
    proxyMode: ipvs
    masqueradeAll: false
    maxPods: 110
    nodeCidrMaskSize: 24
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    privateRegistry: ""
```

### 4.2 修改配置文件模板

根据实际的集群配置修改 `sample.yaml` 文件，请确保正确修改以下字段。

- `hosts`：您主机的基本信息（主机名和 IP 地址）以及使用 SSH 连接至主机的信息（**重点修改，需要加入 SSH 用户名和密码**）。
- `roleGroups.etcd`：etcd 节点（**重点修改**）。
- `roleGroups.master`：master 节点（**重点修改，默认没生成，必须手动加入否则会报错，参见 常见问题 1**），**注意：**  该参数字段在部署时生成的配置文件中的名称为  `roleGroups.control-plane`。
- `roleGroups.worker`：worker 节点（**核对修改**）。
- `controlPlaneEndpoint`：负载均衡器信息（**可选**）。
- `kubernetes.containerManager`：修改容器运行时（**必选，默认没生成，必须手动加入否则会报错，参见 常见问题 2**）
- `registry`：镜像服务信息（**可选**）。

**修改后文件内容：**

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  ##You should complete the ssh information of the hosts
  - {name: k8s-master-1, address: 192.168.9.91, internalAddress: 192.168.9.91, user: root, password: "P@88w0rd"}
  - {name: k8s-master-2, address: 192.168.9.92, internalAddress: 192.168.9.92, user: root, password: "P@88w0rd"}
  - {name: k8s-master-3, address: 192.168.9.93, internalAddress: 192.168.9.93, user: root, password: "P@88w0rd"}
  - {name: k8s-worker-1, address: 192.168.9.95, internalAddress: 192.168.9.95, user: root, password: "P@88w0rd"}
  - {name: k8s-worker-2, address: 192.168.9.96, internalAddress: 192.168.9.96, user: root, password: "P@88w0rd"}
  - {name: k8s-worker-3, address: 192.168.9.97, internalAddress: 192.168.9.97, user: root, password: "P@88w0rd"}
  roleGroups:
    etcd:
    - k8s-master-1
    - k8s-master-2
    - k8s-master-3
    master:
    - k8s-master-1
    - k8s-master-2
    - k8s-master-3
    worker:
    - k8s-master-1
    - k8s-master-2
    - k8s-master-3
    - k8s-worker-1
    - k8s-worker-2
    - k8s-worker-3
  controlPlaneEndpoint:
    ##Internal loadbalancer for apiservers
    internalLoadbalancer: haproxy

    ##If the external loadbalancer was used, 'address' should be set to loadbalancer's ip.
    domain: lb.opsman.top
    address: ""
    port: 6443
  kubernetes:
    version: v1.24.12
    clusterName: opsman.top
    proxyMode: ipvs
    masqueradeAll: false
    maxPods: 110
    nodeCidrMaskSize: 24
    containerManager: containerd
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    privateRegistry: ""
```

## 5. 升级 KubeSphere

### 5.1 升级 KubeSphere

执行以下命令，将 KubeSphere 从 v3.4.0 升级至 v3.4.1：

```bash
export KKZONE=cn
./kk upgrade --with-kubesphere v3.4.1 -f sample.yaml
```

执行后的结果如下（**按提示输入 `yes` 继续**）：

```bash
[root@k8s-master-1 kubekey]# ./kk upgrade --with-kubesphere v3.4.1 -f sample.yaml


 _   __      _          _   __
| | / /     | |        | | / /
| |/ / _   _| |__   ___| |/ /  ___ _   _
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

14:04:22 CST [GreetingsModule] Greetings
14:04:22 CST message: [k8s-worker-3]
Greetings, KubeKey!
14:04:22 CST message: [k8s-master-3]
Greetings, KubeKey!
14:04:22 CST message: [k8s-master-1]
Greetings, KubeKey!
14:04:23 CST message: [k8s-master-2]
Greetings, KubeKey!
14:04:23 CST message: [k8s-worker-1]
Greetings, KubeKey!
14:04:23 CST message: [k8s-worker-2]
Greetings, KubeKey!
14:04:23 CST success: [k8s-worker-3]
14:04:23 CST success: [k8s-master-3]
14:04:23 CST success: [k8s-master-1]
14:04:23 CST success: [k8s-master-2]
14:04:23 CST success: [k8s-worker-1]
14:04:23 CST success: [k8s-worker-2]
14:04:23 CST [NodePreCheckModule] A pre-check on nodes
14:04:23 CST success: [k8s-master-2]
14:04:23 CST success: [k8s-master-1]
14:04:23 CST success: [k8s-worker-1]
14:04:23 CST success: [k8s-master-3]
14:04:23 CST success: [k8s-worker-2]
14:04:23 CST success: [k8s-worker-3]
14:04:23 CST [ClusterPreCheckModule] Get KubeConfig file
14:04:23 CST skipped: [k8s-master-3]
14:04:23 CST skipped: [k8s-master-2]
14:04:23 CST success: [k8s-master-1]
14:04:23 CST [ClusterPreCheckModule] Get all nodes Kubernetes version
14:04:24 CST success: [k8s-worker-1]
14:04:24 CST success: [k8s-worker-2]
14:04:24 CST success: [k8s-worker-3]
14:04:24 CST success: [k8s-master-2]
14:04:24 CST success: [k8s-master-1]
14:04:24 CST success: [k8s-master-3]
14:04:24 CST [ClusterPreCheckModule] Calculate min Kubernetes version
14:04:24 CST skipped: [k8s-master-3]
14:04:24 CST success: [k8s-master-1]
14:04:24 CST skipped: [k8s-master-2]
14:04:24 CST [ClusterPreCheckModule] Check desired Kubernetes version
14:04:24 CST skipped: [k8s-master-3]
14:04:24 CST success: [k8s-master-1]
14:04:24 CST skipped: [k8s-master-2]
14:04:24 CST [ClusterPreCheckModule] Check KubeSphere version
14:04:24 CST skipped: [k8s-master-3]
14:04:24 CST skipped: [k8s-master-2]
14:04:24 CST success: [k8s-master-1]
14:04:24 CST [ClusterPreCheckModule] Check dependency matrix for KubeSphere and Kubernetes
14:04:24 CST skipped: [k8s-master-3]
14:04:24 CST success: [k8s-master-1]
14:04:24 CST skipped: [k8s-master-2]
14:04:24 CST [ClusterPreCheckModule] Get kubernetes nodes status
14:04:24 CST skipped: [k8s-master-3]
14:04:24 CST skipped: [k8s-master-2]
14:04:24 CST success: [k8s-master-1]
14:04:24 CST [UpgradeConfirmModule] Display confirmation form
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name         | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| k8s-master-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:04:23 |
| k8s-master-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:04:23 |
| k8s-master-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:04:23 |
| k8s-worker-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:04:23 |
| k8s-worker-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:04:23 |
| k8s-worker-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:04:23 |
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

Cluster nodes status:
NAME           STATUS   ROLES                  AGE    VERSION    INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION                CONTAINER-RUNTIME
k8s-master-1   Ready    control-plane          5d2h   v1.24.12   192.168.9.91   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-master-2   Ready    control-plane,worker   5d2h   v1.24.12   192.168.9.92   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-master-3   Ready    control-plane,worker   5d2h   v1.24.12   192.168.9.93   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-1   Ready    worker                 5d2h   v1.24.12   192.168.9.95   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-2   Ready    worker                 5d2h   v1.24.12   192.168.9.96   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-3   Ready    worker                 5d     v1.24.12   192.168.9.97   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4

Upgrade Confirmation:
kubernetes version: v1.24.12 to v1.24.12
kubesphere version: v3.4.0 to v3.4.1

Continue upgrading cluster? [yes/no]:
```

> **注意：**  Upgrade 信息确认，Kubernetes 保持版本不变，KubeSphere 提示从 v3.4.0 升级至 v3.4.1。

点击「yes」后，删减版执行结果如下：

```bash
14:11:53 CST [ProgressiveUpgradeModule 2/2] Set current k8s version
14:11:53 CST skipped: [LocalHost]
14:11:53 CST [ChownModule] Chown user $HOME/.kube dir
14:11:53 CST success: [k8s-worker-2]
14:11:53 CST success: [k8s-worker-3]
14:11:53 CST success: [k8s-worker-1]
14:11:53 CST success: [k8s-master-3]
14:11:53 CST success: [k8s-master-2]
14:11:53 CST success: [k8s-master-1]
14:11:53 CST Pipeline[UpgradeClusterPipeline] execute successfully
```

### 5.2 KubeSphere 升级后验证

查看命名空间 `kubesphere-system` 内的常用资源（**还有其他命名规则 kubesphere- 的命名空间，本文略**）

```bash
[root@k8s-master-1 kubekey]# kubectl get pod,deployment,sts,ds -o wide -n kubesphere-system
NAME                                         READY   STATUS      RESTARTS        AGE     IP              NODE           NOMINATED NODE   READINESS GATES
pod/ks-apiserver-746df45599-bcx2k            1/1     Running     0               67s     10.233.85.63    k8s-master-2   <none>           <none>
pod/ks-console-7c65d9b546-rqsgk              1/1     Running     0               67s     10.233.80.33    k8s-master-1   <none>           <none>
pod/ks-controller-manager-7c87998597-g45jc   1/1     Running     0               66s     10.233.85.64    k8s-master-2   <none>           <none>
pod/ks-installer-7cc98d8bcb-jrhv7            1/1     Running     0               4m34s   10.233.85.62    k8s-master-2   <none>           <none>
pod/minio-746f646bfb-4h7xj                   1/1     Running     3 (5h15m ago)   5d2h    10.233.88.119   k8s-worker-1   <none>           <none>
pod/openldap-0                               1/1     Running     4 (5h15m ago)   5d2h    10.233.88.100   k8s-worker-1   <none>           <none>
pod/openpitrix-import-job-wcccl              0/1     Completed   0               42s     10.233.80.34    k8s-master-1   <none>           <none>

NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS              IMAGES                                                                             SELECTOR
deployment.apps/ks-apiserver            1/1     1            1           5d2h   ks-apiserver            registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.4.1                  app=ks-apiserver,tier=backend
deployment.apps/ks-console              1/1     1            1           5d2h   ks-console              registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.4.1                    app=ks-console,tier=frontend
deployment.apps/ks-controller-manager   1/1     1            1           5d2h   ks-controller-manager   registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.4.1         app=ks-controller-manager,tier=backend
deployment.apps/ks-installer            1/1     1            1           5d2h   installer               registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.4.1                  app=ks-installer
deployment.apps/minio                   1/1     1            1           5d2h   minio                   registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z   app=minio,release=ks-minio

NAME                        READY   AGE    CONTAINERS    IMAGES
statefulset.apps/openldap   1/1     5d2h   openldap-ha   registry.cn-beijing.aliyuncs.com/kubesphereio/openldap:1.3.0
```

**分析执行（不完全）结果：**

- ks-apiserver、ks-console、ks-controller-manager、ks-installer、openpitrix-import-job 等组件有重新执行和重建的动作（**查看 AGE 列**）
- ks-apiserver、ks-console、ks-controller-manager、ks-installer 等组件使用的 Image 版本变成了 v3.4.1
- 升级过程中观测的 Nginx 业务没有出现中断
- 其他有变化的 Pod 可以使用命令查看 `kubectl get pods -A`

**登陆管理控制台验证：**

- 工作台首页显示的版本号变更为 **3.4.1**（升级前未截图，只是在命令行中有显示）

![ksp-v340-upgrade-v341](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v340-upgrade-v341.png)

- 系统组件状态（所有组件显示正常）

![ksp-v340-upgrade-v341-clusters-components](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v340-upgrade-v341-clusters-components.png)

## 6. 升级 Kubernetes

### 6.1 升级 Kubernetes

执行以下命令，将 Kubernetes 从 v1.24.12 升级至 v1.24.14。

```bash
./kk upgrade --with-kubernetes v1.24.14 -f sample.yaml
```

执行后的结果如下（**按提示输入 `yes` 继续**）：

```bash
[root@k8s-master-1 kubekey]# ./kk upgrade --with-kubernetes v1.24.14 -f sample.yaml


 _   __      _          _   __
| | / /     | |        | | / /
| |/ / _   _| |__   ___| |/ /  ___ _   _
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

14:54:10 CST [GreetingsModule] Greetings
14:54:10 CST message: [k8s-worker-3]
Greetings, KubeKey!
14:54:10 CST message: [k8s-master-3]
Greetings, KubeKey!
14:54:10 CST message: [k8s-master-1]
Greetings, KubeKey!
14:54:11 CST message: [k8s-master-2]
Greetings, KubeKey!
14:54:11 CST message: [k8s-worker-1]
Greetings, KubeKey!
14:54:11 CST message: [k8s-worker-2]
Greetings, KubeKey!
14:54:11 CST success: [k8s-worker-3]
14:54:11 CST success: [k8s-master-3]
14:54:11 CST success: [k8s-master-1]
14:54:11 CST success: [k8s-master-2]
14:54:11 CST success: [k8s-worker-1]
14:54:11 CST success: [k8s-worker-2]
14:54:11 CST [NodePreCheckModule] A pre-check on nodes
14:54:11 CST success: [k8s-worker-3]
14:54:11 CST success: [k8s-master-2]
14:54:11 CST success: [k8s-master-3]
14:54:11 CST success: [k8s-worker-2]
14:54:11 CST success: [k8s-worker-1]
14:54:11 CST success: [k8s-master-1]
14:54:11 CST [ClusterPreCheckModule] Get KubeConfig file
14:54:11 CST skipped: [k8s-master-3]
14:54:11 CST skipped: [k8s-master-2]
14:54:11 CST success: [k8s-master-1]
14:54:11 CST [ClusterPreCheckModule] Get all nodes Kubernetes version
14:54:12 CST success: [k8s-worker-2]
14:54:12 CST success: [k8s-worker-1]
14:54:12 CST success: [k8s-worker-3]
14:54:12 CST success: [k8s-master-2]
14:54:12 CST success: [k8s-master-3]
14:54:12 CST success: [k8s-master-1]
14:54:12 CST [ClusterPreCheckModule] Calculate min Kubernetes version
14:54:12 CST skipped: [k8s-master-3]
14:54:12 CST skipped: [k8s-master-2]
14:54:12 CST success: [k8s-master-1]
14:54:12 CST [ClusterPreCheckModule] Check desired Kubernetes version
14:54:12 CST skipped: [k8s-master-3]
14:54:12 CST skipped: [k8s-master-2]
14:54:12 CST success: [k8s-master-1]
14:54:12 CST [ClusterPreCheckModule] Check KubeSphere version
14:54:12 CST skipped: [k8s-master-3]
14:54:12 CST skipped: [k8s-master-2]
14:54:12 CST success: [k8s-master-1]
14:54:12 CST [ClusterPreCheckModule] Check dependency matrix for KubeSphere and Kubernetes
14:54:12 CST skipped: [k8s-master-3]
14:54:12 CST skipped: [k8s-master-2]
14:54:12 CST success: [k8s-master-1]
14:54:12 CST [ClusterPreCheckModule] Get kubernetes nodes status
14:54:12 CST skipped: [k8s-master-3]
14:54:12 CST skipped: [k8s-master-2]
14:54:12 CST success: [k8s-master-1]
14:54:12 CST [UpgradeConfirmModule] Display confirmation form
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name         | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| k8s-master-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:54:11 |
| k8s-master-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:54:11 |
| k8s-master-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:54:11 |
| k8s-worker-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:54:11 |
| k8s-worker-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:54:11 |
| k8s-worker-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        | v1.6.4     | y          |             |                  | CST 14:54:11 |
+--------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

Cluster nodes status:
NAME           STATUS   ROLES                  AGE    VERSION    INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION                CONTAINER-RUNTIME
k8s-master-1   Ready    control-plane          5d3h   v1.24.12   192.168.9.91   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-master-2   Ready    control-plane,worker   5d3h   v1.24.12   192.168.9.92   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-master-3   Ready    control-plane,worker   5d3h   v1.24.12   192.168.9.93   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-1   Ready    worker                 5d3h   v1.24.12   192.168.9.95   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-2   Ready    worker                 5d3h   v1.24.12   192.168.9.96   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-3   Ready    worker                 5d1h   v1.24.12   192.168.9.97   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4

Upgrade Confirmation:
kubernetes version: v1.24.12 to v1.24.14

Continue upgrading cluster? [yes/no]:
```

> **注意：**  Upgrade 信息确认，Kubernetes 提示从 v1.24.12 升级至 v1.24.14。

点击「yes」后，删减版执行结果如下：

```bash
15:15:35 CST [ProgressiveUpgradeModule 2/2] Set current k8s version
15:15:35 CST skipped: [LocalHost]
15:15:35 CST [ChownModule] Chown user $HOME/.kube dir
15:15:35 CST success: [k8s-worker-1]
15:15:35 CST success: [k8s-worker-3]
15:15:35 CST success: [k8s-worker-2]
15:15:35 CST success: [k8s-master-2]
15:15:35 CST success: [k8s-master-1]
15:15:35 CST success: [k8s-master-3]
15:15:35 CST Pipeline[UpgradeClusterPipeline] execute successfully
```

升级的软件列表（由于并没有使用原有的 KubeKey 目录的数据升级集群。因此，会自动下载所需的所有软件包，标粗的为实际更新的软件）

- **kubeadm v1.24.14**

- **kubelet v1.24.14** 

- **kubectl v1.24.14** 

- helm v3.9.0
- kubecni v1.2.0
- crictl v1.24.0
- etcd v3.4.13 
- containerd 1.6.4
- runc v1.1.1
- calicoctl v3.26.1

**升级中观测结果**

- Master 和 Worker 节点会逐一升级，升级过程中在 Master 节点执行 kubectl 的命令时会出现 API 无法连接的情况

```bash
[root@k8s-master-1 ~]# kubectl get nodes
The connection to the server lb.opsman.top:6443 was refused - did you specify the right host or port?
```

> **说明：** 
>
> 出现这种现象并不是说 Kubernetes 的 API 没有高可用，实际上是伪高可用。
>
> 主要是因为 KubeKey 部署的内置负载均衡 HAProxy 只作用于 Worker 节点，在 Master 节点只会连接本机的 kube-apiserver（**因此，也说明有条件还是自建负载均衡比较好**）。

```bash
# Master 节点
[root@k8s-master-1 ~]# ss -ntlup | grep 6443
tcp    LISTEN     0      32768  [::]:6443               [::]:*                   users:(("kube-apiserver",pid=5780,fd=7))

# Worker 节点
[root@k8s-worker-1 ~]# ss -ntlup | grep 6443
tcp    LISTEN     0      4000   127.0.0.1:6443                  *:*                   users:(("haproxy",pid=1778,fd=7))
```

- 测试的 Nginx 业务服务未中断（**ping、curl、df 都未见异常**）
- kube-apiserver、kube-controller-manager、kube-proxy、kube-scheduler 镜像从 v1.24.12 直接升级到了 v1.24.14，没有经过中间的补丁版本

```bash
[root@k8s-master-1 ~]# crictl images | grep v1.24
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver            v1.24.12            2d5d51b77357e       34.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver            v1.24.14            b651b48a617a5       34.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager   v1.24.12            d30605171488d       31.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager   v1.24.14            d40212fa9cf04       31.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                v1.24.12            562ccc25ea629       39.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                v1.24.14            e57c0d007d1ef       39.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler            v1.24.12            cfa5d12eaa131       15.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler            v1.24.14            19bf7b80c50e5       15.8MB
```

### 6.2 Kubernetes 升级后验证

- 查看 Nodes 版本（VERSION 更新为 v1.24.14）

```bash
[root@k8s-master-1 ~]# kubectl get nodes -o wide
NAME           STATUS   ROLES                  AGE    VERSION    INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION                CONTAINER-RUNTIME
k8s-master-1   Ready    control-plane          5d3h   v1.24.14   192.168.9.91   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-master-2   Ready    control-plane,worker   5d3h   v1.24.14   192.168.9.92   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-master-3   Ready    control-plane,worker   5d3h   v1.24.14   192.168.9.93   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-1   Ready    worker                 5d3h   v1.24.14   192.168.9.95   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-2   Ready    worker                 5d3h   v1.24.14   192.168.9.96   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
k8s-worker-3   Ready    worker                 5d1h   v1.24.14   192.168.9.97   <none>        CentOS Linux 7 (Core)   5.4.261-1.el7.elrepo.x86_64   containerd://1.6.4
```

- 查看 Kubernetes 资源（**受限于篇幅，不展示 pod 结果，但实际变化都在 Pod 上**）

```bash
[root@k8s-master-1 kubekey]# kubectl get deployment,sts,ds -o wide -n kube-system
NAME                                          READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS                     IMAGES                                                                    SELECTOR
deployment.apps/calico-kube-controllers       1/1     1            1           5d3h   calico-kube-controllers        registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.26.1    k8s-app=calico-kube-controllers
deployment.apps/coredns                       2/2     2            2           5d3h   coredns                        registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.6               k8s-app=kube-dns
deployment.apps/metrics-server                1/1     1            1           5d3h   metrics-server                 registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2       k8s-app=metrics-server
deployment.apps/openebs-localpv-provisioner   1/1     1            1           5d3h   openebs-provisioner-hostpath   registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0   name=openebs-localpv-provisioner,openebs.io/component-name=openebs-localpv-provisioner

NAME                                   READY   AGE    CONTAINERS            IMAGES
statefulset.apps/snapshot-controller   1/1     5d3h   snapshot-controller   registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0

NAME                          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE    CONTAINERS    IMAGES                                                                     SELECTOR
daemonset.apps/calico-node    6         6         6       6            6           kubernetes.io/os=linux   5d3h   calico-node   registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.26.1                 k8s-app=calico-node
daemonset.apps/kube-proxy     6         6         6       6            6           kubernetes.io/os=linux   5d3h   kube-proxy    registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.24.14          k8s-app=kube-proxy
daemonset.apps/nodelocaldns   6         6         6       6            6           <none>                   5d3h   node-cache    registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12   k8s-app=nodelocaldns
```

- 查看二进制文件

```bash
[root@k8s-master-1 kubekey]# ll /usr/local/bin/
total 352448
-rwxr-xr-x 1 root root  65770992 Dec  4 15:09 calicoctl
-rwxr-xr-x 1 root root  23847904 Nov 29 13:50 etcd
-rwxr-xr-x 1 kube root  17620576 Nov 29 13:50 etcdctl
-rwxr-xr-x 1 root root  46182400 Dec  4 15:09 helm
-rwxr-xr-x 1 root root  44748800 Dec  4 15:09 kubeadm
-rwxr-xr-x 1 root root  46080000 Dec  4 15:09 kubectl
-rwxr-xr-x 1 root root 116646168 Dec  4 15:09 kubelet
drwxr-xr-x 2 kube root        71 Nov 29 13:51 kube-scripts
```

> **注意：** 除了 Etcd 其他都有更新，说明 Etcd 不在组件更新范围内

- 创建测试资源

```bash
kubectl create deployment nginx-upgrade-test --image=nginx:latest --replicas=6 -n upgrade-test
```

> **说明：** 本测试比较简单，生产环境建议更充分的测试

- 查看创建的测试资源

```bash
# 查看 Deployment
[root@k8s-master-1 ~]#  kubectl get deployment -n upgrade-test
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
nginx-upgrade-test   6/6     6            6           14s

# 查看 Pod
[root@k8s-master-1 ~]#  kubectl get deployment,pod -n upgrade-test
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-upgrade-test   6/6     6            6           54s

NAME                                      READY   STATUS    RESTARTS        AGE
pod/nginx-upgrade-test-6df47f7cd7-8fv9l   1/1     Running   0               54s
pod/nginx-upgrade-test-6df47f7cd7-8jtmn   1/1     Running   0               54s
pod/nginx-upgrade-test-6df47f7cd7-9k7lr   1/1     Running   0               54s
pod/nginx-upgrade-test-6df47f7cd7-gq7mz   1/1     Running   0               54s
pod/nginx-upgrade-test-6df47f7cd7-qj9lf   1/1     Running   0               54s
pod/nginx-upgrade-test-6df47f7cd7-v8x6s   1/1     Running   0               54s
pod/test-nginx-0                          1/1     Running   1 (3h13m ago)   5h55m
pod/test-nginx-1                          1/1     Running   1 (3h13m ago)   5h55m
pod/test-nginx-2                          1/1     Running   1 (3h13m ago)   5h54m
pod/test-nginx-3                          1/1     Running   1 (3h13m ago)   5h54m
pod/test-nginx-4                          1/1     Running   1 (3h13m ago)   5h53m
pod/test-nginx-5                          1/1     Running   1 (3h13m ago)   5h53m
```

至此，我们顺利的完成了 KubeSphere 和 Kubernetes 的补丁版本升级及测试验证。

## 7. 常见问题

### 7.1 问题 1

- 报错信息

```bash
[root@k8s-master-1 kubekey]# ./kk upgrade --with-kubesphere v3.4.1 -f sample.yaml
14:00:54 CST [FATA] The number of master/control-plane cannot be 0
```

- 解决方案

修改集群部署文件 `sample.yaml`，正确填写 `roleGroups.master`：master 节点信息

### 7.2 问题 2

- 报错信息

```bash
Continue upgrading cluster? [yes/no]: yes
14:07:02 CST success: [LocalHost]
14:07:02 CST [SetUpgradePlanModule 1/2] Set upgrade plan
14:07:02 CST success: [LocalHost]
14:07:02 CST [SetUpgradePlanModule 1/2] Generate kubeadm config
14:07:02 CST message: [k8s-master-1]
Failed to get container runtime cgroup driver.: Failed to exec command: sudo -E /bin/bash -c "docker info | grep 'Cgroup Driver'"
/bin/bash: docker: command not found: Process exited with status 1
14:07:02 CST retry: [k8s-master-1]
14:07:07 CST message: [k8s-master-1]
Failed to get container runtime cgroup driver.: Failed to exec command: sudo -E /bin/bash -c "docker info | grep 'Cgroup Driver'"
/bin/bash: docker: command not found: Process exited with status 1
14:07:07 CST retry: [k8s-master-1]
14:07:12 CST message: [k8s-master-1]
Failed to get container runtime cgroup driver.: Failed to exec command: sudo -E /bin/bash -c "docker info | grep 'Cgroup Driver'"
/bin/bash: docker: command not found: Process exited with status 1
14:07:12 CST skipped: [k8s-master-3]
14:07:12 CST skipped: [k8s-master-2]
14:07:12 CST failed: [k8s-master-1]
error: Pipeline[UpgradeClusterPipeline] execute failed: Module[SetUpgradePlanModule 1/2] exec failed:
failed: [k8s-master-1] [GenerateKubeadmConfig] exec failed after 3 retries: Failed to get container runtime cgroup driver.: Failed to exec command: sudo -E /bin/bash -c "docker info | grep 'Cgroup Driver'"
/bin/bash: docker: command not found: Process exited with status 1
```

- 解决方案

修改集群部署文件 `sample.yaml`，正确填写 `kubernetes.containerManager: containerd`，默认使用 Docker。

## 8. 总结

本文通过实战演示了 KubeKey 部署的 KubeSphere 和 Kubernetes 升级补丁版本的详细过程，以及可能遇到的问题和对应的解决方案。同时，也阐述了在升级前和升级后需要进行哪些验证，以确保系统升级的成功。

概括总结全文主要涉及以下内容：

- Kubernetes 版本升级策略介绍
- 升级实战环境准备
- KubeSphere 和 Kubernetes 升级准备和升级过程监测
- 利用 KubeKey 升级 KubeSphere
- 利用 KubeKey 升级 Kubernetes
- KubeSphere 和 Kubernetes 升级后验证

**本文所提供的实战内容可以直接应用于测试和研发环境。同时，对于生产环境也有一定的参考价值。然而，请务必谨慎对待，不要直接将其应用于生产环境。**