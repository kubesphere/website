---
title: "KubeSphere 3.0.0 GA: Born for Hybrid Cloud Apps"
createTime: '2020-08-31'
keywords: "Kubernetes, KubeSphere, GA"
description: "That's a Killer! KubeSphere 3.0.0 is Now Generally Available!"
author: 'Feynman, Sherlock'
image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-3.0.0-release-cover.png
tag: "Product News"
---

August 31, 2020 - KubeSphere open source community today announces the General Availability of KubeSphere 3.0.0!

KubeSphere 3.0.0 highlights key features for hybrid clouds. It is born for **multi-cloud operation, multi-cluster deployment, multi-team cooperation and multi-tenant management**, boasting powerful enhancements for **cluster management, observability, storage and network management, multi-tenant security, App Store, installation and more**. It provides better user experiences as it becomes more interactive and responsive. KubeSphere 3.0.0 is by far the most important version ever released. As a unified control plane for multiple clouds and clusters, KubeSphere 3.0.0 will further drive enterprises forward as they implement their **multi-cloud and hybrid cloud strategies**. It greatly lowers the threshold for enterprises to operate and maintain Kubernetes clusters across any infrastructure. This is how KubeSphere works to achieve rapid delivery of modern applications in containerized environments. As a result, enterprises can greatly benefit from the **holistic platform-level solution** provided by KubeSphere to build cloud-native stacks in production.

"According to IDC expectations, 70% of enterprises will deploy unified VMs, Kubernetes, and multi-cloud management processes and tools by 2022. And half of enterprise applications will be deployed in containerized hybrid cloud and multi-cloud environments by 2023. Besides, more than 500 million digital applications and services will be developed using cloud-native approaches." Ray Zhou, head of KubeSphere R&D team talked about the development. "KubeSphere 3.0.0 has provided the most convenient solution amid the technology revolution focused on **hybrid cloud and cloud-native architectures**. In the future, it will also support container platforms designed for edge computing, big data or AI." KubeSphere has been designed with applications at its core with a consistent focus on users, who can easily get started at the minimum learning costs and enjoy the most interactive experiences provided by KubeSphere.

Most importantly, all of these cannot be achieved without **the strong support of members from the open source community and enterprises other than QingCloud**. In other words, KubeSphere 3.0.0 is a product of collaboration and cooperation of community members and engaged enterprises, who greatly contribute in terms of development, testing, bug report, feature enhancement, best practice sharing, documentation, internationalization and localization. For all of you who are part of this remarkable journey, we highly appreciate your contribution and list all your name at the end of the announcement.

## Major Updates in 3.0.0

KubeSphere 3.0.0 features federated deployment across clouds and unified management of multiple clusters, enabling enterprises to deploy their apps with one click onto different public clouds and private infrastructure. It represents a [container platform](https://kubesphere.io/) with the most powerful and feature-rich observability the industry has ever witnessed. It provides multi-dimensional metrics across clusters and applications for monitoring, logging, alerting and notification, auditing and events. It adds support for log query across different dimensions and tenants, as well as third-party apps for custom monitoring. As a result, developers and cluster administrators can get a clear view of how their apps and clusters are running and functioning. Storage and network capacity has been brought to another level in KubeSphere 3.0.0, which adds support for network isolation among tenants, firewall policy management, and network policy management of native Kubernetes. Snapshots, capacity management, and volume monitoring features are also supported.

## Multi-cloud and Multi-cluster Management

KubeSphere is committed to addressing multi-cloud and multi-cluster management as it echoes the most urgent need of users. Currently, traditional multi-cloud and hybrid cloud solutions are no longer applicable in the face of ever-changing user needs for different scenarios, such as **decoupled development and production environments, cross-cloud deployment and multi-cloud disaster recovery, multi-site high availability, decoupled data storage and service processing, and business traffic fluctuation handling**.

Against this backdrop, enterprises often adopt Kubernetes-based container technologies to deploy architectures across clouds. As a result, they are faced with a formidable challenge in terms of Kubernetes cluster management and maintenance across infrastructure. The feature of multi-cluster management across clouds that comes with KubeSphere 3.0.0 provides a central control plane managing multiple Kubernetes clusters. It enables users to control all Kubernetes clusters hosted on public clouds and on-premises, which means apps can be deployed and maintained in a unified way across clouds and clusters.

![multicloud](https://ap3.qingstor.com/kubesphere-website/docs/20200830101950.png)

## Multi-tenant and multi-dimensional Observability

Observability plays an important role in container platforms. In a narrow sense, it entails monitoring, logging and tracing. In a broad sense, it contains alerts, events and auditing. KubeSphere 3.0.0 has upgraded its portfolio of observability features including monitoring, logging and alerting. Besides, it adds support for custom monitoring, auditing logs in Kubernetes and KubeSphere, as well as Kubernetes event management. Platform auditing logs and Kubernetes event archiving, searching and alerting are also supported. Alert notifications can be sent via WeChat Work and Slack, which is extremely useful for enterprises to implement multi-tenant management and stringent security controls.

![multi-tenant-observability](https://ap3.qingstor.com/kubesphere-website/docs/20200830102226.png)

## OpenPitrix: Enterprise-grade App Store and Application Lifecycle Management

Based on OpenPitrix, a self-developed system for app management, App Store and application lifecycle management are one of the major factors that make KubeSphere different from its counterparts. KubeSphere App Store supports Helm 3 in 3.0.0 with more built-in apps. Users can deploy their apps to multiple clusters with just one click. Apps can be easily upgraded or rolled back.

By doing so, we look to empower developers to share their middleware, big data, and business applications internally in a more convenient way with APM effectively implemented as well. For ISV, KubeSphere 3.0.0 is now well-positioned to set industry standards of delivery process and application lifecycle management based on industry needs. Besides, metering will be supported in later versions, creating an highly operational app store that is applicable throughout the industry.

## O&M Friendly Storage and Network Management

KubeSphere has been upgraded to integrate the powerful capacity of cloud platforms for networking and storage into container platforms. That means users will be provided with stable, secure and convenient storage and network services just as they can enjoy on IaaS platforms.

In network management, KubeSphere now supports tenant network isolation at both workspace and project levels, firewall policy management, and network policy management of native Kubernetes, providing a more enabling, secure environment for different tenants to access apps. In addition, Porter v0.3.0, **a CNCF-certified load balancer developed by KubeSphere team**, is also integrated, creating smooth user experiences for those who run Kubernetes clusters on-premises (e.g. bare metal). In this way, they can expose services in the way as easy as they operate on cloud.

Persistent storage is one of the most important capabilities for enterprises to run Kubernetes clusters in a production environment. A reliable and stable solution is vital to data storage and security. KubeSphere 3.0.0 adds support for **volume snapshots, capacity management, and volume monitoring**, offering persistent storage maintenance services for stateful applications in a more convenient way. In this connection, users only need to configure storage plugins (e.g. QingCloud CSI, AWS EBS CSI and Ceph CSI) provided in the infrastructure environment in their installation files. After that, KubeSphere will automatically integrate corresponding storage features of public or private cloud providers for volume maintenance and monitoring.

## Department-wide Fine-grained Access Control

Generally, in branches of some large corporations, IT administrators and developers share a same cluster or even multiple Kubernetes clusters. KubeSphere 3.0.0 provides enterprises with the best practices of multi-tenant management. The level-based system features two views - cluster and workspace, offering minimal operation paths to cluster administrators, app developers and DevOps engineers. Cross-cluster access control helps IT administrators to keep track of team access, or what team has the authorization to access projects in a certain cluster. They can also manage resource access across all clusters in a unified way.

Besides, KubeSphere 3.0.0 adds support for LDAP and OAuth2 plugin. Users can now create their own workspaces and customize DevOps project roles. Administrators can import identity data in LDAP into KubeSphere so that the same set of identify information can be used to define the access policy on the platform.

## KubeKey: Efficient Tool for Cluster Deployment

The installation of KubeSphere remained a headache for community members in previous versions. In KubeSphere 3.0.0, we have developed a next-generation installer KubeKey with low installation thresholds, which has completely solved the issue of installation dependencies. Together with a group of community contributors, we have carried out a series of installation tests in the virtual machines of all major public clouds, hosted Kubernetes environments and private environments. Based on these tests, we have written detailed installation guides on these platforms so that users ranging from neophytes to professionals can all easily install KubeSphere in a production environment.

## Excellent User Experience: More Responsive and Interactive

In addition to the above highlights, KubeSphere 3.0.0 has also seen significant improvements in interactive design and user experience at the front end, with various thoughtful features newly created. For example, users can view the cluster, workspace, project and DevOps project that recently accessed in **History** of Toolkit, which can be quickly launched through keyword shortcuts. The navigation function is also enhanced with cluster administrators and tenants (i.e. app developers and DevOps teams) provided with respective operation views not affecting one another. Besides, users can easily create app resources and modify workloads through YAML. All of these can greatly improve the efficiency of daily operation and maintenance.

## Open Source: Community and Internalization

Thanks to the open source community, KubeSphere has accelerated the step to go global, with community members from over 90 countries and regions. Apart from Simplified Chinese and English, the web console of KubeSphere 3.0.0 also supports Traditional Chinese and Spanish, the localization of which is all contributed by community members. KubeSphere has partnered with overseas enterprises to build Spanish community and Turkish community, which lays a solid foundation for KubeSphere to further embrace the European market in the future.

As KubeSphere's continuing commitment to open source, the source code of a wide range of features in the latest version is already available in GitHub (`github.com/kubesphere`), including Porter, OpenPitrix, Fluentbit Operator, KubeKey, Notification Manager and Kube-events, as well as Kube-design, a set of frontend component libraries. Come and give us Stars, fork our repositories and even send us pull requests!

## Looking Forward

Here is a priority list for the next version of KubeSphere. If you are interested in these plans, or you have a better idea or suggestion, do not hesitate to contact us in the community.

- Edge computing with KubeEdge integrated.
- Unified management of traditional apps and cloud-native apps on a container platform (VM management based on KubeVirt).
- A more powerful and operational app store with more built-in apps.

## Acknowledgements

- [cw514102209](https://github.com/cw514102209) @ZTO
- Jie Chen @benlai.com
- [fu_changjie](https://github.com/Fuchange) @航天网络信息发展有限公司
- [shenhonglei](https://github.com/shenhonglei) @EC DATA
- [hantmac](https://github.com/hantmac) @掌门教育
- [juan-vg](https://github.com/juan-vg) @Geko Cloud
- [dpujadas](https://github.com/dpujadas) @Geko Cloud
- [xavi](https://github.com/xmfreak) @Geko Cloud
- [halil-bugol](https://github.com/halil-bugol) @Radore
- [Lien](https://github.com/lilien1010) @Apache APISIX
- Lynx @天智信达
- Renee @禅道
- Juan Xu @UISEE
- Haili Zhang @UISEE
- [Turtle](https://github.com/turtlechang) @WELL TAKE COMPUTER
- Howie @XIAO EDUCATION
- Haitao Pan @UCloud
- [long0419](https://github.com/long0419) @武汉麦尔沃克信息技术有限公司
- [xuelangos](https://github.com/xuelangos) @YOWANT
- [cooka](https://github.com/cooka) @KUKA
- Jian Zhang @JI HENG LINUX
- [zhuch-h](https://github.com/zhuch-h) @科莱
- [jackzhou](https://github.com/j4ckzh0u) @信大网御
