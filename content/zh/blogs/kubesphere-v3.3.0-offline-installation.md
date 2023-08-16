---
title: 'KubeSphere 3.3.0 离线安装教程'
tag: 'KubeSphere'
keywords: 'KubeSphere, Kubernetes'
description: "本文参考官方的离线文档，采用手写 manifest 文件的方式，实现 KubeSphere 3.3.0 离线环境的安装部署。"
createTime: '2022-07-13'
author: '老Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-v3.3.0-offline-installation.png'
---

> 作者：运维架构师，云原生爱好者，目前专注于云原生运维，云原生领域技术栈涉及 Kubernetes、KubeSphere、DevOps、OpenStack、Ansible 等。

KubeKey 是一个用于部署 K8s 集群的开源轻量级工具。

它提供了一种灵活、快速、便捷的方式来仅安装 Kubernetes/K3s，或同时安装 K8s/K3s 和 KubeSphere，以及其他云原生插件。除此之外，它也是扩展和升级集群的有效工具。

KubeKey v2.1.0 版本新增了清单 (manifest) 和制品 (artifact) 的概念，为用户离线部署 K8s 集群提供了一种解决方案。

manifest 是一个描述当前 K8s 集群信息和定义 artifact 制品中需要包含哪些内容的文本文件。

在过去，用户需要准备部署工具，镜像 tar 包和其他相关的二进制文件，每位用户需要部署的 K8s 版本和需要部署的镜像都是不同的。现在使用 KubeKey，用户只需使用清单 manifest 文件来定义将要离线部署的集群环境需要的内容，再通过该 manifest 来导出制品 artifact 文件即可完成准备工作。离线部署时只需要 KubeKey 和 artifact 就可快速、简单的在环境中部署镜像仓库和 K8s 集群。

KubeKey 生成 manifest 文件有两种方式。

- 利用现有运行中的集群作为源生成 manifest 文件，也是官方推荐的一种方式，具体参考 KubeSphere [官网的离线部署文档](https://kubesphere.com.cn/docs/v3.3/installing-on-linux/introduction/air-gapped-installation/ "官网的离线部署文档")。
- 根据 [模板文件](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md "模板文件") 手动编写 manifest 文件。

第一种方式的好处是可以构建 1:1 的运行环境，但是需要提前部署一个集群，不够灵活度，并不是所有人都具备这种条件的。

因此，本文参考官方的离线文档，采用手写 manifest 文件的方式，实现离线环境的安装部署。

### 本文知识点

- 定级：**入门级**
- 了解清单 (manifest) 和制品 (artifact) 的概念
- 掌握 manifest 清单的编写方法
- 根据 manifest 清单制作 artifact
- 离线部署 KubeSphere 和 Kubernetes

### 演示服务器配置

|     主机名      |      IP      | CPU  | 内存 | 系统盘 | 数据盘  |                 用途                  |
| :-------------: | :----------: | :--: | :--: | :----: | :-----: | :-----------------------------------: |
|  zdeops-master  | 192.168.9.9  |  2   |  4   |   40   |   200   |         Ansible 运维控制节点          |
| ks-k8s-master-0 | 192.168.9.91 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| ks-k8s-master-1 | 192.168.9.92 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
| ks-k8s-master-2 | 192.168.9.93 |  4   |  16  |   40   | 200+200 | KubeSphere/k8s-master/k8s-worker/Ceph |
|    es-node-0    | 192.168.9.95 |  2   |  8   |   40   |   200   |             ElasticSearch             |
|    es-node-1    | 192.168.9.96 |  2   |  8   |   40   |   200   |             ElasticSearch             |
|    es-node-2    | 192.168.9.97 |  2   |  8   |   40   |   200   |             ElasticSearch             |
|     harbor      | 192.168.9.89 |  2   |  8   |   40   |   200   |                Harbor                 |
|      合计       |      8       |  22  |  84  |  320   |  2200   |                                       |

### 演示环境涉及软件版本信息

- 操作系统：**CentOS-7.9-x86_64**

- KubeSphere：**3.3.0**

- Kubernetes：**1.24.1**

- Kubekey：**v2.2.1**

- Ansible：**2.8.20**

- Harbor：**2.5.1**

## 离线部署资源制作

### 下载 KubeKey

```shell
# 在zdevops-master 运维开发服务器执行

# 选择中文区下载(访问github受限时使用)
$ export KKZONE=cn

# 下载KubeKey
$ mkdir /data/kubekey
$ cd /data/kubekey/
$ curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.1 sh -
```

### 获取 manifest 模板

参考 **https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md**

有两个参考用例，一个简单版，一个完整版。参考简单版就可以。

### 获取 ks-installer images-list

```shell
$ wget https://github.com/kubesphere/ks-installer/releases/download/v3.3.0/images-list.txt
```

文中的 image 列表选用的 Docker Hub 仓库其他组件存放的公共仓库，国内建议统一更改前缀为 **registry.cn-beijing.aliyuncs.com/kubesphereio**

修改后的完整的镜像列表在下面的 manifest 文件中展示。

请注意，**example-images** 包含的 image 中只保留了 **busybox**，其他的在本文中没有使用。

### 获取操作系统依赖包

```shell
$ wget https://github.com/kubesphere/kubekey/releases/download/v2.2.1/centos7-rpms-amd64.iso
```

将该 ISO 文件放到制作离线镜像的服务器的 /data/kubekey 目录下

### 生成 manifest 文件

根据上面的文件及相关信息，生成最终 **manifest.yaml**。

命名为 **ks-v3.3.0-manifest.yaml**

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Manifest
metadata:
  name: sample
spec:
  arches:
  - amd64
  operatingSystems:
  - arch: amd64
    type: linux
    id: centos
    version: "7"
    osImage: CentOS Linux 7 (Core)
    repository:
      iso:
        localPath: "/data/kubekey/centos7-rpms-amd64.iso"
        url:
  kubernetesDistributions:
  - type: kubernetes
    version: v1.24.1
  components:
    helm: 
      version: v3.6.3
    cni: 
      version: v0.9.1
    etcd: 
      version: v3.4.13
    containerRuntimes:
    - type: containerd
      version: 1.6.4
    crictl: 
      version: v1.24.0
    docker-registry:
      version: "2"
    harbor:
      version: v2.4.1
    docker-compose:
      version: v2.2.2
  images:
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.23.7
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.23.7
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.23.7
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.23.7
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.24.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.24.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.24.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.24.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.22.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.22.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.22.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.21.13
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.21.13
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.21.13
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.21.13
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.7
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/typha:v3.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel:v0.12.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:2.10.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:2.10.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nfs-subdir-external-provisioner:v4.0.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.22.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.21.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubefed:v0.8.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tower:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
  - registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
  - registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx-ingress-controller:v1.1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/redis:5.0.14-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.0.25-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/alpine:3.14
  - registry.cn-beijing.aliyuncs.com/kubesphereio/openldap:1.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/netshoot:v1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cloudcore:v1.9.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/iptables-manager:v1.9.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/edgeservice:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/gatekeeper:v3.5.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-apiserver:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-controller:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:v3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.3.0-2.319.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/inbound-agent:4.10-2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.1-jdk11
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.16
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.17
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.18
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.2-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.1-jdk11-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.16-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.17-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.2-1.18-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2ioperator:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2irun:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2i-binary:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java11-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java11-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java8-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tomcat85-java8-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-11-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-8-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-8-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java-11-runtime:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-8-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-6-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nodejs-4-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-36-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-35-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-34-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/python-27-centos7:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/argocd:v2.3.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset:v0.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/dex:v2.30.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/redis:6.2.6-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload:v0.5.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus:v2.34.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader:v0.55.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator:v0.55.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.11.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics:v2.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter:v1.3.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager:v0.23.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/thanos:v0.25.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/grafana:8.3.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator:v1.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager:v1.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-curator:v5.7.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-oss:6.8.22
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator:v0.13.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/docker:19.03
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit:v1.8.11
  - registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector:1.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/filebeat:6.7.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-operator:v0.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-exporter:v0.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-ruler:v0.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-operator:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-webhook:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.11.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/proxyv2:1.11.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-operator:1.27
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-agent:1.27
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-collector:1.27
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-query:1.27
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-es-index-cleaner:1.27
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kiali-operator:v1.38.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kiali:v1.38
  - registry.cn-beijing.aliyuncs.com/kubesphereio/busybox:1.31.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/scope:1.13.0
  registry:
    auths: {}

```

**manifest 修改说明**

- 开启 **harbor** 和 **docker-compose** 配置项，为后面通过 KubeKey 自建 harbor 仓库推送镜像使用。
- 默认创建的 manifest 里面的镜像列表从 **docker.io** 获取，替换前缀为 **registry.cn-beijing.aliyuncs.com/kubesphereio**。
- 若需要导出的 artifact 文件中包含操作系统依赖文件（如：conntarck、chrony 等），可在 **operationSystem** 元素中的 **.repostiory.iso.url** 中配置相应的 ISO 依赖文件下载地址为 **localPath** ，填写提前下载好的 ISO 包在本地的存放路径，并将 **url** 配置项置空。
- 您可以访问 https://github.com/kubesphere/kubekey/releases/tag/v2.2.1 下载 ISO 文件。

### 导出制品 artifact

```shell
$ export KKZONE=cn

$ ./kk artifact export -m ks-v3.3.0-manifest.yaml -o kubesphere-v3.3.0-artifact.tar.gz
```

**制品 (artifact) 说明**

- 制品（artifact）是一个根据指定的 manifest 文件内容导出的包含镜像 tar 包和相关二进制文件的 tgz 包。
- 在 KubeKey 初始化镜像仓库、创建集群、添加节点和升级集群的命令中均可指定一个 artifact，KubeKey 将自动解包该 artifact 并在执行命令时直接使用解包出来的文件。

### 导出 Kubekey

```shell
$ tar zcvf kubekey-v2.2.1.tar.gz kk kubekey-v2.2.1-linux-amd64.tar.gz
```

## K8s 服务器初始化配置

 本节执行离线环境 K8s 服务器初始化配置。

### Ansible hosts 配置

```ini
[k8s]
ks-k8s-master-0 ansible_ssh_host=192.168.9.91  host_name=ks-k8s-master-0
ks-k8s-master-1 ansible_ssh_host=192.168.9.92  host_name=ks-k8s-master-1
ks-k8s-master-2 ansible_ssh_host=192.168.9.93  host_name=ks-k8s-master-2

[es]
es-node-0 ansible_ssh_host=192.168.9.95 host_name=es-node-0
es-node-1 ansible_ssh_host=192.168.9.96 host_name=es-node-1
es-node-2 ansible_ssh_host=192.168.9.97 host_name=es-node-2

harbor ansible_ssh_host=192.168.9.89 host_name=harbor

[servers:children]
k8s
es

[servers:vars]
ansible_connection=paramiko
ansible_ssh_user=root
ansible_ssh_pass=F@ywwpTj4bJtYwzpwCqD
```

### 检测服务器连通性

```shell
# 利用 ansible 检测服务器的连通性

$ cd /data/ansible/ansible-zdevops/inventories/dev/
$ source /opt/ansible2.8/bin/activate
$ ansible -m ping all
```

### 初始化服务器配置

```shell
# 利用 ansible-playbook 初始化服务器配置

$ ansible-playbook ../../playbooks/init-base.yaml -l k8s
```

### 挂载数据盘

- **挂载第一块数据盘**

```shell
# 利用 ansible-playbook 初始化主机数据盘
# 注意 -e data_disk_path="/data" 指定挂载目录, 用于存储 Docker 容器数据

$ ansible-playbook ../../playbooks/init-disk.yaml -e data_disk_path="/data" -l k8s
```

- **挂载验证**

```shell
# 利用 ansible 验证数据盘是否格式化并挂载
$ ansible harbor -m shell -a 'df -h'

# 利用 ansible 验证数据盘是否配置自动挂载

$ ansible harbor -m shell -a 'tail -1  /etc/fstab'
```

### 安装 K8s 系统依赖包

```shell
# 利用 ansible-playbook 安装 kubernetes 系统依赖包
# ansible-playbook 中设置了启用 GlusterFS 存储的开关，默认开启,不需要的可以将参数设置为 False

$ ansible-playbook ../../playbooks/deploy-kubesphere.yaml -e k8s_storage_glusterfs=false -l k8s
```

## 离线安装集群

### 传输离线部署资源到部署节点

将以下离线部署资源，传到部署节点 (通常是第一个 master 节点) 的 /data/kubekey 目录。

- Kubekey：**kubekey-v2.2.1.tar.gz**
- 制品 artifact：**kubesphere-v3.3.0-artifact.tar.gz**

执行以下操作，解压 kubekey。

```shell
$ cd /data/kubekey
$ tar xvf kubekey-v2.2.1.tar.gz
```

### 创建离线集群配置文件

- 创建配置文件

```shell
$ ./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.24.1 -f config-sample.yaml
```

- 修改配置文件

```shell
$ vim config-sample.yaml
```

**修改内容说明**

- 按照实际离线环境配置修改节点信息。
- 按实际情况添加 **registry** 的相关信息。

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: ks-k8s-master-0, address: 192.168.9.91, internalAddress: 192.168.9.91, user: root, password: "F@ywwpTj4bJtYwzpwCqD"}
  - {name: ks-k8s-master-1, address: 192.168.9.92, internalAddress: 192.168.9.92, user: root, password: "F@ywwpTj4bJtYwzpwCqD"}
  - {name: ks-k8s-master-2, address: 192.168.9.93, internalAddress: 192.168.9.93, user: root, password: "F@ywwpTj4bJtYwzpwCqD"}
  roleGroups:
    etcd:
    - ks-k8s-master-0
    - ks-k8s-master-1
    - ks-k8s-master-2
    control-plane: 
    - ks-k8s-master-0
    - ks-k8s-master-1
    - ks-k8s-master-2
    worker:
    - ks-k8s-master-0
    - ks-k8s-master-1
    - ks-k8s-master-2
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    internalLoadbalancer: haproxy

    domain: lb.zdevops.com.cn
    address: ""
    port: 6443
  kubernetes:
    version: v1.24.1
    clusterName: zdevops.com.cn
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
  registry:
    type: "harbor"
    auths:
      "registry.zdevops.com.cn":
         username: admin
         password: Harbor12345
    privateRegistry: "registry.zdevops.com.cn"
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []

# 下面的内容不修改，不做展示
```

### 在 Harbor 中创建项目

本文采用提前部署好的 Harbor 来存放镜像，部署过程参考我之前写的[ 基于 KubeSphere 玩转 k8s-Harbor 安装手记](https://gitee.com/zdevops/z-notes/blob/main/k8s-on-kubesphere/10-%E5%9F%BA%E4%BA%8EKubeSphere%E7%8E%A9%E8%BD%ACk8s-Harbor%E5%AE%89%E8%A3%85%E6%89%8B%E8%AE%B0.md " 基于 KubeSphere 玩转 k8s-Harbor 安装手记")。

你可以使用 kk 工具自动部署 Harbor，具体参考[官方离线部署文档](https://kubesphere.com.cn/docs/v3.3/installing-on-linux/introduction/air-gapped-installation/ "官方离线部署文档")。

- 下载创建项目脚本模板

```shell
$ curl -O https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/create_project_harbor.sh
```

- 根据实际情况修改项目脚本

```shell
#!/usr/bin/env bash

# Harbor 仓库地址
url="https://registry.zdevops.com.cn"

# 访问 Harbor 仓库用户
user="admin"

# 访问 Harbor 仓库用户密码
passwd="Harbor12345"

# 需要创建的项目名列表，正常只需要创建一个**kubesphereio**即可，这里为了保留变量可扩展性多写了两个。
harbor_projects=(library
    kubesphereio
    kubesphere
)

for project in "${harbor_projects[@]}"; do
    echo "creating $project"
    curl -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}"
done
```

- 执行脚本创建项目

```shell
$ sh create_project_harbor.sh
```

### 推送离线镜像到 Harbor 仓库

将提前准备好的离线镜像推送到 Harbor 仓库，这一步为可选项，因为创建集群的时候也会再次推送镜像。为了部署一次成功率，建议先推送。

```shell
$ ./kk artifact image push -f config-sample.yaml -a  kubesphere-v3.3.0-artifact.tar.gz
```

### 创建集群并安装 OS 依赖

```shell
$ ./kk create cluster -f config-sample.yaml -a kubesphere-v3.3.0-artifact.tar.gz --with-packages
```

**参数说明**

- **config-sample.yaml**：离线环境集群的配置文件。
- **kubesphere-v3.3.0-artifact.tar.gz**：制品包的 tar 包镜像。
- **--with-packages**：若需要安装操作系统依赖，需指定该选项。

### 查看集群状态

```shell
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

正确安装完成后，您会看到以下内容：

```yaml
**************************************************
Collecting installation results ...
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.9.91:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After you log into the console, please check the
     monitoring status of service components in
     "Cluster Management". If any service is not
     ready, please wait patiently until all components 
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             2022-06-30 14:30:19
#####################################################
```

### 登录 Web 控制台

通过 `http://{IP}:30880` 使用默认帐户和密码 `admin/P@88w0rd` 访问 KubeSphere 的 Web 控制台，进行后续的操作配置。

![](https://kubesphere.com.cn/images/docs/v3.3/zh-cn/upgrade/air-gapped-upgrade-with-ks-installer/kubesphere-login.PNG)

## 总结

感谢您完整的阅读完本文，为此，您应该 Get 到了以下技能：

- 了解了清单 (manifest) 和制品 (artifact) 的概念
- 了解 manifest 和 image 资源的获取地址
- 手写 manifest 清单
- 根据 manifest 清单制作 artifact
- 离线部署 KubeSphere 和 Kubernetes
- Harbor 镜像仓库自动创建项目
- Ansible 使用的小技巧

目前为止，我们已经完成了最小化环境的 KubeSphere 和 K8s 集群的部署。但是，这仅仅是一个开始，后续还有很多配置和使用技巧，敬请期待 ...
