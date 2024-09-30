---
title: "4.1.2 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 4.1.2 版本说明"
linkTitle: "4.1.2 版本说明"
weight: 44
---

## KubeSphere

### 安装/升级命令

```
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-1.1.2.tgz --debug --wait
```

### 新特性

- 支持基于 OCI 的 Helm Chart 仓库

### 优化

- 增加默认的扩展组件仓库

### 缺陷修复

- 修复部分扩展组件页面白屏的问题
- 修复 ks-core 卸载时部分资源残留的问题
- 修复 K8s 1.19 环境无法安装的问题
