---
title: "端口要求"
keywords: 'Kubernetes, KubeSphere, 端口要求, 防火墙规则'
description: 'KubeSphere 组件通讯端口要求'

linkTitle: "端口要求"
weight: 3140
---

KubeSphere 需要某些端口用于服务之间的通信。如果您的网络配置有防火墙规则，则需要确保基础设施组件可以通过特定端口相互通信。这些端口用作某些进程或服务的通信端点。

|服务|协议|行为|起始端口|结束端口|备注
|---|---|---|---|---|---|
|ssh|TCP|接受|22|
|etcd|TCP|接受|2379|2380|
|apiserver|TCP|接受|6443|
|calico|TCP|接受|9099|9100|
|bgp|TCP|接受|179||
|nodeport|TCP|接受|30000|32767|
|master|TCP|接受|10250|10258|
|dns|TCP|接受|53|
|dns|UDP|接受|53|
|local-registry|TCP|接受|5000||离线环境需要|
|local-apt|TCP|接受|5080||离线环境需要|
|rpcbind|TCP|接受|111|| 使用 NFS 时需要|
|ipip| IPENCAP / IPIP|接受| | |Calico 需要使用 IPIP 协议 |

{{< notice note >}}
当您使用 Calico 网络插件并且在云平台上使用经典网络运行集群时，您需要对源地址启用 IPENCAP 和 IPIP 协议。
{{</ notice >}}