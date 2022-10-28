---
title: "Prerequisites"
keywords: "KubeSphere, Kubernetes, Installation, Prerequisites"
description: "Make sure your environment where an existing Kubernetes cluster runs meets the prerequisites before installation."
linkTitle: "Prerequisites"
weight: 4120
---

You can install KubeSphere on virtual machines and bare metal with Kubernetes also provisioned. In addition, KubeSphere can also be deployed on cloud-hosted and on-premises Kubernetes clusters as long as your Kubernetes cluster meets the prerequisites below.

- To install KubeSphere 3.3 on Kubernetes, your Kubernetes version must be v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).
- Available CPU > 1 Core and Memory > 2 G. Only x86_64 CPUs are supported, and Arm CPUs are not fully supported at present.
- A **default** StorageClass in your Kubernetes cluster is configured; use `kubectl get sc` to verify it.
- The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters. See [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

## Pre-checks

1. Make sure your Kubernetes version is compatible by running `kubectl version` in your cluster node. The output may look as below:

    ```bash
    $ kubectl version
    Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.8", GitCommit:"fd5d41537aee486160ad9b5356a9d82363273721", GitTreeState:"clean", BuildDate:"2021-02-17T12:41:51Z", GoVersion:"go1.15.8", Compiler:"gc", Platform:"linux/amd64"}
    Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.8", GitCommit:"fd5d41537aee486160ad9b5356a9d82363273721", GitTreeState:"clean", BuildDate:"2021-02-17T12:33:08Z", GoVersion:"go1.15.8", Compiler:"gc", Platform:"linux/amd64"}
    ```

    {{< notice note >}}
Pay attention to the `Server Version` line. If `GitVersion` shows an older one, you need to upgrade Kubernetes first.
    {{</ notice >}}

2. Check if the available resources in your cluster meet the minimum requirements.

    ```bash
    $ free -g
                total        used        free      shared  buff/cache   available
    Mem:              16          4          10           0           3           2
    Swap:             0           0           0
    ```

3. Check if there is a **default** StorageClass in your cluster. An existing default StorageClass is a prerequisite for KubeSphere installation.

    ```bash
    $ kubectl get sc
    NAME                      PROVISIONER               AGE
    glusterfs (default)       kubernetes.io/glusterfs   3d4h
    ```

If your Kubernetes cluster environment meets all the requirements above, then you are ready to deploy KubeSphere on your existing Kubernetes cluster.

For more information, see [Overview](../overview/).
