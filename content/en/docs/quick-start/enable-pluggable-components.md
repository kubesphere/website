---
title: "Enable Pluggable Components"
keywords: 'KubeSphere, Kubernetes, pluggable, components'
description: 'Enable Pluggable Components'

linkTitle: "Enable Pluggable Components"
weight: 3060
---

This tutorial demonstrates how to enable pluggable components of KubeSphere both before and after the installation. KubeSphere features ten pluggable components which are listed below.

| Configuration Item | Corresponding Component               | Description                                                  |
| ------------------ | ------------------------------------- | ------------------------------------------------------------ |
| alerting           | KubeSphere alerting system            | Enable users to customize alerting policies to send messages to receivers in time with different time intervals and alerting levels to choose from. |
| auditing           | KubeSphere audit log system           | Provide a security-relevant chronological set of records, recording the sequence of activities that happen in the platform, initiated by different tenants. |
| devops             | KubeSphere DevOps system              | Provide an out-of-box CI/CD system based on Jenkins, and automated workflow tools including Source-to-Image and Binary-to-Image. |
| events             | KubeSphere events system              | Provide a graphical web console for the exporting, filtering and alerting of Kubernetes events in multi-tenant Kubernetes clusters. |
| logging            | KubeSphere logging system             | Provide flexible logging functions for log query, collection and management in a unified console. Additional log collectors can be added, such as Elasticsearch, Kafka and Fluentd. |
| metrics_server     | HPA                                   | The Horizontal Pod Autoscaler automatically scales the number of pods based on needs. |
| networkpolicy      | Network policy                        | Allow network isolation within the same cluster, which means firewalls can be set up between certain instances (Pods). |
| notification       | KubeSphere notification system        | Allow users to set `AlertManager` as its sender. Receivers include Email, WeChat Work, and Slack. |
| openpitrix         | KubeSphere App Store                  | Provide an app store for Helm-based applications and allow users to manage apps throughout the entire lifecycle. |
| servicemesh        | KubeSphere Service Mesh (Istio-based) | Provide fine-grained traffic management, observability and tracing, and visualized traffic topology. |

For more information about each component, see Overview of Enable Pluggable Components.

{{< notice note >}}

- By default, the above components are not enabled except `metrics_server`. In some cases, you need to manually disable it by changing `true` to `false` in the configuration. This is because the component may already be installed in your environment, especially for cloud-hosted Kubernetes clusters.
- `multicluster` is not covered in this tutorial. If you want to enable this feature, you need to set a corresponding value for `clusterRole`. For more information, see [Multi-cluster Management](https://kubesphere.io/docs/multicluster-management/).
- Make sure your machine meets the hardware requirements before the installation. Here is the recommendation if you want to enable all pluggable components: CPU ≥ 8 Cores, Memory ≥ 16 G, Disk Space ≥ 100 G.

{{</ notice >}}

## Enable Pluggable Components before Installation

### **Installing on Linux**

When you install KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/), you create a default file **config-sample.yaml**. Modify the file by executing the following command:

```bash
vi config-sample.yaml
```

{{< notice note >}}

If you adopt [All-in-one Installation](https://kubesphere.io/docs/quick-start/all-in-one-on-linux/), you do not need to create a config-sample.yaml file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable pluggable components in this mode (e.g. for testing purpose), refer to the following section to see how pluggable components can be installed after installation.

{{</ notice >}} 

2. In this file, enable the pluggable components you want to install by changing `false` to `true` for `enabled`. Here is [an example file](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md) for your reference. Save the file after you finish.
3. Create a cluster using the configuration file:

```bash
./kk create cluster -f config-sample.yaml
```

### Installing on Kubernetes

When you install KubeSphere on Kubernetes, you need to download the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) for cluster setting. If you want to install pluggable components, do not use `kubectl apply -f` directly for this file.

1. In the tutorial of [Installing KubeSphere on Kubernetes](https://kubesphere.io/docs/installing-on-kubernetes/introduction/overview/), you execute `kubectl apply -f` first for the file [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml). After that, to enable pluggable components, create a local file cluster-configuration.yaml.

```bash
vi cluster-configuration.yaml
```

2. Copy all the content in the file [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) and paste it to the local file just created.
3. In this local cluster-configuration.yaml file, enable the pluggable components you want to install by changing `false` to `true` for `enabled`. Here is [an example file](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml) for your reference. Save the file after you finish.
4. Execute the following command to start installation:

```bash
kubectl apply -f cluster-configuration.yaml
```

Whether you install KubeSphere on Linux or on Kubernetes, you can check the status of the components you have enabled in the web console of KubeSphere after installation. Go to **Components**, and you can see an image below:

![KubeSphere-components](https://ap3.qingstor.com/kubesphere-website/docs/20200828145506.png)

## Enable Pluggable Components after Installation

KubeSphere web console provides a convenient way for users to view and operate on different resources. To enable pluggable components after installation, you only need to make few adjustments in the console directly. For those who are accustomed to the Kubernetes command-line tool, kubectl, they will have no difficulty in using KubeSphere as the tool is integrated into the console.

1. Log in the console as `admin`. Click **Platform** at the top left corner and select **Clusters Management**.

![clusters-management](https://ap3.qingstor.com/kubesphere-website/docs/20200828111130.png)

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detailed page.

![crds](https://ap3.qingstor.com/kubesphere-website/docs/20200828111321.png)

{{< notice info >}}

A Custom Resource Definition (CRD) allows users to create a new type of  resources without adding another API server. They can use these  resources like any other native Kubernetes objects.

{{</ notice >}}

3. In **Resource List**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

![edit-ks-installer](https://ap3.qingstor.com/kubesphere-website/docs/20200827182002.png)

4. In this yaml file, enable the pluggable components you want to install by changing `false` to `true` for `enabled`. After you finish, click **Update** to save the configuration.

![enable-components](https://ap3.qingstor.com/kubesphere-website/docs/20200828112036.png)

5. You can use the web kubectl to check the installation process by executing the following command:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}}

You can find the web kubectl tool by clicking the hammer icon at the bottom right corner of the console. 

{{</ notice >}}

6. The output will display a message as below if the component is successfully installed.

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.2:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are ready.
  2. Please modify the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

7. In **Components**, you can see the status of different components.

![components](https://ap3.qingstor.com/kubesphere-website/docs/20200828115111.png)

{{< notice tip >}}

If you do not see relevant components in the above image, some pods may not be ready yet. You can execute `kubectl get pod --all-namespaces` through kubectl to see the status of pods.

{{</ notice >}}