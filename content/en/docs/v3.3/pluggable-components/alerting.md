---
title: "KubeSphere Alerting"
keywords: "Kubernetes, alertmanager, KubeSphere, alerting"
description: "Learn how to enable Alerting to identify any potential issues in advance before they take a toll on your business."
linkTitle: "KubeSphere Alerting"
weight: 6600
---

Alerting is an important building block of observability, closely related to monitoring and logging. The alerting system in KubeSphere, coupled with the proactive failure notification system, allows users to know activities of interest based on alerting policies. When a predefined threshold of a certain metric is reached, an alert will be sent to preconfigured recipients. Therefore, you need to configure the notification method beforehand, including Email, Slack, DingTalk, WeCom, and Webhook. With a highly functional alerting and notification system in place, you can quickly identify and resolve potential issues in advance before they affect your business.

## Enable Alerting Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Alerting in this mode (for example, for testing purposes), refer to [the following section](#enable-alerting-after-installation) to see how Alerting can be enabled after installation.
    {{</ notice >}}

2. In this file, navigate to `alerting` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    alerting:
      enabled: true # Change "false" to "true".
    ```
    
3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable Alerting first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `alerting` and enable it by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    alerting:
      enabled: true # Change "false" to "true".
    ```
    
3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable Alerting After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-alerting/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, navigate to `alerting` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    alerting:
      enabled: true # Change "false" to "true".
    ```
    
5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-alerting/hammer.png" height="20px"> in the lower-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

If you can see **Alerting Messages** and **Alerting Policies** on the **Cluster Management** page, it means the installation is successful as the two parts won't display until the component is installed.



