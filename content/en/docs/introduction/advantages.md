---
title: "Advantages"
keywords: "KubeSphere, Kubernetes, Advantages"
description: "KubeSphere Advantages"

weight: 1600
---

## Vision

Kubernetes has become the de facto standard for deploying containerized applications at scale in private, public and hybrid cloud environments. However, many people can easily get confused when they start to use Kubernetes as it is complicated and has many additional components to manage. Some components need to be installed and deployed by users themselves, such as storage and network services. At present, Kubernetes only provides open-source solutions or projects, which can be difficult to install, maintain and operate to some extent. For users, it is not always easy to quickly get started as they are faced with a steep learning curve.

KubeSphere is designed to reduce or eliminate many Kubernetes headaches related to building, deployment, management, observability and so on. It provides comprehensive services and automates provisioning, scaling and management of applications so that you can focus on code writing. More specifically, KubeSphere boasts an extensive portfolio of features including multi-cluster management, application lifecycle management, multi-tenant management, CI/CD pipelines, service mesh, and observability (monitoring, logging, alerting, auditing, events and notification).

As a comprehensive open-source platform, KubeSphere strives to make the container platform more user-friendly and powerful. With a highly responsive web console, KubeSphere provides a graphic interface for developing, testing and operating, which can be easily accessed in a browser. For users who are accustomed to command-line tools, they can quickly get familiar with KubeSphere as kubectl is also integrated in the fully-functioning web console. With the responsive UI design, users can create, modify and create their apps and resources with a minimal learning curve.

In addition, KubeSphere offers excellent solutions to storage and network. Apart from the major open-source storage solutions such as Ceph RBD and GlusterFS, users are also provided with [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/) and [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/), developed by QingCloud for persistent storage. With the integrated QingCloud CSI and NeonSAN CSI plugins, enterprises can enjoy a more stable and secure services of their apps and data.

## Why KubeSphere

KubeSphere provides high-performance and scalable container service management for enterprises. It aims to help them accomplish digital transformation driven by cutting-edge technologies, and accelerate app iteration and business delivery to meet the ever-changing needs of enterprises.

Here are the six major advantages that make KubeSphere stand out among its counterparts.

### Unified Management of Clusters across Cloud Providers

As container usage ramps up, enterprises are faced with increased complexity of cluster management as they deploy clusters across cloud and on-premises environments. To address the urgent need of users for a uniform platform to manage heterogeneous clusters, KubeSphere sees a major feature enhancement with substantial benefits. Users can leverage KubeSphere to manage, monitor, import, operate and retire clusters across regions, clouds and environments.

The feature can be enabled both before and after the installation, giving users great flexibility as they make their own decisions to use KubeSphere for their specific issues. In particular, it features:

**Unified Management**. Users can import Kubernetes clusters either through direct connection or with an agent. With simple configurations, the process can be done within minutes in the interactive console. Once clusters are imported, users are able to monitor the status and operate on cluster resources in a unified way.

**High Availability**. This is extremely useful when it comes to disaster recovery. A cluster can run major services with another one serving as the backup. When the major one goes down, services can be quickly taken over by another cluster. The logic is quite similar to the case when clusters are deployed in different regions, as requests can be sent to the closest one for low latency. In short, high availability is achieved across zones and clusters.

For more information, see [Multi-cluster Management](../../multicluster-management/).

### Powerful Observability

The observability feature of KubeSphere has been greatly improved with key building blocks enhanced, including monitoring, logging, auditing, events, alerting and notification. The highly functional system allows users to observe virtually everything that happens in the platform. It has much to offer for users with distinct advantages listed as below:

**Customized**. Users are allowed to customize their own monitoring dashboard with multiple display forms available. They can set their own templates based on their needs, add the metric they want to monitor and even choose the display color they prefer. Alerting policies and rules can all be customized as well, including repetition interval, time and threshold.

**Diversified**. Ops teams are freed from the complicated work of recording massive data as KubeSphere monitors resources from virtually all dimensions. It also features an efficient notification system with diversified channels for users to choose from.

**Visualized and Interactive**. KubeSphere presents users with a graphic web console, especially for the monitoring of different resources. They are displayed in highly interactive graphs that give users a clear view of what is happening inside a cluster. Resources at different levels can also be sorted based on their usage, which is convenient for users to compare for further data analysis.

**Accurate**. The entire monitoring system functions at second-level precision that allow users to quickly locate any component failures. In terms of events and auditing, all activities are accurately recorded for future reference.

For more information, see Project Administration and Usage.

### Automated DevOps

Automation represents a key part of implementing DevOps. With automatic, streamlined pipelines in place, users are better positioned to distribute apps in terms of continuous delivery and integration.

**Jenkins-powered**. KubeSphere DevOps system is built with Jenkins as the engine, which is abundant in plugins. On top of that, Jenkins provides an enabling environment for extension development, making it possible for the DevOps team to work smoothly across the whole process (developing, testing, building, deploying, monitoring, logging, notifying, etc.) in a unified platform. The KubeSphere account can also be used for the built-in Jenkins, meeting the demand of enterprises for multi-tenant isolation of CI/CD pipelines and unified authentication.

**Convenient built-in tools**. Users can easily take advantage of automation tools (e.g. Binary-to-Image and Source-to-Image) even without a thorough understanding of how Docker or Kubernetes works. They only need to submit a registry address or upload binary files (e.g. JAR/WAR/Binary). Ultimately, services will be released to Kubernetes automatically without any coding in a Dockerfile.

For more information, see DevOps Administration.

### Fine-grained Access Control

KubeSphere users are allowed to implement fine-grained access control across different levels, including clusters, workspaces and projects. Users with specific roles can operate on different resources if they are authorized to do so.

**Self-defined**. Apart from system roles, KubeSphere empowers users to define their roles with a spectrum of operations that they can assign to tenants. This meets the need of enterprises for detailed task allocation as they can decide who should be responsible for what while not being affected by irrelevant resources.

**Secure**. As tenants at different levels are completely isolated from each other, they can share resources while not affecting one another. The network can also be completely isolated to ensure data security.

For more information, see Role and Member Management in Workspace.

### Out-of-Box Microservices Governance

On the back of Istio, KubeSphere features major grayscale strategies. All these features are out of the box, which means consistent user experiences without any code hacking. Traffic control, for example, plays an essential role in microservices governance. In this connection, Ops teams, in particular, are able to implement operational patterns (e.g. circuit breaking) to compensate for poorly behaving services. Here are two major reasons why you use microservices governance, or service mesh in KubeSphere:

- **Comprehensive**. KubeSphere provides users with a well-diversified portfolio of solutions to traffic management, including canary release, blue-green deployment, traffic mirroring and circuit breaking. In addition, the distributed tracing feature also helps users monitor apps, locate failures, and improve performance. 
- **Visualized**. With a highly responsive web console, KubeSphere allows users to view how microservices interconnect with each other in a straightforward way.

KubeSphere aims to make service-to-service calls within the microservices architecture reliable and fast. For more information, see Project Administration and Usage.

### Vibrant Open Source Community

As an open-source project, KubeSphere represents more than just a container platform for app deployment and distribution. We believe that a true open-source model focuses more on sharing, discussions and problem solving with everyone involved. Together with partners, ambassadors and contributors, and other community members, we file issues, submit pull requests, participate in meetups, and exchange ideas of innovation.

At KubeSphere, we have the capabilities and technical know-how to help you share the benefits that the open-source model can offer. More importantly, we have community members from around the world who make everything here possible.

**Partners**. KubeSphere partners play a critical role in KubeSphere's go-to-market strategy. They can be app developers, technology companies, cloud providers or go-to-market partners, all of whom drive the community ahead in their respective aspects.

**Ambassadors**. As community representatives, ambassadors promote KubeSphere in a variety of ways (e.g. activities, blogs and user cases) so that more people can join us.

**Contributors**. KubeSphere contributors help the whole community by contributing to code or documentation. You don't need to be an expert while you can still make a different even it is a minor code fix or language improvement.

For more information, see [Partner Program](https://kubesphere.io/partner/) and [Community Governance](https://kubesphere.io/contribution/).