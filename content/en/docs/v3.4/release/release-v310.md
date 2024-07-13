---
title: "Release Notes for 3.1.0"
keywords: "Kubernetes, KubeSphere, release notes"
description: "KubeSphere Release Notes for 3.1.0"
linkTitle: "Release Notes - 3.1.0"
weight: 18300
version: "v3.4"
---

## How to Install v3.1.0

- [Install KubeSphere v3.1.0 on Linux](https://github.com/kubesphere/kubekey)
- [Install KubeSphere v3.1.0 on an existing Kubernetes cluster](https://github.com/kubesphere/ks-installer)

## New Features and Enhancements

### Multi-cluster management

- Simplified the steps to import Member Clusters with configuration validation (for example, `jwtSecret`) added. ([#3232](https://github.com/kubesphere/kubesphere/issues/3232))
- Refactored the cluster controller and optimized the logic. ([#3234](https://github.com/kubesphere/kubesphere/issues/3234))
- Upgraded the built-in web Kubectl, the version of which is now consistent with your Kubernetes cluster version. ([#3103](https://github.com/kubesphere/kubesphere/issues/3103))
- Support customized resynchronization period of cluster controller. ([#3213](https://github.com/kubesphere/kubesphere/issues/3213))
- Support lightweight installation of Member Clusters without components such as Redis and OpenLDAP. ([#3056](https://github.com/kubesphere/kubesphere/issues/3056))
- Support high availability of Tower agent and server. ([#31](https://github.com/kubesphere/tower/issues/31))

### KubeEdge integration

You can now enable KubeEdge in your cluster and manage edge nodes on the KubeSphere console. ([#3070](https://github.com/kubesphere/kubesphere/issues/3070))

- Support the installation of both cloud and edge modules of KubeEdge.
- Support adding KubeEdge through the KubeSphere console.
- Support the deployment of workloads on edge nodes.
- The logs and monitoring data of edge nodes can be collected.
- The network of edge nodes can be configured automatically as they join or leave a cluster.
- Taints can be added automatically as an edge node joins your cluster.
- You can use `nodeAffinity` to prevent cloud workloads (for example, DaemonSets) from being deployed to edge nodes. ([#1295](https://github.com/kubesphere/ks-installer/pull/1295), [#1297](https://github.com/kubesphere/ks-installer/pull/1297) and [#1300](https://github.com/kubesphere/ks-installer/pull/1300))

### Authorization and authentication management 
- Added ServiceAccount management. ([#3211](https://github.com/kubesphere/kubesphere/issues/3211))
- Improved the LDAP authentication plugin and added support for LDAPS and search filtering. ([#2970](https://github.com/kubesphere/kubesphere/issues/2970) and [#3766](https://github.com/kubesphere/kubesphere/issues/3766))
- Improved the identify provider plugin and simplified the configuration of identify providers. ([#2970](https://github.com/kubesphere/kubesphere/issues/2970))
- New users now see a prompt to change the old password when first logging in to KubeSphere.
- New users now need to confirm account information when logging in to KubeSphere through a third party.
- Support [CAS](https://apereo.github.io/cas/5.0.x/protocol/CAS-Protocol-Specification.html) as an available identity provider. ([#3047](https://github.com/kubesphere/kubesphere/issues/3047))
- Support [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) as an available identity provider. ([#2941](https://github.com/kubesphere/kubesphere/issues/2941))
- Support IDaaS (Alibaba Cloud Identity as a Service) as an available identity provider. ([#2997](https://github.com/kubesphere/kubesphere/pull/2997))


### Multi-tenant management
- Users now can configure departments in a workspace and assign users to the department. All users in the department can have the same role in a project or DevOps project. ([#2940](https://github.com/kubesphere/kubesphere/issues/2940))
- Support workspace quotas which are used to manage resource usage of a workspace. ([#2939](https://github.com/kubesphere/kubesphere/issues/2939))

### Network

- Added Kube-OVN.
- Support Calico IP pool management. ([#3057](https://github.com/kubesphere/kubesphere/issues/3057))
- Support visual network topology. ([#3061](https://github.com/kubesphere/kubesphere/issues/3061) and [#583](https://github.com/kubesphere/kubesphere/issues/583))
- A static IP address can be assigned to a Deployment now. ([#3058](https://github.com/kubesphere/kubesphere/issues/3058))

### Observability

- Improved the current method of Prometheus integration. ([#3068](https://github.com/kubesphere/kubesphere/issues/3068) and [#1164](https://github.com/kubesphere/ks-installer/pull/1164); [guide](/docs/v3.3/faq/observability/byop/))
- Added Thanos Ruler (Thanos v0.18.0) for the new alerting function.
- Upgraded Prometheus to v2.26.0.
- Upgraded Prometheus Operator to v0.42.1.
- Upgraded kube-state-metrics to v1.9.7.
- Upgraded metrics-server to v0.4.2.
- Upgraded Notification Manager to v1.0.0. ([Releases](https://github.com/kubesphere/notification-manager/releases))
- Upgraded FluentBit Operator to v0.5.0. ([Releases](https://github.com/kubesphere/fluentbit-operator/releases))
- Upgraded FluentBit to v1.6.9.
- Upgraded KubeEvents to v0.2.0.
- Upgraded Kube-Auditing to v0.1.2.

#### Monitoring

- Support configurations of ServiceMonitors on the KubeSphere console. ([#1031](https://github.com/kubesphere/console/pull/1301))
- Support PromQL auto-completion and syntax highlighting. ([#1307](https://github.com/kubesphere/console/pull/1307))
- Support customized monitoring at the cluster level. ([#3193](https://github.com/kubesphere/kubesphere/pull/3193))
- Changed the HTTP ports of kube-scheduler and kube-controller-manager from `10251` and `10252` to the HTTPS ports of `10259` and `10257` respectively for data scraping. ([#1367](https://github.com/kubesphere/ks-installer/pull/1367))

#### Alerting

- Prometheus-style alerting rules can be managed and configured now. ([#3181](https://github.com/kubesphere/kubesphere/pull/3181))
- Support alerting rules at the platform level and project level. ([#3181](https://github.com/kubesphere/kubesphere/pull/3181))
- Support real-time display of alerting rule status. ([#3181](https://github.com/kubesphere/kubesphere/pull/3181))

#### Notification management

- Added new notification channels on the console including DingTalk, WeCom, Slack and Webhook to receive notifications. ([#3066](https://github.com/kubesphere/kubesphere/issues/3066))

#### Logging

- Logs can be exported to [Loki](https://github.com/kubesphere/fluentbit-operator/blob/master/docs/plugins/output/loki.md) now. ([#39](https://github.com/kubesphere/fluentbit-operator/pull/39))
- Support kubelet, Docker, and containerd log collection. ([#38](https://github.com/kubesphere/fluentbit-operator/pull/38))
- Support [auditd](https://github.com/kubesphere/fluentbit-operator#auditd) log collection. ([#45](https://github.com/kubesphere/fluentbit-operator/pull/45))

### DevOps

- Improved the error message of pipeline cron text. ([#2919](https://github.com/kubesphere/kubesphere/issues/2919))
- Improved the interactive experience of creating pipelines. ([#1283](https://github.com/kubesphere/console/issues/1283))
- Improved S2I error messages. ([#140](https://github.com/kubesphere/s2ioperator/issues/140))
- Upgraded Jenkins to 2.249.1. ([#2618](https://github.com/kubesphere/kubesphere/issues/2618))
- Added an approval mechanism for pipelines. Accounts with necessary permissions can review pipelines and approve them. ([#2483](https://github.com/kubesphere/kubesphere/issues/2483) and [#3006](https://github.com/kubesphere/kubesphere/issues/3006))
- Multiple pipelines can be started and run at the same time. ([#1811](https://github.com/kubesphere/kubesphere/issues/1811))
- The pipeline status can be viewed on the DevOps project **Pipelines** page. ([#3007](https://github.com/kubesphere/kubesphere/issues/3007))
- Pipelines can be triggered by tags now. ([#3051](https://github.com/kubesphere/kubesphere/issues/3051))
- Support pipeline cloning. ([#3053](https://github.com/kubesphere/kubesphere/issues/3053))
- Support GitLab multi-branch pipelines. ([#3100](https://github.com/kubesphere/kubesphere/issues/3100))
- Support S2I Webhook. ([#6](https://github.com/kubesphere/s2ioperator/issues/6))
- Jenkins in KubeSphere is now deployed as a distribution ([#2182](https://github.com/kubesphere/kubesphere/issues/2182)).

### App Store and apps

- The reason for app template deployment failure is now available for check. ([#3036](https://github.com/kubesphere/kubesphere/issues/3036), [#3001](https://github.com/kubesphere/kubesphere/issues/3001) and [#2951](https://github.com/kubesphere/kubesphere/issues/2951))
- Support batch deleting of app templates.
- Support editing of deployed app templates.
- A new built-in app [XenonDB](https://github.com/radondb/xenondb) is now available in the App Store. Based on MySQL, it is an open-source tool that provides high availability cluster solutions.

### Microservices governance

- The KubeSphere console now displays the traffic direction of microservices in composing apps. ([#3153](https://github.com/kubesphere/kubesphere/issues/3153))
- Support Kiali. Users can now manage Istio directly through Kiali. ([#3106](https://github.com/kubesphere/kubesphere/issues/3106))
- Support NGINX Ingress Gateway monitoring with NGINX Ingress Controller metrics added. ([#1205](https://github.com/kubesphere/ks-installer/pull/1205))
- A route can be added now when an app is created. ([#1426](https://github.com/kubesphere/console/issues/1426))
- Upgraded Istio to 1.6.10. ([#3326](https://github.com/kubesphere/kubesphere/issues/3236))

### Metering and billing

- Users now can see resource consumption of different resources at different levels, such as clusters, workspaces, and apps. ([#3062](https://github.com/kubesphere/kubesphere/issues/3062))
- The resource price can be set in a ConfigMap to provide billing information of resources on the console.

### KubeSphere console UI

- Improved homepage loading.
- Improved pipeline configurations on graphical editing panels.
- Improved error messages of pipeline status.
- Improved the way code repositories are filtered.
- Improved the configuration of node scheduling policies.
- Improved deployment configurations.
- Relocated the built-in web kubectl to a separate page.

## Major Technical Adjustments

- Upgraded Kubernetes version dependencies from v1.17 to v1.18. ([#3274](https://github.com/kubesphere/kubesphere/issues/3274))
- Upgraded the Prometheus client_golang version dependency to v1.5.1 and Prometheus version dependency to v1.8.2. ([#3097](https://github.com/kubesphere/kubesphere/pull/3097))
- Refactored OpenPitrix based on CRDs and fixed some issues caused by the original architecture. ([#3036](https://github.com/kubesphere/kubesphere/issues/3036), [#3001](https://github.com/kubesphere/kubesphere/issues/3001), [#2995](https://github.com/kubesphere/kubesphere/issues/2995), [#2981](https://github.com/kubesphere/kubesphere/issues/2981), [#2954](https://github.com/kubesphere/kubesphere/issues/2954), [#2951](https://github.com/kubesphere/kubesphere/issues/2951), [#2783](https://github.com/kubesphere/kubesphere/issues/2783), [#2713](https://github.com/kubesphere/kubesphere/issues/2713), [#2700](https://github.com/kubesphere/kubesphere/issues/2700) and [#1903](https://github.com/kubesphere/kubesphere/issues/1903))
- Refactored the previous alerting system with old alerting rules deprecated and removed its dependency on MySQL, Redis, etcd and other components. The new alerting system works based on Thanos Ruler and the build-in rules of Prometheus. Old alerting rules in KubeSphere v3.0.0 will be automatically changed to new alerting rules in KubeSphere v3.1.0 after upgrading.
- Refactored the notification system and removed its dependency on MySQL, Redis, etcd and other components. Notification channels are now configured for the entire cluster based on [Notification Manager](https://github.com/kubesphere/notification-manager/) in CRDs. In a multi-cluster architecture, if a notification channel is set for the Host cluster, it works for all Member Clusters.

## Deprecated or Removed Features

- The legacy alerting and notification system dependent on MySQL, Redis, etcd and other components is replaced by the new alerting and notification function.
- Changed the container terminal WebSocket API. ([#3041](https://github.com/kubesphere/kubesphere/issues/3041))

## Bug Fixes
- Fixed account login failures. ([#3132](https://github.com/kubesphere/kubesphere/issues/3132) and [#3357](https://github.com/kubesphere/kubesphere/issues/3357))
- Fixed an issue where ANSI colors were not supported in container logs. ([#1322](https://github.com/kubesphere/kubesphere/issues/3044))
- Fixed an issue where the Istio-related monitoring data of a microservices-based app could not be scraped if its project name started with `kube`. ([#3126](https://github.com/kubesphere/kubesphere/issues/3162))
- Fixed an issue where viewers at different levels could use the container terminal. ([#3041](https://github.com/kubesphere/kubesphere/issues/3041))
- Fixed a deletion failure issue of cascade resources in a multi-cluster architecture. ([#2912](https://github.com/kubesphere/kubesphere/issues/2912))
- Fixed the incompatibility issue with Kubernetes 1.19 and above. ([#2928](https://github.com/kubesphere/kubesphere/issues/2928) and [#2928](https://github.com/kubesphere/kubesphere/issues/2928))
- Fixed the invalid button to view Service monitoring data. ([#1394](https://github.com/kubesphere/console/issues/1394))
- Fixed an issue where the grayscale release Service name could not be the same as the app label. ([#3128](https://github.com/kubesphere/kubesphere/issues/3128))
- Fixed an issue where the status of microservices-based app could not be updated. ([#3241](https://github.com/kubesphere/kubesphere/issues/3241))
- Fixed an issue where a workspace in a Member Cluster would be deleted if its name was the same as a workspace in the Host Cluster. ([#3169](https://github.com/kubesphere/kubesphere/issues/3169))
- Fixed the connection failure between clusters if agent connection is used. ([#3202](https://github.com/kubesphere/kubesphere/pull/3203))
- Fixed a multi-cluster status display issue. ([#3135](https://github.com/kubesphere/kubesphere/issues/3135))
- Fixed the workload deployment failure in DevOps pipelines. ([#3112](https://github.com/kubesphere/kubesphere/issues/3112))
- Fixed an issue where the account with the  `admin` role in a DevOps project could not download artifacts. ([#3088](https://github.com/kubesphere/kubesphere/issues/3083))
- Fixed an issue of DevOps pipeline creation failure. ([#3105](https://github.com/kubesphere/kubesphere/issues/3105))
- Fixed an issue of triggering pipelines in a multi-cluster architecture. ([#2626](https://ask.kubesphere.io/forum/d/2626-webhook-jenkins))
- Fixed an issue of data loss when a pipeline was edited. ([#1270](https://github.com/kubesphere/console/issues/1270))
- Fixed a display issue of **Docker Container Register Credentials**. ([#1269](https://github.com/kubesphere/console/issues/1269))
- Fixed a localization issue of Chinese unit in the code analysis result. ([#1278](https://github.com/kubesphere/console/issues/1278))
- Fixed a display issue caused by Boolean values in Jenkinsfiles. ([#3043](https://github.com/kubesphere/kubesphere/issues/3043))
- Fixed a display issue on the **Storage Management** page caused by the lack of `StorageClassName` in a PVC. ([#1109](https://github.com/kubesphere/ks-installer/issues/1109))
