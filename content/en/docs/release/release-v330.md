---
title: "3.3.0 Release Notes"
keywords: "Kubernetes, KubeSphere, Release Notes"  
description: "KubeSphere 3.3.0 Release Notes"  
linkTitle: "3.3.0 Release Notes"  
weight: 18098
---

## DevOps
### Features
- Support GitOps-based continuous deployment with Argo CDs as the backend, and users can view the status of continuous deployments in real time.
- Support the continuous deployment allowlist to restrict the target repository and deployment location for continuous deployments.
- Support the ability to import and manage code repositories.
- Add built-in CRD-based pipeline templates and support parameter customization.
- Support the ability to view pipeline events.

## Storage
### Features
- Support for tenant-level storage class permission management.
- Add features such as volume snapshot content and volume snapshot class management.
- Support automatic restart of deployments and statefulsets after a PVC has been changed.
- Support automatic expansion of PVs.

## Multi-tenancy and multi-cluster
### Features
- Support for kubeconfig update for member clusters on the KubeSphere console.
- Support for notifications before a cluster's certificate is about to expire.
- Support for cluster-level member management.

## Observability

### Features
- Add container process/thread monitoring metrics.
- Support monitoring node usage.
- Support for tenant-level custom monitoring Grafana template import.

### Enhancements & Updates
- Upgrade Alertmanager from v0.21.0 to v0.23.0.
- Upgrade Grafana from 7.4.3 to 8.3.3.
- Upgrade Kube-state-metrics from v1.9.7 to v2.3.0.
- Upgrade Node-exporter from v0.18.1 to v1.3.1.
- Upgrade Prometheus from v2.26.0 to v2.34.0.
- Upgrade Prometheus-operator from v0.43.2 to v0.55.1.
- Upgrade Kube-rbac-proxy from v0.8.0 to v0.11.0.
- Upgrade Configmap-reload from v0.3.0 to v0.5.0.
- Upgrade Thanos from v0.18.0 to v0.25.2.
- Upgrade Kube-events from v0.3.0 to v0.4.0.
- Upgrade Fluentbit Operator from v0.11.0 to v0.13.0.
- Upgrade Fluent-bit from v1.8.3 to v1.8.11.

## KubeEdge Integration
### Features
- Support access to the terminal of cluster nodes, including edge nodes, on the console.
### Enhancements & Updates
- Upgrade KubeEdge from v1.7.2 to v1.9.2.
- Remove EdgeWatcher.

## Network
### Enhancements & Updates
- Add OpenELB as a load balancer option.
### Bug Fixes
- Fix the issue "The project gateway still exists after a project has been deleted".

## App Store
- Fix the crash of ks-controller-manager caused by NPE.

## Authentication & Authorization

- Support the ability to manually enable and disable users.

## User Experience
- Add a prompt when the audit log of Kubernetes has been enabled.
- Support for the ability to load the entire configmap or secret as environment variables for a deployment.
- Support for more Istio parameters in `ClusterConfiguration`.
- Optimize display of the service topology on the Service page.
- Optimize the update mechanism of `ClusterConfiguration`, without the need to restart the ks-apiserver and ks-controller-manager.
- Fix the issue "The data is empty when modifying the stateful service".
- Check validity of user's passwords.
- Optimize some UI texts.
- Support for more languages, for example, Turkish.

For more information about issues and contributors of KubeSphere 3.3.0, see [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.md).