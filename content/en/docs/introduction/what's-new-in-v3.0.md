---
title: "What's New in 3.0"
keywords: 'Kubernetes, KubeSphere, new features'
description: "What's New in 3.0"
linkTitle: "What's New in 3.0"
weight: 1400
---

Published at the end of August, 2020, KubeSphere 3.0 is the most important version by far as it improves cluster management, observability, storage management, multi-tenant security, App Store, installation, and more. For more information about detailed explanations of new features in KubeSphere 3.0, see [KubeSphere 3.0.0 GA: Born for Hybrid Cloud Apps](../../../news/kubesphere-3.0.0-ga-announcement/).

## New Features in KubeSphere 3.0

- **Multi-cluster Management**. As we usher in an era of hybrid cloud, multi-cluster management has emerged as the call of our times. It represents one of the most necessary features on top of Kubernetes as it addresses the pressing need of our users. In the latest version 3.0, we have equipped KubeSphere with its unique multi-cluster feature that is able to provide a central control plane for clusters deployed in different clouds. Users can import and manage their existing Kubernetes clusters created on the platform of mainstream infrastructure providers (e.g. Amazon EKS and Google Kubernetes Engine). This will greatly reduce the learning cost for our users with operation and maintenance process streamlined as well. Solo and Federation are the two featured patterns for multi-cluster management, making KubeSphere stand out among its counterparts.

- **Improved Observability**. We have enhanced observability as it becomes more powerful to include custom monitoring, tenant event management, diversified notification methods (e.g. WeChat and Slack) and more features. Among others, users can now customize monitoring dashboards, with a variety of metrics and graphs to choose from for their own needs. It also deserves to mention that KubeSphere 3.0 is compatible with Prometheus, which is the de facto standard for Kubernetes monitoring in the cloud-native industry.

- **Enhanced Security**. Security has alway remained one of our focuses in KubeSphere. In this connection, feature enhancements can be summarized as follows:

  - **Auditing**. Records will be kept to track who does what at what time. The support of auditing is extremely important especially for traditional industries such as finance and banking.

  - **Network Policy and Isolation**. Network policies allow network isolation within the same cluster, which means firewalls can be set up between certain instances (Pods). By configuring network isolation to control traffic among Pods within the same cluster and traffic from outside, users can isolate applications with security enhanced. They can also decide whether services are accessible externally.

  - **Open Policy Agent**. KubeSphere provides flexible, fine-grained access control based on [Open Policy Agent](https://www.openpolicyagent.org/). Users can manage their security and authorization policies in a unified way with a general architecture.

  - **OAuth 2.0**. Users can now easily integrate third-party applications with OAuth 2.0 protocol.

- **Multilingual Support of Web Console**. KubeSphere is designed for users around the world at the very beginning. Thanks to our community members across the globe, KubeSphere 3.0 now supports four official languages for its web console: English, Simplified Chinese, Traditional Chinese, and Spanish. More languages are expected to be supported going forward.

In addition to the above highlights, KubeSphere 3.0 also features other functionality upgrades. For more and detailed information, see [Release Notes for 3.0.0](../../release/release-v300/).
