---
title: "升级 KubeSphere DevOps 时的数据迁移"
keywords: "Kubernetes, 升级, KubeSphere, v2.1.0, v3.0.0, DevOps"
description: "了解升级 KubeSphere DevOps 时的数据迁移及其风险."
linkTitle: "升级 KubeSphere DevOps 时的数据迁移"
weight: 7700
---

将 KubeSphere 从 v2.1 升级到 v3.0 时，在 DevOps 中可能遇到的问题大部分是因其架构发生了变化。本文档介绍 DevOps 架构的变化以及数据迁移的方案和风险。

## DevOps 架构对比

### KubeSphere v2.1 的 DevOps

![devops-2-1-architecture](/images/docs/zh-cn/upgrade/devops-data-migration-upgrade/devops-2-1-architecture.png)

在 KubeSphere v2.1 中，DevOps 数据存储在 Jenkins 中，而 KubeSphere 中的 MySQL 则存储权限信息以及工程、流水线和用户之间的对应关系。前端用户通过调用 Api Gateway 获取 ks-apiserver 授权，然后连接到 Jenkins。

另一种特殊的类型是 `/kapis/jenkins.kubesphere.io`，即直接通过 Api Gateway 传到 Jenkins，这种方法主要在已下载存档文件时使用。

### KubeSphere v3.0 的 DevOps

![devops-3-0-architecture](/images/docs/zh-cn/upgrade/devops-data-migration-upgrade/devops-3-0-architecture.png)

在 KubeSphere v3.0 中，DevOps 数据存储在自定义资源 (CRD) 中。CRD 中的数据会单向同步到 Jenkins，任何先前的同名数据都将被覆盖。用户主要可以进行两类操作：创建类型的操作和触发类型的操作。

创建类型的操作主要涉及三种 CRD 类型的创建，包括 DevOps 工程、流水线和凭证。用户在前端调用 ks-apiserver 接口来创建资源并将其存储到 etcd 中，ks-controller-manager 持续将这些对象同步到 Jenkins。触发类型的操作主要涉及瞬时动作，包括运行流水线、审核流水线等。用户在前端调用 ks-apiserver，并在数据转换后直接调用 Jenkins API。

## 数据迁移逻辑

将 KubeSphere 从 v2.1 升级到 v3.0 时，数据迁移的逻辑主要如下：

1. 从 MySQL 获取 DevOps 目录的信息。
2. 从 Jenkins 获取流水线、凭证等信息。
3. 将以上信息序列化到一个 YAML 文件中。
4. 将 YAML 对象资源备份到 MinIO 对象存储中。
5. 使用 `kubectl apply` 命令应用这些流水线资源。
6. 权限迁移。

迁移前后的数据对比：

|    资源     |  v2.1   | v3.0 |
| :---------: | :-----: | :--: |
| DevOps 工程 |  MySQL  | CRD  |
|   流水线    | Jenkins | CRD  |
|    凭证     | Jenkins | CRD  |
|    权限     |  MySQL  | CRD  |

{{< notice warning>}}

您必须预先备份数据，因为在数据迁移过程中一旦 CRD 被创建，Jenkins 中的数据将会被 ks-controller-manager 覆盖。您可以使用 Velero 进行 PVC 级别的备份，也可以直接备份 Jenkins Pod 的 `/var/jenkins_home` 目录。

{{</ notice >}}

## 数据迁移方案和风险

对于在 KubeSphere DevOps 页面创建的流水线，正常迁移即可。但在迁移过程中，直接在 Jenkins 面板上创建的流水线配置可能会丢失。

### 通过任务 (Job) 迁移

本方案适用于仅在 KubeSphere DevOps 页面上执行 DevOps 操作的场景。您可以直接升级 KubeSphere，如果在升级之后没有可用的 DevOps 资源，请重新运行升级。

### 不迁移先前的数据

KubeSphere DevOps 兼容大部分 Jenkins 配置，但 Jenkins 面板上也有一些 KubeSphere DevOps 不支持的配置，如下所示：

![configurations-not-supported](/images/docs/zh-cn/upgrade/devops-data-migration-upgrade/configurations-not-supported.png)

数据迁移之后，这些配置将被清除。即使在数据迁移之后再添加以上配置，这些配置仍会在您下一次编辑流水线时被清除。

{{< notice note >}}

一般来说，您不能在 Jenkinsfile 中指定这些配置，因为这些配置不属于运行流水线的逻辑。

{{</ notice >}}

如果对这些配置有特定需求，您可以保持先前的数据不迁移，并在 KubeSphere DevOps 页面上管理新的流水线。

{{< notice warning >}}

请勿在同一个 DevOps 工程中创建名称相同的流水线，否则 Jenkins 中的数据将会被覆盖。

{{</ notice >}}

### 部分迁移

如果只有少数配置需要在 Jenkins 面板上指定，用户可以直接使用 KubeSphere DevOps 管理流水线。对于这些用户，可以首先进行备份，然后使用任务来迁移部分数据，稍后再修复具有特殊配置的流水线。

如果对可用性有较高的需求，用户可以复用先前的 DevOps 工程，手动创建并运行名称不同的新流水线用于测试。如果新的流水线成功运行，用户可以删除先前的流水线。

{{< notice info >}}

您可以使用 `kubectl get devopsprojects --all-namespaces` 和 `kubectl get pipelines --all-namespaces` 命令查看迁移结果。

您也可以使用以下命令反复运行任务以进行迁移。

```
kubectl -n kubesphere-system get job ks-devops-migration -o json | jq 'del(.spec.selector)' | jq 'del(.spec.template.metadata.labels)' | kubectl replace --force -f -
```

{{</ notice >}}



