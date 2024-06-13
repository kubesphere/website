---
title: '使用 KubeKey v3.1.1 离线部署原生 Kubernetes v1.28.8 实战'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, KubeKey '
description: '本文为大家实战演示如何在 openEuler 22.03 LTS SP3 上，利用 KubeKey 制作 Kubernetes 离线安装包，并实战离线部署 **Kubernetes v1.28.8 集群。'
createTime: '2024-06-13'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-deploy-k8s-offline-cover.png'
---

本文我将为大家实战演示，如何基于操作系统 **openEuler 22.03 LTS SP3**，利用 KubeKey 制作 Kubernetes 离线安装包，并实战离线部署 **Kubernetes v1.28.8** 集群。

**实战服务器配置 (架构 1:1 复刻小规模生产环境，配置略有不同)**

|    主机名     |      IP      | CPU  | 内存 | 系统盘 | 数据盘 |              用途              |
| :-----------: | :----------: | :--: | :--: | :----: | :----: | :----------------------------: |
| ksp-control-1 | 192.168.9.91 |  8   |  16  |   40   |  100   |   离线环境 k8s-control-plane   |
| ksp-control-2 | 192.168.9.92 |  8   |  16  |   40   |  100   |   离线环境 k8s-control-plane   |
| ksp-control-3 | 192.168.9.93 |  8   |  16  |   40   |  100   |   离线环境 k8s-control-plane   |
| ksp-registry  | 192.168.9.90 |  4   |  8   |   40   |  100   | 离线环境部署节点和镜像仓库节点 |
|  ksp-deploy   | 192.168.9.89 |  4   |  8   |   40   |  100   |     联网主机用于制作离线包     |
|     合计      |      5       |  32  |  64  |  200   |  500   |                                |

**实战环境涉及软件版本信息**

- 操作系统：**openEuler 22.03 LTS SP3**
- Kubernetes：**v1.28.8**
- KubeKey:  **v3.1.1**

## 1. 制作离线部署资源

本文增加了一台能联网的 **ksp-deploy** 节点，在该节点下载 KubeKey 最新版（**v3.1.1**），用来制作离线部署资源包。

### 1.1 下载 KubeKey

- 下载最新版的 KubeKey

```shell
mkdir -p /data/kubekey
cd /data/kubekey

# 选择中文区下载(访问 GitHub 受限时使用)
export KKZONE=cn

# 执行下载命令，获取最新版的 kk（受限于网络，有时需要执行多次）
curl -sfL https://get-kk.kubesphere.io | sh -
```

### 1.2 创建 manifests 模板文件

KubeKey v3.1.0 之前， manifests 文件需要根据模板手动编写， 现在可以通过 Kubekey 的  `create manifest` 命令自动生成 manifests 模板。

1. `create manifest` 支持的参数如下

```bash
$ ./kk create manifest --help
Create an offline installation package configuration file

Usage:
  kk create manifest [flags]

Flags:
      --arch stringArray         Specify a supported arch (default [amd64])
      --debug                    Print detailed information
  -f, --filename string          Specify a manifest file path
  -h, --help                     help for manifest
      --ignore-err               Ignore the error message, remove the host which reported error and force to continue
      --kubeconfig string        Specify a kubeconfig file
      --name string              Specify a name of manifest object (default "sample")
      --namespace string         KubeKey namespace to use (default "kubekey-system")
      --with-kubernetes string   Specify a supported version of kubernetes
      --with-registry            Specify a supported registry components
  -y, --yes                      Skip confirm check
```

2. 官方示例（支持多集群、多架构）

```bash
# 示例：创建包含 kubernetes v1.24.17，v1.25.16，且 cpu 架构为 amd64、arm64 的 manifests 文件。
./kk create manifest --with-kubernetes v1.24.17,v1.25.16 --arch amd64 --arch arm64
```

3. 创建一个 amd64 架构 kubernetes v1.28.8 的 manifests 文件

```bash
./kk create manifest --name opsxlab --with-kubernetes v1.28.8 --arch amd64 --with-registry "docker registry"
```

4. 生成的配置文件如下

 ```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Manifest
metadata:
  name: opsxlab
spec:
  arches:
  - amd64
  operatingSystems:
  - arch: amd64
    type: linux
    id: ubuntu
    version: "20.04"
    osImage: Ubuntu 20.04.6 LTS
    repository:
      iso:
        localPath:
        url:
  kubernetesDistributions:
  - type: kubernetes
    version: v1.28.8
  components:
    helm:
      version: v3.14.3
    cni:
      version: v1.2.0
    etcd:
      version: v3.5.13
    containerRuntimes:
    - type: docker
      version: 24.0.9
    - type: containerd
      version: 1.7.13
    calicoctl:
      version: v3.27.3
    crictl:
      version: v1.29.0
    docker-registry:
      version: "2"
    harbor:
      version: v2.10.1
    docker-compose:
      version: v2.26.1
  images:
  - docker.io/kubesphere/pause:3.9
  - docker.io/kubesphere/kube-apiserver:v1.28.8
  - docker.io/kubesphere/kube-controller-manager:v1.28.8
  - docker.io/kubesphere/kube-scheduler:v1.28.8
  - docker.io/kubesphere/kube-proxy:v1.28.8
  - docker.io/coredns/coredns:1.9.3
  - docker.io/kubesphere/k8s-dns-node-cache:1.22.20
  - docker.io/calico/kube-controllers:v3.27.3
  - docker.io/calico/cni:v3.27.3
  - docker.io/calico/node:v3.27.3
  - docker.io/calico/pod2daemon-flexvol:v3.27.3
  - docker.io/calico/typha:v3.27.3
  - docker.io/flannel/flannel:v0.21.3
  - docker.io/flannel/flannel-cni-plugin:v1.1.2
  - docker.io/cilium/cilium:v1.15.3
  - docker.io/cilium/operator-generic:v1.15.3
  - docker.io/hybridnetdev/hybridnet:v0.8.6
  - docker.io/kubeovn/kube-ovn:v1.10.10
  - docker.io/kubesphere/multus-cni:v3.8
  - docker.io/openebs/provisioner-localpv:3.3.0
  - docker.io/openebs/linux-utils:3.3.0
  - docker.io/library/haproxy:2.9.6-alpine
  - docker.io/plndr/kube-vip:v0.7.2
  - docker.io/kubesphere/kata-deploy:stable
  - docker.io/kubesphere/node-feature-discovery:v0.10.0
  registry:
    auths: {}
 ```

**默认的配置文件说明：**

- KubeKey v3.1.1 生成的 manifests 配置文件适用于 ubuntu 部署纯 Kubernetes 集群。因此，我们需要稍作修改，生成一份适配 **openEuler 22.03 LTS SP3** 的 manifests 文件。
- images 列表中有一些镜像实际上用不到，可以删除。本文保留了所有镜像。

### 1.3 修改 manifest 模板文件

根据上面的文件及相关信息，生成最终的 manifest 文件 **ksp-v1.28.8-manifest-opsxlab.yaml**。

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Manifest
metadata:
  name: opsxlab
spec:
  arches:
  - amd64
  operatingSystems:
  - arch: amd64
    type: linux
    id: openEuler
    version: "22.03"
    osImage: openEuler 22.03 (LTS-SP3)
    repository:
      iso:
        localPath: "/data/kubekey/openEuler-22.03-rpms-amd64.iso"
        url:
  kubernetesDistributions:
  - type: kubernetes
    version: v1.28.8
  components:
    helm:
      version: v3.14.3
    cni:
      version: v1.2.0
    etcd:
      version: v3.5.13
    containerRuntimes:
    - type: docker
      version: 24.0.9
    - type: containerd
      version: 1.7.13
    calicoctl:
      version: v3.27.3
    crictl:
      version: v1.29.0
    docker-registry:
      version: "2"
    harbor:
      version: v2.10.1
    docker-compose:
      version: v2.26.1
  images:
  - docker.io/kubesphere/pause:3.9
  - docker.io/kubesphere/kube-apiserver:v1.28.8
  - docker.io/kubesphere/kube-controller-manager:v1.28.8
  - docker.io/kubesphere/kube-scheduler:v1.28.8
  - docker.io/kubesphere/kube-proxy:v1.28.8
  - docker.io/coredns/coredns:1.9.3
  - docker.io/kubesphere/k8s-dns-node-cache:1.22.20
  - docker.io/calico/kube-controllers:v3.27.3
  - docker.io/calico/cni:v3.27.3
  - docker.io/calico/node:v3.27.3
  - docker.io/calico/pod2daemon-flexvol:v3.27.3
  - docker.io/calico/typha:v3.27.3
  - docker.io/flannel/flannel:v0.21.3
  - docker.io/flannel/flannel-cni-plugin:v1.1.2
  - docker.io/cilium/cilium:v1.15.3
  - docker.io/cilium/operator-generic:v1.15.3
  - docker.io/hybridnetdev/hybridnet:v0.8.6
  - docker.io/kubeovn/kube-ovn:v1.10.10
  - docker.io/kubesphere/multus-cni:v3.8
  - docker.io/openebs/provisioner-localpv:3.3.0
  - docker.io/openebs/linux-utils:3.3.0
  - docker.io/library/haproxy:2.9.6-alpine
  - docker.io/plndr/kube-vip:v0.7.2
  - docker.io/kubesphere/kata-deploy:stable
  - docker.io/kubesphere/node-feature-discovery:v0.10.0
  - docker.io/kubesphere/busybox:1.31.1
  registry:
    auths: {}
```

> **manifest 修改说明**：
>
> - operatingSystems 配置删除默认的 ubuntu，新增 openEuler 配置
> - 建议把常用的 nginx、busybox 等基础镜像也加到 images 列表中

### 1.4 获取操作系统依赖包

本实验环境使用的操作系统是 x64 的 openEuler 22.03 LTS SP3，需要自己制作安装 Kubernetes 需要的操作系统依赖包镜像 **openEuler-22.03-rpms-amd64.iso**，其他操作系统请读者在 [KubeKey releases 页面](https://github.com/kubesphere/kubekey/releases)下载。

KubeKey 官方支持的操作系统依赖包，包含以下系统：

- almalinux-9.0
- centos7
- debian10
- debian11
- ubuntu-18.04
- ubuntu-20.04
- ubuntu-22.04

个人建议在离线环境用 openEuler 的安装 ISO，制做一个完整的离线软件源。在利用 KubeKey 安装离线集群时，就不需要考虑操作系统依赖包的问题。

### 1.5 导出制品 artifact

根据生成的 manifest，执行下面的命令制作制品（artifact）。

```shell
export KKZONE=cn
./kk artifact export -m ksp-v1.28.8-manifest-opsxlab.yaml -o ksp-offline-v1.28-artifact.tar.gz
```

正确执行后，输出结果如下（**受限于篇幅，仅展示最终结果**）:

```bash
....
kube/v1.28.8/amd64/kubeadm
kube/v1.28.8/amd64/kubectl
kube/v1.28.8/amd64/kubelet
registry/compose/v2.26.1/amd64/docker-compose-linux-x86_64
registry/harbor/v2.10.1/amd64/harbor-offline-installer-v2.10.1.tgz
registry/registry/2/amd64/registry-2-linux-amd64.tar.gz
repository/amd64/openEuler/22.03/openEuler-22.03-amd64.iso
runc/v1.1.12/amd64/runc.amd64
06:44:12 CST success: [LocalHost]
06:44:12 CST [ChownOutputModule] Chown output file
06:44:12 CST success: [LocalHost]
06:44:12 CST [ChownWorkerModule] Chown ./kubekey dir
06:44:12 CST success: [LocalHost]
06:44:12 CST Pipeline[ArtifactExportPipeline] execute successfull
```

制品制作完成后，查看制品大小（全镜像，制品包居然达到了 **2.7G**，实际使用时尽量有选择的裁剪吧）。

```bash
$ ls -lh ksp-offline-v1.28-artifact.tar.gz
-rw-r--r-- 1 root root 2.7G May 31 06:44 ksp-offline-v1.28-artifact.tar.gz
```

### 1.6 导出 KubeKey 离线安装包

把 KubeKey 工具也制作成压缩包，便于拷贝到离线节点。

```shell
$ tar zcvf kubekey-offline-v1.28.tar.gz kk kubekey-v3.1.1-linux-amd64.tar.gz
```

## 2. 准备离线部署 Kubernetes 的前置数据

请注意，以下操作无特殊说明，均在离线环境**部署（Registry）节点**上执行。

### 2.1 上传离线部署资源包到部署节点

将以下离线部署资源包，上传至离线环境部署（Registry） 节点的 `/data/` 目录（**可根据实际情况修改**）。

- Kubekey：**kubekey-offline-v1.28.tar.gz**
- 制品 artifact：**ksp-offline-v1.28-artifact.tar.gz**

执行以下命令，解压 KubeKey：

```shell
# 创离线资源存放的数据目录
mkdir /data/kubekey
tar xvf /data/kubekey-offline-v1.28.tar.gz -C /data/kubekey
mv ksp-offline-v1.28-artifact.tar.gz /data/kubekey
```

> 注意： openEuler 默认不安装 tar，请自己想办法在离线部署节点上安装 tar。

### 2.2 创建离线集群配置文件

- 执行以下命令创建离线集群配置文件

```shell
cd /data/kubekey
./kk create config --with-kubernetes v1.28.8 -f ksp-v1228-offline.yaml
```

命令执行成功后，在当前目录会生成文件名为 **ksp-v1228-offline.yaml** 的配置文件。

### 2.3 修改 Cluster 配置

离线集群配置文件中 **kind: Cluster** 小节的作用是部署 Kubernetes 集群。本示例采用 3 个节点同时作为 control-plane、etcd 节点和 worker 节点。

执行命令，修改离线集群配置文件 `ksp-v1228-offline.yaml`：

```bash
vi ksp-v1228-offline.yaml
```

修改 **kind: Cluster** 小节中 hosts 和 roleGroups 等信息，修改说明如下。

- hosts：指定节点的 IP、ssh 用户、ssh 密码、ssh 端口。示例演示了 ssh 端口号的配置方法。同时，新增一个 Registry 节点的配置
- roleGroups：指定 3 个 etcd、control-plane 节点，复用相同的机器作为 3 个 worker 节点
- 必须指定主机组 `registry` 作为仓库部署节点
- internalLoadbalancer： 启用内置的 HAProxy 负载均衡器
- system.rpms：**新增配置**，部署时安装 rpm 包（openEuler 系统默认没有安装 tar 包，必须提前安装）
- domain：自定义了一个 **opsxlab.cn**，没特殊需求的场景保留默认值即可
- containerManager：使用 **containerd**
- storage.openebs.basePath：**新增配置**，指定 openebs 默认存储路径为 **/data/openebs/local**
- registry：不指定 `type` 类型，默认安装 docker registry

修改后的完整示例如下：

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: ksp-control-1, address: 192.168.9.91, internalAddress: 192.168.9.91, port:22, user: root, password: "OpsXlab@2024"}
  - {name: ksp-control-2, address: 192.168.9.92, internalAddress: 192.168.9.92, user: root, password: "OpsXlab@2024"}
  - {name: ksp-control-3, address: 192.168.9.93, internalAddress: 192.168.9.93, user: root, password: "OpsXlab@2024"}
  - {name: ksp-registry, address: 192.168.9.90, internalAddress: 192.168.9.90, user: root, password: "OpsXlab@2024"}
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
    registry:
    - ksp-registry
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    internalLoadbalancer: haproxy

    domain: lb.opsxlab.cn
    address: ""
    port: 6443
  system:
    rpms:
      - tar
  kubernetes:
    version: v1.28.8
    clusterName: opsxlab.cn
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
      basePath: /data/openebs/local # 默认没有的新增配置，base path of the local PV provisioner
  registry:
    auths:
      "registry.opsxlab.cn":
        certsPath: "/etc/docker/certs.d/registry.opsxlab.cn"
    privateRegistry: "registry.opsxlab.cn"
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

## 3. 离线部署镜像仓库

为了验证 Kubekey 离线部署镜像仓库服务的能力，本文采用 Kubekey 部署镜像仓库 **Docker Registry**。**小规模生产环境没必要使用 Harbor**。

请注意，以下操作无特殊说明，均在离线环境**部署（Registry）节点**上执行。

### 3.1 安装 Docker Registry

执行以下命令安装镜像仓库 **Docker Registry**：

```bash
./kk init registry -f ksp-v1228-offline.yaml -a ksp-offline-v1.28-artifact.tar.gz
```

正确执行后，输出结果如下（**受限于篇幅，仅展示最终结果**）:

```bash
07:02:15 CST [InitRegistryModule] Fetch registry certs
07:02:15 CST success: [ksp-registry]
07:02:15 CST [InitRegistryModule] Generate registry Certs
[certs] Generating "ca" certificate and key
[certs] registry.opsxlab.cn serving cert is signed for DNS names [ksp-registry localhost registry.opsxlab.cn] and IPs [127.0.0.1 ::1 192.168.9.90]
07:02:16 CST success: [LocalHost]
07:02:16 CST [InitRegistryModule] Synchronize certs file
07:02:19 CST success: [ksp-registry]
07:02:19 CST [InitRegistryModule] Synchronize certs file to all nodes
07:02:25 CST success: [ksp-registry]
07:02:25 CST success: [ksp-control-2]
07:02:25 CST success: [ksp-control-1]
07:02:25 CST success: [ksp-control-3]
07:02:25 CST [InstallRegistryModule] Install registry binary
07:02:25 CST success: [ksp-registry]
07:02:25 CST [InstallRegistryModule] Generate registry service
07:02:26 CST success: [ksp-registry]
07:02:26 CST [InstallRegistryModule] Generate registry config
07:02:27 CST success: [ksp-registry]
07:02:27 CST [InstallRegistryModule] Start registry service

Local image registry created successfully. Address: registry.opsxlab.cn

07:02:27 CST success: [ksp-registry]
07:02:27 CST [ChownWorkerModule] Chown ./kubekey dir
07:02:27 CST success: [LocalHost]
07:02:27 CST Pipeline[InitRegistryPipeline] execute successfully
```

- 查看 Docker 是否配置了私有证书（**确保使用了自定义域名及证书**）

```bash
$ ls /etc/ssl/registry/ssl/
ca.crt  ca-key.pem  ca.pem  registry.opsxlab.cn.cert  registry.opsxlab.cn.key  registry.opsxlab.cn-key.pem  registry.opsxlab.cn.pem

$ ls /etc/docker/certs.d/registry.opsxlab.cn/
ca.crt  registry.opsxlab.cn.cert  registry.opsxlab.cn.key
```

### 3.2 推送离线镜像到镜像仓库

将提前准备好的离线镜像推送到镜像仓库，这一步为**可选项**，因为创建集群的时候默认会推送镜像（本文使用参数忽略了）。为了部署成功率，建议先推送。

- 推送离线镜像

```shell
./kk artifact image push -f ksp-v1228-offline.yaml -a ksp-offline-v1.28-artifact.tar.gz
```

- 正确的安装结果如下（**受限于篇幅，内容有删减**）：

```bash
......
07:04:34 CST Push multi-arch manifest list: registry.opsxlab.cn/kubesphereio/kube-controllers:v3.27.3
INFO[0035] Retrieving digests of member images
07:04:34 CST Digest: sha256:70bfc9dcf0296a14ae87035b8f80911970cb0990c4bb832fc4cf99937284c477 Length: 393
07:04:34 CST success: [LocalHost]
07:04:34 CST [ChownWorkerModule] Chown ./kubekey dir
07:04:34 CST success: [LocalHost]
07:04:34 CST Pipeline[ArtifactImagesPushPipeline] execute successfully
```

## 4. 离线部署 Kubernetes 集群

请注意，以下操作无特殊说明，均在离线环境**部署（Registry）节点**上执行。

### 4.1 离线部署 Kubernetes 集群

执行以下命令，部署 Kubernetes 集群。

```bash
./kk create cluster -f ksp-v1228-offline.yaml -a ksp-offline-v1.28-artifact.tar.gz --with-packages --skip-push-images
```

> **参数说明：**
>
> - **--with-packages**：安装操作系统依赖
> - **--skip-push-images：** 忽略推送镜像，前面已经完成了推送镜像到私有仓库的任务

部署完成后，您应该会在终端上看到类似于下面的输出。

```bash
daemonset.apps/calico-node created
deployment.apps/calico-kube-controllers created
10:19:05 CST skipped: [ksp-control-3]
10:19:05 CST skipped: [ksp-control-2]
10:19:05 CST success: [ksp-control-1]
10:19:05 CST [ConfigureKubernetesModule] Configure kubernetes
10:19:05 CST success: [ksp-control-1]
10:19:05 CST skipped: [ksp-control-2]
10:19:05 CST skipped: [ksp-control-3]
10:19:05 CST [ChownModule] Chown user $HOME/.kube dir
10:19:05 CST success: [ksp-control-2]
10:19:05 CST success: [ksp-control-1]
10:19:05 CST success: [ksp-control-3]
10:19:05 CST [AutoRenewCertsModule] Generate k8s certs renew script
10:19:07 CST success: [ksp-control-3]
10:19:07 CST success: [ksp-control-2]
10:19:07 CST success: [ksp-control-1]
10:19:07 CST [AutoRenewCertsModule] Generate k8s certs renew service
10:19:08 CST success: [ksp-control-1]
10:19:08 CST success: [ksp-control-2]
10:19:08 CST success: [ksp-control-3]
10:19:08 CST [AutoRenewCertsModule] Generate k8s certs renew timer
10:19:09 CST success: [ksp-control-2]
10:19:09 CST success: [ksp-control-3]
10:19:09 CST success: [ksp-control-1]
10:19:09 CST [AutoRenewCertsModule] Enable k8s certs renew service
10:19:10 CST success: [ksp-control-2]
10:19:10 CST success: [ksp-control-1]
10:19:10 CST success: [ksp-control-3]
10:19:10 CST [SaveKubeConfigModule] Save kube config as a configmap
10:19:10 CST success: [LocalHost]
10:19:10 CST [AddonsModule] Install addons
10:19:10 CST success: [LocalHost]
10:19:10 CST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.

Please check the result using the command:

        kubectl get pod -A
```

**在 control-1 节点**，执行命令 `kubectl get pod -A`，查看集群部署的最终结果，确保所有 Pod 的状态均为 **Running**。

```bash
$ kubectl get pod -A
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-76bdc94776-dztgc   1/1     Running   0          2m51s
kube-system   calico-node-mxmm6                          1/1     Running   0          2m51s
kube-system   calico-node-p57qs                          1/1     Running   0          2m51s
kube-system   calico-node-pf5pb                          1/1     Running   0          2m51s
kube-system   coredns-6587775575-tp6sg                   1/1     Running   0          3m16s
kube-system   coredns-6587775575-v9jc6                   1/1     Running   0          3m16s
kube-system   kube-apiserver-ksp-control-1               1/1     Running   0          3m28s
kube-system   kube-apiserver-ksp-control-2               1/1     Running   0          2m45s
kube-system   kube-apiserver-ksp-control-3               1/1     Running   0          2m49s
kube-system   kube-controller-manager-ksp-control-1      1/1     Running   0          3m28s
kube-system   kube-controller-manager-ksp-control-2      1/1     Running   0          2m57s
kube-system   kube-controller-manager-ksp-control-3      1/1     Running   0          2m57s
kube-system   kube-proxy-8mqvs                           1/1     Running   0          2m56s
kube-system   kube-proxy-p9j9b                           1/1     Running   0          2m56s
kube-system   kube-proxy-sdtgl                           1/1     Running   0          2m56s
kube-system   kube-scheduler-ksp-control-1               1/1     Running   0          3m28s
kube-system   kube-scheduler-ksp-control-2               1/1     Running   0          3m1s
kube-system   kube-scheduler-ksp-control-3               1/1     Running   0          3m1s
kube-system   nodelocaldns-9gj5t                         1/1     Running   0          3m1s
kube-system   nodelocaldns-n7wwm                         1/1     Running   0          3m2s
kube-system   nodelocaldns-sbmxl                         1/1     Running   0          3m16s
```

### 4.2 kubectl 命令行验证集群状态

在 control-1 节点运行 kubectl 命令获取 Kubernetes 集群资源信息。

- 查看集群节点信息

```shell
kubectl get nodes -o wide
```

在输出结果中可以看到，当前的 Kubernetes 集群有 3个节点，并详细展示每个节点的名字、状态、角色、存活时间、Kubernetes 版本号、内部 IP、操作系统类型、内核版本和容器运行时等信息。

```shell
$ kubectl get nodes -o wide
NAME           STATUS   ROLES                  AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION                       CONTAINER-RUNTIME
ksp-control-1   Ready    control-plane,worker   7m45s   v1.28.8   192.168.9.91   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
ksp-control-2   Ready    control-plane,worker   7m14s   v1.28.8   192.168.9.92   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
ksp-control-3   Ready    control-plane,worker   7m15s   v1.28.8   192.168.9.93   <none>        openEuler 22.03 (LTS-SP3)   5.10.0-182.0.0.95.oe2203sp3.x86_64   containerd://1.7.13
```

- 查看 Pod 列表

输入以下命令获取在 Kubernetes 集群上运行的 Pod 列表，确保所有的容器状态都是 **Running**（**受限于篇幅，内容不展示**）。

```shell
kubectl get pods -o wide -A
```

至此，我们部署完成了一套 Control-plane 和 Worker 复用，3 节点的 Kubernetes 集群。

> **免责声明：**
>- 笔者水平有限，尽管经过多次验证和检查，尽力确保内容的准确性，**但仍可能存在疏漏之处**。敬请业界专家大佬不吝指教。
>- 本文所述内容仅通过实战环境验证测试，读者可学习、借鉴，但**严禁直接用于生产环境**。**由此引发的任何问题，作者概不负责**！