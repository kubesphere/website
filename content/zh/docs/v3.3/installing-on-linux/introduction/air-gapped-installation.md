---
title: "离线安装"
keywords: '离线, 安装, KubeSphere'
description: '了解如何在离线环境下安装 KubeSphere 和 Kubernetes。'

linkTitle: "离线安装"
weight: 3130
---

KubeKey 是一个用于部署 Kubernetes 集群的开源轻量级工具。它提供了一种灵活、快速、便捷的方式来仅安装 Kubernetes/K3s，或同时安装 Kubernetes/K3s 和 KubeSphere，以及其他云原生插件。除此之外，它也是扩展和升级集群的有效工具。

KubeKey v2.1.0 版本新增了清单（manifest）和制品（artifact）的概念，为用户离线部署 Kubernetes 集群提供了一种解决方案。manifest 是一个描述当前 Kubernetes 集群信息和定义 artifact 制品中需要包含哪些内容的文本文件。在过去，用户需要准备部署工具，镜像 tar 包和其他相关的二进制文件，每位用户需要部署的 Kubernetes 版本和需要部署的镜像都是不同的。现在使用 KubeKey，用户只需使用清单 manifest 文件来定义将要离线部署的集群环境需要的内容，再通过该 manifest 来导出制品 artifact 文件即可完成准备工作。离线部署时只需要 KubeKey 和 artifact 就可快速、简单的在环境中部署镜像仓库和 Kubernetes 集群。

## 前提条件

如果您要进行多节点安装，需要参考如下示例准备至少三台主机。

| 主机 IP   | 主机名称    | 角色            |
| ---------------- | ----   | ---------------- |
| 192.168.0.2 | node1    | 联网主机用于制作离线包 |
| 192.168.0.3 | node2    | 离线环境主节点 |
| 192.168.0.4 | node3    | 离线环境镜像仓库节点 |

## 部署准备

1. 执行以下命令下载 KubeKey v2.2.2 并解压：

   {{< tabs >}}

   {{< tab "如果您能正常访问 GitHub/Googleapis" >}}

   从 [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) 下载 KubeKey 或者直接运行以下命令。

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
   ```

   {{</ tab >}}

   {{< tab "如果您访问 GitHub/Googleapis 受限" >}}

   首先运行以下命令，以确保您从正确的区域下载 KubeKey。

   ```bash
   export KKZONE=cn
   ```

   运行以下命令来下载 KubeKey：

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
   ```
   {{</ tab >}}

   {{</ tabs >}}

2. 在联网主机上执行以下命令，并复制示例中的 manifest 内容。关于更多信息，请参阅 [manifest-example](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md)。
   
   ```bash
   vim manifest.yaml
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
           localPath:
           url: https://github.com/kubesphere/kubekey/releases/download/v2.2.2/centos7-rpms-amd64.iso
     - arch: amd64
       type: linux
       id: ubuntu
       version: "20.04"
       repository:
         iso:
           localPath:
           url: https://github.com/kubesphere/kubekey/releases/download/v2.2.2/ubuntu-20.04-debs-amd64.iso
     kubernetesDistributions:
     - type: kubernetes
       version: v1.22.10
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
         version: v1.24.0
       docker-registry:
         version: "2"
       harbor:
         version: v2.4.1
       docker-compose:
         version: v2.2.2
     images:
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.22.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.22.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.22.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.22.10
     - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.5
     - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.8.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.23.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.23.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.23.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.23.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/typha:v3.23.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel:v0.12.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:3.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.3
     - registry.cn-beijing.aliyuncs.com/kubesphereio/nfs-subdir-external-provisioner:v4.0.2
     - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.15.12
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer:v3.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver:v3.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console:v3.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager:v3.3.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.20.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.21.0
     - registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl:v1.22.0
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
     - registry.cn-beijing.aliyuncs.com/kubesphereio/scope:1.13.0
   ```
   
   {{< notice note >}}
   
   - 若需要导出的 artifact 文件中包含操作系统依赖文件（如：conntarck、chrony 等），可在 **operationSystem** 元素中的 **.repostiory.iso.url** 中配置相应的 ISO 依赖文件下载地址或者提前下载 ISO 包到本地在 **localPath** 里填写本地存放路径并删除 **url** 配置项。
   
   - 开启 **harbor** 和 **docker-compose** 配置项，为后面通过 KubeKey 自建 harbor 仓库推送镜像使用。
   
   - 默认创建的 manifest 里面的镜像列表从 **docker.io** 获取。
   
   - 可根据实际情况修改 **manifest-sample.yaml** 文件的内容，用于之后导出期望的 artifact 文件。
  
   - 您可以访问 https://github.com/kubesphere/kubekey/releases/tag/v2.2.2 下载 ISO 文件。
   
   {{</ notice >}}
   
3. （可选）如果您已经拥有集群，那么可以在已有集群中执行 KubeKey 命令生成 manifest 文件，并参照步骤 2 中的示例配置 manifest 文件内容。
   
   ```bash
   ./kk create manifest
   ```

4. 导出制品 artifact。
   
      {{< tabs >}}

   {{< tab "如果您能正常访问 GitHub/Googleapis" >}}

   执行以下命令：

   ```bash
   ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```

   {{</ tab >}}

   {{< tab "如果您访问 GitHub/Googleapis 受限" >}}

   依次运行以下命令：

   ```bash
   export KKZONE=cn

   ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```

   {{</ tab >}}

   {{</ tabs >}}

   {{< notice note >}}

   制品（artifact）是一个根据指定的 manifest 文件内容导出的包含镜像 tar 包和相关二进制文件的 tgz 包。在 KubeKey 初始化镜像仓库、创建集群、添加节点和升级集群的命令中均可指定一个 artifact，KubeKey 将自动解包该 artifact 并在执行命令时直接使用解包出来的文件。

   - 导出时请确保网络连接正常。

   - KubeKey 会解析镜像列表中的镜像名，若镜像名中的镜像仓库需要鉴权信息，可在 manifest 文件中的 **.registry.auths** 字段中进行配置。

   {{</ notice >}}

## 离线安装集群

1. 将下载的 KubeKey 和制品 artifact 通过 U 盘等介质拷贝至离线环境安装节点。

2. 执行以下命令创建离线集群配置文件：

   ```bash
   ./kk create config --with-kubesphere v3.3.0 --with-kubernetes v1.22.10 -f config-sample.yaml
   ```

3. 执行以下命令修改配置文件：

   ```bash
   vim config-sample.yaml
   ```

   {{< notice note >}}

   - 按照实际离线环境配置修改节点信息。
   - 必须指定 `registry` 仓库部署节点（用于 KubeKey 部署自建 Harbor 仓库）。
   - `registry` 里必须指定 `type` 类型为 `harbor`，否则默认安装 docker registry。
   
   {{</ notice >}}

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha2
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: "<REPLACE_WITH_YOUR_ACTUAL_PASSWORD>"}
     - {name: node1, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: "<REPLACE_WITH_YOUR_ACTUAL_PASSWORD>"}
   
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
       version: v1.22.10
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
       # 设置集群部署时使用的私有仓库
       privateRegistry: ""
       namespaceOverride: ""
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```
   
4. 执行以下命令安装镜像仓库：

   ```bash
   ./kk init registry -f config-sample.yaml -a kubesphere.tar.gz
   ```

   {{< notice note >}}

   命令中的参数解释如下：

   - **config-sample.yaml** 指离线环境集群的配置文件。

   - **kubesphere.tar.gz** 指源集群打包出来的 tar 包镜像。
   
    {{</ notice >}}

5. 创建 Harbor 项目。
   
   {{< notice note >}}

   由于 Harbor 项目存在访问控制（RBAC）的限制，即只有指定角色的用户才能执行某些操作。如果您未创建项目，则镜像不能被推送到 Harbor。Harbor 中有两种类型的项目：

   - 公共项目（Public）：任何用户都可以从这个项目中拉取镜像。
   - 私有项目（Private）：只有作为项目成员的用户可以拉取镜像。

   Harbor 管理员账号：**admin**，密码：**Harbor12345**。Harbor 安装文件在 **/opt/harbor**, 如需运维 Harbor，可至该目录下。

    {{</ notice >}}

   方法 1：执行脚本创建 Harbor 项目。

   a. 执行以下命令下载指定脚本初始化 Harbor 仓库：

      ```bash
      curl -O https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/create_project_harbor.sh
      ```

   b. 执行以下命令修改脚本配置文件：

      ```bash
      vim create_project_harbor.sh
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
          kubesphereio
          kubesphere
          calico
          coredns
          openebs
          csiplugin
          minio
          mirrorgooglecontainers
          osixia
          prom
          thanosio
          jimmidyson
          grafana
          elastic
          istio
          jaegertracing
          jenkins
          weaveworks
          openpitrix
          joosthofman
          nginxdemos
          fluent
          kubeedge
      )
      
      for project in "${harbor_projects[@]}"; do
          echo "creating $project"
          curl -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}" -k #curl命令末尾加上 -k
      done
      
      ```

   {{< notice note >}}

   - 修改 **url** 的值为 **https://dockerhub.kubekey.local**。

   - 需要指定仓库项目名称和镜像列表的项目名称保持一致。

   - 脚本末尾 `curl` 命令末尾加上 `-k`。

  {{</ notice >}}

   c. 执行以下命令创建 Harbor 项目：

      ```bash
      chmod +x create_project_harbor.sh
      ```
       
      ```bash
      ./create_project_harbor.sh
      ```

   方法 2：登录 Harbor 仓库创建项目。将项目设置为**公开**以便所有用户都能够拉取镜像。关于如何创建项目，请参阅[创建项目](https://goharbor.io/docs/1.10/working-with-projects/create-projects/)。

   ![harbor-login-7](/images/docs/v3.3/zh-cn/appstore/built-in-apps/deploy-harbor-on-ks/harbor-login-7.PNG)

6. 再次执行以下命令修改集群配置文件：

   ```bash
   vim config-sample.yaml
   ```

   ```yaml
     ...
     registry:
       type: harbor
       auths:
         "dockerhub.kubekey.local":
           username: admin
           password: Harbor12345
       privateRegistry: "dockerhub.kubekey.local"
       namespaceOverride: "kubesphereio"
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```

   {{< notice note >}}

   - 新增 **auths** 配置增加 **dockerhub.kubekey.local** 和账号密码。
   - **privateRegistry** 增加 **dockerhub.kubekey.local**。
   - **namespaceOverride** 增加 **kubesphereio**。

    {{</ notice >}}

7. 执行以下命令安装 KubeSphere 集群:

   ```bash
   ./kk create cluster -f config-sample.yaml -a kubesphere.tar.gz --with-packages
   ```

   参数解释如下：

   - **config-sample.yaml**：离线环境的配置文件。
   - **kubesphere.tar.gz**：打包的 tar 包镜像。
   - **--with-packages**：若需要安装操作系统依赖，需指定该选项。

8. 执行以下命令查看集群状态：

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```
   安装完成后，您会看到以下内容：

      ```bash
      **************************************************
      #####################################################
      ###              Welcome to KubeSphere!           ###
      #####################################################
      
      Console: http://192.168.0.3:30880
      Account: admin
      Password: P@88w0rd
      
      NOTES：
      1. After you log into the console, please check the
      monitoring status of service components in
      the "Cluster Management". If any service is not
      ready, please wait patiently until all components
      are up and running.
      1. Please change the default password after login.
      
      #####################################################
      https://kubesphere.io             2022-02-28 23:30:06
      #####################################################
      ```

9. 通过 `http://{IP}:30880` 使用默认帐户和密码 `admin/P@88w0rd` 访问 KubeSphere 的 Web 控制台。

   ![kubesphere-login](/images/docs/v3.3/zh-cn/upgrade/air-gapped-upgrade-with-ks-installer/kubesphere-login.PNG)


   {{< notice note >}}

   要访问控制台，请确保在您的安全组中打开端口 30880。

   {{</ notice >}}
