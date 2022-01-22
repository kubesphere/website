---
title: "Web Kubectl"
keywords: 'KubeSphere, Kubernetes, kubectl, cli'
description: 'The web kubectl tool is integrated into KubeSphere to provide consistent user experiences for Kubernetes users.'
linkTitle: "Web Kubectl"
weight: 15500
---

The Kubernetes command-line tool, kubectl, allows you to run commands on Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, view logs, and more.

KubeSphere provides web kubectl on the console for user convenience. By default, in the current version, only the account granted the `platform-admin` role (such as the default account `admin`) has the permission to use web kubectl for cluster resource operation and management.

This tutorial demonstrates how to use web kubectl to operate on and manage cluster resources.

## Use Web Kubectl

1. Log in to KubeSphere with a user granted the `platform-admin` role, hover over the **Toolbox** in the lower-right corner and select **Kubectl**.

2. You can see the kubectl interface in the pop-up window. If you have enabled the multi-cluster feature, you need to select the target cluster first from the drop-down list in the upper-right corner. This drop-down list is not visible if the multi-cluster feature is not enabled.

3. Enter kubectl commands in the command-line tool to query and manage Kubernetes cluster resources. For example, execute the following command to query the status of all PVCs in the cluster.

    ```bash
    kubectl get pvc --all-namespaces
    ```

    ![web-kubectl-example](/images/docs/web-kubectl/web-kubectl-example.png)

4. Use the following syntax to run kubectl commands from your terminal window:

    ```bash
    kubectl [command] [TYPE] [NAME] [flags]
    ```

    {{< notice note >}}

- Where `command`, `TYPE`, `NAME`, and `flags` are:
  - `command`: Specifies the operation that you want to perform on one or more resources, such as `create`, `get`, `describe` and `delete`.
  - `TYPE`: Specifies the [resource type](https://kubernetes.io/docs/reference/kubectl/overview/#resource-types). Resource types are case-insensitive and you can specify the singular, plural, or abbreviated forms.
  - `NAME`: Specifies the name of the resource. Names are case-sensitive. If the name is omitted, details for all resources are displayed, such as `kubectl get pods`.
  - `flags`: Specifies optional flags. For example, you can use the `-s` or `--server` flags to specify the address and port of the Kubernetes API server.
- If you need help, run `kubectl help` from the terminal window or refer to the [Kubernetes kubectl CLI documentation](https://kubernetes.io/docs/reference/kubectl/overview/).

    {{</ notice >}}
