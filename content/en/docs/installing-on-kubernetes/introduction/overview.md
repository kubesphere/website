---
title: "Overview"
keywords: "KubeSphere, Kubernetes, Installation"
description: "Overview of KubeSphere Installation on Kubernetes"

linkTitle: "Overview"
weight: 2105
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

As part of KubeSphere's commitment to provide a plug-and-play architecture for users, it can be easily installed on existing Kubernetes clusters. More specifically, KubeSphere can be deployed on Kubernetes either hosted on clouds (e.g. AWS EKS, QingCloud QKE and Google GKE) or on-premises. This is because KubeSphere does not hack Kubernetes itself. It only interacts with the Kubernetes API to manage Kubernetes cluster resources. In other words, KubeSphere can be installed on any native Kubernetes cluster and Kubernetes distribution.

This section gives you an overview of the general steps of installing KubeSphere on Kubernetes. For more information about the specific way of installation in different environments, see Installing on Hosted Kubernetes and Installing on On-premises Kubernetes.

{{< notice note >}} 

Please read the prerequisites before you install KubeSphere on existing Kubernetes clusters.

{{</ notice >}}

## Deploy KubeSphere

After you make sure your existing Kubernetes cluster meets all the requirements, you can use kubectl to trigger the default minimal installation of KubeSphere.

- Execute the following commands to start installation:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml
```

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml
```

{{< notice note >}} 

If your server has trouble accessing GitHub, you can copy the content in [kubesphere-installer.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml) and [cluster-configuration.yaml](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) respectively and past it to local files. You then can use `kubectl apply -f` for the local files to install KubeSphere.

{{</ notice >}}

- Inspect the logs of installation:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

{{< notice tip >}} 

In some environments, you may find the installation process stopped by issues related to `metrics_server`, as some cloud providers have already installed metrics server in their platform. In this case, please manually create a local cluster-configuration.yaml file (copy the [content](https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml) to it). In this file, disable `metrics_server` by changing `true` to `false` for `enabled`, and use `kubectl apply -f cluster-configuration.yaml` to execute it.

{{</ notice >}}

- Use `kubectl get pod --all-namespaces` to see whether all pods are running normally in relevant namespaces of KubeSphere. If they are, check the port (30880 by default) of the console through the following command:

```bash
kubectl get svc/ks-console -n kubesphere-system
```

- Make sure port 30880 is opened in security groups and access the web console through the NodePort (`IP:30880`) with the default account and password (`admin/P@88w0rd`).

![kubesphere-console](https://ap3.qingstor.com/kubesphere-website/docs/login.png)

## Enable Pluggable Components (Optional)

If you start with a default minimal installation, refer to Enable Pluggable Components to install other components.

{{< notice tip >}}

- Pluggable components can be enabled either before or after the installation. Please refer to the example file [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml) for more details.
- Make sure there is enough CPU and memory available in your cluster.
- It is highly recommended that you install these pluggable components to discover the full-stack features and capabilities provided by KubeSphere.

{{</ notice >}}


