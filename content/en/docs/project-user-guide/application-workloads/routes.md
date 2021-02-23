---
title: "Routes"
keywords: "KubeSphere, Kubernetes, Route, Ingress"
description: "How to create a Route in KubeSphere"
weight: 10270
---

This document describes how to create, use, and edit a Route on KubeSphere.

A Route on KubeSphere is the same as an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress) on Kubernetes. You can use a Route and a single IP address to aggregate and expose multiple services.

## Prerequisites

- You need to create a workspace, a project and an account (for example, `project-admin`). The role of the account in the project must be `admin`. For more information, see [Create Workspaces, Projects, Accounts and Roles](/docs/quick-start/create-workspace-and-project/).
- If the Route is to be accessed in HTTPS mode, you need to [create a Secret](/docs/project-user-guide/configuration/secrets/) that contains the `tls.crt` (TLS certificate) and `tls.key` (TLS private key) keys used for encryption.
- You need to [create at least one service](/docs/project-user-guide/application-workloads/services/). This document uses a demo service as an example, which returns the pod name to external requests.

## Configure the Route Access Method

1. Log in to the KubeSphere web console as `project-admin` and go to your project.

2. Choose **Project Settings** > **Advanced Settings** on the left navigation bar and click **Set Gateway** on the right.

   {{< notice note >}}

   If the access method has been set, you can click **Edit** and choose **Edit Gateway** to change the access method.

   {{</ notice >}}

   ![set-gateway](/images/docs/project-user-guide/application-workloads/routes/set-gateway.png)

3. In the displayed **Set Gateway** dialog box, set **Access Method** to **NodePort** or **LoadBalancer**, and click **Save**.

   {{< notice note >}}

   If **Access Method** is set to **LoadBalancer**:

   * On [QingCloud Kubernetes Engine (QKE)](https://appcenter.qingcloud.com/apps/app-cmgbd5k2), you need to [add annotations](https://github.com/yunify/qingcloud-cloud-controller-manager/blob/v1.3.4/docs/configure.md) in the **Set Gateway** dialog box to use the QingCloud load balancer plugin. The external IP address assigned by the QingCloud load balancer plugin can be directly used  to access the Route from outside your private network.
   * On other infrastructure platforms, you need to enable the load balancer plugin of your platform according to the plugin user guide.

   {{</ notice >}}

   ![access-method-nodeport](/images/docs/project-user-guide/application-workloads/routes/access-method-nodeport.png)
   
   ![access-method-loadbalancer](/images/docs/project-user-guide/application-workloads/routes/access-method-loadbalancer.png)

## Create a Route

### Step 1: Configure basic information

1. Choose **Application Workloads** > **Routes** on the left navigation bar and click **Create** on the right.

   ![create-route](/images/docs/project-user-guide/application-workloads/routes/create-route.png)

2. On the **Basic Info** tab, configure the basic information about the Route and click **Next**.
   * **Name**: Name of the Route, which is used as a unique identifier.
   * **Alias**: Alias of the Route.
   * **Description**: Description of the Route.

   ![basic-info](/images/docs/project-user-guide/application-workloads/routes/basic-info.png)

### Step 2: Configure Route rules

1. On the **Route Rules** tab, click **Add Route Rule**.

2. Select a mode, configure Route rules, click **√**, and click **Next**.

   * **Auto Generate**: KubeSphere automatically generates a domain name in the `<Service name>.<Project name>.<Gateway address>.nip.io` format and the domain name is automatically resolved by [nip.io](https://nip.io/) into the gateway address. This mode supports only HTTP.
     
     * **Paths**: Map each service to a path. You can click **Add Path** to add multiple paths.
     
     ![auto-generate](/images/docs/project-user-guide/application-workloads/routes/auto-generate.png)
     
   * **Specify Domain**: A user-defined domain name is used. This mode supports both HTTP and HTTPS.
     
     * **HostName**: Set a domain name for the Route.
     * **Protocol**: Select `http` or `https`. If `https` is selected, you need to select a Secret that contains the `tls.crt` (TLS certificate) and `tls.key` (TLS private key) keys used for encryption.
     * **Paths**: Map each service to a path. You can click **Add Path** to add multiple paths.
   
     ![specify-domain](/images/docs/project-user-guide/application-workloads/routes/specify-domain.png)

### (Optional) Step 3: Configure advanced settings

1. On the **Advanced Settings** tab, select **Add Metadata**.

2. Configure annotations and labels for the Route and click **Create**.

   {{< notice note >}}

   You can use annotations to customize the behavior of the Route. For more information, see the [official Nginx Ingress controller document](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).

   {{</ notice >}}

   ![add-metadata](/images/docs/project-user-guide/application-workloads/routes/add-metadata.png)

### Step 4: Obtain the domain name, service path, and gateway address

1. Choose **Application Workloads** > **Routes** on the left navigation bar and click the name of the Route on the right.

   ![route-list](/images/docs/project-user-guide/application-workloads/routes/route-list.png)

2. Obtain the domain name and service path in the **Rules** area and the gateway address in the **Details** area.

   * If the [Route access method](#configure-the-route-access-method) is set to NodePort, the IP address of a Kubernetes cluster node is used as the gateway address and the NodePort is displayed after the domain name.

     ![obtain-address-nodeport](/images/docs/project-user-guide/application-workloads/routes/obtain-address-nodeport.png)

   * If the [Route access method](#configure-the-route-access-method) is set to LoadBalancer, the gateway address is assigned by the load balancer plugin.

     ![obtain-address-loadbalancer](/images/docs/project-user-guide/application-workloads/routes/obtain-address-loadbalancer.png)

## Configure Domain Name Resolution

If **Auto Generate** is selected in the [route rule configuration](#step-2-configure-route-rules), you do not need to configure domain name resolution and the domain name is automatically resolved by [nip.io](https://nip.io/) into the gateway address.

If **Specify Domain** is selected in the [route rule configuration](#step-2-configure-route-rules), you need to configure domain name resolution on your DNS server or add `<Route gateway address> <Route domain name>` to the `hosts` file of your client machine.

## Access the Route

### NodePort access method

1. Log in to a client machine connected to the Route gateway address.

2. Use the `<Route domain name>:<NodePort>/<Service path>` address to access the back-end service of the Route.

   ![access-route-nodeport](/images/docs/project-user-guide/application-workloads/routes/access-route-nodeport.png)

### LoadBalancer access method

1. Log in to a client machine connected to the Route gateway address.

2. Use the `<Route domain name>/<Service path>` address to access the back-end service of the Route.

   ![access-route-loadbalancer](/images/docs/project-user-guide/application-workloads/routes/access-route-loadbalancer.png)

{{< notice note >}}

If you need to access the Route from outside your private network by using either NodePort or LoadBalancer, depending on your network environment:

* You may need to configure traffic forwarding and firewall policies in your infrastructure environment so that the gateway address and port number of the Route can be accessed.
* If **Auto Generate** is selected in the [route rule configuration](#step-2-configure-route-rules), you may need to manually [edit the Route rules](#edit-the-route) to change the gateway address in the Route domain name to the external IP address of your private network.
* If **Specify Domain** is selected in the [route rule configuration](http://localhost:1313/docs/project-user-guide/application-workloads/routes/#step-2-configure-route-rules), you may need to change the configuration on your DNS server or in the `hosts` file of your client machine so that the domain name can be resolved into the external IP address of your private network. 

{{</ notice >}}

## Edit the Route

1. Choose **Application Workloads** > **Routes** on the left navigation bar and click the name of the Route on the right.

   ![route-list](/images/docs/project-user-guide/application-workloads/routes/route-list.png)

2. Click **Edit Info**, or click **More** and choose an operation from the drop-down list. 
   * **Edit Info**: Edit the basic information of the Route. The Route name cannot be edited.
   * **Edit YAML**: Edit the YAML configuration file of the Route.
   * **Edit Rules**: Edit the Route rules.
   * **Edit Annotations**: Edit the Route annotations. For more information, see the [official Nginx Ingress controller document](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).
   * **Delete**: Delete the Route and return to the Route list page.

   ![edit-route](/images/docs/project-user-guide/application-workloads/routes/edit-route.png)
