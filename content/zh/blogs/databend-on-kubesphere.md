---
title: '在 KubeSphere 中开启新一代云原生数仓 Databend'
tag: 'KubeSphere'
keywords: 'Databend, KubeSphere, 云原生数仓, Kubernetes'
description: '本文将会介绍如何使用 KubeSphere 创建和部署 Databend 高可用集群，并使用 QingStor 作为底层存储服务。'
createTime: '2023-03-09'
author: '尚卓燃'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/databend-kubesphere-cover.png'
---

> 作者：尚卓燃（ https://github.com/PsiACE ），Databend 研发工程师，Apache OpenDAL (Incubating) PPMC。

## 前言

Databend 是一款完全面向云对象存储的新一代云原生数据仓库，专为弹性和高效设计，为您的大规模分析需求保驾护航。Databend 同时是一款符合 Apache-2.0 协议的开源软件，除了访问云服务（ https://app.databend.com/ ）之外，用户还可以自己部署 Databend 生产集群以满足工作负载需要。 

Databend 的典型使用场景包括：

* 实时分析平台，日志的快速查询与可视化。
* 云数据仓库，历史订单数据的多维度分析和报表生成。
* 混合云架构，统一管理和处理不同来源和格式的数据。
* 成本和性能敏感的 OLAP 场景，动态调整存储和计算资源。

KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，可以管理多个节点上的容器化应用，提供高可用性、弹性扩缩容、服务发现、负载均衡等功能。

利用 KubeSphere 部署和管理 Databend 具有以下优点：

* 使用 Helm Charts 部署 Databend 集群，简化应用管理、部署过程和参数设置。
* 利用 Kubernetes 的特性来实现 Databend 集群的自动恢复、水平扩展、负载均衡等。
* 与 Kubernetes 上的其他服务或应用轻松集成和交互，如 MinIO、Prometheus、Grafana 等。

**本文将会介绍如何使用 KubeSphere 创建和部署 Databend 高可用集群，并使用 QingStor 作为底层存储服务。**

## 配置对象存储

对象存储是一种存储模型，它把数据作为对象来管理和访问，而不是文件或块。对象存储的优点包括：可扩展性、低成本、高可用性等。

Databend 完全面向对象存储而设计，在减少复杂性和成本的同时提高灵活性和效率。Databend 支持多种对象存储服务，如 AWS S3、Azure Blob、Google Cloud Storage、HDFS、Alibaba Cloud OSS、Tencent Cloud COS 等。您可以根据业务的需求和偏好选择合适的服务来存放你的数据。

这里我们以青云 QingStor 为例，介绍与 S3 兼容的对象存储相关配置的预先准备工作。

### 创建 Bucket

> 对象存储服务（QingStor）提供了一个无限容量的在线文件存储和访问平台。每个用户可创建多个存储空间（Bucket）；您可以将任意类型文件通过控制台或 QingStor API 上传至一个存储空间（Bucket）中；存储空间（Bucket）支持访问控制，您可以将自己的存储空间（Bucket）开放给指定的用户，或所有用户。

登录青云控制台，选中对象存储服务，新建用于验证的 bucket 。

需要关注的是 bucket 的名字 `<bucket>` 和其所在的可用区 `<region>`。

由于这里使用 s3 兼容服务，所以最后连接的 endpoint_url 是 `s3.<bucket>.<region>.qingstor.com` 。

### 创建 API 密钥

> API 密钥（Access Key）可以让您通过发送 API 指令来访问青云的服务。API 密钥 ID 须作为参数包含在每一个请求中发送；而 API 密钥的私钥负责生成 API 请求串的签名，私钥需要被妥善保管，切勿外传。默认所有 IP 地址都可使用此密钥调用 API，设置 IP 白名单后只有白名单范围内的 IP  地址才可使用此密钥。

点击右上方菜单，选中 API 密钥，创建新的密钥用于 API 访问。

下载文件中的 `qy_access_key_id` 对应 `access_key_id` ，`qy_secret_access_key` 对应 `secret_access_key` 。

## 准备 KubeSphere 环境

[KubeSphere](https://github.com/kubesphere/kubesphere)（https://kubesphere.io）是在 Kubernetes 之上构建的开源容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 已被海内外数万家企业采用。此外， KubeSphere 还拥有极为开放的生态，KubeSphere 在 OpenPitrix 的基础上，为用户提供了一个基于 Helm 的应用商店，用于应用生命周期管理。KubeSphere 应用商店让 ISV、开发者和用户能够在一站式服务中只需点击几下就可以上传、测试、安装和发布应用。目前 Databend 已入驻 KubeSphere 应用商店。

### KubeSphere 环境搭建

#### All-in-One 模式部署测试环境

参考[官方文档](https://kubesphere.io/zh/docs/v3.3/quick-start/all-in-one-on-linux/) 。

在 Azure 上 Spot 一台机器：

```plain
Welcome to Ubuntu 18.04.6 LTS (GNU/Linux 5.4.0-1089-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Tue Sep  6 02:09:16 UTC 2022

  System load:  0.15              Processes:           376
  Usage of /:   4.8% of 28.89GB   Users logged in:     0
  Memory usage: 0%                IP address for eth0: 10.0.0.4
  Swap usage:   0%
```
以 All-In-One 模式部署：
> 注意，需要在 root 下运行。

```plain
apt install socat conntrack containerd
systemctl daemon-reload
systemctl enable --now containerd
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.2 sh -
chmod +x kk
./kk create cluster --with-kubernetes v1.22.12 --with-kubesphere v3.3.1
+------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------------+------------+-------------+------------------+--------------+
| name | sudo | curl | openssl | ebtables | socat | ipset | ipvsadm | conntrack | chrony | docker | containerd       | nfs client | ceph client | glusterfs client | time         |
+------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------------+------------+-------------+------------------+--------------+
| ks   | y    | y    | y       | y        | y     |       |         | y         | y      |        | 1.5.9-0ubuntu3.1 |            |             |                  | UTC 02:53:56 |
+------+------+------+---------+----------+-------+-------+---------+-----------+--------+--------+------------------+------------+-------------+------------------+--------------+
```
如果提示依赖缺失，可以根据需要安装，`sudo apt install <name>` ，这里只安装前两个。

|    |**Kubernetes Version ≥ 1.18**|
|:----|:----|
|socat|Required|
|conntrack|Required|
|ebtables|Optional but recommended|
|ipset|Optional but recommended|
|ipvsadm|Optional but recommended|

访问 KubeSphere 控制面板。

执行下面命令查看关于登录的信息：

```plain
Collecting installation results ...
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://10.0.0.4:30880
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
https://kubesphere.io             2022-09-06 15:41:44
#####################################################
```
访问 `30880` 端口，并使用用户名密码登录，就可以访问 KubeSphere 。为确保能够访问 KubeSphere 和其他服务，请根据实际情况在云平台控制面板为相应端口添加入站出站规则。

#### KubeSphere Cloud 创建演示环境

创建轻量集群服务：

注册并登录 [https://kubesphere.cloud](https://kubesphere.cloud/) 之后，可以轻松创建轻量集群服务。

![](https://pek3b.qingstor.com/kubesphere-community/images/20233909141272.png)

使用默认配置创建免费版集群即可尝鲜体验，个人用户每月有 10 小时免费额度。

访问 KubeSphere 控制面板。

点击`进入 KubeSphere`，使用临时帐号密码登录。

![](https://pek3b.qingstor.com/kubesphere-community/images/168186426020232.png)

### 插件启用

登录后的界面，如下图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/427935099520233.png)

如需使用应用商店，可以参考 [KubeSphere 文档 - 在安装后启用应用商店](https://kubesphere.io/zh/docs/v3.3/pluggable-components/app-store/#%E5%9C%A8%E5%AE%89%E8%A3%85%E5%90%8E%E5%90%AF%E7%94%A8%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97) 启用。

开启后可以在应用商店中搜索找到 Databend ，结果类似下图。

![](https://pek3b.qingstor.com/kubesphere-community/images/7337222620234.png)

### 企业空间与项目管理

点击`平台管理`进入`访问控制`页面，选中`企业空间`，点击`创建`，在`名称`一栏填写你想使用的名称，比如 `databend`。

在侧边栏选中`项目`，点击`创建`，分别创建为 `databend-meta` 和 `databend-query` 准备的项目。创建后效果如图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/265004022620235.png)

## 部署 Databend

### 应用模板载入

虽然应用商店中已经有 Databend 可供选用，但版本较旧（v0.8.122-nightly），新的 [PR](https://github.com/kubesphere/helm-charts/pull/288)（v1.0.3-nightly）需要等合并之后才可用，所以建议添加 Databend 官方维护的 helm-charts 作为应用模板。

Databend 官方提供了 Helm Charts ，而 KubeSphere 也支持使用 Helm Charts 应用模板。

> 应用模板是用户上传、交付和管理应用的一种方式。一般来说，根据一个应用的功能以及与外部环境通信的方式，它可以由一个或多个 Kubernetes 工作负载（例如[部署](https://kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/deployments/)、[有状态副本集](https://kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/statefulsets/)和[守护进程集](https://kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/daemonsets/)）和[服务](https://kubesphere.io/zh/docs/v3.3/project-user-guide/application-workloads/services/)组成。作为应用模板上传的应用基于 [Helm](https://helm.sh/) 包构建。
> 可以将 Helm Chart 交付至 KubeSphere 的公共仓库，或者导入私有应用仓库来提供应用模板。
> [https://kubesphere.io/zh/docs/v3.3/workspace-administration/upload-helm-based-application/](https://kubesphere.io/zh/docs/v3.3/workspace-administration/upload-helm-based-application/)

在企业空间侧边栏选中 **应用管理** ，点击 **应用仓库** ，添加 Databend 官方维护的 [Helm Charts](https://charts.databend.rs/) 。

![](https://pek3b.qingstor.com/kubesphere-community/images/173222569320236.png)

待状态变为成功后，就可以基于模板安装部署新的 Databend 应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/265835909120237.png)

### Databend 部署模型

参考 [Databend 官方文档 - Understanding Deployment Modes 文档](https://databend.rs/doc/deploy/understanding-deployment-modes)。

典型的 Databend 集群架构如下图所示，需要分别部署多个 Meta 和 Query 节点：

![](https://pek3b.qingstor.com/kubesphere-community/images/412313176720238.png)

在集群模式下部署 Databend 时，首先需要启动一个 Meta节点，然后设置并启动其他 Meta 节点以加入第一个 Meta 节点，形成集群。在成功启动所有 Meta 节点后，逐个启动 Query 节点。每个 Query 节点在启动后自动注册到 Meta 节点以形成集群。

![](https://pek3b.qingstor.com/kubesphere-community/images/30141921520239.png)

### Meta 高可用集群部署

选中 `databend-meta` 项目。点击侧边栏`应用负载`，选中`应用`。点击`创建`，并选中`从应用模板`。 下拉栏中选中之前添加的 Databend ，效果如图：

![](https://pek3b.qingstor.com/kubesphere-community/images/1395003309202310.png)

选中 `databend-meta`，点击`安装`，设定应用名称及版本，我们推荐总是使用最新版本，以获得更好的体验。

![](https://pek3b.qingstor.com/kubesphere-community/images/573255759202311.png)

使用示例设置，创建 3 副本的 `databend-meta` 节点形成集群。生产环境下推荐至少使用 3 副本高可用集群，可以参考 Databend 官方文档进行配置。

```plain
bootstrap: true
replicaCount: 3
persistence:
  size: 5Gi # 考虑到宿主机资源有限，仅供示范
serviceMonitor:
  enabled: true
```
### Query 集群部署

在 Meta 节点的所有副本就绪之后，就可以开始部署 Query 集群。

Query 节点部署的前置步骤与 Meta 节点类似。进入 `databend-query` 项目，仿照之前的步骤选中 databend-query 应用模板进行创建即可。

![](https://pek3b.qingstor.com/kubesphere-community/images/3220899540202312.png)

配置中需要关注的部分是：

* databend-meta 连接：这里的地址取决于之前部署的 Meta 集群的相关信息。
* 存储方式：本示例连接的是 QingStor ，使用 S3 兼容协议，所以需要特别关注 `endpoint_url` 。
* 内置用户创建：创建一个名为 `databend` 密码为 `databend` 的内置用户，以方便在非 localhost 情况下访问。

这里启动的是一个单副本的 Query 集群，实际情况下可以根据工作负载规模灵活调整。

```plain
replicaCount: 1
config:
  query:
    clsuterId: default
    # add builtin user
    users:
      - name: databend
        # available type: sha256_password, double_sha1_password, no_password, jwt
        authType: double_sha1_password
        # echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
        authString: 3081f32caef285c232d066033c89a78d88a6d8a5
  meta:
    # Set endpoints to use remote meta service
    # depends on previous deployed meta service、namespace and nodes
    endpoints:
      - "databend-meta-0.databend-meta.databend-meta.svc:9191"
      - "databend-meta-1.databend-meta.databend-meta.svc:9191"
      - "databend-meta-2.databend-meta.databend-meta.svc:9191"
  storage:
    # s3, oss
    type: s3
    s3:
      bucket: "<bucket>"
      endpoint_url: "https://s3.<region>.qingstor.com" # for qingstor
      access_key_id: "<key>"
      secret_access_key: "<secret>"
# [recommended] enable monitoring service
serviceMonitor:
  enabled: true
# [recommended] enable access from outside cluster
service:
  type: LoadBalancer
```
### KubeSphere 监控

#### KubeSphere 观测工作负载

待状态变为`运行中`即可，这时可以很方便使用 KubeSphere 观测工作负载。

**资源状态**

- databend-meta

![](https://pek3b.qingstor.com/kubesphere-community/images/536462125202313.png)

- databend-query

![](https://pek3b.qingstor.com/kubesphere-community/images/3124420022202314.png)

**监控**

- databend-meta

![](https://pek3b.qingstor.com/kubesphere-community/images/347608003202315.png)

- databend-query

![](https://pek3b.qingstor.com/kubesphere-community/images/604727747202316.png)

## 可访问性测试

### 节点状态检测

如果是在 **All-in-One 模式**下部署，我们可以轻松使用容器组 IP 地址来测试节点状态。

```plain
psiace@ks:~$ curl 10.233.107.113:8080/v1/health
{"status":"pass"}
```
而使用 **KubeSphere Cloud** 部署时，可以在 KubeSphere Cloud 控制面板，选择`网络`以创建访问规则。

![](https://pek3b.qingstor.com/kubesphere-community/images/3002059035202317.png)

这里以 8080（Admin API）和 8000（Query HTTP Handler）端口为例：

![](https://pek3b.qingstor.com/kubesphere-community/images/277967799202318.png)

创建后的结果如下图所示：

![](https://pek3b.qingstor.com/kubesphere-community/images/913867528202319.png)

同样我们可以使用 curl 来检查节点状态。

```plain
psiace@ks:~$ curl https://admin-gfkyzxaz.c.kubesphere.cloud:30443/v1/health
{"status":"pass"}
```
### 执行查询

bendsql 是一个十分方便的命令行界面工具，可以帮助您顺畅高效地使用 Databend 。bendsql 也支持连接 Databend Cloud ，管理计算集群和运行 SQL 查询。

**安装 bendsql**

```plain
$ go install github.com/databendcloud/bendsql/cmd/bendsql@latest
```
**连接 databend 集群（以 KubeSphere Cloud 为例）**

```plain
$ bendsql connect -H query-gfkyzxaz.c.kubesphere.cloud -P 30443 -u databend -p databend --ssl
Connected to Databend on Host: query-gfkyzxaz.c.kubesphere.cloud
Version: DatabendQuery v0.9.57-nightly-df858a1(rust-1.68.0-nightly-2023-03-01T01:23:11.56066902Z)
```
**尝试执行查询**

```plain
$ bendsql query
Connected with driver databend (DatabendQuery v0.9.57-nightly-df858a1(rust-1.68.0-nightly-2023-03-01T01:23:11.56066902Z))
Type "help" for help.

dd:databend@query-gfkyzxaz/default=> SELECT avg(number) FROM numbers(1000);
+-------------+
| avg(number) |
+-------------+
| 499.5       |
+-------------+
(1 row)
```
## 总结

本文介绍了如何使用 KubeSphere 创建和部署 Databend 高可用集群，后端存储服务采用 QingStor ，最后使用 bendsql 演示连接集群和执行查询。