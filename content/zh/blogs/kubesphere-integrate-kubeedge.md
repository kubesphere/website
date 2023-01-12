---
title: '在 Kubernetes 中部署并使用 KubeEdge'
tag: 'KubeSphere, Kubernetes, KubeEdge'
keywords: 'KubeSphere, Kubernetes, KubeEdge, 编译计算, Edge Computing'
description: '本文介绍了边缘计算的场景和架构，并以一个 Demo 示例展示如何运行一个边缘应用到边缘节点上。'
createTime: '2023-01-11'
author: '马伟'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202301111739909.png'
---

边缘计算在广泛制造业、工业、零售和金融等行业，随着云原生应用的兴起，不可变基础设施和快速的应用交付等特性很适用于边缘计算场景。因此在 Kubernetes 上使用边缘计算框架是近年很火热的一个方向。本篇会介绍下边缘计算的场景和架构，并以一个 Demo 示例展示如何运行一个边缘应用到边缘节点上。

## 边缘计算痛点和场景

首先，边缘计算是云计算的延伸，云计算按需和资源池化的特性可以满足资源利用率的提升和计算资源的集中供给，但边缘测的应用场景决定不可能什么应用都丢到数据中心里。比如

- 低延迟处理。车联网场景如果要进行数据共享和指令下发需要极低延迟的通信保障和计算处理速度。
- 本地处理数据。有些数据较敏感不能什么都传到云端（如用户照片、密码）
- 离线自治。很多边端设备不一定有可靠的连接保持和云端的通信。如农业、地理科学的传感器。

因此对于边缘节点和边缘设备来说，需要统一管理和本地计算的能力，来实现云端负责总体决策，边端负责本地执行的效果。这样处理的好处就是数据处理效率高、减少云边带宽、降低运营成本，却又不缺少云端的资产管理、调度监控、安全管控。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111706561.png)

了解边缘计算含义后，就有提问了，既然边缘计算和云计算都是一种概念，势必市场上有众多边缘计算的产品和标准，为什么要在 Kubernetes 上使用边缘计算呢？

这个我个人理解是双向奔赴的，kubernetes 本身比较适合基础架构标准化和应用交付，可以帮助云端统一管理边缘节点和边缘设备，也适合于标准应用的云端下发，生态丰富且开源开放的可观测体系也适合于不同的企业用管数据中心的方法实现边端可观测性。而 Kubernetes 也需要边缘计算将自己的能力得到更多的延伸，去实现更多的平台能力和平台标准，毕竟云-网-边-端是当代云计算需要涵盖的每个方向~

## 常见边缘计算框架

对于产品选型来说，云原生领域最方便的就是打开 landscape 了。我们来看看 Automation&Configuration 这栏：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111706007.png)

我们常见的有三种，如 KubeEdge、OpenYurt 和 SuperEdge。本篇先拿 KubeEdge 这个孵化项目分享下。

## KubeEdge 架构

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111712875.png)

KubeEdge 分为云端和边端。云端核心组件 CloudCore 和边端核心组件 EdgeCore 联合实现边缘计算框架的众多功能，如云边通信、设备管理、离线自治等。还有一些辅助组件如 EdgeMesh 实现边端通信和服务治理，Sedna 提供边端 AI 框架等。

而到具体的 CloudCore 和 EdgeCore 的组成，可从下图详细学习架构设计：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715701.png)

### 云端

CloudCore 由 CloudHub 和 EdgeController、DeviceController 组成。

- CloudHub。主要观察云边变化，读写 Edge 消息，缓存数据后通过 WebSocket/QUIC（K8s 的 listwatch 机制太耗资源）发送给 EdgeHub，还要把和 Edge 通信得到的一些消息发送给 Controller。
- EdgeController。作为 ApiServer 和 EdgeCore 的桥梁，管理常用的配置、Pod、缓存等事件，把 EdgeCore 订阅到的 Pod 的众多事件信息同步状态到 ApiServer。也把 ApiServer 的 ADD/UPDATE/DELETE 等事件同步到 EdgeCore。
- DeviceController。通过 EdgeCore DeviceTwin 同步设备更新，总体过程是	Mapper—>MQTT—>EventBus—>DeviceTwin->EdgeHub->CloudHub—>Deviceontroller->APIServer。另一方面就是云端创建的 Device，下发到边端得到元数据进行设备端更新。

### 边端

- EdgeHub。云边通信边端，同步资源更新。
- EventBus。发送 / 接收 MQTT 消息
- MetaManager。在 SQLlite 存储数据，是 Edged 和 EdgeHub 的消息处理器。
- Edged。边端裁剪版 kubelet。管理 Pod、configmap、volume 等资源的生命周期。还包含一个 StatusManager 和 MetaClient 组件。前者每 10s 将本地数据库存储的状态信息上传至云，后者作为 client 和本地迷你 Etcd（MetaManager）交互，如读取云端下发的 ConfigMap、Secret，写 Node、Pod Status。
- DeviceTwin。存储设备属性和状态，创建 Edge 设备和节点关系，同步设备属性到云。
- ServiceBus: 接收云上服务请求和边缘应用进行 http 交互

## 安装部署

### 安装 Cloudcore

KubeSphere 已经集成了 KubeEdge，可提供边缘节点纳管、应用下发、日志监控等功能。接下来将在 KubeSphere 上演示边缘计算 Demo。

KubeSphere 上启用 KubeEdge，编辑 clusterconfiguration，设置 edgeruntime enabled 为 true，kubeedge enabled 为 true，设置 advertiseAddress IP 为“master_ip”

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715703.png)

设置完成后，在集群管理-> 节点中会出现“边缘节点”：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715704.png)

此时查看 kubeedge 命名空间下的工作负载和配置，可以熟悉下部署架构。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715705.png)

CloudCore 作为一个 Deployment 运行，IptablesManager 会帮助处理云边通道的 Iptables 规则下发。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715706.png)

查看 CloudCore 挂载的 ConfigMap 和 Secret，ConfigMap 主要挂载 cloudcore.yaml 配置文件到 /etc/kubeedge/config, 可灵活修改 CloudCore Modules 配置。Secret 挂载 CloudCore 和 EdgeCore 需要用到的一些 TLS 证书。

### 添加边缘节点

进入 KubeSphere Console，导航到节点-> 边缘节点，添加边缘节点：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715707.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715708.png)

填写边缘节点的名字和边缘节点的 IP，生成边缘节点配置命令，粘贴到边缘节点执行：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715709.png)

由于我们使用的 cloudcore 的服务是通过 NodePort 暴露出来的，所以在边缘节点注册 Cloudcore 时，需要使用 NodeIP:NodePort 形式，此处将 10000-10004 替换为 30000-30004 端口。

```bash
install MQTT service successfully.
kubeedge-v1.9.2-linux-amd64.tar.gz checksum:
checksum_kubeedge-v1.9.2-linux-amd64.tar.gz.txt content:
[Run as service] start to download service file for edgecore
[Run as service] success to download service file for edgecore
kubeedge-v1.9.2-linux-amd64/
kubeedge-v1.9.2-linux-amd64/edge/
kubeedge-v1.9.2-linux-amd64/edge/edgecore
kubeedge-v1.9.2-linux-amd64/version
kubeedge-v1.9.2-linux-amd64/cloud/
kubeedge-v1.9.2-linux-amd64/cloud/csidriver/
kubeedge-v1.9.2-linux-amd64/cloud/csidriver/csidriver
kubeedge-v1.9.2-linux-amd64/cloud/admission/
kubeedge-v1.9.2-linux-amd64/cloud/admission/admission
kubeedge-v1.9.2-linux-amd64/cloud/cloudcore/
kubeedge-v1.9.2-linux-amd64/cloud/cloudcore/cloudcore
kubeedge-v1.9.2-linux-amd64/cloud/iptablesmanager/
kubeedge-v1.9.2-linux-amd64/cloud/iptablesmanager/iptablesmanager

KubeEdge edgecore is running, For logs visit: journalctl -u edgecore.service -b

```

查看 KubeSphere 控制台的边缘节点，已经可以看到边缘节点注册上来：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715710.png)

使用 kubectl 查看节点情况：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715711.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715712.png)

## Metrics& 日志

此时我们发现节点的 CPU 内存信息无法统计，需要开启 KubeSphere Metrics_Server 并在 Edge 端开启 EdgeStream：

编辑 cc，开启 metrics-server:

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715713.png)

编辑边缘节点 /etc/kubeedge/config/edgecore.yaml 文件，搜索 edgeStream，将 false 更改为 true：

```yaml
  edgeStream:
    enable: true
    handshakeTimeout: 30
    readDeadline: 15
    server: 192.168.100.7:30004
    tlsTunnelCAFile: /etc/kubeedge/ca/rootCA.crt
    tlsTunnelCertFile: /etc/kubeedge/certs/server.crt
    tlsTunnelPrivateKeyFile: /etc/kubeedge/certs/server.key
    writeDeadline: 15

```

此处 server 字段设置端口为 30004，因为我们使用 NodePort 端口和云端通信

重启 edgecore.service：

```bash
$ systemctl restart edgecore.service
```

查看节点监控信息：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715714.png)

我们上面章节中已经在 edgecore 开启 edgestream，实现了云端收集 Edge 节点的 Metrics 功能，这个操作同时也实现了边端日志查看的能力。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715715.png)

一般来说，当我们 kubectl logs pod -n namespace 后，kubectl 会请求 kube-apiserver 查询 pod 是否存在以及 pod 里是否含有多个容器，再检索 Pod 所在的 Node 的 Kubelet Server 信息。这个信息一般可以通过 kubectl describe 或 get node 查到：

```bash
$ kubectl get node ks2 -oyaml
  addresses:
  - address: 192.168.100.7
    type: InternalIP
  - address: ks2
    type: Hostname
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
kubectl get node edge-node-1 -oayml
  addresses:
  - address: 192.168.100.6
    type: InternalIP
  - address: edge-node-1
    type: Hostname
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10352
```

InternalIP+kubeletEndpoint 组成 kubelet server 的地址，kubectl logs 就可以请求这个地址得到相关日志信息。但对于边缘端来说，大多数情况这个 internalIP 云端是无法访问的。

此时就需要 CloudCore 的 CloudStream 和 EdgeCore 的 EdgeStream 建立一个云边通道，在 CloudCore 和 EdgeCore 建立云边 WebSocket 通信后，将请求的 Edge kubelet server 的日志信息能通过通道返回给云端。这个通道需要两边开启 CloudStream 和 EdgeStream，并通过 TLS 证书进行验证。

边缘端在上面已经开启 EdgeStream，云端部署 CloudCore 后会自动开启。

查看云端挂载的 CloudCore.yaml 配置文件：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715716.png)

当然，云边通道只能将日志从消息返回，具体返回到 CloudCore 的 CloudStream，还需设置一个 NAT 规则：

```bash
$ iptables -t nat -A OUTPUT -p tcp --dport 10350（edge kubelet 端口）-j NAT --to $ClOUDCOREIPS:10003
```

这个操作已经让自动部署的 iptables-manager 完成了~

```bash
$ iptables -t nat -L
Chain TUNNEL-PORT (2 references)
target     prot opt source               destination
DNAT       tcp  --  anywhere             anywhere             tcp dpt:10351 to:10.20.253.88:10003
DNAT       tcp  --  anywhere             anywhere             tcp dpt:10352 to:10.20.253.127:10003
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715717.png)

进入边缘节点，查看容器组，我们可以看到有几个 daemonset 有强容忍度，调度到了边缘节点，由于边缘端很多情况存在不稳定通信，不适合运行 Calico 这种 CNI 组件，更多使用 EdgeMesh 进行云边通信和服务发现，我们可以手动 Patch Pod 以防止非边缘节点调度至工作节点：

```bash
#!/bin/bash
NoShedulePatchJson='{"spec":{"template":{"spec":{"affinity":{"nodeAffinity":{"requiredDuringSchedulingIgnoredDuringExecution":{"nodeSelectorTerms":[{"matchExpressions":[{"key":"node-role.kubernetes.io/edge","operator":"DoesNotExist"}]}]}}}}}}}'
ns="kube-system"
DaemonSets=("nodelocaldns" "kube-proxy" "calico-node")
length=${#DaemonSets[@]}
for((i=0;i<length;i++));  
do
         ds=${DaemonSets[$i]}
        echo "Patching resources:DaemonSet/${ds}" in ns:"$ns",
        kubectl -n $ns patch DaemonSet/${ds} --type merge --patch "$NoShedulePatchJson"
        sleep 1
done
```

进入节点终端（KS3.3 以上可用），运行脚本

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715718.png)

```bash
sh-4.2# ./bash.sh
Patching resources:DaemonSet/nodelocaldns in ns:kube-system,
daemonset.apps/nodelocaldns patched
Patching resources:DaemonSet/kube-proxy in ns:kube-system,
daemonset.apps/kube-proxy patched
Patching resources:DaemonSet/calico-node in ns:kube-system,
daemonset.apps/calico-node patched
```

查看边缘节点容器组：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715719.png)

## 运行应用

既然边缘节点注册进来了，我们来运行个应用吧。

进入项目-应用负载，创建一个 Deployment 工作负载：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715720.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715721.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715722.png)

设置资源限制

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715723.png)

选择节点分配：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715724.png)

创建后会显示节点存在污点无法调度，需要加上 toleration：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715725.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715726.png)

编辑 nginx-edge 应用的 yaml，添加对 edge 的 toleration：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715727.png)

添加污点容忍后，Pod 运行成功：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715728.png)

设置一个 NodePort Service，访问 Nginx 服务：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715729.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715730.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715731.png)

此时可以发现访问是不通的，因为云端无法访问边缘端的 Pod 网络，查看边缘 nginx-edge 的 ip：

```bash
bash-5.1# kubectl get pod -n demo -o wide
NAME                          READY   STATUS    RESTARTS      AGE     IP              NODE          NOMINATED NODE   READINESS GATES
nginx-9c99b5774-vvsfq         1/1     Running   4 (12h ago)   4d11h   10.20.253.123   ks2           <none>           <none>
nginx-edge-68c66d6bf9-k9l6n   1/1     Running   0             7m55s   172.17.0.2      edge-node-1   <none>           <none>
```

ssh 到边缘节点，访问 172.17.0.2：

```bash
$ curl 172.17.0.2
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

可见 Nginx Pod 服务是正常的，这个 IP 地址分配也很熟悉，172.17.0.0/16，这不是 docker bridge 网段嘛，查看下边缘节点 docker0 地址：

```bash
$ ip ad
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:1a:fa:b2:cb brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:1aff:fefa:b2cb/64 scope link
       valid_lft forever preferred_lft forever
```

```bash
$ docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS          PORTS     NAMES
b6c296a4dc16   nginx                "/docker-entrypoint.…"   7 minutes ago    Up 6 minutes              k8s_container-zpnv7r                           _nginx-edge-68c66d6bf9-k9l6n_demo_99d01b2c-9ca7-4d56-a475-ab1b6838a35d_0
4e72f538703c   kubeedge/pause:3.1   "/pause"                 11 minutes ago   Up 11 minutes             k8s_POD_nginx-edge-6                           8c66d6bf9-k9l6n_demo_99d01b2c-9ca7-4d56-a475-ab1b6838a35d_0

```

我们可以看到 nginx-edge 这个容器还是以 Pod 形式运行的，通过 pause 容器共享网络命名空间，只不过它没有使用集群的 PodCIDR 分配，而是使用 docker bridge 网络。因此在没有 coredns 和 kube-proxy 的服务发现和云边容器网络互通的条件下，边端的 Pod Service 是无法访问的。这很符合边云特点，边缘端更多是私网，且无法被云端访问，这种单向通信的特点需要有其他形式的网络促成云边的通信和服务访问，比如建立隧道。

## 云边服务互访

KubeEdge 社区有个 EdgeMesh 的项目。在边缘计算机的场景下，网络拓扑结构更加复杂。不同区域的边缘节点往往不能互联，而应用之间又需要业务流量互通。EdgeMesh 即可满足边缘节点之间流量互通的要求。按照官方 Github 介绍，EdgeMesh 作为 KubeEdge 集群的数据平面组件，为应用程序提供简单的服务发现和流量代理功能，从而屏蔽了边缘场景中的复杂网络结构。

因此 EdgeMesh 主要实现两个终极目标：

- 用户可以在不同的网络中访问边到边、边到云、云到边的应用
- 部署 EdgeMesh 相当于部署了 CoreDNS+Kube-Proxy+CNI

### 部署 EdgeMesh

部署有些前置条件，比如开启 Edge Kube-API Endpoint:
开启 cloudcore dynamicController：

```bash
$ vim /etc/kubeedge/config/cloudcore.yaml
modules:
  ...
  dynamicController:
    enable: true
```

开启 Edge metaServer：

```bash
$ vim /etc/kubeedge/config/edgecore.yaml
modules:
  ...
  edgeMesh:
    enable: false
  ...
  metaManager:
    metaServer:
      enable: true
```

添加 edgemesh commonconfig 信息：

```bash
$ vim /etc/kubeedge/config/edgecore.yaml
modules:
  ...
  edged:
    clusterDNS: 169.254.96.16
    clusterDomain: cluster.local
...
```

重启 cloudcore 和 edgecore 后，可在 edge 端验证是否能请求 kube-API：

```bash
[root@i-pfcctw6w ~]#  curl 127.0.0.1:10550/api/v1/services
{"apiVersion":"v1","items":[{"apiVersion":"v1","kind":"Service","metadata":{"creationTimestamp":"2023-01-04T13:09:51Z","labe                           ls":{"component":"apiserver","provider":"kubernetes","service.edgemesh.kubeedge.io/service-proxy-name":""}······
```

EdgeMesh Helm Chart 已收入 KubeSphere 应用商店，我们打开应用商店直接部署即可。

进入 kubeedge 项目，将 EdgeMesh 部署到此项目中。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715732.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715733.png)

此时需要修改应用设置的 server.nodeName，server.advertiseAddress。

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715734.png)

执行安装，安装成功后查看 edgemesh-server 和 edgemesh-agent 运行情况：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715735.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715736.png)

### 测试边端服务访问：

使用示例应用 https://github.com/kubeedge/edgemesh/examples，部署一个 hostname 应用及服务：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715737.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715738.png)

测试从云端的 Pod 访问边缘 Service:

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715739.png)

### 测试云边互访：

部署 https://github.com/kubeedge/edgemesh/examples 的 cloudzone 和 edgezone 应用：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715740.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715741.png)

云端 busybox 访问边端应用：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715742.png)

边端 busybox 访问云端应用：

```bash
$ docker exec -it 5a94e3e34adb sh
/ # cat /etc/resolv.conf
nameserver 169.254.96.16
search edgezone.svc.ks2 svc.ks2 ks2 sh1.qingcloud.com
options ndots:5

/ # telnet tcp-echo-cloud-svc.cloudzone 2701
Welcome, you are connected to node ks2.
Running on Pod tcp-echo-cloud-6d687d88c4-tllst.
In namespace cloudzone.
With IP address 10.20.253.177.
Service default.

```

## 边缘设备数据访问

部署一个模拟温度数据获取的 App：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temperature-mapper
  labels:
    app: temperature
spec:
  replicas: 1
  selector:
    matchLabels:
      app: temperature
  template:
    metadata:
      labels:
        app: temperature
    spec:
      hostNetwork: true
      tolerations:
      - key: "node-role.kubernetes.io/edge"
        operator: "Exists"
        effect: "NoSchedule"
      nodeSelector:
        kubernetes.io/hostname: "edge-node-1"
      containers:
      - name: temperature
        image: lammw12/temperature-mapper:edge
        imagePullPolicy: IfNotPresent
        securityContext:
          privileged: true

```

创建 DeviceModel：

```yaml
apiVersion: devices.kubeedge.io/v1alpha2
kind: Device
metadata:
  name: temperature
  labels:
    description: 'temperature'
    manufacturer: 'test'
spec:
  deviceModelRef:
    name: temperature-model
  nodeSelector:
    nodeSelectorTerms:
      - matchExpressions:
          - key: ''
            operator: In
            values:
              - edge-centos
status:
  twins:
    - propertyName: temperature-status
      desired:
        metadata:
          type: string
        value: ''
```

创建 Device：

```yaml
apiVersion: devices.kubeedge.io/v1alpha2
kind: Device
metadata:
  name: temperature
  labels:
    description: 'temperature'
    manufacturer: 'test'
spec:
  deviceModelRef:
    name: temperature-model
  nodeSelector:
    nodeSelectorTerms:
      - matchExpressions:
          - key: ''
            operator: In
            values:
              - edge-node-1
status:
  twins:
    - propertyName: temperature-status
      desired:
        metadata:
          type: string
        value: ''
```

KubeEdge 通过 Kubernetes 的 CRD，增加了 DeviceModel 和 Device 两个资源，分别来描述设备元信息和设备实例信息，DeviceController 负责边缘设备管理，在云和边之间传递这些信息。用户可以通过 Kubernetes API 从云中创建、更新和删除设备元数据，也可以通过 CRD API 控制设备属性的预期 (desired) 状态，从云端对设备进行 CRUD 操作。

DeviceModel 描述了设备属性，例如 “温度” 或 “压力”, 类似一个可重复使用的模板，使用它可以创建和管理许多设备。

一个 Device 实例代表一个实际的设备对象。它就像 device model 的实例化，引用了 model 中定义的属性。

kubectl apply 上述资源。

查看运行的 temperature 应用：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715743.png)

查看 temperature 应用日志：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715744.png)

使用 kubectl 查看 device 状态：

```bash
[root@ks2 examples]# kubectl get device temperature -oyaml
···
status:
  twins:
  - desired:
      metadata:
        type: string
      value: ""
    propertyName: temperature-status
    reported:
      metadata:
        timestamp: "1673256318955"
        type: string
      value: 70C

```

yaml 中的 device status 包含两份数据，一个是云端希望设置的状态数据（‘desired’），一个是边缘端上报的状态数据（‘reported’）。云端的 DeviceController 通过 Kubernetes API 监听 device 设备的创建事件，会自动创建一个新的 configmap，存储该 device 的 status 等属性信息，并保存到 ectd 中。EdgeController 将 configmap 同步到边缘节点，因而边缘节点的应用也能够获取设备的属性信息。‘desired’值将初始化到边缘节点数据库以及边缘设备中，因而即使边缘节点重启，也能自动恢复到之前的状态。当然这个‘desired’值也会随着云端用户对设备的 CRUD 而更改。

## 镜像预热

在实际应用中，边缘节点和设备是大规模且网络环境不够稳定的，云端下发边缘应用到多个节点后，可能镜像拉取花费的时间很受管理员困扰。这与容器化快速大规模交付应用和业务上线 / 扩容 / 升级的期望背道而驰。

因此镜像预热的能力是大规模边缘节点场景中不可或缺的，我们可以借助镜像预热工具实现边缘节点上的镜像提前拉取，加快应用部署的速度。开源社区有一个 OpenKruise 的项目，可以实现此需求。

OpenKruise 为每个 Node 驻扎一个 Daemonset，通过与 CRI 交互来绕过 kubelet 实现拉取镜像的能力。比如，定义一个 NodeImage CR，定义每个节点需要预热什么镜像，然后 kruise-daemon 就可以按照 NodeImage 来执行镜像的拉取任务：

![](https://pek3b.qingstor.com/kubesphere-community/images/202301111715745.png)

对于大规模边缘节点场景，可以通过 ImagePullJob 筛选节点后进行批量预热，一个 ImagePullJob 创建后，会被 kruise-manager 中的 imagepulljob-controller 接收到并处理，将其分解并写入到所有匹配节点的 NodeImage 中，以此来完成规模化的预热。

```yaml
apiVersion: apps.kruise.io/v1alpha1
kind: ImagePullJob
metadata:
  name: job-with-always
spec:
  image: nginx:1.9.1   # [required] 完整的镜像名 name:tag
  parallelism: 10      # [optional] 最大并发拉取的节点梳理, 默认为 1
  selector:            # [optional] 指定节点的 名字列表 或 标签选择器 (只能设置其中一种)
    names:
    - node-1
    - node-2
    matchLabels:
      node-type: xxx
# podSelector:         # [optional] 通过 podSelector 匹配Pod，在这些 Pod 所在节点上拉取镜像, 与 selector 不能同时设置.
#   matchLabels:
#     pod-label: xxx
#   matchExpressions:
#   - key: pod-label
#      operator: In
#        values:
#        - xxx
  completionPolicy:
    type: Always                  # [optional] 默认为 Always
    activeDeadlineSeconds: 1200   # [optional] 无默认值, 只对 Alway 类型生效
    ttlSecondsAfterFinished: 300  # [optional] 无默认值, 只对 Alway 类型生效
  pullPolicy:                     # [optional] 默认 backoffLimit=3, timeoutSeconds=600
    backoffLimit: 3
    timeoutSeconds: 300
```

以上就是本次分享的全部内容，主要目标为把 KubeSphere 的边缘计算用起来，那么这把剑舞到什么程度，还要继续打磨技术+专业服务。