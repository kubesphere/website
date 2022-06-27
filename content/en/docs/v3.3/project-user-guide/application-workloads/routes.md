---
title: "Routes"
keywords: "KubeSphere, Kubernetes, Route, Ingress"
description: "Learn basic concepts of Routes (i.e. Ingress) and how to create Routes in KubeSphere."
weight: 10270
---

This document describes how to create, use, and edit a Route on KubeSphere.

A Route on KubeSphere is the same as an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress) on Kubernetes. You can use a Route and a single IP address to aggregate and expose multiple Services.

## Prerequisites

- You need to create a workspace, a project and two users (for example, `project-admin` and `project-regular`). In the project, the role of `admin` must be `project-admin` and that of `project-regular` must be `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](/docs/v3.3/quick-start/create-workspace-and-project/).
- If the Route is to be accessed in HTTPS mode, you need to [create a Secret](/docs/v3.3/project-user-guide/configuration/secrets/) that contains the `tls.crt` (TLS certificate) and `tls.key` (TLS private key) keys used for encryption.
- You need to [create at least one Service](/docs/v3.3/project-user-guide/application-workloads/services/). This document uses a demo Service as an example, which returns the Pod name to external requests.

## Configure the Route Access Method

1. Log in to the KubeSphere web console as `project-admin` and go to your project.

2. Select **Gateway Settings** in **Project Settings** on the left navigation bar and click **Enable Gateway** on the right.

3. In the displayed dialog box, set **Access Mode** to **NodePort** or **LoadBalancer**, and click **OK**.

   {{< notice note >}}

   If **Access Mode** is set to **LoadBalancer**, you may need to enable the load balancer plugin in your environment according to the plugin user guide.

   {{</ notice >}}

## Create a Route

### Step 1: Configure basic information

1. Log out of the KubeSphere web console, log back in as `project-regular`, and go to the same project.

2. Choose **Routes** in **Application Workloads** on the left navigation bar and click **Create** on the right.

3. On the **Basic Information** tab, configure the basic information about the Route and click **Next**.
   * **Name**: Name of the Route, which is used as a unique identifier.
   * **Alias**: Alias of the Route.
   * **Description**: Description of the Route.

### Step 2: Configure routing rules

1. On the **Routing Rules** tab, click **Add Routing Rule**.

2. Select a mode, configure routing rules, click **√**, and click **Next**.

   * **Auto Generate**: KubeSphere automatically generates a domain name in the `<Service name>.<Project name>.<Gateway address>.nip.io` format and the domain name is automatically resolved by [nip.io](https://nip.io/) into the gateway address. This mode supports only HTTP.
     
     * **Paths**: Map each Service to a path. You can click **Add** to add multiple paths.
     
   * **Specify Domain**: A user-defined domain name is used. This mode supports both HTTP and HTTPS.
     
     * **Domain Name**: Set a domain name for the Route.
     * **Protocol**: Select `http` or `https`. If `https` is selected, you need to select a Secret that contains the `tls.crt` (TLS certificate) and `tls.key` (TLS private key) keys used for encryption.
     * **Paths**: Map each Service to a path. You can click **Add** to add multiple paths.

### (Optional) Step 3: Configure advanced settings

1. On the **Advanced Settings** tab, select **Add Metadata**.

2. Configure annotations and labels for the Route and click **Create**.

   {{< notice note >}}

   You can use annotations to customize the behavior of the Route. For more information, see the [official Nginx Ingress controller document](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).

   {{</ notice >}}

### Step 4: Obtain the domain name, Service path, and gateway address

1. Select **Routes** in **Application Workloads** on the left navigation bar and click the name of the Route on the right.

2. Obtain the domain name and Service path and the gateway address in the **Rules** area.

   * If the [Route access mode](#configure-the-route-access-method) is set to NodePort, the IP address of a Kubernetes cluster node is used as the gateway address and the NodePort is displayed after the domain name.

   * If the [Route access mode](#configure-the-route-access-method) is set to LoadBalancer, the gateway address is assigned by the load balancer plugin.

## Configure Domain Name Resolution

If **Auto Generate** is selected in the [routing rule configuration](#step-2-configure-route-rules), you do not need to configure domain name resolution and the domain name is automatically resolved by [nip.io](https://nip.io/) into the gateway address.

If **Specify Domain** is selected in the [routing rule configuration](#step-2-configure-route-rules), you need to configure domain name resolution on your DNS server or add `<Route gateway address> <Route domain name>` to the `etc/hosts` file of your client machine.

## Access the Route

### NodePort access mode

1. Log in to a client machine connected to the Route gateway address.

2. Use the `<Route domain name>:<NodePort>/<Service path>` address to access the backend Service of the Route.

### LoadBalancer access method

1. Log in to a client machine connected to the Route gateway address.

2. Use the `<Route domain name>/<Service path>` address to access the backend Service of the Route.

{{< notice note >}}

If you need to access the Route from outside your private network by using either NodePort or LoadBalancer, depending on your network environment:

* You may need to configure traffic forwarding and firewall policies in your infrastructure environment so that the gateway address and port number of the Route can be accessed.
* If **Auto Generate** is selected in the [routing rule configuration](#step-2-configure-routing-rules), you may need to manually [edit the routing rules](#edit-the-route) to change the gateway address in the Route domain name to the external IP address of your private network.
* If **Specify Domain** is selected in the [routing rule configuration](#step-2-configure-routing-rules), you may need to change the configuration on your DNS server or in the `etc/hosts` file of your client machine so that the domain name can be resolved into the external IP address of your private network. 

{{</ notice >}}

## Check Route Details

### Operations

1. Choose **Routes** in **Application Workloads** on the left navigation bar and click the name of the Route on the right.

2. Click **Edit Information**, or click **More** and choose an operation from the drop-down menu. 
   * **Edit YAML**: Edit the YAML configuration file of the Route.
   * **Edit Routing Rules**: Edit the Route rules.
   * **Edit Annotations**: Edit the Route annotations. For more information, see the [official Nginx Ingress controller document](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).
   * **Delete**: Delete the Route and return to the Route list page.

### Resource status

Click the **Resource Status** tab to view the Route rules.

### Metadata

Click the **Metadata** tab to view the labels and annotations of the Route.

### Events

Click the **Events** tab to view the events of the Route.


