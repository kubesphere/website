---
title: "Port Requirements"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''

linkTitle: "Requirements"
weight: 2120
---


KubeSphere requires certain ports to communicate among services, so you need to make sure the following ports open for use.

| Service | Protocol | Action | Start Port | End Port | Notes |
|---|---|---|---|---|---|
| ssh | TCP | allow | 22 | | |
| etcd | TCP | allow | 2379 | 2380 | |
| apiserver | TCP | allow | 6443 | | |
| calico | TCP | allow | 9099 | 9100 | |
| bgp | TCP | allow | 179 | | |
| nodeport | TCP | allow | 30000 | 32767 | |
| master | TCP | allow | 10250 | 10258 | |
| dns | TCP | allow | 53 | | |
| dns | UDP | allow | 53 | | |
| local-registry | TCP | allow | 5000 | | Required for air gapped environment|
| local-apt | TCP | allow | 5080 | | Required for air gapped environment|
| rpcbind | TCP | allow | 111 | | When using NFS as storage server |
| ipip | IPIP | allow | | | Calico network requires ipip protocol |

**Note**

Please note when you use Calico network plugin and run your cluster in classic network in cloud environment, you need to open IPIP protocol for souce IP. For instance, the following is the sample on QingCloud showing how to open IPIP protocol.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200304200605.png)
