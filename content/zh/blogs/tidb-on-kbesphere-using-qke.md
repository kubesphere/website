---
title: 'KubeSphere 部署 TiDB 云原生分布式数据库'
tag: 'TiDB, Kubernetes, KubeSphere, TiKV, prometheus'
createTime: '2020-10-29'
author: 'Will, FeynmanZhou, Yaqiong Liu'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/20201028212049.png'
---

![KubeSphere 部署 TiDB 云原生数据库](https://ap3.qingstor.com/kubesphere-website/docs/20201028212049.png)

## TiDB 简介

[TiDB](https://pingcap.com/)  是 PingCAP 公司自主设计、研发的开源分布式关系型数据库，具备水平扩容或者缩容、金融级高可用、实时 HTAP、云原生的分布式数据库、兼容 MySQL 5.7 协议和 MySQL 生态等重要特性。TiDB 适合高可用、强一致要求较高、数据规模较大等各种应用场景。

![TiDB 架构](https://img-blog.csdnimg.cn/20201009174139735.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)


## KubeSphere 简介

[KubeSphere](https://kubesphere.io) 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。

![KubeSphere 架构](https://img-blog.csdnimg.cn/20201009114300360.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

## 部署环境准备

KubeSphere 是由青云 QingCloud 开源的容器平台，**支持在任何基础设施上安装部署**。在青云公有云上支持一键部署 KubeSphere（QKE）。

下面以在青云云平台快速启用 KubeSphere 容器平台为例部署 TiDB 分布式数据库，至少需要准备 3 个可调度的 node 节点。你也可以在任何 Kubernetes 集群或 Linux 系统上安装 KubeSphere，可以参考 [KubeSphere 官方文档](https://kubesphere.io/docs)。

1. 登录青云控制台：[https://console.qingcloud.com/](https://console.qingcloud.com/)，点击左侧容器平台，选择 KubeSphere，点击创建并选择合适的集群规格：

![青云控制台](https://img-blog.csdnimg.cn/20201021141612520.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

2. 创建完成后登录到 KubeSphere 平台界面：

![KubeSphere 平台界面](https://img-blog.csdnimg.cn/20201021141829490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

3. 点击下方的 Web Kubectl 集群客户端命令行工具，连接到 Kubectl 命令行界面。执行以下命令安装 TiDB Operator CRD：

```shell
kubectl apply -f https://raw.githubusercontent.com/pingcap/TiDB-Operator/v1.1.6/manifests/crd.yaml
```

4. 执行后的返回结果如下：

![Kubectl 命令行界面](https://img-blog.csdnimg.cn/20201021135918671.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

5. 点击左上角平台管理，选择访问控制，新建企业空间，这里命名为 `dev-workspace`

![新建企业空间](https://img-blog.csdnimg.cn/20201021142624329.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

6. 进入企业空间，选择应用仓库，添加一个 TiDB 的应用仓库：

![添加 TiDB 应用仓库](https://img-blog.csdnimg.cn/20201021142542666.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

7. 将 PingCap 官方 Helm 仓库添加到 KubeSphere 容器平台，Helm 仓库地址如下：

```shell
https://charts.pingcap.org
```

8. 添加方式如下：

![添加 TiDB 应用仓库](https://img-blog.csdnimg.cn/20201021134913421.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

## 部署 TiDB-Operator

1. 首选创建一个项目（Namespace）用于运行 TiDB 集群：

![部署 TiDB-Operator](https://img-blog.csdnimg.cn/20201021143057236.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

2. 创建完成后点击进入项目，选择应用，部署新应用

![部署新应用](https://img-blog.csdnimg.cn/20201021135137139.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

3. 选择来自应用模板:

![应用模板](https://img-blog.csdnimg.cn/20201021135207728.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)


4. 选择 `pingcap`，该仓库包含了多个 helm chart，当前主要部署 `TiDB-Operator` 和`tidb-cluster`。

![helm chart 列表](https://img-blog.csdnimg.cn/20201021135250409.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

5. 点击 `TiDB-Operator` 进入 Chart 详情页，点击配置文件可查看或下载默认的 `values.yaml`，选择版本，点击部署：

![TiDB-Operator](https://img-blog.csdnimg.cn/20201021135500759.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

6. 配置应用名称并选择应用版本，确认应用部署位置：

![选择应用版本](https://img-blog.csdnimg.cn/20201021143548288.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

7. 继续下一步，该步骤可以在界面直接编辑 `values.yaml` 文件，自定义配置，当前保留默认即可：

![自定义配置](https://img-blog.csdnimg.cn/20201021155659776.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

8. 点击部署，等待应用状态变为活跃：

![点击部署](https://img-blog.csdnimg.cn/20201021144208203.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

9. 点击工作负载（Deployment），查看 TiDB-Operator 部署了 2 个 Deployment 类型资源：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021144428861.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)


## 部署 TiDB-Cluster

1. TiDB-Operator 部署完成后，可以继续部署 TiDB-Cluster。与部署 TiDB-Operator 操作相同，选择左侧应用，点击 tidb-cluster：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102114485069.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

2. 切换到配置文件，选择版本，下载 `values.yaml`到本地：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021145047551.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

3. TiDB Cluster 中部分组件需要持久存储卷，青云公有云平台提供了以下几种类型的 StorageClass：

```shell
/ # kubectl get sc
NAME                       PROVISIONER     RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
csi-high-capacity-legacy   csi-qingcloud   Delete          Immediate           true                   101m
csi-high-perf              csi-qingcloud   Delete          Immediate           true                   101m
csi-ssd-enterprise         csi-qingcloud   Delete          Immediate           true                   101m
csi-standard (default)     csi-qingcloud   Delete          Immediate           true                   101m
csi-super-high-perf        csi-qingcloud   Delete          Immediate           true                   101m
```

4. 这里选择 csi-standard 类型，`values.yaml` 中的 `StorageClassName` 字段默认配置为 `local-storage`。因此，在下载的 yaml 文件中直接替换所有的 `local-storage` 字段为 `csi-standard`。在最后一步使用修改后的 `values.yaml` 覆盖应用配置文本框中的内容，当然也可以手动编辑配置文件逐个替换：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021150227375.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

5. 这里仅修改 `storageClassName` 字段用于引用外部持久存储，如果需要将 tidb、tikv或 pd 组件调度到独立节点，可参考 nodeAffinity 相关参数进行修改。点击部署，将 tidb cluster 部署到容器平台，最终在应用列表中可以看到如下 2 个应用：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102115160112.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

## 查看 TiDB 集群监控

1. TiDB 集群部署后需要一定时间完成初始化，选择工作负载，查看 Deployment 无状态应用：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021171721767.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

2. 查看有状态副本集（StatefulSets），其中 tidb、tikv 和 pd 等组件都为有状态应用：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021171835933.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

3. 在 KubeSphere 监控面板查看 tidb 负载情况，可以看到 CPU、内存、网络流出速率有明显的变化：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021181558512.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

4. 在 KubeSphere 监控面板查看 TiKV 负载情况：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021181748179.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)


5. 查看容器组（Pod）列表，tidb 集群包含了 3 个 pd、2 个 tidb 以及 3 个 tikv 组件：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021172214224.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

6. 点击存储管理，查看存储卷，其中 tikv 和 pd 这 2 个组件使用了持久化存储：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021172410550.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

7. 查看某个存储卷用量信息，以 tikv 为例，可以看到当前存储的存储容量和剩余容量等监控数据。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021182459718.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

8. 在 KubeSphere 项目首页查看 tidb-cluster 项目中资源用量排行：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021181333285.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

## 访问 TiDB 集群

1. 点击左侧服务，查看 TiDB 集群创建和暴露的服务信息。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021172333327.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)

2. 其中 TiDB 服务 4000 端口绑定的服务类型为nodeport，直接可以在集群外通过 nodeIP 访问。测试使用 MySQL 客户端连接数据库。

```shell
[root@k8s-master1 ~]# docker run -it --rm mysql bash

[root@0d7cf9d2173e:/# mysql -h 192.168.1.102 -P 32682 -u root    
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 201
Server version: 5.7.25-TiDB-v4.0.6 TiDB Server (Apache License 2.0) Community Edition, MySQL 5.7 compatible

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| INFORMATION_SCHEMA |
| METRICS_SCHEMA     |
| PERFORMANCE_SCHEMA |
| mysql              |
| test               |
+--------------------+
5 rows in set (0.01 sec)

mysql> 
```

## 查看 Grafana 监控面板

另外，TiDB 自带了 Prometheus 和 Grafana，用于数据库集群的性能监控，可以看到Grafana 界面的 Serivce 3000 端口同样绑定了 NodePort 端口。访问 Grafana UI，查看某个指标：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201010150223220.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25ldHdvcmtlbg==,size_16,color_FFFFFF,t_70#pic_center)


## 总结

KubeSphere 容器平台对于云原生应用部署非常友好，对于还不熟悉 Kubernetes 的应用开发者而又希望通过在界面简单配置完成 TiDB 集群的部署，可以参考以上步骤快速上手。我们将在下一期的文章中，为大家分享另一种部署玩法：将 TiDB 应用上架到 KubeSphere 应用商店实现真正的一键部署。

另外，TiDB 还可以结合 KubeSphere 的多集群联邦功能，部署 TiDB 应用时可一键分发 TiDB 不同的组件副本到不同基础设施环境的多个 Kubernetes 集群，实现跨集群、跨区域的高可用。如果大家感兴趣，我们将在后续的文章中为大家分享 TiDB 在 KubeSphere 实现多集群联邦的混合云部署架构。

## 参考

**KubeSphere GitHub**: https://github.com/kubesphere/kubesphere 

**TiDB GitHub**: https://github.com/pingcap/TiDB

**TiDB Operator 快速入门**: https://github.com/pingcap/docs-TiDB-Operator/blob/master/zh/get-started.md

**TiDB-Operator 文档**: https://docs.pingcap.com/tidb-in-kubernetes/stable/TiDB-Operator-overview

**KubeSphere Introduction**: https://kubesphere.io/docs/introduction/what-is-kubesphere/

**KubeSphere Documentation**: https://kubesphere.io/docs/
