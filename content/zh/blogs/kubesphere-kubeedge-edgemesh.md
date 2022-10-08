---
title: '使用 KubeEdge 和 EdgeMesh 实现边缘复杂网络场景下的节点通信'
tag: 'KubeSphere'
keywords: 'KubeSphere, KubeEdge, EdgeMesh, Kubernetes, 边缘计算'
description: '为了更好的支持 KubeEdge 并提供可视化界面管理边缘节点，本文档使用 KubeSphere 平台用来管理边缘节点。'
createTime: '2022-09-22'
author: '吴波'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-kubeedge-edgemesh-cover.png'
---

> 作者：吴波，来自北京的运维工程师，专注于云原生，KubeSphere 狂热爱好者。

## 简介

KubeEdge 是面向边缘计算场景、专为边云协同设计的业界首个云原生边缘计算框架，在 K8s  原生的容器编排调度能力之上实现了边云之间的应用协同、资源协同、数据协同和设备协同等能力，完整打通了边缘计算中云、边、设备协同的场景。其中 KubeEdge 架构主要包含云边端三部分：

- 云上是统一的控制面，包含原生的 K8s 管理组件，以及 KubeEdge 自研的 CloudCore 组件，负责监听云端资源的变化，提供可靠和高效的云边消息同步。
- 边侧主要是 EdgeCore 组件，包含 Edged、MetaManager、EdgeHub 等模块，通过接收云端的消息，负责容器的生命周期管理。
- 端侧主要是 device mapper 和 eventBus，负责端侧设备的接入。

![](https://pek3b.qingstor.com/kubesphere-community/images/fa9d0a79-b3fa-49d4-917d-18ad80db4e6d.png)

### 底层逻辑

KubeEdge 是 K8s 在边缘场景下的延伸。目标是将 K8s 对容器编排的能力延伸到边缘上；
KubeEdge 主要包含两个组件，云端的 CloudCore 和边缘节点上 EdgeCore，同时还有一个 Device 模块，用于管理海量的边缘设备。

![](https://pek3b.qingstor.com/kubesphere-community/images/dd3d2f20-66e5-4a46-89dc-a34794124673.png)

### KubeEdge 功能组件

- **[Edged](https://kubeedge.io/zh/docs/architecture/edge/edged "Edged"):** 在边缘节点上运行并管理容器化应用程序的代理。
- **[EdgeHub](https://kubeedge.io/zh/docs/architecture/edge/edgehub "EdgeHub"):** Web 套接字客户端，负责与 Cloud Service 进行交互以进行边缘计算（例如 KubeEdge 体系结构中的 Edge Controller）。这包括将云侧资源更新同步到边缘，并将边缘侧主机和设备状态变更报告给云。
- **[CloudHub](https://kubeedge.io/zh/docs/architecture/cloud/cloudhub "CloudHub"):** Web 套接字服务器，负责在云端缓存信息、监视变更，并向 EdgeHub 端发送消息。
- **[EdgeController](https://kubeedge.io/zh/docs/architecture/cloud/edge_controller "EdgeController"):** kubernetes 的扩展控制器，用于管理边缘节点和 pod 的元数据，以便可以将数据定位到对应的边缘节点。
- **[EventBus](https://kubeedge.io/zh/docs/architecture/edge/eventbus "EventBus"):** 一个与 MQTT 服务器（mosquitto）进行交互的 MQTT 客户端，为其他组件提供发布和订阅功能。
- **[DeviceTwin](https://kubeedge.io/zh/docs/architecture/edge/devicetwin "DeviceTwin"):** 负责存储设备状态并将设备状态同步到云端。它还为应用程序提供查询接口。
- **[MetaManager](https://kubeedge.io/zh/docs/architecture/edge/metamanager "MetaManager"):** Edged 端和 EdgeHub 端之间的消息处理器。它还负责将元数据存储到轻量级数据库（SQLite）或从轻量级数据库（SQLite）检索元数据。

## KubeEdge

为了更好的支持 KubeEdge 并提供可视化界面管理边缘节点，本文档使用 KubeSphere 平台用来管理边缘节点，[KubeSphere 官方文档](https://kubesphere.com.cn/docs/v3.3/ "KubeSphere 官方文档")。

### 配置云端（KubeEdge Master 节点）

#### 1、启用 KubeEdge

使用 admin 身份访问 KubeSphere 控制台，进入集群管理，点击`定制资源定义`，找到 `ClusterConfiguration`，编辑 `ks-install`；

![](https://pek3b.qingstor.com/kubesphere-community/images/c361f736-8274-46a5-9ec0-8138a86fe28c.png)

1. 在该配置文件中找到 `edgeruntime` 和 `kubeedge`，将 `enabled` 的值修改为 `true`；
2. 修改 `edgeruntime.kubeedge.cloudCore.cloudHub.advertiseAddress` 的值设置为公网 IP 地址；

完成后点击右下角的 " 确定 "，并检查 `ks-installer` 的日志查看部署状态。

#### 2、配置公网端口转发

启动完成后使用如下命令即可看到 CloudCore 的 NodePort 端口。

```bash
$ kubectl get svc -n kubeedge -l k8s-app=kubeedge
NAME        TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)                                                                           AGE
cloudcore   NodePort   10.96.0.106   <none>        10000:30000/TCP,10001:30001/TCP,10002:30002/TCP,10003:30003/TCP,10004:30004/TCP   3m
```

需要按照下列端口配置公网端口转发，将 10000-10004 端口转发到 NodePort 的 30000-30004 端口。

| 字段              | 外网端口 | 字段                  | 内网端口 |
| ----------------- | -------- | --------------------- | -------- |
| cloudhubPort      | 10000    | cloudhubNodePort      | 30000    |
| cloudhubQuicPort  | 10001    | cloudhubQuicNodePort  | 30001    |
| cloudhubHttpsPort | 10002    | cloudhubHttpsNodePort | 30002    |
| cloudstreamPort   | 10003    | cloudstreamNodePort   | 30003    |
| tunnelPort        | 10004    | tunnelNodePort        | 30004    |

如果有云厂商，则需要创建负载均衡按照上述表格的规则进行转发。
如果没有云厂商，可以使用如下命令配置 `iptables` 规则进行端口转发：

```bash
iptables -t nat -A PREROUTING -p tcp --dport 10000 -j REDIRECT --to-ports 30000
iptables -t nat -A PREROUTING -p tcp --dport 10001 -j REDIRECT --to-ports 30001
iptables -t nat -A PREROUTING -p tcp --dport 10002 -j REDIRECT --to-ports 30002
iptables -t nat -A PREROUTING -p tcp --dport 10003 -j REDIRECT --to-ports 30003
iptables -t nat -A PREROUTING -p tcp --dport 10004 -j REDIRECT --to-ports 30004
```

#### 3、配置 iptables 守护进程

部署完成后，发现 DaemonSet 资源 iptables 未调度到 k8s-master 节点上，需要配置容忍 master 污点。

```bash
$ kubectl get pod -o wide -n kubeedge
NAME                               READY   STATUS    RESTARTS   AGE   IP             NODE           NOMINATED NODE   READINESS GATES
cloud-iptables-manager-q9bsx       1/1     Running   0          28m   172.20.1.12    k8s-node02     <none>           <none>
cloud-iptables-manager-vvpv8       1/1     Running   0          28m   172.20.1.11    k8s-node01     <none>           <none>
cloudcore-54b7f4f699-wcpjc         1/1     Running   0          70m   10.244.0.27    k8s-node02     <none>           <none>
edgeservice-855fdd8f94-8zd8k       1/1     Running   0          53m   10.244.0.42    k8s-node02     <none>           <none>
```

找到 " 应用负载 "-" 工作负载 "-" 守护进程集 "，编辑 "cloud-iptables-manager" 添加如下配置：

```yaml
kind: DaemonSet
apiVersion: apps/v1
metadata:
  name: cloud-iptables-manager
  namespace: kubeedge
spec:
  template:
    spec:
      ......
      # 添加如下配置
      tolerations:
        - key: node-role.kubernetes.io/master
          operator: Exists
          effect: NoSchedule
```

注：如果未修改以上配置，则在 KubeSphere 上无法对边缘节点的 Pod 查看日志和执行命令。

配置完成后再次检查 iptables 守护进程是否已经调度到所有节点。

```bash
$ kubectl get pod -o wide -n kubeedge
NAME                               READY   STATUS    RESTARTS   AGE   IP             NODE           NOMINATED NODE   READINESS GATES
cloud-iptables-manager-q9bsx       1/1     Running   0          28m   172.20.1.12    k8s-node02     <none>           <none>
cloud-iptables-manager-vvpv8       1/1     Running   0          28m   172.20.1.11    k8s-node01     <none>           <none>
cloud-iptables-manager-zwmdg       1/1     Running   0          29m   172.20.1.10    k8s-master     <none>           <none>
cloudcore-54b7f4f699-wcpjc         1/1     Running   0          70m   10.244.0.27    k8s-node02     <none>           <none>
edgeservice-855fdd8f94-8zd8k       1/1     Running   0          53m   10.244.0.42    k8s-node02     <none>           <none>
```

### 配置边端（KubeEdge Node 节点）

添加边缘节点文档：**https://kubesphere.com.cn/docs/installing-on-linux/cluster-operation/add-edge-nodes/**

> KubeEdge 支持多种容器运行时，包括 Docker、Containerd、CRI-O 和 Virtlet。有关更多信息，请参见 [ KubeEdge 文档](https://docs.kubeedge.io/zh/docs/advanced/cri/ " KubeEdge 文档")。
> 为了确保 KubeSphere 可以获取 Pod 指标，需要在边缘端安装 Docker v19.3.0 或更高版本。

#### **添加边缘节点**

![](https://pek3b.qingstor.com/kubesphere-community/images/1ffe6783-e8bc-44ae-b7cc-7ec4208923ea.png)

到边缘端执行 KubeSphere 上复制过来的命令：

```bash
arch=$(uname -m); if [[ $arch != x86_64 ]]; then arch='arm64'; fi;  curl -LO https://kubeedge.pek3b.qingstor.com/bin/v1.9.2/$arch/keadm-v1.9.2-linux-$arch.tar.gz \
 &&  tar xvf keadm-v1.9.2-linux-$arch.tar.gz \
 && chmod +x keadm && ./keadm join --kubeedge-version=1.9.2 --region=zh --cloudcore-ipport=1x.xx.xx.28:10000 --quicport 10001 --certport 10002 --tunnelport 10004 --edgenode-name edge-node-01 --edgenode-ip 192.168.1.63 --token c2d7e72e15d28aa3e2b9340b9429982595b527b334a756be919993f45b7422b1.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTY2NDU5NDJ9.bQeNr4RFca5GByALxVEQbiQpEYTyyWNzpDQVhm39vc8 --with-edge-taint
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 52.3M  100 52.3M    0     0  1020k      0  0:00:52  0:00:52 --:--:-- 1057k
./keadm
install MQTT service successfully.
kubeedge-v1.9.2-linux-amd64.tar.gz checksum:
checksum_kubeedge-v1.9.2-linux-amd64.tar.gz.txt content:
[Run as service] start to download service file for edgecore
[Run as service] success to download service file for edgecore
kubeedge-v1.9.2-linux-amd64/
kubeedge-v1.9.2-linux-amd64/cloud/
kubeedge-v1.9.2-linux-amd64/cloud/cloudcore/
kubeedge-v1.9.2-linux-amd64/cloud/cloudcore/cloudcore
kubeedge-v1.9.2-linux-amd64/cloud/iptablesmanager/
kubeedge-v1.9.2-linux-amd64/cloud/iptablesmanager/iptablesmanager
kubeedge-v1.9.2-linux-amd64/cloud/csidriver/
kubeedge-v1.9.2-linux-amd64/cloud/csidriver/csidriver
kubeedge-v1.9.2-linux-amd64/cloud/admission/
kubeedge-v1.9.2-linux-amd64/cloud/admission/admission
kubeedge-v1.9.2-linux-amd64/edge/
kubeedge-v1.9.2-linux-amd64/edge/edgecore
kubeedge-v1.9.2-linux-amd64/version
 
KubeEdge edgecore is running, For logs visit: journalctl -u edgecore.service -b
```

查看边缘节点是否添加成功：

```bash
$ kubectl get nodes
NAME           STATUS   ROLES                  AGE   VERSION
edge-node-01   Ready    agent,edge             23h   v1.21.4-kubeedge-v1.9.2
k8s-master     Ready    control-plane,master   16d   v1.21.5
k8s-node01     Ready    <none>                 16d   v1.21.5
k8s-node02     Ready    <none>                 25h   v1.21.5
```

![](https://pek3b.qingstor.com/kubesphere-community/images/cac520b8-1a8d-4eae-99ff-8a8c6666a00b.png)

边缘节点加入集群后，部分 Pod 在调度至该边缘节点上后可能会一直处于 Pending 状态。由于部分守护进程集（例如，Calico）有强容忍度，您需要使用以下脚本手动 Patch Pod 以防止它们调度至该边缘节点。

```bash
#!/bin/bash
NodeSelectorPatchJson='{"spec":{"template":{"spec":{"nodeSelector":{"node-role.kubernetes.io/master": "","node-role.kubernetes.io/worker": ""}}}}}'
 
NoShedulePatchJson='{"spec":{"template":{"spec":{"affinity":{"nodeAffinity":{"requiredDuringSchedulingIgnoredDuringExecution":{"nodeSelectorTerms":[{"matchExpressions":[{"key":"node-role.kubernetes.io/edge","operator":"DoesNotExist"}]}]}}}}}}}'
 
edgenode="edgenode"
if [ $1 ]; then
        edgenode="$1"
fi
 
namespaces=($(kubectl get pods -A -o wide |egrep -i $edgenode | awk '{print $1}' ))
pods=($(kubectl get pods -A -o wide |egrep -i $edgenode | awk '{print $2}' ))
length=${#namespaces[@]}
 
for((i=0;i<$length;i++)); 
do
        ns=${namespaces[$i]}
        pod=${pods[$i]}
        resources=$(kubectl -n $ns describe pod $pod | grep "Controlled By" |awk '{print $3}')
        echo "Patching for ns:"${namespaces[$i]}",resources:"$resources
        kubectl -n $ns patch $resources --type merge --patch "$NoShedulePatchJson"
        sleep 1
done
```

#### 收集边缘节点监控信息

1、在 `ClusterConfiguration` 的 `ks-installer` 中，将 `metrics_server` 的 `enable` 改为 `true`。

2、到边缘节点编辑 `vim /etc/kubeedge/config/edgecore.yaml` 配置文件将 `edgeStream` 的 `enable` 改为 `true`

```yaml
edgeStream:
  enable: true
  handshakeTimeout: 30
  readDeadline: 15
  server: 1x.xx.xx.x8:10004
  tlsTunnelCAFile: /etc/kubeedge/ca/rootCA.crt
  tlsTunnelCertFile: /etc/kubeedge/certs/server.crt
  tlsTunnelPrivateKeyFile: /etc/kubeedge/certs/server.key
  writeDeadline: 15
```

3、重启 `systemctl restart edgecore.service`

![](https://pek3b.qingstor.com/kubesphere-community/images/9ede167d-b30f-41d6-93f1-f0a9c68b075a.png)

部署到边缘节点的 Pod 需要配置容忍污点：

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "node-role.kubernetes.io/edge"
    operator: "Exists"
    effect: "NoSchedule"
```

## EdgeMesh

### 简介

EdgeMesh 的定位是 KubeEdge 用户数据面轻量化的通讯组件，完成节点之间网络的 Mesh，在边缘复杂网络拓扑上的节点之间建立 P2P 通道，并在此通道上完成边缘集群中流量的管理和转发，最终为用户 KubeEdge 集群中的容器应用提供与 K8s Service 一致的服务发现与流量转发体验。

官网：https://edgemesh.netlify.app/zh/

![](https://pek3b.qingstor.com/kubesphere-community/images/fcf864d5-8f75-4dcd-a3fe-3b3132aa5c4e.png)

上图展示了 EdgeMesh 的简要架构，EdgeMesh 包含两个微服务：edgemesh-server 和 edgemesh-agent。

**EdgeMesh-Server：**

- EdgeMesh-Server 运行在云上节点，具有一个公网 IP，监听来自 EdgeMesh-Agent 的连接请求，并协助 EdgeMesh-Agent 之间完成 UDP 打洞，建立 P2P 连接；
- 在 EdgeMesh-Agent 之间打洞失败的情况下，负责中继 EdgeMesh-Agent 之间的流量，保证 100% 的流量中转成功率。

**EdgeMesh-Agent：**

- EdgeMesh-Agent 的 DNS 模块，是内置的轻量级 DNS Server，完成 Service 域名到 ClusterIP 的转换。
- EdgeMesh-Agent 的 Proxy 模块，负责集群的 Service 服务发现与 ClusterIP 的流量劫持。
- EdgeMesh-Agent 的 Tunnel 模块，在启动时，会建立与 EdgeMesh-Server 的长连接，在两个边缘节点上的应用需要通信时，会通过 EdgeMesh-Server 进行 UDP 打洞，尝试建立 P2P 连接，一旦连接建立成功，后续两个边缘节点上的流量不需要经过 EdgeMesh-Server 的中转，进而降低网络时延。

### EdgeMesh 工作原理

云端是标准的 K8s 集群，可以使用任意 CNI 网络插件，比如 Flannel、Calico，可以部署任意 K8s 原生组件，比如 Kubelet、KubeProxy；
同时云端部署 KubeEdge 云上组件 CloudCore，边缘节点上运行 KubeEdge 边缘组件 EdgeCore，完成边缘节点向云上集群的注册。

![](https://pek3b.qingstor.com/kubesphere-community/images/997fff83-17e5-45e0-a54d-f02f1022f555.png)

**核心优势：**

1. **跨子网边边 / 边云服务通信：** 无论应用部署在云上，还是在不同子网的边缘节点，都能够提供通 K8s Service 一致的使用体验。
2. **低时延：** 通过 UDP 打洞，完成 EdgeMesh-Agent 之间的 P2P 直连，数据通信无需经过 EdgeMesh-Server 中转。
3. **轻量化：** 内置 DNS Server、EdgeProxy，边缘侧无需依赖 CoreDNS、KubeProxy、CNI 插件等原生组件。
4. **非侵入：** 使用原生 K8s Service 定义，无需自定义 CRD，无需自定义字段，降低用户使用成本。
5. **适用性强：** 不需要边缘站点具有公网 IP，不需要用户搭建 VPN，只需要 EdgeMesh-Server 部署节点具有公网 IP 且边缘节点可以访问公网。

### 部署 EdgeMesh

使用 admin 身份登入 KubeSphere，点击工作台进入 "system-workspace" 工作空间，在 kubesphere-master 集群项目中找到 kubeedge 并进入，在该项目应用负载中创建基于模板的应用，选择从 " 应用商店 " 搜索找到 "edgemesh" 并点击安装，安装前请确认安装位置是否正确。

![](https://pek3b.qingstor.com/kubesphere-community/images/7539cd15-1e9e-4a2e-8e71-3c2fa0043017.png)

在应用设置中修改如下几处内容并点击安装：

```yaml
server:
  nodeName: "k8s-node01"   # 指定edgemesh-server部署的节点
  advertiseAddress:
    - 1x.xx.xx.x8         # 指定edgemesh-server对外暴漏服务的IP列表（此处填写的是华为云ELB的公网IP）
  modules:
    tunnel:
      enable: true
      listenPort: 20004    # 需要将该端口暴漏到公网（无需修改）
agent:
  modules:
    edgeProxy:
      enable: true
      socks5Proxy:
        enable: true       # 开启SSH隧道代理
        listenPort: 10800
```

部署完成后需要设置 edgemesh-agent 的节点容忍，使其能调度到 master 和 edge 节点上。

```yaml
spec:
  template:
    spec:
      # 添加如下内容
      tolerations:
        - key: node-role.kubernetes.io/edge
          operator: Exists
          effect: NoSchedule
        - key: node-role.kubernetes.io/master
          operator: Exists
          effect: NoSchedule
```

最后查看部署结果（确保 edgemesh-agent 在每一个节点都运行了一个 Pod）：

```bash
$ kubectl get pod -n kubeedge -o wide
NAME                               READY   STATUS    RESTARTS   AGE   IP             NODE           NOMINATED NODE   READINESS GATES
cloud-iptables-manager-q9bsx       1/1     Running   0          16h   172.20.1.12    k8s-node02     <none>           <none>
cloud-iptables-manager-vvpv8       1/1     Running   0          16h   172.20.1.11    k8s-node01     <none>           <none>
cloud-iptables-manager-zwmdg       1/1     Running   0          16h   172.20.1.10    k8s-master     <none>           <none>
cloudcore-54b7f4f699-wcpjc         1/1     Running   0          16h   10.244.0.27    k8s-node02     <none>           <none>
edgemesh-agent-2l25t               1/1     Running   0          15m   172.20.1.12    k8s-node02     <none>           <none>
edgemesh-agent-cd67c               1/1     Running   0          14m   172.20.1.11    k8s-node01     <none>           <none>
edgemesh-agent-jtl9l               1/1     Running   0          14m   192.168.1.63   edge-node-01   <none>           <none>
edgemesh-agent-vdmzc               1/1     Running   0          16m   172.20.1.10    k8s-master     <none>           <none>
edgemesh-server-65b6db88fb-stckp   1/1     Running   0          16h   172.20.1.11    k8s-node01     <none>           <none>
edgeservice-855fdd8f94-8zd8k       1/1     Running   0          16h   10.244.0.42    k8s-node02     <none>           <none>
```

#### SSH 隧道代理

前提条件

1. 请确保 edgemesh-agent 已经开启了 socks5Proxy。
2. 确保执行 k8s-master 节点安装了 nc 命令，如没有请执行 `yum -y install nc` 进行安装。

```bash
$ kubectl get nodes
NAME           STATUS   ROLES                  AGE   VERSION
edge-node-01   Ready    agent,edge             21h   v1.21.4-kubeedge-v1.9.2
k8s-master     Ready    control-plane,master   16d   v1.21.5
k8s-node01     Ready    <none>                 16d   v1.21.5
k8s-node02     Ready    <none>                 23h   v1.21.5
 
$ ssh -o "ProxyCommand nc --proxy-type socks5 --proxy 169.254.96.16:10800 %h %p" root@edge-node-01
The authenticity of host 'edge-node-01 (<no hostip for proxy command>)' can't be established.
ECDSA key fingerprint is SHA256:alzjCdezpa8WxcW6lZ70x6sZ4J5193wM2naFG7nNmOw.
ECDSA key fingerprint is MD5:56:b7:08:1d:79:65:2e:84:8f:92:2a:d9:48:3a:15:31.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'edge-node-01' (ECDSA) to the list of known hosts.
root@edge-node-01's password:
Last failed login: Fri Jul  1 09:33:11 CST 2022 from 192.168.1.63 on ssh:notty
There was 1 failed login attempt since the last successful login.
Last login: Fri Jul  1 09:25:01 2022 from 192.168.20.168
[root@edge-node-01 ~]#
```

注：由于节点的 IP 可能重复，所以只支持通过节点名称进行连接。

在 v3.3.0 版本中可支持在 ks 控制台中登入终端。

![](https://pek3b.qingstor.com/kubesphere-community/images/d72959b6-58be-42b4-9cf3-e91439283af4.png)

#### 错误处理

kubeedge 和 edgemesh 的服务都正常且日志没有报错，但是云和边无法互相访问。

云端配置：

```bash
# 在云端，开启 dynamicController 模块，并重启 cloudcore
$ kubectl edit cm cloudcore -n kubeedge
modules:
  ..
  dynamicController:
    enable: true
..
$ kubectl rollout restart deploy cloudcore -n kubeedge
```

边缘端配置：

```bash
# 打开 metaServer 模块（如果你的 KubeEdge < 1.8.0，还需关闭 edgeMesh 模块）
vim /etc/kubeedge/config/edgecore.yaml
modules:
  ..
  edgeMesh:
    enable: false
  ..
  metaManager:
    metaServer:
      enable: true
# 配置 clusterDNS 和 clusterDomain
$ vim /etc/kubeedge/config/edgecore.yaml
modules:
  ..
  edged:
    clusterDNS: 169.254.96.16
    clusterDomain: cluster.local
 
# 重启 edgecore
$ systemctl restart edgecore
```

验证：

```bash
$ curl 127.0.0.1:10550/api/v1/services
{"apiVersion":"v1","items":[{"apiVersion":"v1","kind":"Service","......}
```

#### 相关问题

Q：安全信怎么做防护的？
A：EdgeMesh-Server 与 EdgeMesh-Agent 之间都有证书进行加密。

Q：服务之间通信效率？
A：在 500 qps 以内访问接近于直连网络，网络损耗特别低，打洞成功会有 10% 左右中继的消耗。

Q：资源消耗情况？
A：每一个 EdgeMesh-Agent 占用内存不到 40 兆，CPU 只有 1%-5% 以内。