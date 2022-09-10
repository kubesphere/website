---
title: "All-in-One Installation of Kubernetes and KubeSphere on Linux"
keywords: 'KubeSphere, Kubernetes, All-in-One, Installation'
description: 'Install KubeSphere on Linux with a minimal installation package. The tutorial serves as a basic kick-starter for you to understand the container platform, paving the way for learning the following guides.'
linkTitle: "All-in-One Installation on Linux"
weight: 2100,
showSubscribe: true
---

For those who are new to KubeSphere and looking for a quick way to discover the [container platform](https://kubesphere.io/), the all-in-one mode is your best choice to get started. It features rapid deployment and hassle-free configurations with KubeSphere and Kubernetes all provisioned on your machine.

## Video Demonstration

{{< youtube PtVQZVb3AgE >}}

## Step 1: Prepare a Linux Machine

To get started with all-in-one installation, you only need to prepare one host according to the following requirements for hardware and operating system.

### Hardware recommendations

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

{{< notice note >}}

The preceding system requirements and the following instructions are for the default minimal installation without any pluggable components enabled. If your machine has at least 8 CPU cores and 16 GB memory, it is recommended that you enable all components. For more information, see [Enable Pluggable Components](../../pluggable-components/).

{{</ notice >}}

### Node requirements

- The node can be accessed through `SSH`.
- `sudo`/`curl`/`openssl`/`tar` should be used.

### Container runtimes

Your cluster must have an available container runtime. If you use KubeKey to set up a cluster, KubeKey installs the latest version of Docker by default. Alternatively, you can manually install Docker or other container runtimes before you create a cluster.

<table>
  <tbody>
    <tr>
      <th width='500'>Supported Container Runtime</th>
      <th>Version</th>
    </tr>
    <tr>
      <td>Docker</td>
      <td>19.3.8 +</td>
    </tr>
    <tr>
      <td>containerd</td>
      <td>Latest</td>
    </tr><tr>
      <td>CRI-O (experimental, not fully tested)</td>
      <td>Latest</td>
    </tr><tr>
      <td>iSula (experimental, not fully tested)</td>
      <td>Latest</td>
    </tr>
  </tbody>
</table>

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

{{< notice info >}}

Developed in Go, KubeKey represents a brand-new installation tool as a replacement for the ansible-based installer used before. KubeKey provides users with flexible installation choices, as they can install KubeSphere and Kubernetes separately or install them at one time, which is convenient and efficient.

{{</ notice >}}

### Network and DNS requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in the cluster.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It is recommended that you turn off the firewall. For more information, see [Port Requirements](../../installing-on-linux/introduction/port-firewall/).
- Supported CNI plugins: Calico and Flannel. Others (such as Cilium and Kube-OVN) may also work but note that they have not been fully tested.

{{< notice tip >}}

- It is recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- It is recommended that a registry mirror (a booster) be prepared if you have trouble downloading images from `dockerhub.io`. For more information, see [Configure a Booster for Installation](../../faq/installation/configure-booster/).

{{</ notice >}}

## Step 2: Download KubeKey

Perform the following steps to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or run the following command:

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

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the following steps.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v2.2.2) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

## Step 3: Get Started with Installation

You only need to run one command for all-in-one installation. The template is as follows:

```bash
./kk create cluster [--with-kubernetes version] [--with-kubesphere version]
```

To create a Kubernetes cluster with KubeSphere installed, refer to the following command as an example:

```bash
./kk create cluster --with-kubernetes v1.22.10 --with-kubesphere v3.3.0
```

{{< notice note >}}

- Recommended Kubernetes versions for KubeSphere 3.3.0: v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support). If you do not specify a Kubernetes version, KubeKey installs Kubernetes v1.23.7 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../installing-on-linux/introduction/kubekey/#support-matrix).
- For all-in-one installation, you do not need to change any configuration.
- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed. KubeKey will install Kubernetes only. If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.
- KubeKey will install [OpenEBS](https://openebs.io/) to provision LocalPV for the development and testing environment by default, which is convenient for new users. For other storage classes, see [Persistent Storage Configurations](../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/).

{{</ notice >}}

After you run the command, you will see a table for environment check. For details, see [Node requirements](#node-requirements) and [Dependency requirements](#dependency-requirements). Type `yes` to continue.

## Step 4: Verify the Installation

Run the following command to check the result.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

The output displays the IP address and port number of the web console, which is exposed through `NodePort 30880` by default. Now, you can access the console at `<NodeIP>:30880` with the default account and password (`admin/P@88w0rd`).

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

{{< notice note >}}

You may need to configure port forwarding rules and open the port in your security group so that external users can access the console.

{{</ notice >}}

After logging in to the console, you can check the status of different components in **System Components**. You may need to wait for some components to be up and running if you want to use related services. You can also use `kubectl get pod --all-namespaces` to inspect the running status of KubeSphere workloads.

## Enable Pluggable Components (Optional)

This guide is used only for the minimal installation by default. For more information about how to enable other components in KubeSphere, see [Enable Pluggable Components](../../pluggable-components/).

## Code Demonstration
<script src="https://asciinema.org/a/379741.js" id="asciicast-379741" async></script>
