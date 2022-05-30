---
title: 'Extending Kubernetes to Edge: KubeSphere Container Platform 3.1 General Availability'
keywords: KubeSphere, GA
description: The KubeSphere community announced the general availability of KubeSphere v3.1.0 which features edge node management, metering and billing, enhanced DevOps and more.
tag: 'Kubernetes, KubeSphere, GA, Announcement'
createTime: '2021-05-14'
author: 'Sherlock'
snapshot: '/images/blogs/en/kubesphere-3.1.0-ga-announcement/banner.png'
---

On April 29, 2021, the KubeSphere community was excited to announce the general availability of KubeSphere v3.1.0. KubeSphere, as an app-centric distributed operating system running on top of Kubernetes, has further expanded its portfolio to deliver more robust experiences for users across the globe. This has once again echoed our commitment: enabling our users to run Kubernetes workloads where and when they want with ease and security.

KubeSphere v3.1.0 looks to provide an enabling environment for users **as they deploy production workloads not just across clouds but also at the edge**. Besides, the new **Metering and Billing** function helps you better understand infrastructure operating costs. Existing features of **multi-cluster management**, **multi-tenant management**, **observability**, **DevOps**, **application lifecycle management**, and **microservices governance** have also been enhanced as we work to ensure better user experiences **across clusters and clouds**.

"KubeSphere has emerged as one of the most popular Kubernetes distributions," said Ray Zhou, Head of the KubeSphere project. "The release of KubeSphere 3.1 marks an important milestone as we further empower enterprises to gain first-mover advantages especially in edge computing."

In a world where everything is connected, our legacy system with centralized storage and computing can no longer satisfy our demand for efficiency and capacity. An increasing number of use cases requiring low-latency processing, AI and IoT have all spoken volumes for a booming edge computing market. According to [a CNCF survey](https://www.cncf.io/wp-content/uploads/2021/05/KubernetesEdge_Survey_Report_2021_v2.pdf), the top three challenges facing enterprises when authoring, deploying and/or running applications at the edge are:

1. Security of the deployment and content.
2. Edge devices going offline.
3. Observability of activities/status at edge.

Against this backdrop, the KubeSphere community has been working closely with the KubeEdge community to take Kubernetes to the edge. With a unified standard, users now can add and manage edge nodes to their cluster, deploy workloads on edge nodes, and monitor edge nodes on the back of a strong observability system.

And most importantly, the new version would not have been possible without the contribution of every member in the community, whose footprints can be found in virtually every aspect, including feature development, function testing, bug reports and fixes, requests and suggestions, enterprise best practices, internationalization and localization, and documentation. All of these explain the power of the community and what the community will continue to offer for a long time to come.

## Major Updates at a Glance

![notable-changes-in-3.1](/images/blogs/en/kubesphere-3.1.0-ga-announcement/notable-changes-in-3.1.png)

### Metering and billing

As part of our commitment to providing a holistic platform, KubeSphere v3.1.0 is equipped with a brand-new feature of [metering and billing](https://kubesphere.io/docs/toolbox/metering-and-billing/view-resource-consumption/). It records resource usage in clusters and workspaces while you can dive deep into nodes, projects, workloads, and Pods.

You use KubeSphere **Metering and Billing** to:

- Track detailed resource consumption at different levels on a unified dashboard.
- Specify a date range to view data within a specific billing cycle.
- Customize the prices of multiple resources, including CPU, memory, storage and network traffic.
- Make better-informed decisions on cluster resource planning.
- Identify opportunities for workload changes that can optimize your spending.
- Export metering and billing data for further analysis.

![metering-and-billing](/images/blogs/en/kubesphere-3.1.0-ga-announcement/metering-and-billing.png)

![metering-and-billing-2](/images/blogs/en/kubesphere-3.1.0-ga-announcement/metering-and-billing-2.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/z1VrkAvdCi4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Going forward, the [KubeSphere Container Platform](https://kubesphere.io/) seeks to provide a more comprehensive operational system for metering and billing.

### Edge node management

KubeEdge is an open-source system for extending containerized application orchestration capabilities to hosts at the edge. It looks to provide unified management of cloud and edge applications and resources with reliability and security. That said, it lacks the support of a highly functional system to control modules running on the cloud. And this is exactly where KubeSphere comes to play its part amid growing use cases of edge computing.

KubeSphere works perfectly with KubeEdge as it boasts a wizard user interface that allows you to enable KubeEdge and add edge nodes without getting stuck in complex configurations. [After KubeEdge is enabled](https://kubesphere.io/docs/pluggable-components/kubeedge/), you can [add edge nodes](https://kubesphere.io/docs/installing-on-linux/cluster-operation/add-edge-nodes/) to your cluster by simply running a single command on them. Furthermore, you can deploy workloads on your edge devices and view logging and monitoring data of them on the console directly.

![edge-node-added](/images/blogs/en/kubesphere-3.1.0-ga-announcement/edge-node-added.png)

Together, KubeSphere and KubeEdge strive to offer a complete workflow of application delivery and management on edge devices.

### Multi-cloud and multi-cluster management

[Multi-cloud and multi-cluster management](https://kubesphere.io/docs/multicluster-management/) is one of the most important features for KubeSphere. Most importantly, it returns great benefits for every enterprise managing heterogeneous clusters across clouds. At the same time, we want to keep pushing ourselves as we notice an increasing number of users are seeking for a lightweight approach to managing Member Clusters.

![multi-cluster-architecture](/images/blogs/en/kubesphere-3.1.0-ga-announcement/multi-cluster-architecture.png)

To this end, we have optimized the multi-cluster feature by removing some component dependencies (for example, Redis and OpenLDAP) in Member Clusters. The steps to import Member Clusters have also been simplified with configuration validation (e.g. `jwtSecret`) added.

In addition, Tower now supports high availability to give you more choices as you create a more stable and functional multi-cluster architecture.

### Observability 

Observability has remained a central focus for us from day one as we work to help you understand and improve the health, performance, and availability of your resources no matter where they are deployed. In the new version, we have made our observability system more powerful and comprehensive:

- **Monitoring**. You can configure `ServiceMonitor` resources on the console. PromQL auto-completion and syntax highlighting are supported now. Custom monitoring dashboards can be created at the cluster level.
- **Alerting**. The entire alerting system has been refactored without any dependency on MySQL, Redis and etcd. In KubeSphere v3.1.0, we use Thanos Ruler and the build-in rules of Prometheus.
- **Notification**. Notification Manager v1.0.0 is integrated into KubeSphere. Different notification methods can be configured on the KubeSphere console directly, including email, DingTalk, Slack, WeCom and Webhook.
- **Logging**. Support kubelet, Docker, and containerd log collection. Logs can be exported to [Loki](https://github.com/kubesphere/fluentbit-operator/blob/master/docs/plugins/output/loki.md).

![alerting](/images/blogs/en/kubesphere-3.1.0-ga-announcement/alerting.png)

![notification](/images/blogs/en/kubesphere-3.1.0-ga-announcement/notification.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/rheLUnCCbsA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### DevOps

[KubeSphere DevOps](https://kubesphere.io/docs/devops-user-guide/understand-and-manage-devops-projects/overview/) is one of the most used - if not the most used - functions among KubeSphere users as it automates software release processes. Since its integration into KubeSphere, it has greatly increased enterprises' ability to deliver applications and services with speed and security.

The new KubeSphere DevOps System has been further stabilized to improve user experiences. In the new version, you can:

- Clone a pipeline.
- Run pipelines in a batch.
- [Create a multi-branch pipeline with GitLab](https://kubesphere.io/docs/devops-user-guide/how-to-use/gitlab-multibranch-pipeline/).
- [Use built-in CI/CD templates](https://kubesphere.io/docs/devops-user-guide/how-to-use/use-pipeline-templates/).

![pipeline-templates](/images/blogs/en/kubesphere-3.1.0-ga-announcement/pipeline-templates.png)

The CI/CD templates we provide can be used in most cases directly while you can edit them as needed. As part of our effort to offer out-of-the-box features, these templates will help you build and deliver products  more rapidly and reliably.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MU5LdM83x9s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Microservices governance

KubeSphere provides a variety of traffic governance solutions based on Istio, including grayscale release, circuiting breaking, and distributed tracing. As we renew our commitment to visualization and observability, we have enhanced microservices governance features:

- Istio upgraded to 1.6.10.
- Traffic direction between Services is now displayed on the console.
- Support NGINX Ingress Gateway monitoring.
- Add NGINX Ingress Controller metrics.
- Users can now manage Istio directly through Kiali.

![microservices](/images/blogs/en/kubesphere-3.1.0-ga-announcement/microservices.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/XRwCA819c90" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Installation

Since the inception of [KubeKey](https://kubesphere.io/docs/installing-on-linux/introduction/kubekey/) as an open-source project, it has seen increasing popularity among not just KubeSphere users but Kubernetes users, who also use KubeKey to install cloud-native tools. Together with the release of KubeSphere v3.1.0, KubeKey has witnessed a [major version upgrade](https://github.com/kubesphere/kubekey/releases/tag/v1.1.0) (v1.1.0) with more support for different environments.

With the latest version of KubeKey, you can install Kubernetes v1.17-v1.20 on both AMD 64 and ARM 64, and even [K3s](https://k3s.io/), a lightweight fully compliant Kubernetes distribution. More network plugins are supported now, such as Cilium and Kube-OVN. You can also install different container runtimes (containerd, CRI-O and iSula) using KubeKey as a response to [Dockershim deprecation](https://kubesphere.io/blogs/dockershim-out-of-kubernetes/) in the future.

### Network

KubeSphere has further stabilized its network module which is more secure, efficient and user-friendly. For example, you can enable [service topology](https://kubesphere.io/docs/pluggable-components/service-topology/) based on [Weave Scope](https://www.weave.works/oss/scope/) to view service-to-service communication in a project.

![topology](/images/blogs/en/kubesphere-3.1.0-ga-announcement/topology.png)

Besides, as Calico is one of the most widely adopted CNI plugins, KubeSphere v3.1.0 supports Calico [Pod IP Pool](https://kubesphere.io/docs/pluggable-components/pod-ip-pools/) management which allows you to assign a static IP address to your workload.

KubeSphere v3.1.0 has also added support for [Kube-OVN](https://github.com/kubeovn/kube-ovn).

### Authentication and multi-tenancy

A unified and comprehensive [account authorization and authentication system](https://kubesphere.io/docs/access-control-and-account-management/) represents an important building block in a multi-tenant system for logic isolation. In KubeSphere v3.1.0, you can use workspaces to manage and group projects just as what you have been doing while you can also [define departments in a workspace](https://kubesphere.io/docs/workspace-administration/department-management/). A department is where you manage a group of users with the same role, which greatly streamlines the permission assignment process. Also, you can define workspace quotas to manage resource usage at the workspace level.

![workspace-department](/images/blogs/en/kubesphere-3.1.0-ga-announcement/workspace-department.png)

In terms of authentication, the new version has simplified IdentityProvider configurations to provide better user experiences as you integrate third-party authentication. In addition to LDAP, KubeSphere has added support for major authentication protocols such as Central Authentication Service (CAS), OpenID Connect (OIDC) and OAuth2. At the same time, you can integrate your account system as plugins into KubeSphere.

## Community and Internationalization

Thanks to a vibrant, diverse community, KubeSphere is making great strides on its international journey with over 100,000 downloads across 90 countries and regions to date. The KubeSphere console currently supports four official languages - English, Simplified Chinese, Traditional Chinese and Spanish. Looking forward, KubeSphere seeks to further expand its community with more language support.

![kubesphere-and-friends](/images/blogs/en/kubesphere-3.1.0-ga-announcement/kubesphere-and-friends.png)

KubeSphere v3.1.0 remains committed to open source with an ever-expanding ecosystem including [PorterLB](https://github.com/kubesphere/porterlb), [OpenPitrix](https://github.com/openpitrix/openpitrix), [Fluentbit Operator](https://github.com/kubesphere/fluentbit-operator), [KubeKey](https://github.com/kubesphere/kubekey), [KubeEye](https://github.com/kubesphere/kubeeye), [Notification Manager](https://github.com/kubesphere/notification-manager), [Kube-Events](https://github.com/kubesphere/kube-events) and [Kube Design](https://github.com/kubesphere/kube-design). You can find the code and documentation in [GitHub](https://github.com/kubesphere) repositories.

Contributions of any kind are welcome. Give us stars, fork our repositories and even submit pull requests to make your contribution to the community now.

## Installation and Upgrade

The KubeSphere documentation has been updated. You can install a new KubeSphere cluster or upgrade your existing cluster to v3.1.0. For more information, see [the KubeSphere documentation](https://kubesphere.io/docs/).

## Acknowledgements

"When you take a step back and reflect on how far KubeSphere has come, it is not surprising to find that it has become one of the most widely used container platforms not just in our country, but also around the world," Ray added. "Our contributors from all corners of the world have shown us what open source is all about. And this is exactly what has been driving us to push the limits of what’s possible with Kubernetes."

"We have not only seen startups but Fortune 500 companies alike flock to KubeSphere for security, ease, high availability and all that KubeSphere can offer," said Calvin Yu, Project Manager of KubeSphere. "Enterprises are embracing KubeSphere not just because we know a thing or two about container orchestration or workload deployment at scale, but more importantly, we are backed by a growing community home to numerous innovative minds."

Major contributors to KubeSphere v3.1.0 are listed below (in no particular order). We express our sincerest appreciation to them.

![acknowledgement](/images/blogs/en/kubesphere-3.1.0-ga-announcement/acknowledgement.png)