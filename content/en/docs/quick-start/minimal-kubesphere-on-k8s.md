---
title: "Minimal KubeSphere on Kubernetes"
keywords: 'KubeSphere, Kubernetes, Minimal, Installation'
description: 'Minimal Installation of KubeSphere on Kubernetes'

linkTitle: "Minimal KubeSphere on Kubernetes"
weight: 3020
---

In addition to installing KubeSphere on a Linux machine, you can also deploy it on existing Kubernetes clusters directly. This QuickStart guide walks you through the general steps of completing a minimal KubeSphere installation on Kubernetes. For more information, see [Installing on Kubernetes](../../installing-on-kubernetes/).

{{< notice note >}}

- To install KubeSphere on Kubernetes, your Kubernetes version must be `1.15.x, 1.16.x, 1.17.x, or 1.18.x`;
- Make sure your machine meets the minimal hardware requirement: CPU > 1 Core, Memory > 2 G;
- A default Storage Class in your Kubernetes cluster needs to be configured before the installation;
- The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters. See [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).
- For more information about the prerequisites of installing KubeSphere on Kubernetes, see [Prerequisites](../../installing-on-kubernetes/introduction/prerequisites/).

{{</ notice >}}

## Deploy KubeSphere

After you make sure your machine meets the prerequisites, you can follow the steps below to install KubeSphere.

- Execute the following commands:

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml

kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

- Inspect the logs of installation:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

- Use `kubectl get pod --all-namespaces` to see whether all pods are running normally in relevant namespaces of KubeSphere. If they are, check the port (30880 by default) of the console through the following command:

```bash
kubectl get svc/ks-console -n kubesphere-system
```

- Make sure port 30880 is opened in security groups and access the web console through the NodePort (`IP:30880`) with the default account and password (`admin/P@88w0rd`).
- After logging in the console, you can check the status of different components in **Components**. You may need to wait for some components to be up and running if you want to use related services.

![components](/images/docs/quickstart/kubesphere-components.png)

## Enable Pluggable Components (Optional)

The guide above is used only for minimal installation by default. To enable other components in KubeSphere, see [Enable Pluggable Components](../../pluggable-components/) for more details.

## Demo
<script src="https://asciinema.org/a/362122.js" id="asciicast-362122" async></script>
