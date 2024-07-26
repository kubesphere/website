---
title: '探索 Kubernetes 持久化存储之 Longhorn 初窥门径'
tag: 'Longhorn, KubeSphere, Kubernetes'
keywords: 'KubeSphere, Kubernetes, Longhorn'
description: '本文介绍了如何将 Longhorn 集成至 KubeSphere 管理的 Kubernetes 集群。'
createTime: '2024-07-24'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/k8s-longhorn-cover.png'
---

在 Kubernetes 生态系统中，持久化存储扮演着至关重要的角色，它是支撑业务应用稳定运行的基石。对于那些选择自建 Kubernetes 集群的运维架构师而言，选择合适的后端持久化存储解决方案是一项至关重要的选型决策。目前 Ceph、GlusterFS、NFS、openEBS 等解决方案已被广泛采用。

为了丰富我们的技术栈，并为未来的容器云平台设计持久化存储提供更多灵活性和选择性。今天，我将跟大家一起探索，如何将 Longhorn 集成至 KubeSphere 管理的 Kubernetes 集群。

本文核心内容概览：

- **Longhorn 持久化存储选型说明：** 聊一聊 Longhorn 初体验的感想
- **Longhorn 存储服务如何部署：** 如果利用 Helm 安装 Longhorn
- **实战演示**：创建测试资源，体验 Longhorn 的效果。

**实战服务器配置(架构1:1复刻小规模生产环境，配置略有不同)**

|      主机名      |      IP       | CPU  | 内存 | 系统盘 | 数据盘 |                         用途                         |
| :--------------: | :-----------: | :--: | :--: | :----: | :----: | :--------------------------------------------------: |
|   ksp-registry   | 192.168.9.90  |  4   |  8   |   40   |  200   |                   Harbor 镜像仓库                    |
|  ksp-control-1   | 192.168.9.91  |  4   |  8   |   40   |  100   |             KubeSphere/k8s-control-plane             |
|  ksp-control-2   | 192.168.9.92  |  4   |  8   |   40   |  100   |             KubeSphere/k8s-control-plane             |
|  ksp-control-3   | 192.168.9.93  |  4   |  8   |   40   |  100   |             KubeSphere/k8s-control-plane             |
|   ksp-worker-1   | 192.168.9.94  |  4   |  16  |   40   |  100   |                    k8s-worker/CI                     |
|   ksp-worker-2   | 192.168.9.95  |  4   |  16  |   40   |  100   |                      k8s-worker                      |
|   ksp-worker-3   | 192.168.9.96  |  4   |  16  |   40   |  100   |                      k8s-worker                      |
|  ksp-storage-1   | 192.168.9.97  |  4   |  8   |   40   |  400+  | Containerd、OpenEBS、ElasticSearch/Longhorn/Ceph/NFS |
|  ksp-storage-2   | 192.168.9.98  |  4   |  8   |   40   |  300+  |   Containerd、OpenEBS、ElasticSearch/Longhorn/Ceph   |
|  ksp-storage-3   | 192.168.9.99  |  4   |  8   |   40   |  300+  |   Containerd、OpenEBS、ElasticSearch/Longhorn/Ceph   |
| ksp-gpu-worker-1 | 192.168.9.101 |  4   |  16  |   40   |  100   |         k8s-worker(GPU NVIDIA Tesla M40 24G)         |
| ksp-gpu-worker-2 | 192.168.9.102 |  4   |  16  |   40   |  100   |        k8s-worker(GPU NVIDIA Tesla P100 16G)         |
|  ksp-gateway-1   | 192.168.9.103 |  2   |  4   |   40   |        |       自建应用服务代理网关/VIP：192.168.9.100        |
|  ksp-gateway-2   | 192.168.9.104 |  2   |  4   |   40   |        |       自建应用服务代理网关/VIP：192.168.9.100        |
|     ksp-mid      | 192.168.9.105 |  4   |  8   |   40   |  100   |      部署在 k8s 集群之外的服务节点（Gitlab 等）      |
|       合计       |      15       |  56  | 152  |  600   | 2100+  |                                                      |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3 x86_64**
- KubeSphere：**v3.4.1**
- Kubernetes：**v1.28.8**
- KubeKey:  **v3.1.1**
- Containerd：**1.7.13**
- NVIDIA GPU Operator：**v24.3.0**
- NVIDIA 显卡驱动：**550.54.15**
- Longhorn：**v1.6.2**

## 1. Longhorn 初体验

为了贴近生产需求，我在规划部署时增加了一些想法：

**想法 1:**  存储节点规划：

- 向 Kubernetes 集群增加三个节点，专门用于 Longhorn 存储服务
-  Longhorn 存储服务所有组件和数据盘都部署在专属节点
- 每个存储节点打上专属标签 `kubernetes.io/storage=longhorn`，部署 Longhorn 服务时使用 **nodeSelector** 指定节点标签 （不指定会默认使用所有 Worker 节点）
- 业务负载部署在集群中其他 Worker 节点，使用 Longhorn 提供的持久化存储

**想法 2:** 存储空间使用规划：

- 每个存储节点添加一块 Longhorn 专用的 100G 数据盘 `/dev/sdc`，使用 LVM 类型将其格式化，挂载到 `/longhorn` 目录
- 更改 Longhorn 默认存储路径 `/var/lib/longhorn` 为 `/longhorn`

**很遗憾**，在实际部署  Longhorn 时，**想法1没有完全实现**，Longhorn 存储服务所有组件可以部署在指定节点，后期创建 Pod 测试时发现，当 Pod 分配的 Worker 节点不安装 Longhorn CSI 插件，Pod 创建异常。但是，Longhorn CSI 插件又无法独立安装（**也可能我技术太菜，没找到**）。

最终，为了按规划完成部署，我执行了以下操作：

- 部署测试时分别体验了 Kubectl 和 Helm 两种方式，最终成文时选择了 Helm
- Helm 部署时使用 set 参数指定自定义默认存储路径、指定 **nodeSelector** 部署所有 Longhorn 组件
- 创建测试 Pod 时，也带上 **nodeSelector** 标签（运行在其他 Worker 节点的 Pod，无法使用 Longhorn 存储）

整个部署过程比较艰辛，使用 Helm 部署失败或是部署过程异常终止后，想要卸载**很难、很麻烦**。

简单的说几句 Longhorn 初体验后的想法（**仅代表个人观点**）：

- 因为加了自定义规划的想法，所以，**初次体验感较差。**
-  对于新手而言，按照官方文档使用默认配置部署，能获得较好的 Longhorn 初体验（**实测**）

- Longhorn 有自身的特性优点，发展至今已经存在一定的生产用户。但是，**没有一定的技术实力**，不建议碰 Longhorn
- 可以部署体验，了解 Longhorn 是什么样子，能提供什么，有什么优秀特性
- 官方文档资料看着很多，但是实际使用中出现问题的话，能搜到的可参考文档太少，没一定的技术底蕴，还是不要碰了
- 目前来看，替代 GlusterFS、NFS 的持久化存储方案，我宁可选择去征服 Ceph 也不会选择 Longhorn（**Ceph 更成熟，文档资料更多，获得技术支持的途径多**）

**重要说明：**

- 由于部署过程中，定制化配置的结果不尽人意。所以，本文最终变成了浅尝辄止、抛砖引玉之作。**欢迎各位 Longhorn 专家，留言、赐教**。
- 本文的内容对于安装部署 Longhorn 有一定的借鉴意义，但是 **切勿将本文的实战过程用于任何类型的正式环境**。

## 2. 前置条件

### 2.1 扩容存储专用 Worker 节点

将新增的三台存储专用节点加入已有的 Kubernetes 集群，详细的扩容操作请参考 [KubeKey 扩容 Kubernetes Worker 节点实战指南](https://mp.weixin.qq.com/s/l2Xm_g-vS-6Junwe8_38lQ)。

### 2.2 初始化数据盘

按规划将 `/dev/sdc` 初始化，编辑文件 `/etc/fstab`，将 `/longhorn` 目录对应的磁盘配置为开机自动挂载。

LVM 配置比较简单，操作细节不做解释，直接上命令。

```bash
pvcreate /dev/sdc
vgcreate longhorn /dev/sdc
lvcreate -l 100%VG longhorn -n data
mkfs.xfs /dev/mapper/longhorn-data
mkdir /longhorn
mount /dev/mapper/longhorn-data /longhorn
tail -1 /etc/mtab >> /etc/fstab
```

### 2.3 安装 NFSv4 客户端

在 Longhorn 系统中, 备份功能需要 NFSv4, v4.1 或是 v4.2, 同时， ReadWriteMany (RWX) 卷功能需要 NFSv4.1。因此，需要提前安装 NFSv4 客户端。 

```bash
yum install nfs-utils
```

### 2.4 安装 open-iscsi

必要组件，Longhorn 依赖主机上的 **iscsiadm** 向 Kubernetes 提供持久卷。

```bash
yum --setopt=tsflags=noscripts install iscsi-initiator-utils
echo "InitiatorName=$(/sbin/iscsi-iname)" > /etc/iscsi/initiatorname.iscsi
systemctl enable iscsid
systemctl start iscsid
```

### 2.5 检查 Kubernetes 版本

执行以下命令检查 Kubernetes 版本，确保输出结果中 `Server Version` 大于等于 v1.21。

```bash
$ kubectl version
Client Version: v1.28.8
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.28.8
```

### 2.6 使用环境检查脚本

Longhorn 官方编写了一个 shell 脚本，帮助我们搜集评估集群环境是否满足部署要求。

- 在 Control-1 节点下载脚本

```bash
curl -sSfL https://raw.githubusercontent.com/longhorn/longhorn/v1.6.2/scripts/environment_check.sh -o environment_check.sh
```

- 执行脚本

```bash
sh environment_check.sh
```

**正确执行后，输出结果如下 :**

```bash
$ sh environment_check.sh
[INFO]  Required dependencies 'kubectl jq mktemp sort printf' are installed.
[INFO]  All nodes have unique hostnames.
[INFO]  Waiting for longhorn-environment-check pods to become ready (0/0)...
[INFO]  All longhorn-environment-check pods are ready (8/8).
[INFO]  MountPropagation is enabled
[INFO]  Checking kernel release...
[INFO]  Checking iscsid...
[INFO]  Checking multipathd...
[INFO]  Checking packages...
[INFO]  Checking nfs client...
[INFO]  Cleaning up longhorn-environment-check pods...
[INFO]  Cleanup completed.
```

**环境检查过程及结果简要说明：**

- 该脚本执行过程中会从 DockerHub 下载 `alpine:3.12` 镜像，用于测试。如果下载失败，请自行修改为能正常下载的镜像地址。
- 该脚本会在所有 Worker 节点下载 `longhorn-environment-check pods`，并执行相应的检查命令
- 建议所有 Worker 节点系统内核大于等于 5.8，提前安装NFSv4 客户端、安装 open-iscsi

确保所有配置满足前置条件要求，环境检查脚本检测成功后。接下来，我们正式开始安装 Longhorn 组件。

## 3. 安装配置 Longhorn

Longhorn 官方文档中提供多种安装方式的帮助文档：

- Install as a Rancher Apps & Marketplace
- Install with Kubectl
- Install with Helm
- Install with Fleet
- Install with Flux
- Install with ArgoCD
- Air Gap Installation

我最初的计划是，实战演示使用原生的 Kubectl 客户端安装 Longhorn。无奈在部署过程中遇到了自定义配置困难的问题，虽然能搞，但是有点麻烦，最终没有找到灵活、简单的方案。所以，最终成文时改成了 Helm 方式。

### 3.1 设置存储标签

- 按规划给三个存储节点打上专属标签

```bash
kubectl label nodes ksp-storage-1 kubernetes.io/storage=longhorn
kubectl label nodes ksp-storage-2 kubernetes.io/storage=longhorn
kubectl label nodes ksp-storage-3 kubernetes.io/storage=longhorn
```

### 3.2 使用 Helm 安装部署 Longhorn

- 添加  Longhorn Helm repository

```bash
helm repo add longhorn https://charts.longhorn.io
```

- 从 Repository 拉取最新的 Charts

```bash
helm repo update
```

- 官方默认的部署命令（**本文未用，建议新手使用**）

```bash
helm install longhorn longhorn/longhorn --namespace longhorn-system --create-namespace --version 1.6.2
```

- 根据部署规划，**执行自定义部署命令**

```bash
helm install longhorn2 longhorn/longhorn \
  --namespace longhorn-system \
  --create-namespace \
  --version 1.6.2 \
  --set defaultSettings.defaultDataPath="/longhorn" \
  --set defaultSettings.systemManagedComponentsNodeSelector="kubernetes.io/storage:longhorn" \
  --set longhornManager.nodeSelector."kubernetes\.io/storage"=longhorn \
  --set longhornUI.nodeSelector."kubernetes\.io/storage"=longhorn \
  --set longhornDriver.nodeSelector."kubernetes\.io/storage"=longhorn
```

- 检查 Longhorn 部署结果

```bash
$ kubectl -n longhorn-system get pod
```

**正确部署，输出结果如下 :**

```bash
$ kubectl -n longhorn-system get pod -o wide
NAME                                                READY   STATUS    RESTARTS   AGE     IP             NODE            NOMINATED NODE   READINESS GATES
csi-attacher-fffb968d8-gnj58                        1/1     Running   0          4m58s   10.233.77.66   ksp-storage-3   <none>           <none>
csi-attacher-fffb968d8-pk2vq                        1/1     Running   0          4m58s   10.233.73.59   ksp-storage-2   <none>           <none>
csi-attacher-fffb968d8-w6rfh                        1/1     Running   0          4m58s   10.233.64.62   ksp-storage-1   <none>           <none>
csi-provisioner-745d97cc98-2r96q                    1/1     Running   0          4m58s   10.233.64.63   ksp-storage-1   <none>           <none>
csi-provisioner-745d97cc98-n9drv                    1/1     Running   0          4m57s   10.233.77.67   ksp-storage-3   <none>           <none>
csi-provisioner-745d97cc98-zvn7b                    1/1     Running   0          4m57s   10.233.73.60   ksp-storage-2   <none>           <none>
csi-resizer-58c5999fd6-5982f                        1/1     Running   0          4m57s   10.233.73.61   ksp-storage-2   <none>           <none>
csi-resizer-58c5999fd6-7z4m9                        1/1     Running   0          4m57s   10.233.64.64   ksp-storage-1   <none>           <none>
csi-resizer-58c5999fd6-zxszp                        1/1     Running   0          4m57s   10.233.77.68   ksp-storage-3   <none>           <none>
csi-snapshotter-5d995448d9-7tcrn                    1/1     Running   0          4m57s   10.233.77.69   ksp-storage-3   <none>           <none>
csi-snapshotter-5d995448d9-l84vr                    1/1     Running   0          4m57s   10.233.64.65   ksp-storage-1   <none>           <none>
csi-snapshotter-5d995448d9-v9c54                    1/1     Running   0          4m57s   10.233.73.62   ksp-storage-2   <none>           <none>
engine-image-ei-ffd6ed9b-8f6k7                      1/1     Running   0          5m7s    10.233.77.63   ksp-storage-3   <none>           <none>
engine-image-ei-ffd6ed9b-x2ld9                      1/1     Running   0          5m7s    10.233.73.57   ksp-storage-2   <none>           <none>
engine-image-ei-ffd6ed9b-zdpsb                      1/1     Running   0          5m7s    10.233.64.60   ksp-storage-1   <none>           <none>
instance-manager-561847cbad61a658e57dbb9aa2ea827d   1/1     Running   0          5m7s    10.233.77.64   ksp-storage-3   <none>           <none>
instance-manager-74249bf3bf13f051b14d39af24d9e46c   1/1     Running   0          5m7s    10.233.64.61   ksp-storage-1   <none>           <none>
instance-manager-f7b59324b33e30e62b1aacf332a7c3c1   1/1     Running   0          5m7s    10.233.73.58   ksp-storage-2   <none>           <none>
longhorn-csi-plugin-jknqd                           3/3     Running   0          4m57s   10.233.73.63   ksp-storage-2   <none>           <none>
longhorn-csi-plugin-l7px4                           3/3     Running   0          4m57s   10.233.77.70   ksp-storage-3   <none>           <none>
longhorn-csi-plugin-m5bcp                           3/3     Running   0          4m57s   10.233.64.66   ksp-storage-1   <none>           <none>
longhorn-driver-deployer-55c5f59d77-xz5vd           1/1     Running   0          5m14s   10.233.77.61   ksp-storage-3   <none>           <none>
longhorn-manager-nxks5                              1/1     Running   0          5m14s   10.233.77.62   ksp-storage-3   <none>           <none>
longhorn-manager-r7qf6                              1/1     Running   0          5m14s   10.233.64.58   ksp-storage-1   <none>           <none>
longhorn-manager-xbgtd                              1/1     Running   0          5m14s   10.233.73.55   ksp-storage-2   <none>           <none>
longhorn-ui-6fd7f57659-ff7wl                        1/1     Running   0          5m14s   10.233.64.59   ksp-storage-1   <none>           <none>
longhorn-ui-6fd7f57659-v6kpb                        1/1     Running   0          5m14s   10.233.73.56   ksp-storage-2   <none>           <none>
```

> 注意：上述配置虽然实现了所有组件都部署在专属存储节点上。但是，实际无法正常使用，调度在集群其他节点的 Pod 根本无法使用 Longhorn 提供的存储。

### 3.3 开启 UI

官方默认的 Longhorn UI，没有开启认证功能，开启即暴露所有能力。官方目前给出的加密认证方案，需要配合 Ingress controller 使用。

 本文只是属于体验测试环境，也没打算在测试、生产环境使用。因此直接使用 nodePort 放开 Longhorn UI 服务。

更多信息请参考官方文档， [创建一个具有基本认证功能的 NGINX Ingress 控制器](https://longhorn.io/docs/1.6.2/deploy/accessing-the-ui/longhorn-ingress)。

- 编辑使用 NodePort 类型的 svc 资源清单，`vi longhorn-ui-svc.yaml`

```yaml
kind: Service
apiVersion: v1
metadata:
  name: longhorn-ui-nodeport
  namespace: longhorn-system
  labels:
    app: longhorn-ui
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: http
      nodePort: 32222
  selector:
    app: longhorn-ui
  clusterIP: 
  type: NodePort
```

- 创建 svc

```bash
kubectl apply -f longhorn-ui-svc.yaml
```

- 访问 Longhorn UI

打开浏览器访问，**http://集群任意节点IP:32222**

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-default-dashboard.png)

## 4. 验证测试

### 4.1 创建测试 PVC

- 编写测试 PVC 资源清单，`vi test-pvc-longhorn.yaml`

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-pvc-longhorn
spec:
  storageClassName: longhorn
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 2Gi
```

- 创建 PVC

```bash
kubectl apply -f test-pvc-longhorn.yaml
```

- 查看 PVC

```bash
$ kubectl get pvc -o wide
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE   VOLUMEMODE
test-pvc-longhorn   Bound    pvc-d5a7fc28-2e4c-4f9d-b4d7-7cb7ca5a7ea7   2Gi        RWX            longhorn       7s    Filesystem
```

### 4.2 创建测试 Pod

为了正常完成测试，创建 Pod 时指定 `nodeSelector` 标签，将 Pod 创建在 Longhorn 专用节点。

- 编写测试 Pod 资源清单，`vi test-pod-longhorn.yaml`

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: test-pod-longhorn
spec:
  containers:
  - name: test-pod-longhorn
    image: busybox:stable
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "touch /mnt/SUCCESS && sleep 3600"
    volumeMounts:
      - name: longhorn-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  nodeSelector:
    kubernetes.io/storage: longhorn
  volumes:
    - name: longhorn-pvc
      persistentVolumeClaim:
        claimName: test-pvc-longhorn
```

- 创建 Pod

```bash
kubectl apply -f test-pod-longhorn.yaml
```

- 查看 Pod

```bash
$ kubectl get pods -o wide
NAME                READY   STATUS    RESTARTS   AGE   IP             NODE            NOMINATED NODE   READINESS GATES
test-pod-longhorn   1/1     Running   0          51s   10.233.73.80   ksp-storage-2   <none>           <none>
```

- 查看 Pod 挂载的存储

```bash
$ kubectl exec test-pod-longhorn -- df -h
Filesystem                Size      Used Available Use% Mounted on
overlay                  99.9G      4.7G     95.2G   5% /
tmpfs                    64.0M         0     64.0M   0% /dev
tmpfs                     3.6G         0      3.6G   0% /sys/fs/cgroup
10.233.57.220:/pvc-d5a7fc28-2e4c-4f9d-b4d7-7cb7ca5a7ea7
                          1.9G         0      1.9G   0% /mnt
/dev/mapper/openeuler-root
                         34.2G      2.3G     30.2G   7% /etc/hosts
/dev/mapper/openeuler-root
                         34.2G      2.3G     30.2G   7% /dev/termination-log
/dev/mapper/data-lvdata
                         99.9G      4.7G     95.2G   5% /etc/hostname
/dev/mapper/data-lvdata
                         99.9G      4.7G     95.2G   5% /etc/resolv.conf
shm                      64.0M         0     64.0M   0% /dev/shm
tmpfs                     6.4G     12.0K      6.4G   0% /var/run/secrets/kubernetes.io/serviceaccount
tmpfs                     3.6G         0      3.6G   0% /proc/acpi
tmpfs                    64.0M         0     64.0M   0% /proc/kcore
tmpfs                    64.0M         0     64.0M   0% /proc/keys
tmpfs                    64.0M         0     64.0M   0% /proc/timer_list
tmpfs                    64.0M         0     64.0M   0% /proc/sched_debug
tmpfs                     3.6G         0      3.6G   0% /proc/scsi
tmpfs                     3.6G         0      3.6G   0% /sys/firmware
```

- 测试存储空间读写

```bash
# 写入 1GB 的数据
$ kubectl exec test-pod-longhorn -- dd if=/dev/zero of=/mnt/test-disk.img bs=1M count=1000
1000+0 records in
1000+0 records out
1048576000 bytes (1000.0MB) copied, 5.670424 seconds, 176.4MB/s

# 查看结果
$ kubectl exec test-pod-longhorn -- ls -lh /mnt/
[root@ksp-control-1 srv]# kubectl exec test-pod-longhorn -- ls -lh /mnt/
total 1000M
-rw-r--r--    1 root     root           0 Jul 17 01:03 SUCCESS
drwx------    2 root     root       16.0K Jul 17 01:03 lost+found
-rw-r--r--    1 root     root     1000.0M Jul 17 01:04 test-disk.img

# 测试超限（再写入 1GB 数据）
$ kubectl exec test-pod-longhorn -- dd if=/dev/zero of=/mnt/test-disk2.img bs=1M count=1000
dd: /mnt/test-disk2.img: No space left on device
command terminated with exit code 1
```

> 注意：测试时，我们写入了 2G 的数据量，当达过我们创建的 PVC 2G 容量上限时会报错（实际使用写不满 2G）。说明，Longhorn 存储可以做到容量配额限制。 

### 4.3 查看底层存储信息

测试并不充分，只是简单看看。在存储服务器（ **ksp-storage-1 节点**），执行以下命令。

```bash
$ ls -lR /longhorn/
/longhorn/:
total 4
-rw-r--r-- 1 root root 51 Jul 16 11:18 longhorn-disk.cfg
drwxr-xr-x 3 root root 63 Jul 17 01:02 replicas

/longhorn/replicas:
total 0
drwx------ 2 root root 108 Jul 17 01:03 pvc-d5a7fc28-2e4c-4f9d-b4d7-7cb7ca5a7ea7-3a7acff9

/longhorn/replicas/pvc-d5a7fc28-2e4c-4f9d-b4d7-7cb7ca5a7ea7-3a7acff9:
total 2075652
-rw------- 1 root root       4096 Jul 17 01:06 revision.counter
-rw-r--r-- 1 root root 2147483648 Jul 17 01:06 volume-head-000.img
-rw-r--r-- 1 root root        126 Jul 17 01:02 volume-head-000.img.meta
-rw-r--r-- 1 root root        142 Jul 17 01:03 volume.meta
```

> 注意：Longhorn 的存储目录，跟 NFS 存储不一样，无法直接查看原始文件，使用上更安全，但是如果 Longhorn 异常，想要找回数据也更麻烦。

### 4.4 清理测试资源

- 清理测试 Pod、PVC

```bash
kubectl delete -f test-pod-longhorn.yaml -f test-pvc-longhorn.yaml
```

- 在存储服务器（ **ksp-storage-1 节点**）查看数据目录

```bash
$ ls -lR /longhorn/replicas/
/longhorn/replicas/:
total 0
```

从结果中可以看到，Kubernetes 删除 PVC 后，Longhorn 存储层立即删除 PVC 对应的数据目录及数据（**是否能配置默认保留，暂未研究，理论上应该会有**）。

### 4.5 测试异常说明

创建 Pod，不指定 `nodeSelector` 标签，Pod 会随机分配，当分配在没有安装  Longhorn CSI 插件的节点时，创建失败，异常如下。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-test-pod-error-events.png)

**为避免出现上述问题，建议在部署 Longhorn 时遵循默认配置，以实现在所有 Worker 节点上自动部署所需的服务组件。**

## 5. KubeSphere 控制台管理存储资源

### 5.1 管理存储类

在控制台左侧功能菜单，依次选择「集群」->「存储」->「存储类」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-clusters-storageclasses-longhorn.png)

### 5.2 查看持久卷声明

**Step 1:** 在控制台左侧功能菜单，依次选择「集群」->「存储」->「持久卷声明」。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-clusters-volumes-longhorn.png)

**Step 2:** 查看创建的 PVC、PV 及详情。

结果中可以显示 PVC 的存储总容量、剩余容量、已使用百分比、Inode 用量百分比。

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-v341-clusters-volumes-resource-status-longhorn.png)

## 6. Longhorn UI 概览

Longhorn UI 虽然界面简单，但是能满足日常管理的需要，能在界面实现分配存储资源、管理，实现 Longhorn 服务的基本配置管理，下面展示几张截图，作为本文的结尾。

- Dashboard

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-dashboard-resource.png)

- Node 信息

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-ui-node.png)

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-ui-node-expand.png)

- Volume 信息

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-ui-volume.png)

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-ui-volume-pvc-status.png)

- Setting 配置页

![](https://opsxlab-1258881081.cos.ap-beijing.myqcloud.com//ksp-longhorn-ui-setting.png)



> **免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！

