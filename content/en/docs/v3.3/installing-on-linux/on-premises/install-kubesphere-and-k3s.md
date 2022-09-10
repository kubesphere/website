---
title: "Deploy K3s and KubeSphere"
keywords: 'Kubernetes, KubeSphere, K3s'
description: 'Learn how to use KubeKey to install K3s and KubeSphere.'
linkTitle: "Deploy K3s and KubeSphere"
weight: 3530
---

[K3s](https://k3s.io/) is a lightweight Kubernetes distribution built for IoT and edge computing with external dependencies minimized. It is packaged as a single binary that reduces the dependencies and steps that are required to set up a Kubernetes cluster.

You can use KubeKey to install both K3s and KubeSphere while KubeSphere can also be deployed on an existing K3s cluster.

{{< notice note >}} 

Currently, KubeSphere on K3s is only for testing and development as some features have not been fully tested.

{{</ notice >}} 

## Prerequisites

- For information about the prerequisites for K3s installation, see [the K3s documentation](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/).
- You may need to create necessary firewall rules or port forwarding rules depending on your environment. For more information, see [Port Requirements](../../../installing-on-linux/introduction/port-firewall/).

## Step 1: Download KubeKey

Follow the step below to download [KubeKey](../../../installing-on-linux/introduction/kubekey/).

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v2.2.2 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.2.2) of KubeKey. Note that an earlier version of KubeKey cannot be used to install K3s.

{{</ notice >}}

Make `kk` executable:

```bash
chmod +x kk
```

## Step 2: Create a Cluster

1. Create a configuration file of your cluster by running the following command:

   ```bash
   ./kk create config --with-kubernetes v1.21.4-k3s --with-kubesphere v3.3.0
   ```

   {{< notice note >}}

   KubeKey v2.2.2 supports the installation of K3s v1.21.4.

   {{</ notice >}} 

2. A default file `config-sample.yaml` will be created if you do not customize the name. Edit the file.

   ```bash
   vi config-sample.yaml
   ```

   ```yaml
   ...
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
     - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
     - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
     roleGroups:
       etcd:
       - master
       control-plane:
       - master
       worker:
       - node1
       - node2
     controlPlaneEndpoint:
       domain: lb.kubesphere.local
       address: ""
       port: 6443
     kubernetes:
       version: v1.21.4-k3s
       imageRepo: kubesphere
       clusterName: cluster.local
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
     registry:
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ...
   ```

   {{< notice note >}}

   For more information about each field in the configuration file, see [an example file](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md).

   {{</ notice >}} 

3. Save the file and execute the following command to install K3s and KubeSphere:

   ```
   ./kk create cluster -f config-sample.yaml
   ```

4. When the installation finishes, you can inspect installation logs with the following command:

   ```bash
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
   ```

   Expected output:

   ```bash
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


5. Access the KubeSphere console at `<NodeIP>:30880` with the default account and password (`admin/P@88W0rd`).

{{< notice note >}}

You can enable pluggable components of KubeSphere after the installation while some features may not be compatible as KubeSphere on K3s is only experimental currently.

{{</ notice >}} 