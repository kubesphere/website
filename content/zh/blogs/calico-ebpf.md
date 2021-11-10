---
title: '开启 Calico eBPF 数据平面实践'
tag: 'Kubernetes,Calico,eBPF'
keywords: 'Kubernetes, Calico, eBPF'
description: '在本篇文章中，我们将首先演示通过 KubeKey 创建一个标准的 K8s 集群，并切换数据平面到 eBPF，最后基于该数据平面做一个简单的演示。'
createTime: '2021-06-24'
author: '饶云坤'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/calico-ebpf-cover.png'
---

## 简介

Calico 从 v3.13 开始，集成了 `eBPF` 数据平面。

关于什么是 `eBPF`, 以及 `Calico` 为什么引入了 `eBPF` , 并不是本篇文章的重点，感兴趣的朋友可以自行阅读[相关文档](https://www.projectcalico.org/introducing-the-calico-ebpf-dataplane/)。

相比于 Calico 的默认基于 `iptables` 数据平面，`eBPF` 具有更高的吞吐量以外， 还具有 `source IP preservation` 这个功能。

在 K8s 中通常都是直接或者间接以 `NodePort` 方式对外暴露接口的。而对于 K8s 这个分布式集群来讲，通常情况下，客户端连接 Node Port 端口的节点和负责响应请求的后端业务 Pod 所在的节点不是同一个节点，为了打通整个数据链路，就不可避免的引入了 `SNAT`。但是这样显然也会带来一个副作用，即业务 Pod 在收到 Packet 以后，其 SRC IP 已经不再是客户端的实际 IP（被伪装成节点的内网 IP ）。另一方面，对于一些业务应用来讲，获取客户端 IP 是一个实实在在的刚需。比如：业务应用需要通过客户端 IP 来获取客户登陆的 geo 信息。

目前 K8s 主要是通过设置 `externaltrafficpolicy` 来规避这个问题的，但是这个方案本身并不能完全令人满意。Calico 从 v3.13 开始通过集成 `eBPF` 优雅地解决了这个问题。

在本篇文章中，我们将首先演示通过 [KubeKey](https://github.com/kubesphere/kubekey) 创建一个标准的 K8s 集群，并切换数据平面到 `eBPF`，最后基于该数据平面做一个简单的演示。

## 前提条件

较新的内核， 一般 v4.18+ 即可。

笔者的测试集群：

![](https://pek3b.qingstor.com/kubesphere-community/images/1614074234-986729-image.png)

## 部署 K8s 集群

Kubekey 默认的 CNI 插件为 Calico（ipip模式）。这里为了部署方便，直接使用 KubeKey 部署了一个全新的 K8s 集群，版本为 v1.18.6 。KubeKey 的详细用法参见[文档](https://github.com/kubesphere/kubekey/blob/master/README_zh-CN.md)。


## 切换 Calico 数据平面

Calico 支持多种数据平面，通过修改配置可以方便地进行切换，详细信息可以参见[官方文档](https://docs.projectcalico.org/maintenance/enabling-bpf)。

主要分为以下几步：

1. 确认 BPF 文件系统已经挂载:

```shell
mount | grep "/sys/fs/bpf"
```
如果能看到以下信息，则代表 BPF 文件系统已经挂载：

![](https://pek3b.qingstor.com/kubesphere-community/images/1614074281-217849-image.png)


2. 创建 Calico 配置文件：

- 首先获取 ks-apiserver endpoints 信息：

```shell
kubectl get endpoints kubernetes -o wide
```

- 由于 KubeKey 是通过 manifest 方式安装的 Calico，这里我们只需要创建一个 cm 即可：

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: kubernetes-services-endpoint
  namespace: kube-system
data:
  KUBERNETES_SERVICE_HOST: "<API server host>"
  KUBERNETES_SERVICE_PORT: "<API server port>"
```

- 重启 Calico pods，并等待 Calico Pod 重新变为 Running 状态

```shell
kubectl delete pod -n kube-system -l k8s-app=calico-node
kubectl delete pod -n kube-system -l k8s-app=calico-kube-controllers
```

- 关闭 kube-proxy

```shell
kubectl patch ds -n kube-system kube-proxy -p '{"spec":{"template":{"spec":{"nodeSelector":{"non-calico": "true"}}}}}'
```

- 开启 eBPF 模式

```shell
calicoctl patch felixconfiguration default --patch='{"spec": {"bpfEnabled": true}}'
```

- 由于我们需要保留客户端 IP，所以需要开启 `DSR` 模式。

```shell
calicoctl patch felixconfiguration default --patch='{"spec": {"bpfExternalServiceMode": "DSR"}}'
```

至此，Calico 的整个网络环境已经配置完毕。

![](https://pek3b.qingstor.com/kubesphere-community/images/1614074348-806671-image.png)

## 体验

为了验证 Calico 切换到 `eBPF` 数据平面以后，后端确实可以拿到客户端的真实 IP ，下面我们会在集群中部署一个 Nginx 服务，并通过 nodeport 方式暴露接口。

创建 Nginx 实例并暴露外部接口：

```shell
master:~$ kubectl apply -f - <<EOF
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      nodePort: 30604
EOF 
```

等待 Pod 变为 Running 状态：

![](https://pek3b.qingstor.com/kubesphere-community/images/1614074434-52430-image.png)

外部调用 Nginx 服务：

```shell
curl http://<external-ip>:30604
```

查询 Nginx 日志，查看 client IP:

![](https://pek3b.qingstor.com/kubesphere-community/images/1614074617-657518-image.png)

> 注意：如果集群本身部署在云平台环境中，如果节点位于 VPC 网络当中，需要设置相应的端口转发规则，并开启相应的防火墙端口。
