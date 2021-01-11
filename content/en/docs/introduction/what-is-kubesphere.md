---
title: "What is KubeSphere"
keywords: 'Kubernetes, KubeSphere, Introduction'
description: 'What is KubeSphere'

weight: 1100
---

## Overview

[KubeSphere](https://kubesphere.io) is a **distributed operating system managing cloud-native applications** with [Kubernetes](https://kubernetes.io) as its kernel, providing a plug-and-play architecture for the seamless integration of third-party applications to boost its ecosystem.

KubeSphere also represents a multi-tenant enterprise-grade container platform with full-stack automated IT operation and streamlined DevOps workflows. It provides developer-friendly wizard web UI, helping enterprises to build out a more robust and feature-rich platform. It boasts the most common functionalities needed for enterprise Kubernetes strategies, such as Kubernetes resource management, DevOps (CI/CD), application lifecycle management, monitoring, logging, service mesh, multi-tenancy, alerting and notification, auditing, storage and networking, autoscaling, access control, GPU support, multi-cluster deployment and management, network policy, registry management, and security management.

KubeSphere delivers **consolidated views while integrating a wide breadth of ecosystem tools** around Kubernetes, thus providing consistent user experiences to reduce complexity. At the same time, it also features new capabilities that are not yet available in upstream Kubernetes, alleviating the pain points of Kubernetes including storage, network, security and usability. Not only does KubeSphere allow developers and DevOps teams use their favorite tools in a unified console, but, most importantly, these functionalities are loosely coupled with the platform since they are pluggable and optional.

## Run KubeSphere Everywhere

As a lightweight platform, KubeSphere has become more friendly to different cloud ecosystems as it does not change Kubernetes itself at all. In other words, KubeSphere can be deployed **on any existing version-compatible Kubernetes cluster on any infrastructure** including virtual machine, bare metal, on-premises, public cloud and hybrid cloud. KubeSphere users have the choice of installing KubeSphere on cloud and container platforms, such as Alibaba Cloud, AWS, QingCloud, Tencent Cloud, Huawei Cloud and Rancher, and even importing and managing their existing Kubernetes clusters created using major Kubernetes distributions. The seamless integration of KubeSphere into existing Kubernetes platforms means that the business of users will not be affected, without any modification to their current resources or assets. For more information, see [Installing on Linux](../../installing-on-linux/) and [Installing on Kubernetes](../../installing-on-kubernetes/).

KubeSphere hides the details of underlying infrastructure for users and helps enterprises modernize, migrate, deploy and manage existing and containerized apps seamlessly across a variety of infrastructure types. This is how KubeSphere empowers developers and Ops teams to focus on application development and accelerate DevOps automated workflows and delivery processes with enterprise-level observability and troubleshooting, unified monitoring and logging, centralized storage and networking management, easy-to-use CI/CD pipelines, and so on.

![kubesphere-ecosystem](/images/docs/introduction/kubesphere-ecosystem.png)

## What's New in 3.0

- **Multi-cluster Management**. As we usher in an era of hybrid cloud, multi-cluster management has emerged as the call of our times. It represents one of the most necessary features on top of Kubernetes as it addresses the pressing need of our users. In the latest version 3.0, we have equipped KubeSphere with its unique multi-cluster feature that is able to provide a central control plane for clusters deployed in different clouds. Users can import and manage their existing Kubernetes clusters created on the platform of mainstream infrastructure providers (e.g. Amazon EKS and Google Kubernetes Engine). This will greatly reduce the learning cost for our users with operation and maintenance process streamlined as well. Solo and Federation are the two featured patterns for multi-cluster management, making KubeSphere stand out among its counterparts.

- **Improved Observability**. We have enhanced observability as it becomes more powerful to include custom monitoring, tenant event management, diversified notification methods (e.g. WeChat and Slack) and more features. Among others, users can now customize monitoring dashboards, with a variety of metrics and graphs to choose from for their own needs. It also deserves to mention that KubeSphere 3.0 is compatible with Prometheus, which is the de facto standard for Kubernetes monitoring in the cloud-native industry.

- **Enhanced Security**. Security has alway remained one of our focuses in KubeSphere. In this connection, feature enhancements can be summarized as follows:

  - **Auditing**. Records will be kept to track who does what at what time. The support of auditing is extremely important especially for traditional industries such as finance and banking.

  - **Network Policy and Isolation**. Network policies allow network isolation within the same cluster, which means firewalls can be set up between certain instances (Pods). By configuring network isolation to control traffic among Pods within the same cluster and traffic from outside, users can isolate applications with security enhanced. They can also decide whether services are accessible externally.

  - **Open Policy Agent**. KubeSphere provides flexible, fine-grained access control based on [Open Policy Agent](https://www.openpolicyagent.org/). Users can manage their security and authorization policies in a unified way with a general architecture.

  - **OAuth 2.0**. Users can now easily integrate third-party applications with OAuth 2.0 protocol.

- **Multilingual Support of Web Console**. KubeSphere is designed for users around the world at the very beginning. Thanks to our community members across the globe, KubeSphere 3.0 now supports four official languages for its web console: English, Simplified Chinese, Traditional Chinese, and Spanish. More languages are expected to be supported going forward.

In addition to the above highlights, KubeSphere 3.0 also features other functionality upgrades. For more and detailed information, see [Release Notes for 3.0.0](../../release/release-v300/).

## Open Source

As we adopt the open source model, development is proceeding in an open way and driven by KubeSphere community. KubeSphere is **100% open source** and available on [GitHub](https://github.com/kubesphere/) where you can find all the source code, documents and discussions. It has been widely installed and used in development, testing and production environments, and a large number of services are running smoothly in KubeSphere.

## Roadmap

### Express Edition -> KubeSphere 1.0.x -> KubeSphere 2.0.x -> KubeSphere 2.1.x -> KubeSphere 3.0.0

![Roadmap](https://pek3b.qingstor.com/kubesphere-docs/png/20190926000413.png)

## Landscape

KubeSphere is a member of CNCF and a [Kubernetes Conformance Certified platform](https://www.cncf.io/certification/software-conformance/#logos), further enriching [CNCF CLOUD NATIVE Landscape.
](https://landscape.cncf.io/landscape=observability-and-analysis&license=apache-license-2-0)

![CNCF Landscape](https://pek3b.qingstor.com/kubesphere-docs/png/20191011233719.png)
