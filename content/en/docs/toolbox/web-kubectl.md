---
title: "Web Kubectl"
keywords: 'kubesphere, kubernetes, kubectl, cli'
description: 'Use kubectl from toolbox'

linkTitle: "Web Kubectl"
weight: 3050
---

The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs.

KubeSphere provides web kubectl on the interface for user convenience. By default, in currently version only the platform administrator (platform-admin) role has the permission to use web kubectl to operate and manage cluster resources.

## Objective

In this tutorial, you will learn how to use web kubectl to operate and manage cluster resources.

## Use web kubectl

Log on to KubeSphere using the platform administrator role, and mouse over the **Toolbox** in the lower right corner and then select **Kubectl**.

![web-kubectl-enter](/images/docs/web-kubectl/web-kubectl-enter.png)

As shown in the pop-up window, you can see the kubectl interface, first you should select which cluster to operate from the dropdown list on the upper right corner.

![web-kubectl-cluster-select](/images/docs/web-kubectl/web-kubectl-cluster-select.png)

You can enter kubectl command in the web kubectl interface to query and operate Kubernetes cluster resources.

For example, execute the following command to query the status of all PVCs in the cluster.


```
kubectl get pvc --all-namespaces
```

![web-kubectl-example](/images/docs/web-kubectl/web-kubectl-example.png)

Use the following syntax to run kubectl commands from your terminal window:

```
kubectl [command] [TYPE] [NAME] [flags]
```

{{< notice note >}}
- Where `command`, `TYPE`, `NAME`, and `flags` are:
    - `command`: Specifies the operation that you want to perform on one or more resources, for example `create`, `get`, `describe`, `delete`.
    - `TYPE`: Specifies the [resource type](https://kubernetes.io/docs/reference/kubectl/overview/#resource-types). Resource types are case-insensitive and you can specify the singular, plural, or abbreviated forms.
    - `NAME`: Specifies the name of the resource. Names are case-sensitive. If the name is omitted, details for all resources are displayed, for example `kubectl get pods`.
    - `flags`: Specifies optional flags. For example, you can use the `-s` or `--server` flags to specify the address and port of the Kubernetes API server.
- If you need help, just run `kubectl help` from the terminal window, or refer to the [Kubernetes kubectl CLI documentation](https://kubernetes.io/docs/reference/kubectl/overview/).

{{</ notice >}}

