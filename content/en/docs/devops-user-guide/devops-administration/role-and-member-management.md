---
title: "Role and Member Management"
keywords: 'kubernetes, kubesphere, air gapped, installation'
description: 'Role and Member Management'


weight: 2240
---

The air-gapped installation is almost the same as the online installation except it creates a local registry to host the Docker images. We will demonstrate how to install KubeSphere and Kubernetes on air-gapped environment.

> Note: The dependencies in different operating systems may cause upexpected problems. If you encounter any installation problems on air-gapped environment, please describe your OS information and error logs on [GitHub](https://github.com/kubesphere/kubesphere/issues).

## Prerequisites

- If your machine is behind a firewall, you need to open the ports by following the document [Ports Requirements](../port-firewall) for more information.
> - Installer will use `/var/lib/docker` as the default directory where all Docker related files, including the images, are stored. We recommend you to add additional storage to a disk with at least 100G mounted at `/var/lib/docker` and `/mnt/registry` respectively, use the [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.
- Installer uses [Local volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [OpenEBS](https://openebs.io/) to provide storage service with dynamic provisioning. It is convenient for testing and development. For production, please [configure supported persistent storage service](../storage-configuration) and prepare [high availability configuration](../master-ha) before installation.
- Since the air-gapped machines cannot connect to apt or yum source, please use clean Linux machine to avoid this problem.

## Step 1: Prepare Linux Hosts

The following describes the requirements of hardware and operating system. To get started with multi-node installation, you need to prepare at least `three` hosts according to the following requirements.

- Supported OSes: CentOS 7.4 ~ 7.7 (64-bit), Ubuntu 16.04.5/16.04.6/18.04.1/18.04.2/18.04.3 LTS (64-bit)
- Time synchronization is required across all nodes, otherwise the installation may not succeed;
- For `Ubuntu 16.04` OS, it is recommended to select `16.04.5`;
- If you are using `Ubuntu 18.04`, you need to use the user `root`.
- Ensure your disk of each node is at least 100G.
- CPU and memory in total of all machines: 2 cores and 4 GB for minimal installation; 8 cores and 16 GB for complete installation.


The following section describes an example to introduce multi-node installation. This example shows three hosts installation by taking the `master` serving as the taskbox to execute the installation. The following cluster consists of one Master and two Nodes.

> Note: KubeSphere supports the high-availability configuration of the Masters and Etcd nodes. Please refer to [Creating High Availability KubeSphere Cluster](../master-ha) for guide.

| Host IP | Host Name | Role |
| --- | --- | --- |
|192.168.0.1|master|master, etcd|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|

### Cluster Architecture

#### Single Master, Single Etcd, Two Nodes

![Architecture](/cluster-architecture.svg)

## Step 2: Download Installer Package

Download `KubeSphere 2.1.1` to your taskbox machine, then unpack it and go to the folder `conf`.

```bash
curl -L https://kubesphere.io/download/offline/latest > kubesphere-all-offline-v2.1.1.tar.gz \
&& tar -zxf kubesphere-all-offline-v2.1.1.tar.gz && cd kubesphere-all-offline-v2.1.1/conf
```

## Step 3: Configure Host Template

> This step is only for multi-node installation, you can skip this step if you choose all-in-one installation.

Please refer to the following sample to configure all hosts in `hosts.ini`. It is recommended to install KubeSphere using root user. The following is an example configuration for `CentOS 7.5` using root user. Note do not manually wrap any line in the file.

> Note:
>
> - If you use non-root user with sudo access to install KubeSphere, you need to refer to the example block that is commented out in `conf/hosts.ini`.
> - If the `root` user of that taskbox machine cannot establish SSH connection with the rest of machines, you need to refer to the `non-root` user example at the top of the `conf/hosts.ini`, but it is recommended to switch `root` user when executing `install.sh`.
> - master, node1 and node2 are the host names of each node and all host names should be in lowercase.

### hosts.ini

```ini
[all]
master ansible_connection=local  ip=192.168.0.1
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD

[local-registry]
master

[kube-master]
master

[kube-node]
node1
node2

[etcd]
master

[k8s-cluster:children]
kube-node
kube-master
```

> Note:
>
> - You need to replace each node information such as IP, password with real values in the group `[all]`. The master node is the taskbox so you do not need to add password field here.
> - Installer will use a node as the local registry for docker images, defaults to "master" in the group `[local-registry]`.
> - The "master" node also takes the role of master and etcd, so "master" is filled under the group`[kube-master]` and the group `[etcd]` respectively.
> - "node1" and "node2" both serve the role of `Node`, so they are filled under the group `[kube-node]`.
>
> Parameters Specification:
>
> - `ansible_connection`: Connection type to the host, "local" in the example above means local connection.
> - `ansible_host`: The name of the host to be connected.
> - `ip`: The ip of the host to be connected.
> - `ansible_user`: The default ssh user name to use.
> - `ansible_become_pass`: Allows you to set the privilege escalation password.
> - `ansible_ssh_pass`: The password of the host to be connected using root.

## Step 4: Enable All Components

> This is step is complete installation. You can skip this step if you choose a minimal installation.

Edit `conf/common.yaml`, reference the following changes with values being `true` which are `false` by default.

```yaml
# LOGGING CONFIGURATION
# logging is an optional component when installing KubeSphere, and
# Kubernetes builtin logging APIs will be used if logging_enabled is set to false.
# Builtin logging only provides limited functions, so recommend to enable logging.
logging_enabled: true # Whether to install logging system
elasticsearch_master_replica: 1  # total number of master nodes, it's not allowed to use even number
elasticsearch_data_replica: 2  # total number of data nodes
elasticsearch_volume_size: 20Gi # Elasticsearch volume size
log_max_age: 7 # Log retention time in built-in Elasticsearch, it is 7 days by default.
elk_prefix: logstash # the string making up index names. The index name will be formatted as ks-<elk_prefix>-log
kibana_enabled: false # Kibana Whether to install built-in Grafana
#external_es_url: SHOULD_BE_REPLACED # External Elasticsearch address, KubeSphere supports integrate with Elasticsearch outside the cluster, which can reduce the resource consumption.
#external_es_port: SHOULD_BE_REPLACED # External Elasticsearch service port

#DevOps Configuration
devops_enabled: true # Whether to install built-in DevOps system (Supports CI/CD pipeline, Source/Binary to image)
jenkins_memory_lim: 8Gi # Jenkins memory limit, it is 8 Gi by default
jenkins_memory_req: 4Gi # Jenkins memory request, it is 4 Gi by default
jenkins_volume_size: 8Gi # Jenkins volume size, it is 8 Gi by default
jenkinsJavaOpts_Xms: 3g # Following three are JVM parameters
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true # Whether to install built-in SonarQube
#sonar_server_url: SHOULD_BE_REPLACED # External SonarQube address, KubeSphere supports integrate with SonarQube outside the cluster, which can reduce the resource consumption.
#sonar_server_token: SHOULD_BE_REPLACED  # SonarQube token

# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true       # KubeSphere application store
metrics_server_enabled: true   # For KubeSphere HPA to use
servicemesh_enabled: true      # KubeSphere service mesh system(Istio-based)
notification_enabled: true     # KubeSphere notification system
alerting_enabled: true         # KubeSphere alerting system
```

## Step 5: Install KubeSphere to Linux Machines

> Note:
>
> - Generally, you can install KubeSphere without any modification, it will start with minimal installation by default.
> - If you want to enable pluggable feature components installation, modify common.yaml and refer to [Enable Pluggable Components Installation](../pluggable-components) for instructions.
> - Installer uses [Local volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning. For production environment, please [configure supported persistent storage service](../storage-configuration) before installation.
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, and the default subnet for Pod IPs is 10.233.64.0/18, the node IPs must not use the two IP range. You can modify the default subnets `kube_service_addresses` or `kube_pods_subnet` in the file `conf/common.yaml` to avoid conflicts.

**1.** Enter `scripts` folder, and execute `install.sh` using `root` user:

```bash
cd ../cripts
./install.sh
```

**2.** Type `2` to select multi-node mode to start the installation. The installer will ask you if you have set up persistent storage service or not. Just type `yes` since we are going to use local volume.

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2020-02-24
################################################
Please input an option: 2

```

**3.** Verify the multi-node installation：

**(1).** If "Successful" it returned after `install.sh` process completed, then congratulation! you are ready to go.

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.1:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```

> Note: The information above is saved in a log file that you can view by following the [guide](../verify-components).

**(2).** You will be able to use default account and password `admin / P@88w0rd` to log in the console `http://{$IP}:30880` to take a tour of KubeSphere. Please change the default password after logging in.

![Login](https://pek3b.qingstor.com/kubesphere-docs/png/20191017172215.png)

<font color=red>Note: After log in console, please verify the monitoring status of service components in the "Cluster Status". If any service is not ready, please wait patiently untill all components get running up.</font>

![Landing Page](https://pek3b.qingstor.com/kubesphere-docs/png/20191125003158.png)

## Enable Pluggable Components

If you already have set up minimal installation, you still can edit the ConfigMap of ks-installer using the following command. Please make sure there is enough resource in your machines, see [Pluggable Components Overview](/en/installation/pluggable-components/).

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

## FAQ

If you have further questions please do not hesitate to raise issues on [GitHub](https://github.com/kubesphere/kubesphere/issues).
