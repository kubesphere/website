---
title: "Port Requirements"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'How to set the port in firewall rules'

linkTitle: "Port Requirements"
weight: 2120
---


KubeSphere requires certain ports to communicate among services. If your network configuration uses a firewall，you need to ensure infrastructure components can communicate with each other through specific ports that act as communication endpoints for certain processes or services.

|services|protocol|action|start port|end port|comment
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
|local-registry|TCP|allow|5000||offline environment|
|local-apt|TCP|allow|5080||offline environment|
|rpcbind|TCP|allow|111|| use NFS |
|ipip| IPENCAP / IPIP|allow| | |calico needs to allow the ipip protocol |


{{< notice note >}}
Please note when you use Calico network plugin and run your cluster in classic network in cloud environment, you need to open both IPENCAP and IPIP protocol for source IP.
{{</ notice >}}
