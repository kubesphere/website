---
title: "Prerequisites for Minikube"
keywords: "KubeSphere, Minikube, Installation, Prerequisites"
description: "Make sure your environment where an existing Minikube cluster runs meets the prerequisites before installation."
linkTitle: "Prerequisites for Minikube"
weight: 4120
---


- To install KubeSphere 3.2.1 on Minikube, your Minikube version must be v1.23.x, v1.24.x, v1.25.x.
- Make sure your machine meets the minimal hardware requirement: CPU > 2 Core, Memory > 2 GB, 20GB free disk space, Container or virtual machine manager, such as: Docker, Hyperkit, Hyper-V, KVM, Parallels, Podman, VirtualBox, or VMware Fusion/Workstation.
- A **default** Storage Class in your Minikube cluster needs to be configured before the installation; use `kubectl get sc` to verify it.
- The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters. See [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

## Pre-checks

1. Make sure your minikube version is compatible by running `minikube version` in your terminal. The output may look as below:

    ```bash
    ❯ minikube version
    minikube version: v1.24.0
    commit: 76b94fb3c4e8ac5062daf70d60cf03ddcc0a741b

    ```

2. Check if the available resources in your cluster meet the minimum requirements.

    ```bash
    ❯ free -g
                     total        used        free      shared  buff/cache   available
    Mem:              6           2           2           0           1           3
    Swap:             0           0           0
    ## Memory > 2GB 
    ❯ lscpu
    Architecture:        x86_64
    CPU op-mode(s):      32-bit, 64-bit
    Byte Order:          Little Endian
    Address sizes:       40 bits physical, 48 bits virtual
    CPU(s):              4
    ## More than 2 CPUs
    ❯ df -h
    Filesystem      Size  Used Avail Use% Mounted on
    udev            3.4G     0  3.4G   0% /dev
    tmpfs           694M  2.6M  692M   1% /run
    /dev/sda3       198G  116G   73G  62% /             ## Available more than 20GB free disk space


    ```

3. Make sure your Kubectl version is compatible by running `kubectl version` in your minikube cluster node. The output may look as below:

    ```bash
   ❯ kubectl version
    Client Version: version.Info{Major:"1", Minor:"23", GitVersion:"v1.23.1", GitCommit:"86ec240af8cbd1b60bcc4c03c20da9b98005b92e", GitTreeState:"clean", BuildDate:"2021-12-16T11:41:01Z", GoVersion:"go1.17.5", Compiler:"gc", Platform:"linux/amd64"}
    Server Version: version.Info{Major:"1", Minor:"22", GitVersion:"v1.22.3", GitCommit:"c92036820499fedefec0f847e2054d824aea6cd1", GitTreeState:"clean", BuildDate:"2021-10-27T18:35:25Z", GoVersion:"go1.16.9", Compiler:"gc", Platform:"linux/amd64"}

    ```

    {{< notice note >}}
Pay attention to the `Server Version` line. If `GitVersion` shows an older one, you need to upgrade Kubectl first.
    {{</ notice >}}
4. Check if there is a **default** StorageClass in your cluster. An existing default StorageClass is a prerequisite for KubeSphere installation.

    ```bash
    $ kubectl get sc
    NAME                      PROVISIONER               AGE
    glusterfs (default)       kubernetes.io/glusterfs   3d4h
    ```

If your Minikube cluster environment meets all the requirements above, then you are ready to deploy KubeSphere on your Minikube.
