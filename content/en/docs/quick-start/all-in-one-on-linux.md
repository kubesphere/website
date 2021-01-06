---
title: "All-in-One Installation on Linux"
keywords: 'KubeSphere, Kubernetes, All-in-one, Installation'
description: 'All-in-One Installation on Linux'
linkTitle: "All-in-One Installation on Linux"
weight: 2100
---

For those who are new to KubeSphere and looking for a quick way to discover the platform, the all-in-one mode is your best choice to get started. It features rapid deployment and hassle-free configuration installation with KubeSphere and Kubernetes all provisioned on your machine.

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
- `docker` can be installed by yourself or by [KubeKey](https://github.com/kubesphere/kubekey).

{{< notice note >}}

`docker` must be installed in advance if you want to deploy KubeSphere in an offline environment.

{{</ notice >}}

### Dependency requirements

KubeKey can install Kubernetes and KubeSphere together. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the list below to see if you need to install relevant dependencies on your node in advance.

| Dependency  | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

{{< notice info >}}

Developed in Go language, KubeKey represents a brand-new installation tool as a replacement for the ansible-based installer used before. KubeKey provides users with flexible installation choices, as they can install KubeSphere and Kubernetes separately or install them at one time, which is convenient and efficient.

{{</ notice >}}

### Network and DNS requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in the cluster.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It is recommended that you turn off the firewall. For more information, see [Port Requirements](../../installing-on-linux/introduction/port-firewall/).

{{< notice tip >}}

- It is recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- It is recommended that a container image mirror (a booster) be prepared if you have trouble downloading images from `dockerhub.io`. For more information, see [Configure a Booster for Installation](../../faq/installation/configure-booster/).

{{</ notice >}}

## Step 2: Download KubeKey

Follow the steps below to download KubeKey.

{{< tabs >}}

{{< tab "Good network connections to GitHub/Googleapis" >}}

Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{</ tab >}}

{{< tab "Poor network connections to GitHub/Googleapis" >}}

Run the following command first to make sure you download KubeKey from the correct zone.

```bash
export KKZONE=cn
```

Run the following command to download KubeKey:

```bash
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
```

{{< notice note >}}

After you download KubeKey, if you transfer it to a new machine also with poor network connections to Googleapis, you must run `export KKZONE=cn` again before you proceed with the steps below.

{{</ notice >}} 

{{</ tab >}}

{{</ tabs >}}

{{< notice note >}}

The commands above download the latest release (v1.0.1) of KubeKey. You can change the version number in the command to download a specific version.

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
./kk create cluster --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

{{< notice note >}}

- Supported Kubernetes versions: *v1.15.12*, *v1.16.13*, *v1.17.9* (default), *v1.18.6*.
- For all-in-one installation, generally speaking, you do not need to change any configuration.
- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed. KubeKey will install Kubernetes only. If you add the flag `--with-kubesphere` without specifying a KubeSphere version, the latest version of KubeSphere will be installed.
- KubeKey will install [OpenEBS](https://openebs.io/) to provision LocalPV for the development and testing environment by default, which is convenient for new users. For other storage classes, see [Persistent Storage Configurations](../../installing-on-linux/introduction/storage-configuration/).

{{</ notice >}}

After you execute the command, you will see a table as below for environment check. For details, read [Node requirements](#node-requirements) and [Dependency requirements](#dependency-requirements) above. Input `yes` to continue.

![environment-check](/images/docs/quickstart/all-in-one-installation/environment-check.png)

## Step 4: Verify the Installation

When you see the output as below, it means the installation finishes.

![Installation-complete](/images/docs/quickstart/all-in-one-installation/Installation-complete.png)

Input the following command to check the result.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

The output displays the IP address and port number of the web console, which is exposed through `NodePort 30880` by default. Now, you can access the console through `EIP:30880` with the default account and password (`admin/P@88w0rd`).

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