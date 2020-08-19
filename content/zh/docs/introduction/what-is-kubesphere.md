---
title: "What is KubeSphere"
keywords: 'Kubernetes, docker, jenkins, devops, istio, service mesh, devops, microservice'
description: 'What is KubeSphere'

linkTitle: "Introduction"
weight: 1100
---

## Overview

[KubeSphere](https://kubesphere.io) is a **distributed operating system providing cloud native stack** with [Kubernetes](https://kubernetes.io) as its kernel, and aims to be plug-and-play architecture for third-party applications seamless integration to boost its ecosystem. KubeSphere is also a multi-tenant enterprise-grade container platform with full-stack automated IT operation and streamlined DevOps workflows. It provides developer-friendly wizard web UI, helping enterprises to build out a more robust and feature-rich platform, which includes most common functionalities needed for enterprise Kubernetes strategy, such as the Kubernetes resource management, DevOps (CI/CD), application lifecycle management, monitoring, logging, service mesh, multi-tenancy, alerting and notification, storage and networking, autoscaling, access control, GPU support, etc., as well as multi-cluster management, network policy, registry management, more security enhancements in upcoming releases.

KubeSphere delivers **consolidated views while integrating a wide breadth of ecosystem tools** around Kubernetes and offers consistent user experience to reduce complexity, and develops new features and capabilities that are not yet available in upstream Kubernetes in order to alleviate the pain points of Kubernetes including storage, network, security and ease of use. Not only does KubeSphere allow developers and DevOps teams use their favorite tools in a unified console, but, most importantly, these functionalities are loosely coupled with the platform since they are pluggable and optional.

Last but not least, KubeSphere does not change Kubernetes itself at all. In another word, KubeSphere can be deployed **on any existing version-compatible Kubernetes cluster across any infrastructure** including virtual machine, bare metal, on-premise, public cloud and hybrid cloud. KubeSphere screens users from the infrastructure underneath and helps your enterprise modernize, migrate, deploy and manage existing and containerized apps seamlessly across a variety of infrastructure, so that developers and Ops team can focus on application development and accelerate DevOps automated workflows and delivery processes with enterprise-level observability and troubleshooting, unified monitoring and logging, centralized storage and networking management, easy-to-use CI/CD pipelines.

![KubeSphere Overview](https://pek3b.qingstor.com/kubesphere-docs/png/20200224091526.png)

## Video on Youtube

<iframe width="560" height="315" src="https://www.youtube.com/embed/u5lQvhi_Xlc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## What is New in 2.1

We decouple some main feature components and make them pluggable and optional to choose so that users can install a default KubeSphere with resource requirements down to 2 cores CPU and 4G memory. Meanwhile, there are great enhancements in application store, especially in application lifecycle management.

It is worth mentioning that both DevOps and observability components have been improved significantly. For example, we add lots of new features including Binary-to-Image, dependency caching support in pipeline, branch switch support and Git logs output within DevOps component. We also bring upgrade, enhancements and bugfix in storage, authentication and security, as well as user experience improvements. See [Release Notes For 2.1.0](../../release/release-v210) for details.

## Open Source

As we adopt open source model, development is taking in the open way and driven by KubeSphere community. KubeSphere is **100% open source** and available on [GitHub](https://github.com/kubesphere/) where you can find all source code, documents and discussions. It has been widely installed and used in development testing and production environments, and a large number of services are running smoothly in KubeSphere.

## Roadmap

### Express Edition -> KubeSphere 1.0.x -> KubeSphere 2.0.x -> KubeSphere 2.1.x -> KubeSphere 3.0.0

![Roadmap](https://pek3b.qingstor.com/kubesphere-docs/png/20190926000413.png)

## Landscapes

KubeSphere is a member of CNCF and a [Kubernetes Conformance Certified platform
](https://www.cncf.io/certification/software-conformance/#logos), which enriches the [CNCF CLOUD NATIVE Landscape.
](https://landscape.cncf.io/landscape=observability-and-analysis&license=apache-license-2-0)

![CNCF Landscape](https://pek3b.qingstor.com/kubesphere-docs/png/20191011233719.png)
