---
title: "KubeSphere Alerting and Notification"
keywords: "Kubernetes, alertmanager, KubeSphere, alerting, notification"
description: "How to enable Alerting and Notification"
linkTitle: "KubeSphere Alerting and Notification"
weight: 6600
---

## What are KubeSphere Alerting and Notification

Alerting and Notification are two important building blocks of observability, closely related to monitoring and logging. The alerting system in KubeSphere, coupled with the proactive failure notification system, allows users to know activities of interest based on alert policies. When a predefined threshold of a certain metric is reached, an alert will be sent to preconfigured recipients, the notification method of which can be set by yourself, including Email, WeChat Work and Slack. With a highly functional alerting and notification system in place, you can quickly identify and resolve potential issues in advance before they affect your business.

For more information, see [Alerting Policy](../../project-user-guide/alerting/alerting-policy) and [Alerting Message](../../project-user-guide/alerting/alerting-message).

{{< notice note >}}

It is recommended that you enable Alerting and Notification together so that users can receive notifications of alerts in time.

{{</ notice >}}

## Enable Alerting and Notification before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Alerting and Notification in this mode (e.g. for testing purposes), refer to [the following section](#enable-alerting-and-notification-after-installation) to see how Alerting and Notification can be installed after installation.
    {{</ notice >}}

2. In this file, navigate to `alerting` and `notification` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    alerting:
        enabled: true # Change "false" to "true"
    notification:
        enabled: true # Change "false" to "true"
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### **Installing on Kubernetes**

The process of installing KubeSphere on Kubernetes is same as stated in the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/) except the optional components Alerting and Notification need to be enabled first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and open it for editing.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, navigate to `alerting` and `notification` and enable them by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    alerting:
        enabled: true # Change "false" to "true"
    notification:
        enabled: true # Change "false" to "true"
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## Enable Alerting and Notification after Installation

1. Log in the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.
    
    ![clusters-management](/images/docs/enable-pluggable-components/kubesphere-alerting-and-notification/clusters-management.png)
    
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

    ![edit-yaml](/images/docs/enable-pluggable-components/kubesphere-alerting-and-notification/edit-yaml.png)

4. In this yaml file, navigate to `alerting` and `notification` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    alerting:
        enabled: true # Change "false" to "true"
    notification:
        enabled: true # Change "false" to "true"
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.
    {{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

If you can see **Alerting Messages** and **Alerting Policies** in the image below, it means the installation succeeds as the two parts won't display until you install the component.

![alerting](/images/docs/enable-pluggable-components/kubesphere-alerting-and-notification/alerting.png)

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Execute the following command to check the status of Pods:

```bash
kubectl get pod -n kubesphere-alerting-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                       READY   STATUS      RESTARTS   AGE
alerting-client-744c794979-xvsbz           1/1     Running     2          36m
alerting-db-ctrl-job-jwdsh                 0/1     Completed   0          36m
alerting-db-init-job-sj2nv                 0/1     Completed   0          36m
alerting-executor-59ff88f484-2l57d         2/2     Running     0          36m
alerting-manager-5dc9d6cd46-jshkw          1/1     Running     0          36m
alerting-watcher-dcb87b665-sm87b           1/1     Running     0          36m
notification-db-ctrl-job-phxsx             0/1     Completed   3          36m
notification-db-init-job-8q5rf             0/1     Completed   0          36m
notification-deployment-748897cbdf-2djpr   1/1     Running     0          36m
```

{{</ tab >}}

{{</ tabs >}}