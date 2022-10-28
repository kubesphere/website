---
title: "Release Notes for 3.3"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 3.3 Release Notes"
linkTitle: "Release Notes - 3.3"
weight: 18098
---

## DevOps
### Features
- Add the Continuous Deployment feature, which supports GitOps and uses Argo CD as the backend, and users can view the status of continuous deployments in real time.
- Add the allowlist feature on the **Basic Information** page of a DevOps project to restrict the target repository and deployment location for continuous deployments.
- Add support for importing and managing code repositories.
- Add support for built-in CRD-based pipeline templates and parameter customization.
- Add support for viewing pipeline events.
### Enhancements & Updates
- Add support for editing the binding mode of the pipeline's kubeconfig file on the UI.
### Bug Fixes
- Fix an issue where users fail to check the CI/CD template.
- Remove the `Deprecated` tag from the CI/CD template and replace `kubernetesDeploy` with `kubeconfig binding` at the deployment phase.
## Storage
### Features
- Add support for tenant-level storage class permission management.
- Add the volume snapshot content management and volume snapshot class management features.
- Add support for automatic restart of deployments and statefulsets after a PVC has been changed.
- Add the PVC auto expansion feature, which automatically expands PVCs when remaining capacity is insufficient.
### Bug Fixes
- Set `hostpath` as a required option when users are mounting volumes.

## Multi-tenancy and Multi-cluster
### Features
- Add a notification to remind users when the kubeconfig certificate of a cluster is about to expire.
- Add the kubesphere-config configmap, which provides the name of the current cluster.
- Add support for cluster-level member and role management.

## Observability

### Features
- Add process and thread monitoring metrics for containers. 
- Add disk monitoring metrics that provide usage of each disk.
- Add support for importing Grafana templates to create custom monitoring dashboards of a namespace scope.
- Add support for defining separate data retention periods for container logs, resource events, and audit logs.

### Enhancements & Updates
- Upgrade Alertmanager from v0.21.0 to v0.23.0.
- Upgrade Grafana from 7.4.3 to 8.3.3.
- Upgrade kube-state-metrics from v1.9.7 to v2.3.0.
- Upgrade node-exporter from v0.18.1 to v1.3.1.
- Upgrade Prometheus from v2.26.0 to v2.34.0.
- Upgrade Prometheus Operator from v0.43.2 to v0.55.1.
- Upgrade kube-rbac-proxy from v0.8.0 to v0.11.0.
- Upgrade configmap-reload from v0.3.0 to v0.5.0.
- Upgrade Thanos from v0.18.0 to v0.25.2.
- Upgrade kube-events from v0.3.0 to v0.4.0.
- Upgrade Fluent Bit Operator from v0.11.0 to v0.13.0.
- Upgrade Fluent Bit from v1.8.3 to v1.8.11.

## KubeEdge Integration
### Features
- Add support for logging in to common cluster nodes and edge nodes from the KubeSphere web console.
### Enhancements & Updates
- Upgrade KubeEdge from v1.7.2 to v1.9.2.
- Remove EdgeWatcher.

## Network
### Enhancements & Updates
- Integrate OpenELB with KubeSphere for exposing LoadBalancer services.
### Bug Fixes
- Fix an issue where the gateway of a project is not deleted after the project is deleted.
- Fix an issue where users fail to create routing rules in IPv6 and IPv4 dual-stack environments.
## App Store
### Bug Fixes
- Fix a ks-controller-manager crash caused by Helm controller NPE errors.

## Authentication & Authorization
### Features
- Add support for manually disabling and enabling users.
### Bug Fixes
- Delete roles `users-manager` and `workspace-manager`.
- Add role `platform-self-provisioner`.
- Block some permissions of user-defined roles.
## User Experience
- Add a prompt when the audit log of Kubernetes has been enabled.
- Add the lifecycle management feature for containers.
- Add support for creating container environment variables in batches from secrets and configmaps.
- Add a time range selector on the **Traffic Monitoring** tab page.
- Add a message in the **Audit Log Search** dialog box, which prompts users to enable the audit logs feature.
- Add more Istio parameters in `ClusterConfiguration`.
- Add support for more languages, for example, Turkish.
- Set the **Token** parameter on the webhook settings page as mandatory.
- Prevent passwords without uppercase letters set through the backend CLI.
- Fix an issue where no data is displayed on the **Traffic Management** and **Tracing** tab pages in a multi-cluster project.
- Fix an app installation failure, which occurs when users click buttons too fast.
- Fix an issue where container probes are still displayed after they are deleted.
- Fix an issue where statefulset creation fails when a volume is mounted to an init container.
- Prevent ks-apiserver and ks-controller-manager from restarting when the cluster configuration is changed.
- Optimize some UI texts.
- Optimize display of the service topology on the **Service** page.
- Add support for changing the number of items displayed on each page of a table.
- Add support for batch stopping workloads.

For more information about issues and contributors of KubeSphere 3.3, see [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.md).