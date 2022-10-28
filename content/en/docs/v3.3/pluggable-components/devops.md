---
title: "KubeSphere DevOps System"
keywords: "Kubernetes, Jenkins, KubeSphere, DevOps, cicd"
description: "Learn how to enable DevOps to further free your developers and let them focus on code writing."
linkTitle: "KubeSphere DevOps System"
weight: 6300
---

The KubeSphere DevOps System is designed for CI/CD workflows in Kubernetes. Based on [Jenkins](https://jenkins.io/), it provides one-stop solutions to help both development and Ops teams build, test and publish apps to Kubernetes in a straight-forward way. It also features plugin management, [Binary-to-Image (B2I)](../../project-user-guide/image-builder/binary-to-image/), [Source-to-Image (S2I)](../../project-user-guide/image-builder/source-to-image/), code dependency caching, code quality analysis, pipeline logging, and more.

The DevOps System offers an automated environment for users as apps can be automatically released to the same platform. It is also compatible with third-party private image registries (for example, Harbor) and code repositories (for example, GitLab/GitHub/SVN/BitBucket). As such, it creates excellent user experience by providing users with comprehensive, visualized CI/CD pipelines which are extremely useful in air-gapped environments.

For more information, see [DevOps User Guide](../../devops-user-guide/).

## Enable DevOps Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by running the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable DevOps in this mode (for example, for testing purposes), refer to [the following section](#enable-devops-after-installation) to see how DevOps can be installed after installation.
    {{</ notice >}}

2. In this file, search for `devops` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    devops:
      enabled: true # Change "false" to "true".
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable KubeSphere DevOps first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, search for `devops` and enable DevOps by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    devops:
      enabled: true # Change "false" to "true".
    ```

3. Run the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable DevOps After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-devops-system/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.
   
4. In this YAML file, search for `devops` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    devops:
      enabled: true # Change "false" to "true".
    ```

5. Use the web kubectl to check the installation process by running the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-devops-system/hammer.png" height="20px"> in the lower-right corner of the console.

{{</ notice >}}

## Verify the Installation of the Component

{{< tabs >}}

{{< tab "Verify the component on the dashboard" >}}

Go to **System Components** and check that all components on the **DevOps** tab page is in **Healthy** state.

{{</ tab >}}

{{< tab "Verify the component through kubectl" >}}

Run the following command to check the status of Pods:

```bash
kubectl get pod -n kubesphere-devops-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                          READY   STATUS    RESTARTS   AGE
devops-jenkins-5cbbfbb975-hjnll   1/1     Running   0          40m
s2ioperator-0                 1/1     Running   0          41m
```

{{</ tab >}}

{{</ tabs >}}
