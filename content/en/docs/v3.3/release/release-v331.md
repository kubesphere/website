---
title: "Release Notes for 3.3.1"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 3.3.1 Release Notes"
linkTitle: "Release Notes - 3.3.1"
weight: 18096
version: "v3.3"
---

## DevOps
### Enhancements & Updates

- Add support for editing the kubeconfig binding mode on the pipeline UI.

### Bug Fixes

- Fix an issue where users fail to check the CI/CD template.
- Remove the `Deprecated` tag from the CI/CD template and replace `kubernetesDeploy` with `kubeconfig binding` at the deployment phase.

## Network
### Bug Fixes

- Fix an issue where users fail to create routing rules in IPv6 and IPv4 dual-stack environments.

## Storage
### Bug Fixes

- Set `hostpath` as a required option when users are mounting volumes.


## Authentication & Authorization
### Bug Fixes

- Delete roles `users-manager` and `workspace-manager`.
- Add role `platform-self-provisioner`.
- Block some permissions of custom roles.

## User Experience

- Add support for changing the number of items displayed on each page of a table.
- Add support for batch stopping workloads.

For more information about issues and contributors of KubeSphere 3.3.1, see [GitHub](https://github.com/kubesphere/kubesphere/blob/master/CHANGELOG/CHANGELOG-3.3.1.md).