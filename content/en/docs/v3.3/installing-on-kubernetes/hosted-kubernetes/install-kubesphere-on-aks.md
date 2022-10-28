---
title: "Deploy KubeSphere on AKS"
keywords: "KubeSphere, Kubernetes, Installation, Azure, AKS"
description: "Learn how to deploy KubeSphere on Azure Kubernetes Service."

weight: 4210
---

This guide walks you through the steps of deploying KubeSphere on [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/).

## Prepare an AKS cluster

Azure can help you implement infrastructure as code by providing resource deployment automation options. Commonly adopted tools include [ARM templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) and [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/what-is-azure-cli?view=azure-cli-latest). In this guide, we will use Azure CLI to create all the resources that are needed for the installation of KubeSphere.

### Use Azure Cloud Shell

You don't have to install Azure CLI on your machine as Azure provides a web-based terminal. Click the Cloud Shell button on the menu bar at the upper-right corner in Azure portal.

![Cloud Shell](/images/docs/v3.3/aks/aks-launch-icon.png)

Select **Bash** Shell.

![Bash Shell](/images/docs/v3.3/aks/aks-choices-bash.png)

### Create a Resource Group

An Azure resource group is a logical group in which Azure resources are deployed and managed. The following example creates a resource group named `KubeSphereRG` in the location `westus`.

```bash
az group create --name KubeSphereRG --location westus
```

### Create an AKS Cluster

Use the command `az aks create` to create an AKS cluster. The following example creates a cluster named `KuberSphereCluster` with three nodes. This will take several minutes to complete.

```bash
az aks create --resource-group KubeSphereRG --name KuberSphereCluster --node-count 3 --enable-addons monitoring --generate-ssh-keys
```

{{< notice note >}}

You can use `--node-vm-size` or `-s` option to change the size of Kubernetes nodes. The default node size is Standard_DS2_v2 (2vCPU, 7GB memory). For more options, see [az aks create](https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-create).

{{</ notice >}}

### Connect to the Cluster

To configure kubectl to connect to the Kubernetes cluster, use the command `az aks get-credentials`. This command downloads the credentials and configures that the Kubernetes CLI will use.

```bash
az aks get-credentials --resource-group KubeSphereRG --name KuberSphereCluster
```

```bash
$ kubectl get nodes
NAME                                STATUS   ROLES   AGE   VERSION
aks-nodepool1-23754246-vmss000000   Ready    agent   38m   v1.16.13
```

### Check Azure Resources in the Portal

After you execute all the commands above, you can see there are 2 Resource Groups created in Azure Portal.

![Resource groups](/images/docs/v3.3/aks/aks-create-command.png)

Azure Kubernetes Services itself will be placed in `KubeSphereRG`.

![Azure Kubernetes Services](/images/docs/v3.3/aks/aks-dashboard.png)

All the other Resources will be placed in `MC_KubeSphereRG_KuberSphereCluster_westus`, such as VMs, Load Balancer and Virtual Network.

![Azure Kubernetes Services](/images/docs/v3.3/aks/aks-all-resources.png)

## Deploy KubeSphere on AKS

To start deploying KubeSphere, use the following commands.

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml

kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
```

You can inspect the logs of installation through the following command:

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

## Access KubeSphere Console

To access KubeSphere console from a public IP address, you need to change the service type to `LoadBalancer`.

```bash
kubectl edit service ks-console -n kubesphere-system
```

Find the following section and change the type to `LoadBalancer`.

```yaml
spec:
  clusterIP: 10.0.78.113
  externalTrafficPolicy: Cluster
  ports:
  - name: nginx
    nodePort: 30880
    port: 80
    protocol: TCP
    targetPort: 8000
  selector:
    app: ks-console
    tier: frontend
    version: v3.0.0
  sessionAffinity: None
  type: LoadBalancer # Change NodePort to LoadBalancer
status:
  loadBalancer: {}
```

After saving the configuration of ks-console service, you can use the following command to get the public IP address (under `EXTERNAL-IP`). Use the IP address to access the console with the default account and password (`admin/P@88w0rd`).

```bash
$ kubectl get svc/ks-console -n kubesphere-system
NAME         TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
ks-console   LoadBalancer   10.0.181.93   13.86.xxx.xxx   80:30194/TCP   13m       6379/TCP       10m
```

## Enable Pluggable Components (Optional)

The example above demonstrates the process of a default minimal installation. For pluggable components, you can enable them either before or after the installation. See [Enable Pluggable Components](../../../pluggable-components/) for details.
