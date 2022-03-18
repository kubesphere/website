---
title: 'Visualize Network Traffic: A Simple Way to Enable Cilium on Kubernetes'
keywords: Kubernetes, KubeSphere, Cilium, Network
description: Explore what Cilium can do on a Kubernetes cluster.
tag: 'Kubernetes, KubeSphere, Cilium, Network'
createTime: '2021-07-19'
author: 'Rui Yao, Felix'
snapshot: '/images/blogs/en/cilium-as-cni/cilium-arch.png'
---

## What Is Cilium

[Cilium](https://cilium.io/) is an open-source project focusing on container network. It can be deployed on container platforms to transparently secure the network connection and load balancing between application workloads, such as application containers or processes. 

Running on Layer 3 and Layer 4, Cilium provides conventional network and security services. It also runs on Layer 7 to secure the use of modern application protocols, such as HTTP, gRPC, and Kafka. Cilium can be integrated into popular container orchestration frameworks such as Kubernetes and Mesos.

Based on a new Linux kernel technology called eBPF, Cilium enables the dynamic insertion of powerful security visibility and control logic within Linux itself. Because eBPF runs inside the Linux kernel, Cilium security policies can be applied and updated without any changes to the application code or container configuration.

![cilium-arch](/images/blogs/en/cilium-as-cni/cilium-arch.png)

In this blog, I'll try to explore Cilium as the CNI (Container Network Interface) on a Kubernetes cluster. If you are interested in the performance details about Cilium, check out [CNI Benchmark: Understanding Cilium Network Performance](https://cilium.io/blog/2021/05/11/cni-benchmark).

## What is KubeKey

Developed in Go, KubeKey is a lightweight installer that provides an easy and flexible way to install Kubernetes and KubeSphere. With KubeKey, you can install either Kubernetes only or Kubernetes and KubeSphere both. 

The scenarios where you can use KubeKey:

- Install Kubernetes only.
- Install Kubernetes and KubeSphere together using one command.
- Scale a cluster.
- Upgrade a cluster.
- Install Kubernetes-related add-ons (Chart or YAML).

Currently, KubeKey supports the installation of Cilium on Kubernetes clusters, which makes the deployment process simpler and more efficient. 

## Install Cilium on a Kubernetes Cluster

### System requirements

Before installing Cilium, you have to ensure that your system meets the minimum requirements. For example, the Linux kernel version of your host system must be 4.9.17 and later if you run Cilium using the container image `cilium/cilium`.

For more information about system requirements, check out [Cilium system requirements](https://docs.cilium.io/en/v1.10/operations/system_requirements/). 

### Host preparations

In this blog, let's use a Ubuntu Server 20.04.1 LTS 64bit as an example.

| Name  | IP Address  | Role                 |
| ----- | ----------- | -------------------- |
| node1 | 192.168.2.2 | etcd, master, worker |

For more information about Linux compatibility, check out [Linux Distribution Compatibility Matrix](https://docs.cilium.io/en/v1.10/operations/system_requirements/#linux-distribution-compatibility-matrix).

### Install KubeKey

1. Run the following command to get KubeKey:

   ```bash
   sudo wget https://github.com/kubesphere/kubekey/releases/download/v1.1.0/kubekey-v1.1.0-linux-64bit.deb
   ```

2. Run the following command to install KubeKey:

   ```bash
   sudo dpkg -i kubekey-v1.1.0-linux-64bit.deb
   ```

### Generate a configuration file

1. Run the following command to generate a configuration file:

   ```bash
   sudo kk create config --with-kubernetes v1.19.8
   ```

2. After the configuration file is generated, run the following command to configure `spec.hosts` and set `spec.network.plugin` to `cilium`:

   ```bash
   sudo vi config-sample.yaml
   ```

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     - {name: node1, address: 192.168.2.2, internalAddress: 192.168.2.2, user: ubuntu, password: ********}
     roleGroups:
       etcd:
       - node1
       master:
       - node1
       worker:
       - node1
     controlPlaneEndpoint:
       domain: lb.kubesphere.local
       address: ""
       port: 6443
     kubernetes:
       version: v1.19.8
       imageRepo: kubesphere
       clusterName: cluster.local
     network:
       plugin: cilium
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
     registry:
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```

### Deploy a Kubernetes cluster with KubeSphere installed

1. Run the following command to deploy dependencies:

   ```bash
   sudo kk init os -f config-sample.yaml
   ```

2. After the dependencies are deployed, run the following command to deploy Kubernetes and KubeSphere together:

   ```bash
   sudo kk create cluster -f config-sample.yaml --with-kubesphere v3.2.1
   ```

3. Wait for a while and you will see prompts similar to the following example if the installation is successful:

   ```bash
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://192.168.2.2:30880
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

### Check Cilium Pods

1. Log in to KubeSphere using the default username and password (`admin`/`P@88w0rd`).

   ![login](/images/blogs/en/cilium-as-cni/login.png)

2. Click **Platform** in the upper-left corner and select **Cluster Management**.

3. In the left navigation pane, select **Application Workloads** > **Pods**, select `kube-system` from the drop-down list, enter `cilium` in the search box, and press **Enter**. The Cilium Pods will be displayed in the list.

   ![cilium-pods](/images/blogs/en/cilium-as-cni/cilium-pods.png)

### Install the Hubble UI

Hubble is designed for network visualization. Through the eBPF data paths provided by Cilium, Hubble enables deep visibility into the network traffic of applications and services running on Kubernetes. You can use the Hubble CLI or UI tools to realize quick interactive diagnoses of issues like DNS-related ones. In addition to Hubble's own monitoring tools, you can also extend your monitoring policies by integrating other popular cloud-native monitoring system such as Prometheus and Grafana.

1. Hover your cursor over <img src="/images/blogs/en/cilium-as-cni/hammer.png" width="20px"> and select **Kubectl**.

   ![kubectl](/images/blogs/en/cilium-as-cni/kubectl.png)

2. In the displayed dialog box, run the following command to install Hubble:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/cilium/cilium/v1.8/install/kubernetes/experimental-install.yaml
   ```

   ![hubble-installed](/images/blogs/en/cilium-as-cni/hubble-installed.png)

3. On the **Pods** page, select `kube-system` from the drop-down list, enter `hubble` in the search box, and press **Enter**. The Hubble Pods will be displayed in the list.

   ![hubble-pods](/images/blogs/en/cilium-as-cni/hubble-pods.png)

### Create a demo Service

1. Run the following command on your host machine to create a demo Service:

   ```bash
   kubectl create -f https://raw.githubusercontent.com/cilium/cilium/1.9.7/examples/minikube/http-sw-app.yaml -n default
   ```

   ![demo-service](/images/blogs/en/cilium-as-cni/demo-service.png)

2. Run the following commands to access the demo resources:

   ```bash
   $ kubectl exec xwing -n default -- curl -s -XPOST deathstar.default.svc.cluster.local/v1/request-landing
   Ship landed
   $ kubectl exec tiefighter -n default -- curl -s -XPOST deathstar.default.svc.cluster.local/v1/request-landing
   Ship landed
   ```

   ![get-demo](/images/blogs/en/cilium-as-cni/get-demo.png)

3. On the **Services** page of KubeSphere console, select `kube-system` from the drop-down list, enter `hubble` in the search box, and press **Enter**. Click <img src="/images/blogs/en/cilium-as-cni/three-dots.png" width="20px"> on the right of `hubble-ui` and select **Edit Internet Access**.

   ![edit-access](/images/blogs/en/cilium-as-cni/edit-access.png)

4. Set **Access Method** to **NodePort** and click **OK**.

   ![nodeport](/images/blogs/en/cilium-as-cni/nodeport.png)

5. Now, you can view the graphical service map on the Hubble dashboard.

   ![hubble-ui](/images/blogs/en/cilium-as-cni/hubble-ui.png)

   {{< notice note >}}

   You would need to configure traffic forwarding and firewall policies in your infrastructure environment before accessing the Hubble dashboard.

   {{</ notice >}}

If you want to enable network visualization on Layer 7, you have to add annotations to your target Pods. Find out more in [Layer 7 Protocol Visibility](https://docs.cilium.io/en/stable/policy/visibility/).

## Recap

Based on my own experience in using Cilium, it can meet the requirements in most container network use cases. Moreover, Hubble realizes the visualization of data plane in a cloud-native manner, which is much better than Istio. I believe that Cilium will become the network solution that is used by most people among Kubernetes communities before long.

