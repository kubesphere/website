---
title: 'KubeSphere Announces the Open-Source of Whizard：An Enterprise Distribution of Thanos'
tag: 'Product News'
keywords: 'KubeSphere, Kubernetes, Open-Source, Cloud Native, Whizard, Thanos'
description: 'Bringing Highly Available, Scalable, and Easy-to-Maintain Prometheus Long-Term Storage to Enterprises.'
createTime: '2024-08-22'
author: 'KubeSphere Community'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-whizard-20240822-en.png'
---

QingCloud has officially announced the open-source of Whizard, an enterprise distribution of Thanos. This new project provides enterprises with a highly available, scalable, easy-to-maintain, and secure Prometheus long-term storage option, addressing a critical need in the cloud-native ecosystem.

Prometheus has become the de facto standard in cloud-native monitoring. However, it falls short in meeting enterprise requirements for high availability, scalability, long-term data storage and query capabilities, ease of operation, and security. Thanos, a leading long-term storage project in the cloud-native community, enhances Prometheus with these capabilities. Despite its advantages, Thanos can be complex to deploy and manage, with numerous components and parameters, making it difficult to use and scale. Additionally, certain components lack horizontal scalability, and security configurations can be cumbersome or inadequate.

To address these challenges, the KubeSphere observability team at QingCloud initiated the development of Whizard, an enterprise edition of Thanos, in 2021. The first version was released in 2022, and since then, Whizard has evolved through eight versions. With the integration of Whizard into KubeSphere Enterprise v3.3.1, providing monitoring and alerting for large-scale Kubernetes (K8s) clusters and edge nodes, the solution has matured significantly through subsequent versions, including v3.4.0, v3.5.0, and v4.1.0.

## Key Features of Whizard:

- **Cloud-Native Deployment and Operation**: All components support definition and maintenance via Custom Resource Definitions (CRDs), simplifying configuration and operation. This includes Thanos components (Router, Ingester, Compactor, Store, Query, QueryFrontend, Ruler) and Whizard-specific components (Service, Tenant, Storage).
- **Tenant-Based Automatic Horizontal Scaling**: Recognizing that Horizontal Pod Autoscalers (HPA) based on CPU and Memory may not meet the stability requirements of enterprise-level stateful workloads, Whizard introduces a tenant-based workload scaling mechanism. Components such as Ingester, Compactor, and Ruler scale horizontally with tenant creation and deletion, ensuring stable operation and providing tenant-level horizontal scaling and resource reclamation.
- **Support for Multi-Cluster Management in K8s**: To enhance monitoring and alerting for multi-cluster K8s environments, Whizard's maintainers developed the whizard-adapter. This tool automatically creates or deletes Whizard tenants based on the creation or deletion of K8s or KubeSphere clusters, triggering the automatic scaling of Thanos stateful workloads.
- **Improved Rule Evaluation Scalability**: The native Thanos Ruler has limitations in horizontal scalability, which can slow down the evaluation of alerting and recording rules in large-scale K8s clusters (tenants). To address this, Whizard introduces tenant-specific Rulers, which are created and deleted automatically with the tenant lifecycle. Additionally, a global Ruler sharding mechanism is introduced to handle global rules across multiple clusters (tenants). Whizard also supports writing the recording rules of each tenant into their respective Ingesters, a feature not yet supported by Thanos Ruler.
- **Finer-Grained Rule Management**: PrometheusRule is commonly used to manage Prometheus recording and alerting rules, but this method is too coarse-grained, making concurrent editing and maintenance difficult. To solve this issue, Whizard introduces a finer-grained RuleGroup CRD to manage all rules within a single group. Additionally, a three-tier RuleGroup management mechanism is introduced, allowing for the management of rules at the namespace, cluster, and global levels, meeting enterprise needs for separate management of rules based on different permission scopes.
- **Time-Sharded Query Support for Object Storage Gateway Store**: Thanos allows for storing Prometheus data in object storage and supports querying vast amounts of monitoring data from it. However, querying large time ranges can lead to excessive resource usage. To mitigate this, Whizard introduces a time-sharded query mechanism for the Store, allowing users to create different Store CRDs for specific time ranges.
- **Gateway and Agent Proxy for Better Data Control**: Clients like Prometheus Agent or Prometheus do not need to interact directly with the Gateway. Instead, they can use the Whizard Agent Proxy to route data write and query requests to the Whizard Gateway, which then controls access based on tenant permissions.
- **Enterprise-Grade Security**: Recognizing that enterprise users often require enhanced security, Whizard supports easier TLS configuration between components. It also exposes Thanos WebUI through Whizard Gateway, supporting both Basic Auth and OAuth2-Proxy authentication methods, ensuring secure access to Thanos WebUI.
- **Simplified 2-Tiers Component Configuration**: Whizard supports a two-tiered component configuration, where common configurations can be set globally in the Service and shared across all tenant components. Customized configurations can be placed in individual Component CRDs for specific tenant needs.

## Open-Source Contribution:

As the enterprise edition of Thanos, Whizard's maintainers are actively involved in contributing to the Thanos project, submitting multiple PRs to enhance its capabilities.

## Future Prospects:

With the open-source release of Whizard, the KubeSphere observability team aims to extend its expertise in enterprise-level multi-cluster monitoring and alerting to a broader audience. They also hope to encourage more developers to participate in the Whizard project. Moving forward, the observability capabilities accumulated in various versions of KubeSphere will gradually converge into the WhizardTelemetry platform, continuing to evolve and encompassing monitoring, alerting, notifications, logs, events, auditing, and more (see KubeSphere Enterprise v4.1.0 Release Notes for details:  https://kubesphere.cloud/en/docs/kse/release-notes/v4.1.0#%E5%8F%AF%E8%A7%82%E6%B5%8B%E6%80%A7 ). The KubeSphere observability team also plans to enhance AI Infra observability, support OpenTelemetry-compliant tracing for large language model applications, and explore the potential of eBPF to empower observability, with the possibility of open-sourcing related projects.

## Get Whizard:

While Whizard's documentation is still under development, installation and usage instructions can be found in the Whizard GitHub repository at https://github.com/WhizardTelemetry/whizard. Additional support is available through the KubeSphere community.









