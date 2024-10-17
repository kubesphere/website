---
title: "Release Notes for 4.1.2"
linkTitle: "Release Notes - 4.1.2"
keywords: "Kubernetes, KubeSphere, Release Notes"
description: "KubeSphere 4.1.2 Release Notes"
weight: 44
---

## KubeSphere

### Installation/Upgrade Command

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.2.tgz --debug --wait
```

### Features

- Support for OCI-based Helm Chart repositories.

### Enhancements

- Add the default extension repository.

### Bug Fixes

- Fix white screen pages of some extensions.
- Fix problem of residual resources when uninstalling ks-core.
- Fix installation failure in K8s 1.19 environments.


### Known issues

- The image builder (S2I, B2I) feature in DevOps is not available in this release.