---
title: "Release Notes for 3.4.1"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 3.4.1 Release Notes"
linkTitle: "Release Notes - 3.4.1"
weight: 18094
---

## DevOps

### Enhancements & Updates

- Support user-defined pipeline configuration steps. 
- Optimize the devops-jenkins JVM memory configuration. 

### Bug Fixes

- Fix the issue of removing ArgoCD resources without cascade parameters.
- Fix the issue that downloading artifacts for multi-branch pipelines fails. 
- Fix the issue that the pipeline running status is inconsistent with Jenkins (Add retry for pipelinerun annotation update). 
- Fix the issue that the running of a pipeline created by a new user is pending. 


## Storage

### Bug Fixes

- Fix the issue that pvc cannot be deleted.

## Gateway and Microservice

### Features

- Gateway supports the configuration of forwarding TCP/UDP traffic.

### Enhancements & Updates

- Upgrade ingress nginx: v1.1.0 -> v1.3.1.
- Upgrade servicemesh: 
istio: 1.11.1 -> 1.14.6; kiali: v1.38.1 -> v1.50.1; jaeger: 1.27 -> 1.29.

### Bug Fixes

- Fix the issue that the returned cluster gateways duplicate. 
- Fix the verification error when upgrading the gateway. 
- Fix the abnormal display of cluster gateway log and resource status after changing gateway namespace configuration. 

## Observability

### Features

- Add CRDs such as RuleGroup, ClusterRuleGroup, GlobalRuleGroup to support Alerting v2beta1 APIs. 
- Add admission webhook for RuleGroup, ClusterRuleGroup, GlobalRuleGroup. 
- Add controllers to sync RuleGroup, ClusterRuleGroup, GlobalRuleGroup resources to PrometheusRule resources. 
- Add Alerting v2beta1 APIs. 
- The ks-apiserver of Kubesphere integrates the v1 and v2 versions of opensearch, and users can use the external or built-in opensearch cluster for log storage and query. (Currently the built-in opensearch version of Kubesphere is v2). 
- ks-installer integrates the opensearch dashboard, which should be enabled by users. 

### Enhancements & Updates
- Upgrade Prometheus stack dependencies. 
- Support configuring the maximum number of logs that can be exported.
- The monitoring component supports Kubernetes PDB Apiversion changes.
- Upgrade Notification Manager to v2.3.0. 
- Support cleaning up notification configuration in member clusters when a member cluster is deleted. 
- Support switching notification languages. 
- Support route notifications to specified users. 

### Bug Fixes

- Fix the issue that Goroutine leaks when getting audit event sender times out.
- Fix the promql statement of ingress P95 delay. 


## Multi-tenancy and Multi-cluster

### Enhancements & Updates

- Check the cluster ID (kube-system UID) when updating the cluster. 

### Bug Fixes

- Make sure the cluster is Ready when cleaning up notifications.
- Fix the webhook validation issue for new clusters. 
- Fix the incorrect cluster status. 
- Fix the issue of potentially duplicated entries for granted clusters in the workspace.


## App Store

### Bug Fixes

- Fix the ID generation failure in IPv6-only environment. 
- Fix the missing Home field in app templates. 
- Fix the issue that the uploaded app templates do not show icons.
- Fix missing maintainers in Helm apps. 
- Fix the issue that Helm applications in a failed status cannot be upgraded again. 
- Fix the wrong "applicationId" parameter. 
- Fix the infinite loop after app installation failure. 
- FIx the wrong status of application repository. 


## Network

### Enhancements & Updates

- Upgrade dependencies.


## Authentication and Authorization

### Features

- Add inmemory cache.
- Add Resource Getter v1beta1.
- Add write operation for Resource Manager. 

### Enhancements & Updates

- Add iam.kubesphere/v1beta1 RoleTemplate.
- Update the password minimum length to 8.
- Update Version API.
- Update identityProvider API. 
- Add IAM v1beta1 APIs. 

### Bug Fixes

- Fix the issue that the enableMultiLogin configuration does not take effect.

## API Changes

- Use autoscaling/v2 API.
- Use batch/v1 API. 
- Update health check API.
- Fix the ks-apiserver crash issue in K8s v1.25.


## User Experience

### Features

- Resource API supports searching alias in annotations. 

### Bug Fixes

- Fix the potential Websocket link leakage issue. 

### Enhancements & Updates
- Use Helm action package instead of using Helm binary.  
- Adjust the priority of bash and sh in the kubectl terminal.
- Fix the issue that ks-apiserver cannot start due to DiscoveryAPI exception.
- Fix the issue that the pod status is inconsistent with the filtered status when filtering by status on the pod list page. 
- Support querying the secret list according to the secret type by supporting fieldSelector filtering.

For more information about issues and contributors of KubeSphere 3.4.1, see [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.4.1.md).