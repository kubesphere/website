---
title: '使用 KubeEye 为你的 K8s 集群安全保驾护航'
tag: 'Kubernetes, KubeEye'
keywords: 'Kubernetes, KubeSphere, KubeEye, 集群, 新版本发布'
description: 'KubeEye 是一款 Kubernetes 安全及配置问题检测工具，针对部署在 K8s 集群中的业务应用进行配置检测使用 OPA,针对集群部署的 Node 使用 Node-Problem-Detector 进行检测，同时除了系统内置有根据大多数业界常见场景的预定义规则，还支持用户自定义规则来进行集群检测。'
createTime: '2022-04-19'
author: '薛磊'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/k8s-kubeeye-cover.png'
---

## 前言

KubeEye 是一款 Kubernetes 安全及配置问题检测工具，针对部署在 K8s 集群中的业务应用进行配置检测使用 [OPA](https://github.com/open-policy-agent/opa),针对集群部署的 Node 使用 [Node-Problem-Detector](https://github.com/kubernetes/node-problem-detector) 进行检测，同时除了系统内置有根据大多数业界常见场景的预定义规则，还支持用户自定义规则来进行集群检测。

## 架构

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeeye-architecture.png)

KubeEye 通过调用 Kubernetes API，通过匹配资源中的关键字和容器语法的规则匹配来获取集群诊断数据，详见架构图。

其中针对 Node 节点的检测，需要在被检测 Node 主机上安装。

## 特点

### 特性

- KubeEye 根据行业最佳实践审查你的工作负载 YAML 规范，帮助你使你的集群稳定。
- KubeEye 可以发现你的集群控制平面的问题，包括 kube-apiserver/kube-controller-manager/etcd 等。
- KubeEye 可以帮助你检测各种节点问题，包括内存/CPU/磁盘压力，意外的内核错误日志等。

### 检查项

| 是/否 | 检查项                     | 描述                                           | 级别 |
| ----- | -------------------------- | ---------------------------------------------- | ---- |
| ✅     | PrivilegeEscalationAllowed | 允许特权升级                                   | 紧急 |
| ✅     | CanImpersonateUser         | role/clusterrole 有伪装成其他用户权限          | 警告 |
| ✅     | CanDeleteResources         | role/clusterrole 有删除 Kubernetes 资源权限    | 警告 |
| ✅     | CanModifyWorkloads         | role/clusterrole 有修改 Kubernetes 资源权限    | 警告 |
| ✅     | NoCPULimits                | 资源没有设置 CPU 使用限制                      | 紧急 |
| ✅     | NoCPURequests              | 资源没有设置预留 CPU                           | 紧急 |
| ✅     | HighRiskCapabilities       | 开启了高危功能，例如 ALL/SYS_ADMIN/NET_ADMIN   | 紧急 |
| ✅     | HostIPCAllowed             | 开启了主机 IPC                                 | 紧急 |
| ✅     | HostNetworkAllowed         | 开启了主机网络                                 | 紧急 |
| ✅     | HostPIDAllowed             | 开启了主机 PID                                  | 紧急 |
| ✅     | HostPortAllowed            | 开启了主机端口                                 | 紧急 |
| ✅     | ImagePullPolicyNotAlways   | 镜像拉取策略不是 always                        | 警告 |
| ✅     | ImageTagIsLatest           | 镜像标签是 latest                              | 警告 |
| ✅     | ImageTagMiss               | 镜像没有标签                                   | 紧急 |
| ✅     | InsecureCapabilities       | 开启了不安全的功能，例如 KILL/SYS_CHROOT/CHOWN | 警告 |
| ✅     | NoLivenessProbe            | 没有设置存活状态检查                           | 警告 |
| ✅     | NoMemoryLimits             | 资源没有设置内存使用限制                       | 紧急 |
| ✅     | NoMemoryRequests           | 资源没有设置预留内存                           | 紧急 |
| ✅     | NoPriorityClassName        | 没有设置资源调度优先级                         | 通知 |
| ✅     | PrivilegedAllowed          | 以特权模式运行资源                             | 紧急 |
| ✅     | NoReadinessProbe           | 没有设置就绪状态检查                           | 警告 |
| ✅     | NotReadOnlyRootFilesystem  | 没有设置根文件系统为只读                       | 警告 |
| ✅     | NotRunAsNonRoot            | 没有设置禁止以 root 用户启动进程               | 警告 |
| ✅     | CertificateExpiredPeriod   | 将检查 API Server 证书的到期日期少于 30 天        | 紧急 |
| ✅     | EventAudit                 | 事件检查                                       | 警告 |
| ✅     | NodeStatus                 | 节点状态检查                                   | 警告 |
| ✅     | DockerStatus               | Docker 状态检查                                | 警告 |
| ✅     | KubeletStatus              | Kubelet 状态检查                               | 警告 |

## 部署

KubeEye 本身使用 Golang 编写，可使用编译好的二进制可执行文件进行相关组件安装。

### 安装

#### 二进制安装

```shell
wget https://github.com/kubesphere/kubeeye/releases/download/v0.3.0/kubeeye-0.3.0-linux-amd64.tar.gz
tar -zxvf kubeeye-0.3.0-linux-amd64.tar.gz
mv kubeeye /usr/bin/
```

#### 源码编译安装

```shell
git clone https://github.com/kubesphere/kubeeye.git
cd kubeeye 
make installke
```

### 安装 NPD

针对集群 Node 主机的检测，kubeEye 采用 [Node-problem-Detector](https://github.com/kubernetes/node-problem-detector) ，需要在 Node 主机节点进行安装，KubeEye 封装安装命令，可以进行一键安装。

⚠️注意：这将在你的集群上安装 NPD，只有当你想要详细的节点报告时才需要。

```
[root@VM-48-7-centos ~]# kubeeye install -e npd
kube-system 	 ConfigMap 	 node-problem-detector-config 	 created
kube-system 	 DaemonSet 	 node-problem-detector 	 created
```

其主要在 kube-system 名称空间创建 node-problem-detector-config 的 ConfigMap 和 node-problem-detector DaemonSet。

### 集群中运行 KubeEye

kubeEye 除了可以一次性使用工具运行，同时 kubeEye 也是一个 Operator，可以运行在集群内部，进行长久的持续对集群进行检测。

#### Kubernetes 中部署 KubeEye

```shell
kubectl apply -f https://raw.githubusercontent.com/kubesphere/kubeeye/main/deploy/kubeeye.yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/kubeeye/main/deploy/kubeeye_insights.yaml
```

#### 查看 KubeEye 巡检结果

```shell
$ kubectl get clusterinsight -o yaml

apiVersion: v1
items:
- apiVersion: kubeeye.kubesphere.io/v1alpha1
  kind: ClusterInsight
  metadata:
    name: clusterinsight-sample
    namespace: default
  spec:
    auditPeriod: 24h
  status:
    auditResults:
      auditResults:
      - resourcesType: Node
        resultInfos:
        - namespace: ""
          resourceInfos:
          - items:
            - level: waring
              message: KubeletHasNoSufficientMemory
              reason: kubelet has no sufficient memory available
            - level: waring
              message: KubeletHasNoSufficientPID
              reason: kubelet has no sufficient PID available
            - level: waring
              message: KubeletHasDiskPressure
              reason: kubelet has disk pressure
            name: kubeeyeNode
```

## 测试

### 命令选项

```shell
[root@VM-48-7-centos ~]# kubeeye -h
KubeEye finds various problems on Kubernetes cluster.

Usage:
  ke [command]

Available Commands:
  audit       audit resources from the cluster
  completion  generate the autocompletion script for the specified shell
  help        Help about any command
  install     A brief description of your command
  uninstall   A brief description of your command

Flags:
  -f, --config string         Specify the path of kubeconfig.
  -h, --help                  help for ke
      --kubeconfig string     Paths to a kubeconfig. Only required if out-of-cluster.
      --master --kubeconfig   (Deprecated: switch to --kubeconfig) The address of the Kubernetes API server. Overrides any value in kubeconfig. Only required if out-of-cluster.
```

可以看到 KubeEye 目前主要支持两个命令，一个为 install package 例如 NPD，另外一个执行 audit，对集群应用进行配置扫描。

### audit

```shell
[root@VM-48-7-centos ~]# kubeeye audit
KIND         NAMESPACE         NAME                                           MESSAGE
Deployment   dddd              jenkins-1644220286                             [NoCPULimits ImagePullPolicyNotAlways NoMemoryLimits NoPriorityClassName NotReadOnlyRootFilesystem NotRunAsNonRoot]
Deployment   jenkins           jenkins-1644220286                             [NoCPULimits ImagePullPolicyNotAlways NoMemoryLimits NoPriorityClassName NotReadOnlyRootFilesystem NotRunAsNonRoot]
Deployment   smartkm-api-k8s   velero                                         [ImageTagIsLatest NoLivenessProbe NoPriorityClassName NotReadOnlyRootFilesystem NoReadinessProbe NotRunAsNonRoot]
DaemonSet    smartkm-api-k8s   restic                                         [ImageTagIsLatest NoLivenessProbe NoPriorityClassName NotReadOnlyRootFilesystem NoReadinessProbe NotRunAsNonRoot]
Node                           minikube                                       [KernelHasNoDeadlock FilesystemIsNotReadOnly KubeletHasSufficientMemory KubeletHasNoDiskPressure KubeletHasSufficientPID]
Event        kube-system       node-problem-detector-dmsws.16d844532f662318   [Failed to pull image "k8s.gcr.io/node-problem-detector/node-problem-detector:v0.8.7": rpc error: code = Unknown desc = Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)]
Event        kube-system       node-problem-detector-dmsws.16d844532f66703e   [Error: ErrImagePull]
Event        kube-system       node-problem-detector-dmsws.16d84453351b8b19   [Error: ImagePullBackOff]	
```

### 添加自定义检查规则

我们利用命令查看预定义 OPA 检查规则。

```shell
kubectl get cm -n kube-system node-problem-detector-config -oyaml
```

同时也可以根据自己业务创建自定义检查规则。

- 创建 OPA 规则存放目录

```
mkdir opa
```

- 添加自定义 OPA 规则文件

> 注意：为检查工作负载设置的 OPA 规则， Package 名称必须是 *kubeeye_workloads_rego* 为检查 RBAC 设置的 OPA 规则， Package 名称必须是 *kubeeye_RBAC_rego* 为检查节点设置的 OPA 规则， Package 名称必须是 *kubeeye_nodes_rego*

- 以下为检查镜像仓库地址规则，保存以下规则到规则文件 *imageRegistryRule.rego*

```
package kubeeye_workloads_rego

deny[msg] {
    resource := input
    type := resource.Object.kind
    resourcename := resource.Object.metadata.name
    resourcenamespace := resource.Object.metadata.namespace
    workloadsType := {"Deployment","ReplicaSet","DaemonSet","StatefulSet","Job"}
    workloadsType[type]

    not workloadsImageRegistryRule(resource)

    msg := {
        "Name": sprintf("%v", [resourcename]),
        "Namespace": sprintf("%v", [resourcenamespace]),
        "Type": sprintf("%v", [type]),
        "Message": "ImageRegistryNotmyregistry"
    }
}

workloadsImageRegistryRule(resource) {
    regex.match("^myregistry.public.kubesphere/basic/.+", resource.Object.spec.template.spec.containers[_].image)
}
```

- 使用额外的规则运行 KubeEye。

> 提示：KubeEye 将读取指定目录下所有 *.rego* 结尾的文件	

```
kubeeye audit -p ./opa
```

## 问题排查

* NPD 安装异常，默认使用 k8s.gcr.io，如果安装服务器无法连通公网可使用我的镜像仓库：1832990/node-problem-detector:v0.8.7。
* KubeEye 安装使用默认使用主机 `$HOME/.kube/config` 文件，如果不存在 K8s config 文件，则无法正常运行。

## 参考链接

<<<<<<< HEAD
*  https://github.com/kubesphere/kubeeye/
=======
*  https://github.com/kubesphere/kubeeye/
>>>>>>> 77b43b07 (add new blog of kubeeye)
