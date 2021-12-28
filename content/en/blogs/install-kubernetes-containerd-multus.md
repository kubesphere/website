---
title: 'Install Kubernetes 1.23, containerd, and Multus CNI the Easy Way'
tag: 'Kubernetes, KubeKey'
keywords: 'Kubernetes, containerd, docker, Multus CNI, '
description: 'Install Kubernetes 1.23, containerd, and Multus CNI in a Linux machine within minutes.'
createTime: '2021-12-26'
author: 'Feynman'
snapshot: '/images/blogs/en/kubekey-containerd/kubernetes-containerd-banner.png'
---

![k8s-containerd](/images/blogs/en/kubekey-containerd/kubernetes-containerd-banner.png)

[KubeKey](https://github.com/kubesphere/kubekey) is a lightweight and turn-key installer that supports the installation of Kubernetes, KubeSphere and related add-ons. Writtent in Go, KubeKey enables you to set up a Kubernetes cluster within minutes. 

Kubernetes 1.23 [was released on Dec 7](https://kubernetes.io/blog/2021/12/07/kubernetes-1-23-release-announcement/). KubeKey has supported the installation of the latest version Kubernetes in its v2.0.0 alpha release, and also brought some new features such as support for Multus CNI, Feature Gates, and easy-to-use air-gapped installation, etc. 

This blog will demonstrate how to install Kubernetes 1.23.0, [containerd](https://containerd.io/), and [Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) the easy way using KubeKey.

## Step 1: Prepare a Linux Machine

You need to prepare one or more hosts according to the following requirements for hardware and operating system. This blog uses a Linux server to start the all-in-one installation.

### Hardware Recommendations

<table>
  <tbody>
    <tr>
    <th width='320'>OS</th>
    <th>Minimum Requirements</th>
    </tr>
    <tr>
      <td><b>Ubuntu</b> <i>16.04</i>, <i>18.04</i></td>
      <td>2 CPU cores, 2 GB memory, and 40 GB disk space</td>
    </tr>
    <tr>
      <td><b>Debian</b> <i>Buster</i>, <i>Stretch</i></td>
      <td>2 CPU cores, 2 GB memory, and 40 GB disk space</td>
    </tr><tr>
    <td><b>CentOS</b> <i>7.x</i></td>
      <td>2 CPU cores, 2 GB memory, and 40 GB disk space</td>
    </tr><tr>
    <td><b>Red Hat Enterprise Linux 7</b></td>
      <td>2 CPU cores, 2 GB memory, and 40 GB disk space</td>
    </tr><tr>
    <td><b>SUSE Linux Enterprise Server 15/openSUSE Leap 15.2</b></td>
      <td>2 CPU cores, 2 GB memory, and 40 GB disk space</td>
    </tr>
  </tbody>
</table>

### Node requirements

- The node can be accessed through `SSH`.
- `sudo`/`curl`/`openssl` should be used.

### Dependency requirements

The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the following list to see if you need to install relevant dependencies on your node in advance.

<table>
  <tbody>
    <tr>
      <th>Dependency</th>
     <th>Kubernetes Version ≥ 1.18</th>
      <th>Kubernetes Version < 1.18</th>
    </tr>
    <tr>
      <td><code>socat</code></td>
     <td>Required</td> 
      <td>Optional but recommended</td> 
     </tr>
    <tr>
      <td><code>conntrack</code></td>
     <td>Required</td> 
      <td>Optional but recommended</td> 
    </tr><tr>
    <td><code>ebtables</code></td>
     <td>Optional but recommended</td> 
    <td>Optional but recommended</td> 
    </tr><tr>
    <td><code>ipset</code></td>
    <td>Optional but recommended</td> 
     <td>Optional but recommended</td> 
    </tr>
  </tbody>
</table>

In case you use a CentOS 7.7 server, you could install socat and conntrack using the following commands:

```
yum install socat
yum install conntrack-tool
```

### Network and DNS requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in the cluster.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It is recommended that you turn off the firewall. For more information, see [Port Requirements](../../docs/installing-on-linux/introduction/port-firewall/).
- Supported CNI plugins: Calico, Flannel, Cilium, Kube-OVN, and Multus CNI

## Step 2: Download KubeKey

Perform the following steps to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or run the following command:

```bash
curl -L https://github.com/kubesphere/kubekey/releases/download/v2.0.0-alpha.4/kubekey-v2.0.0-alpha.4-linux-amd64.tar.gz > installer.tar.gz && tar -zxf installer.tar.gz
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -L https://github.com/kubesphere/kubekey/releases/download/v2.0.0-alpha.4/kubekey-v2.0.0-alpha.4-linux-amd64.tar.gz > installer.tar.gz && tar -zxf installer.tar.gz
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the following steps.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

Make `kk` executable:

```bash
chmod +x kk
```

## Step 3: Enable the Multus CNI installation (Optional)

If you want to customize the installation, for example, enable the Multus CNI installation, you can create an example configuration file with default configurations.
Otherwise, you can skip this step.

```
./kk create config --with-kubernetes v1.23.0
```

A default file `config-sample.yaml` will be created if you do not change the name. Edit the file and here is an example of the configuration file of a Kubernetes cluster with one master node. You need to update the host information and enable Multus CNI. We use a single node for this demo, and you can also configure a multi-node Kubernetes cluster as you want. See [Multi-node installation](../../docs/installing-on-linux/introduction/multioverview/) for details.

```
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts: // updated the host template refer to this example
  - {name: master1, address: 192.168.0.5, internalAddress: 192.168.0.5, password: Qcloud@123}
  roleGroups:
    etcd:
    - master1
    master:
    - master1
    worker:
    - master1
  controlPlaneEndpoint:
    ##Internal loadbalancer for apiservers
    #internalLoadbalancer: haproxy

    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.23.0
    clusterName: cluster.local
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    # multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    enableMultusCNI: true // Change false to true to enable Multus CNI
```

## Step 4: Get Started with Installation

{{< tabs >}}

{{< tab "If you have enabled Multus CNI" >}}

You can run the following command to create a cluster using the configuration file.

```bash
./kk create cluster -f config-sample.yaml --container-manager containerd
```

{{</ tab >}}

{{< tab "If you skiped Multus CNI above" >}}

You only need to run one command for all-in-one installation.

```bash
./kk create cluster --with-kubernetes v1.23.0 --container-manager containerd
```

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

- Supported Kubernetes versions: v1.19.8, v1.20.4, v1.21.4, v1.22.1, v1.23.0. If you do not specify a Kubernetes version, KubeKey installs Kubernetes v1.21.5 by default. For more information about supported Kubernetes versions, see [Support Matrix](https://github.com/kubesphere/kubekey/blob/master/docs/kubernetes-versions.md).
- KubeKey supports AMD64 and ARM64.

{{</ notice >}}

After you run the command, you will see a table for environment check. For details, see [Node requirements](#node-requirements) and [Dependency requirements](#dependency-requirements). Type `yes` to continue.

## Step 5: Verify the Installation

If the following information is displayed, Kubernetes is successfully installed.

```bash
INFO[00:40:00 CST] Congratulations! Installation is successful.
```

Run the following command to check the container runtime and Kubernetes version.

```bash
$ kubectl get node -o wide
NAME         STATUS   ROLES                         AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
i-a26jzcsm   Ready    control-plane,master,worker   7h56m   v1.23.0   192.168.0.5   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.4.9
```

Run the following command to check the Pod status.

```bash
kubectl get pod -A
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-64d69886fd-c5qd9   1/1     Running   0          7h57m
kube-system   calico-node-lc4fg                          1/1     Running   0          7h57m
kube-system   coredns-7c94484977-nvrdf                   1/1     Running   0          7h57m
kube-system   coredns-7c94484977-rtc24                   1/1     Running   0          7h57m
kube-system   kube-apiserver-i-a26jzcsm                  1/1     Running   0          7h57m
kube-system   kube-controller-manager-i-a26jzcsm         1/1     Running   0          7h57m
kube-system   kube-multus-ds-btb42                       1/1     Running   0          7h30m
kube-system   kube-proxy-bntt9                           1/1     Running   0          7h57m
kube-system   kube-scheduler-i-a26jzcsm                  1/1     Running   0          7h57m
kube-system   nodelocaldns-zmx9t                         1/1     Running   0          7h57m
```

Congratulations! You have installed a sing-node Kubernetes 1.23.0 cluster with containerd and Multus CNI. For advanced usage of KubeKey, see [Installing on Linux — Overview](https://kubesphere.io/docs/installing-on-linux/introduction/intro/) for more information.