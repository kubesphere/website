---
title: "Overview"
keywords: 'kubernetes, kubesphere, multicluster, hybrid-cloud'
description: 'Overview'


weight: 2335
---

Today, it's very common for organizations to run and manage multiple Kubernetes Clusters on different cloud providers or infrastructures. Each Kubernetes cluster is a relatively self-contained unit. And the upstream community is struggling to research and develop the multi-cluster management solution, such as [kubefed](https://github.com/kubernetes-sigs/kubefed).

The most common use cases in multi-cluster management including **service traffic load balancing, development and production isolation, decoupling of data processing and data storage, cross-cloud backup and disaster recovery, flexible allocation of computing resources, low latency access with cross-region services, and no vendor lock-in,** etc.

KubeSphere is developed to address the multi-cluster and multi-cloud management challenges and implement the proceeding user scenarios, providing users with a unified control plane to distribute applications and its replicas to multiple clusters from public cloud to on-premise environment. KubeSphere also provides rich observability cross multiple clusters including centralized monitoring, logging, events, and auditing logs.

![KubeSphere Multi-cluster Management](/images/docs/multi-cluster-overview.jpg)
