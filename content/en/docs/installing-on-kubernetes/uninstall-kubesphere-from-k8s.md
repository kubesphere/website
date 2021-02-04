---
title: "Uninstall KubeSphere from Kubernetes"
keywords: 'Kubernetes, KubeSphere, uninstall, remove-cluster'
description: 'How to uninstall KubeSphere from Kubernetes'
linkTitle: "Uninstall KubeSphere from Kubernetes"
weight: 4400
---

You can uninstall KubeSphere from your existing Kubernetes cluster by using [kubesphere-delete.sh](https://github.com/kubesphere/ks-installer/blob/master/scripts/kubesphere-delete.sh). Copy it from the [GitHub source file](https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/kubesphere-delete.sh) and execute this script on your local machine.

{{< notice warning >}}

Uninstalling will remove KubeSphere from your Kubernetes cluster. This operation is irreversible and does not have any backup. Please be cautious with this operation.

{{</ notice >}}