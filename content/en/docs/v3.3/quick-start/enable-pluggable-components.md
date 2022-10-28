---
title: "Enable Pluggable Components"
keywords: 'KubeSphere, Kubernetes, pluggable, components'
description: 'Install pluggable components of KubeSphere so that you can explore the container platform in an all-around way. Pluggable components can be enabled both before and after the installation.'
linkTitle: "Enable Pluggable Components"
weight: 2600
---

This tutorial demonstrates how to enable pluggable components of KubeSphere both before and after the installation. Refer to the table below for all pluggable components of KubeSphere.

| Configuration    | Component                             | Description                                                  |
| ---------------- | ------------------------------------- | ------------------------------------------------------------ |
| `alerting`       | KubeSphere Alerting System            | You can customize alerting policies for workloads and nodes. After an alerting policy is triggered, alert messages can be sent to your recipients through different channels (for example, email and Slack). |
| `auditing`       | KubeSphere Auditing Log System        | Provide a security-relevant chronological set of records, recording the sequence of activities that happen in the platform, initiated by different tenants. |
| `devops`         | KubeSphere DevOps System              | Provide an out-of-box CI/CD system based on Jenkins, and automated workflow tools including Source-to-Image and Binary-to-Image. |
| `events`         | KubeSphere Events System              | Provide a graphical web console for the exporting, filtering and alerting of Kubernetes events in multi-tenant Kubernetes clusters. |
| `logging`        | KubeSphere Logging System             | Provide flexible logging functions for log query, collection and management in a unified console. Additional log collectors can be added, such as Elasticsearch, Kafka and Fluentd. |
| `metrics_server` | HPA                                   | The Horizontal Pod Autoscaler automatically scales the number of Pods based on needs. |
| `networkpolicy`  | Network policy                        | Allow network isolation within the same cluster, which means firewalls can be set up between certain instances (Pods). |
| `kubeedge`       | KubeEdge                              | Add edge nodes to your cluster and run workloads on them.    |
| `openpitrix`     | KubeSphere App Store                  | Provide an app store for Helm-based applications and allow users to manage apps throughout the entire lifecycle. |
| `servicemesh`    | KubeSphere Service Mesh (Istio-based) | Provide fine-grained traffic management, observability and tracing, and visualized traffic topology. |
| `ippool`         | Pod IP Pool                           | Create Pod IP pools and assign IP addresses from the Pools to your Pods. |
| `topology`       | Service Topology                      | Integrate [Weave Scope](https://www.weave.works/oss/scope/) to view service-to-service communication (topology) of your apps and containers. |

For more information about each component, see [Overview of Enable Pluggable Components](../../pluggable-components/overview/).

{{< notice note >}}

- `multicluster` is not covered in this tutorial. If you want to enable this feature, you need to set a corresponding value for `clusterRole`. For more information, see [Multi-cluster Management](../../multicluster-management/).
- Make sure your machine meets the hardware requirements before the installation. Here is the recommendation if you want to enable all pluggable components: CPU ≥ 8 Cores, Memory ≥ 16 G, Disk Space ≥ 100 G.

{{</ notice >}}

## Enable Pluggable Components Before Installation

For most of the pluggable components, you can follow the steps below to enable them. If you need to enable [KubeEdge](../../pluggable-components/kubeedge/), [Pod IP Pools](../../pluggable-components/pod-ip-pools/) and [Service Topology](../../pluggable-components/service-topology/), refer to the corresponding tutorials directly.

### Installing on Linux

When you implement multi-node installation of KubeSphere on Linux, you need to create a configuration file, which lists all KubeSphere components.

1. In the tutorial of [Installing KubeSphere on Linux](../../installing-on-linux/introduction/multioverview/), you create a default file `config-sample.yaml`. Modify the file by executing the following command:

    ```bash
    vi config-sample.yaml
    ```

    {{< notice note >}}
If you adopt [All-in-one Installation](../../quick-start/all-in-one-on-linux/), you do not need to create a `config-sample.yaml` file as you can create a cluster directly. Generally, the all-in-one mode is for users who are new to KubeSphere and look to get familiar with the system. If you want to enable pluggable components in this mode (for example, for testing purpose), refer to the [following section](#enable-pluggable-components-after-installation) to see how pluggable components can be installed after installation.
    {{</ notice >}}

2. In this file, enable the pluggable components you want to install by changing `false` to `true` for `enabled`. Here is [the complete file](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md) for your reference. Save the file after you finish.

3. Create a cluster using the configuration file:

    ```bash
    ./kk create cluster -f config-sample.yaml
    ```

### Installing on Kubernetes

When you install KubeSphere on Kubernetes, you need to use [ks-installer](https://github.com/kubesphere/ks-installer/) by applying two YAML files as below.

1. First download the file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml) and edit it.

    ```bash
    vi cluster-configuration.yaml
    ```

2. To enable the pluggable component you want to install, change `false` to `true` for `enabled` under the component in this file.

3. Save this local file and execute the following commands to start the installation.

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml
    
    kubectl apply -f cluster-configuration.yaml
    ```

Whether you install KubeSphere on Linux or on Kubernetes, you can check the status of the components you have enabled in the web console of KubeSphere after installation. Go to **System Components**, and you can see the component status.

## Enable Pluggable Components After Installation

The KubeSphere web console provides a convenient way for users to view and operate on different resources. To enable pluggable components after installation, you only need to make few adjustments on the console directly. For those who are accustomed to the Kubernetes command-line tool, kubectl, they will have no difficulty in using KubeSphere as the tool is integrated into the console.

{{< notice note >}}

If you need to enable [KubeEdge](../../pluggable-components/kubeedge/), [Pod IP Pools](../../pluggable-components/pod-ip-pools/) and [Service Topology](../../pluggable-components/service-topology/), refer to the corresponding tutorials directly.

{{</ notice >}} 

1. Log in to the console as `admin`. Click **Platform** in the top-left corner and select **Cluster Management**.

2. Click **CRDs** and enter `clusterconfiguration` in the search bar. Click the result to view its detail page.

    {{< notice info >}}
A Custom Resource Definition (CRD) allows users to create a new type of  resources without adding another API server. They can use these  resources like any other native Kubernetes objects.
    {{</ notice >}}

3. In **Custom Resources**, click the three dots on the right of `ks-installer` and select **Edit YAML**.

4. In this YAML file, enable the pluggable components you want to install by changing `false` to `true` for `enabled`. After you finish, click **OK** to save the configuration.

5. You can use the web kubectl to check the installation process by executing the following command:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

    {{< notice tip >}}

You can find the web kubectl tool by clicking the hammer icon in the bottom-right corner of the console.

{{</ notice >}}

6. The output will display a message as below if the component is successfully installed.

    ```yaml
    #####################################################
    ###              Welcome to KubeSphere!           ###
    #####################################################
    
    Console: http://192.168.0.2:30880
    Account: admin
    Password: P@88w0rd
    
    NOTES：
      1. After you log into the console, please check the
         monitoring status of service components in
         "Cluster Management". If any service is not
         ready, please wait patiently until all components 
         are up and running.
      2. Please change the default password after login.
    
    #####################################################
    https://kubesphere.io             20xx-xx-xx xx:xx:xx
    #####################################################
    ```

7. In **System Components**, you can see the status of different components.

    {{< notice tip >}}

If you do not see relevant components in the above image, some Pods may not be ready yet. You can execute `kubectl get pod --all-namespaces` through kubectl to see the status of Pods.
    {{</ notice >}}
