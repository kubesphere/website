---
title: "KubeSphere DevOps System"
keywords: "Kubernetes, Jenkins, KubeSphere, DevOps, cicd"
description: "How to Enable KubeSphere DevOps System"

linkTitle: "KubeSphere DevOps System"
weight: 3520
---

## What is KubeSphere DevOps System

KubeSphere DevOps System is designed for CI/CD workflows in Kubernetes. Based on [Jenkins](https://jenkins.io/), it provides one-stop solutions to help both development and Ops teams build, test and publish apps to Kubernetes in a straight-forward way. It also features plugin management, Binary-to-Image (B2I), Source-to-Image (S2I), code dependency caching, code quality analysis, pipeline logging, etc.

The DevOps system offers an enabling environment for users as apps can be automatically released to the same platform. It is also compatible with third-party private image registries (e.g. Harbor) and code repositories (e.g. GitLab/GitHub/SVN/BitBucket). As such, it creates excellent user experiences by providing users with comprehensive, visualized CI/CD pipelines which are extremely useful in air-gapped environments.

For more information, see [DevOps User Guide](../../devops-user-guide/).

## Enable DevOps before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-one Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable DevOps in this mode (e.g. for testing purpose), refer to the following section to see how DevOps can be installed after installation.
    {{</ notice >}}

2. In this file, navigate to `devops` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    devops:
        enabled: true # Change "false" to "true"
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### **Installing on Kubernetes**

The process of installing KubeSphere on Kubernetes is same as stated in the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/) except the optional component DevOps needs to be enabled first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml) and open it for editing.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local cluster-configuration.yaml file, navigate to `devops` and enable DevOps by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    devops:
        enabled: true # Change "false" to "true"
    ```

3. Execute the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

    kubectl apply -f cluster-configuration.yaml
    ```

## Enable DevOps after Installation

1. Log in the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.
    ![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.
    ![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `devops` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

    ```yaml
    devops:
        enabled: true # Change "false" to "true"
    ```

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}
You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.
    {{</ notice >}}

## Verify the Installation of Component

{{< tabs >}}

{{< tab "Verify the Component in Dashboard" >}}

Go to **Components** and check the status of DevOps. You may see an image as follows:

![devops](https://ap3.qingstor.com/kubesphere-website/docs/20200829125245.png)

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

```bash
kubectl get pod -n kubesphere-devops-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                       READY   STATUS    RESTARTS   AGE
ks-jenkins-68b8949bb-jcvkt                 1/1     Running   0          1h3m
s2ioperator-0                              1/1     Running   1          1h3m
uc-jenkins-update-center-8c898f44f-hqv78   1/1     Running   0          1h14m
```

{{</ tab >}}

{{</ tabs >}}
