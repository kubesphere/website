---
title: "端口要求"
keywords: 'Kubernetes, KubeSphere, port-requirements, firewall-rules'
description: 'Port requirements in KubeSphere'

linkTitle: "端口要求"
weight: 2120
---

KubeSphere需要某些端口用于服务之间的通信。 如果您的网络配置有防火墙规则，则需要确保基础组件可以通过特定端口相互通信。

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
|local-registry|TCP|allow|5000||For offline environment|
|local-apt|TCP|allow|5080||For offline environment|
|rpcbind|TCP|allow|111|| Required if NFS is used|
|ipip| IPENCAP / IPIP|allow| | |Calico needs to allow the ipip protocol |

{{< notice note >}}
When you use the Calico network plugin and run your cluster in a classic network on cloud, you need to enable both IPENCAP and IPIP protocol for the source IP.
{{</ notice >}}