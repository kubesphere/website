---
title: '本来生活的 DevOps 升级之路'
tag: 'DevOps,Kubernetes,KubeSphere,Jenkins'
createTime: '2020-03-28'
author: 'YangYang'
snapshot: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200327132943.png'
---

我叫杨杨，就职于本来生活网（Benlai.com），负责发布系统架构。我们公司咋说呢，简单说就是卖水果、蔬菜的😄，下面还是来一段官方介绍。

## 本来生活简介

本来生活网创办于 2012 年，是一个专注于食品、水果、蔬菜的电商网站，从优质食品供应基地、供应商中精挑细选，剔除中间环节，提供冷链配送、食材食品直送到家服务。致力于通过保障食品安全、提供冷链宅配、基地直送来改善中国食品安全现状，成为中国优质食品提供者。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327131801.png)

## 技术现状

### 基础设施

> - 部署在 IDC 机房
> - 拥有 100 多台物理机
> - 虚拟化部署

### 存在的问题

> - 物理机 95% 以上的占用率
> - 相当多的资源闲置
> - 应用扩容比较慢

## 拥抱 DevOps 与 Kubernetes

公司走上容器平台的 DevOps 这条康庄大道主要目标有三：

> 1、提高资源利用率  
>
> 2、提高发布效率
>
> 3、降低运维的工作成本等等

其实最主要的还是 **省钱**，对就是 **省钱**。接下来就是介绍我们本来生活的 DevOps 升级之路：

## Level 1：工具选型

我们从初步接触 DevOps 相关知识，在此期间偶然了解到开源的 KubeSphere (kubesphere.io)。KubeSphere 是在 Kubernetes 之上构建的以应用为中心的企业级容器平台，支持敏捷开发与自动化运维、DevOps、微服务治理、灰度发布、多租户管理、监控告警、日志查询与收集、应用商店、存储管理、网络管理等多种业务场景。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327141156.png)

KubeSphere 内置的基于 Jenkins 的 DevOps 流水线非常适合我们，并且还打通了我们日常运维开发中需要的云原生工具生态，这个平台正是我们当初希望自己开发实现的。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327132943.png)

于是，我们开始学习 KubeSphere 与 Jenkins 的各种操作、语法、插件等，开始构建适合我们自己的 CI/CD 的整个流程。最终结合 KubeSphere 容器平台，初步实现了第一级的 CI/CD 流程。

在 **Level 1** 的流程中，我们主要实现了拉取代码、编译应用、发布镜像到本地仓库、部署到本地 Kubernetes 集群；如下图

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327132507.png)

### 积累经验值

在 KubeSphere 初步完成 CI/CD 流程后，我们继续研究和完善流水线。比如，在研究 Jenkins Pipeline 的自定义方法后，我们实现了动态生成应用相关信息。Jenkins 成为企业级的主流 CI/CD 软件很大一部原因是其拥有丰富的插件生态，因此我们继续研究 Jenkins 插件，并在流水线中实现了上传 FTP、通过命令动态部署 ConfigMap、部署存储等流程。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327133536.png)

## Level 2：完善流水线

经过不停的努力学习 Jenkinsfile 语法及插件后，我们的 CI/CD 流程升级到 Level 2。我们在流水线中，加入了 **部署配置、部署存储、上传 CDN** 等，如下图：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327135941.png)

### 小坑 - 动态参数

因为业务需要，我们的 CI/CD 流程需要 分为几种类型的发布，而每种类型的发布都需要不同的参数；

于是我们按照之前学习到的 Jenkins Pipeline 语法，想当然的使用 When 条件语句去判断传入的发布类型跳转到不同 Stage ，然后在通过 Input 输入参数语句实现不同参数的输入，但是发现 Input 参数语句的优先级高于 When 条件语句，也就是说不管我选择哪个发布类型都要先输入参数，然后系统才会去判断是否跳过该 Stage，这与我们想的完全不一样。

于是我们各种 Google 和查官方文档，最后找到另外一种 input 语法，可以把 input 的优先级降低，使得 When 条件语句先判断，这样就满足了我们的需求。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327135953.png)

## Level 3：

经过采坑动态参数，我们将 CI/CD  流程升级到 Level 3，即新增了根据不同发布类型的任务，满足动态生成所需的参数，具体流程如下图：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327140027.png)

### 小坑 - ConfigMap

在实际生成环境中我们回滚肯定是要将应用的程序和 ConfigMap 一起回滚的，但是 Kubernetes 的 ConfigMap 是没有版本控制的，这对于管理就会非常麻烦。于是，我们只能使用笨办法，在每次发布应用时，去配置中心抓取当前应用的配置生成 ConfigMap。并且，在 ConfigMap 名称后面跟上当前应用的发布版本，然后，在部署到 Kubernetes 时，会将该版本的 ConfigMap 挂载到当前发布的 Deployment 中，这样我们在回滚或发布时，就能直接将应用的镜像和 ConfigMap 一起回滚到指定版本。

唯一美中不足的就是 ConfigMap 会越来越多，后期只要定时清理就好，后续也将调研相关的配置管理工具。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327140058.png)

### 连环坑：线下访问线上数据库

为了将应用的镜像从线下环境上传到线上生产环境的镜像仓库，我们踩了个连环坑，先是折腾了好久镜像仓库的 https 登陆。登陆的坑填平了，又掉到 push 镜像的坑里。最后，发现就是一个小小的配置导致的 push 镜像到线上环境失败。这两个坑折腾了我们很长的时间，不过好在最终都解决了，这些解决方法的细节，我们记录在了 KubeSphere 开发者论坛，可以在 KubeSphere 论坛找到：`https://ask.kubesphere.io/forum/d/294-docker-login-https-harbor`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327140134.png)

## 标准化流程

经过前期各种学习和采坑，我们的 CI/CD 流程基本成熟了后，我们开始考虑是不是能把整个流程标准化，每个应用只需要调用这个标准化流程去执行发布就好；而不是把 CI/CD 流程写到每个应用的 Pipeline 中；不然以后应用多了，万一需要修改 CI/CD 流程，想想有那么多应用的流程要修改，会比较麻烦。

于是我们又开始 Google 和查文档，寻找了一大圈，终于发现了一个叫 **Jenkins 扩展共享库**。通过 Jenkins 扩展共享库我们把 CI/CD 流程拆分为 **通用方法** 和 **流程逻辑** 两块。

然后每个应用的 Jenkins Pipeline 中只需按要求传入参数，然后调用要执行的流程方法即可；每个应用的 Jenkins Pipeline 的代码量从原来的 500 多行减少到了 30 行不到。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327140144.png)

## Level 9：实现一键发布

经过采坑和填坑的不懈努力 我们积累了很好的经验；一下子跳级到 Level 9，CI/CD 流程有了质的飞跃，化整为零了。以后再也不用担心甲方爸爸随便更改流程啦 😊。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200327140205.png)

以后发布，只需要在 KubeSphere 平台点击 **运行**，选择 **发布类型** 和 **环境**，然后点击确定，然就可以去喝一杯咖啡 ☕️ 安静地等待服务发布喽！
