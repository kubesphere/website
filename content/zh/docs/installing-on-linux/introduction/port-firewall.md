---
title: "端口要求"
keywords: 'Kubernetes, KubeSphere, port-requirements, firewall-rules'
description: 'KubeSphere 组件通讯端口要求'

linkTitle: "端口要求"
weight: 2120
---

KubeSphere 需要某些端口用于服务之间的通信，如果您的网络配置有防火墙规则，则需要确保基础组件可以通过特定端口相互通信。

|Service|Protocol|Action|Start Port|End Port|Notes
|---|---|---|---|---|---|
|ssh|TCP|allow|22|
|etcd|TCP|allow|2379|2380|
|apiserver|TCP|allow|6443|
|calico|TCP|allow|9099|9100|
|bgp|TCP|allow|179||
|nodeport|TCP|allow|30000|32767|
|master|TCP|allow|10250|10258|
|dns|TCP|allow|53|
|dns|UDP|allow|53|
|local-registry|TCP|allow|5000||离线环境|
|local-apt|TCP|allow|5080||离线环境|
|rpcbind|TCP|allow|111|| 使用 NFS 时|
|ipip| IPENCAP / IPIP|allow| | |Calico 需要使用 IPIP 协议 |

{{< notice note >}}
当使用 Calico 网络插件并且在云平台上使用经典网络运行您的集群时，您需要对源地址使用 IPENCAP 和 IPIP 协议。
{{</ notice >}}
