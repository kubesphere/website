---
title: "All-in-one Installation on Linux"
keywords: 'KubeSphere, Kubernetes, All-in-one, Installation'
description: 'All-in-one Installation on Linux'

linkTitle: "All-in-one Installation on Linux"
weight: 3010
---

For those who are new to KubeSphere and looking for a quick way to discover the platform, the all-in-one mode is your best choice to get started. It features rapid deployment and hassle-free configuration installation with KubeSphere and Kubernetes all provisioned on your machine.

## Prerequisites

If your machine is behind a firewall, you need to open relevant ports by following the document [Port Requirements](../../installing-on-linux/introduction/port-firewall/).

## Step 1: Prepare Linux Machine

See the requirements for hardware and operating system shown below. To get started with all-in-one installation, you only need to prepare one host according to the following requirements.

### Hardware Recommendation

| System                                                 | Minimum Requirements                        |
| ------------------------------------------------------ | ------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 40 G |

{{< notice note >}}

The system requirements above and the instructions below are for the default minimal installation without any optional components enabled. If your machine has at least 8 cores and 16G memory, it is recommended that you enable all components. For more information, see [Enable Pluggable Components](../../pluggable-components/).

{{</ notice >}}

### Node Requirements

- The node can be accessed through `SSH`.
- `sudo`/`curl`/`openssl` should be used.
- `ebtables`/`socat`/`ipset`/`conntrack` should be installed in advance.
- `docker` can be installed by yourself or by KubeKey.

### Network and DNS Requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in clusters.
- If your network configuration uses Firewall or Security Group, you must ensure infrastructure components can communicate with each other through specific ports. It's recommended that you turn off the firewall or follow the guide [Network Access](https://github.com/kubesphere/kubekey/blob/master/docs/network-access.md).

{{< notice tip >}}

- It is recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- It is recommended that a container image mirror (accelerator) be prepared if you have trouble downloading images from dockerhub.io. See [Configure Booster for Installation](../../installing-on-linux/faq/configure-booster/).

{{</ notice >}}

## Step 2: Download KubeKey

Follow the step below to download KubeKey.

{{< tabs >}}

{{< tab "For users with poor network connections to GitHub" >}}

Download KubeKey using the following command:

```bash
wget -c https://kubesphere.io/download/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

{{</ tab >}}

{{< tab "For users with good network connections to GitHub" >}}

Download KubeKey from [GitHub Release Page](https://github.com/kubesphere/kubekey/releases/tag/v1.0.0) or use the following command directly.

```bash
wget https://github.com/kubesphere/kubekey/releases/download/v1.0.0/kubekey-v1.0.0-linux-amd64.tar.gz -O - | tar -xz
```

{{</ tab >}}

{{</ tabs >}}

Grant the execution right to `kk`:

```bash
chmod +x kk
```

{{< notice info >}}

Developed in Go language, KubeKey represents a brand-new installation tool as a replacement for the ansible-based installer used before. KubeKey provides users with flexible installation choices, as they can install KubeSphere and Kubernetes separately or install them at one time, which is convenient and efficient.

{{</ notice >}}

## Step 3: Get Started with Installation

In this QuickStart tutorial, you only need to execute one command for installation, the template of which is shown below:

```bash
./kk create cluster [--with-kubernetes version] [--with-kubesphere version]
```

Create a Kubernetes cluster with KubeSphere installed. Here is an example for your reference:


```bash
./kk create cluster --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

{{< notice note >}}

- Supported Kubernetes versions: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.
- For all-in-one installation, generally speaking, you do not need to change any configuration.
- KubeKey will install [OpenEBS](https://openebs.io/) to provision LocalPV for development and testing environment by default, which is convenient for new users. For other storage classes, see [Persistent Storage Configuration](../../installing-on-linux/introduction/storage-configuration/).

{{</ notice >}}

After you execute the command, you will see a table as below for environment check.

![environment-check](https://ap3.qingstor.com/kubesphere-website/docs/environment-check.png)

Make sure the above components marked with `y` are installed and input `yes` to continue.

{{< notice note >}}

If you download the binary file directly in Step 2, you do not need to install `docker` as KubeKey will install it automatically.

{{</ notice >}}

## Step 4: Verify the Installation

When you see the output as below, it means the installation finishes.

![installation-complete](https://ap3.qingstor.com/kubesphere-website/docs/Installation-complete.png)

Input the following command to check the result.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

The output displays the IP address and port number of the web console, which is exposed through `NodePort 30880` by default. Now, you can access the console through `EIP:30880` with the default account and password (`admin/P@88word`).

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

You may need to bind EIP and configure port forwarding in your environment for external users to access the console. Besides, make sure the port 30880 is opened in your security groups.

{{</ notice >}}

After logging in the console, you can check the status of different components in **Components**. You may need to wait for some components to be up and running if you want to use related services. You can also use `kubectl get pod --all-namespaces` to inspect the running status of KubeSphere workloads.

![components](https://ap3.qingstor.com/kubesphere-website/docs/components.png)

## Enable Pluggable Components (Optional)

The guide above is used only for minimal installation by default. To enable other components in KubeSphere, see [Enable Pluggable Components](../../pluggable-components/) for more details.
