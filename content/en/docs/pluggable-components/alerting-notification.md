---
title: "KubeSphere Alerting and Notification"
keywords: "Kubernetes, alertmanager, KubeSphere, alerting, notification"
description: "How to Enable Alerting and Notification"

linkTitle: "KubeSphere Alerting and Notification"
weight: 3545
---

## What are KubeSphere Alerting and Notification

Alerting and Notification are two important building blocks of observability, closely related monitoring and logging. The alerting system in KubeSphere allows users to know activities of interest based on alert policies. When a predefined threshold of a certain metric is reached, an alert will be sent to preconfigured recipients, the notification method of which can be set by yourself, including Email, WeChat Work and Slack. This is extremely useful for enterprises to implement multi-tenant management and stringent security controls.

For more information, see Alerting Policy and Message.

{{< notice note >}}

It is recommended that you enable Alerting and Notification together so that users can receive notifications of alerts in time.

{{</ notice >}}

## Enable Alerting and Notification before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere-v3.netlify.app/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere-v3.netlify.app/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Alerting and Notification in this mode (e.g. for testing purpose), refer to the following section to see how Alerting and Notification can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `alerting` and `notification` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
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

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) for cluster setting. If you want to install Alerting and Notification, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](https://kubesphere-v3.netlify.app/docs/installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml). After that, to enable Alerting and Notification, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `alerting` and `notification` and enable them by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
alerting:
    enabled: true # Change "false" to "true"
notification:
    enabled: true # Change "false" to "true"
```

4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

## Enable Alerting and Notification after Installation

1. Log in the console as `admin`. Click **Platform** at the top left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `alerting` and `notification` and change `false` to `true` for `enabled`. After you finish, click **Update** at the bottom right corner to save the configuration.

```bash
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

You can find the web kubectl tool by clicking the hammer icon at the bottom right corner of the console.

{{</ notice >}}

## Verify the Installation of Component

{{< tabs >}}

{{< tab "Verify the Component in Dashboard" >}}

If you can see **Alerting Messages** and **Alerting Policies** in the image below, it means the installation succeeds as the two parts won't display until you install the component.

![alerting](https://ap3.qingstor.com/kubesphere-website/docs/20200901143123.png)

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

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