---
title: "All-in-One Installation on Linux"
keywords: 'KubeSphere, Kubernetes, All-in-one, Installation'
description: 'Install KubeSphere on Linux with a minimal installation package. The tutorial serves as a basic kick-starter for you to understand the container platform, paving the way for learning the following guides.'
linkTitle: "All-in-One Installation on Linux"
weight: 2100
---

For those who are new to KubeSphere and looking for a quick way to discover the [container platform](https://kubesphere.io/), the all-in-one mode is your best choice to get started. It features rapid deployment and hassle-free configurations with KubeSphere and Kubernetes all provisioned on your machine.

## Video Demonstration

{{< youtube PtVQZVb3AgE >}}

## Step 1: Prepare a Linux Machine

To get started with all-in-one installation, you only need to prepare one host according to the following requirements for hardware and operating system.

### Hardware recommendations

| System                                                 | Minimum Requirements                        |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

The system requirements above and the instructions below are for the default minimal installation without any pluggable components enabled. If your machine has at least 8 cores and 16G memory, it is recommended that you enable all components. For more information, see [Enable Pluggable Components](../../pluggable-components/).

{{</ notice >}}

### Node requirements

- The node can be accessed through `SSH`.
- `sudo`/`curl`/`openssl` should be used.

### Container runtimes

Your cluster must have an available container runtime. If you use KubeKey to set up a cluster, KubeKey will install the latest version of Docker by default. Alternatively, you can install Docker or other container runtimes by yourself before you create a cluster.

{{< content "container-runtime-requirements.md" >}}

{{< notice note >}}

A container runtime must be installed in advance if you want to deploy KubeSphere in an offline environment.

{{</ notice >}}

### Dependency requirements

{{< content "common/dependency-requirements.md" >}}

### Network and DNS requirements

{{< content "common/network-requirements.md" >}}

{{< notice tip >}}

- It is recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- It is recommended that a registry mirror (a booster) be prepared if you have trouble downloading images from `dockerhub.io`. For more information, see [Configure a Booster for Installation](../../faq/installation/configure-booster/).

{{</ notice >}}

## Step 2: Download KubeKey

Follow the steps below to download KubeKey.

{{< notice info >}}

Developed in Go language, KubeKey represents a brand-new installation tool as a replacement for the ansible-based installer used before. KubeKey provides users with flexible installation choices, as they can install KubeSphere and Kubernetes separately or install them at one time, which is convenient and efficient.

{{</ notice >}}

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.0 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.0 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v1.1.0) of KubeKey. You can change the version number in the command to download a specific version.

{{</ notice >}} 

Make `kk` executable:

```bash
chmod +x kk
```

## Step 3: Get Started with Installation

In this tutorial, you only need to execute one command for installation, the template of which is shown below:

```bash
./kk create cluster [--with-kubernetes version] [--with-kubesphere version]
```

To create a Kubernetes cluster with KubeSphere installed, refer to the following command as an example:

```bash
./kk create cluster --with-kubernetes v1.20.4 --with-kubesphere v3.1.0
```

{{< notice note >}}

- Recommended Kubernetes versions for KubeSphere v3.1.0: v1.17.9, v1.18.8, v1.19.8 and v1.20.4. If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.19.8 by default. For more information about supported Kubernetes versions, see [Support Matrix](../../installing-on-linux/introduction/kubekey/#support-matrix).
- For all-in-one installation, generally speaking, you do not need to change any configuration.
- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed. KubeKey will install Kubernetes only. If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.
- KubeKey will install [OpenEBS](https://openebs.io/) to provision LocalPV for the development and testing environment by default, which is convenient for new users. For other storage classes, see [Persistent Storage Configurations](../../installing-on-linux/persistent-storage-configurations/understand-persistent-storage/).

{{</ notice >}}

After you execute the command, you will see a table for environment check. For details, read [Node requirements](#node-requirements) and [Dependency requirements](#dependency-requirements) above. Input `yes` to continue.

## Step 4: Verify the Installation

When you see the output as below, it means the installation finishes.

![Installation-complete](/images/docs/quickstart/all-in-one-installation/Installation-complete.png)

Input the following command to check the result.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
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

{{< notice note >}}

You may need to configure port forwarding rules and open the port in your security group so that external users can access the console.

{{</ notice >}}

After logging in to the console, you can check the status of different components in **Components**. You may need to wait for some components to be up and running if you want to use related services. You can also use `kubectl get pod --all-namespaces` to inspect the running status of KubeSphere workloads.

![kubesphere-components](/images/docs/quickstart/all-in-one-installation/kubesphere-components.png)

## Enable Pluggable Components (Optional)

The guide above is used only for the minimal installation by default. To enable other components in KubeSphere, see [Enable Pluggable Components](../../pluggable-components/) for more details.

## Code Demonstration
<script src="https://asciinema.org/a/379741.js" id="asciicast-379741" async></script>
