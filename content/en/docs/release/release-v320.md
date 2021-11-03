---
title: "Release Notes for 3.2.0"
keywords: "Kubernetes, KubeSphere, release notes"
description: "KubeSphere Release Notes for 3.2.0"
linkTitle: "Release Notes - 3.2.0"
weight: 18100
---

## Multi-tenancy & Multi-cluster

### New Features

- Add support for setting the host cluster name in multi-cluster scenarios, which defaults to `host`. ([#4211](https://github.com/kubesphere/kubesphere/pull/4211), [@yuswift](https://github.com/yuswift))
- Add support for setting the cluster name in single-cluster scenarios. ([#4220](https://github.com/kubesphere/kubesphere/pull/4220), [@yuswift](https://github.com/yuswift))
- Add support for initializing the default cluster name by using globals.config. ([#2283](https://github.com/kubesphere/console/pull/2283), [@harrisonliu5](https://github.com/harrisonliu5))
- Add support for scheduling Pod replicas across multiple clusters when creating a Deployment. ([#2191](https://github.com/kubesphere/console/pull/2191), [@weili520](https://github.com/weili520))
- Add support for changing cluster weights on the project details page. ([#2192](https://github.com/kubesphere/console/pull/2192), [@weili520](https://github.com/weili520))

### Bug Fixes

- Fix an issue in the **Create Deployment** dialog box in **Cluster Management**, where a multiple-cluster project can be selected by directly entering the project name. ([#2125](https://github.com/kubesphere/console/pull/2125), [@fuchunlan](https://github.com/fuchunlan))
- Fix an error that occurs when workspace or cluster basic information is edited. ([#2188](https://github.com/kubesphere/console/pull/2188), [@xuliwenwenwen](https://github.com/xuliwenwenwen))
- Remove information about deleted clusters on the **Basic Information** page of the host cluster. ([#2211](https://github.com/kubesphere/console/pull/2211), [@fuchunlan](https://github.com/fuchunlan))
- Add support for sorting Services and editing Service settings in multi-cluster projects. ([#2167](https://github.com/kubesphere/console/pull/2167), [@harrisonliu5](https://github.com/harrisonliu5))
- Refactor the gateway feature of multi-cluster projects. ([#2275](https://github.com/kubesphere/console/pull/2275), [@harrisonliu5](https://github.com/harrisonliu5))
- Fix an issue where multi-cluster projects cannot be deleted after the workspace is deleted. ([#4365](https://github.com/kubesphere/kubesphere/pull/4365), [@wansir](https://github.com/wansir))

## Observability

### New Features

- Add support for HTTPS communication with Elasticsearch. ([#4176](https://github.com/kubesphere/kubesphere/pull/4176), [@wanjunlei](https://github.com/wanjunlei))
- Add support for setting GPU types when scheduling GPU workloads. ([#4225](https://github.com/kubesphere/kubesphere/pull/4225), [@zhu733756](https://github.com/zhu733756))
- Add support for validating notification settings. ([#4216](https://github.com/kubesphere/kubesphere/pull/4216), [@wenchajun](https://github.com/wenchajun))
- Add support for importing Grafana dashboards by specifying a dashboard URL or by uploading a Grafana dashboard JSON file. KubeSphere automatically converts Grafana dashboards into KubeSphere cluster dashboards. ([#4194](https://github.com/kubesphere/kubesphere/pull/4194), [@zhu733756](https://github.com/zhu733756))
- Add support for creating Grafana dashboards in **Custom Monitoring**. ([#2214](https://github.com/kubesphere/console/pull/2214), [@harrisonliu5](https://github.com/harrisonliu5))
- Optimize the **Notification Configuration** feature. ([#2261](https://github.com/kubesphere/console/pull/2261), [@xuliwenwenwen](https://github.com/xuliwenwenwen))
- Add support for setting a GPU limit in the **Edit Default Container Quotas** dialog box. ([#2253](https://github.com/kubesphere/console/pull/2253), [@weili520](https://github.com/weili520))
- Add a default GPU monitoring dashboard.（[#2580](https://github.com/kubesphere/console/pull/2580), [@harrisonliu5](https://github.com/harrisonliu5)）
- Add the **Leader** tag to the etcd leader on the etcd monitoring page. ([#2445](https://github.com/kubesphere/console/pull/2445), [@xuliwenwenwen](https://github.com/xuliwenwenwen))

### Bug Fixes

- Fix the incorrect Pod information displayed on the **Alerting Messages** page and alerting policy details page. ([#2215](https://github.com/kubesphere/console/pull/2215), [@harrisonliu5](https://github.com/harrisonliu5))

## Authentication & Authorization

### New Features

- Add a built-in OAuth 2.0 server that supports OpenID Connect. ([#3525](https://github.com/kubesphere/kubesphere/pull/3525), [@wansir](https://github.com/wansir))
- Remove information confirmation required when an external identity provider is used. ([#4238](https://github.com/kubesphere/kubesphere/pull/4238), [@wansir](https://github.com/wansir))

### Bug Fixes

- Fix incorrect source IP addresses in the login history. ([#4331](https://github.com/kubesphere/kubesphere/pull/4331), [@wansir](https://github.com/wansir))

## Storage

### New Features

- Change the parameters that determine whether volume clone, volume snapshot, and volume expansion are allowed. ([#2199](https://github.com/kubesphere/console/pull/2199), [@weili520](https://github.com/weili520))
- Add support for setting the volume binding mode during storage class creation. ([#2220](https://github.com/kubesphere/console/pull/2220), [@weili520](https://github.com/weili520))
- Add the volume instance management feature. ([#2226](https://github.com/kubesphere/console/pull/2226), [@weili520](https://github.com/weili520))
- Add support for multiple snapshot classes. Users are allowed to select a snapshot type when creating a snapshot. ([#2218](https://github.com/kubesphere/console/pull/2218), [@weili520](https://github.com/weili520))

### Bug Fixes

- Change the volume access mode options on the **Volume Settings** tab page. ([#2348](https://github.com/kubesphere/console/pull/2348), [@live77](https://github.com/live77))

## Network

### New Features

- Add the Route sorting, routing rule editing, and annotation editing features on the Route list page. ([#2165](https://github.com/kubesphere/console/pull/2165), [@harrisonliu5](https://github.com/harrisonliu5)) 
- Refactor the cluster gateway and project gateway features. ([#2262](https://github.com/kubesphere/console/pull/2262), [@harrisonliu5](https://github.com/harrisonliu5))
- Add the service name auto-completion feature in routing rule creation. ([#2196](https://github.com/kubesphere/console/pull/2196), [@wengzhisong-hz](https://github.com/wengzhisong-hz))
- DNS optimizations for ks-console:
    - Use the name of the ks-apiserver Service directly instead of `ks-apiserver.kubesphere-system.svc` as the API URL.
    - Add a DNS cache plugin (dnscache) for caching DNS results. ([#2435](https://github.com/kubesphere/console/pull/2435), [@live77](https://github.com/live77))

### Bug Fixes

- Add a **Cancel** button in the **Enable Gateway** dialog box. ([#2245](https://github.com/kubesphere/console/pull/2245), [@weili520](https://github.com/weili520))

## Apps & App Store

### New Features

- Add support for setting a synchronization interval during app repository creation and editing. ([#2311](https://github.com/kubesphere/console/pull/2311), [@xuliwenwenwen](https://github.com/xuliwenwenwen))
- Add a disclaimer in the App Store. ([#2173](https://github.com/kubesphere/console/pull/2173), [@xuliwenwenwen](https://github.com/xuliwenwenwen))
- Add support for dynamically loading community-developed Helm charts into the App Store. ([#4250](https://github.com/kubesphere/kubesphere/pull/4250), [@xyz-li](https://github.com/xyz-li))

### Bug Fixes

- Fix an issue where the value of `kubesphere_app_template_count` is always `0` when `GetKubeSphereStats` is called. ([#4130](https://github.com/kubesphere/kubesphere/pull/4130), [@ks-ci-bot](https://github.com/ks-ci-bot))

## DevOps

### New Features

- Set the system to hide the **Branch** column on the **Run Records** tab page when the current pipeline is not a multi-branch pipeline. ([#2379](https://github.com/kubesphere/console/pull/2379), [@live77](https://github.com/live77))
- Add the feature of automatically loading Jenkins configurations from ConfigMaps. ([#75](https://github.com/kubesphere/ks-devops/pull/75), [@JohnNiang](https://github.com/JohnNiang))
- Add support for triggering pipelines by manipulating CRDs instead of calling Jenkins APIs. ([#41](https://github.com/kubesphere/ks-devops/issues/41), [@rick](https://github.com/LinuxSuRen))
- Add support for containerd-based pipelines. ([#171](https://github.com/kubesphere/ks-devops/pull/171), [@rick](https://github.com/LinuxSuRen))
- Add Jenkins job metadata into pipeline annotations. ([#254](https://github.com/kubesphere/ks-devops/issues/254), [@JohnNiang](https://github.com/JohnNiang))

### Bug Fixes

- Fix an issue where credential creation and update fails when the value length of a parameter is too long. ([#123](https://github.com/kubesphere/ks-devops/pull/123), [@shihh](https://github.com/shihaoH))
- Fix an issue where ks-apiserver crashes when the **Run Records** tab page of a parallel pipeline is opened. ([#93](https://github.com/kubesphere/ks-devops/pull/93), [@JohnNiang](https://github.com/JohnNiang))

### Dependency Upgrades

- Upgrade the version of Configuration as Code to 1.53. ([#42](https://github.com/kubesphere/ks-jenkins/pull/42), [@rick](https://github.com/LinuxSuRen))

## Installation

### New Features

- Add support for Kubernetes v1.21.5 and v1.22.1. ([#634](https://github.com/kubesphere/kubekey/pull/634), [@pixiake](https://github.com/pixiake))
- Add support for automatically setting the container runtime. ([#738](https://github.com/kubesphere/kubekey/pull/738), [@pixiake](https://github.com/pixiake))
- Add support for automatically updating Kubernetes certificates. ([#705](https://github.com/kubesphere/kubekey/pull/705), [@pixiake](https://github.com/pixiake))
- Add support for installing Docker and conatinerd using a binary file. ([#657](https://github.com/kubesphere/kubekey/pull/657), [@pixiake](https://github.com/pixiake))
- Add support for Flannel VxLAN and direct routing. ([#606](https://github.com/kubesphere/kubekey/pull/606), [@kinglong08](https://github.com/kinglong08))
- Add support for deploying etcd using a binary file. ([#634](https://github.com/kubesphere/kubekey/pull/634), [@pixiake](https://github.com/pixiake))
- Add an internal load balancer for deploying a high availability system. ([#567](https://github.com/kubesphere/kubekey/pull/567), [@24sama](https://github.com/24sama))

### Bug Fixes
- Fix a runtime.RawExtension serialization error. ([#731](https://github.com/kubesphere/kubekey/pull/731), [@pixiake](https://github.com/pixiake))
- Fix the nil pointer error during cluster upgrade. ([#684](https://github.com/kubesphere/kubekey/pull/684), [@24sama](https://github.com/24sama))
- Add support for updating certificates of Kubernetes v1.20.0 and later. ([#690](https://github.com/kubesphere/kubekey/pull/690), [@24sama](https://github.com/24sama))
- Fix a DNS address configuration error. ([#637](https://github.com/kubesphere/kubekey/pull/637), [@pixiake](https://github.com/pixiake))
- Fix a cluster creation error that occurs when no default gateway address exists. ([#661](https://github.com/kubesphere/kubekey/pull/661), [@liulangwa](https://github.com/liulangwa))

## User Experience
- Fix language mistakes and optimize wording. ([@Patrick-LuoYu](https://github.com/Patrick-LuoYu), [@Felixnoo](https://github.com/Felixnoo), [@serenashe](https://github.com/serenashe))
- Fix incorrect function descriptions. ([@Patrick-LuoYu](https://github.com/Patrick-LuoYu), [@Felixnoo](https://github.com/Felixnoo), [@serenashe](https://github.com/serenashe))
- Remove hard-coded and concatenated UI strings to better support UI localization and internationalization. ([@Patrick-LuoYu](https://github.com/Patrick-LuoYu), [@Felixnoo](https://github.com/Felixnoo), [@serenashe](https://github.com/serenashe))
- Add conditional statements to display correct English singular and plural forms. ([@Patrick-LuoYu](https://github.com/Patrick-LuoYu), [@Felixnoo](https://github.com/Felixnoo), [@serenashe](https://github.com/serenashe))
- Optimize the **Pod Scheduling Rules** area in the **Create Deployment** dialog box. ([#2170](https://github.com/kubesphere/console/pull/2170), [@qinyueshang](https://github.com/qinyueshang))
- Fix an issue in the **Edit Project Quotas** dialog box, where the quota value changes to 0 when it is set to infinity. ([#2118](https://github.com/kubesphere/console/pull/2118), [@fuchunlan](https://github.com/fuchunlan))
- Fix an issue in the **Create ConfigMap** dialog box, where the position of the hammer icon is incorrect when the data entry is empty. ([#2206](https://github.com/kubesphere/console/pull/2206), [@fuchunlan](https://github.com/fuchunlan))
- Fix the incorrect default value of the time range drop-down list on the **Overview** page of projects. ([#2340](https://github.com/kubesphere/console/pull/2340), [@fuchunlan](https://github.com/fuchunlan))
- Fix an error that occurs during login redirection, where redirection fails if the referer URL contains an ampersand (&). ([#2194](https://github.com/kubesphere/console/pull/2194), [@harrisonliu5](https://github.com/harrisonliu5))
- Change **1 hours** to **1 hour** on the custom monitoring dashboard creation page. ([#2276](https://github.com/kubesphere/console/pull/2276), [@live77](https://github.com/live77))
- Fix the incorrect Service types on the Service list page. ([#2178](https://github.com/kubesphere/console/pull/2178), [@xuliwenwenwen](https://github.com/xuliwenwenwen))
- Fix the incorrect traffic data displayed in grayscale release job details. ([#2422](https://github.com/kubesphere/console/pull/2422), [@harrisonliu5](https://github.com/harrisonliu5))
- Fix an issue in the **Edit Project Quotas** dialog box, where values with two decimal places and values greater than 8 cannot be set. ([#2127](https://github.com/kubesphere/console/pull/2127), [@weili520](https://github.com/weili520))
- Allow the **About** dialog box to be closed by clicking other areas of the window. ([#2114](https://github.com/kubesphere/console/pull/2114), [@fuchunlan](https://github.com/fuchunlan))
- Optimize the project title so that the cursor is changed into a hand when hovering over the project title. ([#2128](https://github.com/kubesphere/console/pull/2128), [@fuchunlan](https://github.com/fuchunlan))
- Add support for creating ConfigMaps and Secrets in the **Environment Variables** area of the **Create Deployment** dialog box. ([#2227](https://github.com/kubesphere/console/pull/2227), [@harrisonliu5](https://github.com/harrisonliu5))
- Add support for setting Pod annotations in the **Create Deployment** dialog box. ([#2129](https://github.com/kubesphere/console/pull/2129), [@harrisonliu5](https://github.com/harrisonliu5))
- Allow domain names to start with an asterisk (*). ([#2432](https://github.com/kubesphere/console/pull/2432), [@wengzhisong-hz](https://github.com/wengzhisong-hz))
- Add support for searching for Harbor images in the **Create Deployment** dialog box. ([#2132](https://github.com/kubesphere/console/pull/2132), [@wengzhisong-hz](https://github.com/wengzhisong-hz))
- Add support for mounting volumes to init containers. ([#2166](https://github.com/kubesphere/console/pull/2166), [@Sigboom](https://github.com/Sigboom))
- Remove the workload auto-restart feature in volume expansion. ([#4121](https://github.com/kubesphere/kubesphere/pull/4121), [@wenhuwang](https://github.com/wenhuwang))


## APIs

- Deprecate router API version v1alpha2. ([#4193](https://github.com/kubesphere/kubesphere/pull/4193), [@RolandMa1986](https://github.com/RolandMa1986))
- Upgrade the pipeline API version from v2 to v3. ([#2323](https://github.com/kubesphere/console/pull/2323), [@harrisonliu5](https://github.com/harrisonliu5))
- Change the Secret verification API. ([#2368](https://github.com/kubesphere/console/pull/2368), [@harrisonliu5](https://github.com/harrisonliu5))

## Component Changes

- kubefed: v0.7.0 -> v0.8.1
- prometheus-operator: v0.42.1 -> v0.43.2
- notification-manager: v1.0.0 -> v1.4.0
- fluent-bit: v1.6.9 -> v1.8.3
- kube-events: v0.1.0 -> v0.3.0
- kube-auditing: v0.1.2 -> v0.2.0
- istio: 1.6.10 -> 1.11.1
- jaeger: 1.17 -> 1.27
- kiali: v1.26.1 -> v1.38
- KubeEdge: v1.6.2 -> 1.7.2