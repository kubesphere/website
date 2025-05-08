---
title: '过渡无压力！KubeSphere v3.4.x 到 v4.x 平滑升级全攻略'
tag: '产品动态'
keyword: '社区, 开源, 升级, KubeSphere'
description: '本文将为您提供从 KubeSphere v3.4.x 升级到 v4.x 的完整操作步骤，帮助您顺利完成升级过程。'
createTime: '2025-4-19'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/KubeSphere%20v3.4.x%20to%20v4.xzh.png'
---

本文将为您提供从 KubeSphere v3.4.x 升级到 v4.x 的完整操作步骤，帮助您顺利完成升级过程。特别注意，如果您的 KubeSphere 版本早于 v3.4.x，您需要先将其升级至 v3.4.x，然后再进行进一步的升级。

升级过程分为以下三个主要步骤，请按照顺序执行：

1. 升级 host 集群并迁移扩展组件数据。
2. 升级 member 集群并迁移扩展组件数据。
3. 升级网关。

## 下载升级脚本

在 host 集群和 member 集群环境中下载升级脚本：

```bash
curl -LO https://github.com/kubesphere/ks-installer/archive/refs/tags/v4.1.3.tar.gz
tar -xzvf v4.1.3.tar.gz
```

## 修改升级配置文件

在 host 和所有的 member 集群中调整升级配置文件，配置文件路径 `scripts/ks-core-values.yaml`，其中 `upgrade` 部分为升级相关的配置项目，在升级之前，您需要确认要升级的组件和配置信息，通过 `upgrade.jobs.config.<name>.enabled` 控制是否需要升级该组件，以下为配置示例：


```yaml
upgrade:
  enabled: true
  image:
    registry: ""
    repository: kubesphere/ks-upgrade
    tag: "v4.1.3"
    pullPolicy: IfNotPresent
  persistenceVolume:
    name: ks-upgrade
    storageClassName: ""
    accessMode: ReadWriteOnce
    size: 5Gi
  config:
    storage:
      local:
        path: /tmp/ks-upgrade
    validator:
      ksVersion:
        enabled: true
      extensionsMuseum:
        enabled: true
        namespace: kubesphere-system
        name: extensions-museum
        syncInterval: 0
        watchTimeout: 30m
    jobs:
      network:            
        enabled: true        # 是启用并升级该扩展组件
        priority: 100
        extensionRef:        # 扩展组件的版本配置，需要与 extensions-museum 中的信息一致
          name: "network"
          version: "1.1.0" 
        dynamicOptions: {
          "rerun": "false"
        }
      gateway:
        enabled: true
        priority: 90
        extensionRef:
          name: "gateway"
          version: "1.0.5"
```

更多配置说明请参考 [扩展组件升级配置说明](https://github.com/kubesphere/ks-upgrade/tree/release-4.1/docs)

## 集群状态检查

在升级集群之前，执行以下 `scripts/pre-check.sh` 脚本文件，检查集群状态及是否满足升级条件。

```bash
bash pre-check.sh
```

## 升级 host 集群

执行以下命令，升级 host 集群、安装扩展组件并迁移数据。

```bash
# 指定镜像仓库地址
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks 
# 指定扩展组件镜像仓库地址
# export EXTENSION_IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks 
bash upgrade.sh host | tee host-upgrade.log
```

执行升级命令后，可以在新的终端窗口中运行以下命令，实时观察 `kubesphere-system` 命名空间下 Pod 的状态变化：

```bash
watch kubectl get pod -n kubesphere-system
```

## 升级 member 集群

执行以下命令，升级 member 集群、安装扩展组件 agent 并迁移数据。

```bash
# 指定镜像仓库地址
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks 
# 指定扩展组件镜像仓库地址
# export EXTENSION_IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks 
bash upgrade.sh member | tee member-upgrade.log
```

执行升级命令后，可以在新的终端窗口中运行以下命令，实时观察 `kubesphere-system` 命名空间下 Pod 的状态变化：

```bash
watch kubectl get pod -n kubesphere-system
```

在 member 集群升级成功之后，需要在 host 集群上执行以下命令，移除 member 集群的污点，使扩展组件 agent 能够调度到 member 集群上。

```bash
kubectl get clusters.cluster.kubesphere.io <MEMBER_CLUSTER_NAME> -o json | jq 'del(.status.conditions[] | select(.type=="Schedulable"))' | kubectl apply -f -
```


## 升级网关

网关的升级会导致 Nginx Ingress Controller 重启，依赖网关提供的服务会产生中断，请在业务低峰期进行升级。

在开始升级前，请通过以下命令检查集群中部署的网关实例及状态：

```bash
helm -n kubesphere-controls-system list -a
```

通过以下命令逐一升级网关：

```bash
# 指定镜像仓库地址
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks 
bash upgrade.sh gateway kubesphere-router-<NAMESPACE> | tee gateway-upgrade.log
```

或者通过以下命令升级所有网关：

```bash
# 指定镜像仓库地址
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks 
bash upgrade.sh gateway all | tee gateway-upgrade.log
```

在网关升级完成后，通过以下命令检查网关的部署状态：

```bash
helm -n kubesphere-controls-system list -a
```

## 完成升级

升级完成后，请确保所有服务正常运行，并检查系统的健康状态。可以通过以下命令验证：

```bash
for ns in $(kubectl get namespaces -l kubesphere.io/workspace=system-workspace -o jsonpath='{.items[*].metadata.name}'); do
    kubectl get pods -n $ns --no-headers --ignore-not-found | grep -vE 'Running|Completed'
done
```

确保所有 Pod 状态为 `Running`。如有问题，请查看相关容器日志以进行故障排除。

通过本文提供的平滑升级步骤，您应该能够顺利将平台从 v3.4.x 升级到 v4.x，如果您在升级过程中遇到任何困难或有进一步的需求，KubeSphere 社区随时欢迎您的参与和反馈。通过不断的优化和更新，我们致力于为每一位用户提供更加稳定、高效的云原生平台。

感谢您选择 KubeSphere，我们期待您在新版平台上获得更好的体验和成效！


## 特别提醒：产品生命周期管理政策

在进行升级时，建议您关注 [KubeSphere 产品生命周期管理政策](https://kubesphere.io/zh/news/kubesphere-product-lifecycle-policy/)，该政策为您提供了产品版本的生命周期终止方案，确保您使用的版本始终满足最新的市场需求和技术标准。了解每个版本的支持和更新策略，有助于您及时做好系统更新与版本迁移的规划，避免由于使用不再维护的版本而带来的潜在风险。