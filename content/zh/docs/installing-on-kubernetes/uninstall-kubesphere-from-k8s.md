---
title: "从 Kubernetes 上卸载 KubeSphere"
keywords: 'kubernetes, kubesphere, uninstall, remove-cluster'
description: 'How to uninstall KubeSphere from Kubernetes'
LinkTitle: "从 Kubernetes 上卸载 KubeSphere"
weight: 4400
---

You can uninstall KubeSphere from your existing Kubernetes cluster as follows.

{{< notice tip >}}
Uninstall will remove KubeSphere from your Kubernetes cluster. This operation is irreversible and does not have any backup. Please be cautious with this operation.
{{</ notice >}}

You can use [kubesphere-delete.sh](https://github.com/kubesphere/ks-installer/blob/master/scripts/kubesphere-delete.sh) to uninstall KubeSphere from Kubernetes. Copy it from [GitHub source file](https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/kubesphere-delete.sh) and execute this script in your local.
