---
title: "Minimal KubeSphere on Minikube"
keywords: 'KubeSphere, Minikube, Minimal, Installation'
description: 'Install KubeSphere on an existing Minikube cluster with a minimal installation package.'
linkTitle: "Minimal KubeSphere on Minikube"
weight: 2200,
showSubscribe: true
---

In addition to installing KubeSphere on a Linux machine, you can also deploy it on minikube cluster. This tutorial demonstrates the general steps of completing a minimal KubeSphere installation on Minikube.

## Prerequisites

- To install KubeSphere 3.2.1 on Minikube, your Minikube version must be v1.23.x, v1.24.x, v1.25.x.
- Make sure your machine meets the minimal hardware requirement: CPU > 2 Core, Memory > 2 GB, 20GB free disk space, Container or virtual machine manager, such as: Docker, Hyperkit, Hyper-V, KVM, Parallels, Podman, VirtualBox, or VMware Fusion/Workstation.
- A **default** Storage Class in your Minikube cluster needs to be configured before the installation.

{{< notice note >}}

- The CSR signing feature is activated in `kube-apiserver` when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters. See [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).
- For more information about the prerequisites of installing KubeSphere on Minikube, see [Prerequisites](../../installing-on-minikube/prerequisites).

{{</ notice >}}

## Video Demonstration

{{< youtube gROOqfupRII>}}

## Deploy KubeSphere

After you make sure your machine meets the conditions, perform the following steps to install KubeSphere.

1. Start minikube.

    ``` bash
    ❯ minikube start
    😄  minikube v1.24.0 on Debian 10.1
    🎉  minikube 1.25.2 is available! Download it: https://github.com/kubernetes/minikube/releases/tag/v1.25.2
    💡  To disable this notice, run: 'minikube config set WantUpdateNotification false'

    ✨  Using the docker driver based on existing profile
    👍  Starting control plane node minikube in cluster minikube
    🚜  Pulling base image ...
    🔄  Restarting existing docker container for "minikube" ...
    🐳  Preparing Kubernetes v1.22.3 on Docker 20.10.8 ...
    🔎  Verifying Kubernetes components...
        ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
    🌟  Enabled addons: storage-provisioner, default-storageclass
    🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
    ```

2. Run the following commands to start installation:

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.2.1/kubesphere-installer.yaml
    
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.2.1/cluster-configuration.yaml
    ```

3. After KubeSphere is successfully installed, you can run the following command to view the installation logs:

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
    ```

4. Use `kubectl get pod --all-namespaces` to see whether all Pods are running normally in relevant namespaces of KubeSphere. If they are, check the port (`30880` by default) of the console by running the following command:

    ```bash
    kubectl get svc/ks-console -n kubesphere-system
    ```

5. Make sure port `30880` is opened in your security group and access the web console through the NodePort (`IP:30880`) with the default account and password (`admin/P@88w0rd`).

6. After logging in to the console, you can check the status of different components in **System Components**. You may need to wait for some components to be up and running if you want to use related services.

## Enable Pluggable Components (Optional)

This guide is used only for the minimal installation by default. For more information about how to enable other components in KubeSphere, see [Enable Pluggable Components](../../pluggable-components/).

## Code Demonstration

<script id="asciicast-489562" src="https://asciinema.org/a/489562.js" async></script>
