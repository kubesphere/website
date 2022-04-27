---
title: "Air-gapped Installation"
keywords: 'Air-gapped, installation, KubeSphere'
description: 'Understand how to install KubeSphere and Kubernetes in the air-gapped environment.'

linkTitle: "Air-gapped Installation"
weight: 3140
---

KubeKey is an open-source, lightweight tool for deploying Kubernetes clusters. It allows you to install Kubernetes/K3s only, both Kubernetes/K3s and KubeSphere, and other cloud-native plugins in a flexible, fast, and convenient way. Additionally, it is an effective tool for scaling and upgrading clusters.

<<<<<<< HEAD
In KubeKey v2.1.0, we bring in concepts of manifest and artifact, which provides a solution for air-gapped installation of Kubernetes clusters. A manifest file describes information of the current Kubernetes cluster and defines content in an artifact. Previously, users had to prepare deployment tools, image (.tar) file, and other binaries as the Kubernetes version and image to deploy are different. Now, with KubeKey, air-gapped installation can never be so easy. You simply use a manifest file to define what you need for your cluster in air-gapped environments, and then export the artifact file to quickly and easily deploy image registries and Kubernetes cluster.
=======
## Step 1: Prepare Linux Hosts
>>>>>>> 3785c2cc (update 3.3 new)

## Prerequisites

|Host IP| Host Name | Usage      |
| ---------------- | ---- | ---------------- |
|192.168.0.2 | node1    | Online host for packaging the source cluster with Kubernetes v1.21.5 and KubeSphere v3.3.0 installed |
|192.168.0.3 | node2    | Control plane node of the air-gapped environment |
|192.168.0.4 | node3    | Image registry node of the air-gapped environment |
## Preparations

<<<<<<< HEAD
1. Run the following commands to download KubeKey v2.1.0.
   {{< tabs >}}
=======
| Systems                                                | Minimum Requirements (Each node)             |
| ------------------------------------------------------ | -------------------------------------------- |
| **Ubuntu** *16.04, 18.04*                              | CPU: 2 Cores, Memory: 4 G, Disk Space: 100 G |
| **Debian** *Buster, Stretch*                           | CPU: 2 Cores, Memory: 4 G, Disk Space: 100 G |
| **CentOS** *7*.x                                       | CPU: 2 Cores, Memory: 4 G, Disk Space: 100 G |
| **Red Hat Enterprise Linux 7**                         | CPU: 2 Cores, Memory: 4 G, Disk Space: 100 G |
| **SUSE Linux Enterprise Server 15/openSUSE Leap 15.2** | CPU: 2 Cores, Memory: 4 G, Disk Space: 100 G |
>>>>>>> 3785c2cc (update 3.3 new)

   {{< tab "Good network connections to GitHub/Googleapis" >}}

   Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command directly.

<<<<<<< HEAD
   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.1.0 sh -
   ```

- [KubeKey](https://github.com/kubesphere/kubekey) uses `/var/lib/docker` as the default directory where all Docker related files, including images, are stored. It is recommended you add additional storage volumes with at least **100G** mounted to `/var/lib/docker` and `/mnt/registry` respectively. See [fdisk](https://www.computerhope.com/unix/fdisk.htm) command for reference.

- Only x86_64 CPUs are supported, and Arm CPUs are not fully supported at present.

{{</ notice >}}

### Node requirements

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- Ensure your disk of each node is at least **100G**.
- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.


KubeKey can install Kubernetes and KubeSphere together. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the list below to see if you need to install relevant dependencies on your node in advance.

| Dependency  | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

{{< notice note >}}

- In an air-gapped environment, you can install these dependencies using a private package, a RPM package (for CentOS) or a Deb package (for Debian).
- It is recommended you create an OS image file with all relevant dependencies installed in advance. In this way, you can use the image file directly for the installation of OS on each machine, improving deployment efficiency while not worrying about any dependency issues.

{{</ notice >}} 

### Container runtimes

Your cluster must have an available container runtime. For air-gapped installation, you must install Docker or other container runtimes by yourself before you create a cluster.

| Supported Container Runtime | Version |
| --------------------------- | ------- |
| Docker                      | 19.3.8+ |
| containerd   | Latest  |
| CRI-O (experimental, not fully tested)        | Latest  |
| iSula (experimental, not fully tested)        | Latest  |

### Network and DNS requirements

=======
- Only x86_64 CPUs are supported, and Arm CPUs are not fully supported at present.

{{</ notice >}}

### Node requirements

- It's recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.
- Ensure your disk of each node is at least **100G**.
- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.


KubeKey can install Kubernetes and KubeSphere together. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the list below to see if you need to install relevant dependencies on your node in advance.

| Dependency  | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

{{< notice note >}}

- In an air-gapped environment, you can install these dependencies using a private package, a RPM package (for CentOS) or a Deb package (for Debian).
- It is recommended you create an OS image file with all relevant dependencies installed in advance. In this way, you can use the image file directly for the installation of OS on each machine, improving deployment efficiency while not worrying about any dependency issues.

{{</ notice >}} 

### Container runtimes

Your cluster must have an available container runtime. For air-gapped installation, you must install Docker or other container runtimes by yourself before you create a cluster.

| Supported Container Runtime | Version |
| --------------------------- | ------- |
| Docker                      | 19.3.8+ |
| containerd   | Latest  |
| CRI-O (experimental, not fully tested)        | Latest  |
| iSula (experimental, not fully tested)        | Latest  |

### Network and DNS requirements

>>>>>>> 3785c2cc (update 3.3 new)
- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in clusters.
- If your network configuration uses Firewall or Security Group, you must ensure infrastructure components can communicate with each other through specific ports. It's recommended that you turn off the firewall. For more information, refer to [Port Requirements](../port-firewall/).
- Supported CNI plugins: Calico and Flannel. Others (such as Cilium and Kube-OVN) may also work but note that they have not been fully tested.

### Example machines

This example includes three hosts as below with the master node serving as the taskbox.

| Host IP     | Host Name | Role         |
| ----------- | --------- | ------------ |
| 192.168.0.2 | master    | master, etcd |
| 192.168.0.3 | node1     | worker       |
| 192.168.0.4 | node2     | worker       |

## Step 2: Prepare a Private Image Registry

You can use Harbor or any other private image registries. This tutorial uses Docker registry as an example with [self-signed certificates](https://docs.docker.com/registry/insecure/#use-self-signed-certificates) (If you have your own private image registry, you can skip this step).

   {{< tab "Poor network connections to GitHub/Googleapis" >}}

   Run the following command first to make sure you download KubeKey from the correct zone.

   ```bash
   export KKZONE=cn
   ```

   Run the following command to download KubeKey:

   ```bash
<<<<<<< HEAD
   curl -sfL https://get-kk.kubesphere.io | VERSION=v2.1.0 sh -
=======
   openssl req \
   -newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
   -x509 -days 36500 -out certs/domain.crt
>>>>>>> 3785c2cc (update 3.3 new)
   ```
   {{</ tab >}}

   {{</ tabs >}}

2. In the source cluster, use KubeKey to create a manifest. The following two methods are supported:

   - (Recommended) In the created cluster, run the following command to create a manifest file:

   ```bash
   ./kk create manifest
   ```

   - Create and compile the manifest file manually according to the template. For more information, see [ manifest-example ](https://github.com/kubesphere/kubekey/blob/master/docs/manifest-example.md).

3. Run the following command to modify the manifest configurations in the source cluster.
   
   ```bash
   vim manifest.yaml
   ```
<<<<<<< HEAD
   
   ```yaml
   ---
   apiVersion: kubekey.kubesphere.io/v1alpha2
   kind: Manifest
   metadata:
     name: sample
   spec:
     arches:
     - amd64
     operatingSystems:
     - arch: amd64
       type: linux
       id: centos
       version: "7"
       repository:
         iso:
           localPath: ""
           url: "https://github.com/kubesphere/kubekey/releases/download/v2.1.0/centos-7-amd64-rpms.iso"
     kubernetesDistributions:
     - type: kubernetes
       version: v1.21.5
     components:
       helm:
         version: v3.6.3
       cni:
         version: v0.9.1
       etcd:
         version: v3.4.13
       ## For now, if your cluster container runtime is containerd, KubeKey will add a docker 20.10.8 container runtime in the below list.
       ## The reason is KubeKey creates a cluster with containerd by installing a docker first and making kubelet connect the socket file of containerd which docker contained.
       containerRuntimes:
       - type: docker
         version: 20.10.8
       crictl:
         version: v1.22.0
       ##
       # docker-registry:
       #   version: "2"
       harbor:
         version: v2.4.1
       docker-compose:
         version: v2.2.2
     images:
     - docker.io/kubesphere/kube-apiserver:v1.21.5
     - docker.io/kubesphere/kube-controller-manager:v1.21.5
     - docker.io/kubesphere/kube-proxy:v1.21.5
     - docker.io/kubesphere/kube-scheduler:v1.21.5
     - docker.io/kubesphere/pause:3.5
     - docker.io/kubesphere/pause:3.4.1
     - docker.io/coredns/coredns:1.8.0
     - docker.io/calico/cni:v3.20.0
     - docker.io/calico/kube-controllers:v3.20.0
     - docker.io/calico/node:v3.20.0
     - docker.io/calico/pod2daemon-flexvol:v3.20.0
     - docker.io/calico/typha:v3.20.0
     - docker.io/kubesphere/flannel:v0.12.0
     - docker.io/openebs/provisioner-localpv:2.10.1
     - docker.io/openebs/linux-utils:2.10.0
     - docker.io/kubesphere/nfs-subdir-external-provisioner:v4.0.2
     - docker.io/kubesphere/k8s-dns-node-cache:1.15.12
     - docker.io/kubesphere/ks-installer:v3.2.1
     - docker.io/kubesphere/ks-apiserver:v3.2.1
     - docker.io/kubesphere/ks-console:v3.2.1
     - docker.io/kubesphere/ks-controller-manager:v3.2.1
     - docker.io/kubesphere/kubectl:v1.21.0
     - docker.io/kubesphere/kubefed:v0.8.1
     - docker.io/kubesphere/tower:v0.2.0
     - docker.io/minio/minio:RELEASE.2019-08-07T01-59-21Z
     - docker.io/minio/mc:RELEASE.2019-08-07T23-14-43Z
     - docker.io/csiplugin/snapshot-controller:v4.0.0
     - docker.io/kubesphere/nginx-ingress-controller:v0.48.1
     - docker.io/mirrorgooglecontainers/defaultbackend-amd64:1.4
     - docker.io/kubesphere/metrics-server:v0.4.2
     - docker.io/library/redis:5.0.14-alpine
     - docker.io/library/haproxy:2.0.25-alpine
     - docker.io/library/haproxy:2.3
     - docker.io/library/alpine:3.14
     - docker.io/osixia/openldap:1.3.0
     - docker.io/kubesphere/netshoot:v1.0
     - docker.io/kubeedge/cloudcore:v1.7.2
     - docker.io/kubesphere/edge-watcher:v0.1.1
     - docker.io/kubesphere/edge-watcher-agent:v0.1.0
     - docker.io/kubesphere/openpitrix-jobs:v3.2.1
     - docker.io/kubesphere/devops-apiserver:v3.2.1
     - docker.io/kubesphere/devops-controller:v3.2.1
     - docker.io/kubesphere/devops-tools:v3.2.1
     - docker.io/kubesphere/ks-jenkins:v3.2.0-2.249.1
     - docker.io/jenkins/jnlp-slave:3.27-1
     - docker.io/kubesphere/builder-base:v3.2.0
     - docker.io/kubesphere/builder-nodejs:v3.2.0
     - docker.io/kubesphere/builder-maven:v3.2.0
     - docker.io/kubesphere/builder-python:v3.2.0
     - docker.io/kubesphere/builder-go:v3.2.0
     - docker.io/kubesphere/builder-base:v3.2.0-podman
     - docker.io/kubesphere/builder-nodejs:v3.2.0-podman
     - docker.io/kubesphere/builder-maven:v3.2.0-podman
     - docker.io/kubesphere/builder-python:v3.2.0-podman
     - docker.io/kubesphere/builder-go:v3.2.0-podman
     - docker.io/kubesphere/s2ioperator:v3.2.0
     - docker.io/kubesphere/s2irun:v3.2.0
     - docker.io/kubesphere/s2i-binary:v3.2.0
     - docker.io/kubesphere/tomcat85-java11-centos7:v3.2.0
     - docker.io/kubesphere/tomcat85-java11-runtime:v3.2.0
     - docker.io/kubesphere/tomcat85-java8-centos7:v3.2.0
     - docker.io/kubesphere/tomcat85-java8-runtime:v3.2.0
     - docker.io/kubesphere/java-11-centos7:v3.2.0
     - docker.io/kubesphere/java-8-centos7:v3.2.0
     - docker.io/kubesphere/java-8-runtime:v3.2.0
     - docker.io/kubesphere/java-11-runtime:v3.2.0
     - docker.io/kubesphere/nodejs-8-centos7:v3.2.0
     - docker.io/kubesphere/nodejs-6-centos7:v3.2.0
     - docker.io/kubesphere/nodejs-4-centos7:v3.2.0
     - docker.io/kubesphere/python-36-centos7:v3.2.0
     - docker.io/kubesphere/python-35-centos7:v3.2.0
     - docker.io/kubesphere/python-34-centos7:v3.2.0
     - docker.io/kubesphere/python-27-centos7:v3.2.0
     - docker.io/jimmidyson/configmap-reload:v0.3.0
     - docker.io/prom/prometheus:v2.26.0
     - docker.io/kubesphere/prometheus-config-reloader:v0.43.2
     - docker.io/kubesphere/prometheus-operator:v0.43.2
     - docker.io/kubesphere/kube-rbac-proxy:v0.8.0
     - docker.io/kubesphere/kube-state-metrics:v1.9.7
     - docker.io/prom/node-exporter:v0.18.1
     - docker.io/kubesphere/k8s-prometheus-adapter-amd64:v0.6.0
     - docker.io/prom/alertmanager:v0.21.0
     - docker.io/thanosio/thanos:v0.18.0
     - docker.io/grafana/grafana:7.4.3
     - docker.io/kubesphere/kube-rbac-proxy:v0.8.0
     - docker.io/kubesphere/notification-manager-operator:v1.4.0
     - docker.io/kubesphere/notification-manager:v1.4.0
     - docker.io/kubesphere/notification-tenant-sidecar:v3.2.0
     - docker.io/kubesphere/elasticsearch-curator:v5.7.6
     - docker.io/kubesphere/elasticsearch-oss:6.7.0-1
     - docker.io/kubesphere/fluentbit-operator:v0.11.0
     - docker.io/library/docker:19.03
     - docker.io/kubesphere/fluent-bit:v1.8.3
     - docker.io/kubesphere/log-sidecar-injector:1.1
     - docker.io/elastic/filebeat:6.7.0
     - docker.io/kubesphere/kube-events-operator:v0.3.0
     - docker.io/kubesphere/kube-events-exporter:v0.3.0
     - docker.io/kubesphere/kube-events-ruler:v0.3.0
     - docker.io/kubesphere/kube-auditing-operator:v0.2.0
     - docker.io/kubesphere/kube-auditing-webhook:v0.2.0
     - docker.io/istio/pilot:1.11.1
     - docker.io/istio/proxyv2:1.11.1
     - docker.io/jaegertracing/jaeger-operator:1.27
     - docker.io/jaegertracing/jaeger-agent:1.27
     - docker.io/jaegertracing/jaeger-collector:1.27
     - docker.io/jaegertracing/jaeger-query:1.27
     - docker.io/jaegertracing/jaeger-es-index-cleaner:1.27
     - docker.io/kubesphere/kiali-operator:v1.38.1
     - docker.io/kubesphere/kiali:v1.38
     - docker.io/library/busybox:1.31.1
     - docker.io/library/nginx:1.14-alpine
     - docker.io/joosthofman/wget:1.0
     - docker.io/nginxdemos/hello:plain-text
     - docker.io/library/wordpress:4.8-apache
     - docker.io/mirrorgooglecontainers/hpa-example:latest
     - docker.io/library/java:openjdk-8-jre-alpine
     - docker.io/fluent/fluentd:v1.4.2-2.0
     - docker.io/library/perl:latest
     - docker.io/kubesphere/examples-bookinfo-productpage-v1:1.16.2
     - docker.io/kubesphere/examples-bookinfo-reviews-v1:1.16.2
     - docker.io/kubesphere/examples-bookinfo-reviews-v2:1.16.2
     - docker.io/kubesphere/examples-bookinfo-details-v1:1.16.2
     - docker.io/kubesphere/examples-bookinfo-ratings-v1:1.16.3
     - docker.io/weaveworks/scope:1.13.0
     registry:
       auths: {}
=======

   ```bash
   cp certs/domain.crt  /etc/docker/certs.d/dockerhub.kubekey.local/ca.crt
>>>>>>> 3785c2cc (update 3.3 new)
   ```
   
   {{< notice note >}}

   The path of the certificate is related to the domain name. When you copy the path, use your actual domain name if it is different from the one set above.

<<<<<<< HEAD
   - You can download the ISO files at https://github.com/kubesphere/kubekey/releases/tag/v2.1.0.
   
   {{</ notice >}}
   
4. Export the artifact from the source cluster.
   {{< tabs >}}

3. To verify whether the private registry is effective, you can copy an image to your local machine first, and use `docker push` and `docker pull` to test it.

   {{</ notice >}} 

   Run the following command directly:

   ```bash
   ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```

## Step 3: Download KubeKey

Similar to installing KubeSphere on Linux in an online environment, you also need to [download KubeKey v2.1.0](https://github.com/kubesphere/kubekey/releases) first. Download the `tar.gz` file, and transfer it to your local machine which serves as the taskbox for installation. After you uncompress the file, execute the following command to make `kk` executable:

```bash
chmod +x kk
```

=======
   {{</ notice >}} 

3. To verify whether the private registry is effective, you can copy an image to your local machine first, and use `docker push` and `docker pull` to test it.


## Step 3: Download KubeKey

Similar to installing KubeSphere on Linux in an online environment, you also need to [download KubeKey v2.1.0](https://github.com/kubesphere/kubekey/releases) first. Download the `tar.gz` file, and transfer it to your local machine which serves as the taskbox for installation. After you uncompress the file, execute the following command to make `kk` executable:

```bash
chmod +x kk
```

>>>>>>> 3785c2cc (update 3.3 new)
## Step 4: Prepare Installation Images

   {{< tab "Poor network connections to GitHub/Googleapis" >}}

   Run the following commands:

   ```bash
   export KKZONE=cn
   
   ./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
   ```
   {{</ tab >}}

   {{< notice note >}}

   This file lists images under `##+modulename` based on different modules. You can add your own images to this file following the same rule. To view the complete file, see [Appendix](../air-gapped-installation/#image-list-of-kubesphere-v310).
<<<<<<< HEAD

   {{</ notice >}} 

   {{< notice note >}}

   An artifact is a .tgz package containing the image package (.tar) and associated binaries exported from the specified manifest file. You can specify an artifact in the KubeKey commands for initializing the image registry, creating clusters, adding nodes, and upgrading clusters, and then KubeKey will automatically unpack the artifact and use the unpacked file when running the command.

   - Make sure the network connection is working.

   - When exporting artifacts, KubeKey pulls images in the image list of the manifest file one by one. Make sure that the worker nodes have a minimum version of 1.4.9 containerd or that of 18.09 docker installed.

   - KubeKey will resolve image names in the image list. If the image registry requires authentication, you can configure it in **.registry.auths** in the manifest file.
   {{</ notice >}}
## Install Clusters in the Air-gapped Environment

1. Copy the downloaded KubeKey and artifact to nodes in the air-gapped environment using a USB device.

2. Run the following command to create a configuration file for the air-gapped cluster:

   ```bash
   ./kk create config --with-kubesphere v3.2.1 --with-kubernetes v1.21.5 -f config-sample.yaml
   ```

3. Run the following command to modify the configuration file:

   ```bash
   vim config-sample.yaml
   ```

   - In **auths**, enter **dockerhub.kubekey.local**, username (**admin**) and password (**Harbor12345**).
   - In **privateRegistry**, enter **dockerhub.kubekey.local**.
   - In **namespaceOverride**, enter **kubesphereio**.

   - Modify the node information according to the actual configuration of the air-gapped environment.
   - You must specify the node where the `registry` to deploy (for KubeKey deployment of self-built Harbor registries).
   - In `registry`, the value of `type` must be specified as that of `harbor`. Otherwise, the docker registry is installed by default.
   
   {{</ notice >}}

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha2
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.149.133, internalAddress: 192.168.149.133, user: root, password: "Qcloud@123"}
     - {name: node1, address: 192.168.149.134, internalAddress: 192.168.149.134, user: root, password: "Qcloud@123"}
   
     roleGroups:
       etcd:
       - master
       control-plane:
       - master
       worker:
       - node1
       # If you want to use KubeKey to automatically deploy the image registry, set this value. You are advised to separately deploy the registry and the cluster.
       registry:
       - node1
     controlPlaneEndpoint:
       ## Internal loadbalancer for apiservers
       # internalLoadbalancer: haproxy
   
       domain: lb.kubesphere.local
       address: ""
       port: 6443
     kubernetes:
       version: v1.21.5
       clusterName: cluster.local
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
       ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
       multusCNI:
         enabled: false
     registry:
       # To use KubeKey to deploy Harbor, set the value of this parameter to harbor. If you do not set this parameter and still use KubeKey to create an container image registry, the docker registry is used by default.
       type: harbor
       # If Harbor or other registries deployed by using KubeKey requires login, you can set the auths parameter of the registry. However, if you create a docker registry using KubeKey, you do not need to set the auths parameter.
       # Note: If you use KubeKey to deploy Harbor, do not set this parameter until Harbor is started.
       #auths:
       #  "dockerhub.kubekey.local":
       #    username: admin
       #    password: Harbor12345
       plainHTTP: false
       # Set the private registry to use during cluster deployment.
       privateRegistry: ""
       namespaceOverride: ""
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```


4. Run the following command to install an image registry:

   ```bash
   ./kk init registry -f config-sample.yaml -a kubesphere.tar.gz
   ```
   {{< notice note >}}

   The parameters in the command are explained as follows:

   - **config-sample.yaml**: Specifies the configuration file of the cluster in the air-gapped environment.

   - **kubesphere.tar.gz**: Specifies the image package of the source cluster.

    {{</ notice >}}

For example:

   As Harbor adopts the Role-based Access Control (RBAC) mechanism, which means that only specified users can perform certain operations. Therefore, you must create a project before pushing images to Harbor. Harbor supports two types of projects:

   - **Public**: All users can pull images from the project.

   - **Private**: Only project members can pull images from the project.

   The username and password for logging in to Harbor is **admin** and **Harbor12345** by default. The installation file of Harbor is located in **/opt/harbor**, where you can perform O&M of Harbor.


=======

   {{</ notice >}} 

2. Download `offline-installation-tool.sh`.

   ```bash
   curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.3.0/offline-installation-tool.sh
   ```

3. Make the `.sh` file executable.

   ```bash
   chmod +x offline-installation-tool.sh
   ```

4. You can execute the command `./offline-installation-tool.sh -h` to see how to use the script:

   ```bash
   root@master:/home/ubuntu# ./offline-installation-tool.sh -h
   Usage:
   
     ./offline-installation-tool.sh [-l IMAGES-LIST] [-d IMAGES-DIR] [-r PRIVATE-REGISTRY] [-v KUBERNETES-VERSION ]
   
   Description:
     -b                     : save kubernetes' binaries.
     -d IMAGES-DIR          : the dir of files (tar.gz) which generated by `docker save`. default: ./kubesphere-images
     -l IMAGES-LIST         : text file with list of images.
     -r PRIVATE-REGISTRY    : target private registry:port.
     -s                     : save model will be applied. Pull the images in the IMAGES-LIST and save images as a tar.gz file.
     -v KUBERNETES-VERSION  : download kubernetes' binaries. default: v1.17.9
     -h                     : usage message
   ```

5. Download the Kubernetes binary file.

   ```bash
   ./offline-installation-tool.sh -b -v v1.21.5 
   ```

   If you cannot access the object storage service of Google, run the following command instead to add the environment variable to change the source.

   ```bash
   export KKZONE=cn;./offline-installation-tool.sh -b -v v1.21.5 
   ```

   {{< notice note >}}

   - You can change the Kubernetes version downloaded based on your needs. Recommended Kubernetes versions for KubeSphere 3.3.0: v1.19.x or above. If you do not specify a Kubernetes version, KubeKey will install Kubernetes v1.21.5 by default. For more information about supported Kubernetes versions, see [Support Matrix](../kubekey/#support-matrix).

   - After you run the script, a folder `kubekey` is automatically created. Note that this file and `kk` must be placed in the same directory when you create the cluster later.

   {{</ notice >}} 

6. Pull images in `offline-installation-tool.sh`.

   ```bash
   ./offline-installation-tool.sh -s -l images-list.txt -d ./kubesphere-images
   ```

>>>>>>> 3785c2cc (update 3.3 new)
   {{< notice note >}}

   Method 1: Run the following commands to create a Harbor project.

   a. Run the following command to download the specified script to initialize the Harbor registry:

      ```bash
      curl -O https://raw.githubusercontent.com/kubesphere/ks-installer/master/scripts/create_project_harbor.sh
      ```

   b. Run the following command to modify the script configuration file:

      ```bash
      vim create_project_harbor.sh
      ```

      ```yaml
      #!/usr/bin/env bash
      
      # Copyright 2018 The KubeSphere Authors.
      #
      # Licensed under the Apache License, Version 2.0 (the "License");
      # you may not use this file except in compliance with the License.
      # You may obtain a copy of the License at
      #
      #     http://www.apache.org/licenses/LICENSE-2.0
      #
      # Unless required by applicable law or agreed to in writing, software
      # distributed under the License is distributed on an "AS IS" BASIS,
      # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      # See the License for the specific language governing permissions and
      # limitations under the License.
      
      url="https://dockerhub.kubekey.local"  #Change the value of url to https://dockerhub.kubekey.local.
      user="admin"
      passwd="Harbor12345"
      
      harbor_projects=(library
          kubesphereio
          kubesphere
          calico
          coredns
          openebs
          csiplugin
          minio
          mirrorgooglecontainers
          osixia
          prom
          thanosio
          jimmidyson
          grafana
          elastic
          istio
          jaegertracing
          jenkins
          weaveworks
          openpitrix
          joosthofman
          nginxdemos
          fluent
          kubeedge
      )
      
      for project in "${harbor_projects[@]}"; do
          echo "creating $project"
          curl -u "${user}:${passwd}" -X POST -H "Content-Type: application/json" "${url}/api/v2.0/projects" -d "{ \"project_name\": \"${project}\", \"public\": true}" -k #Add -k at the end of the curl command.
      done
      
      ```

   {{< notice note >}}

   - Change the value of **url** to **https://dockerhub.kubekey.local**.

   - The project name of the registry must be the same as that of the image list.

   - Add **-k** at the end of the **curl** command.

   {{</ notice >}}

   c. Run the following commands to create a Harbor project:
   
      ```bash
      chmod +x create_project_harbor.sh
      ```
   
      ```bash
      ./create_project_harbor.sh
      ```
   
   Method 2: Log in to Harbor and create a project. Set the project to **Public**, so that any user can pull images from this project. For more information, please refer to [Create Projects]( https://goharbor.io/docs/1.10/working-with-projects/create-projects/).
   
   ![harbor-login](/images/docs/appstore/built-in-apps/harbor-app/harbor-login.jpg)
   
6. Run the following command again to modify the cluster configuration file：

   ```bash
   vim config-sample.yaml
   ```

   {{< notice note >}}

<<<<<<< HEAD
   - In **auths**, enter **dockerhub.kubekey.local**, username (**admin**) and password (**Harbor12345**).
   - In **privateRegistry**, enter **dockerhub.kubekey.local**.
   - In **namespaceOverride**, enter **kubesphereio**.

    {{</ notice >}}

   ```yaml
     ...
     registry:
       type: harbor
       auths:
         "dockerhub.kubekey.local":
           username: admin
           password: Harbor12345
       plainHTTP: false
       privateRegistry: "dockerhub.kubekey.local"
       namespaceOverride: "kubesphereio"
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```
=======
In this tutorial, KubeSphere is installed on multiple nodes, so you need to specify a configuration file to add host information. Besides, for air-gapped installation, pay special attention to `.spec.registry.privateRegistry`, which must be set to **your own registry address**. See the [complete YAML file](../air-gapped-installation/#2-edit-the-configuration-file) below for more information.
>>>>>>> 3785c2cc (update 3.3 new)

### Create an example configuration file

Execute the following command to generate an example configuration file for installation:
<<<<<<< HEAD

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

For example:

```bash
./kk create config --with-kubernetes v1.21.5 --with-kubesphere v3.3.0 -f config-sample.yaml
```

{{< notice note >}}

- Make sure the Kubernetes version is the one you downloaded.

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.

{{</ notice >}}

### Edit the configuration file

Edit the generated configuration file `config-sample.yaml`. Here is an example for your reference:

{{< notice warning >}} 

For air-gapped installation, you must specify `privateRegistry`, which is `dockerhub.kubekey.local` in this example.

{{</ notice >}}

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Qcloud@123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, password: Qcloud@123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, password: Qcloud@123}
  roleGroups:
    etcd:
    - master
    master:
    - master
    worker:
    - master
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.21.5
    imageRepo: kubesphere
    clusterName: cluster.local
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: dockerhub.kubekey.local  # Add the private image registry address here. 
  addons: []


---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.3.0
spec:
  persistence:
    storageClass: ""
  authentication:
    jwtSecret: ""
  zone: ""
  local_registry: ""
  etcd:
    monitoring: false
    endpointIps: localhost
    port: 2379
    tlsEnable: true
  common:
    redis:
      enabled: false
    redisVolumSize: 2Gi
    openldap:
      enabled: false
    openldapVolumeSize: 2Gi
    minioVolumeSize: 20Gi
    monitoring:
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
    es:
      elasticsearchMasterVolumeSize: 4Gi
      elasticsearchDataVolumeSize: 20Gi
      logMaxAge: 7
      elkPrefix: logstash
      basicAuth:
        enabled: false
        username: ""
        password: ""
      externalElasticsearchUrl: ""
      externalElasticsearchPort: ""
  console:
    enableMultiLogin: true
    port: 30880
  alerting:
    enabled: false
    # thanosruler:
    #   replicas: 1
    #   resources: {}
  auditing:
    enabled: false
  devops:
    enabled: false
    jenkinsMemoryLim: 2Gi
    jenkinsMemoryReq: 1500Mi
    jenkinsVolumeSize: 8Gi
    jenkinsJavaOpts_Xms: 512m
    jenkinsJavaOpts_Xmx: 512m
    jenkinsJavaOpts_MaxRAM: 2g
  events:
    enabled: false
    ruler:
      enabled: true
      replicas: 2
  logging:
    enabled: false
    logsidecar:
      enabled: true
      replicas: 2
  metrics_server:
    enabled: false
  monitoring:
    storageClass: ""
    prometheusMemoryRequest: 400Mi
    prometheusVolumeSize: 20Gi
  multicluster:
    clusterRole: none
  network:
    networkpolicy:
      enabled: false
    ippool:
      type: none
    topology:
      type: none
  notification:
    enabled: false
  openpitrix:
    store:
      enabled: false
  servicemesh:
    enabled: false
  kubeedge:
    enabled: false
    cloudCore:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      cloudhubPort: "10000"
      cloudhubQuicPort: "10001"
      cloudhubHttpsPort: "10002"
      cloudstreamPort: "10003"
      tunnelPort: "10004"
      cloudHub:
        advertiseAddress:
          - ""
        nodeLimit: "100"
      service:
        cloudhubNodePort: "30000"
        cloudhubQuicNodePort: "30001"
        cloudhubHttpsNodePort: "30002"
        cloudstreamNodePort: "30003"
        tunnelNodePort: "30004"
    edgeWatcher:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      edgeWatcherAgent:
        nodeSelector: {"node-role.kubernetes.io/worker": ""}
        tolerations: []
```

{{< notice info >}}

For more information about these parameters, see [Multi-node Installation](../multioverview/#2-edit-the-configuration-file) and [Kubernetes Cluster Configuration](../vars/). To enable pluggable components in `config-sample.yaml`, refer to [Enable Pluggle Components](../../../pluggable-components/) for more details.

{{</ notice >}}


## Step 7: Start Installation

If you have added the flag when creating the sample configuration file, run the following command:

```bash
./kk create cluster -f config-sample.yaml
```

If you have not added the flag when creating the sample configuration file, run the following command:

```bash
./kk create cluster -f config-sample.yaml --with-kubesphere v3.3.0
```

{{< notice warning >}}

After you transfer the executable file `kk` and the folder `kubekey` that contains the Kubernetes binary file to the taskbox machine for installation, they must be placed in the same directory before you execute the command above.

{{</ notice >}}

## Step 8: Verify Installation

When the installation finishes, you can see the content as follows:

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
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

Now, you will be able to access the web console of KubeSphere through `http://{IP}:30880` with the default account and password `admin/P@88w0rd`.

{{< notice note >}}

To access the console, make sure port 30880 is opened in your security group.

{{</ notice >}}

![kubesphere-login](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## Appendix

### Image list of KubeSphere 3.3.0

```txt
##k8s-images
kubesphere/kube-apiserver:v1.22.1
kubesphere/kube-controller-manager:v1.22.1
kubesphere/kube-proxy:v1.22.1
kubesphere/kube-scheduler:v1.22.1
kubesphere/kube-apiserver:v1.21.5
kubesphere/kube-controller-manager:v1.21.5
kubesphere/kube-proxy:v1.21.5
kubesphere/kube-scheduler:v1.21.5
kubesphere/kube-apiserver:v1.20.10
kubesphere/kube-controller-manager:v1.20.10
kubesphere/kube-proxy:v1.20.10
kubesphere/kube-scheduler:v1.20.10
kubesphere/kube-apiserver:v1.19.9
kubesphere/kube-controller-manager:v1.19.9
kubesphere/kube-proxy:v1.19.9
kubesphere/kube-scheduler:v1.19.9
kubesphere/pause:3.5
kubesphere/pause:3.4.1
coredns/coredns:1.8.0
calico/cni:v3.20.0
calico/kube-controllers:v3.20.0
calico/node:v3.20.0
calico/pod2daemon-flexvol:v3.20.0
calico/typha:v3.20.0
kubesphere/flannel:v0.12.0
openebs/provisioner-localpv:2.10.1
openebs/linux-utils:2.10.0
kubesphere/k8s-dns-node-cache:1.15.12
##kubesphere-images
kubesphere/ks-installer:v3.3.0
kubesphere/ks-apiserver:v3.3.0
kubesphere/ks-console:v3.3.0
kubesphere/ks-controller-manager:v3.3.0
kubesphere/kubectl:v1.20.0
kubesphere/kubefed:v0.8.1
kubesphere/tower:v0.2.0
minio/minio:RELEASE.2019-08-07T01-59-21Z
minio/mc:RELEASE.2019-08-07T23-14-43Z
csiplugin/snapshot-controller:v4.0.0
kubesphere/nginx-ingress-controller:v0.48.1
mirrorgooglecontainers/defaultbackend-amd64:1.4
kubesphere/metrics-server:v0.4.2
redis:5.0.14-alpine
haproxy:2.0.25-alpine
alpine:3.14
osixia/openldap:1.3.0
kubesphere/netshoot:v1.0
##kubeedge-images
kubeedge/cloudcore:v1.7.2
kubesphere/edge-watcher:v0.1.1
kubesphere/edge-watcher-agent:v0.1.0
##gatekeeper-images
openpolicyagent/gatekeeper:v3.5.2
##openpitrix-images
kubesphere/openpitrix-jobs:v3.3.0
##kubesphere-devops-images
kubesphere/devops-apiserver:v3.3.0
kubesphere/devops-controller:v3.3.0
kubesphere/devops-tools:v3.3.0
kubesphere/ks-jenkins:v3.2.0-2.249.1
jenkins/jnlp-slave:3.27-1
kubesphere/builder-base:v3.2.0
kubesphere/builder-nodejs:v3.2.0
kubesphere/builder-maven:v3.2.0
kubesphere/builder-python:v3.2.0
kubesphere/builder-go:v3.2.0
kubesphere/builder-go:v3.2.0
kubesphere/builder-base:v3.2.0-podman
kubesphere/builder-nodejs:v3.2.0-podman
kubesphere/builder-maven:v3.2.0-podman
kubesphere/builder-python:v3.2.0-podman
kubesphere/builder-go:v3.2.0-podman
kubesphere/builder-go:v3.2.0-podman
kubesphere/s2ioperator:v3.2.0
kubesphere/s2irun:v3.2.0
kubesphere/s2i-binary:v3.2.0
kubesphere/tomcat85-java11-centos7:v3.2.0
kubesphere/tomcat85-java11-runtime:v3.2.0
kubesphere/tomcat85-java8-centos7:v3.2.0
kubesphere/tomcat85-java8-runtime:v3.2.0
kubesphere/java-11-centos7:v3.2.0
kubesphere/java-8-centos7:v3.2.0
kubesphere/java-8-runtime:v3.2.0
kubesphere/java-11-runtime:v3.2.0
kubesphere/nodejs-8-centos7:v3.2.0
kubesphere/nodejs-6-centos7:v3.2.0
kubesphere/nodejs-4-centos7:v3.2.0
kubesphere/python-36-centos7:v3.2.0
kubesphere/python-35-centos7:v3.2.0
kubesphere/python-34-centos7:v3.2.0
kubesphere/python-27-centos7:v3.2.0
##kubesphere-monitoring-images
jimmidyson/configmap-reload:v0.3.0
prom/prometheus:v2.26.0
kubesphere/prometheus-config-reloader:v0.43.2
kubesphere/prometheus-operator:v0.43.2
kubesphere/kube-rbac-proxy:v0.8.0
kubesphere/kube-state-metrics:v1.9.7
prom/node-exporter:v0.18.1
kubesphere/k8s-prometheus-adapter-amd64:v0.6.0
prom/alertmanager:v0.21.0
thanosio/thanos:v0.18.0
grafana/grafana:7.4.3
kubesphere/kube-rbac-proxy:v0.8.0
kubesphere/notification-manager-operator:v1.4.0
kubesphere/notification-manager:v1.4.0
kubesphere/notification-tenant-sidecar:v3.2.0
##kubesphere-logging-images
kubesphere/elasticsearch-curator:v5.7.6
kubesphere/elasticsearch-oss:6.7.0-1
kubesphere/fluentbit-operator:v0.11.0
docker:19.03
kubesphere/fluent-bit:v1.8.3
kubesphere/log-sidecar-injector:1.1
elastic/filebeat:6.7.0
kubesphere/kube-events-operator:v0.3.0
kubesphere/kube-events-exporter:v0.3.0
kubesphere/kube-events-ruler:v0.3.0
kubesphere/kube-auditing-operator:v0.2.0
kubesphere/kube-auditing-webhook:v0.2.0
##istio-images
istio/pilot:1.11.1
istio/proxyv2:1.11.1
jaegertracing/jaeger-operator:1.27
jaegertracing/jaeger-agent:1.27
jaegertracing/jaeger-collector:1.27
jaegertracing/jaeger-query:1.27
jaegertracing/jaeger-es-index-cleaner:1.27
kubesphere/kiali-operator:v1.38.1
kubesphere/kiali:v1.38
##example-images
busybox:1.31.1
nginx:1.14-alpine
joosthofman/wget:1.0
nginxdemos/hello:plain-text
wordpress:4.8-apache
mirrorgooglecontainers/hpa-example:latest
java:openjdk-8-jre-alpine
fluent/fluentd:v1.4.2-2.0
perl:latest
kubesphere/examples-bookinfo-productpage-v1:1.16.2
kubesphere/examples-bookinfo-reviews-v1:1.16.2
kubesphere/examples-bookinfo-reviews-v2:1.16.2
kubesphere/examples-bookinfo-details-v1:1.16.2
kubesphere/examples-bookinfo-ratings-v1:1.16.3
##weave-scope-images
weaveworks/scope:1.13.0
```

=======

```bash
./kk create config [--with-kubernetes version] [--with-kubesphere version] [(-f | --file) path]
```

For example:

```bash
./kk create config --with-kubernetes v1.21.5 --with-kubesphere v3.3.0 -f config-sample.yaml
```

{{< notice note >}}

- Make sure the Kubernetes version is the one you downloaded.

- If you do not add the flag `--with-kubesphere` in the command in this step, KubeSphere will not be deployed unless you install it using the `addons` field in the configuration file or add this flag again when you use `./kk create cluster` later.

{{</ notice >}}

### Edit the configuration file

Edit the generated configuration file `config-sample.yaml`. Here is an example for your reference:

{{< notice warning >}} 

For air-gapped installation, you must specify `privateRegistry`, which is `dockerhub.kubekey.local` in this example.

{{</ notice >}}

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Qcloud@123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, password: Qcloud@123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, password: Qcloud@123}
  roleGroups:
    etcd:
    - master
    master:
    - master
    worker:
    - master
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.21.5
    imageRepo: kubesphere
    clusterName: cluster.local
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: dockerhub.kubekey.local  # Add the private image registry address here. 
  addons: []


---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.3.0
spec:
  persistence:
    storageClass: ""
  authentication:
    jwtSecret: ""
  zone: ""
  local_registry: ""
  etcd:
    monitoring: false
    endpointIps: localhost
    port: 2379
    tlsEnable: true
  common:
    redis:
      enabled: false
    redisVolumSize: 2Gi
    openldap:
      enabled: false
    openldapVolumeSize: 2Gi
    minioVolumeSize: 20Gi
    monitoring:
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
    es:
      elasticsearchMasterVolumeSize: 4Gi
      elasticsearchDataVolumeSize: 20Gi
      logMaxAge: 7
      elkPrefix: logstash
      basicAuth:
        enabled: false
        username: ""
        password: ""
      externalElasticsearchUrl: ""
      externalElasticsearchPort: ""
  console:
    enableMultiLogin: true
    port: 30880
  alerting:
    enabled: false
    # thanosruler:
    #   replicas: 1
    #   resources: {}
  auditing:
    enabled: false
  devops:
    enabled: false
    jenkinsMemoryLim: 2Gi
    jenkinsMemoryReq: 1500Mi
    jenkinsVolumeSize: 8Gi
    jenkinsJavaOpts_Xms: 512m
    jenkinsJavaOpts_Xmx: 512m
    jenkinsJavaOpts_MaxRAM: 2g
  events:
    enabled: false
    ruler:
      enabled: true
      replicas: 2
  logging:
    enabled: false
    logsidecar:
      enabled: true
      replicas: 2
  metrics_server:
    enabled: false
  monitoring:
    storageClass: ""
    prometheusMemoryRequest: 400Mi
    prometheusVolumeSize: 20Gi
  multicluster:
    clusterRole: none
  network:
    networkpolicy:
      enabled: false
    ippool:
      type: none
    topology:
      type: none
  notification:
    enabled: false
  openpitrix:
    store:
      enabled: false
  servicemesh:
    enabled: false
  kubeedge:
    enabled: false
    cloudCore:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      cloudhubPort: "10000"
      cloudhubQuicPort: "10001"
      cloudhubHttpsPort: "10002"
      cloudstreamPort: "10003"
      tunnelPort: "10004"
      cloudHub:
        advertiseAddress:
          - ""
        nodeLimit: "100"
      service:
        cloudhubNodePort: "30000"
        cloudhubQuicNodePort: "30001"
        cloudhubHttpsNodePort: "30002"
        cloudstreamNodePort: "30003"
        tunnelNodePort: "30004"
    edgeWatcher:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      edgeWatcherAgent:
        nodeSelector: {"node-role.kubernetes.io/worker": ""}
        tolerations: []
```

{{< notice info >}}

For more information about these parameters, see [Multi-node Installation](../multioverview/#2-edit-the-configuration-file) and [Kubernetes Cluster Configuration](../vars/). To enable pluggable components in `config-sample.yaml`, refer to [Enable Pluggle Components](../../../pluggable-components/) for more details.

{{</ notice >}}


## Step 7: Start Installation

If you have added the flag when creating the sample configuration file, run the following command:

```bash
./kk create cluster -f config-sample.yaml
```

If you have not added the flag when creating the sample configuration file, run the following command:

```bash
./kk create cluster -f config-sample.yaml --with-kubesphere v3.3.0
```

{{< notice warning >}}

After you transfer the executable file `kk` and the folder `kubekey` that contains the Kubernetes binary file to the taskbox machine for installation, they must be placed in the same directory before you execute the command above.

{{</ notice >}}

## Step 8: Verify Installation

When the installation finishes, you can see the content as follows:

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
     the "Cluster Management". If any service is not
     ready, please wait patiently until all components
     are up and running.
  2. Please change the default password after login.

#####################################################
https://kubesphere.io             20xx-xx-xx xx:xx:xx
#####################################################
```

Now, you will be able to access the web console of KubeSphere through `http://{IP}:30880` with the default account and password `admin/P@88w0rd`.

{{< notice note >}}

    {{</ notice >}}
7. Run the following command to install a KubeSphere cluster:

   ```bash
   ./kk create cluster -f config-sample1.yaml -a kubesphere.tar.gz --with-packages
   ```

   The parameters are explained as follows：

>>>>>>> 3785c2cc (update 3.3 new)

8. Run the following command to view the cluster status:

   ```bash
   $ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
   ```

   After the installation is completed, the following information is displayed:

   ```bash
   **************************************************
   #####################################################
   ###              Welcome to KubeSphere!           ###
   #####################################################
   
   Console: http://192.168.149.133:30880
   Account: admin
   Password: P@88w0rd
   
   NOTES：
   1. After you log into the console, please check the
   monitoring status of service components in
   the "Cluster Management". If any service is not
   ready, please wait patiently until all components
   are up and running.
   1. Please change the default password after login.
   
   #####################################################
   https://kubesphere.io             2022-02-28 23:30:06
   #####################################################
   ```

9.  Access KubeSphere's web console at `http://{IP}:30880` using the default account and password `admin/P@88w0rd`.

   ![login](/images/docs/installing-on-kubernetes/introduction/overview/login.png)

   {{< notice note >}}

   To access the console, make sure that port 30880 is enabled in your security group.
   
   {{</ notice >}}