---
title: 'KubeSphere v3.3.0 Released: Embrace GitOps'
tag: 'Product News'
keyword: 'community, open source, contribution, KubeSphere, release, AI, GPU'
description: 'KubeSphere v3.3.0 now brings more fervently anticipated features. The continuous deployment solution based on GitOps makes DevOps on KubeSphere more powerful. The interaction designs of multiple features, including Multi-cluster Management, Multi-tenancy, Observability, App Store, Application Governance, Edge Computing, and Storage Management, are optimized for better user experience.'
createTime: '2022-06-27'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/202206271135109.jpeg'
---

**On June 27, 2022, we are excited to announce the official release of KubeSphere v3.3.0!**

The CNCF annual report points out that the dominance of containerization and K8s is becoming secure, and K8s is slowly turning into a background technology: it is everywhere, but not felt by people. This situation benefited from a variety of platforms that make K8s easier to use, among which KubeSphere is one of the leading players. KubeSphere eliminates the complexity and disparity of the underlying K8s cluster for and provides users with an open architecture that supports pluggable components for seamless integration of third-party applications, removing the barriers for enterprises to implement K8s.

KubeSphere [v3.1](https://kubesphere.io/news/kubesphere-3.1.0-ga-announcement/) and [v3.2](https://kubesphere.io/news/kubesphere-3.2.0-ga-announcement/) released in 2021 provided users with exciting features including **Edge Computing**, **Metering and Billing**, and **GPU Resource Scheduling**, which extended K8s from the cloud to the edge and enhanced user experience in cloud-native AI scenarios.

KubeSphere v3.3.0 now brings more fervently anticipated features. The continuous deployment solution based on **GitOps** makes DevOps on KubeSphere more powerful. The interaction designs of multiple features, including **Multi-cluster Management, Multi-tenancy, Observability, App Store, Application Governance, Edge Computing, and Storage Management**, are optimized for better user experience.

It's also worth pointing out that KubeSphere v3.3.0 would not be possible without participation and contribution from enterprises and users outside QingCloud. You are everywhere—feature development, testing, defect report, proposal, best practice collection, bug fixing, internationalization, and documentation. We appreciate your help and will give an acknowledgement at the end of the article.

## What's New in KubeSphere v3.3.0

### More Accessible DevOps

Starting from KubeSphere v3.3.0, KubeSphere DevOps supports independent backend deployment. It also provides a continuous deployment solution based on **GitOps** using **Argo CD** as the backend and supports real-time continuous deployment status.

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=597808663&bvid=BV18B4y1q7kh&cid=756454741&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

For example, if nginx-ingress and knative-serving have been installed in your KubeSphere cluster, you can install other components of [OpenFunction](https://github.com/OpenFunction/openfunction), a cloud-native FaaS project, by using GitOps continuous deployment.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271711437.jpg)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271710724.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271709605.png)

Jenkins is a CI engine with a large user base and a rich plugin ecosystem. We will let Jenkins do what it is good at—functioning only as an engine in the backend to provide stable pipeline management capability. Previously, KubeSphere DevOps used a polling method to implement data synchronization of Jenkins pipelines, which resulted in a lot of computing resource overheads. In KubeSphere v3.3.0, a new Jenkins plugin has been introduced, which sends events on Jenkins to [ks-devops](https://github.com/kubesphere/ks-devops) through a webhook.

KubeSphere DevOps has provided two built-in pipeline templates since KubeSphere v3.1.0, helping DevOps engineers improve CI/CD pipeline creation and O&M efficiency. However, the built-in templates are embedded in the frontend code and are difficult to customize. The pipeline templates are refactored in KubeSphere v3.3.0, which further provides multiple **pipeline templates based on a CRD** and supports parameter configuration. Users can also create multiple custom templates by using CRs.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271714896.png)

### Multi-cluster and Multi-tenancy

The explosion of cloud-native technologies is pushing applications to become more and more migratable, and organizations will inevitably choose to operate and manage multiple K8s clusters across different cloud vendors and different types of infrastructure. **The future of cloud-native technologies is application delivery on multiple clusters**.

KubeSphere provides users with a unified control plane that can distribute applications and their replicas to multiple clusters located in public clouds and local environments. Moreover, KubeSphere supports abundant observability features across multiple clusters, including centralized monitoring, container logs, resource events, and audit logs.

In previous versions, KubeSphere management permissions were assigned across all clusters and could not be set separately for individual clusters. Starting from v3.3.0, KubeSphere supports **cluster members** and **cluster roles** in each cluster, providing a more fine-grained permission control mechanism and optimizing the multi-tenancy system.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271719692.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271720189.jpg)

KubeSphere uses a CRD to define clusters and stores cluster information in CRs. However, these CRs are saved only in the host cluster, and applications in member clusters cannot obtain information, such as cluster names, about the clusters where they belong. This makes the implementation of some features difficult. For example, the alerting system needs to add cluster labels in alerts to signify the source cluster. These labels cannot be automatically obtained and need to be manually configured.

KubeSphere v3.30 addresses this pain point by adding cluster names into the `kubesphere-config` configmap, which is saved on each cluster, allowing applications in all clusters to obtain cluster names from the configmap.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271723605.png)

In addition to the preceding improvements, user experience of multi-cluster management has also been optimized. For example, users can now directly update the kubeconfig information of each cluster on the KubeSphere web console.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271723261.jpg)

When the certificate in the kubeconfig information of a member cluster is about to expire, users are notified and can update the cluster kubeconfig information in time by using the preceding method.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206231431614.jpg)

### Edge Node Management

The integration of KubeSphere and KubeEdge resolves problems including edge node management, edge workload scheduling, and edge observability. By combining the edge autonomy feature of KubeEdge and the multi-cloud and multi-cluster management features of KubeSphere, users can implement cloud-edge-device unified management and control.

The edge node management capability is also optimized on KubeSphere v3.3.0. Users can **directly log in to the terminal of an edge node from the KubeSphere web console** to perform operations such as:

+ Downloading images and updating edge applications.
+ Updating EdgeCore and Docker on the edge.
+ Modifying edge node system settings.
+ ...

Of course, the KubeSphere web console allows users to log in to edge nodes as well as common cluster nodes.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271727824.jpg)

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271729540.png)

In KubeSphere v3.3.0, the KubeEdge version is upgraded from v1.7.2 to v1.9.2. The EdgeWatcher component is removed because KubeEdge has provided similar functionality.

### Enhanced Observability

KubeSphere provides rich visualization features to support multi-dimensional monitoring, from infrastructure to applications. In addition, multiple commonly used tools have been integrated with KubeSphere. These tools provide features such as multi-tenant log query, alerting, and notification.

KubeSphere v3.3.0 also provides multiple new monitoring features. Users can now import a Grafana template and add container process and thread metrics when creating a custom monitoring dashboard. Disk usage metrics are optimized to provide usage of each disk.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271730292.jpg)

Users can now set separate retention periods for container logs, resource events, and audit logs.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271733246.jpg)

Existing monitoring, logging, and alerting components have been upgraded:

+ Alertmanager: v0.21.0 --> v0.23.0
+ Grafana: 7.4.3 --> 8.3.3
+ kube-state-metrics: v1.9.7 --> v2.3.0
+ node-exporter: v0.18.1 --> v1.3.1
+ Prometheus: v2.26.0 --> v2.34.0
+ prometheus-operator: v0.43.2 --> v0.55.1
+ kube-rbac-proxy: v0.8.0 --> v0.11.0
+ configmap-reload: v0.3.0 --> v0.5.0
+ Thanos: v0.18.0 --> v0.25.2
+ kube-events: v0.3.0 --> v0.4.0
+ Fluent Bit operator: v0.11.0 --> v0.13.0
+ Fluent Bit: v1.8.3 --> v1.8.11

### O&M-Friendly Storage Management

Persistent storage provides data permanence. It is a basic component in the K8s system and an important guarantee for implementing stateful services. KubeSphere has provided the **Storage Management** feature on its web console since the v3.2.0 version, which supports many administrator-level O&M operations. The Storage Management feature is further optimized in KubeSphere v3.3.0. Users can now set PVC autoscaling policies on **storage classes** based on requirements. When the remaining capacity of a PVC is insufficient, KubeSphere automatically expands the PVC according to the preset policy.

To further control operation permissions over storage resources, KubeSphere v3.3.0 supports tenant-level storage permission management. You can set authorization rules on **storage classes** so that they can be used only in specific projects and workspaces.

In previous versions, the KubeSphere web console did not support volume snapshot content management and volume snapshot class management. These features are now available on KubeSphere v3.3.0 and you can view, edit, and delete these two types of resources on the KubeSphere web console.

<iframe width="760" height="380" src="https://player.bilibili.com/player.html?aid=215301709&bvid=BV17a411W7Xb&cid=756456073&page=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### Service Exposure Optimization

Many users have installed K8s or K3s on physical machines, air-gapped data centers, or edge devices. The community has received a lot of reports about the difficulty in exposing LoadBalancer services in such environments. To address the problem, the KubeSphere community has initiated an open-source project [OpenELB](https://github.com/openelb/openelb), which provides users in private environments with flexible EIP and IP pool management capability.

OpenELB is integrated with the web console of KubeSphere v3.3.0 by default, allowing users to expose LoadBalancer services even in K8s clusters not deployed on a public cloud.

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271735309.png)

### Other Updates

+ Provide more settings for Istio in ClusterConfiguration.
+ Add a message prompting users to enable the K8s audit logs feature.
+ Add support for applying an entire configmap.
+ Add support for setting container lifetime hooks.
+ Add a time range selector for traffic monitoring data.
+ Optimize the UI text on multiple pages.
+ Optimize the service topology details area.
+ Fix an issue where the gateway of a project is not deleted after the project is deleted.
+ Prevent ks-apiserver and ks-controller-manager from restarting after ClusterConfiguration is updated.
+ Remove the domain name auto generation feature of routes for security purposes, which uses **nip.io** for domain name resolution. A backend toggle will be provided for users to enable and disable this feature in the next KubeSphere release.

## Commitment to Open Source

Boosted by the open-source community, KubeSphere quickly goes global. KubeSphere has users across more than <0>100</0> countries and regions and has been downloaded for nearly <0>1 million</0> times. The KubeSphere repository on GitHub has nearly <0>300</0> contributors, more than <0>10000</0> starts, and more than <0>1500</0> forks.

In the future, the KubeSphere team will maintain its commitment to open source. The source code and design documents of KubeSphere v3.3.0 updates and features such as [Console](https://github.com/kubesphere/console/), [OpenELB](https://github.com/kubesphere/openelb/), [Fluent Operator](https://github.com/fluent/fluent-operator), [KubeKey](https://github.com/kubesphere/kubekey/), [KubeEye](https://github.com/kubesphere/kubeeye/), [Notification Manager](https://github.com/kubesphere/notification-manager/), [kube-events](https://github.com/kubesphere/kube-events/), and [ks-devops](https://github.com/kubesphere/ks-devops/), are available on GitHub. Come to GitHub to star, fork, and send pull requests to the KubeSphere repositories to promote the development of KubeSphere!

## Installation and Upgrade

Visit [KubeSphere official website](https://kubesphere.io/docs/v3.3/) to obtain the KubeSphere v3.3.0 installation and upgrade guide.

## Acknowledgements

The KubeSphere team would like to acknowledge contributions from the people who make KubeSphere v3.3.0 possible. The following GitHub IDs are not listed in order. If you are not listed, please contact us at [the GitHub KubeSphere Repository](https://github.com/kubesphere/kubesphere).

![](https://pek3b.qingstor.com/kubesphere-community/images/202206271736057.png)

Compared with contributors to the previous version, 50% more contributors took part in the development of KubeSphere v3.3.0. The KubeSphere open source community is becoming more and more prosperous. New contributors will later receive exclusive certificates from the community.

We highly appreciate the work of all contributors and welcome new friends to join us. Whether you are good at code development, document optimization, website optimization, community advocacy, or technical evangelism, the gates of the KubeSphere community are always open to you!