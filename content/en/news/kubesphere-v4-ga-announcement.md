---
title: 'KubeSphere v4 is Released with the New Pluggable Architecture - LuBan'
tag: 'Product News'
keyword: 'open source, Kubernetes, KubeSphere, K8s, release, KubeSphere LuBan, plug-and-play'
description: 'Built on the new cloud-native extensible open architecture - KubeSphere LuBan, KubeSphere v4 serves as a cloud-native operating system that holds extraordinary significance for KubeSphere.'
createTime: '2024-10-10'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ks-v4-ga-cover.png'
---

On October 10, 2024, KubeSphere v4 (open source version) is officially released, along with the launch of the brand new pluggable architecture - KubeSphere LuBan.

Compared to all previous versions of KubeSphere, KubeSphere v4 represents a revolutionary change. Built on the new cloud-native extensible open architecture - KubeSphere LuBan, KubeSphere v4 serves as a cloud-native operating system that holds extraordinary significance for KubeSphere.

## KubeSphere LuBan

### What is KubeSphere LuBan

LuBan(鲁班), the ancestor of craftsmen in ancient China, symbolizes the wisdom and creativity of the laboring masses. He improved labor efficiency with tools, liberating workers from primitive and arduous tasks and revolutionizing civil engineering. Named after him, KubeSphere LuBan (KubeSphere Core) aims to offer businesses and developers a cloud-native product with low cost, rapid iteration, and flexible integration, providing a professional, versatile, and creative experience.

KubeSphere LuBan, a distributed, open, and scalable cloud-native architecture, provides a pluggable microkernel for extensions. From now on, all KubeSphere functional components and third-party components will seamlessly integrate into the KubeSphere console as extensions based on KubeSphere LuBan, and maintain their versions independently, truly achieving a plug-and-play cloud-native operating system.

The architectural design of KubeSphere LuBan is shown in the figure below.

![](https://kubesphere.io/images/ks-qkcp/zh/v4.0/4.0-architecture.png)

### Why Introduce KubeSphere LuBan

Since 2018, the KubeSphere multi-cloud container management platform has released over a dozen versions, including three major ones. To meet user demands, KubeSphere integrated numerous enterprise-grade features, such as multi-tenancy management, multi-cluster management, DevOps, GitOps, service mesh, microservices, observability (including monitoring, alerts, logging, auditing, events, notifications, etc.), App Store, edge computing, network, storage, etc.

While KubeSphere’s all-in-one container solution significantly enhances users' experience, it has also brought the following challenges:

- **Long release cycle**: Before releasing a new version, we must wait for all extensions to finish development and testing, and pass the integration testing.
- **Delayed user response**: Since each extension cannot be iterated separately, even when we have solved the issues of extensions submitted by users, we have to wait for the new release of KubeSphere to deliver the solutions to users, resulting in a delayed response.
- **Code coupling**: Although the old version supports enabling/disabling extensions individually, the frontend and backend code of these extensions are still coupled together, which tends to affect each other and is not architecturally elegant.
- **Excessive resource consumption**: Some extensions are enabled by default, which may consume excessive system resources for users who do not need them.

### Advantages of KubeSphere LuBan

- **Pluggable framework**: Support independent development and deployment of extensions to extend the functionality. Extensions can be added, upgraded, or removed as needed without modifying the code of the core framework.
- **Open UI component library**: Components are open to everyone and can be freely accessed, used, and extended. Users can customize and extend them according to their needs to meet different design and functionality requirements.
- **Real-time updates and fixes**: Developers can update and fix the frontend and backend in real time while the system is running, improving the efficiency of development and operation while ensuring the availability and user experience of applications.
- **Open extension center**: An open extension center - KubeSphere Marketplace is provided to encourage third-party developers to add new features or enhance existing ones to the system by extensions. They can develop and integrate their extensions within the system’s framework, seamlessly connect their extensions with the system, and collectively build a healthy and thriving ecosystem.

### What Can Be Achieved with KubeSphere LuBan

1. **For KubeSphere users**: KubeSphere users are free to choose and enable extensions. They can also seamlessly integrate their applications into the KubeSphere console. In addition, as the ecosystem of KubeSphere extensions is enriched, users can freely select a variety of products and services from the KubeSphere Marketplace, ultimately achieving a highly customized container management platform.

2. **For KubeSphere maintainers**: The extension mechanism allows KubeSphere maintainers to pay more attention to the development of KubeSphere Core, make it lighter, and shorten the release cycle. Additionally, since extensions can be iterated independently, user needs can be met more timely.

3. **For KubeSphere contributors**:The extension mechanism makes KubeSphere Core and other KubeSphere extensions more loosely coupled and easier to develop.

4. **For ISVs or open-source projects**: Numerous ISVs or open-source projects can seamlessly integrate their products or projects into the KubeSphere ecosystem at a low cost. For example, Karmada/KubeEdge developers can develop a standalone Karmada/KubeEdge console based on KubeSphere LuBan.

## Overview of KubeSphere v4

KubeSphere v4 is the latest cloud-native OS developed by the KubeSphere team, not only inheriting the powerful features of previous versions such as enterprise-level resource and business management and a one-stop cloud-native solution but also easily achieving upstream and downstream linkage of applications, free integration of various extensions, and providing a seamless business capability and highly consistent product experience.

The core part (KubeSphere Core) contains only the essential functionalities required for system running, while independent business modules are encapsulated in various components (Extensions).

### New Features

- Refactor based on the new microkernel architecture of KubeSphere LuBan.
- Introduce the KubeSphere Marketplace as a built-in feature.
- Support for managing extensions through the Extensions Center.
- UI and API can be extended.
- Support for one-click import of member clusters via kubeconfig.
- Support for KubeSphere Service Accounts.
- Support for dynamic extension of the Resource API.
Support for adding clusters, workspaces, and projects to quick access.
- Enabled file upload and download via container terminal.
Adapted to cloud-native gateways (Kubernetes Ingress API) from different vendors.
- Support API rate limiting.
- Support creating persistent volumes on the page.
- Support OCI-based Helm Chart repositories.

Additionally, KubeSphere v4.1.2 has added a default extension repository (see below).

It also fixed the following issues in KubeSphere v4.1.1:

- Fixed white screen pages of some extensions.
- Fixed problem of residual resources when uninstalling ks-core.
- Fixed installation failure in K8s 1.19 environments.

For other changes, please see the changelog:
- https://www.kubesphere.io/docs/v4.1/20-release-notes/release-v411/
- https://www.kubesphere.io/docs/v4.1/20-release-notes/release-v412/

### KubeSphere Extensions

KubeSphere extensions are used to expand the capabilities of KubeSphere. Users can dynamically install, uninstall, enable, and disable extensions while the system is running.

Monitoring, alerts, notifications, project and cluster gateways, volume snapshots, network isolation, and other functionalities are provided by extensions.

Currently, we have open-sourced 20 extensions, including:

- KubeSphere Network
- KubeSphere App Store Management
- KubeSphere Service Mesh
- KubeSphere Storage
- KubeSphere Multi-Cluster Agent Connection
- KubeSphere Gateway
- DevOps
- Application Management for Cluster Federation
- OpenSearch Distributed Search and Analytics Engine
- Grafana for WhizardTelemetry
- Grafana Loki for WhizardTelemetry
- WhizardTelemetry Data Pipeline
- WhizardTelemetry Platform Service
- WhizardTelemetry Alerting
- WhizardTelemetry Events
- WhizardTelemetry Logging
- WhizardTelemetry Monitoring
- WhizardTelemetry Notification
- Metrics Server
- Gatekeeper

Extension repository: https://github.com/kubesphere-extensions/ks-extensions/.

### Installation

**Attention: Currently, it is not supported to directly upgrade from  v3.4.x to v4. You need to uninstall the old version before installing v4.**

- How to Install KubeSphere: https://www.kubesphere.io/docs/v4.1/03-installation-and-upgrade/02-install-kubesphere/02-install-kubernetes-and-kubesphere/

- How to Install Extensions: https://www.kubesphere.io/docs/v4.1/06-extension-user-guide/01-install-components-pdf/

To upgrade from v4.1.1 to v4.1.2, run the following command:

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.2.tgz --debug --wait
```

To quickly start, please refer to: https://kubesphere.io/docs/v4.1/02-quickstart/01-install-kubesphere.

## Contribution

As mentioned earlier, the introduction of the extension mechanism makes KubeSphere Core and KubeSphere extensions more loosely coupled and easier to develop.

The community is gradually releasing open-source extensions, providing more features and more choices. Developers and ISVs are warmly welcomed to participate, develop your own extensions, and enrich the extension ecosystem together.

We are grateful for the contribution of the student, Zhang Qiming, who has developed an extension, **Pod Status Analysis Tool**, address: https://github.com/kubesphere-extensions/ks-extensions-contrib/tree/main/pod-analyzer.

- Repository for Contribution: https://github.com/kubesphere-extensions/ks-extensions-contrib

- Development Guide: https://dev-guide.kubesphere.io/extension-dev-guide/en/

## Future Plans

KubeSphere aims to build a cloud-native distributed operating system with Kubernetes as its core, featuring an architecture that facilitates plug-and-play integration of third-party applications with cloud-native ecological components. This architecture supports the unified distribution, operation, and maintenance management of cloud-native applications across multiple clouds and clusters. 

KubeSphere v4 realizes this vision, truly becoming a product with a pluggable architecture that allows users to select the extensions they need. In the future, we will offer more open-source extensions for users.