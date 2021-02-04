---
title: '在 Pod 中如何获取客户端的真实 IP'
tag: 'KubeSphere,Kubernetes'
createTime: '2020-11-21'
author: 'Shaowen Chen'
snapshot: '../../../images/blogs/how-to-get-real-ip-in-pod/ip.png'
---

> Kubernetes 依靠 kube-proxy 组件实现 Service 的通信与负载均衡。在这个过程中，由于使用了 SNAT 对源地址进行了转换，导致 Pod 中的服务拿不到真实的客户端 IP 地址信息。本篇主要解答了在 Kubernetes 集群中负载如何获取客户端真实 IP 地址这个问题。

## 创建一个后端服务

### 服务选择

这里选择 `containous/whoami` 作为后端服务镜像。在 Dockerhub 的介绍页面，可以看到访问其 80 端口时，会返回客户端的相关信息。在代码中，我们可以在 Http 头部中拿到这些信息。

```bash
Hostname :  6e0030e67d6a
IP :  127.0.0.1
IP :  ::1
IP :  172.17.0.27
IP :  fe80::42:acff:fe11:1b
GET / HTTP/1.1
Host: 0.0.0.0:32769
User-Agent: curl/7.35.0
Accept: */*
```

### 集群环境

简单介绍一下集群的状况。集群有三个节点，一个 master ，两个 worker 节点。如下图:

![](../../../images/blogs/how-to-get-real-ip-in-pod/cluster-info.png)

### 创建服务

- 创建企业空间、项目

如下图所示，这里将企业空间和项目命名为 realip

![](../../../images/blogs/how-to-get-real-ip-in-pod/create-ns.png)

- 创建服务

这里创建无状态服务，选择 `containous/whoami` 镜像，使用默认端口。

![](../../../images/blogs/how-to-get-real-ip-in-pod/create-svc.png)

- 将服务改为 NodePort 模式

编辑服务的外网访问方式，修改为 NodePort 模式。

![](../../../images/blogs/how-to-get-real-ip-in-pod/create-edit-access.png)

查看访问服务的 NodePort 端口，发现端口为 31509。

![](../../../images/blogs/how-to-get-real-ip-in-pod/nodeport-view.png)

- 访问服务

浏览器打开 Master 节点的 EIP + `:31509` 时，返回如下内容: 

```bash
Hostname: myservice-fc55d766-9ttxt
IP: 127.0.0.1
IP: 10.233.70.42
RemoteAddr: 192.168.13.4:21708
GET / HTTP/1.1
Host: dev.chenshaowen.com:31509
User-Agent: Chrome/86.0.4240.198 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: lang=zh;
Dnt: 1
Upgrade-Insecure-Requests: 1
```

可以看到 RemoteAddr 是 Master 节点的 IP ，并不是访问客户端的真实 IP 地址。这里的 Host 指的是访问入口的地址，为了方便快速访问，我使用的是域名，并不影响测试结果。

## 直接通过 NortPort 访问获取真实 IP

在上面的访问中，获取不到客户端真实 IP 的原因是 SNAT 使得访问 SVC 的源 IP 发生了变化。将服务的 externalTrafficPolicy 改为 Local 模式可以解决这个问题。

打开服务的配置编辑页面

![](../../../images/blogs/how-to-get-real-ip-in-pod/modify-svc.png)

将服务的 externalTrafficPolicy 设置为 Local 模式。

![](../../../images/blogs/how-to-get-real-ip-in-pod/modify-svc-local.png)

访问服务，可以得到如下内容:

```bash
Hostname: myservice-fc55d766-9ttxt
IP: 127.0.0.1
IP: 10.233.70.42
RemoteAddr: 139.198.254.11:51326
GET / HTTP/1.1
Host: dev.chenshaowen.com:31509
User-Agent: hrome/86.0.4240.198 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: max-age=0
Connection: keep-alive
Cookie: lang=zh;
Dnt: 1
Upgrade-Insecure-Requests: 1
```

Cluster 隐藏了客户端源 IP，可能导致第二跳到另一个节点，但具有良好的整体负载分布。 Local 保留客户端源 IP 并避免 LoadBalancer 和 NodePort 类型服务的第二跳，但存在潜在的不均衡流量传播风险。

下面是对比简图：

![](../../../images/blogs/how-to-get-real-ip-in-pod/cluster.png)

![](../../../images/blogs/how-to-get-real-ip-in-pod/local.png)

当请求落到没有服务 Pod 的节点时，将无法访问。用 curl 访问时，会一直停顿在 `TCP_NODELAY` , 然后提示超时:

```bash
*   Trying 139.198.112.248...
* TCP_NODELAY set
* Connection failed
* connect to 139.198.112.248 port 31509 failed: Operation timed out
* Failed to connect to 139.198.112.248 port 31509: Operation timed out
* Closing connection 0
```

## 通过 LB -> Service 访问获取真实 IP

在生产环境，通常会有多个节点同时接收客户端的流量，如果仅使用 Local 模式将会导致服务可访问性变低。引入 LB 的目的是为了利用其探活的特点，仅将流量转发到存在服务 Pod 的节点上。

这里以青云的 LB 为例进行演示。在青云的控制，可以创建 LB ，添加监听器，监听 31509 端口，可以参考[LB 的使用文档](https://docs.qingcloud.com/product/network/loadbalancer/)，在此不再赘述。

如下图可以看到，在服务的 31509 端口仅 master 节点处于活跃状态，流量也仅会导向 master 节点，符合预期。

![](../../../images/blogs/how-to-get-real-ip-in-pod/lb-svc-3-1.png)

接着继续增加副本数量到 3

遗憾的是，Pod 并没有均匀分布在三个节点，其中有两个处于 master 上。因此 LB 的后端节点也没有完全点亮。如下图:

![](../../../images/blogs/how-to-get-real-ip-in-pod/lb-svc-3-2.png)

这就需要给 deploy 加上反亲和性的描述。有两种选择。第一种是配置软策略，但不能保证全部 LB 后端点亮，均匀分配到流量。

```yaml
spec:
  template:
    metadata:
      labels:
        app: myservice
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - myservice
                topologyKey: kubernetes.io/hostname
```

另一种是配置硬策略，强制 Pod 分配在不同的节点上，但会限制副本数量，也就是 Pod 总数不能超过 Node 总数。

```yaml
spec:
  template:
    metadata:
      labels:
        app: myservice
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values:
                      - myservice
              topologyKey: kubernetes.io/hostname
```

采用硬策略的配置，最终点亮全部后端，如下图:

![](../../../images/blogs/how-to-get-real-ip-in-pod/lb-svc-3-3.png)

## 通过 LB -> Ingress -> Service 访问获取真实 IP

如果每一个服务都占用一个 LB，成本很高，同时配置不够灵活，每次新增服务时，都需要去 LB 增加新的端口映射。

还有一种方案是 LB 将 80、443 的流量导给 Ingress Controller，然后将流量转发到 Service，接着达到 Pod 中的服务。

此时，需要 LB 能做 TCP 层的透传，或者 HTTP 层的带真实 IP 转发，将 Ingress Controller 的 externalTrafficPolicy 设置为 Local 模式，而 Service 可以不必设置为 Local 模式。

如果想要提高可访问性，同样可以参考上面配置反亲和性，保证在每个后端节点上都有 Ingress Controller 。

流量的转发路径:

LB(80/443) -> Ingress Controller(30000) -> myservice(80) -> myservice-fc55d766-xxxx(80)

首先需要勾选 LB 【获取客户端IP】的配置

![](../../../images/blogs/how-to-get-real-ip-in-pod/lb.png)

接着开启项目的外网访问网关

![](../../../images/blogs/how-to-get-real-ip-in-pod/create-gw.png)

然后添加服务的路由

![](../../../images/blogs/how-to-get-real-ip-in-pod/create-ingress.png)

最后还需要在【平台管理】-> 【集群管理】，进入集群，在系统项目 kubesphere-controls-system 中找到 realip 项目对应的网关。

![](../../../images/blogs/how-to-get-real-ip-in-pod/ingress.png)

编辑服务的配置文件，将 externalTrafficPolicy 改为 Local 模式即可。

![](../../../images/blogs/how-to-get-real-ip-in-pod/ingress-local.png)

访问服务，可以得到如下内容:

```
Hostname: myservice-7dcf6b965f-vv6md
IP: 127.0.0.1
IP: 10.233.96.152
RemoteAddr: 10.233.70.68:34334
GET / HTTP/1.1
Host: realip.dev.chenshaowen.com
User-Agent: Chrome/87.0.4280.67 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: max-age=0
Cookie: _ga=GA1.2.896113372.1605489938; _gid=GA1.2.863456118.1605830768
Cookie: lang=zh;
Upgrade-Insecure-Requests: 1
X-Forwarded-For: 139.198.113.75
X-Forwarded-Host: realip.dev.chenshaowen.com
X-Forwarded-Port: 443
X-Forwarded-Proto: https
X-Original-Uri: /
X-Real-Ip: 139.198.113.75
X-Request-Id: 999fa36437a1180eda3160a1b9f495a4
X-Scheme: https
```

## 总结

本文介绍了三种获取真实 IP 的部署方式：

- 直接通过 NortPort 访问获取真实 IP

受制于 Local 模式，可能会导致服务不可访问。需要保证对外提供入口的节点上，必须具有服务的负载。

- 通过 LB -> Service 访问获取真实 IP

利用 LB 的探活能力，能够提高服务的可访问性。适用于服务较少，或者愿意每个服务一个 LB 的场景。

- 通过 LB -> Ingress -> Service 访问获取真实 IP

通过 LB 将 80、443 端口的流量转到 Ingress Controller ，再进行服务分发。但 Ingress Controller 使用 Local 模式，就要求 LB 的每个后端节点都有 Ingress Controller 副本。适用于对外暴露服务数量较多的场景。

当然也可以组合使用，对于并不需要获取客户端真实 IP 的服务，可以继续使用 Cluster 模式。

## 参考

- https://hub.docker.com/r/containous/whoami
- https://kubernetes.io/zh/docs/tutorials/services/source-ip/
