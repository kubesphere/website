---
title: '在 KubeSphere 上快速安装和使用 KDP 云原生数据平台'
tag: 'KubeSphere'
keywords: 'KubeSphere, KubeKey, Kubernetes, Kubernetes Data Platform'
description: 'KubeSphere 和 KDP 组合在一起，能够为用户提供一套完善的、强大的、基于 Kubernetes 的现代化云原生应用数据平台。未来，通过 KubeSphere 的 LuBan 集成框架，可以将 KDP 开发成为 KubeSphere 的扩展组件，从而进一步深度融合进 KubeSphere。'
createTime: '2024-06-18'
author: '金津'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kdp-on-kubesphere-cover.png'
---

> 作者简介：金津，智领云高级研发经理，华中科技大学计算机系硕士。加入智领云 8 余年，长期从事云原生、容器化编排领域研发工作，主导了智领云自研的 BDOS 应用云平台、云原生大数据平台 KDP 等产品的开发，并在多个大规模项目中成功实施落地，在大规模容器化编排系统方向有丰富的实践经验。

## 在 KubeSphere 上部署 KDP

GitHub 地址：https://github.com/linktimecloud/kubernetes-data-platform/blob/main/docs/zh/user-tutorials/install-kdp-on-kubesphere-101.md

### 技术简介

- [KubeKey](https://github.com/kubesphere/kubekey)

  KubeKey 是一个开源的 Kubernetes 安装程序和生命周期管理工具。它支持安装 Kubernetes 集群、KubeSphere 以及其他相关组件。

- [KubeSphere](https://github.com/kubesphere/kubesphere)

  KubeSphere 是一个用于云原生应用程序管理的分布式操作系统，使用 Kubernetes 作为其内核。它提供了即插即用架构，允许第三方应用程序无缝集成到其生态系统中。

- [Kubernetes Data Platform](https://www.linktimecloud.com/kubernetes-data-platform)

  KDP（Kubernetes Data Platform）提供了一个基于 Kubernetes 的现代化混合云原生数据平台，能够利用 Kubernetes 的云原生能力来有效地管理数据平台。KDP 是构建在 Kubernetes 之上的，因此可以与任意的 Kubernetes 管理平台快速集成。

总的来说，KubeSphere 和 KDP 组合在一起，能够为用户提供一套完善的、强大的、基于 Kubernetes 的现代化云原生应用数据平台。未来，通过 KubeSphere 的 LuBan 集成框架，可以将 KDP 开发成为 KubeSphere 的扩展组件，从而进一步深度融合进 KubeSphere。

### 先决条件

在 Kubernetes 上已安装 KubeSphere（[快速开始可参考在 Kubernetes 上最小化安装 KubeSphere](https://kubesphere.io/zh/docs/v3.4/quick-start/minimal-kubesphere-on-k8s/)）：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-cluster-overview.png)

KubeSphere 安装完成后，登录 KubeSphere Web 控制台并确保监控组件已启用：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-monitoring.png)

### 安装 KDP

假设您已经在一个 v1.26.x Kubernetes 集群上安装了 KubeSphere ，并开启了监控套件。

#### 安装 KDP 命令行工具

- 可选使用本地终端工具或 KubeSphere 网页终端进行操作：
  - 通过本地 Shell：打开您计算机上的 Bash 或 Zsh 终端。
  - 通过 [Web Kubectl](https://kubesphere.io/zh/docs/v3.4/toolbox/web-kubectl/)：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-web-kubectl.png)

- 在网页或本地终端中，请执行以下命令以安装 KDP 命令行工具（注：若使用网页终端，因其无状态特性，每次新建立会话都需要重新安装 KDP 命令行工具）：

```
# 下载 KDP CLI（设置环境变量'VERSION'为所需版本号）
export VERSION=v1.1.0
wget https://github.com/linktimecloud/kubernetes-data-platform/releases/download/${VERSION}/kdp-${VERSION}-linux-amd64.tar.gz
tar xzf kdp-${VERSION}-linux-amd64.tar.gz
mkdir -p ~/.local/bin
install -v ./linux-amd64/kdp ~/.local/bin
export PATH=$PATH:$HOME/.local/bin

kdp version
```

#### 安装 KDP 基础平台

执行以下命令以安装 KDP 基础平台：

```
# 注：请关注以下参数：
# - `openebs.enabled=false`：跳过 KDP 内置 OpenEBS hostpath provisioner 组件的安装
# - `storageConfig.storageClassMapping.localDisk=local`：使用 KubeSphere 上的内置 StorageClass，你也可以将 `local` 更改为其他现有的 SC
# - `prometheusCRD.enabled=false`：跳过 KDP 内置 Prometheus CRD 的安装
# - `prometheus.enabled=false`：跳过 KDP 内置 Prometheus Operator 的安装
# - `prometheus.externalUrl=http://prometheus-operated.kubesphere-monitoring-system.svc:9090`：使用 KubeSphere 上的内置 Prometheus 服务
kdp install \
--force-reinstall \
--set openebs.enabled=false \
--set storageConfig.storageClassMapping.localDisk=local \
--set prometheusCRD.enabled=false \
--set prometheus.enabled=false \
--set prometheus.externalUrl=http://prometheus-operated.kubesphere-monitoring-system.svc:9090
```

#### 访问 KDP UX

- 等待安装完成：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-kdp-install.png)

- 转到 KubeSphere Web 控制台，并在菜单 “应用负载” -> “应用路由” 中找到名为 'kdp-ux' 的应用路由对象：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-kdp-ux-ingress.png)

- 点击并进入'kdp-ux'应用路由的详细页面，然后点击路径'/'的'访问服务'按钮，KDP UX 将在新标签页中打开：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-kdp-ux-access-service.png)

- 您现在可以使用 KDP Web 控制台来建设自己的数据平台。有关使用数据组件的更多教程，请参考[教程目录](https://github.com/linktimecloud/kubernetes-data-platform/blob/main/docs/zh/user-tutorials/tutorials.md)：

![](https://pek3b.qingstor.com/kubesphere-community/images/kdp-ux-landing-page.png)

## 在 KDP 上快速交付 Kafka

KDP 提供开箱即用的开源 Kafka K8s 运行时，主要包括：Strimzi Kafka Operator、Kafka Cluster、Kafka Manager 等。用户通过 KDP 可以高效便捷地交付和运维 Kafka 套件，KDP 为数据组件运行时提供完善的生命周期管理以及监控、告警、日志的自动化集成。

### Kafka 简介

[Kafka](https://linktimecloud.github.io/kubernetes-data-platform/docs/zh/catalog-overview/Kafka/overview.html)，Apache Kafka 是一个分布式事件流平台。基于 Kafka，可以构建高吞吐量、高扩展性的消息中间件服务。适用于日志采集、流式数据处理、流量削峰填谷等场景。Kafka 具备高可靠、高并发访问、可扩展的特性是大数据生态系统中不可或缺的组成部分。

### 在 KDP 上部署 Kafka 套件

以下展示的是如何在 KDP 上快速交付 Kafka 套件：

1. 通过 KDP 应用目录安装 Kafka Operator 及 Kafka Cluster

![](https://pek3b.qingstor.com/kubesphere-community/images/kdp-kafka-install.jpg)

2. 部署过程中可以实时查看 Pod 日志

![](https://pek3b.qingstor.com/kubesphere-community/images/kdp-kafka-pod.jpg)

3. 待 ZK 集群与 Kakfa 集群所有 Pod 运行就绪

![](https://pek3b.qingstor.com/kubesphere-community/images/kdp-kafka-intall-1.jpg)

4. KDP 提供应用实例下所有底层 K8s 资源拓扑展示

![](https://pek3b.qingstor.com/kubesphere-community/images/kdp-kafka-install-2.jpg)

5. 待 Kafka Cluster 运行正常后，继续安装好 Kafka Manager；完成后，应用实例界面右上角可快速打开 Kafka Manager 的页面

![](https://pek3b.qingstor.com/kubesphere-community/images/kdp-kafka-install-3.jpg)

### 创建一个 Topic

以上我们已经在 KDP 上快速交付了一套 Kafka Cluster 以及 Kafka Manager（开源的 Kafka 界面管理工具），接下来我们基于 Kafka 界面管理工具来创建一个 Topic：

1. 进入 Kafka Manager 界面，可以看到已自动导入我们安装好的 Kafka Cluster

![](https://pek3b.qingstor.com/kubesphere-community/images/kafka-topic-1.jpg)

2. 在 Kafka Manager 界面上创建一个 topic "my-2nd-topic"

![](https://pek3b.qingstor.com/kubesphere-community/images/kafka-topic-2.jpg)

3. 完成后，在 Topic 列表中可以看到我们新建的 topic

![](https://pek3b.qingstor.com/kubesphere-community/images/kafka-topic-3.jpg)

4. 从 KDP 内置的监控面板上 topic 的指标数据中，我们也可以观测到 topic 数量从 1 变为了 2

![](https://pek3b.qingstor.com/kubesphere-community/images/kafka-topic-4.jpg)

## 相关链接

- 【教程文档】在 KubeSphere 上安装 KDP 101：
  https://linktimecloud.github.io/kubernetes-data-platform/docs/zh/user-tutorials/install-kdp-on-kubesphere-101.html

- 【教程文档】如何与 KDP 上的 Kafka 快速集成：
  https://linktimecloud.github.io/kubernetes-data-platform/docs/zh/user-tutorials/integration-kafka-with-int-ext-comps.html
