---
title: '利用 KubeSphere 部署 Kasten K10'
tag: 'KubeSphere, 灾备'
keywords: 'Kubernetes, KubeSphere, Kasten K10, 数据管理, 云原生灾备'
description: 'Kasten K10 是 Veeam 在 Kubernetes 平台的数据管理解决方案，通过部署 Kasten K10 企业可以安全地备份和还原、执行灾难恢复以及迁移云原生的应用。KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。本文将介绍如何在 KubeSphere 上部署 Kasten K10。'
createTime: '2021-08-24'
author: 'Mars Zhang'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kasten-k10-cover.png'
---

## Kasten on KubeSphere

**Kasten K10** 是 Veeam 在 Kubernetes 平台的数据管理解决方案，通过部署 Kasten K10 企业可以安全地备份和还原、执行灾难恢复以及迁移云原生的应用。Kubernetes 集群资源和持久卷等存储资源。解决用户备份、灾难恢复、迁移过程中的数据管理问题，提高云原生环境数据管理的便捷性，帮助用户降低灾备成本，提高生产执行效率。

![](https://pek3b.qingstor.com/kubesphere-community/images/dateplatform-kasten.jpg)

**KubeSphere** 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，完全开源，支持多云与多集群管理，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-feature-overview.jpeg)

本文将介绍如何在 KubeSphere 上部署 Kasten K10。

## 部署环境准备

KubeSphere 是由青云QingCloud 开源的容器管理台，支持在任何基础设施上安装部署。在青云公有云上支持一键部署 KubeSphere（QKE）。
下面以在青云云平台快速启用 KubeSphere 容器平台为例部署 Kasten 云原生数据管理平台，至少需要准备 3 个可调度的 node 节点。你也可以在任何 Kubernetes 集群或 Linux 系统上安装 KubeSphere，可以点击参考 [KubeSphere 官方文档](https://kubesphere.io/zh/docs/)。

创建完成后登录到 KubeSphere 平台界面：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-platform.jpg)

点击左上角平台管理，选择访问控制，新建企业空间，这里命名为 kasten-workspace。

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-workspace.jpg)

进入企业空间，选择应用仓库，添加一个 Kasten 的应用仓库：

![](https://pek3b.qingstor.com/kubesphere-community/images/Kasten-helm.jpg)

将 Kasten 官方 Helm 仓库添加到 KubeSphere 容器平台，[Helm 仓库地址](https://charts.kasten.io/)：https://charts.kasten.io/。

添加方式如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/add-repo.jpg)

添加后状态为『成功』

![](https://pek3b.qingstor.com/kubesphere-community/images/add-repo-successful.jpg)

## 部署 Kasten K10

首选创建一个项目（namespace）用于运行 Kasten ：

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-project.jpg)

创建完成后点击进入项目，选择应用，部署新应用,选择来自应用模板。

![](https://pek3b.qingstor.com/kubesphere-community/images/deploy-new-app.jpg)

从下拉菜单选择 Kasten， 选择 K10。

![](https://pek3b.qingstor.com/kubesphere-community/images/app-templates.jpg)

点击 K10 进入 Chart 详情页，点击配置文件可查看或下载默认的 values.yaml，选择版本，点击部署，配置应用名称为 k10 并选择应用版本，确认应用部署位置，点击下一步。

![](https://pek3b.qingstor.com/kubesphere-community/images/k10-chart.jpg)

在这一步中，我们需要输入在 KubeSphere 中部署 Kasten K10 所需要的参数，请安装者根据根据部署的情况进行参数调整, 在本次安装过程中的参数调整如下，点击部署。

![](https://pek3b.qingstor.com/kubesphere-community/images/app-configurations.jpg)


``` 
  global: 
    airgapped: 
      repository: "ccr.ccs.tencentyun.com/kasten-k10"
    persistence: 
      storageClass: "csi-hostpath-sc"
  auth: 
    basicAuth: 
      enabled: "true"
      htpasswd: "mars:$apr1$Cgu1sGVZ$w/8aLHZkVT73OqYZ06C0v."
  metering: 
    mode: "airgap"
  injectKanisterSidecar: 
    enabled: "true"
  prometheus: 
    server: 
      persistentVolume: 
        enabled: "false"
  ingress: 
    create: "true"
    class: "nginx"
```

点击部署，等待应用状态变为活跃：

![](https://pek3b.qingstor.com/kubesphere-community/images/k10-running.jpg)

点击工作负载（Deployment），查看 Kasten 部署了 workload 已经正常运行：

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-workload.jpg)

在应用，路由页面中，可以看到之前配置的 Ingress 入口。

![](https://pek3b.qingstor.com/kubesphere-community/images/k10-ingress.jpg)

## 登录 Kasten K10 管理界面

在浏览器中输入 https://192.168.99.100/k10/# 会出现以下登录界面。输入您的公司与邮件地址完成注册。

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-sign.jpg)

在 Settings 中的 Locations 设置您备份数据的存放目标，这里我们选用的是 S3 兼容性存储。

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-location.jpg)

最后启用 K10  Disaster Recovery 我们就可以进行云原生应用的灾备设定了。

![](https://pek3b.qingstor.com/kubesphere-community/images/k10-recovery.jpg)

## 云原生应用的部署与发现

到 Kasten Dashboard 中， 我们可以发现目前这里有 16 个 应用，如下图。让我们新建一个 Wordpress 应用，该应用包括 一个 Wordpress Pod 与 一个 Mysql Pod，是典型的无状态与有状态相结合的应用，应用创建的步骤如下：

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-dashboard.jpg)

### 创建 kustomization.yaml

创建 Secret 生成器 A Secret 是存储诸如密码或密钥之类的敏感数据的对象。从 1.14 开始，kubectl 支持使用 kustomization 文件管理 Kubernetes 对象。您可以通过 `kustomization.yaml` 中的生成器创建一个 Secret。

通过以下命令在 `kustomization.yaml` 中添加一个 Secret 生成器。您需要用您要使用的密码替换 YOUR_PASSWORD。

```
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

### 下载 MySQL deployment 配置文件

```
curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
```

### 下载 Wordpress 配置文件

```
curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
```

### 补充到 kustomization.yaml 文件

```
cat <<EOF >>./kustomization.yaml
resources:
  - mysql-deployment.yaml
  - wordpress-deployment.yaml
EOF
```

应用和验证 `kustomization.yaml` 包含用于部署 WordPress 网站的所有资源以及 MySQL 数据库。您可以通过以下方式应用目录。

```
kubectl create ns wordpress
kubectl apply -k ./  -n wordpress
```

上述应用执行完成之后，我们马上就可以看到应用数量增加为 17 个。

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-applications.jpg)

并可以在 Applications 中发现在这个 Wordpress 应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/app-wordpress.jpg)

## 云原生应用的备份

点击 Create Policy， 让我们创建一个数据备份策略，在这个数据保护策略中 Kasten 不仅创建本地的快照对应用进行保护，还会将应用数据备份到云端的对象存储，以实现数据的长期保留。

![](https://pek3b.qingstor.com/kubesphere-community/images/create-policy.jpg)

点击 Run Once 执行备份任务。

![](https://pek3b.qingstor.com/kubesphere-community/images/kasten-runonce.jpg)

观察 Dashboard 可以看到应用已经备份完成。

## 云原生应用的还原

在 Dashboard 中找到 Applications 点击 Restore。

![](https://pek3b.qingstor.com/kubesphere-community/images/app-restore.jpg)

选择还原的时间点。

![](https://pek3b.qingstor.com/kubesphere-community/images/restore-app-wordpress.jpg)

新建一个 Namespace 进行还原，这里我们命名为 wordpress-restore。

![](https://pek3b.qingstor.com/kubesphere-community/images/namespace-restore.jpg)

由于还原的应用将新建一个 namespace ，您可以观察到。这里的应用从 17 增加到 18 个， 观察 Dashboard 我们可以看到，应用已经被成功的还原了。

![](https://pek3b.qingstor.com/kubesphere-community/images/restore-app-dashboard.jpg)

在 KubeSphere Dashboard 中我们已经看到还原的应用在正常的运行了。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-dashboard-pro.jpg)

## 总结

KubeSphere 容器平台对于云原生应用部署非常友好，对于还不熟悉 Kubernetes 的应用开发者而又希望通过在界面简单配置完成 Kasten 数据管理平台的部署可以参考以上步骤快速上手。在 KubeSphere 中使用 Kasten K10 的官方 Helm 仓库直接部署 Kasten K10。并且通过 Kasten 为您的云原生应用进行数据管理操作，这包括备份、迁移与容灾。

## 参考文献

[Kasten 官方文档](https://docs.kasten.io/)

[Kasten 实战系列文章](https://www.data2clouds.com/index.php/archives/41/)

[KubeSphere GitHub](https://github.com/kubesphere/kubesphere)

[KubeSphere Introduction](https://kubesphere.io/docs/introduction/what-is-kubesphere/)

[KubeSphere Documentation](https://kubesphere.io/docs/)