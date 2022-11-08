---
title: 'Kubernetes CNI 插件选型和应用场景探讨'
tag: 'KubeSphere, Kubernetes, CNI'
keywords: 'KubeSphere, Kubernetes, CNI, Cilium, Calico, Kube-OVN, Antrea, Submariner'
description: '本文介绍容器环境常见网络应用场景及对应场景的 Kubernetes CNI 插件功能实现,帮助搭建和使用云原生环境的小伙伴快速选择心仪的网络工具。'
createTime: '2022-11-02'
author: '马伟'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/202211081650620.jpg'
---

> 作者：马伟，青云科技容器顾问，云原生爱好者，目前专注于云原生技术，云原生领域技术栈涉及 Kubernetes、KubeSphere、KubeKey 等。

本文介绍容器环境常见网络应用场景及对应场景的 Kubernetes CNI 插件功能实现。帮助搭建和使用云原生环境的小伙伴快速选择心仪的网络工具。

## 常见网络插件

我们在学习容器网络的时候，肯定都听说过 Docker 的 bridge 网络，Vethpair，VxLAN 等术语，从 Docker 到 kubernetes 后，学习了 Flannel、Calico 等主流网络插件，分别代表了 Overlay 和 Underlay 的两种网络传输模式，也是很经典的两款 CNI 网络插件。那么，还有哪些好用的 CNI 插件呢 ? 我们看看 CNCF Landscape:

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021601323.png)

抛去商业版 CNI，此次分享来聊聊几款热门开源 CNI 插件，分别为 [Kube-OVN](https://www.kube-ovn.io/)、[Antrea](https://antrea.io/)、[Cilium](https://cilium.io/)。Kube-OVN 和 Antrea 都是基于 OpenvSwitch 的项目，Cilium 使用 eBPF 这款革命性的技术作为数据路径，亦是这两年很火热的一个开源容器项目。

那么，又回到学习新产品的第一步，如何快速部署 K8s 体验不同地 CNI 插件呢？还是交给我们亲爱的 Kubekey 吧。

[Kubekey](https://github.com/kubesphere/kubekey) 作为一个开源的 Kubernetes 和 [KubeSphere](https://kubesphere.com.cn/) 集群部署工具，可以轻松的部署 Kubernetes 集群，提供节点管理、操作系统安全加固、容器运行时管理、网络存储安装、Etcd 管理等。Kubekey 支持一键部署 Calico / Flannel / Cilium / Kube-OVN 等网络插件，只需在 kk 的配置文件中注明 network 的 plugin 值即可：

```yaml
  network:
    plugin: calico/kubeovn/cilium
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
```

对于 antrea，由于版本较新，目前可通过 addon 的形式添加 helm 文件的形式进行一键安装：

```yaml
  addons:
  - name: antrea
    namespace: kube-system
    sources: 
      chart: 
        name: antrea
        repo: https://charts.antrea.io
        # values:
```

在此基础上，可以通过以下一条命令

```bash
🐳  → kk create cluster --with-kubernetes --with-kubesphere
```

创建一个 kubernetes 集群并安装 KubeSphere，在此之上体验不同的 CNI 在 Kubernetes 的功能应用。毕竟，哪个运维人员不喜欢页面友好的容器管理平台呢？

![](https://files.mdnice.com/user/2166/0bc316fd-d837-4199-9b7d-3f483a5051c3.png)

## 网络应用场景

现在我们已经有了一个 Kubernetes 集群，先来思考一下，容器网络除了让集群正常运行，能让安装 Kubernetes 后 Pending 的 CoreDNS running 起来（抖个鸡灵-_-）以外还有哪些使用场景？

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021602337.png)

这里我通过一张图总结了七个主要使用的场景，应该也涵盖大部分运维人员网络需求。

- **固定 IP**。对于现存虚拟化 / 裸机业务 / 单体应用迁移到容器环境后，都是通过 IP 而非域名进行服务间调用，此时就需要 CNI 插件有固定 IP 的功能，包括 Pod/Deployment/Statefulset。
- **网络隔离**。不同租户或不同应用之间，容器组应该是不能互相调用或通信的。
- **多集群网络互联**。 对于不同的 Kubernetes 集群之间的微服务进行互相调用的场景，需要多集群网络互联。这种场景一般分为 IP 可达和 Service 互通，满足不同的微服务实例互相调用需求。
- **出向限制**。对于容器集群外的数据库 / 中间件，需能控制特定属性的容器应用才可访问，拒绝其他连接请求。
- **入向限制**。限制集群外应用对特定容器应用的访问。
- **带宽限制**。容器应用之间的网络访问加以带宽限制。
- **出口网关访问**。对于访问集群外特定应用的容器，设置出口网关对其进行 SNAT 以达到统一出口访问的审计和安全需求。
  理完需求和应用场景，我们来看看如何通过不同的 CNI 插件解决以上痛点。

## 网络插件功能实现

### 固定 IP

基本上主流 CNI 插件都有自己的 IPAM 机制，都支持固定 IP 及 IP Pool 的分配，并且各个 CNI 插件殊途同归的都使用了 Annotation 的方式指定固定 IP。对于 Pod，分配固定 IP，对于 Deployment，使用 IP Pool 的方式分配。对于有状态的 Statefulset，使用 IP Pool 分配后，会根据 Pool 的分配顺序记好 Pod 的 IP，以保证在 Pod 重启后仍能拿到同样的 IP。

#### Calico

```yaml
  "cni.projectcalico.org/ipAddrs": "[\"192.168.0.1\"]"
```

#### Kube-OVN

```yaml
ovn.kubernetes.io/ip_address: 192.168.100.100
ovn.kubernetes.io/ip_pool: 192.168.100.201,192.168.100.202
```

#### Antrea

Antrea IPAM 只能在 Bridge 模式下使用，因此可以在 Multus 的辅佐下，主网卡使用 NodeIPAM 分配，副网卡使用 Antrea IPAM 分配 VLAN 类型网络地址。

```yaml
    ipam.antrea.io/ippools: 'pod-ip-pool1'
    ipam.antrea.io/pod-ips: '<ip-in-pod-ip-pool1>'
```

#### Cilium

```yaml
Not Yet!
```

### 多集群网络互联

对于多集群网络互联，假设有现有多个集群，不同的微服务运行在不同的集群中，集群 1 的 App01 需要和集群 2 的 App02 进行通信，由于他们都是通过 IP 注册在集群外的 VM 注册中心的，所以 App01 和 App02 只能通过 IP 通信。在这种场景下，就需要多集群 Pod 互联互通。

#### Calico

对于 Calico 这种原生对 BGP 支持很好的 CNI 插件来说，很容易实现这一点，只要两个集群通过 BGP 建立邻居，将各自的路由宣告给对方即可实现动态路由的建立。若存在多个集群，使用 BGP RR 的形式也很好解决。但这种解决方式可能不是最理想的，因为需要和物理网络环境进行配合和联调，这就需要网络人员和容器运维人员一同进行多集群网络的建设，在后期运维和管理上都有不大方便和敏捷的感觉。

那 Calico VxLAN 模式呢？

既然说到 VxLAN，可以和 Kube-OVN、Antrea、Cilium 放到一起来看，四种 CNI 都支持 Overlay 的网络模型，都支持通过 VxLAN/GENEVE 的形式建立隧道网络打通容器网络通信。这就赋予运维人员较高的灵活性，对于容器网络的调教、IPAM 分配、网络监控和可观察性、网络策略调整都由容器集群运维人员负责，而网络人员则只需要提前划好物理网络大段，保证容器集群 Node 之间网络互通即可。

那如何去实现 overlay 网络的多集群互联呢？

#### Submariner

CNCF 有个沙箱项目叫 Submariner，它通过在不同集群建立不同的网关节点并打通隧道的形式实现多集群通信。从官方这张架构图来说明：

![](https://files.mdnice.com/user/2166/7add318a-cef0-4ecb-bd03-3e2c40c54160.png)

简单来说，Submariner 由一个集群元数据中介服务（broker）掌握不同集群的信息（Pod/Service CIDR），通过 Route Agent 将 Pod 流量从 Node 导向网关节点（Gateway Engine），然后由网关节点打通隧道丢到另一个集群中去，这个过程就和不同主机的容器之间使用 VxLAN 网络通信的概念是一致的。
要达成集群连接也很简单，在其中一个集群部署 Broker，然后通过 kubeconfig 或 context 分别进行注册即可。

```bash
🐳  → subctl deploy-broker --kubeconfig ~/.kube/config1
🐳  → subctl join --kubeconfig ~/.kube/config1 broker-info.subm --clusterid ks1 --natt=false --cable-driver vxlan --health-check=false
🐳  → subctl join --kubeconfig ~/.kube/config2 broker-info.subm --clusterid ks2 --natt=false --cable-driver vxlan --health-check=false
🐳  → subctl show all
✓ Showing Endpoints
CLUSTER ID                    ENDPOINT IP     PUBLIC IP       CABLE DRIVER        TYPE
ks1                           192.168.100.10  139.198.21.149  vxlan               local
ks2                           192.168.100.20  139.198.21.149  vxlan               remote
```

#### Cilium

Cilium Cluster Mesh 和 Submariner 有异曲同工之妙，可以通过隧道形式或 NativeRoute 形式实现集群互联。

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021603275.png)
![](https://pek3b.qingstor.com/kubesphere-community/images/202211021603503.png)

Cilium 开启多集群网络连接也很简单：

```bash
🐳  → cilium clustermesh enable --context $CLUSTER1
🐳  → cilium clustermesh enable --context $CLUSTER2
```

#### KubeOVN

Kube-OVN 还提供一个 OVNIC 的组件，它运行一个路由中继的 OVN-IC 的 Docker 容器，作为两个集群的网关节点，将不同集群的 Pod 网络进行连通。

### 多集群服务互访

除了 Pod IP 的互联互通，多集群网络还可考虑集群间的 Service 互访，Submariner、Cilium，Antrea 都能实现。Submariner 和 Antrea 都使用了 Kubernetes 社区的 MultiCluster Service 并在此之上结合自身组件实现多集群的服务访问。MultiCluster Service 通过 ServiceExport 和 ServiceImport 的 CRD，ServiceExport 将需要公开的服务导出，然后通过 ServiceImport 将此服务导入到另一个集群。

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021604841.png)

#### Submariner

拿 [Submariner](https://submariner.io/) 实现举例，有两个集群 ks1 和 ks2，ks1 在 test 命名空间有一个服务 nginx，此时通过 ServiceExport 将 nginx 服务进行导出，Submariner 会把这个 nginx.test.svc.**cluster.local** 服务发现为 nginx.test.svc.**clusterset.local**，两个集群的 coredns 都会建立一个新的 clusterset.local 的存根域，将所有匹配 cluster.set 的请求发送给 submariner 的服务发现的组件。同时 ServiceImport 导入到 ks2 集群，ks2 集群的 Pod 就可以通过 nginx.test.svc.**clusterset.local** 解析到 ks1 集群的 nginx Service。如果两个集群都有 nginx 的同名服务，此时 submariner 就可以优先本地进行访问，本地服务端点有故障后再访问其他集群的 nginx 服务，是不是可以开始构建双活服务了哈哈。

#### Antrea

Antrea 实现方式类似，也是结合 ServiceExport 和 ServiceImport 并进行封装成 ResourceExport 和 ResourceImport 构建多集群服务，在每个集群选择一个节点作为网关，通过网关打通不同集群隧道来实现多集群服务的访问。

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021604884.png)

#### Cilium

Cilium 没有用 MultiService 的概念，Cilium 通过 Global Service 的概念构建多集群访问服务访问。

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021604699.png)

从这张图可以看出，Cilium 更适合做多活集群的多集群服务访问需求，通过对相应的服务添加 Annotation 的做法，把不同集群的服务设定为 global-service，并通过 shared-service 和 service-affinity 来控制服务是否能被其他集群访问及服务亲和性。以下是一个例子：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  annotations:
    io.cilium/global-service: 'true'
    io.cilium/shared-service: 'true'
    io.cilium/service-affinity: 'local'
    # Possible values:
    # - local
    #    preferred endpoints from local cluster if available
    # - remote
    #    preferred endpoints from remote cluster if available
    # none (default)
    #    no preference. Default behavior if this annotation does not exist   
spec:
  type: ClusterIP
  ports:
    - port: 80
  selector:
    name: nginx
```

以上，当有多集群互访需求又不想 CNI 强相关时，可以尝试玩一下 Submariner，作为 CNCF Landscape Network 中一个专注于多集群互访的 SandBox 项目，Submariner 提供多集群网络通信，服务发现，以及安全加密，是一个很好的选择。

### 网络策略

对于 Pod 网络隔离、入向限制、出向限制的网络场景，可以整合成网络策略一同来说。主流开源 CNI 都支持 Kubernetes NetworkPolicy，通过 Network Policy，可以在 3 层或 4 层做相应的网络安全限制。Network Policy 通过 Ingress 和 Egress 两种进行网络限制，默认都是放行的。也就是说，设置 Kubernetes 网络策略，主要以白名单的形式对集群内的流量进行安全限制。

比如只允许指定 label 的 Pod 访问集群外数据库（通过 CIDR 指定）

```yaml
apiVersion: networking.K8s.io/v1
kind: NetworkPolicy
metadata:
  name: ingress-allow
  namespace: default
spec:
  podSelector: 
    matchLabels:
      role: db
  policyTypes:
  - Egress
egress:
    - to:
        - ipBlock:
            cidr: 192.168.100.40/24
      ports:
        - protocol: TCP
          port: 3306
```

```yaml
apiVersion: networking.K8s.io/v1
kind: NetworkPolicy
metadata:
  name: ingress-allow
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: app
  policyTypes:
    - Ingress
  ingress:
    - from:
        - ipBlock:
            cidr: 172.17.0.0/16
            except:
              - 172.17.1.0/24
        - namespaceSelector:
            matchLabels:
              project: web-project
        - podSelector:
            matchLabels:
              role: web
```

虽然 Network Policy 能满足大多场景，但是不是感觉还是少了点东西？比如 7 层策略、基于 NodeSelector、Drop/Reject 类型的策略指定、指定 Egress 节点进行控制等高级能力。这个时候 Cilium 和 Antrea 就大放异彩了。

#### Cilium

Cilium 有两个 CRD，CiliumNetworkPolicy 和 CiliumClusterwideNetworkPolicy，来实现单集群和多集群的网络策略能力。Cilium 支持 3、4、7 层网络策略。并增加 EndPoint Selector 和 Node Selector。除了普通的基于 PodSelector 和 CIDR 的限制，Cilium 可以支持更多种策略，比如：

DNS 限制策略，只允许 app: test-app 的端点通过 53 端口去 kube-system 命名空间的 "K8s:K8s-app": kube-dns 标签的 DNS 服务器访问 my-remote-service.com：

```yaml
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: "to-fqdn"
spec:
  endpointSelector:
    matchLabels:
      app: test-app
  egress:
    - toEndpoints:
      - matchLabels:
          "K8s:io.kubernetes.pod.namespace": kube-system
          "K8s:K8s-app": kube-dns
      toPorts:
        - ports:
           - port: "53"
             protocol: ANY
          rules:
            dns:
              - matchPattern: "*"
    - toFQDNs:
        - matchName: "my-remote-service.com"
```

Http 限制策略 , 只允许 org: empire 标签的端点对 deathstar 的 /v1/request-landing 进行 POST 操作：

```yaml
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: "rule"
spec:
  description: "L7 policy to restrict access to specific HTTP call"
  endpointSelector:
    matchLabels:
      org: empire
      class: deathstar
  ingress:
  - fromEndpoints:
    - matchLabels:
        org: empire
    toPorts:
    - ports:
      - port: "80"
        protocol: TCP
      rules:
        http:
        - method: "POST"
          path: "/v1/request-landing"
```

kafka 策略控制：

```yaml
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: "rule1"
spec:
  description: "enable empire-hq to produce to empire-announce and deathstar-plans"
  endpointSelector:
    matchLabels:
      app: kafka
  ingress:
  - fromEndpoints:
    - matchLabels:
        app: empire-hq
    toPorts:
    - ports:
      - port: "9092"
        protocol: TCP
      rules:
        kafka:
        - role: "produce"
          topic: "deathstar-plans"
        - role: "produce"
          topic: "empire-announce"
```

#### Antrea

Antrea 除了增加现有 NetworkPolicy 功能外，抽象了 Antrea NetworkPolicy 和 Antrea ClusterNetworkPolicy 两个 CRD 实现命名空间级别和集群级别的安全管理。，还提供了 Group，Tier 的概念，用于资源分组和优先级设计，嗯，果真是 NSX 的亲兄弟。因此 Antrea 有零信任的网络策略安全防护手段，可以实现严格的 pod 和命名空间隔离。

![](https://pek3b.qingstor.com/kubesphere-community/images/202211021605475.png)

网络层 Antrea 增加了对 ICMP 和 IGMP，Mutlicast 的限制，禁 ping 人员狂喜。

```yaml
apiVersion: crd.antrea.io/v1alpha1
kind: ClusterNetworkPolicy
metadata:
  name: acnp-reject-ping-request
spec:
    priority: 5
    tier: securityops
    appliedTo:
      - podSelector:
          matchLabels:
            role: server
        namespaceSelector:
          matchLabels:
            env: prod
    egress:
      - action: Reject
        protocols:
          - icmp:
              icmpType: 8
              icmpCode: 0
        name: DropPingRequest
        enableLogging: true
```

基于 FQDN 的过滤：

```yaml
apiVersion: crd.antrea.io/v1alpha1
kind: ClusterNetworkPolicy
metadata:
  name: acnp-fqdn-all-foobar
spec:
  priority: 1
  appliedTo:
  - podSelector:
      matchLabels:
        app: client
  egress:
  - action: Allow
    to:
      - fqdn: "*foobar.com"
    ports:
      - protocol: TCP
        port: 8080
  - action: Drop 
```

设置不同类型的 Group，基于 Group 设置网络策略，就不用对同类业务写一堆 Label 了

```yaml
apiVersion: crd.antrea.io/v1alpha3
kind: Group
metadata:
  name: test-grp-with-namespace
spec:
  podSelector:
    matchLabels:
      role: db
  namespaceSelector:
    matchLabels:
      env: prod
---
# Group that selects IP block 10.0.10.0/24.
apiVersion: crd.antrea.io/v1alpha3
kind: Group
metadata:
  name: test-grp-ip-block
spec:
  ipBlocks:
    - cidr: 10.0.10.0/24
---
apiVersion: crd.antrea.io/v1alpha3
kind: Group
metadata:
  name: test-grp-svc-ref
spec:
  serviceReference:
    name: test-service
    namespace: default
---
# Group that includes the previous Groups as childGroups.
apiVersion: crd.antrea.io/v1alpha3
kind: Group
metadata:
  name: test-grp-nested
spec:
  childGroups: [test-grp-sel, test-grp-ip-blocks, test-grp-svc-ref]
```

### Egress

对于特定业务出集群需不暴露 IP 或符合安全审计需求的场景，需要 Pod IP -> External IP 对外部业务进行访问。Cilium，Kube-OVN，Antrea 都有类似 Egress Gateway/Egress IP 的功能，特定标签的 Pod 通过 SNAT 为 Egress IP 访问集群外服务。

#### Cilium

```yaml
apiVersion: cilium.io/v2
kind: CiliumEgressGatewayPolicy
metadata:
  name: egress-sample
spec:
  selectors:
  - podSelector:
      matchLabels:
        app: snat-pod
        io.kubernetes.pod.namespace: default
  destinationCIDRs:
  - "0.0.0.0/0"
  egressGateway:
    nodeSelector:
      matchLabels:
        node.kubernetes.io/name: node1
    egressIP: 10.168.60.100
```

#### KubeOVN

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-gw
  annotations:
    ovn.kubernetes.io/eip: 172.10.0.1
    #或ovn.kubernetes.io/snat: 172.10.0.1
spec:
  containers:
  - name: eip-pod
    image: nginx:alpine
```

#### Antrea:

```yaml
apiVersion: crd.antrea.io/v1alpha2
kind: Egress
metadata:
  name: egress-staging-web
spec:
  appliedTo:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: staging
    podSelector:
      matchLabels:
        app: web
  externalIPPool: external-ip-pool
  #或IP形式 egressIP: 10.10.10.1
```

### 带宽管理

kube-ovn 和 Clium 都支持带宽管理，kube-ovn 还支持 QoS 调整，只需要 Annotation 一下即可搞定：

#### Kube-OVN

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qos
  namespace: ls1
  annotations:
    ovn.kubernetes.io/ingress_rate: "3"
    ovn.kubernetes.io/egress_rate: "1"
    ovn.kubernetes.io/latency: 3
    ovn.kubernetes.io/loss: 20
```

#### Cilium

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/egress-bandwidth: 10M
...
```

以上。就是此次分享的全部内容了，读到这里你可以也会感慨，从最早学 docker0，Vethpair 熟悉容器网络原理，到搭建 K8s 后节点 NotReady 就 apply 个 Flannel 逐步了解 CNI 插件机制，到今天的 CNCF Network&Service Proxy 生态的花团锦簇，云原生网络在日新月异的发展着，容器网络从最初的连通性到现在演变出更多的玩法和适用性，不论是网络功能、安全控制、网络洞察和可观测性，都在更好地为运维人员服务。若要体验更多功能，快到开源社区选择喜欢的容器网络项目 Hands on Lab 吧！