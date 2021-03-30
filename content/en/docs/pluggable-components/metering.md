---
title: "KubeSphere Metering"
keywords: "Kubernetes, KubeSphere, metering"
description: "Learn how to enable KubeSphere Metering to view resource consumption in your cluster."
linkTitle: "KubeSphere Metering"
weight: 6925
---

## What is KubeSphere Metering

KubeSphere Metering helps you track information about resource usage at different levels, such as workspaces and projects. The metering information currently contains major resources in your cluster, including CPU, memory and storage. Besides, after you set the price information of different resources, you can see your billing data as well, the billing cycle of which can be customized.

## Enable KubeSphere Metering before Installation

### **Installing on Kubernetes**

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeSphere Metering first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, manually add the following content to enable metering.

    ```yaml
    metering:
      enabled: true
    ```

    {{< notice note >}}

`metering` needs to be aligned with other pluggable components in the YAML file.

{{</ notice >}} 

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## Enable KubeSphere Metering after Installation

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.
   
4. In this YAML file, manually add the following content to enable KubeSphere Metering. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    metering:
      enabled: true
    ```

    {{< notice note >}}

    `metering` needs to be aligned with other pluggable components in the YAML file.

    {{</ notice >}} 

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

Click the hammer icon in the bottom-right corner and verify that the section **Metering and Billing** has appeared.

![metering](/images/docs/enable-pluggable-components/kubesphere-metering/metering.png)


