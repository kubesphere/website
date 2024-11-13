---
title: '33 张高清大图，带你玩转 KubeSphere 4.1.2 部署与扩展组件安装'
tag: 'KubeSphere, Kubernetes, KubeSphere v4, KubeSphere LuBan'
createTime: '2024-11-13'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/ks-4.1.2-deployment-and-extension-installation-cover.png'
---

备受瞩目的 KubeSphere 4.1.2 已经正式官宣发布，该版本带来了一个重大优化：增加默认的扩展组件仓库。

这一优化改进，让采用全新的 KubeSphere LuBan 架构的 KubeSphere，真正实现了自由打造高度可扩展和可配置的云原生底座。

KubeSphere 用户仅需要在 K8s 之上，默认安装清爽简洁、最小化的 KubeSphere Core。后续，基于扩展机制，将常用的功能拆解、封装成一个个可配置和可扩展的组件式应用模块。根据业务场景自由选择组合合适的 KubeSphere 扩展组件。同时，还能将自己的应用无缝融入到 KubeSphere 控制台。最终实现云原生容器云管理平台千人千面的效果。

本文为您提供一份详尽的实战手册，通过逐步操作，助您完成以下核心任务：

- **安装 K8s 集群**：使用 KubeKey，从零开始构建高可用的 K8s 集群。
- **集成 NFS 持久化存储**：无缝对接网络文件系统 (NFS)，为您的集群提供持久化存储解决方案。
- **部署 KubeSphere 4.1.2**：在您的集群上安装最新版本的 KubeSphere，解锁强大的多租户容器云管理平台。
- **配置扩展组件**：安装并配置所需扩展组件，增强 K8s 集群的功能。

通过本指南，您将学会构建一个基于 KubeSphere、可视化管理的高功能、可扩展、高可用的 K8s 集群。清晰的步骤和详尽的图解让每一步都易于操作，确保您能够轻松掌握并成功实施。

**实战服务器配置(架构 1:1 复刻小规模生产环境，只是配置略有不同)**

|    主机名     |      IP       | CPU  | 内存 | 系统盘 | 数据盘 |             用途             |
| :-----------: | :-----------: | :--: | :--: | :----: | :----: | :--------------------------: |
| ksp-control-1 | 192.168.9.161 |  8   |  16  |   40   |  100   | KubeSphere/k8s-control-plane |
| ksp-control-2 | 192.168.9.162 |  8   |  16  |   40   |  100   | KubeSphere/k8s-control-plane |
| ksp-control-3 | 192.168.9.163 |  8   |  16  |   40   |  100   | KubeSphere/k8s-control-plane |
|  ksp-storage  | 192.168.9.164 |  2   |  4   |   40   |  500   |         NFS-Storage          |
|     合计      |       4       |  26  |  52  |  160   |  800   |                              |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3 x86_64**
- KubeSphere：**4.1.2**
- Kubernetes：**v1.30.6**
- KubeKey:  **v3.1.7**

## 1. 前置条件

### 1.1 初始化操作系统

**可选配置**，可以参考 [Kubernetes 集群节点 openEuler 22.03 LTS SP3 系统初始化指南](https://mp.weixin.qq.com/s/YDnvnuTqYfmgvF3HGOJ4WQ)，完成操作系统初始化配置。

如果没有挂载额外的数据盘，无需定制数据存储目录，可以选择使用 KubeKey 自动完成前置条件的安装配置。

初始化指南以 **openEuler 22.03 LTS SP3** 为例，初始化配置过程同样适用于其他 Linux 发行版，只是命令略有不同。

## 2. 部署 Kubernetes 集群

本文利用 KubeSphere 出品的 KubeKey 工具，部署一套包含**三个节点**， **Control 和 Worker 复用**的 K8s 高可用集群。

将 **Control 1 节点** 作为部署节点，执行下面的操作。

### 2.1 下载 KubeKey

- 下载最新版的 KubeKey（**v3.1.7**）

```shell
mkdir /srv/kubekey
cd /srv/kubekey/

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn
curl -sfL https://get-kk.kubesphere.io | sh -
```

- 查看 KubeKey 支持的 Kubernetes 版本列表 **`./kk version --show-supported-k8s`**

```shell
$ ./kk version --show-supported-k8s
v1.19.0
v1.19.8
v1.19.9
v1.19.15
......(受限于篇幅，中间的不展示，请读者根据需求查看)
v1.28.14
v1.28.15
v1.29.0
v1.29.1
v1.29.2
v1.29.3
v1.29.4
v1.29.5
v1.29.6
v1.29.7
v1.29.8
v1.29.9
v1.29.10
v1.30.0
v1.30.1
v1.30.2
v1.30.3
v1.30.4
v1.30.5
v1.30.6
v1.31.0
v1.31.1
v1.31.2
```


KubeKey 支持的 K8s 版本相对较新。本文选择 v1.30.6，而在生产环境中，建议选择 v1.28.15 或其他次要版本为双数且补丁版本超过 5 的版本，以确保更高的稳定性和兼容性。建议避免选择过老的版本，毕竟目前 v1.31.2 已经发布，可以为集群提供更强的功能和安全性。

### 2.2 创建 Kubernetes 集群部署配置

1. 创建集群配置文件

本文选择了 **v1.30.6**。因此，指定配置文件名称为 **ksp-k8s-v1306.yaml**，如果不指定，默认的文件名为 **config-sample.yaml**。

```bash
./kk create config -f ksp-k8s-v1306.yaml --with-kubernetes v1.30.6
```

> **注意：** 
>
> - 安装完成后，请勿删除安装配置文件 **ksp-k8s-v1306.yaml**，后续进行节点扩容、卸载等操作时仍需要使用该文件。如果该文件丢失，您需要重新创建安装配置文件。
> - 生成的默认配置文件内容较多，请参阅 [KubeKey 配置示例](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) 了解完整配置说明。

2. 修改配置文件

本示例采用 3 个节点同时作为 control-plane、etcd 和 worker 节点。

请使用 `vi` 编辑器，编辑配置文件 `ksp-k8s-v1306.yaml`，修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下：

- hosts：指定节点的 IP、ssh 用户、ssh 密码
- roleGroups：指定 3 个 etcd、control-plane 节点，并复用为 worker 节点
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- domain：自定义域名 **lb.opsxlab.cn**，没特殊需求可使用默认值 **lb.kubesphere.local**
- clusterName：自定义 **opsxlab.cn**，没特殊需求可使用默认值 **cluster.local**
- autoRenewCerts：该参数可以实现证书到期自动续期，默认为 **true**
- containerManager：容器运行时使用 **containerd**
- storage.openebs.basePath：**默认没有，新增配置**，指定 openebs 默认存储路径为 **/data/openebs/local**

- registry.privateRegistry：**可选配置，** 解决 Docker 官方镜像不可用的问题
- registry.namespaceOverride： **可选配置，** 解决 Docker 官方镜像不可用的问题

修改后的完整示例如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: opsxlab
spec:
  hosts:
  - {name: ksp-control-1, address: 192.168.9.161, internalAddress: 192.168.9.161, user: root, password: "OpsXlab@2024"}
  - {name: ksp-control-2, address: 192.168.9.162, internalAddress: 192.168.9.162, user: root, password: "OpsXlab@2024"}
  - {name: ksp-control-3, address: 192.168.9.163, internalAddress: 192.168.9.163, user: root, password: "OpsXlab@2024"}
  roleGroups:
    etcd:
    - ksp-control-1
    - ksp-control-2
    - ksp-control-3
    control-plane:
    - ksp-control-1
    - ksp-control-2
    - ksp-control-3
    worker:
    - ksp-control-1
    - ksp-control-2
    - ksp-control-3
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers
    internalLoadbalancer: haproxy
    domain: lb.opsxlab.cn
    address: ""
    port: 6443
  kubernetes:
    version: v1.30.6
    clusterName: opsxlab.cn
    #dnsDomain: opsxlab.cn
    autoRenewCerts: true
    containerManager: containerd
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  storage:
    openebs:
      basePath: /data/openebs/local # 默认没有的新增配置，base path of the local PV 
  registry:
    privateRegistry: "registry.cn-beijing.aliyuncs.com" #使用 KubeSphere 在阿里云的镜像仓库
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

### 2.3 部署 K8s 集群

使用上面生成的配置文件，执行下面的命令，创建 K8s 集群。

```shell
export KKZONE=cn
./kk create cluster -f ksp-k8s-v1306.yaml
```

命令执行后，首先 **Kubekey** 会检查部署 K8s 的依赖及其他详细要求。通过检查后，系统将提示您确认安装。输入 **yes** 并按 **ENTER** 继续部署。

```bash
$ ./kk create cluster -f ksp-k8s-v1306.yaml


 _   __      _          _   __
| | / /     | |        | | / /
| |/ / _   _| |__   ___| |/ /  ___ _   _
|    \| | | | '_ \ / _ \    \ / _ \ | | |
| |\  \ |_| | |_) |  __/ |\  \  __/ |_| |
\_| \_/\__,_|_.__/ \___\_| \_/\___|\__, |
                                    __/ |
                                   |___/

19:55:09 CST [GreetingsModule] Greetings
19:55:09 CST message: [ksp-control-3]
Greetings, KubeKey!
19:55:09 CST message: [ksp-control-1]
Greetings, KubeKey!
19:55:09 CST message: [ksp-control-2]
Greetings, KubeKey!
19:55:09 CST success: [ksp-control-3]
19:55:09 CST success: [ksp-control-1]
19:55:09 CST success: [ksp-control-2]
19:55:09 CST [NodePreCheckModule] A pre-check on nodes
19:55:11 CST success: [ksp-control-3]
19:55:11 CST success: [ksp-control-2]
19:55:11 CST success: [ksp-control-1]
19:55:11 CST [ConfirmModule] Display confirmation form
+---------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| name          | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd | nfs client | ceph client | glusterfs client | time         |
+---------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+
| ksp-control-1 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 19:55:11 |
| ksp-control-2 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 19:55:11 |
| ksp-control-3 | y    | y    | y       | y        | y     | y     | y       | y         | y      |        |            |            |             |                  | CST 19:55:11 |
+---------------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------+------------+-------------+------------------+--------------+

This is a simple check of your environment.
Before installation, ensure that your machines meet all requirements specified at
https://github.com/kubesphere/kubekey#requirements-and-recommendations

Install k8s with specify version:  v1.30.6

Continue this installation? [yes/no]:
```

> **注意：** 
>
> -  nfs client、ceph client、glusterfs client 3 个与存储有关的 client 显示没有安装，这个我们后期会在对接存储的实战中单独安装
> - docker、containerd 会根据配置文件选择的 **containerManager** 类型自动安装

部署完成需要大约 10-20 分钟左右，具体看网速和机器配置，本次部署完成耗时 15 分钟。

部署完成后，如果在终端上显示如下信息，则表明 K8s 集群创建成功。

```yaml
20:10:23 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl get pod -A
```

## 3. 验证 K8s 集群状态

### 3.1 查看集群节点信息

在 **控制节点 1** 运行 ` kubectl ` 命令获取 K8s 集群上的可用节点列表。

```shell
kubectl get nodes -o wide
```

在输出结果中可以看到，当前的 K8s 集群有三个可用节点、节点角色、K8s 版本号、节点的内部 IP、操作系统类型、内核版本、容器运行时及版本号等信息。

```shell
$ kubectl get nodes -o wide
NAME            STATUS   ROLES                  AGE   VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION                       CONTAINER-RUNTIME
ksp-control-1   Ready    control-plane,worker   18m   v1.30.6   192.168.9.161   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
ksp-control-2   Ready    control-plane,worker   17m   v1.30.6   192.168.9.162   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
ksp-control-3   Ready    control-plane,worker   17m   v1.30.6   192.168.9.163   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
```

### 3.2 查看 Pod 信息

输入以下命令获取在 K8s 集群上运行的 Pod 列表。

```shell
kubectl get pods -A -o wide
```

输出结果符合预期，所有 Pod 的状态都是 **Running**。

```shell
$ kubectl get pods -A -o wide
NAMESPACE     NAME                                           READY   STATUS    RESTARTS      AGE   IP              NODE            NOMINATED NODE   READINESS GATES
kube-system   calico-kube-controllers-848b87ffbc-2pmg8       1/1     Running   0             16m   10.233.93.1     ksp-control-1   <none>           <none>
kube-system   calico-node-2pz24                              1/1     Running   0             16m   192.168.9.161   ksp-control-1   <none>           <none>
kube-system   calico-node-gcj44                              1/1     Running   0             16m   192.168.9.163   ksp-control-3   <none>           <none>
kube-system   calico-node-hrttp                              1/1     Running   0             16m   192.168.9.162   ksp-control-2   <none>           <none>
kube-system   coredns-5bfd4749d5-fdhwn                       1/1     Running   0             17m   10.233.93.3     ksp-control-1   <none>           <none>
kube-system   coredns-5bfd4749d5-q8slw                       1/1     Running   0             17m   10.233.93.4     ksp-control-1   <none>           <none>
kube-system   kube-apiserver-ksp-control-1                   1/1     Running   0             17m   192.168.9.161   ksp-control-1   <none>           <none>
kube-system   kube-apiserver-ksp-control-2                   1/1     Running   0             16m   192.168.9.162   ksp-control-2   <none>           <none>
kube-system   kube-apiserver-ksp-control-3                   1/1     Running   0             16m   192.168.9.163   ksp-control-3   <none>           <none>
kube-system   kube-controller-manager-ksp-control-1          1/1     Running   1 (14m ago)   17m   192.168.9.161   ksp-control-1   <none>           <none>
kube-system   kube-controller-manager-ksp-control-2          1/1     Running   1 (13m ago)   16m   192.168.9.162   ksp-control-2   <none>           <none>
kube-system   kube-controller-manager-ksp-control-3          1/1     Running   0             16m   192.168.9.163   ksp-control-3   <none>           <none>
kube-system   kube-proxy-hwqts                               1/1     Running   0             16m   192.168.9.163   ksp-control-3   <none>           <none>
kube-system   kube-proxy-l6rmf                               1/1     Running   0             16m   192.168.9.162   ksp-control-2   <none>           <none>
kube-system   kube-proxy-zksd8                               1/1     Running   0             16m   192.168.9.161   ksp-control-1   <none>           <none>
kube-system   kube-scheduler-ksp-control-1                   1/1     Running   1 (14m ago)   17m   192.168.9.161   ksp-control-1   <none>           <none>
kube-system   kube-scheduler-ksp-control-2                   1/1     Running   0             16m   192.168.9.162   ksp-control-2   <none>           <none>
kube-system   kube-scheduler-ksp-control-3                   1/1     Running   1 (13m ago)   16m   192.168.9.163   ksp-control-3   <none>           <none>
kube-system   nodelocaldns-8w5mr                             1/1     Running   0             17m   192.168.9.161   ksp-control-1   <none>           <none>
kube-system   nodelocaldns-ln7sf                             1/1     Running   0             16m   192.168.9.162   ksp-control-2   <none>           <none>
kube-system   nodelocaldns-zdbp8                             1/1     Running   0             16m   192.168.9.163   ksp-control-3   <none>           <none>
kube-system   openebs-localpv-provisioner-677c4fdd9b-8mfvx   1/1     Running   0             16m   10.233.93.2     ksp-control-1   <none>           <none>
```

### 3.3 查看 Image 列表

输入以下命令获取在 K8s 集群节点上已经下载的 Image 列表。

```shell
$ crictl images ls
IMAGE                                                                   TAG                 IMAGE ID            SIZE
registry.cn-beijing.aliyuncs.com/kubesphereio/cni                       v3.27.4             dc6f84c32585f       88.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/coredns                   1.9.3               5185b96f0becf       14.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache        1.22.20             ff71cd4ea5ae5       30.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver            v1.30.6             a247bfa6152e7       32.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager   v1.30.6             382949f9bfdd9       31.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers          v3.27.4             6b1e38763f401       33.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                v1.30.6             2cce8902ed3cc       29.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler            v1.30.6             ad5858afd5322       19.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node                      v3.27.4             3dd4390f2a85a       117MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pause                     3.9                 e6f1816883972       322kB
registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv       3.3.0               739e82fed8b2c       28.8MB
```

至此，我们已经完成了在三台服务器部署 Control  和 Worker 节点复用的高可用 Kubernetes 集群。

## 4. 对接 NFS 存储

为了扩展 K8s 集群的存储能力，我们将快速对接 NFS 作为 OpenEBS 之外的另一种持久化存储。

本文只介绍 K8s 集群上的操作，NFS 服务器的部署和更多细节请参阅[探索 Kubernetes 持久化存储之 NFS 终极实战指南](https://mp.weixin.qq.com/s/FRZppup6W_AS2O-_CR1KFg) 。

### 4.1 安装 NFS 客户端

**所有节点**执行以下命令，安装 NFS 客户端软件包（**一定要安装，否则无法识别 NFS 类型的存储**）。

```bash
yum install nfs-utils
```

### 4.2 获取 NFS Subdir External Provisioner 部署文件

后续的所有操作，在 K8s 集群的**控制节点 1** 上完成 。

- 下载最新版 `nfs-subdir-external-provisioner-4.0.18` Releases 文件，并解压。

```bash
cd /srv
wget https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner/archive/refs/tags/nfs-subdir-external-provisioner-4.0.18.zip
unzip nfs-subdir-external-provisioner-4.0.18.zip
cd nfs-subdir-external-provisioner-nfs-subdir-external-provisioner-4.0.18/
```

### 4.3 创建 NameSpace

**可选配置，默认的 NameSpace 为 default**，为了便于资源区分管理，可以创建一个新的命名空间。

- 创建 NameSpace

```bash
kubectl create ns nfs-system
```

- 替换资源清单中的命名空间名称

```bash
 sed -i'' "s/namespace:.*/namespace: nfs-system/g" ./deploy/rbac.yaml ./deploy/deployment.yaml
```

### 4.4 配置 RBAC authorization

- 创建 RBAC 资源

```bash
kubectl create -f deploy/rbac.yaml
```

### 4.5 配置 NFS subdir external provisioner

请使用 `vi` 编辑器，编辑文件 `deploy/deployment.yaml`，请用实际 NFS 服务端配置修改以下内容：

- **image:**  默认使用 registry.k8s.io 镜像仓库的镜像 `nfs-subdir-external-provisioner:v4.0.2`，网络受限时需要想办法下载并上传到自己的镜像仓库

- **10.3.243.101：** NFS 服务器的主机名或是 IP 地址
- **/ifs/kubernetes:**  NFS 服务器导出的共享数据目录的路径（exportfs）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: nfs-system
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: registry.k8s.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: k8s-sigs.io/nfs-subdir-external-provisioner
            - name: NFS_SERVER
              value: 10.3.243.101
            - name: NFS_PATH
              value: /ifs/kubernetes
      volumes:
        - name: nfs-client-root
          nfs:
            server: 10.3.243.101
            path: /ifs/kubernetes
```

### 4.6 部署 NFS Subdir External Provisioner 

- 执行部署命令

```bash
 kubectl apply -f deploy/deployment.yaml
```

- 查看 deployment、pod 部署结果

```bash
$ kubectl get deployment,pods -n nfs-system
NAME                                     READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nfs-client-provisioner   1/1     1            1           19m

NAME                                          READY   STATUS    RESTARTS   AGE
pod/nfs-client-provisioner-7654f5d9df-ltpqx   1/1     Running   0          8m14s
```

### 4.7 部署 Storage Class

- 执行部署命令，部署 Storage Class。

```bash
kubectl apply -f deploy/class.yaml
```

- 查看 Storage Class。

```bash
$ kubectl get sc
NAME              PROVISIONER                                   RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local (default)   openebs.io/local                              Delete          WaitForFirstConsumer   false                  15h
nfs-client        k8s-sigs.io/nfs-subdir-external-provisioner   Delete          Immediate              false                  9s
```

## 5. 部署 KubeSphere

接下来我们部署最新的 KubeSphere 4.1.2，实现 K8s 集群的可视化管理。

### 5.1 安装核心组件 KubeSphere Core

执行以下命令通过 `helm` 安装 KubeSphere 的核心组件 KubeSphere Core。

> **说明：** KubeKey 部署 Kubernetes 集群时会自动安装 Helm，无需手动安装。

```bash
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.3.tgz --debug --wait \
--set global.imageRegistry=swr.cn-southwest-2.myhuaweicloud.com/ks \
--set extension.imageRegistry=swr.cn-southwest-2.myhuaweicloud.com/ks \
--set hostClusterName=opsxlab-main
```

> 参数说明： 
>
> - hostClusterName： 修改主集群的名字，默认为 host
> - 两个 imageRegistry：修改组件镜像仓库地址

部署过程需要大约 1-2分钟，具体看网速和机器配置，如果镜像提前下载到本地，基本上能实现 KubeSphere Core 的**秒级**部署。

安装命令执行完成后，如果显示如下信息，则表明 **ks-core** 安装成功，输出信息会显示 KubeSphere Web 控制台的 IP 地址、管理员用户名和管理员密码。

```yaml
NOTES:
Thank you for choosing KubeSphere Helm Chart.

Please be patient and wait for several seconds for the KubeSphere deployment to complete.

1. Wait for Deployment Completion

    Confirm that all KubeSphere components are running by executing the following command:

    kubectl get pods -n kubesphere-system
2. Access the KubeSphere Console

    Once the deployment is complete, you can access the KubeSphere console using the following URL:

    http://192.168.9.161:30880

3. Login to KubeSphere Console

    Use the following credentials to log in:

    Account: admin
    Password: P@88w0rd

NOTE: It is highly recommended to change the default password immediately after the first login.
For additional information and details, please visit https://kubesphere.io.
```

### 5.2 命令行验证 KubeSphere Core 状态

1. 查看 Pod 列表

```shell
kubectl get pods -n kubesphere-system
```

**正确执行后，输出结果如下 :**

```bash
$ kubectl get pods -n kubesphere-system
NAME                                    READY   STATUS    RESTARTS   AGE
extensions-museum-558f99bcd4-4jnwj      1/1     Running   0          2m3s
ks-apiserver-57d575b886-4kgwx           1/1     Running   0          2m3s
ks-console-b9ff8948c-5c42w              1/1     Running   0          2m3s
ks-controller-manager-8c4c4c68f-ww8f9   1/1     Running   0          2m3s
```

## 6. KubeSphere Core 功能概览

### 6.1 工作台

我们打开浏览器访问 **Control-1** 节点的 IP 地址和端口 **30880**，可以打开熟悉的 KubeSphere 管理控制台的登录页面。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-login-v411.png)

输入默认用户  **admin** 和默认密码 **P@88w0rd**，然后点击「登录」。

登录后，系统会要求您更改 KubeSphere 默认用户 admin 的默认密码，输入新的密码并点击「提交」。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-password-confirm-v411.png)

提交完成后，系统会跳转到**新的风格**的 KubeSphere 用户工作台页面。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-dashboard-v411.png)

### 6.2 集群管理

在「工作台」页面，点击「集群管理」，进入集群管理页面，页面风格更方便多集群管理。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-v412.png)

> 注意： 集群名称显示符合自定义的 **opsxlab-main**, 默认名称为 host。

点击「opsxlab-main 」主集群，进入集群管理页面。新版本的集群管理菜单更加简洁，默认只有基本的 K8s 管理功能。

- 集群概览

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-overview-v412.png)

- 集群节点

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-nodes-3c-v412.png)

- 存储类

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-storageclasses-v412.png)

> **注意：** 可以正常显示 K8s 集群已经配置的nfs-client 和 local两个存储类。

至此，我们完成了 KubeSphere Core 的安装部署。

## 7. 安装扩展组件

本文以最常用的监控扩展组件为例，演示扩展市场的功能特性和扩展组件的安装方法，其它组件的安装配置过程基本类似。

### 7.1 查看扩展市场

点击左上角的「扩展市场」，进入扩展市场管理页面，您可以安装、管理插件市场已有的插件。4.1.2 默认自带 **21 个**插件。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-marketplace-v412.png)

### 7.2 安装监控组件

接下来以监控（WhizardTelemetry）组件为例实战演示如何安装、配置扩展组件。

KubeSphere v4 将原有的监控功能拆解成了 8 个新版的监控组件并新增了 2 个额外的组件。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-marketplace-observability-v412.png)

点击扩展市场「WhizardTelemetry 监控」组件的「管理」按钮，打开监控组件的详情页面：

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-marketplace-telemetry-monitor-v412.png)

依次点击“管理”、“安装”，选择合适的扩展组件版本：

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-marketplace-whizard-monitoring-v412.png)

依赖组件检测功能页面提示需要安装**必装组件**「WhizardTelemetry 平台服务」。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-v412.png)

我们先返回扩展市场首页，先安装「WhizardTelemetry 平台服务」组件。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-marketplace-whizard-telemetry-v412.png)

**版本选择:** 选择扩展组件版本。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-telemetry-v412.png)

**扩展组件安装：** 镜像仓库默认使用国外镜像，为了避免部署失败，在扩展组件配置页，修改 **imageRegistry** 为 KubeSphere 官方提供的华为云镜像仓库地址。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-telemetry-config-v412.png)

点击「开始安装」，**安装过程可视化**，安装完成后**显示成功**的图标。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-telemetry-sucess-v412.png)

安装完成后，默认启用该组件。您可以在扩展中心对扩展组件进行扩展组件配置、禁用、卸载等操作：

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-marketplace-whizard-telemetry-sucess-v412.png)

接下来，我们返回扩展市场首页，再次安装「WhizardTelemetry 监控」组件。

**版本选择：** 选择推荐的最新版，必装组件检测也发现了「WhizardTelemetry 平台服务」组件。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-pre-v412.png)

**扩展组件安装：** 在扩展组件配置页，修改 **imageRegistry** 为 KubeSphere 官方提供的华为云镜像仓库地址。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-config-v412.png)

点击开始安装，**安装过程可视化**，安装完成后**显示成功**的图标。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-install-v412.png)

**集群选择：** 安装完成后点击下一步，选择需要开启扩展组件的目标集群，目前只有一个集群，选择后点击「下一步」。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-opsxlab-v412.png)

**差异化配置：** 对目标集群中扩展组件进行差异化配置，在差异化配置页，编辑选中集群的 YAML 配置。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-opsxlab-diff-default-v412.png)

编辑差异化配置，需要参阅组件配置说明进行调整。本文暂不修改，使用初始默认配置。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-opsxlab-diff-edit-v412.png)

点击「确认」，开始安装配置**集群 Agent**。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-opsxlab-agent-v412.png)

在扩展组件详情页面，点击「组件安装状态」图标，点击「查看日志」，查看安装过程。等待扩展组件集群 Agent 安装完成后**关闭页面**。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-opsxlab-sucess-v412.png)

安装完成后，默认启用该组件。您可以在扩展中心对扩展组件进行启用、配置变更、禁用、卸载、集群 Agent 配置等操作：

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-whizard-monitoring-opsxlab-config-v412.png)

**注意：** 本文只安装了 WhizardTelemetry 的**平台服务和监控**组件，还有通知、日志、事件、告警、数据流水线、OpenSearch 分布式检索与分析引擎等组件，请根据需求自行安装。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-extensions-manager-installed-v412.png)

### 7.3 插件验证

不同的扩展组件会有不同的集成方式，有的会将扩展组件的功能入口放在顶部导航栏，有的扩展组件会将功能入口放在企业空间或项目的侧边栏，有的扩展组件会将功能入口放在快捷访问入口。

「WhizardTelemetry 监控」组件的集成采用了我们熟悉的方式，扩展组件安装完成之后，进入到集群管理页面，**概览**页面展示了优化后的新版大屏页面。

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-main-overview-v412.png)

监控告警也出现在了集群管理页面左侧菜单列表中，接下来我们查看细节（**与之前版本展示效果基本一致**）：

- 集群状态

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-main-monitor-cluster-overview-v412.png)

- 物理资源监控

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-main-monitor-cluster-resource-v412.png)

- API Server 监控

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-main-monitor-cluster-api-server-v412.png)

- 调度器监控

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-main-monitor-cluster-scheduler-v412.png)

- 资源用量排行

![](http://pek3b.qingstor.com/kubesphere-community/images/ksp-clusters-opsxlab-main-monitor-cluster-ranking-v412.png)

至此，我们顺利完成了今天的实战部署任务：

- 利用 KubeKey 在三台虚拟机上安装 K8s 1.30.6 高可用集群
- K8s 集群对接 NFS 存储
- 利用 Helm 安装 KubeSphere 4.1.2
- KubeSphere v4 新特性扩展组件介绍及监控组件安装配置实战


 **免责声明：**

- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。欢迎业界专家指正。
- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！
