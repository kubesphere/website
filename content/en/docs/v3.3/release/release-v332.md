---
title: "Release Notes for 3.3.2"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 3.3.2 Release Notes"
linkTitle: "Release Notes - 3.3.2"
weight: 18095
version: "v3.3"
---

## DevOps

### Enhancements & Upgrades

- Add the latest GitHub Actions. 
- Save the PipelineRun results to the configmap. 
- Modify the Chinese description of the status of ArgoCD applications. 
- Add more information to continuous deployment parameters.
- Add a link for PipelineRun in the aborted state.
- Add an ID column for PipelineRun, and the ID will be displayed when users run kubectl commands.
- Remove the queued state from PipelineRun.

### Bug Fixes

- Fix an issue where webhook configurations are missing after users change and save pipeline configurations.
- Fix an issue where downloading DevOps pipeline artifacts fails.
- Fix an issue where the image address does not match when a service is created by using a JAR/WAR file. 
- Fix an issue where the status of PipelineRun changes from `Cancelled` to `Not-Running`.
- Fix the automatic cleaning behavior of pipelines to keep it consistent with the cleaning configurations of Jenkins. 

## App Store

### Bug Fixes

- Fix an issue where the application icon is not displayed on the uploaded application template.
- Fix an issue where the homepage of an application is not displayed on the application information page.
- Fix an issue where importing built-in applications fails.
- Fix a UUID generation error in an IPv6-only environment.

## Observability

### Bug Fixes

- Fix a parsing error in the configuration file of logsidecar-injector.

## Service Mesh

### Bug Fixes

- Fix an issue that application governance of Bookinfo projects without service mesh enabled is not disabled by default.
- Fix an issue where the delete button is missing on the blue-green deployment details page. 

## Network

### Bug Fixes

- Restrict network isolation of projects within the current workspace.

## Storage

### Enhancements & Upgrades

- Display the cluster to which system-workspace belongs in multi-cluster environments. 
- Rename route to ingress.

## Authentication & Authorization

### Enhancements & Upgrades

- Add dynamic options for cache.
- Remove the "Alerting Message Management" permission.

### Bug Fixes

- Fix an issue where platform roles with platform management permisions cannot manage clusters.

## Development & Testing

### Bug Fixes

- Fix an issue where some data is in the `Out of sync` state after the live-reload feature is introduced.
- Fix an issue where the ks-apiserver fails when it is reloaded multiple times.
- Fix an issue where caching resources fails if some required CRDs are missing.
- Fix an issue where the ks-apiserver crashes in Kubernetes 1.24+ versions.
- Fix an issue where Goroutine leaks occur when the audit event sender times out.

## User Experience

- Limit the length of cluster names.
- Fix an issue where pod replicas of a federated service are not automatically refreshed. 
- Fix an issue where related pods are not deleted after users delete a service.
- Fix an issue where the number of nodes and roles are incorrectly displayed when there is only one node.

For more information about issues and contributors of KubeSphere 3.3.2, see [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.2.md).