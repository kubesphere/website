---
title: 'KubeSphere 开源 KubeEye：Kubernetes 集群自动巡检工具'
keywords: 'KubeEye, Kubernetes, 集群巡检'
description: 'KubeEye 是一款开源的集群自动巡检工具，旨在发现 Kubernetes 上的各种问题，比如应用配置错误、集群组件不健康和节点问题。'
tag: 'Kubernetes, 集群巡检'
createTime: '2021-01-29'
author: '李林'
snapshot: '/images/blogs/en/kubeeye-diagnostics-tool-introduction/kubeeye-logo-vertical-blog-banner.jpg'
---

## 为什么开源 KubeEye

Kubernetes 作为容器编排的事实标准，虽然架构优雅功能也非常强大，但是 Kubernetes 在日常运行过程中总会有一些疑难杂症和隐性的问题让集群管理员和 Yaml 工程师们非常头疼。

- 基础设施守护进程问题：ntp 服务中断；
- 硬件问题：如 CPU，内存或磁盘异常；
- 内核问题：内核死锁，文件系统损坏；
- 容器运行时问题：运行时守护进程无响应；
- ···

这样的问题还有很多，并且这些隐性的异常问题对集群的控制面来说是不可见的，因此 Kubernetes 将继续将 Pod 调度到异常的节点，进而造成集群和运行的应用带来非常大的安全与稳定性的风险。

## 什么是 KubeEye

KubeEye 是一款**开源的集群自动巡检工具**，旨在发现 Kubernetes 上的各种问题，比如应用配置错误、集群组件不健康和节点问题。KubeEye 使用 Go 语言基于 [Polaris](https://github.com/FairwindsOps/polaris) 和 [Node-Problem-Detector](https://github.com/kubernetes/node-problem-detector) 开发，内置了一系列异常检测规则。除了预定义的规则，它还支持自定义规则。

## KubeEye 能做什么

- 发现与检测 Kubernetes 集群控制平面的问题，包括 **kube-apiserver/kube-controller-manager/etcd** 等；
- 帮助你检测 Kubernetes 的各种节点问题，包括内存/CPU/磁盘压力，意外的内核错误日志等；
- 根据行业最佳实践验证你的工作负载 yaml 规范，帮助你使你的集群稳定。

## 架构图

KubeEye 通过调用 Kubernetes API，通过常规匹配日志中的关键错误信息和容器语法的规则匹配来获取集群诊断数据，详见架构。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubeeye-architecture.png)

## 内置检查项

| 是/否 | 检查项                                      | 描述                                                         |
| ----- | ------------------------------------------- | ------------------------------------------------------------ |
| √     | ETCDHealthStatus                            | 如果 etcd 启动并正常运行                                     |
| √     | ControllerManagerHealthStatus               | 如果 kubernetes kube-controller-manager 正常启动并运行       |
| √     | SchedulerHealthStatus                       | 如果 kubernetes kube-schedule 正常启动并运行                 |
| √     | NodeMemory                                  | 如果节点内存使用量超过阈值                                   |
| √     | DockerHealthStatus                          | 如果 docker 正常运行                                         |
| √     | NodeDisk                                    | 如果节点磁盘使用量超过阈值                                   |
| √     | KubeletHealthStatus                         | 如果 kubelet 激活状态且正常运行                              |
| √     | NodeCPU                                     | 如果节点 CPU 使用量超过阈值                                  |
| √     | NodeCorruptOverlay2                         | Overlay2 不可用                                              |
| √     | NodeKernelNULLPointer                       | node 显示 NotReady                                           |
| √     | NodeDeadlock                                | 死锁是指两个或两个以上的进程在争夺资源时互相等待的现象。     |
| √     | NodeOOM                                     | 监控那些消耗过多内存的进程，尤其是那些消耗大量内存非常快的进程，内核会杀掉它们，防止它们耗尽内存 |
| √     | NodeExt4Error                               | Ext4 挂载失败                                                |
| √     | NodeTaskHung                                | 检查D状态下是否有超过 120s 的进程                            |
| √     | NodeUnregisterNetDevice                     | 检查对应网络                                                 |
| √     | NodeCorruptDockerImage                      | 检查 docker 镜像                                             |
| √     | NodeAUFSUmountHung                          | 检查存储                                                     |
| √     | NodeDockerHung                              | Docker hang住, 检查 docker 的日志                            |
| √     | PodSetLivenessProbe                         | 如果为pod中的每一个容器设置了 livenessProbe                  |
| √     | PodSetTagNotSpecified                       | 镜像地址没有声明标签或标签是最新                             |
| √     | PodSetRunAsPrivileged                       | 以特权模式运行 Pod 意味着 Pod 可以访问主机的资源和内核功能   |
| √     | PodSetImagePullBackOff                      | Pod 无法正确拉出镜像，因此可以在相应节点上手动拉出镜像       |
| √     | PodSetImageRegistry                         | 检查镜像形式是否在相应仓库                                   |
| √     | PodSetCpuLimitsMissing                      | 未声明 CPU 资源限制                                          |
| √     | PodNoSuchFileOrDirectory                    | 进入容器查看相应文件是否存在                                 |
| √     | PodIOError                                  | 这通常是由于文件 IO 性能瓶颈                                 |
| √     | PodNoSuchDeviceOrAddress                    | 检查对应网络                                                 |
| √     | PodInvalidArgument                          | 检查对应存储                                                 |
| √     | PodDeviceOrResourceBusy                     | 检查对应的目录和 PID                                         |
| √     | PodFileExists                               | 检查现有文件                                                 |
| √     | PodTooManyOpenFiles                         | 程序打开的文件/套接字连接数超过系统设置值                    |
| √     | PodNoSpaceLeftOnDevice                      | 检查磁盘和索引节点的使用情况                                 |
| √     | NodeApiServerExpiredPeriod                  | 将检查 ApiServer 证书的到期日期少于30天                      |
| √     | PodSetCpuRequestsMissing                    | 未声明 CPU 资源请求值                                        |
| √     | PodSetHostIPCSet                            | 设置主机 IP                                                  |
| √     | PodSetHostNetworkSet                        | 设置主机网络                                                 |
| √     | PodHostPIDSet                               | 设置主机 PID                                                 |
| √     | PodMemoryRequestsMiss                       | 没有声明内存资源请求值                                       |
| √     | PodSetHostPort                              | 设置主机端口                                                 |
| √     | PodSetMemoryLimitsMissing                   | 没有声明内存资源限制值                                       |
| √     | PodNotReadOnlyRootFiles                     | 文件系统未设置为只读                                         |
| √     | PodSetPullPolicyNotAlways                   | 镜像拉策略并非总是如此                                       |
| √     | PodSetRunAsRootAllowed                      | 以 root 用户执行                                             |
| √     | PodDangerousCapabilities                    | 您在 ALL / SYS_ADMIN / NET_ADMIN 等功能中有危险的选择        |
| √     | PodlivenessProbeMissing                     | 未声明 ReadinessProbe                                        |
| √     | privilegeEscalationAllowed                  | 允许特权升级                                                 |
|       | NodeNotReadyAndUseOfClosedNetworkConnection | http                                                                        2-max-streams-per-connection |
|       | NodeNotReady                                | 无法启动 ContainerManager 无法设置属性 TasksAccounting 或未知属性 |


## 怎么使用

- 机器上安装 KubeEye

  - 从 [Releases](https://github.com/kubesphere/kubeeye/releases) 中下载预构建的可执行文件。
  - 或者你也可以从源代码构建

  ```
  git clone https://github.com/kubesphere/kubeeye.git
  cd kubeeye 
  make install
  ```

- [可选] 安装 Node-problem-Detector  
 注意：这一行将在你的集群上安装 npd，只有当你想要详细的报告时才需要。
  `ke install npd`  

- KubeEye 执行自动巡检：

```
root@node1:# ke diag
NODENAME        SEVERITY     HEARTBEATTIME               REASON              MESSAGE
node18          Fatal        2020-11-19T10:32:03+08:00   NodeStatusUnknown   Kubelet stopped posting node status.
node19          Fatal        2020-11-19T10:31:37+08:00   NodeStatusUnknown   Kubelet stopped posting node status.
node2           Fatal        2020-11-19T10:31:14+08:00   NodeStatusUnknown   Kubelet stopped posting node status.
node3           Fatal        2020-11-27T17:36:53+08:00   KubeletNotReady     Container runtime not ready: RuntimeReady=false reason:DockerDaemonNotReady message:docker: failed to get docker version: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

NAME            SEVERITY     TIME                        MESSAGE
scheduler       Fatal        2020-11-27T17:09:59+08:00   Get http://127.0.0.1:10251/healthz: dial tcp 127.0.0.1:10251: connect: connection refused
etcd-0          Fatal        2020-11-27T17:56:37+08:00   Get https://192.168.13.8:2379/health: dial tcp 192.168.13.8:2379: connect: connection refused

NAMESPACE       SEVERITY     PODNAME                                          EVENTTIME                   REASON                MESSAGE
default         Warning      node3.164b53d23ea79fc7                           2020-11-27T17:37:34+08:00   ContainerGCFailed     rpc error: code = Unknown desc = Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
default         Warning      node3.164b553ca5740aae                           2020-11-27T18:03:31+08:00   FreeDiskSpaceFailed   failed to garbage collect required amount of images. Wanted to free 5399374233 bytes, but freed 416077545 bytes
default         Warning      nginx-b8ffcf679-q4n9v.16491643e6b68cd7           2020-11-27T17:09:24+08:00   Failed                Error: ImagePullBackOff
default         Warning      node3.164b5861e041a60e                           2020-11-27T19:01:09+08:00   SystemOOM             System OOM encountered, victim process: stress, pid: 16713
default         Warning      node3.164b58660f8d4590                           2020-11-27T19:01:27+08:00   OOMKilling            Out of memory: Kill process 16711 (stress) score 205 or sacrifice child Killed process 16711 (stress), UID 0, total-vm:826516kB, anon-rss:819296kB, file-rss:0kB, shmem-rss:0kB
insights-agent  Warning      workloads-1606467120.164b519ca8c67416            2020-11-27T16:57:05+08:00   DeadlineExceeded      Job was active longer than specified deadline
kube-system     Warning      calico-node-zvl9t.164b3dc50580845d               2020-11-27T17:09:35+08:00   DNSConfigForming      Nameserver limits were exceeded, some nameservers have been omitted, the applied nameserver line is: 100.64.11.3 114.114.114.114 119.29.29.29
kube-system     Warning      kube-proxy-4bnn7.164b3dc4f4c4125d                2020-11-27T17:09:09+08:00   DNSConfigForming      Nameserver limits were exceeded, some nameservers have been omitted, the applied nameserver line is: 100.64.11.3 114.114.114.114 119.29.29.29
kube-system     Warning      nodelocaldns-2zbhh.164b3dc4f42d358b              2020-11-27T17:09:14+08:00   DNSConfigForming      Nameserver limits were exceeded, some nameservers have been omitted, the applied nameserver line is: 100.64.11.3 114.114.114.114 119.29.29.29


NAMESPACE       SEVERITY     NAME                      KIND         TIME                        MESSAGE
kube-system     Warning      node-problem-detector     DaemonSet    2020-11-27T17:09:59+08:00   [livenessProbeMissing runAsPrivileged]
kube-system     Warning      calico-node               DaemonSet    2020-11-27T17:09:59+08:00   [runAsPrivileged cpuLimitsMissing]
kube-system     Warning      nodelocaldns              DaemonSet    2020-11-27T17:09:59+08:00   [cpuLimitsMissing runAsPrivileged]
default         Warning      nginx                     Deployment   2020-11-27T17:09:59+08:00   [cpuLimitsMissing livenessProbeMissing tagNotSpecified]
insights-agent  Warning      workloads                 CronJob      2020-11-27T17:09:59+08:00   [livenessProbeMissing]
insights-agent  Warning      cronjob-executor          Job          2020-11-27T17:09:59+08:00   [livenessProbeMissing]
kube-system     Warning      calico-kube-controllers   Deployment   2020-11-27T17:09:59+08:00   [cpuLimitsMissing livenessProbeMissing]
kube-system     Warning      coredns                   Deployment   2020-11-27T17:09:59+08:00   [cpuLimitsMissing]   
```

> 可参考常见 [FAQ](https://github.com/kubesphere/kubeeye/blob/main/docs/FAQ.md)内容来优化您的集群。


## 添加自定义检查规则

除了上述预置的巡检项目与规则，KubeEye 还支持自定义检查规则，来看个例子：

### 添加 npd 自定义检查规则

- 安装 NPD 指令 `ke install npd`
- 由 kubectl 编辑 configmap kube-system/node-problem-detector-config,

``` 
kubectl edit cm -n kube-system node-problem-detector-config
```

- 在 configMap 的规则下添加异常日志信息，规则遵循正则表达式。

### 自定义最佳实践规则

- 准备一个规则 yaml，例如，下面的规则将验证你的 Pod 规范，以确保镜像只来自授权的注册处。

```
checks:
  imageFromUnauthorizedRegistry: warning

customChecks:
  imageFromUnauthorizedRegistry:
    promptMessage: When the corresponding rule does not match. Show that image from an unauthorized registry.
    category: Images
    target: Container
    schema:
      '$schema': http://json-schema.org/draft-07/schema
      type: object
      properties:
        image:
          type: string
          not:
            pattern: ^quay.io
```

- 将上述规则保存为 yaml，例如 `rule.yaml`。

- 用 `rule.yaml` 运行 KubeEye。

```
root:# ke diag -f rule.yaml --kubeconfig ~/.kube/config
NAMESPACE     SEVERITY    NAME                      KIND         TIME                        MESSAGE
default       Warning     nginx                     Deployment   2020-11-27T17:18:31+08:00   [imageFromUnauthorizedRegistry]
kube-system   Warning     node-problem-detector     DaemonSet    2020-11-27T17:18:31+08:00   [livenessProbeMissing runAsPrivileged]
kube-system   Warning     calico-node               DaemonSet    2020-11-27T17:18:31+08:00   [cpuLimitsMissing runAsPrivileged]
kube-system   Warning     calico-kube-controllers   Deployment   2020-11-27T17:18:31+08:00   [cpuLimitsMissing livenessProbeMissing]
kube-system   Warning     nodelocaldns              DaemonSet    2020-11-27T17:18:31+08:00   [runAsPrivileged cpuLimitsMissing]
default       Warning     nginx                     Deployment   2020-11-27T17:18:31+08:00   [livenessProbeMissing cpuLimitsMissing]
kube-system   Warning     coredns                   Deployment   2020-11-27T17:18:31+08:00   [cpuLimitsMissing]
```

## Roadmap

- 支持更细粒度的巡检项，例如集群响应速度慢
- 支持对巡检结果生成集群巡检报告
- 支持集群巡检报告导出为 CSV 格式或 HTML 文件

你还希望 KubeEye 提供什么样的特性呢？欢迎来 Github 提交建议或需求~

[GitHub 地址](https://github.com/kubesphere/kubeeye)

## 参考链接

[KubeEye Release](https://github.com/kubesphere/kubeeye/releases)

[KubeEye FAQ 文档](https://github.com/kubesphere/kubeeye/blob/main/docs/FAQ.md)

[Node-Problem-Detector](https://github.com/kubernetes/node-problem-detector)