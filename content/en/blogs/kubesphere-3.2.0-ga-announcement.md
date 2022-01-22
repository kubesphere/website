---
title: 'KubeSphere 3.2.0 GA: Bringing AI-oriented GPU Scheduling and Flexible Gateway'
tag: 'KubeSphere, release'
keyword: 'Kubernetes, KubeSphere, release, AI, GPU'
description: 'KubeSphere 3.2.0 supports GPU resource scheduling and management and GPU usage monitoring, which further improves user experience in cloud-native AI scenarios. Moreover, enhanced features such as multi-cluster management, multi-tenant management, observability, DevOps, app store, and service mesh further perfect the interactive design for better user experience.'
createTime: '2021-11-03'
author: 'KubeSphere'
snapshot: '/images/blogs/en/release-announcement3.2.0/v3.2.0-GA-cover.png'
---

![3.2.0GA](/images/blogs/en/release-announcement3.2.0/3.2.0GA.png)

No one would ever doubt that **Cloud Native** has become the most popular service technology. KubeSphere, a distributed operating system for cloud-native application management with Kubernetes as its kernel, is definitely one of the tide riders surfing the cloud-native currents. KubeSphere has always been upholding the commitment of 100% open source. Owing to support from the open-source community, KubeSphere has rapidly established a worldwide presence.

On November 2, 2021, we are excited to announce KubeSphere 3.2.0 is generally available!

In KubeSphere 3.2.0,  **GPU resource scheduling and management** and GPU usage monitoring further improve user experience in cloud-native AI scenarios. Moreover, enhanced features such as **multi-cluster management**, **multi-tenant management** , **observability**, **DevOps**, **app store, and service mesh** further perfect the interactive design for better user experience.

It's also worth pointing out that KubeSphere 3.2.0 would not be possible without participation and contribution from enterprises and users outside QingCloud. You are everywhere, from feature development, test, defect report, proposal, best practice collection, bug fixing, internationalization to documentation. We appreciate your help and will give an acknowledgement at the end of the article.

## **What's New in KubeSphere 3.2.0**

### **GPU scheduling and quota management**

With the rapid development of artificial intelligence (AI) and machine learning, more and more AI companies are calling for GPU resource scheduling and management features for server clusters, especially monitoring of GPU usage and management of GPU resource quotas. To address users' pain points, KubeSphere 3.2.0 makes our original GPU management even easier.

KubeSphere 3.2.0 allows you to create GPU workloads on the GUI, schedule GPU resources, and manage GPU resource quotas by tenant. Specifically, it can be used for NVIDIA GPU and vGPU solutions.

![00-GPU-scheduling-quota-manage](/images/blogs/en/release-announcement3.2.0/00-GPU-scheduling-quota-manage.png)

### **Enhanced Kubernetes observability**

Growing container and microservice technologies make it more complex to call components between systems, and the number of processes running in the system is also surging. With thousands of processes running in a distributed system, it is clear that conventional monitoring techniques are incapable of tracking the dependencies and calling paths between these processes, and this is where observability within the system becomes particularly important.

***Observability is the ability to measure the internal states of a system by examining its outputs.*** A system is considered "observable" if the current state can be estimated by only using information from outputs, namely telemetry data collected by the three pillars of observability: logging, tracing and metrics.

1. More powerful custom monitoring dashboards

KubeSphere 3.1.0 has added the cluster-level custom monitoring feature, which allows you to generate custom Kubernetes monitoring dashboards by selecting a default template, uploading a template, or customizing a template. KubeSphere 3.2.0 provides a default template for creating a Grafana monitoring dashboard. You can import a Grafana monitoring dashboard by specifying the URL or uploading the JSON file of the dashboard, and then KubeSphere will automatically convert the Grafana monitoring dashboard into a custom monitoring dashboard.

![01-Grafana-dashboard](/images/blogs/en/release-announcement3.2.0/01-Grafana-dashboard.png)

For GPU resources, KubeSphere 3.2.0 also provides a default monitoring template with a wealth of metrics, so that you don't need to customize a template or edit a YAML file.

![02-GPU-overview](/images/blogs/en/release-announcement3.2.0/02-GPU-overview.png)

2. Alerting and logging

- KubeSphere 3.2.0 supports communication with Elasticsearch through HTTPS.

- In addition to the various notification channels such as email, DingTalk, WeCom, webhook, and Slack, KubeSphere 3.2.0 now also allows you to test and validate the notification channels you configure.

![03-platform-settings](/images/blogs/en/release-announcement3.2.0/03-platform-settings.png)

3. On the etcd monitoring page, the system automatically adds the `Leader` tag to the etcd leader.

### **Multi-cloud and multi-cluster management**

CNCF Survey 2020 shows that over 80% of users run more than two Kubernetes clusters in their production environment. KubeSphere aims at addressing multi-cluster and multi-cloud challenges. It provides a unified control plane and supports distributing applications and replicas to multiple Kubernetes clusters deployed across public cloud and on-premises environments. Moreover, KubeSphere supports observability across clusters, including features such as multi-dimensional monitoring, logging, events, and auditing logs.

![04-cluster-manage](/images/blogs/en/release-announcement3.2.0/04-cluster-manage.png)

KubeSphere 3.2.0 performs better in cross-cluster scheduling. When you are creating a federated Deployment across clusters, you can directly specify the number of replicas scheduled to each cluster. In addition, you can also specify the total number of replicas and weight of each cluster, and allow the system to automatically schedule replicas to each cluster according its weight. This feature is pretty helpful when you want to flexibly scale your Deployment and proportionally distribute replicas to multiple clusters.

![05-federated-deployment](/images/blogs/en/release-announcement3.2.0/05-federated-deployment.png)

![06-view-federation](/images/blogs/en/release-announcement3.2.0/06-view-federation.png)

### **Operations-and-maintenance-friendly storage management**

Enterprises running Kubernetes in production focus on persistent storage, as stable and reliable storage underpin their core data. On the KubeSphere 3.2.0 web console, the **Volumes** feature allows the administrator to decide whether to enable volume cloning, snapshot capturing, and volume expansion, making persistent storage operations and maintenance for stateful apps more convenient.

![07-volume-manage](/images/blogs/en/release-announcement3.2.0/07-volume-manage.png)

The default immediate binding mode binds a volume to a backend storage device immediately when the volume is created. This mode does not apply to storage devices with topology limits and may cause Pod scheduling failures. KubeSphere 3.2.0 provides the delayed binding mode to address this issue, which guarantees that a volume (PVC) is bound to a volume instance (PV) only after the volume is mounted to a Pod. This feature ensures that resources are properly scheduled based on Pod resource requests.

![08-storage-class-settings](/images/blogs/en/release-announcement3.2.0/08-storage-class-settings.png)

In addition to volume management, KubeSphere 3.2.0 now also supports Persistent Volume management, and you can view Persistent Volume information, edit Persistent Volumes, and delete Persistent Volumes on the web console.

![09-volumes](/images/blogs/en/release-announcement3.2.0/09-volumes.png)

When you create a volume snapshot, you can specify the snapshot type (`VolumeSnapshotClass`) to use a specific storage backend.

### **Cluster gateway**

KubeSphere 3.1 supports only project gateways, which require multiple IP addresses when there are multiple projects. Additionally, gateways in different workspaces are independent.

KubeSphere 3.2.0 provides a cluster gateway, which means that all projects can share the same gateway. Existing project gateways are not affected by the cluster gateway.

![10-gateway-settings](/images/blogs/en/release-announcement3.2.0/10-gateway-settings.png)

The administrator can directly manage and configure all project gateways on the cluster gateway settings page without having to go to each workspace. The Kubernetes ecosystem provides many ingress controllers that can be used as the gateway solution. In KubeSphere 3.2.0, the gateway backend is refactored, which allows you to use any ingress controllers that support v1\\ingress as the gateway solution.

![11-gateway-settings2](/images/blogs/en/release-announcement3.2.0/11-gateway-settings2.png)

### **Authentication and authorization**

A unified and all-round identity management and authentication system is indispensable for logical isolation in a multi-tenant system. Apart from support for AD/LDAP and OAuth 2.0 identity authentication systems, KubeSphere 3.2.0 also provides a built-in authentication service based on OpenID Connect to provide authentication capability for other components. OpenID Connect is a simple user identity authentication protocol based on OAuth 2.0 with a bunch of features and security options to meet enterprise-grade business requirements.

### **App Store open to community partners**

The App Store and application lifecycle management are unique features of KubeSphere, which are based on self-developed and open-source [OpenPitrix](https://github.com/openpitrix/openpitrix).

KubeSphere 3.2.0 adds the feature of **dynamically loading community-developed Helm charts into the KubeSphere App Store.** You can send a pull request containing the Helm chart of a new app to the App Store chart repository. After the pull request is merged, the app is automatically loaded to the App Store regardless of the KubeSphere version. Welcome to submit your Helm charts to https://github.com/kubesphere/helm-charts. Nocalhost and Chaos Mesh have integrated their Helms charts into KubeSphere 3.2.0 by using this method, and you can easily install them to your Kubernetes clusters by one click.

![12-app-store](/images/blogs/en/release-announcement3.2.0/12-app-store.png)

### **More independent Kubernetes DevOps (on KubeSphere)**

Kubernetes DevOps (on KubeSphere) has developed into an independent project [ks-devops](https://github.com/kubesphere/ks-devops) in KubeSphere v3.2.0, which is intended to allow users to run Kubernetes DevOps (on KubeSphere) in any Kubernetes clusters. Currently, you can use a Helm chart to install the backend components of ks-devops.

Jenkins is a CI engine with a large user base and a rich plug-in ecosystem. In KubeSphere 3.2.0, we will let Jenkins do what it is good at—functioning only as an engine in the backend to provide stable pipeline management capability. A newly added CRD PipelineRun encapsulates run records of pipelines, which reduces the number of APIs required for directly interacting with Jenkins and boosts performance of CI pipelines.

Starting from KubeSphere v3.2.0, Kubernetes DevOps (on KubeSphere) allows you to build images by using pipelines based on containerd. As an independent project, Kubernetes DevOps (on KubeSphere) will support independent deployment of the backend and frontend, introduce GitOps tools such as Tekton and ArgoCD, as well as integrate project management and test management platforms.

### **Flexible Kubernetes cluster deployment**

If you do not have a Kubernetes cluster, you can use KubeKey to install both Kubernetes and KubeSphere; if you already have a Kubernetes cluster, you can use ks-installer to install KubeSphere only.

[KubeKey](https://github.com/kubesphere/kubekey) is an efficient open-source installer, which uses Docker as the default container runtime. It can also use CRI runtimes such as containerd, CRI-O, and iSula. You can use KubeKey to deploy an etcd cluster independent of Kubernetes for better flexibility.

KubeKey provides the following new features:

- Supports the latest Kubernetes version 1.22.1 (backward compatible with 4 earlier versions); supports deployment of K3s (experimental).

-  Supports automatic renewal of Kubernetes cluster certificates.

-  Supports a high availability deployment mode that uses an internal load balancer to reduce the complexity of cluster deployment.

-  Most of the integrated components such as Istio, Jaeger, Prometheus Operator, Fluent Bit, KubeEdge, and Nginx ingress controller have been updated to the latest. For more information, refer to [Release Notes 3.2.0](https://kubesphere.io/docs/release/release-v320/).

### **Better user experience**

To provide a user-friendly web console for global users, our SIG Docs members have refactored and optimized the UI text on the web console to deliver more professional and accurate UI text and terms. Hard-coded and concatenated UI strings are removed for better UI localization and internationalization support.

Some heavy users in the KubeSphere community have participated in enhancing some frontend features. For example, KubeSphere now supports searching for images in a Harbor registry and mounting volumes to init containers, and the feature of automatic workload restart during volume expansion is removed.

For more information about user experience optimization, enhanced features, and fixed bugs, please refer to [Release Notes 3.2.0](https://kubesphere.io/docs/release/release-v320/). You can download and install KubeSphere 3.2.0 by referring to [All-in-One on Linux](https://kubesphere.io/docs/quick-start/all-in-one-on-linux/ ) and [Minimal KubeSphere on Kubernetes](https://kubesphere.io/docs/quick-start/minimal-kubesphere-on-k8s/), and we will offer an offline installation solution in the KubeSphere community in one week.

## **Acknowledgements**

The KubeSphere team would like to acknowledge contributions from the people who make KubeSphere 3.2.0 possible. The following GitHub IDs are not listed in order. If you are not listed, please contact us.

![v3.2.0-contributors](/images/blogs/en/release-announcement3.2.0/v3.2.0-contributors.png)
