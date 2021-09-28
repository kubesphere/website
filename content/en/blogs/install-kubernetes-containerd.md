---
title: 'Install Kubernetes 1.22 and containerd the Easy Way'
tag: 'Kubernetes, containerd'
keywords: 'Kubernetes, containerd, docker, installation'
description: 'Install Kubernetes and containerd in a Linux machine within minutes.'
createTime: '2021-09-29'
author: 'Feynman'
snapshot: '/images/blogs/en/kubekey-containerd/k8s-containerd.png'
---

![k8s-containerd](/images/blogs/en/kubekey-containerd/k8s-containerd.png)

[KubeKey](https://github.com/kubesphere/kubekey) is a lightweight and turn-key installer that supports the installation of Kubernetes, KubeSphere and related add-ons. Writtent in Go, KubeKey enables you to set up a Kubernetes cluster within minutes. In this blog, we will install Kubernetes 1.22 and [containerd](https://containerd.io/) in one command with KubeKey.

## Step 1: Prepare a Linux Machine

To get started with all-in-one installation, you only need to prepare one host according to the following requirements for hardware and operating system.

### Hardware Recommendations

<table>
  <tbody>
    <tr>
    <th width='320'>OS</th>
    <th>Minimum Requirements</th>
    </tr>
    <tr>
      <td><b>Ubuntu</b> <i>16.04</i>, <i>18.04</i></td>
      <td>2 CPU cores, 4 GB memory, and 40 GB disk space</td>
    </tr>
    <tr>
      <td><b>Debian</b> <i>Buster</i>, <i>Stretch</i></td>
      <td>2 CPU cores, 4 GB memory, and 40 GB disk space</td>
    </tr><tr>
    <td><b>CentOS</b> <i>7.x</i></td>
      <td>2 CPU cores, 4 GB memory, and 40 GB disk space</td>
    </tr><tr>
    <td><b>Red Hat Enterprise Linux 7</b></td>
      <td>2 CPU cores, 4 GB memory, and 40 GB disk space</td>
    </tr><tr>
    <td><b>SUSE Linux Enterprise Server 15/openSUSE Leap 15.2</b></td>
      <td>2 CPU cores, 4 GB memory, and 40 GB disk space</td>
    </tr>
  </tbody>
</table>

### Node requirements

- The node can be accessed through `SSH`.
- `sudo`/`curl`/`openssl` should be used.

### Dependency requirements

KubeKey can install Kubernetes and KubeSphere together. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the following list to see if you need to install relevant dependencies on your node in advance.

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

### Network and DNS requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in the cluster.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It is recommended that you turn off the firewall. For more information, see [Port Requirements](../../installing-on-linux/introduction/port-firewall/).
- Supported CNI plugins: Calico and Flannel. Others (such as Cilium and Kube-OVN) may also work but note that they have not been fully tested.

## Step 2: Download KubeKey

Perform the following steps to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or run the following command:

```bash
curl -L https://github.com/kubesphere/kubekey/releases/download/v1.2.0-alpha.4/kubekey-v1.2.0-alpha.4-linux-amd64.tar.gz > installer.tar.gz && tar -zxf installer.tar.gz
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -L https://github.com/kubesphere/kubekey/releases/download/v1.2.0-alpha.4/kubekey-v1.2.0-alpha.4-linux-amd64.tar.gz > installer.tar.gz && tar -zxf installer.tar.gz
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

## Step 3: Get Started with Installation

You only need to run one command for all-in-one installation. 

```bash
./kk create cluster --with-kubernetes v1.22.1 --container-manager containerd 
```

{{< notice note >}}

- Supported Kubernetes versions: v1.19.8, v1.20.4, v1.21.4, v1.22.1. If you do not specify a Kubernetes version, KubeKey installs Kubernetes v1.21.5 by default. For more information about supported Kubernetes versions, see [Support Matrix](https://github.com/kubesphere/kubekey/blob/master/docs/kubernetes-versions.md).
- For all-in-one installation, you do not need to change any configuration.
- KubeKey supports AMD64 and ARM64.

{{</ notice >}}

After you run the command, you will see a table for environment check. For details, see [Node requirements](#node-requirements) and [Dependency requirements](#dependency-requirements). Type `yes` to continue.

## Step 4: Verify the Installation

If the following information is displayed, Kubernetes is successfully installed.

```bash
INFO[00:40:00 CST] Congratulations! Installation is successful.
```

Run the following command to check the container runtime and Kubernetes version.

```bash
kubectl get node -o wide
NAME         STATUS   ROLES                         AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
i-mxtuejcj   Ready    control-plane,master,worker   45s   v1.22.1   192.168.6.2   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.4.9
```

Run the following command to check the Pod status.

```bash
kubectl get pod --all-namespaces
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-75ddb95444-6vgcm   1/1     Running   0          39s
kube-system   calico-node-knhhs                          1/1     Running   0          39s
kube-system   coredns-5495dd7c88-6w5gt                   1/1     Running   0          48s
kube-system   coredns-5495dd7c88-982kj                   1/1     Running   0          48s
kube-system   kube-apiserver-i-mxtuejcj                  1/1     Running   0          56s
kube-system   kube-controller-manager-i-mxtuejcj         1/1     Running   0          56s
kube-system   kube-proxy-6vlsj                           1/1     Running   0          48s
kube-system   kube-scheduler-i-mxtuejcj                  1/1     Running   0          64s
kube-system   nodelocaldns-7zqp2                         1/1     Running   0          48s
```

Congratulations! You have installed a sing-node Kubernetes cluster with containerd. For advanced usage of KubeKey, see [Installing on Linux — Overview](https://kubesphere.io/docs/installing-on-linux/introduction/intro/) for more information.