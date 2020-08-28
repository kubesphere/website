---
title: "Delete Cluster"
keywords: 'kubernetes, kubesphere, scale, add-nodes'
description: 'How to add new nodes in an existing cluster'


weight: 2345
---

You can delete the cluster by the following command.

{{< notice tip >}}
Uninstall will remove KubeSphere and Kubernetes from the machines. This operation is irreversible and does not have any backup. Please be caution with operation.
{{</ notice >}}

- If you started with the quick start (all-in-one):

```
./kk delete cluster
```

- If you started with the advanced mode (created with a configuration file):

```
./kk delete cluster [-f config-sample.yaml]
```
