---
title: '使用 KubeKey 快速离线部署 KubeSphere 集群'
tag: 'KubeSphere, KubeKey'
keywords: 'Kubernetes, KubeSphere, KubeKey'
description: 'KubeKey 是一个用于部署 Kubernetes 集群的开源轻量级工具。KubeKey v2.0.0 版本新增了清单（manifest）和制品（artifact）的概念，为用户离线部署 Kubernetes 集群提供了一种解决方案。'
createTime: '2022-03-11'
author: '尹珉'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubekey-kubesphere-cluster.png'
---

## 一、KubeKey 介绍

KubeKey（以下简称 KK) 是一个用于部署 Kubernetes 集群的开源轻量级工具。它提供了一种灵活、快速、便捷的方式来仅安装 Kubernetes/K3s，或同时安装 Kubernetes/K3s 和 KubeSphere，以及其他云原生插件。除此之外，它也是扩展和升级集群的有效工具。

KubeKey v2.0.0 版本新增了清单（manifest）和制品（artifact）的概念，为用户离线部署 Kubernetes 集群提供了一种解决方案。在过去，用户需要准备部署工具，镜像 tar 包和其他相关的二进制文件，每位用户需要部署的 Kubernetes 版本和需要部署的镜像都是不同的。现在使用 KK，用户只需使用清单 manifest 文件来定义将要离线部署的集群环境需要的内容，再通过该 manifest 来导出制品 artifact 文件即可完成准备工作。离线部署时只需要 KK 和 artifact 就可快速、简单的在环境中部署镜像仓库和 Kubernetes 集群。

## 二、部署准备

### 1. 资源清单

| 名称   | 数量 | 用途         
| ------------  | ---- | ------ 
| KubeSphere 3.2.1 | 1 | 源集群打包使用 
| 服务器 | 2  | 离线环境部署使用 |   

### 2. 源集群中下载解压 KK 2.0.0-rc-3

说明：由于 KK 版本不断更新请按照 GitHub 上最新 Releases 版本为准

```bash
$ wget https://github.com/kubesphere/kubekey/releases/download/v2.0.0-rc.3/kubekey-v2.0.0-rc.3-linux-amd64.tar.gz
```
```bash
$ tar -zxvf kubekey-v2.0.0-rc.3-linux-amd64.tar.gz 
```

### 3. 源集群中使用 KK 创建 manifest

说明：manifest 就是一个描述当前 Kubernetes 集群信息和定义 artifact 制品中需要包含哪些内容的文本文件。目前有两种方式来生成该文件：

根据模板手动创建并编写该文件。
使用 KK 命令根据已存在的集群生成该文件。

```bash
$ ./kk create manifest
```

### 4. 源集群中修改 manifest 配置

说明：

1. reppostiory 部分需要指定服务器系统的依赖 iso 包，可以直接在 url 中填入对应下载地址或者提前下载 iso 包到本地在 localPath 里填写本地存放路径并删除 url 配置项即可

2. 开启 harbor、docker-compose 配置项，为后面通过 KK 自建 harbor 仓库推送镜像使用

3. 默认创建的 manifest 里面的镜像列表从 docker.io 获取，建议修改以下示例中的青云仓库中获取镜像

4. 可根据实际情况修改 manifest-sample.yaml 文件的内容，用以之后导出期望的 artifact 文件

```bash
$ vim manifest.yaml
```

```yaml
---
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
    repository:
      iso:
        localPath: /mnt/sdb/kk2.0-rc/kubekey/centos-7-amd64-rpms.iso
        url: #这里填写下载地址也可以
  kubernetesDistributions:
  - type: kubernetes
    version: v1.21.5
  components:
    helm:
      version: v3.6.3
    cni:
      version: v0.9.1
    etcd:
      version: v3.4.13
    ## For now, if your cluster container runtime is containerd, KubeKey will add a docker 20.10.8 container runtime in the below list.
    ## The reason is KubeKey creates a cluster with containerd by installing a docker first and making kubelet connect the socket file of containerd which docker contained.
    containerRuntimes:
    - type: docker
      version: 20.10.8
    crictl:
      version: v1.22.0
    ##
    # docker-registry:
    #   version: "2"
    harbor:
      version: v2.4.1
    docker-compose:
      version: v2.2.2
  images:
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.22.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.22.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.22.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.21.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.21.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.21.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.21.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.20.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.20.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.20.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.20.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.19.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.19.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.19.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.19.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.5
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.4.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.0
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
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.21.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.20.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kubefed:v0.8.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/tower:v0.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
  - registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
  - registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller:v4.0.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx-ingress-controller:v0.48.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/redis:5.0.14-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.0.25-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/alpine:3.14
  - registry.cn-beijing.aliyuncs.com/kubesphereio/openldap:1.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/netshoot:v1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cloudcore:v1.7.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/edge-watcher:v0.1.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/edge-watcher-agent:v0.1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/gatekeeper:v3.5.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-apiserver:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-controller:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:v3.2.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.2.0-2.249.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/jnlp-slave:3.27-1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-base:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-nodejs:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-python:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/builder-go:v3.2.0-podman
  - registry.cn-beijing.aliyuncs.com/kubesphereio/s2ioperator:v3.2.0
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
  - registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload:v0.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus:v2.26.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader:v0.43.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator:v0.43.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics:v1.9.7
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter:v0.18.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-prometheus-adapter-amd64:v0.6.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager:v0.21.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/thanos:v0.18.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/grafana:7.4.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy:v0.8.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator:v1.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager:v1.4.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar:v3.2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-curator:v5.7.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/elasticsearch-oss:6.7.0-1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator:v0.11.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/docker:19.03
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit:v1.8.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector:1.1
  - registry.cn-beijing.aliyuncs.com/kubesphereio/filebeat:6.7.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-operator:v0.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-exporter:v0.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-ruler:v0.3.0
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
  - registry.cn-beijing.aliyuncs.com/kubesphereio/nginx:1.14-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/wget:1.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/hello:plain-text
  - registry.cn-beijing.aliyuncs.com/kubesphereio/wordpress:4.8-apache
  - registry.cn-beijing.aliyuncs.com/kubesphereio/hpa-example:latest
  - registry.cn-beijing.aliyuncs.com/kubesphereio/java:openjdk-8-jre-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/fluentd:v1.4.2-2.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/perl:latest
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-productpage-v1:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-reviews-v1:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-reviews-v2:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-details-v1:1.16.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/examples-bookinfo-ratings-v1:1.16.3
  registry:
    auths: {}
```

### 5. 源集群中导出制品 artifact

说明：

制品就是一个根据指定的 manifest 文件内容导出的包含镜像 tar 包和相关二进制文件的 tgz 包。在 KK 初始化镜像仓库、创建集群、添加节点和升级集群的命令中均可指定一个 artifact，KK 将自动解包该 artifact 并将在执行命令时直接使用解包出来的文件。

注意：

1. 导出命令会从互联网中下载相应的二进制文件，请确保网络连接正常。

2. 导出命令会根据 manifest 文件中的镜像列表逐个拉取镜像，请确保 KK 的工作节点已安装 containerd 或最低版本为 18.09 的 docker。

3. KK 会解析镜像列表中的镜像名，若镜像名中的镜像仓库需要鉴权信息，可在 manifest 文件中的 .registry.auths 字段中进行配置。

4. 若需要导出的 artifact 文件中包含操作系统依赖文件（如：conntarck、chrony 等），可在 operationSystem 元素中的 .repostiory.iso.url 中配置相应的 ISO 依赖文件下载地址。

```bash
$ export KKZONE=cn
$ ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
#默认tar包的名字是kubekey-artifact.tar.gz，可通过-o参数自定义包名
```

## 三、离线环境安装集群

### 1. 离线环境下载 KK

```bash
$ wget https://github.com/kubesphere/kubekey/releases/download/v2.0.0-rc.3/kubekey-v2.0.0-rc.3-linux-amd64.tar.gz
```

### 2. 创建离线集群配置文件

```bash
$./kk create config --with-kubesphere v3.2.1 --with-kubernetes v1.22.10 -f config-sample.yaml
```

### 3. 修改配置文件

```bash
$ vim config-sample.yaml
```

说明：

1. 按照实际离线环境配置修改节点信息
2. 必须指定 registry 仓库部署节点（因为 KK 部署自建 harbor 仓库需要使用）
3. registry 里必须指定 type 类型为 harbor，不配 harbor 的话默认是装的 docker registry

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master, address: 192.168.149.133, internalAddress: 192.168.149.133, user: root, password: "Supaur@2022"}
  - {name: node1, address: 192.168.149.134, internalAddress: 192.168.149.134, user: root, password: "Supaur@2022"}

  roleGroups:
    etcd:
    - master
    control-plane:
    - master
    worker:
    - node1
    # 如需使用 kk 自动部署镜像仓库，请设置该主机组 （建议仓库与集群分离部署，减少相互影响）
    registry:
    - node1
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    # internalLoadbalancer: haproxy

    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.21.5
    clusterName: cluster.local
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  registry:
    # 如需使用 kk 部署 harbor, 可将该参数设置为 harbor，不设置该参数且需使用 kk 创建容器镜像仓库，将默认使用docker registry。
    type: harbor 
    # 如使用 kk 部署的 harbor 或其他需要登录的仓库，可设置对应仓库的auths，如使用 kk 创建的 docker registry 仓库，则无需配置该参数。
    # 注意：如使用 kk 部署 harbor，该参数请于 harbor 启动后设置。
    #auths:
    #  "dockerhub.kubekey.local":
    #    username: admin
    #    password: Harbor12345
    plainHTTP: false
    # 设置集群部署时使用的私有仓库
    privateRegistry: "dockerhub.kubekey.local"
    namespaceOverride: ""
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

### 4. 方式一：执行脚本创建 harbor 项目

**4.1 下载指定脚本初始化 harbor 仓库**

```bash
$ curl https://github.com/kubesphere/ks-installer/blob/master/scripts/create_project_harbor.sh
```

**4.2 修改脚本配置文件**

说明：
1. 修改 url 的值为 https://dockerhub.kubekey.local
2. 需要指定仓库项目名称和镜像列表的项目名称保持一致
3. 脚本末尾 curl 命令末尾加上 -k
```bash
$ vim create_project_harbor.sh
```
```yaml
#!/usr/bin/env bash

# Copyright 2018 The KubeSphere Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

url="https://dockerhub.kubekey.local"  #修改url的值为https://dockerhub.kubekey.local
user="admin"
passwd="Harbor12345"

harbor_projects=(library
    kubesphereio  #需要指定仓库项目名称和镜像列表的项目名称保持一致
)

for project in "${harbor_projects[@]}"; do
    echo "creating $project"
    curl -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}" -k #curl命令末尾加上 -k
done
```
```bash
$ chmod +x create_project_harbor.sh
```
```bash
$ ./create_project_harbor.sh
```

**4.3 方式二：登录 harbor 仓库创建项目**

![](https://pek3b.qingstor.com/kubesphere-community/images/26e4bc9c-ca26-4cca-95e7-76b906165de8.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/a95c6ebb-35a3-4418-8885-0971527ece72.png)

### 5. 使用 KK 安装镜像仓库

说明：
1. config-sample.yaml(离线环境集群的配置文件)
2. kubesphere.tar.gz（源集群打包出来的 tar 包镜像）
3. harbor 安装文件在 /opt/harbor , 如需运维 harbor，可至该目录下。
```bash
$ ./kk init registry -f config-sample.yaml -a kubesphere.tar.gz
```

### 6. 再次修改集群配置文件

说明：

1. 新增 auths 配置增加 dockerhub.kubekey.local、账号密码

2. privateRegistry 增加 dockerhub.kubekey.local

3. namespaceOverride 增加 kubesphereio（对应仓库里新建的项目）
```bash
$ vim config-sample.yaml
```

```yaml
  ...
  registry:
    type: harbor  
    auths: 
      "dockerhub.kubekey.local":
        username: admin
        password: Harbor12345
    plainHTTP: false
    privateRegistry: "dockerhub.kubekey.local"
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []

```

### 7. 安装 KubeSphere 集群

说明 :
1. config-sample.yaml（离线环境集群的配置文件）
2. kubesphere.tar.gz（源集群打包出来的 tar 包镜像）
3. 指定 K8s 版本、KubepShere 版本
4. --with-packages（必须添加否则 ios 依赖安装失败）

```bash
$ ./kk create cluster -f config-sample1.yaml -a kubesphere.tar.gz --with-kubernetes v1.21.5 --with-kubesphere v3.2.1 --with-packages
```

### 8. 查看集群集群状态

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```
```bash
**************************************************
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.149.133:30880
Account: admin
Password: P@88w0rd

NOTES：
1. After you log into the console, please check the
monitoring status of service components in
the "Cluster Management". If any service is not
ready, please wait patiently until all components
are up and running.
2. Please change the default password after login.

#####################################################
https://kubesphere.io             2022-02-28 23:30:06
#####################################################
```

### 9. 登录 KubeSphere 控制台

![](https://pek3b.qingstor.com/kubesphere-community/images/b1eb637e-8399-433a-b99b-00b8dd5a7bac.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/3b22511d-90c2-4e8a-aa92-83c363d2244b.png)

## 四、结尾

 本教程使用 KK 2.0.0 作为部署工具来实现 KubeSphere 集群在离线环境中的部署，当然 KK 也支持 kubernetes 的部署。希望 KK 能帮助大家实现离线闪电交付的目的。如果大家有好的想法和建议可以到 [Kubekey 仓库](https://github.com/kubesphere/kubekey)中提交 issue 帮助解决。