---
title: "Deploy KubeSphere on Oracle OKE"
keywords: 'Kubernetes, KubeSphere, OKE, Installation, Oracle-cloud'
description: 'Learn how to deploy KubeSphere on Oracle Cloud Infrastructure Container Engine for Kubernetes.'

weight: 4260
---

This guide walks you through the steps of deploying KubeSphere on [Oracle Kubernetes Engine](https://www.oracle.com/cloud/compute/container-engine-kubernetes.html).

## Create a Kubernetes Cluster

- A standard Kubernetes cluster in OKE is a prerequisite of installing KubeSphere. Go to the navigation menu and refer to the image below to create a cluster.

  ![oke-cluster](https://ap3.qingstor.com/kubesphere-website/docs/oke-cluster.jpg)

- In the pop-up window, select **Quick Create** and click **Launch Workflow**.

  ![oke-quickcreate](https://ap3.qingstor.com/kubesphere-website/docs/oke-quickcreate.jpg)

  {{< notice note >}}

  In this example, **Quick Create** is used for demonstration which will automatically create all the resources necessary for a cluster in Oracle Cloud. If you select **Custom Create**, you need to create all the resources (such as VCN and LB Subnets) by yourself.

  {{</ notice >}}

- Next, you need to set the cluster with basic information. Here is an example for your reference. When you finish, click **Next**.

  ![set-basic-info](https://ap3.qingstor.com/kubesphere-website/docs/cluster-setting.jpg)

  {{< notice note >}}

  - To install KubeSphere 3.3 on Kubernetes, your Kubernetes version must be v1.19.x, v1.20.x, v1.21.x, v1.22.x, and v1.23.x (experimental support).
  - It is recommended that you should select **Public** for **Visibility Type**, which will assign a public IP address for every node. The IP address can be used later to access the web console of KubeSphere.
  - In Oracle Cloud, a Shape is a template that determines the number of CPUs, amount of memory, and other resources that are allocated to an instance. `VM.Standard.E2.2 (2 CPUs and 16G Memory)` is used in this example. For more information, see [Standard Shapes](https://docs.cloud.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm#vmshapes__vm-standard).
  - 3 nodes are included in this example. You can add more nodes based on your own needs especially in a production environment.

  {{</ notice >}}

- Review cluster information and click **Create Cluster** if no adjustment is needed.

  ![create-cluster](https://ap3.qingstor.com/kubesphere-website/docs/create-cluster.jpg)

- After the cluster is created, click **Close**.

  ![cluster-ready](https://ap3.qingstor.com/kubesphere-website/docs/cluster-ready.jpg)

- Make sure the Cluster Status is **Active** and click **Access Cluster**.

  ![access-cluster](https://ap3.qingstor.com/kubesphere-website/docs/access-cluster.jpg)

- In the pop-up window, select **Cloud Shell Access** to access the cluster. Click **Launch Cloud Shell** and copy the code provided by Oracle Cloud.

  ![cloud-shell-access](https://ap3.qingstor.com/kubesphere-website/docs/cloudshell-access.png)

- In Cloud Shell, paste the command so that we can execute the installation command later.

  ![cloud-shell-oke](https://ap3.qingstor.com/kubesphere-website/docs/oke-cloud-shell.png)

  {{< notice warning >}}

  If you do not copy and execute the command above, you cannot proceed with the steps below.

  {{</ notice >}}

## Install KubeSphere on OKE

- Install KubeSphere using kubectl. The following commands are only for the default minimal installation.

  ```bash
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml

  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
  ```

- Inspect the logs of installation:

  ```bash
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
  ```

- When the installation finishes, you can see the following message:

  ```yaml
  #####################################################
  ###              Welcome to KubeSphere!           ###
  #####################################################

  Console: http://10.0.10.2:30880
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
  ```

## Access KubeSphere Console

Now that KubeSphere is installed, you can access the web console of KubeSphere either through `NodePort` or `LoadBalancer`.

- Check the service of KubeSphere console through the following command:

  ```bash
  kubectl get svc -n kubesphere-system
  ```

- The output may look as below. You can change the type to `LoadBalancer` so that the external IP address can be exposed.

  ![console-nodeport](https://ap3.qingstor.com/kubesphere-website/docs/nodeport-console.jpg)

  {{< notice tip >}}

  It can be seen above that the service `ks-console` is being exposed through a NodePort, which means you can access the console directly via `NodeIP:NodePort` (the public IP address of any node is applicable). You may need to open port `30880` in firewall rules.

  {{</ notice >}}

- Execute the command to edit the service configuration.

  ```bash
  kubectl edit svc ks-console -o yaml -n kubesphere-system
  ```

- Navigate to `type` and change `NodePort` to `LoadBalancer`. Save the configuration after you finish.

  ![change-svc-type](https://ap3.qingstor.com/kubesphere-website/docs/change-service-type.png)

- Execute the following command again and you can see the IP address displayed as below.

  ```bash
  kubectl get svc -n kubesphere-system
  ```

  ![console-service](https://ap3.qingstor.com/kubesphere-website/docs/console-service.png)

- Log in to the console through the external IP address with the default account and password (`admin/P@88w0rd`). In the cluster overview page, you can see the dashboard.

## Enable Pluggable Components (Optional)

The example above demonstrates the process of a default minimal installation. To enable other components in KubeSphere, see [Enable Pluggable Components](../../../pluggable-components/) for more details.
