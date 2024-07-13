---
title: "Port Requirements"
keywords: 'Kubernetes, KubeSphere, port-requirements, firewall-rules'
description: 'Understand the specific port requirements for different services in KubeSphere.'

linkTitle: "Port Requirements"
weight: 3150
version: "v3.4"
---


KubeSphere requires certain ports for the communications among services. If your network is configured with firewall rules, you need to ensure infrastructure components can communicate with each other through specific ports that act as communication endpoints for certain processes or services.

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
|local-registry|TCP|allow|5000||For the offline environment|
|local-apt|TCP|allow|5080||For the offline environment|
|rpcbind|TCP|allow|111|| Required if NFS is used|
|ipip| IPENCAP / IPIP|allow| | |Calico needs to allow the ipip protocol |
|metrics-server| TCP|allow| 8443 |


{{< notice note >}}
When you use the Calico network plugin and run your cluster in a classic network on cloud, you need to enable both IPENCAP and IPIP protocol for the source IP.
{{</ notice >}}