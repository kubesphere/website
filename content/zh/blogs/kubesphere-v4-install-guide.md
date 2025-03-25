---
title: 'KubeSphere v4 安装指南'
tag: 'KubeSphere, Kubernetes, KubeSphere v4, KubeSphere LuBan'
createTime: '2024-10-16'
author: 'Cauchy'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-guide-cover.png'
---

日前，KubeSphere v4 发布，相较于之前的版本，新版本在架构上有了颠覆性的变化。为了让社区的各位小伙伴能够丝滑的从旧版本过渡到新版本，我们特别推出本篇安装指南文章，以供参考。

关于 KubeSphere v4 的介绍，请阅读本文：[KubeSphere v4 开源并发布全新可插拔架构 LuBan](https://kubesphere.io/zh/news/kubesphere-v4-ga-announcement/)。

> 需要注意的是，目前不支持从 KubeSphere 3.4.1 版本直接升级到 v4 版本，需要先卸载原来的版本，再安装 v4 版本。

## 卸载 KubeSphere 3.4.1

> 注意：
> - 本文仅适用于测试环境，请不要直接在生产环境操作。
> - 如果需要在生产环境操作，请先在测试环境验证通过后再进行。
> - 卸载为高风险操作，执行该操作前，请明确您知道自己将要做什么。
> - 该操作会导致 KubeSphere 平台自身无法使用，但不会影响 KubeSphere 之外即 K8s 集群中运行的工作负载。
> - 该操作会删除 KubeSphere 所有的组件及相关数据，您可以在此之前对数据进行备份。
> - 您可以自主选择数据迁移工具，或等待社区的数据迁移方案，社区的迁移方案计划通过脚本帮助您备份平台账户、权限及相关的数据，在新版本安装好后，可将备份数据进行导入。
> - 如果您期望全面的数据迁移和升级，我们建议您可以考虑 [KubeSphere 企业版](https://m.qingcloud.com/page/23555798970015596/4c97b2026cb84249be20d94e71b647cf?cl_track=aec50)。
> - **社区郑重提醒您，务必谨慎操作。**

### 解绑集群

如果开启了多集群，请务必在卸载前将集群进行解绑。卸载 Host 集群前，请确保已经没有 Member 集群被当前集群纳管，且角色和账户等信息也会被删除。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-1.png)

### 卸载 KubeSphere 3.4.1

针对待卸载集群执行该脚本。

**注意：**
1. 执行该脚本前请确保当前集群已从 Host 集群中解绑。
2. 请确认即将操作的集群是将要被卸载的集群。
3. 执行该脚本后会将集群中的 Prometheus 以及 Elasticsearch 删除，存量监控和日志数据不会被保留。
4. 执行该脚本后，集群中项目网关仍可继续使用，但纳管至 KubeSphere 4.1.2 后需将网关切换到新版本网关，切换过程存需删除老版本网关，切换为新版本网关。

#### 卸载 DevOps 组件

```
helm del -n argocd devops
helm del -n kubesphere-devops-system devops
```

#### 卸载 ServiceMesh 组件

```
kubectl -n istio-system delete jaeger jaeger
kubectl -n istio-system delete kiali kiali

helm del -n istio-system kiali-operator
helm del -n istio-system jaeger-operator

# 下载 istioctl
wget https://github.com/istio/istio/releases/download/1.15.6/istioctl-1.15.6-linux-amd64.tar.gz
tar -zxvf istioctl-1.15.6-linux-amd64.tar.gz
./istioctl uninstall --purge
```

#### 卸载 ks-core、监控及日志相关组件

```
#！/bin/bash
############################################################################################################
# 该脚本用于卸载集群中的 KubeSphere v3.4.1
#
# 注意： 如果为多集群环境，执行该脚本前请确保当前集群已从 host 集群中解绑
############################################################################################################

set -x

# 清除集群所有 namespace 中的 workspace 标签
kubectl get ns -l kubesphere.io/workspace -o name | xargs -I {} bash -c "kubectl label {} kubesphere.io/workspace- && kubectl patch {} -p '{\"metadata\":{\"ownerReferences\":[]}}' --type=merge"

# # 清除集群所有 namespace 中的 kubefed 标签
kubectl get ns -l kubefed.io/managed -o name | xargs -I {} bash -c "kubectl label {} kubefed.io/managed- && kubectl patch {} -p '{\"metadata\":{\"ownerReferences\":[]}}' --type=merge"

# 清除集群中的 workspace 以及 workspacetemplate 资源
kubectl get workspacetemplate -A -o name | xargs -I {} kubectl patch {} -p '{"metadata":{"ownerReferences":[]}}' --type=merge
kubectl get workspace -A -o name | xargs -I {} kubectl patch {} -p '{"metadata":{"ownerReferences":[]}}' --type=merge

kubectl get workspacetemplate -A -o name | xargs -I {} kubectl delete {}
kubectl get workspace -A -o name | xargs -I {} kubectl delete {}

# 删除 clusterroles
delete_cluster_roles() {
  for role in `kubectl get clusterrole -l iam.kubesphere.io/role-template -o jsonpath="{.items[*].metadata.name}"`
  do
    kubectl delete clusterrole $role 2>/dev/null
  done
}

delete_cluster_roles

# 删除 clusterrolebindings
delete_cluster_role_bindings() {
  for rolebinding in `kubectl get clusterrolebindings -l iam.kubesphere.io/role-template -o jsonpath="{.items[*].metadata.name}"`
  do
    kubectl delete clusterrolebindings $rolebinding 2>/dev/null
  done
}
delete_cluster_role_bindings

# 删除 validatingwebhookconfigurations
for webhook in ks-events-admission-validate users.iam.kubesphere.io network.kubesphere.io validating-webhook-configuration resourcesquotas.quota.kubesphere.io
do
  kubectl delete validatingwebhookconfigurations.admissionregistration.k8s.io $webhook 2>/dev/null
done

# 删除 mutatingwebhookconfigurations
for webhook in ks-events-admission-mutate logsidecar-injector-admission-mutate mutating-webhook-configuration
do
  kubectl delete mutatingwebhookconfigurations.admissionregistration.k8s.io $webhook 2>/dev/null
done

# 删除 users
for user in `kubectl get users -o jsonpath="{.items[*].metadata.name}"`
do
  kubectl patch user $user -p '{"metadata":{"finalizers":null}}' --type=merge
done
kubectl delete users --all 2>/dev/null

# 删除 iam 资源
for resource_type in `echo globalrolebinding loginrecord rolebase workspacerole globalrole workspacerolebinding`; do
  for resource_name in `kubectl get ${resource_type}.iam.kubesphere.io -o jsonpath="{.items[*].metadata.name}"`; do
    kubectl patch ${resource_type}.iam.kubesphere.io ${resource_name} -p '{"metadata":{"finalizers":null}}' --type=merge
  done
  kubectl delete ${resource_type}.iam.kubesphere.io --all 2>/dev/null
done

# 卸载 ks-core
helm del -n kubesphere-system ks-core
helm del -n kubesphere-system ks-redis &> /dev/null || true
kubectl delete pvc -n kubesphere-system -l app=redis-ha --ignore-not-found || true
kubectl delete deploy -n kubesphere-system -l app.kubernetes.io/managed-by!=Helm --field-selector metadata.name=redis --ignore-not-found || true
kubectl delete svc -n kubesphere-system -l app.kubernetes.io/managed-by!=Helm --field-selector metadata.name=redis --ignore-not-found || true
kubectl delete secret -n kubesphere-system -l app.kubernetes.io/managed-by!=Helm --field-selector metadata.name=redis-secret --ignore-not-found || true
kubectl delete cm -n kubesphere-system -l app.kubernetes.io/managed-by!=Helm --field-selector metadata.name=redis-configmap --ignore-not-found || true
kubectl delete pvc -n kubesphere-system -l app.kubernetes.io/managed-by!=Helm --field-selector metadata.name=redis-pvc --ignore-not-found || true
kubectl delete deploy -n kubesphere-system --all --ignore-not-found
kubectl delete svc -n kubesphere-system --all --ignore-not-found
kubectl delete cm -n kubesphere-system --all --ignore-not-found
kubectl delete secret -n kubesphere-system --all --ignore-not-found
kubectl delete sa -n kubesphere-system --all --ignore-not-found

# 删除 Gateway 资源
for gateway in `kubectl -n kubesphere-controls-system get gateways.gateway.kubesphere.io -o jsonpath="{.items[*].metadata.name}"`
do
  kubectl -n kubesphere-controls-system patch gateways.gateway.kubesphere.io $gateway -p '{"metadata":{"finalizers":null}}' --type=merge
done
kubectl -n kubesphere-controls-system delete gateways.gateway.kubesphere.io --all 2>/dev/null

# 删除crd
kubectl delete crd globalrolebindings.iam.kubesphere.io
kubectl delete crd globalroles.iam.kubesphere.io
kubectl delete crd users.iam.kubesphere.io
kubectl delete crd workspacerolebindings.iam.kubesphere.io
kubectl delete crd workspaceroles.iam.kubesphere.io 
kubectl delete crd workspaces.tenant.kubesphere.io
kubectl delete crd workspacetemplates.tenant.kubesphere.io
kubectl delete crd gateways.gateway.kubesphere.io

## 卸载 监控组件
# 删除 Prometheus/ALertmanager/ThanosRuler
kubectl -n kubesphere-monitoring-system delete Prometheus  k8s --ignore-not-found
kubectl -n kubesphere-monitoring-system delete secret additional-scrape-configs --ignore-not-found
kubectl -n kubesphere-monitoring-system delete serviceaccount prometheus-k8s --ignore-not-found
kubectl -n kubesphere-monitoring-system delete service prometheus-k8s --ignore-not-found
kubectl -n kubesphere-monitoring-system delete role prometheus-k8s-config --ignore-not-found
kubectl -n kubesphere-monitoring-system delete rolebinging prometheus-k8s-config --ignore-not-found

kubectl -n kubesphere-monitoring-system delete Alertmanager main --ignore-not-found
kubectl -n kubesphere-monitoring-system delete secret alertmanager-main --ignore-not-found
kubectl -n kubesphere-monitoring-system delete service alertmanager-main --ignore-not-found

kubectl -n kubesphere-monitoring-system delete ThanosRuler kubesphere --ignore-not-found

# 删除 ServiceMonitor/PrometheusRules
kubectl -n kubesphere-monitoring-system delete ServiceMonitor alertmanager coredns etcd ks-apiserver  kube-apiserver kube-controller-manager kube-proxy kube-scheduler kube-state-metrics kubelet node-exporter  prometheus prometheus-operator  s2i-operator  thanosruler --ignore-not-found
kubectl -n kubesphere-monitoring-system delete PrometheusRule kubesphere-rules prometheus-k8s-coredns-rules prometheus-k8s-etcd-rules prometheus-k8s-rules --ignore-not-found

# 删除 prometheus-operator
kubectl -n kubesphere-monitoring-system delete deployment prometheus-operator --ignore-not-found
kubectl -n kubesphere-monitoring-system delete service  prometheus-operator --ignore-not-found
kubectl -n kubesphere-monitoring-system delete serviceaccount prometheus-operator --ignore-not-found

# 删除 kube-state-metrics/node-exporter
kubectl -n kubesphere-monitoring-system delete deployment kube-state-metrics --ignore-not-found
kubectl -n kubesphere-monitoring-system delete service  kube-state-metrics --ignore-not-found
kubectl -n kubesphere-monitoring-system delete serviceaccount  kube-state-metrics --ignore-not-found

kubectl -n kubesphere-monitoring-system delete daemonset node-exporter --ignore-not-found
kubectl -n kubesphere-monitoring-system delete service node-exporter --ignore-not-found
kubectl -n kubesphere-monitoring-system delete serviceaccount node-exporter --ignore-not-found

# 删除 Clusterrole/ClusterRoleBinding
kubectl delete clusterrole kubesphere-prometheus-k8s kubesphere-kube-state-metrics kubesphere-node-exporter kubesphere-prometheus-operator
kubectl delete clusterrolebinding kubesphere-prometheus-k8s kubesphere-kube-state-metrics kubesphere-node-exporter kubesphere-prometheus-operator

# 删除 notification-manager
helm delete notification-manager -n kubesphere-monitoring-system

# 清理 kubesphere-monitoring-system
kubectl delete deploy -n kubesphere-monitoring-system --all --ignore-not-found

# 删除监控 crd
kubectl delete crd alertmanagerconfigs.monitoring.coreos.com
kubectl delete crd alertmanagers.monitoring.coreos.com
kubectl delete crd podmonitors.monitoring.coreos.com
kubectl delete crd probes.monitoring.coreos.com
kubectl delete crd prometheusagents.monitoring.coreos.com
kubectl delete crd prometheuses.monitoring.coreos.com
kubectl delete crd prometheusrules.monitoring.coreos.com
kubectl delete crd scrapeconfigs.monitoring.coreos.com
kubectl delete crd servicemonitors.monitoring.coreos.com
kubectl delete crd thanosrulers.monitoring.coreos.com
kubectl delete crd clusterdashboards.monitoring.kubesphere.io
kubectl delete crd dashboards.monitoring.kubesphere.io

# 删除 metrics-server
kubectl delete apiservice v1beta1.metrics.k8s.io
kubectl -n kube-system delete deploy metrics-server
kubectl -n kube-system delete service metrics-server
kubectl delete ClusterRoleBinding system:metrics-server
kubectl delete ClusterRoleBinding metrics-server:system:auth-delegator
kubectl -n kube-system delete RoleBinding  metrics-server-auth-reader
kubectl delete ClusterRole system:metrics-server
kubectl delete ClusterRole system:aggregated-metrics-reader
kubectl -n kube-system delete ServiceAccount ServiceAccount

## 卸载 日志组件
# 删除 fluent-bit
kubectl -n kubesphere-logging-system delete fluentbitconfigs fluent-bit-config --ignore-not-found
kubectl -n kubesphere-logging-system patch fluentbit fluent-bit -p '{"metadata":{"finalizers":null}}' --type=merge
kubectl -n kubesphere-logging-system delete fluentbit fluent-bit --ignore-not-found

# 删除 ks-logging
helm del -n kubesphere-logging-system logsidecar-injector &> /dev/null || true

# 删除 ks-events
helm del -n kubesphere-logging-system ks-events &> /dev/null || true

# 删除 kube-auditing
helm del -n kubesphere-logging-system kube-auditing &> /dev/null || true

# 删除 es 
helm del -n kubesphere-logging-system elasticsearch-logging &> /dev/null || true
helm del -n kubesphere-logging-system elasticsearch-logging-curator &> /dev/null || true

# 删除 opensearch
helm del -n kubesphere-logging-system opensearch-master &> /dev/null || true
helm del -n kubesphere-logging-system opensearch-data &> /dev/null || true
helm del -n kubesphere-logging-system opensearch-logging-curator &> /dev/null || true

# 清理 kubesphere-logging-system
kubectl delete deploy -n kubesphere-logging-system --all --ignore-not-found

```

#### 检查 Namespace 标签

确认所有 Namespace 不包含 `kubesphere.io/workspace` 标签。

```
kubectl get ns --show-labels
```

#### 卸载 Kubefed（Host 集群）

```
helm del -n kube-federation-system kubefed
```

## 安装 KubeSphere 4.1.2

### 升级 CRD

```
# 下载 ks-core chart 包
# 如果无法访问 charts.kubesphere.io, 可将 charts.kubesphere.io 替换为 charts.kubesphere.com.cn 
helm fetch https://charts.kubesphere.io/main/ks-core-1.1.3.tgz --untar


# 更新 crds 
kubectl apply -f ks-core/charts/ks-crds/crds/
```

### Host 集群安装 ks-core

自 KubeSphere v4.1 开始，仅需在 Host 集群部署 ks-core 即可，Member 集群通过页面添加（切勿在 Member 集群再次部署 ks-core）。

```
# 该命令仅需在 host 集群上执行
# 如果访问 dockerhub 受限，在以下命令中添加 
# --set global.imageRegistry=swr.cn-southwest-2.myhuaweicloud.com/ks 
# --set extension.imageRegistry=swr.cn-southwest-2.myhuaweicloud.com/ks 
# 如果无法访问 charts.kubesphere.io, 可将 charts.kubesphere.io 替换为 charts.kubesphere.com.cn

helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.3.tgz --debug --wait
```

### 添加 Member 集群

Host 集群部署好之后，进入工作台点击**集群管理**：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-2.png)

点击**添加集群**：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-3.png)

填写集群信息，并点击**下一步**：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-4.png)

填写 Member 集群 Kubeconfig：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-5.png)

填写集群配置：

```
# 如果访问 dockerhub 受限，此处可填，如果能够正常访问 dockerhub，可跳过该步骤。
global:
  imageRegistry: swr.cn-southwest-2.myhuaweicloud.com/ks
```

![](http://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-6.png)

点击创建后等待 Member 集群上的 ks-agent 创建成功。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-7.png)

### Gateway 迁移

#### 安装 Gateway 组件

安装 KubeSphere 网关扩展组件，并为需要使用网关的集群安装 Gateway 扩展组件 Agent。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-8.png)

#### 将使用了项目网关的项目加入目标企业空间

执行卸载脚本时，会删除项目的企业空间关联关系，需将使用了项目网关的项目重新加入新的目标企业空间中。

#### 迁移项目网关到新版本

**注意：该步骤会导致项目网关中断，需提前考虑业务影响。**

##### 删除待迁移项目网关

如需保证访问端口不变，删除前务必记录对应网关的 Nodeport 信息或者 LoadBalancer 信息，以便在新创建网关时保留原有配置。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-9.png)

##### 新建项目网关

通过企业空间进入到项目的项目设置中的网关设置。

以保留原有网关的 Nodeport 为例：

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-10.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-11.png)

点击确定。

##### 关联应用路由至新建网关

待新的项目网关创建成功后，在网关页面中点击管理->编辑，复制其中的 IngressClassName。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-12.png)

针对当前项目下的应用路由，点击编辑 YAML。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-13.png)

Spec 添加 ingressClassName: xxx，保存。

![](https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-install-guide-14.png)

## 总结

以上就是 KubeSphere v4 安装的完整步骤，供大家参考。如果您在安装过程中出现问题，可去论坛搜索是否有解答，如没有，可在论坛提问： https://ask.kubesphere.io/forum/。

