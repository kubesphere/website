---
title: "项目网络隔离"
keywords: 'KubeSphere, Kubernetes, Calico, 网络策略'
description: '了解网络隔离的概念以及如何配置项目网络策略。'
linkTitle: "项目网络隔离"
weight: 13300
version: "v3.4"
---

项目网络隔离使项目管理员能够使用不同的规则来放行不同的网络流量。本教程演示如何开启项目间的网络隔离并设置规则控制网络流量。

## 准备工作

- 已经启用[网络策略](../../pluggable-components/network-policy/)。
- 您必须有一个可用的项目和一个在项目层级拥有 `admin` 角色的用户 (`project-admin`)。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../quick-start/create-workspace-and-project/)。

{{< notice note >}}

关于网络策略的实现，您可以参考 [KubeSphere NetworkPolicy](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md)。

{{</ notice >}}

## 开启/关闭项目网络隔离

1. 以 `project-admin` 身份登录 KubeSphere 控制台，进入您的项目，在**项目设置**下选择**网络隔离**。项目网络隔离默认关闭。

2. 要启用项目网络隔离，请点击**开启**。

   {{< notice note >}}

   当网络隔离开启时，默认放行出站流量，而不同项目的进站流量将被拒绝。若您添加出站网络策略，只有符合策略的流量才会被放行。

   {{</ notice >}}

3. 您也可以在这个页面关闭网络隔离。

   {{< notice note >}}

   关闭网络隔离时，先前创建的所有网络策略都将被删除。

   {{</ notice >}}

## 设置网络策略

若开启网络隔离后的默认策略无法满足您的需求，您可以自定义网络策略来满足您的需求。目前，您可以在 KubeSphere 中为集群内部的流量或来自集群外部的入站流量添加自定义网络策略。

### 集群内部的流量

集群内部项目层级的网络策略用于控制同一集群内的其他项目是否能访问该项目中的资源，以及您能访问哪些服务 (Service)。

假设在另一个项目 `demo-project-2` 中已创建一个 NGINX 部署 (Deployment) 工作负载，并通过 `nginx` 服务使用 `TCP` 协议在 `80` 端口进行暴露。下面是如何设置入站和出站流量规则的示例。

{{< notice note >}}

有关如何创建工作负载的更多信息，请分别参见[部署](../../project-user-guide/application-workloads/deployments/)和[服务](../../project-user-guide/application-workloads/services/)。

{{</ notice >}} 

#### 放行来自不同项目的工作负载的入站流量

1. 在当前项目的**网络隔离**页面，选择**内部白名单**选项卡。

2. 点击**添加白名单条目**。

3. 在**流量方向**下选择**入站**。

4. 在**类型**下选择**项目**选项卡。

5. 选择 `demo-project-2` 项目。

6. 点击**确定**，然后您可以在白名单中看到该项目。


{{< notice note >}}

如果设置网络策略后仍无法访问该网络，您需要检查对等项目是否设置有相应的出站规则。

{{</ notice >}}

#### 放行前往不同项目的服务的出站流量

1. 在当前项目的**网络隔离**页面，选择**内部白名单**选项卡。

2. 点击**添加白名单条目**。

3. 在**流量方向**下选择**出站**。

4. 在**类型**下选择**服务**选项卡。

5. 在下拉列表中选择 `demo-project-2` 项目。

6. 选择允许接收出站流量的服务。在本例中，请选择 `nginx`。

7. 点击**确定**，然后您可以在白名单中看到该服务。


{{< notice note >}}

创建服务时，您必须确保该服务的选择器不为空。

{{</ notice >}}

### 集群外部的入站流量

KubeSphere 使用 CIDR 来区分对等方。假设当前项目中已创建一个 Tomcat 部署，并通过 `NodePort` 服务 `demo-service` 使用 `TCP` 协议在 `80` 端口进行暴露。要让 IP 地址为 `192.168.1.1` 的外部客户端访问该服务，您需要为其添加一个规则。

#### 放行来自集群外部客户端的入站流量

1. 在当前项目的**网络隔离**页面，选择**外部白名单**选项卡，然后点击**添加白名单条目**。

2. 在**流量方向**下选择**入站**。

3. 在 **网段** 中输入 `192.168.1.1/32`。

4. 选择 `TCP` 协议并输入 `80` 作为端口号。

5. 点击**确定**，然后您可以看到该规则已经添加。


{{< notice note >}}

建议在服务配置中将 `spec.externalTrafficPolicy` 设置为 `local`，以便数据包的源地址保持不变，即数据包的源地址就是客户端的源地址。

{{</ notice >}}

假设外部客户端的 IP 地址是 `http://10.1.0.1:80`，您需要为出站流量设置规则，以便内部服务可以访问它。

#### 放行前往集群外部服务的出站流量

1. 在当前项目的**网络隔离**页面，选择**外部白名单**选项卡，然后点击**添加白名单条目**。

2. 在**流量方向**下选择**出站**。

3. 在 **网段** 中输入 `10.1.0.1/32`。

4. 选择 `TCP` 协议并输入 `80` 作为端口号。

5. 点击**确定**，然后您可以看到该规则已经添加。


{{< notice note >}}

在步骤 4 中，若您选择 **SCTP**，请务必确保 SCTP [已启用](https://kubernetes.io/zh/docs/concepts/services-networking/network-policies/#sctp-支持)。

{{</ notice >}}

### 最佳做法

要确保一个项目中的所有 Pod 都安全，一个最佳做法是启用网络隔离。当网络隔离开启时，其他项目无法访问当前项目。如果需要让其他工作负载访问当前工作负载，您需要按照以下步骤操作：

1. 在**项目设置**中设置[网关](../../project-administration/project-gateway/)。
2. 通过服务将需要被访问的工作负载暴露给网关。
3. 放行来自网关所在命名空间的入站流量。

如果出站流量受控，您需要对能够访问哪些项目、服务和 IP 地址有一个清晰的计划，并逐个添加规则。如果您不确定要制定什么规则，建议保持现有网络策略不变。

## 常见问题

问：开启网络隔离后，为什么 KubeSphere 自定义监控系统无法获取数据？

答：您启用自定义监控后，KubeSphere 监控系统将访问 Pod 的指标。您需要放行来自 KubeSphere 监控系统的入站流量，否则无法访问 Pod 指标。

KubeSphere 提供 `allowedIngressNamespaces` 配置项来简化类似配置，在配置中列出的所有项目都会被放行。

```yaml
root@node1:~# kubectl get -n kubesphere-system clusterconfigurations.installer.kubesphere.io  ks-installer -o yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  ...
  name: ks-installer
  namespace: kubesphere-system
  ...
spec:
  ...
  networkpolicy:
    enabled: true
    nsnpOptions:
      allowedIngressNamespaces:
        - kubesphere-system
        - kubesphere-monitoring-system
  ...
```

问：通过服务 (Service) 设置网络策略后，为什么无法访问服务？

答：若您添加网络策略后通过集群 IP 地址访问服务但网络不通，请检查 kube-proxy 配置中的 `masqueradeAll` 是否为 `false`。

   ```yaml
   root@node1:~# kubectl get cm -n kube-system kube-proxy -o yaml
   apiVersion: v1
   data:
     config.conf: |-
       ...
       iptables:
         masqueradeAll: false
       ...  
     ...
   kind: ConfigMap
   metadata:
     ...
     labels:
       app: kube-proxy
     name: kube-proxy
     namespace: kube-system
     ...
   ```

问：设置入站规则时，如何确定 CIDR？

答：在 Kubernetes 中，数据包的源 IP 地址通常由 NAT 处理，因此您需要确定数据包的源地址，然后再添加规则。有关更多信息，请参考 [Source IP](https://github.com/kubesphere/community/blob/master/sig-network/concepts-and-designs/kubesphere-network-policy.md#source-ip)。
