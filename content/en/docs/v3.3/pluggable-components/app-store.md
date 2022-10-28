---
title: "KubeSphere App Store"
keywords: "Kubernetes, KubeSphere, app-store, OpenPitrix"
description: "Learn how to enable the KubeSphere App Store to share data and apps internally and set industry standards of delivery process externally."
linkTitle: "KubeSphere App Store"
weight: 6200
---

As an open-source and app-centric container platform, KubeSphere provides users with a Helm-based App Store for application lifecycle management on the back of [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source web-based system to package, deploy and manage different types of apps. The KubeSphere App Store allows ISVs, developers, and users to upload, test, install, and release apps with just several clicks in a one-stop shop.

Internally, the KubeSphere App Store can serve as a place for different teams to share data, middleware, and office applications. Externally, it is conducive to setting industry standards of building and delivery. After you enable this feature, you can add more apps with app templates.

For more information, see [App Store](../../application-store/).

## Enable the App Store Before Installation

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by running the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-One Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable the App Store in this mode (for example, for testing purposes), refer to [the following section](#enable-app-store-after-installation) to see how the App Store can be installed after installation.
    {{</ notice >}}

2. In this file, search for `openpitrix` and change `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    openpitrix:
      store:
        enabled: true # Change "false" to "true".
    ```

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

As you [install KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you can enable the KubeSphere App Store first in the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) file.

1. Download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. In this local `cluster-configuration.yaml` file, search for `openpitrix` and enable the App Store by changing `false` to `true` for `enabled`. Save the file after you finish.

    ```yaml
    openpitrix:
      store:
        enabled: true # Change "false" to "true".
    ```

3. Run the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

## Enable the App Store After Installation

1. Log in to the console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.
   
2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Custom Resources**, click <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-app-store/three-dots.png" height="20px"> on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, search for `openpitrix` and change `false` to `true` for `enabled`. After you finish, click **OK** in the lower-right corner to save the configuration.

    ```yaml
    openpitrix:
      store:
        enabled: true # Change "false" to "true".
    ```

5. Use the web kubectl to check the installation process by running the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice note >}}

You can find the web kubectl tool by clicking <img src="/images/docs/v3.3/enable-pluggable-components/kubesphere-app-store/hammer.png" height="20px"> in the lower-right corner of the console.

{{</ notice >}}

## Verify the Installation of the Component

After you log in to the console, if you can see **App Store** in the upper-left corner and apps in it, it means the installation is successful.

{{< notice note >}}

- You can even access the App Store without logging in to the console by visiting `<Node IP Address>:30880/apps`.
- The **OpenPitrix** tab in KubeSphere 3.3 does not appear on the **System Components** page after the App Store is enabled.

{{</ notice >}} 

## Use the App Store in a Multi-cluster Architecture

[In a multi-cluster architecture](../../multicluster-management/introduction/kubefed-in-kubesphere/), you have one Host Cluster (H Cluster) managing all Member Clusters (M Clusters). Different from other components in KubeSphere, the App Store serves as a global application pool for all clusters, including H Cluster and M Clusters. You only need to enable the App Store on the H Cluster and you can use functions related to the App Store on M Clusters directly (no matter whether the App Store is enabled on M Clusters or not), such as [App Templates](../../project-user-guide/application/app-template/) and [App Repositories](../../workspace-administration/app-repository/import-helm-repository/).

However, if you only enable the App Store on M Clusters without enabling it on the H Cluster, you will not be able to use the App Store on any cluster in the multi-cluster architecture.
