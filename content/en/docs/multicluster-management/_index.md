---
title: "Multi-cluster Management"
description: "Import a hosted or on-premises Kubernetes cluster into KubeSphere"
layout: "single"

linkTitle: "Multi-cluster Management"

weight: 3000

icon: "/images/docs/docs.svg"

---

Today, it's very common for organizations to run and manage multiple Kubernetes Clusters on different cloud providers or infrastructures. Each Kubernetes cluster is a relatively self-contained unit. And the upstream community is struggling to research and develop the multi-cluster management solution, such as [kubefed](https://github.com/kubernetes-sigs/kubefed).

The most common use cases in multi-cluster management including **service traffic load balancing, development and production isolation, decoupling of data processing and data storage, cross-cloud backup and disaster recovery, flexible allocation of computing resources, low latency access with cross-region services, and no vendor lock-in,** etc.

KubeSphere is developed to address the multi-cluster and multi-cloud management challenges and implement the proceeding user scenarios, providing users with a unified control plane to distribute applications and its replicas to multiple clusters from public cloud to on-premise environment. KubeSphere also provides rich observability cross multiple clusters including centralized monitoring, logging, events, and auditing logs.

![KubeSphere Multi-cluster Management](/images/docs/multi-cluster-overview.jpg)

## Most Popular Pages

Below you will find some of the most common and helpful pages from this chapter. We highly recommend you to review them at first.

{{< popularPage icon="/images/docs/bitmap.jpg" title="Install KubeSphere on AWS EC2" description="Provisioning a new Kubernetes and KubeSphere cluster based on AWS" link="" >}}
