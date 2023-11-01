---
title: 'ARM 版 openEuler 22.03 部署 KubeSphere 3.4.0 不完全指南续篇'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, openEuler, ARM '
description: '本文主要实战演示了在 ARM 版 openEuler 22.03 LTS SP2 服务器上，利用 KubeKey v3.0.10 自动化部署最小化 KubeSphere v3.4.0 和 Kubernetes v1.26.5 高可用集群的详细过程。'
createTime: '2023-10-31'
author: '运维有术'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.4-on-openeuler-cover.png'
---

## 前言

### 知识点

- 定级：**入门级**
- KubeKey 安装部署 ARM 版 KubeSphere 和 Kubernetes
- ARM 版 KubeSphere 和 Kubernetes 常见问题

### 实战服务器配置 (个人云上测试服务器)

|   主机名    |      IP      | CPU | 内存 | 系统盘 | 数据盘 |         用途          |
| :---------: | :----------: | :-: | :--: | :----: | :----: | :-------------------: |
| ks-master-1 | 172.16.33.16 |  6  |  16  |   50   |  200   | KubeSphere/k8s-master |
| ks-master-2 | 172.16.33.22 |  6  |  16  |   50   |  200   | KubeSphere/k8s-master |
| ks-master-3 | 172.16.33.23 |  6  |  16  |   50   |  200   | KubeSphere/k8s-master |
|    合计     |      10      | 18  |  48  |  150   |  600+  |                       |

### 实战环境涉及软件版本信息

- 服务器芯片：**Kunpeng-920**

- 操作系统：**openEuler 22.03 LTS SP2 aarch64**

- KubeSphere：**v3.4.0**

- Kubernetes：**v1.26.5**

- Containerd：**1.6.4**

- KubeKey: **v3.0.10**

## 1. 本文简介

本文是 [ARM 版 openEuler 22.03 部署 KubeSphere 3.4.0 不完全指南](https://kubesphere.io/zh/blogs/deploy-kubesphere-v3.4.0-on-arm-openeuler/) 的续集，受限于字符数量限制，将完整的文档拆成了两篇。

上篇我们完成了 KubeSphere 和 Kubernetes 集群的部署，下篇我们主要介绍以下两个主题内容：

- 部署测试资源验证 KubeSphere 和 Kubernetes 的基本功能是否正常
- 解决 ARM 版 KubeSphere 和 Kubernetes 服务组件异常的问题（**本文核心价值**）

KubeSphere 和 Kubernetes 在 ARM 架构 和 X86 架构的服务器上部署，最大的区别在于所有服务使用的**容器镜像架构类型**的不同，KubeSphere 开源版对于 ARM 架构的默认支持可以实现 KubeSphere-Core 功能，即可以实现最小化的 KubeSphere 和完整的 Kubernetes 集群的部署。当启用了 KubeSphere 可插拔组件时，会遇到个别组件部署失败的情况，需要我们手工替换官方或是第三方提供的 ARM 版镜像或是根据官方源码手工构建 ARM 版镜像。

本文详细的记录了在完成最终部署的过程中，遇到的各种问题报错及相应的解决方案。由于能力有限，本文中所遇到的架构不兼容的问题，均采用了手工替换第三方仓库或是官方其他仓库相同或是相似 ARM 版本镜像的方案。

建议计划在生产中使用的读者最好能具备使用官方源码及 DockerFile 构建与 X86 版本完全相同的 ARM 版容器镜像的能力，不要替换相近版本或是使用第三方镜像。也正是因为本文并没有涉及利用官方源码及 Dockerfile 构建 ARM 镜像的相关内容，所以才取名为**不完全指南**。

## 2. 安装过程中出现的异常及解决方案

### 2.1 Kubernetes 相关组件二进制包格式不匹配

- 报错现象

```bash
# containerd 启动失败
Oct 12 10:44:00 KP-Euler-ZH-01 systemd[1]: Starting containerd container runtime...
Oct 12 10:44:00 KP-Euler-ZH-01 (ntainerd)[27271]: containerd.service: Failed to execute /usr/bin/containerd: Exec format error
Oct 12 10:44:00 KP-Euler-ZH-01 (ntainerd)[27271]: containerd.service: Failed at step EXEC spawning /usr/bin/containerd: Exec format error
Oct 12 10:44:00 KP-Euler-ZH-01 systemd[1]: containerd.service: Main process exited, code=exited, status=203/EXEC
Oct 12 10:44:00 KP-Euler-ZH-01 systemd[1]: containerd.service: Failed with result 'exit-code'.
Oct 12 10:44:00 KP-Euler-ZH-01 systemd[1]: Failed to start containerd container runtime.
Oct 12 10:44:05 KP-Euler-ZH-01 systemd[1]: containerd.service: Scheduled restart job, restart counter is at 241.
Oct 12 10:44:05 KP-Euler-ZH-01 systemd[1]: Stopped containerd container runtime.

# 查看 kk 下载的二进制包
[root@ks-master-1 kubekey]# ll kubekey/kube/v1.26.5/ -R
kubekey/kube/v1.26.5/:
total 4
drwxr-xr-x. 2 root root 4096 Oct 12 10:18 amd64

kubekey/kube/v1.26.5/amd64:
total 211048
-rw-r--r--. 1 root root  46788608 Oct 12 10:04 kubeadm
-rw-r--r--. 1 root root  48046080 Oct 12 10:18 kubectl
-rw-r--r--. 1 root root 121277432 Oct 12 10:04 kubelet

[root@ks-master-1 kubekey]# ll kubekey/containerd/1.6.4/ -R
kubekey/containerd/1.6.4/:
total 4
drwxr-xr-x. 2 root root 4096 Oct 12 10:20 amd64

kubekey/containerd/1.6.4/amd64:
total 43396
-rw-r--r--. 1 root root 44436699 Oct 12 10:21 containerd-1.6.4-linux-amd64.tar.gz
```

- 解决方案

```bash
kk 默认下载的二进制包都是 amd64 格式的不适用于 ARM 环境，需要手工修改创建集群的配置文件
在 spec.hosts 的主机配置中增加节点的 arch 属性
```

- 正确的安装效果

安装过程日志输出比较多，本文只展示重要的一点，一定要观察下载二进制包的时候，格式为 **arm64**，其它的日志输出，为了节省篇幅这里就不展示了。

```bash
Continue this installation? [yes/no]: yes
10:49:21 CST success: [LocalHost]
10:49:21 CST [NodeBinariesModule] Download installation binaries
10:49:21 CST message: [localhost]
downloading arm64 kubeadm v1.26.5 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 43.3M  100 43.3M    0     0  1035k      0  0:00:42  0:00:42 --:--:-- 1212k
10:50:04 CST message: [localhost]
downloading arm64 kubelet v1.26.5 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  111M  100  111M    0     0  1018k      0  0:01:51  0:01:51 --:--:-- 1027k
10:51:56 CST message: [localhost]
downloading arm64 kubectl v1.26.5 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 44.3M  100 44.3M    0     0  1022k      0  0:00:44  0:00:44 --:--:-- 1081k
10:52:41 CST message: [localhost]
downloading arm64 helm v3.9.0 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 43.6M  100 43.6M    0     0  1035k      0  0:00:43  0:00:43 --:--:-- 1181k
10:53:24 CST message: [localhost]
downloading arm64 kubecni v1.2.0 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 36.2M  100 36.2M    0     0  1039k      0  0:00:35  0:00:35 --:--:-- 1236k
10:54:00 CST message: [localhost]
downloading arm64 crictl v1.24.0 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 12.7M  100 12.7M    0     0  1032k      0  0:00:12  0:00:12 --:--:-- 1080k
10:54:13 CST message: [localhost]
downloading arm64 etcd v3.4.13 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15.3M  100 15.3M    0     0  1026k      0  0:00:15  0:00:15 --:--:-- 1074k
10:54:28 CST message: [localhost]
downloading arm64 containerd 1.6.4 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 31.9M  100 31.9M    0     0  1015k      0  0:00:32  0:00:32 --:--:-- 1021k
10:55:01 CST message: [localhost]
downloading arm64 runc v1.1.1 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 8837k  100 8837k    0     0  1099k      0  0:00:08  0:00:08 --:--:-- 1182k
10:55:09 CST message: [localhost]
downloading arm64 calicoctl v3.23.2 ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 55.5M  100 55.5M    0     0  1030k      0  0:00:55  0:00:55 --:--:-- 1214k
10:56:04 CST success: [LocalHost]
```

## 3. 异常组件及解决方案

由于 KubeSphere 社区版对 ARM 的支持并不完美，默认仅能保证 KubeSphere-Core 在 ARM 架构下能部署成功，当启用了插件后，并不是所有插件都有 ARM 镜像，当没有对应 ARM 版本镜像时，系统拉取 x86 版本的镜像创建并启动服务，因此会导致架构不同引发的服务启动异常，需要根据报错信息解决异常。

解决异常的方案有以下几种：

- 使用异常组件官方其他仓库或是第三方提供的**相同版本**的 ARM 镜像（**次优**方案，优先在官方找，实在没有再找第三方用户提供的镜像）
- 使用异常组件官方其他仓库或是第三方提供的**相近版本**的 ARM 镜像（**保底**方案，仅限于研发测试环境）
- 使用官方组件源代码和 Dockerfile **自己构建** ARM 镜像（**最优**方案，因暂时能力有限，所以本文并未涉及，后续可能会有更新）

本小节的内容完整的记录了在整个部署过程中遇到的问题及相应的解决方案，也是本文的核心价值所在。

### 3.1 查看异常组件对应的 Pod

```bash
[root@ks-master-1 ~]# kubectl get pods -A -o wide | grep CrashLoopBackOff | grep -v weave
argocd                         devops-argocd-applicationset-controller-8486797d4d-72888   0/1     CrashLoopBackOff        24 (5m4s ago)    107m   10.233.103.12   ks-master-1   <none>           <none>
istio-system                   istiod-1-14-6-6576b8664b-28c44                             0/1     CrashLoopBackOff        25 (43s ago)     107m   10.233.102.8    ks-master-2   <none>           <none>
kubesphere-controls-system     default-http-backend-767cdb5fdc-ptqhh                      0/1     CrashLoopBackOff        24 (5m5s ago)    108m   10.233.93.9     ks-master-3   <none>           <none>
kubesphere-devops-system       devops-jenkins-774fdb948b-4rk56                            0/1     Init:CrashLoopBackOff   23 (4m57s ago)   107m   10.233.93.18    ks-master-3   <none>           <none>
```

如果你跟我一样在初始部署的时候就选择了 weave 组件，在失败的 Pod 列表中也会有 weave 命名空间下的相应 Pod。因为，weave 已经过时且无法解决，所以在过滤异常 Pod 的时候排除了 weave 相应的 Pod。

上面的输出结果在排除 weave 以后，也没有包含全部异常组件。因为在采集这个结果之前，我已经解决了其他几个组件的问题。

我们先按上面输出的结果排序来处理异常，不在上面结果中的异常组件的问题报错及解决过程放在了后面，具体细节请看下文。

### 3.2 解决 Argo CD 异常

- 查看异常 Pod

```bash
[root@ks-master-1 ~]# kubectl get pods -A -o wide | grep -v Running | grep -v Completed
NAMESPACE                      NAME                                                           READY   STATUS             RESTARTS           AGE     IP               NODE          NOMINATED NODE   READINESS GATES
argocd                         devops-argocd-applicationset-controller-8486797d4d-72888       0/1     CrashLoopBackOff   1119 (4m4s ago)    3d23h   10.233.103.12    ks-master-1   <none>           <none>
istio-system                   istiod-1-14-6-6576b8664b-28c44                                 0/1     CrashLoopBackOff   1119 (3m37s ago)   3d23h   10.233.102.8     ks-master-2   <none>           <none>
```

- 查看异常 Pod 的日志（**典型的二进制程序架构不匹配造成的，也就是说 x86 的程序，在 ARM 上运行**）

```bash
[root@ks-master-1 ~]# kubectl logs --all-containers devops-argocd-applicationset-controller-8486797d4d-72888 -n argocd
exec /usr/local/bin/applicationset-controller: exec format error
```

- 查看异常 Pod 使用的镜像

```bash
[root@ks-master-1 ~]# kubectl describe pods devops-argocd-applicationset-controller-8486797d4d-72888 -n argocd | grep Image:
    Image:         registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset:v0.4.1
```

- 查看异常 Pod 镜像架构

```bash
# 查看异常 Pod 镜像架构
[root@ks-master-1 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset:v0.4.1 | grep arch
      "architecture": "amd64",
```

- 获取适配的 ARM 版镜像（**相同版本 KubeSphere 官方 ARM 版镜像**）

```bash
# 找个相同版本的 ARM 架构的镜像
crictl pull kubespheredev/argocd-applicationset-arm64:v0.4.1
```

- 镜像重新打 tag（**为了保持镜像名称风格一致**）

```bash
ctr -n k8s.io images tag docker.io/kubespheredev/argocd-applicationset-arm64:v0.4.1 registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset-arm64:v0.4.1
```

- 重新部署组件

```bash
# 修改 Deployment 使用的镜像，并重启
kubectl set image deployment/devops-argocd-applicationset-controller applicationset-controller=registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset-arm64:v0.4.1 -n argocd
kubectl rollout restart deployment/devops-argocd-applicationset-controller -n argocd
```

- 验证新的 Pod 创建并启动成功

```bash
[root@ks-master-1 ~]# kubectl get pods -o wide -n argocd | grep applicationset-controller
devops-argocd-applicationset-controller-864f464855-64zvf   1/1     Running   0          56s     10.233.103.125   ks-master-1   <none>           <none>
```

### 3.3 解决 Istio 异常

- 查看异常 Pod

```bash
[root@ks-master-1 ~]# kubectl get pods -A -o wide | grep -v Running | grep -v Completed
NAMESPACE                      NAME                                                           READY   STATUS             RESTARTS           AGE     IP               NODE          NOMINATED NODE   READINESS GATES
istio-system                   istiod-1-14-6-6576b8664b-28c44                                 0/1     CrashLoopBackOff   1122 (3m10s ago)   3d23h   10.233.102.8     ks-master-2   <none>           <none>
```

- 查看异常 Pod 的日志

```bash
[root@ks-master-1 ~]# kubectl logs --all-containers istiod-1-14-6-6576b8664b-28c44 -n istio-system
exec /usr/local/bin/pilot-discovery: exec format error
```

- 查看异常 Pod 使用的镜像

```bash
[root@ks-master-1 ~]# kubectl describe pods istiod-1-14-6-6576b8664b-28c44 -n istio-system | grep Image:
    Image:         registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.14.6
```

- 查看异常 Pod 镜像架构

```bash
# 查看异常 Pod 镜像架构
[root@ks-master-2 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.14.6 | grep arch
      "architecture": "amd64",
```

- 获取适配的 ARM 版镜像 (**Istio 官方相近版本 ARM 镜像**)

```bash
# 找个相近版本的 ARM 架构的镜像（官方没有 1.14.6 的 ARM 镜像，从 1.15 开始才原生支持 ARM，所以用了 1.15.7 代替，生产环境建议自己用 1.14.6 版本的源码编译构建）
crictl pull istio/pilot:1.15.7 --platform arm64

# 确保镜像架构是 arm64
[root@ks-master-2 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.15.7 | grep arch
      "architecture": "arm64",
```

- 镜像重新打 tag

```bash
ctr -n k8s.io images tag docker.io/istio/pilot:1.15.7 registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.15.7
```

- 重新部署组件

```bash
# 修改 Deployment 使用的镜像，并重启
kubectl set image deployment/istiod-1-14-6 discovery=registry.cn-beijing.aliyuncs.com/kubesphereio/pilot:1.15.7 -n istio-system
kubectl rollout restart deployment/istiod-1-14-6 -n istio-system
```

- 验证新的 Pod 创建并启动成功

```bash
# 确保新的 Pod 创建并启动成功
[root@ks-master-1 ~]# kubectl get pods -o wide -n istio-system | grep istio
istiod-1-14-6-58ff9f7cc-59djl      0/1     Pending   0          7m59s   <none>           <none>        <none>           <none>
istiod-1-14-6-747f5b86b-bg29h      1/1     Running   0          15m     10.233.102.122   ks-master-2   <none>           <none>

# 上面的结果中，有一个 POd 一直处于 Pending 状态，查看具体原因
[root@ks-master-1 ~]# kubectl events pod --for=pod/istiod-1-14-6-58ff9f7cc-59djl -n istio-system
LAST SEEN               TYPE      REASON             OBJECT                              MESSAGE
3m26s (x2 over 8m42s)   Warning   FailedScheduling   Pod/istiod-1-14-6-58ff9f7cc-59djl   0/3 nodes are available: 3 Insufficient cpu. preemption: 0/3 nodes are available: 3 No preemption victims found for incoming pod..

# 结果显示 CPU 资源不足，验证
[root@ks-master-1 ~]# for i in {1..3};do echo ks-master-$i Cpu Usage: && kubectl describe node ks-master-$i | grep cpu | grep -v cpu: ;done
ks-master-1 Cpu Usage:
  cpu                3317m (92%)   10500m (291%)
ks-master-2 Cpu Usage:
  cpu                3587m (99%)   11910m (330%)
ks-master-3 Cpu Usage:
  cpu                3317m (92%)   10800m (300%)

# 增加服务器 CPU 资源，重启服务器后，再次查看
[root@ks-master-1 ~]# kubectl get pods -o wide -n istio-system | grep istio
istiod-1-14-6-6d4dbc56df-n5z9g     1/1     Running             0             17s   10.233.102.149   ks-master-2   <none>           <none>
```

### 3.4 解决 http-backupend 异常

- 查看异常 Pod

```bash
[root@ks-master-1 ~]# kubectl get pods -A -o wide | grep -v Running | grep -v Completed
NAMESPACE                      NAME                                                           READY   STATUS             RESTARTS           AGE     IP               NODE          NOMINATED NODE   READINESS GATES
kubesphere-controls-system     default-http-backend-767cdb5fdc-ptqhh                          0/1     CrashLoopBackOff   1108 (4m7s ago)    3d22h   10.233.93.9      ks-master-3   <none>           <none>
```

- 查看异常 Pod 的日志

```bash
[root@ks-master-1 ~]# kubectl logs --all-containers default-http-backend-767cdb5fdc-ptqhh -n kubesphere-controls-system
exec /server: exec format error
```

- 查看异常 Pod 使用的镜像

```bash
[root@ks-master-1 ~]# kubectl describe pods default-http-backend-767cdb5fdc-ptqh -n kubesphere-controls-system | grep Image:
    Image:          registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4
```

- 查看异常 Pod 镜像架构

```bash
[root@ks-master-3 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64:1.4 | grep arch
      "architecture": "amd64",
```

- 获取适配的 ARM 版镜像（**第三方相同版本 ARM 镜像**）

```bash
crictl pull mirrorgooglecontainers/defaultbackend-arm64:1.4
```

- 镜像重新打 tag（**为了保持镜像名称风格一致**）

```bash
ctr -n k8s.io images tag docker.io/mirrorgooglecontainers/defaultbackend-arm64:1.4 registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-arm64:1.4
```

- 重新部署组件

```bash
# 修改 Deployment 使用的镜像，并重启
kubectl set image deployment/default-http-backend default-http-backend=registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-arm64:1.4 -n kubesphere-controls-system
kubectl rollout restart deployment/default-http-backend -n kubesphere-controls-system
```

- 验证新的 Pod 创建并启动成功

```bash
[root@ks-master-1 ~]# kubectl get pods -o wide -n kubesphere-controls-system | grep default-http-backend
default-http-backend-694d6557b5-h674b   1/1     Running   0          14m     10.233.102.120   ks-master-2   <none>           <none>
```

### 3.5 解决 Jenkins 异常

- 查看异常 Pod 的日志

```bash
[root@ks-master-1 ~]# kubectl logs --all-containers devops-jenkins-774fdb948b-4rk56 -n kubesphere-devops-system
exec /bin/sh: exec format error
Error from server (BadRequest): container "devops-jenkins" in pod "devops-jenkins-774fdb948b-4rk56" is waiting to start: PodInitializing
```

- 查看异常 Pod 的事件

```bash
[root@ks-master-1 ~]# kubectl events devops-jenkins-774fdb948b-4rk56 -n kubesphere-devops-system
LAST SEEN             TYPE      REASON             OBJECT                                MESSAGE
40m                   Normal    SuccessfulCreate   CronJob/devops                        Created job devops-28284990
40m                   Normal    SuccessfulCreate   Job/devops-28284990                   Created pod: devops-28284990-59cvp
40m                   Normal    Scheduled          Pod/devops-28284990-59cvp             Successfully assigned kubesphere-devops-system/devops-28284990-59cvp to ks-master-1
40m                   Normal    Pulling            Pod/devops-28284990-59cvp             Pulling image "registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:ks-v3.4.0"
40m                   Normal    Pulled             Pod/devops-28284990-59cvp             Successfully pulled image "registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:ks-v3.4.0" in 427.197317ms (427.222677ms including waiting)
40m                   Normal    Created            Pod/devops-28284990-59cvp             Created container pipeline-run-gc
40m                   Normal    Started            Pod/devops-28284990-59cvp             Started container pipeline-run-gc
40m                   Normal    Completed          Job/devops-28284990                   Job completed
40m                   Normal    SawCompletedJob    CronJob/devops                        Saw completed job: devops-28284990, status: Complete
10m                   Normal    SuccessfulCreate   CronJob/devops                        Created job devops-28285020
10m                   Normal    Scheduled          Pod/devops-28285020-zqd72             Successfully assigned kubesphere-devops-system/devops-28285020-zqd72 to ks-master-1
10m                   Normal    SuccessfulCreate   Job/devops-28285020                   Created pod: devops-28285020-zqd72
10m                   Normal    Started            Pod/devops-28285020-zqd72             Started container pipeline-run-gc
10m                   Normal    Created            Pod/devops-28285020-zqd72             Created container pipeline-run-gc
10m                   Normal    Pulled             Pod/devops-28285020-zqd72             Successfully pulled image "registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:ks-v3.4.0" in 423.190976ms (423.205056ms including waiting)
10m                   Normal    Pulling            Pod/devops-28285020-zqd72             Pulling image "registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools:ks-v3.4.0"
10m                   Normal    Completed          Job/devops-28285020                   Job completed
10m                   Normal    SuccessfulDelete   CronJob/devops                        Deleted job devops-28284930
10m                   Normal    SawCompletedJob    CronJob/devops                        Saw completed job: devops-28285020, status: Complete
83s (x431 over 95m)   Warning   BackOff            Pod/devops-jenkins-774fdb948b-4rk56   Back-off restarting failed container copy-default-config in pod devops-jenkins-774fdb948b-4rk56_kubesphere-devops-system(d4e1ad50-0930-4ea7-823d-200bd90df471)
```

- 查看异常 Pod 使用的镜像

```bash
[root@ks-master-1 ~]# kubectl describe pods devops-jenkins-774fdb948b-4rk56 -n kubesphere-devops-system | grep Image:
    Image:         registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1
    Image:         registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1
```

- 查看异常 Pod 镜像架构

```bash
[root@ks-master-3 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1 | grep arch
      "architecture": "amd64",
```

- 获取适配的 ARM 版镜像（**相近版本 KubeSphere 官方 ARM 版镜像**）

```bash
# 没有找到同版本的，只能找了一个相近版本的 ARM 架构的镜像
crictl pull docker.io/kubesphere/ks-jenkins:v3.4.1-2.319.3  --platform arm64

# 确保 image 架构是 arm64
[root@ks-master-3 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1 | grep arch
      "architecture": "arm64",
```

- 镜像重新打 tag（**为了保持镜像名风格一致**）

```bash
crictl rmi registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1
ctr -n k8s.io images tag docker.io/kubesphere/ks-jenkins:v3.4.1-2.319.3 registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins:v3.4.0-2.319.3-1
```

- 重新部署组件

```bash
# 查找现有 pod
[root@ks-master-3 ~]# kubectl get pods -A -o wide | grep jenkins
kubesphere-devops-system       devops-jenkins-774fdb948b-fmmls                                0/1     Init:CrashLoopBackOff   6 (43s ago)       6m28s   10.233.93.27    ks-master-3   <none>           <none>

# 删除 pod，系统会自动重建
kubectl delete pod devops-jenkins-774fdb948b-fmmls -n kubesphere-devops-system
```

### 3.6 解决 weave 异常

初始化部署时启用了 weave，导致服务部署异常，需要做如下操作卸载 weave 插件。

**注：** 有能力的可以自己打对应版本的 ARM 镜像，我放弃了，毕竟这个功能模块用处不大了，该项目都已经不在维护了，[停止维护说明](https://www.weave.works/blog/weave-cloud-end-of-service "停止维护说明")。

- 查看异常 Pod

```bash
[root@ks-master-1 ~]# kubectl get pods -A -o wide | grep weave
weave                          weave-scope-agent-78r2r                                    0/1     CrashLoopBackOff    5 (95s ago)    8m41s   172.16.33.16    ks-master-1   <none>           <none>
weave                          weave-scope-agent-gcm6z                                    0/1     CrashLoopBackOff    5 (69s ago)    8m40s   172.16.33.23    ks-master-3   <none>           <none>
weave                          weave-scope-agent-kpp46                                    0/1     CrashLoopBackOff    5 (79s ago)    8m40s   172.16.33.22    ks-master-2   <none>           <none>
weave                          weave-scope-app-c6966bf4-c79n2                             0/1     CrashLoopBackOff    5 (67s ago)    8m42s   10.233.93.10    ks-master-3   <none>           <none>
weave                          weave-scope-cluster-agent-6f8f6596ff-xpctc                 0/1     CrashLoopBackOff    5 (75s ago)    8m41s   10.233.102.7    ks-master-2   <none>           <none>
```

- 查看异常 Pod 的日志

```bash
[root@ks-master-1 ~]# kubectl logs -n weave weave-scope-agent-78r2r
exec /home/weave/scope: exec format error
```

- 查看异常 Pod 使用的镜像

```bash
[root@ks-master-1 ~]# kubectl describe pod weave-scope-agent-78r2r -n weave | grep Image:
    Image:         registry.cn-beijing.aliyuncs.com/kubesphereio/scope:1.13.0
```

- 查看异常 Pod 镜像架构

```bash
[root@ks-master-1 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/scope:1.13.0 | grep arch
      "architecture": "amd64",
```

- 编辑集群配置文件，`kubectl edit cc ks-installer -n kubesphere-system`

```bash
 network:
    ippool:
      type: calico
    networkpolicy:
      enabled: true
    topology:
      type: weave-scope # 修改为 none
```

- 修改完成后，会自动重新部署（也可以用下面的命令删除 ks-installer 的 pod，手工强制重启部署任务）

```bash
kubectl delete pod ks-installer-6674579f54-4s4tp -n kubesphere-system
```

- 观察部署日志

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

### 3.7 解决 metrics-server 异常

- 查看异常 Pod

```bash
[root@ks-master-1 kubekey]# kubectl get pods -A
NAMESPACE           NAME                                           READY   STATUS             RESTARTS        AGE
kube-system         metrics-server-66b6cfb784-85l94                0/1     CrashLoopBackOff   38 (114s ago)   171m
```

- 查看异常 Pod 的日志

```bash
[root@ks-master-1 kubekey]# kubectl logs metrics-server-66b6cfb784-85l94 -n kube-system
exec /metrics-server: exec format error
```

- 查看异常 Pod 使用的镜像

```bash
[root@ks-master-1 kubekey]# kubectl describe pod metrics-server-66b6cfb784-85l94 -n kube-system | grep Image:
    Image:         registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2
```

- 查看异常 Pod 镜像架构

```bash
[root@ks-master-3 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2 | grep arch
      "architecture": "amd64",
```

- 获取适配的 ARM 版镜像（**相同版本 KubeSphere 官方 ARM 版镜像**）

```bash
# 拉取 arm64 镜像
crictl pull registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2-arm64  --platform arm64
```

- 镜像重新打 tag

```bash
# 删除 amd64 镜像
crictl rmi registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2

# 重新打 tag
ctr -n k8s.io images tag registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2-arm64 registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server:v0.4.2
```

- 重新部署组件

```bash
# 删除 ks-install 重启安装任务
kubectl delete pod ks-installer-6674579f54-4s4tp -n kubesphere-system
```

### 3.8 解决 Minio 异常

- 查看异常 Pod

```bash
[root@ks-master-1 ~]# kubectl get pods -A -o wide
NAMESPACE           NAME                                           READY   STATUS             RESTARTS        AGE     IP             NODE          NOMINATED NODE   READINESS GATES
kubesphere-system   minio-757c8bc7f-tlnts                          0/1     CrashLoopBackOff   5 (111s ago)    5m27s   10.233.103.4   ks-master-1   <none>           <none>
kubesphere-system   minio-make-bucket-job-fzz95                    0/1     Error     2 (24s ago)    31s    10.233.93.5    ks-master-3   <none>           <none>
```

- 查看异常 Pod 的日志

```bash
[root@ks-master-1 ~]# kubectl logs minio-757c8bc7f-tlnts -n kubesphere-system
exec /bin/sh: exec format error
```

- 查看异常 Pod 使用的镜像

```bash
# Minio 组件对应两个镜像
[root@ks-master-1 ~]# crictl images ls | grep minio
registry.cn-beijing.aliyuncs.com/kubesphereio/minio                     RELEASE.2019-08-07T01-59-21Z   29c267893b048       23.1MB

[root@ks-master-3 ~]# crictl images ls | grep mc
registry.cn-beijing.aliyuncs.com/kubesphereio/mc                        RELEASE.2019-08-07T23-14-43Z         c02b00df169fc       9.32MB
```

- 查看异常 Pod 镜像架构

```bash
# 查看异常 Pod 镜像架构（以 minio 为例）
[root@ks-master-1 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z | grep arch
      "architecture": "amd64",
```

- 获取适配的 ARM 版镜像（**相近版本 minio 官方 ARM 版镜像**）

```bash
# 找个相近版本的 ARM 架构的镜像
# minio
crictl pull minio/minio:RELEASE.2020-11-25T22-36-25Z-arm64

# mc
crictl pull minio/mc:RELEASE.2020-11-25T23-04-07Z-arm64
```

- 镜像重新打 tag

```bash
# minio
crictl rmi registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z
ctr -n k8s.io images tag docker.io/minio/minio:RELEASE.2020-11-25T22-36-25Z-arm64 registry.cn-beijing.aliyuncs.com/kubesphereio/minio:RELEASE.2019-08-07T01-59-21Z

# mc
crictl rmi registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
ctr -n k8s.io images tag --force docker.io/minio/mc:RELEASE.2020-11-25T23-04-07Z-arm64 registry.cn-beijing.aliyuncs.com/kubesphereio/mc:RELEASE.2019-08-07T23-14-43Z
```

- 重新部署组件

```bash
# 重新部署,删除旧的 Pod，系统会自动创建新的（此步的操作也可以使用修改 minio 对应的 deployment 使用的镜像名称的方式）
kubectl delete pod minio-757c8bc7f-tlnts -n kubesphere-system
kubectl delete pod minio-make-bucket-job-fzz95 -n kubesphere-system
```

### 3.9 解决组件异常通用方案

在部署 ARM 的 KubeSphere 和 Kubernetes 集群时，遇到的异常多数都是因为镜像架构不匹配造成的，当遇到本文没有涉及的异常组件时，可以参考以下流程解决。

- 查看异常 Pod
- 查看异常 Pod 的日志
- 查看异常 Pod 使用的镜像
- 查看异常 Pod 镜像架构
- 获取适配的 ARM 版镜像
- 镜像重新打 tag
- 重新部署组件

## 4. 部署测试资源

在解决完所有异常组件后，整个 Kubetnetes 集群中的 Pod 都应该处于 Running 状态，代表着 KubeSphere 和 Kubernetes 表面上看着是正常的。

在上篇文档中我们已经验证测试了 KubeSphere 和 Kubernetes 集群的状态。

接下来我们将在 Kubernetes 集群上部署一个简单的 Nginx Web 服务器，测试验证 Kubernetes 和 KubeSphere 基本功能是否正常。

本示例使用命令行工具在 Kubernetes 集群上部署一个 Nginx Web 服务器并利用 KubeSphere 图形化管理控制台查看部署的资源信息。

### 4.1 创建 Nginx Deployment

运行以下命令创建一个部署 Nginx Web 服务器的 Deployment。此示例中，我们将创建具有两个副本基于 nginx:alpine 镜像的 Pod。

```shell
kubectl create deployment nginx --image=nginx:alpine --replicas=2
```

### 4.2 创建 Nginx Service

创建一个新的 Kubernetes 服务，服务名称 nginx，服务类型 Nodeport，对外的服务端口 80。

```shell
kubectl create service nodeport nginx --tcp=80:80
```

### 4.3 验证 Nginx Deployment 和 Pod

- 运行以下命令查看创建的 Deployment 和 Pod 资源。

```shell
kubectl get deployment -o wide
kubectl get pods -o wide
```

- 查看结果如下：

```shell
[root@ks-master-1 ~]# kubectl get deployment -o wide
NAME    READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES         SELECTOR
nginx   2/2     2            2           20s   nginx        nginx:alpine   app=nginx

[root@ks-master-1 ~]# kubectl get pods -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP               NODE          NOMINATED NODE   READINESS GATES
nginx-6c557cc74d-tbw9c   1/1     Running   0          23s   10.233.102.187   ks-master-2   <none>           <none>
nginx-6c557cc74d-xzzss   1/1     Running   0          23s   10.233.103.148   ks-master-1   <none>           <none>
```

### 4.4 验证 Nginx 镜像架构

- 运行以下命令查看 Nginx Image 的架构类型

```bash
crictl inspecti nginx:alpine | grep architecture
```

- 查看结果如下：

```bash
[root@ks-master-1 ~]# crictl inspecti nginx:alpine | grep architecture
      "architecture": "arm64"
```

### 4.5 验证 Nginx Service

运行以下命令查看可用的服务列表，在列表中我们可以看到 Nginx 服务类型 为 Nodeport，并在 Kubernetes 主机上开放了 **30563** 端口。

```shell
kubectl get svc -o wide
```

查看结果如下：

```shell
[root@ks-master-1 ~]# kubectl get svc -o wide
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE     SELECTOR
kubernetes   ClusterIP   10.233.0.1     <none>        443/TCP        4d22h   <none>
nginx        NodePort    10.233.14.48   <none>        80:30619/TCP   5s      app=nginx
```

### 4.6 验证服务

运行以下命令访问部署的 Nginx 服务，验证服务是否成功部署。

- 验证直接访问 Pod

```shell
curl 10.233.102.187

# 访问结果如下
[root@ks-master-1 ~]# curl 10.233.102.187
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

- 验证访问 Service

```shell
curl 10.233.14.48

# 访问结果同上，略
```

- 验证访问 Nodeport

```shell
curl 172.16.33.16:30619

# 访问结果同上，略
```

### 4.7 在管理控制台查看

接下来我们回到 KubeSphere 管理控制台，在管理控制台查看已经创建的资源。

> **说明：** KubeSphere 的管理控制台具有友好地、图形化创建 Kubernetes 各种资源的功能，主要是截图太麻烦了，所以本文采用了命令行的方式简单的创建了测试资源。
>
> 只是在查看的时候给大家演示一下 KubeSphere 管理控制台的基本功能，实际使用中，大家可以使用图形化方式创建和管理 Kubernetes 资源。

- 登录 KubeSphere 管理控制台，点击「平台管理」，选择「集群管理」。
- 单击集群管理页面左侧的「应用负载」，点击「工作负载」。默认会看到所有类型为**部署**的工作负载。

我们使用的是 admin 账户，因此可以看到所有的工作负载，在搜索框输入 nginx，只显示 Nginx 部署工作负载。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-deployments-v340-v126-arm.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-deployments-nginx-v340-v126-arm.png)

- 单击部署列表中的 Nginx，可以查看更详细的信息，并且管理 Nginx 部署 (Deployment)。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-deployments-nginx-resource-status-v340-v126-arm.png)

- 单击容器组中的一个 Nginx 容器，可以查看容器的状态、监控等信息。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-pods-nginx-monitors-v340-v126-arm.png)

- 回到「平台管理」-「集群管理」页面，单击集群管理页面左侧的「应用负载」，点击「服务」。默认会看到所有类型为**服务**的工作负载。

我们使用的是 admin 账户，因此可以看到所有的工作负载，在搜索框输入 Nginx，只显示 Nginx 服务工作负载。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-services-v340-v126-arm.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-services-nginx-v340-v126-arm.png)

- 单击服务列表中的 Nginx，可以查看更详细的信息，并且管理 Nginx 服务 (Service)。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-clusters-services-nginx-resource-status-v340-v126-arm.png)

至此，我们实现了将 Nginx Web 服务器部署到 Kubernetes 集群，并通过 KubeSphere 管理控制台查看、验证了部署的 Deployment、Pod、Service 的详细信息。

本文仅对 ARM 架构下部署的 KubeSphere 和 Kubernetes 做了最基本的资源创建的验证测试，更多的完整的可插拔组件的测试并未涉及，请读者根据需求自己验证、测试。

在验证测试过程中遇到的问题多数都应该是镜像架构不匹配造成的，参考本文**第 5 小节**中解决问题的思路和流程，应该能解决大部分问题。

## 5. 补充说明

本小节我们展示一些集群的基本信息和一些测试验证的说明。

### 5.1 查看 Image 列表

本小节，我们查看一下到目前为止，整个 KubeSphere 和 Kubernetes 集群用到了哪些镜像。

在每个节点输入以下命令获取在 Kubernetes 集群节点上已经下载的 Image 列表。

```shell
crictl images ls
```

以下结果是在所有执行查看命令后的汇总输出：

```shell
# crictl images ls | grep -v docker.io > /tmp/1.txt
# crictl images ls | grep -v docker.io > /tmp/2.txt
# crictl images ls | grep -v docker.io > /tmp/3.txt
#  cat 1.txt 2.txt 3.txt | awk '{if (!seen[$1]++) {print}}' | sort
IMAGE                                                                       TAG                                  IMAGE ID            SIZE
registry.cn-beijing.aliyuncs.com/kubesphereio/alertmanager                  v0.23.0                              44a71f29f42b0       25MB
registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset-arm64   v0.4.1                               758eaf0d9da26       76.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/argocd-applicationset         v0.4.1                               f5ac1e612edca       77.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/argocd                        v2.3.3                               9a557f111ba0b       185MB
registry.cn-beijing.aliyuncs.com/kubesphereio/cni                           v3.23.2                              dbad3c1a529ac       76.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/configmap-reload              v0.7.1                               b4151c08af07d       3.73MB
registry.cn-beijing.aliyuncs.com/kubesphereio/coredns                       1.9.3                                b19406328e70d       13.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-amd64          1.4                 							   846921f0fe0e5       1.82MB
registry.cn-beijing.aliyuncs.com/kubesphereio/defaultbackend-arm64          1.4                                  156fbd4afe405       1.67MB
registry.cn-beijing.aliyuncs.com/kubesphereio/devops-apiserver              ks-v3.4.0                            c89baacbfca67       29.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/devops-controller             ks-v3.4.0                            5b4ce4e345d4a       26.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/devops-tools                  ks-v3.4.0                            3b2bc61feca12       28.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/dex                           v2.30.2                              cd0eb92a37da5       24.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/docker                        19.03                                59291a2ff3232       60.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/fluentbit-operator            v0.14.0                              1fe6aebe29cb9       18.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/fluent-bit                    v1.9.4                               bb0200a3096d6       25.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy                       2.3                                  5be62463c49bf       37.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/jaeger-operator               1.29                                 7e6f4ab1586b7       105MB
registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache            1.15.12                              c5c27a390f5fa       41.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kiali-operator                v1.50.1                              c3dc2b49c5e8b       250MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kiali                         v1.50                                97c5cab789c50       78MB
registry.cn-beijing.aliyuncs.com/kubesphereio/ks-apiserver                  v3.4.0                               de0e22c9bcf4f       61.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/ks-console                    v3.4.0                               42b2364bcafe3       38.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/ks-controller-manager         v3.4.0                               4ff90f750485b       46.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/ks-installer                  v3.4.0                               3471e6e1d2af0       153MB
registry.cn-beijing.aliyuncs.com/kubesphereio/ks-jenkins                    v3.4.0-2.319.3-1                     4b52636ce9e50       581MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver                v1.26.5                              06a268629a822       32.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-operator        v0.2.0                               9c5612b5f8a8e       8.37MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-auditing-webhook         v0.2.0                               f23e1078e2b2c       11.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager       v1.26.5                              a7b6fa1339316       29.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers              v3.23.2                              5a33f410afb91       25.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kubectl                       v1.22.0                              29c024bbbf9b1       25.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-exporter          v0.6.0                               452463fb02cb2       19.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-operator          v0.6.0                               27146d6e5ab73       21.5MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-events-ruler             v0.6.0                               12573f2ffe64d       25.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy                    v1.26.5                              5e89f86edbb88       19.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-rbac-proxy               v0.11.0                              bee4dbe8a9f42       17.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler                v1.26.5                              9eb699cb795f8       16.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/kube-state-metrics            v2.6.0                               150fa1ddd5ab3       10.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils                   3.3.0                                d06b9d3a552bc       27.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/log-sidecar-injector          v1.2.0                               dbad25c47d9ec       9.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/mc                            RELEASE.2019-08-07T23-14-43Z         c02b00df169fc       11.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/metrics-server                v0.4.2                               b266eabac7d6a       23.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/minio                         RELEASE.2019-08-07T01-59-21Z         6760283c70e3e       23MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node-exporter                 v1.3.1                               bb203ba967a80       9.72MB
registry.cn-beijing.aliyuncs.com/kubesphereio/node                          v3.23.2                              2a3416a8ae05d       73MB
registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager-operator v2.3.0                               3d8285028607a       17.9MB
registry.cn-beijing.aliyuncs.com/kubesphereio/notification-manager          v2.3.0                               b4d8dc4ea25ac       20.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/notification-tenant-sidecar   v3.2.0                               e41b413830c35       13.2MB
registry.cn-beijing.aliyuncs.com/kubesphereio/openldap                      1.3.0                                8803fc65b2bfa       91.6MB
registry.cn-beijing.aliyuncs.com/kubesphereio/openpitrix-jobs               v3.3.2                               d1afba2bac100       15.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch                    2.6.0                                92fe7c48b27f4       813MB
registry.cn-beijing.aliyuncs.com/kubesphereio/opensearch-curator            v0.0.5                               5791cbce4e83d       19MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pause                         3.8                                  4e42fb3c9d90e       268kB
registry.cn-beijing.aliyuncs.com/kubesphereio/pilot                         1.15.7                               4f12fc8040fe7       66MB
registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol            v3.23.2                              d48543e4a525a       4.56MB
registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-config-reloader    v0.55.1                              4152fd84f8c36       4.61MB
registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus-operator           v0.55.1                              8e6f6c78032e8       13.1MB
registry.cn-beijing.aliyuncs.com/kubesphereio/prometheus                    v2.39.1                              af3e34b4a84e5       83.4MB
registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv           3.3.0                                2f625755a998b       27.3MB
registry.cn-beijing.aliyuncs.com/kubesphereio/redis                         6.2.6-alpine                         50bbab999a871       10.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/s2ioperator                   v3.2.1                               30b700dff15f8       11.8MB
registry.cn-beijing.aliyuncs.com/kubesphereio/scope                         1.13.0                               ca6176be9738f       30.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/snapshot-controller           v4.0.0                               3758cfc26c6db       17.7MB
registry.cn-beijing.aliyuncs.com/kubesphereio/thanos                        v0.31.0                              5595f682eee8a       37.7MB
```

### 5.2 DevOps 模块验证说明

在解决了 Jenkins 等镜像架构异常后，DevOps 流水线能创建项目、创建流水线，编辑 Jenkinsfile，流水线的流程图也能正常显示。

构建应用的时候 Maven 容器依旧起不来，暂时没有找到解决方案，作为遗留问题，后续解决了再说。

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v340-v126-devops-pipelines.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v340-v126-devops-pipelines-test.png)

![](https://opsman-1258881081.cos.ap-beijing.myqcloud.com//ksp-v340-v126-devops-pipelines-test-error.png)

## 6. 常见问题

### 6.1 问题 1

- 报错现象

```bash
# 安装失败，最后报错
Please wait for the installation to complete:   >>--->
13:08:38 CST skipped: [ks-master-3]
13:08:38 CST skipped: [ks-master-2]
13:08:38 CST failed: [ks-master-1]
error: Pipeline[CreateClusterPipeline] execute failed: Module[CheckResultModule] exec failed:
failed: [ks-master-1] execute task timeout, Timeout=2h

# 查看 Pods
[root@ks-master-1 kubekey]# kubectl get pods -A
NAMESPACE           NAME                                           READY   STATUS             RESTARTS        AGE
kube-system         metrics-server-66b6cfb784-85l94                0/1     CrashLoopBackOff   38 (114s ago)   171m

# 查看 Pod 日志
[root@ks-master-1 kubekey]# kubectl logs metrics-server-66b6cfb784-85l94 -n kube-system
exec /metrics-server: exec format error
```

- 解决方案

```bash
参考 3.7 小节的 解决 metrics-server 异常
```

### 6.2 问题 2

- 报错信息

```bash
## devops 流水线功能异常，仅做记录，未最终解决
Started by user opsman
[Pipeline] Start of Pipeline
[Pipeline] node
Still waiting to schedule task
All nodes of label ‘maven’ are offline

[root@ks-master-1 ~]# kubectl get pods -n kubesphere-devops-worker
NAME          READY   STATUS        RESTARTS   AGE
maven-604qz   1/2     Terminating   0          5s
maven-7krjb   1/2     Terminating   0          5s
maven-b43fl   1/2     Terminating   0          5s

5s                      Normal   Started     Pod/maven-pxrt3   Started container jnlp
4s                      Normal   Started     Pod/maven-xnt3j   Started container jnlp
4s                      Normal   Pulled      Pod/maven-xnt3j   Container image "registry.cn-beijing.aliyuncs.com/kubesphereio/inbound-agent:4.10-2" already present on machine
4s                      Normal   Started     Pod/maven-xnt3j   Started container maven
4s                      Normal   Created     Pod/maven-xnt3j   Created container maven
4s                      Normal   Created     Pod/maven-xnt3j   Created container jnlp
4s                      Normal   Pulled      Pod/maven-xnt3j   Container image "registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman" already present on machine

[root@ks-master-2 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman | grep arch
      "architecture": "amd64",

[root@ks-master-2 ~]# crictl inspecti registry.cn-beijing.aliyuncs.com/kubesphereio/inbound-agent:4.10-2 | grep arch
      "architecture": "arm64",
```

- 解决方案

```bash
# 说明：没有最终解决，只解决了镜像架构异常，但是后面构建应用的时候 maven 容器依旧起不来
crictl pull kubespheredev/builder-maven:v3.3.1-podman --platform arm64

[root@ks-master-2 ~]# crictl inspecti kubespheredev/builder-maven:v3.3.1-podman | grep arch | head -1
      "architecture": "arm64",

# 偷梁换柱，强制修改 tag（这个方案比较粗暴，建议采取自己构建同版本 ARM 镜像或是修改 kubesphere-devops-system 项目下的配置字典 jenkins-casc-config 中的 jenkins_user.yaml ，修改镜像版本）
crictl rmi registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman
ctr -n k8s.io images tag docker.io/kubespheredev/builder-maven:v3.3.1-podman registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.2.0-podman --force
#ctr -n k8s.io images tag docker.io/kubespheredev/builder-maven:v3.3.1-podman registry.cn-beijing.aliyuncs.com/kubesphereio/builder-maven:v3.3.1-podman
```

## 7. 总结

本专题主要实战演示了在 ARM 版 openEuler 22.03 LTS SP2 服务器上，利用 KubeKey 3.0.10 自动化部署最小化 KubeSphere 3.4.0 和 Kubernetes 1.26.5 高可用集群的详细过程。

部署完成后，我们还利用 KubeSphere 管理控制台和 kubectl 命令行，查看并验证了 KubeSphere 和 Kubernetes 集群的状态。

最终我们通过在 Kubenetes 集群上部署 Nginx Web 服务器验证了 Kubernetes 集群和 KubeSphere 的可用性，并通过在 KubeSphere 管理控制台查看 Nginx Pod 和服务状态的操作，了解了 KubeSphere 的基本用法。

概括总结全文主要涉及以下内容：

- openEuler 22.03 LTS SP2 aarch64 操作系统基础配置
- 操作系统数据盘 LVM 配置、磁盘挂载、数据目录创建
- KubeKey 下载及创建集群配置文件
- 利用 KubeKey 自动化部署 KubeSphere 和 Kubernetes 集群
- 解决 ARM 版 KubeSphere 和 Kubernetes 服务组件异常的问题
- 部署完成后的 KubeSphere 和 Kubernetes 集群状态验证
- 部署 Nginx 验证测试 KubeSphere 和 Kubernetes 基本功能

本文部署环境虽然是基于 **Kunpeng-920** 芯片的 aarch64 版 openEuler 22.03 LTS SP2 ，但是对于 CentOS、麒麟 V10 SP2 等 ARM 版操作系统以及飞腾（FT-2500）等芯片也有一定的借鉴意义。

本文介绍的内容可直接用于研发、测试环境，对于生产环境有一定的参考意义，**绝对不能**直接用于生产环境。

**本文的不完全测试结论：** KubeSphere 和 Kubernetes 基本功能可用，DevOps 功能部分可用，主要问题在构建镜像时 Maven 容器启动异常，**其他插件功能未做验证**。