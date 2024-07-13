---
title: "Uninstall KubeSphere and Kubernetes"
keywords: 'Kubernetes, KubeSphere, uninstalling, remove-cluster'
description: 'Remove KubeSphere and Kubernetes from your machines.'
linkTitle: "Uninstall KubeSphere and Kubernetes"
weight: 3700
version: "v3.4"
---


Uninstalling KubeSphere and Kubernetes means they will be removed from your machine. This operation is irreversible and does not have any backup. Please be cautious with the operation.

To delete your cluster, execute the following command.

- If you installed KubeSphere with the quickstart ([all-in-one](../../quick-start/all-in-one-on-linux/)):

    ```bash
    ./kk delete cluster
    ```

- If you installed KubeSphere with the advanced mode ([created with a configuration file](../introduction/multioverview/#step-3-create-a-cluster)):

    ```bash
    ./kk delete cluster [-f config-sample.yaml]
    ```

