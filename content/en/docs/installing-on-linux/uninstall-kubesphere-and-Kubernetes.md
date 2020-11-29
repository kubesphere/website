---
title: "Uninstall KubeSphere and Kubernetes"
keywords: 'Kubernetes, KubeSphere, uninstalling, remove-cluster'
description: 'How to uninstall KubeSphere and Kubernetes'

weight: 4500
---

You can delete the cluster by the following command.

{{< notice tip >}}
Uninstall will remove KubeSphere and Kubernetes from your machines. This operation is irreversible and does not have any backup. Please be cautious with the operation.
{{</ notice >}}

- If you started with the quickstart ([all-in-one](../../quick-start/all-in-one-on-linux/)):

    ```bash
    ./kk delete cluster
    ```

- If you started with the advanced mode ([created with a configuration file](../introduction/multioverview/)):

    ```bash
    ./kk delete cluster [-f config-sample.yaml]
    ```

