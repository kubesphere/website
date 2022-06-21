---
title: '在 KubeSphere 上部署 Apache Pulsar'
tag: 'Kubernetes'
keywords: 'Kubernetes, KubeSphere, Apache Pulsar '
description: '本文主要描写了在 KubeSphere Console 中添加 Pulsar 的 Helm 仓库并安装的过程。'
createTime: '2022-06-16'
author: '徐文涛'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/pulsar-on-kubesphere-cover.png'
---

> 作者介绍：徐文涛，StreamNative Content Strategist，热爱云原生与开源技术，活跃于本地化/文档/技术博客贡献，持有 K8s CKA/CKAD/CKS 认证。

## Apache Pulsar 介绍

Apache Pulsar 作为 Apache 软件基金会顶级项目，是下一代云原生分布式消息流平台，集消息、存储、轻量化函数式计算为一体，采用计算与存储分离架构设计，支持多租户、持久化存储、跨地域复制、分层存储，具有强一致性、高吞吐、低延时及高可扩展性等流数据存储特性，是云原生时代解决实时消息流数据传输、存储和计算的最佳解决方案。

Pulsar 的 Broker 没有状态，不存储数据。BookKeeper 负责存储数据，其中的 Bookie 支持水平扩容，元数据的信息存储在 ZooKeeper 上。这种架构也方便容器化的环境进行扩缩容，支持高可用等场景。

![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-1.png)

## KubeSphere 介绍

KubeSphere 是建立在 Kubernetes 之上的面向云原生应用的分布式操作系统，完全开源，支持多云与多集群管理、应用商店、可观测性（监控、告警及审计等）和多租户等功能，提供全栈的 IT 自动化运维能力，简化企业的 DevOps 工作流。

![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-2.jpg)

## 在 KubeSphere 上安装 Apache Pulsar

作为一个以应用为中心的 K8s 容器平台，KubeSphere 为用户提供多种安装应用的方式。为快速部署应用，这里给大家推荐以下两种方法：

- 直接从 KubeSphere 的应用商店中安装 Pulsar。KubeSphere 从 3.2.0 版本开始便新增了“动态加载应用商店”的功能。想要贡献应用的小伙伴可以直接向 KubeSphere 的 [Helm 仓库](https://github.com/kubesphere/helm-charts)贡献应用的 Helm Chart，待 PR 审核通过后应用商店上会加载最新的应用列表。
- 添加 Apache Pulsar 的 Helm 仓库至 KubeSphere 的应用仓库，然后从应用仓库中安装 Pulsar 应用模板。此安装方式类似在命令行使用 `helm` 相关命令添加仓库并安装。

> 注：KubeSphere 的应用商店与应用的全生命周期管理功能基于开源项目 [OpenPitrix](https://github.com/openpitrix/openpitrix)。在安装 Pulsar 前，你需要先[在 KubeSphere 中启用 OpenPitrix](https://kubesphere.com.cn/docs/pluggable-components/app-store/)。

下面我们通过第二种方式在 KubeSphere Console 中添加 Pulsar 的 Helm 仓库并安装。

1. 准备一个 KubeSphere 集群。你可以直接[使用 KubeKey 安装](https://kubesphere.com.cn/docs/installing-on-linux/introduction/multioverview/)或通过 ks-installer [在已有 K8s 集群上搭建 KubeSphere 集群](https://kubesphere.com.cn/docs/installing-on-kubernetes/introduction/overview/)。同时，请注意 Pulsar 文档中对 K8s 集群和 Helm 的[版本要求](https://pulsar.apache.org/docs/next/getting-started-helm#prerequisite)。
2. 创建好企业空间和项目。企业空间是 KubeSphere 中的一种逻辑单元，用于管理项目、DevOps 项目和应用模板等资源，管理员可以管理其中的资源访问权限；项目指 K8s 中的 Namespace。为方便演示，本文统一采用 `admin` 用户操作。基于 KubeSphere 的多租户体系，在实际环境中你可以根据组织中每个租户的职责，创建不同的帐户并分配相应角色。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-3.png)
3. 在你的企业空间空间下，点击应用管理 > 应用仓库，然后点击添加。定义仓库名称后，添加 `https://pulsar.apache.org/charts` 仓库地址。仓库地址验证成功后，点击确定。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-4.png)
4. 仓库添加成功后，我们还需要运行一个脚本，创建一些和 Pulsar 相关的 Secret 等资源，方便我们后续访问 Grafana 和 Pulsar Manager 等工具。先前往你的 K8s 节点，执行以下命令将 pulsar-helm-chart 的 GitHub 仓库克隆到本地。需要注意的是，在该节点上必须要可以执行 `kubectl` 和 `helm` 命令。

   ```
   git clone https://github.com/apache/pulsar-helm-chart
   cd pulsar-helm-chart
   ```
5. 执行以下命令运行 `prepare_helm_release.sh` 脚本。其中 -n 指相关的 Secret 生成的 Namespace，-k 指使用 `helm` 安装应用的 release 名称，这两个地方需要和我们在 KubeSphere 上指定的项目和应用名称相对应。有关该脚本可用参数的更多信息，可运行 `./scripts/pulsar/prepare_helm_release.sh --help` 查看详情。

   ```
   ./scripts/pulsar/prepare_helm_release.sh -n pulsar -k ks-pulsar
   ```

6. 前往 KubeSphere 中所创建的项目，本示例中的项目名为 `pulsar`。
7. 点击应用负载 > 应用，在基于模板的应用标签页下，点击创建。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-5.png)
8. 选择从应用模板，在应用模板的下拉列表中选中 Pulsar 的仓库。点击 Pulsar 后，我们可以在这里查看 Chart 文件的一些信息。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-6.png)
9. 点击安装。定义应用名称（即刚才执行脚本时的 release 名称），选择版本以及安装位置（如果启用多集群功能并添加了多个集群，这里还可以选择 Pulsar 安装的所在集群），点击下一步。
10. 转到应用设置页面，这里类似于使用 `helm` 命令时自定义 values.yaml 文件的各项参数。我们设置 `namespace` 为项目名称，`initialize` 为 `true`（仅首次安装 Pulsar 时需要设置），并启用 Pulsar Manager（设置 `components.pulsar_manager` 为 `true`），然后点击安装。有关这些参数更具体的信息，可参考 [Pulsar 文档](https://pulsar.apache.org/docs/next/helm-deploy)。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-7.png)
11. 等待一段时间后，查看 Pulsar 的各项组件是否已正常运行。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-8.png)
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-9.png)

## 使用 Pulsar Manager 创建 Tenant、Namespace 以及 Topic

Pulsar 集群搭建好后，我们可以使用 Web 工具 Pulsar Manager 来管理 Pulsar 中的租户（Tenant）、命名空间（Namespace）以及主题（Topic）。这些资源可用来确保同一个组织中不同部门间数据的相互隔离，如下图所示。

![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-10.png)

1. 前往应用负载 > 服务，进入暴露 Pulsar Manager 的 Service 的详情页面，并根据其中 LoadBalancer 类型的 IP 地址加端口号访问 Pulsar Manager。这里注意，根据部署环境的不同你可能还需要配置相应的防火墙或端口转发规则。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-11.png)
2. 通过默认帐号密码 `pulsar/pulsar` 登录，然后添加环境。Service URL 这里填 Broker 的 Service 地址与端口号，本示例中为 http://ks-pulsar-broker:8080。
    ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-12.png)
3. 进入 Pulsar Manager 的 Dashboard 后，在不同菜单下分别添加 Tenant、Namespace 以及 Topic。定义 Topic 时我们需要选择该 Topic 的类型（持久化或非持久化），并指定 Topic 下的分区（Partition）数量。在 Pulsar 中，Topic 的格式为：\{persistent | non-persistent}://tenant/namespace/topic。我们需要先记录下这些信息，后面向该 Topic 发送信息时会用到。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-13.png)
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-14.png)

## 向 Pulsar 集群发送信息并消费

现在我们创建好了相关资源，可以尝试向 Pulsar 集群发送信息并消费。

1. 在本地先下载好 [Pulsar 的二进制文件](https://pulsar.apache.org/download/)，然后解压。
2. 进入 Pulsar 目录后修改 conf/client.conf 文件中的 webServiceUrl 和 brokerServiceUrl 地址，用于将 Pulsar 客户端和 Pulsar 集群绑定。本示例中启用了代理访问集群，这里的地址需要填代理所暴露的 IP 地址。我们可以在 KubeSphere 的服务页面找到代理的 Service，并查看其详情页面中的 IP 地址。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-15.png)
   ```
   webServiceUrl=http://34.71.201.104:8080
   brokerServiceUrl=pulsar://34.71.201.104:6650
   ```
3. 修改完后，在 Pulsar 目录下执行以下命令创建订阅并消费信息，命令中的 `kubesphere/kubesphere/kubesphere` 对应刚才在 Pulsar Manager 中所创建的 Tenant、Namespace 以及 Topic。

   ```
   ./bin/pulsar-client consume -s sub kubesphere/kubesphere/kubesphere -n 0
   ```

注意：运行前请务必确保已安装[适用的 Java JRE/JDK 版本](https://github.com/apache/pulsar/blob/master/README.md#pulsar-runtime-java-version-recommendation)。

4. 再打开一个命令行窗口，执行以下命令生产信息。

   ```
   ./bin/pulsar-client produce kubesphere/kubesphere/kubesphere -m “Hello KubeSphere and Pulsar” -n 10
   ```

5. 可以看到消息已经成功消费。
   ![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-16.png)

## 通过 Grafana 监控 Pulsar 指标

Pulsar 的 Helm Chart 在部署时会安装 Grafana 提供与 Pulsar 相关的可观测性指标，便于我们进行后续的运维分析。

1. 与访问 Pulsar Manager 类似，前往应用负载 > 服务，进入暴露 Grafana 的 Service 的详情页面，并根据其中 LoadBalancer 类型的 IP 地址加端口号访问 Grafana。
2. 通过默认帐号密码 `pulsar/pulsar` 登录。在左上角选择一个 Dashboard 以查看 Pulsar 相关指标。
3. 可以看到相关数据成功显示在 Grafana 上。

![](https://pek3b.qingstor.com/kubesphere-community/images/pulsar-kubesphere-17.png)

## 总结

本文演示了在 KubeSphere 上部署 Apache Pulsar 的操作步骤。借助 Pulsar 天然适配云原生环境的特性，我们可以借助 KubeSphere 运维友好的操作界面轻松部署并管理 Pulsar。感兴趣的朋友可以阅读 [KubeSphere](https://kubesphere.com.cn/docs/) 和 [Pulsar](https://pulsar.apache.org/docs/next/) 的官方文档了解更多信息。

