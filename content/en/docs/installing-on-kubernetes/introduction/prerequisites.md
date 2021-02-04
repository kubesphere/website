---
title: "Prerequisites"
keywords: "KubeSphere, Kubernetes, Installation, Prerequisites"
description: "The prerequisites of installing KubeSphere on existing Kubernetes"
linkTitle: "Prerequisites"
weight: 4120
---

You can install KubeSphere on virtual machines and bare metal with Kubernetes also provisioned. In addition, KubeSphere can also be deployed on cloud-hosted and on-premises Kubernetes clusters as long as your Kubernetes cluster meets the prerequisites below.

- Kubernetes version: 1.15.x, 1.16.x, 1.17.x, 1.18.x.
- Avaiable CPU > 1 Core and Memory > 2 G.
- A **default** StorageClass in your Kubernetes cluster is configured; use `kubectl get sc` to verify it.
- The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters. See [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

## Pre-checks

1. Make sure your Kubernetes version is compatible by running `kubectl version` in your cluster node. The output may look as below:

    ```bash
    $ kubectl version
    Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
    Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
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
