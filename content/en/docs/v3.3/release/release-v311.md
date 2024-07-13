---
title: "Release Notes for 3.1.1"
keywords: "Kubernetes, KubeSphere, release notes"
description: "KubeSphere Release Notes for 3.1.1"
linkTitle: "Release Notes - 3.1.1"
weight: 18200
version: "v3.3"
---

## User Experience

### Enhancements

- Add the function of deleting related resources in batches during workload deletion. [kubesphere/console#1933](https://github.com/kubesphere/console/pull/1933)
- Optimize dialog boxes. [kubesphere/console#2016](https://github.com/kubesphere/console/pull/2016)
- Add the container terminal function to projects in the `system-workspace` workspace. [kubesphere/console#1921](https://github.com/kubesphere/console/pull/1921)

### Bug Fixes

- Remove the function of editing external network access of headless Services on the Service management page. [kubesphere/console#2055](https://github.com/kubesphere/console/issues/2055)
- Fix the incorrect environment variable placeholders displayed in workload creation. [kubesphere/console#2008](https://github.com/kubesphere/console/pull/2008)
- Fix an issue where the login page is not displayed when users log out from certain pages. [kubesphere/console#2009](https://github.com/kubesphere/console/pull/2009)
- Fix an issue on the Pod template editing page, where the protocol drop-down list is not completely displayed. [kubesphere/console#1944](https://github.com/kubesphere/console/pull/1944)
- Fix a probe format verification issue in workload creation. [kubesphere/console#1941](https://github.com/kubesphere/console/pull/1941)
- Fix the incorrect DevOps project list displayed on the workspace member details page. [#1936](https://github.com/kubesphere/console/pull/1936)
- Fix incorrect and missing UI text. [kubesphere/console#1879](https://github.com/kubesphere/console/pull/1879) [kubesphere/console#1880](https://github.com/kubesphere/console/pull/1880) [kubesphere/console#1895](https://github.com/kubesphere/console/pull/1895)

## Observability

### Enhancements

- Optimize port format restrictions in notification settings. [#1885](https://github.com/kubesphere/console/pull/1885)
- Add the function of specifying an existing Prometheus stack during installation. [#1528](https://github.com/kubesphere/ks-installer/pull/1528) 

### Bug Fixes

- Fix the mail server synchronization error. [#1969](https://github.com/kubesphere/console/pull/1969) 
- Fix an issue where the notification manager is reset after installer restart. [#1564](https://github.com/kubesphere/ks-installer/pull/1564)
- Fix an issue where the alerting policy cannot be deleted after the monitored object is deleted. [#2045](https://github.com/kubesphere/console/pull/2045)
- Add a default template for monitoring resource creation. [#2029](https://github.com/kubesphere/console/pull/2029)
- Fix an issue where containers display only outdated logs. [#1972](https://github.com/kubesphere/console/issues/1972)
- Fix the incorrect timestamp in alerting information. [#1978](https://github.com/kubesphere/console/pull/1978)
- Optimize parameter rules in alerting policy creation. [#1958](https://github.com/kubesphere/console/pull/1958)
- Fix an issue in custom monitoring, where metrics are not completely displayed due to the incorrect height of the view area. [#1989](https://github.com/kubesphere/console/pull/1989)
- Adjust the limits of the node exporter and kube-state-metrics. [#1537](https://github.com/kubesphere/ks-installer/pull/1537)
- Adjust the selector of the etcdHighNumberOfFailedGRPCRequests rule to prevent incorrect etcd alerts. [#1540](https://github.com/kubesphere/ks-installer/pull/1540)
- Fix an issue during system upgrade, where the events ruler component is not upgraded to the latest version. [#1594](https://github.com/kubesphere/ks-installer/pull/1594)
- Fix bugs of the kube_node_status_allocatable_memory_bytes and kube_resourcequota selectors. [#1560](https://github.com/kubesphere/ks-installer/pull/1560)

## Service Mesh

### Enhancements

- Add a time range selector to the Tracing tab. [#2022](https://github.com/kubesphere/console/pull/2022)

### Bug Fixes

- Fix an issue where the Tracing tab is incorrectly displayed. [kubesphere/console#1890](https://github.com/kubesphere/console/pull/1890)

## DevOps

### Enhancements

- Add the function of filtering branches by branch name in GitLab multi-branch pipelines. [kubesphere/console#2077](https://github.com/kubesphere/console/pull/2077)
- Rename the **Rerun** button on the b2i page to **Run**. [kubesphere/console#1981](https://github.com/kubesphere/console/pull/1981)

### Bug Fixes

- Fix an issue where credential status cannot be synchronized. [kubesphere/console#1956](https://github.com/kubesphere/console/pull/1956)
- Fix incorrect image tags in  CI automatic image pushing. [kubesphere/console#2037](https://github.com/kubesphere/console/pull/2037)
- Fix an issue on the pipeline details page, where users cannot return to the previous page. [kubesphere/console#1996](https://github.com/kubesphere/console/pull/1996)
- Fix the inconsistent dialog box names of the image builder. [kubesphere/console#1922](https://github.com/kubesphere/console/pull/1922)
- Fix an issue in DevOps projects, where the updates are reset when kubeconfig credentials are created. [kubesphere/console#1990](https://github.com/kubesphere/console/pull/1990)
- Fix incorrect trusted users in multi-branch pipelines. [kubesphere/console#1987](https://github.com/kubesphere/console/pull/1987)
- Fix an issue in DevOps project pipelines, where stage labels are reset when other settings are changed but not saved. [kubesphere/console#1979](https://github.com/kubesphere/console/pull/1979)
- Fix the incorrect shell and labels displayed in pipelines. [kubesphere/console#1970](https://github.com/kubesphere/console/pull/1970)
- Fix incorrect information displayed in the pipeline basic information dialog box. [kubesphere/console#1955](https://github.com/kubesphere/console/pull/1955)
- Fix the API error generated when multi-branch pipelines are run. [kubesphere/console#1954](https://github.com/kubesphere/console/pull/1954)
- Fix an issue in pipelines, where webhook pushing settings do not take effect. [kubesphere/console#1953](https://github.com/kubesphere/console/pull/1953)
- Optimize the UI text of the drag-and-drop function in the pipeline editor. [kubesphere/console#1949](https://github.com/kubesphere/console/pull/1949)
- Add default build environment settings for service build from source code. [kubesphere/console#1993](https://github.com/kubesphere/console/pull/1993)

## Authentication and Authorization

### Bug Fixes

- Fix the incorrect last login time of users. [kubesphere/console#1881](https://github.com/kubesphere/console/pull/1881)
- Fix an issue in workspaces, where the `admin` user cannot view resource quotas. [kubesphere/ks-installer#1551](https://github.com/kubesphere/ks-installer/pull/1551) [kubesphere/console#2062](https://github.com/kubesphere/console/pull/2062)
- Fix an issue where project members cannot connect to container terminals. [kubesphere/console#2002](https://github.com/kubesphere/console/pull/2002)
- Fix an issue where the administrator cannot be specified when a project is assigned to a workspace. [kubesphere/console#1961](https://github.com/kubesphere/console/pull/1961)
- Fix the duplicate permission names in workspace role creation. [kubesphere/console#1945](https://github.com/kubesphere/console/pull/1945)

## Multi-tenant Management

### Bug Fixes

- Fix an issue where deleted roles can be associated with user groups. [#1899](https://github.com/kubesphere/console/pull/1899) [#3897](https://github.com/kubesphere/kubesphere/pull/3897)
- Fix an issue where deletion of long usernames can cause system collapse. [kubesphere/ks-installer#1450](https://github.com/kubesphere/ks-installer/pull/1450) [kubesphere/kubesphere#3796](https://github.com/kubesphere/kubesphere/pull/3796)
- Fix an error generated when project roles are bound to user groups. [kubesphere/console#1967](https://github.com/kubesphere/console/pull/1967)
- Fix incorrect workspace quotas displayed in multi-cluster environments. [kubesphere/console#2013](https://github.com/kubesphere/console/pull/2013)

## Multi-cluster Management

### Enhancements

- Optimize the error message generated when the configuration of a member cluster is incorrect. [kubesphere/console#2084](https://github.com/kubesphere/console/pull/2084) [kubesphere/console#1965](https://github.com/kubesphere/console/pull/1965)

### Bug Fixes

- Fix an issue where node labels in member clusters cannot be obtained. [kubesphere/console#1927](https://github.com/kubesphere/console/pull/1927)
- Fix an issue on the project list page, where multi-cluster projects are not correctly identified. [kubesphere/console#2059](https://github.com/kubesphere/console/pull/2059)
- Fix the incorrect gateway status displayed in multi-cluster projects. [kubesphere/console#1939](https://github.com/kubesphere/console/pull/1939)

## Metering and Billing

### Enhancements

- Optimize the metering and billing UI. [#1896](https://github.com/kubesphere/console/pull/1896)
- Change the color of a button on the metering and billing page. [#1934](https://github.com/kubesphere/console/pull/1934)

### Bug Fixes

- Fix an issue where OpenPitrix resources are not included in metering and billing. [#3871](https://github.com/kubesphere/kubesphere/pull/3871)
- Fix an error generated in metering and billing for the `system-workspace` workspace. [#2083](https://github.com/kubesphere/console/pull/2083)
- Fix an issue where projects are not completely displayed in the multi-cluster metering and billing list. [#2066](https://github.com/kubesphere/console/pull/2066)
- Fix an error on the billing page generated when a dependent cluster is not loaded. [#2054](https://github.com/kubesphere/console/pull/2054)

## App Store

### Enhancements

- Optimize the UI layout and text on the app template creation page. [kubesphere/console#2012](https://github.com/kubesphere/console/pull/2012) [kubesphere/console#2063](https://github.com/kubesphere/console/pull/2063)
- Optimize the app template import function. [kubesphere/openpitrix-jobs#18](https://github.com/kubesphere/openpitrix-jobs/pull/18)
- Add the RadonDB PostgreSQL app to the App Store. [kubesphere/openpitrix-jobs#17](https://github.com/kubesphere/openpitrix-jobs/pull/17)

## Security

### Enhancements

- Switch the branch of jwt-go to fix CVE-2020-26160. [#3991](https://github.com/kubesphere/kubesphere/pull/3991)
- Upgrade the Protobuf version to v1.3.2 to fix CVE-2021-3121. [#3944](https://github.com/kubesphere/kubesphere/pull/3944)
- Upgrade the Crypto version to the latest version to fix CVE-2020-29652. [#3997](https://github.com/kubesphere/kubesphere/pull/3997)
- Remove the `yarn.lock` file to prevent incorrect CVE bug reports. [#2024](https://github.com/kubesphere/console/pull/2024)

### Bug Fixes

- Fix an issue where container terminal can be accessed without authorization. [kubesphere/kubesphere#3956](https://github.com/kubesphere/kubesphere/pull/3956)

## Storage

### Enhancements

- Improve the concurrency performance of the S3 uploader. [#4011](https://github.com/kubesphere/kubesphere/pull/4011)
- Add preset CSI Provisioner CR settings. [#1536](https://github.com/kubesphere/ks-installer/pull/1536)

### Bug Fixes

- Remove the invalid function of automatic storage class detection. [#3947](https://github.com/kubesphere/kubesphere/pull/3947)
- Fix incorrect storage resource units of project quotas.[#3973](https://github.com/kubesphere/kubesphere/issues/3973)

## KubeEdge Integration

### Enhancements

- Add support for KubeEdge v1.6.2. [#1527](https://github.com/kubesphere/ks-installer/pull/1527) [#1542](https://github.com/kubesphere/ks-installer/pull/1542)

### Bug Fixes

- Fix the incorrect `advertiseAddress` setting of the KubeEdge CloudCore component. [#1561](https://github.com/kubesphere/ks-installer/pull/1561)