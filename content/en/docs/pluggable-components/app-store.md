---
title: "KubeSphere App Store"
keywords: "Kubernetes, KubeSphere, app-store, OpenPitrix"
description: "How to Enable KubeSphere App Store"

linkTitle: "KubeSphere App Store"
weight: 3515
---

## What is KubeSphere App Store

As an open-source and app-centric container platform, KubeSphere provides users with a Helm-based app store for application lifecycle management on the back of [OpenPitrix](https://github.com/openpitrix/openpitrix), an open-source web-based system to package, deploy and manage different types of apps. KubeSphere App Store allows ISVs, developers and users to upload, test, deploy and release apps with just several clicks in a one-stop shop.

Internally, KubeSphere App Store can serve as a place for different teams to share data, middleware, and office applications. Externally, it is conducive to setting industry standards of building and delivery. By default, there are 15 apps in the App Store. After you enable this feature, you can add more apps with app templates.

![app-store](https://ap3.qingstor.com/kubesphere-website/docs/20200828170503.png)

For more information, see App Store.

## Enable App Store before Installation

### Installing on Linux

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere.io/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable App Store in this mode (e.g. for testing purpose), refer to the following section to see how App Store can be installed after installation.

{{</ notice >}}

2. In this file, navigate to `openpitrix` and change `false` to `true` for `enabled`. Save the file after you finish.

```bash
openpitrix:
    enabled: true # Change "false" to "true"
```

3. Create a cluster using the configuration file:

```bash
./kk create cluster -f config-sample.yaml
```

### **Installing on Kubernetes**

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml) for cluster setting. If you want to install App Store, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](../../installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/kubesphere-installer.yaml). After that, to enable App Store, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/v3.0.0/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, navigate to `openpitrix` and enable App Store by changing `false` to `true` for `enabled`. Save the file after you finish.

```bash
openpitrix:
    enabled: true # Change "false" to "true"
```

4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

## Enable App Store after Installation

1. Log in the console as `admin`. Click **Platform** in the top-left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of resources without adding another API server. They can use these resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-yaml](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, navigate to `openpitrix` and change `false` to `true` for `enabled`. After you finish, click **Update** in the bottom-right corner to save the configuration.

```bash
openpitrix:
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

Go to **Components** and check the status of OpenPitrix. You may see an image as follows:

![openpitrix](https://ap3.qingstor.com/kubesphere-website/docs/20200829124018.png)

{{</ tab >}}

{{< tab "Verify the Component through kubectl" >}}

Execute the following command to check the status of pods:

```bash
kubectl get pod -n openpitrix-system
```

The output may look as follows if the component runs successfully:

```bash
NAME                                                READY   STATUS      RESTARTS   AGE
hyperpitrix-generate-kubeconfig-pznht               0/2     Completed   0          1h6m
hyperpitrix-release-app-job-hzdjf                   0/1     Completed   0          1h6m
openpitrix-hyperpitrix-deployment-fb76645f4-crvmm   1/1     Running     0          1h6m
```

{{</ tab >}}

{{</ tabs >}}
