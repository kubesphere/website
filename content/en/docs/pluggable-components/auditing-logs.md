---
title: "Enable Auditing Logs"
keywords: "Kubernetes, auditing, KubeSphere, logs"
description: "How to enable KubeSphere Auditing Log System"

linkTitle: "Enable Auditing Logs"
weight: 3525
---

## What are KubeSphere Auditing Logs?

KubeSphere Auditing Log System provides a security-relevant chronological set of records documenting the sequence of activities related to individual users, managers, or other components of the system. Each request to KubeSphere generates an event that is then written to a webhook and processed according to a certain rule.

For more information, see Logging, Events, and Auditing.

{{< notice note >}}

Logging needs to be installed first before you enable Auditing Logs.

{{</ notice >}} 

## Enable Auditing Logs before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere-v3.netlify.app/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere-v3.netlify.app/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable Auditing Logs in this mode (e.g. for testing purpose), refer to the following section to see how Auditing Logs can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `auditing` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
auditing:
    enabled: true # Change "false" to "true"
```

{{< notice warning >}}

`Logging` needs to be enabled in this file as well.

{{</ notice >}}

3. Create a cluster using the configuration file:

```bash
./kk create cluster -f config-sample.yaml
```

### **Installing on Kubernetes**

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) for cluster setting. If you want to install Auditing Logs, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](https://kubesphere-v3.netlify.app/docs/installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml). After that, to enable Auditing Logs, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `auditing` and enable Auditing Logs by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
auditing:
    enabled: true # Change "false" to "true"
```

{{< notice warning >}}

`Logging` needs to be enabled in this file as well.

{{</ notice >}}

4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

## Enable Auditing Logs after Installation

1. Log in the console as `admin`. Click **Platform** at the top left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `auditing` and change `false` to `true` for `enabled`. After you finish, click **Update** at the bottom right corner to save the configuration.

```bash
auditing:
    enabled: true # Change "false" to "true"
```

{{< notice warning >}}

`Logging` needs to be enabled in this file as well.

{{</ notice >}}

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

Go to **Components** and check the status of Logging. You may see an image as follows:

![auditing](https://ap3.qingstor.com/kubesphere-website/docs/20200829121140.png)

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

```bash
kubectl get pod -n kubesphere-logging-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                            READY   STATUS    RESTARTS   AGE
elasticsearch-logging-data-0                    1/1     Running   0          29m
elasticsearch-logging-data-1                    1/1     Running   0          27m
elasticsearch-logging-discovery-0               1/1     Running   0          29m
fluent-bit-djkwl                                1/1     Running   0          29m
fluent-bit-srswf                                1/1     Running   0          29m
fluent-bit-t92cc                                1/1     Running   0          29m
fluentbit-operator-5bf7687b88-gjlvc             1/1     Running   0          29m
kube-auditing-operator-7574bd6f96-wx7cp         1/1     Running   0          28m
kube-auditing-webhook-deploy-6dfb46bb6c-7ft7h   1/1     Running   0          27m
kube-auditing-webhook-deploy-6dfb46bb6c-86x62   1/1     Running   0          27m
logsidecar-injector-deploy-667c6c9579-k2htl     2/2     Running   0          28m
logsidecar-injector-deploy-667c6c9579-s6vcp     2/2     Running   0          28m
```

{{</ tab >}}

{{</ tabs >}}