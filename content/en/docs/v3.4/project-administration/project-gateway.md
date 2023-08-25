---
title: "Project Gateway"
keywords: 'KubeSphere, Kubernetes, project, gateway, NodePort, LoadBalancer'
description: 'Understand the concept of project gateway and how to manage it.'
linkTitle: "Project Gateway"
weight: 13500
---

A gateway in a KubeSphere project is an [NGINX Ingress controller](https://www.nginx.com/products/nginx/kubernetes-ingress-controller). KubeSphere has a built‑in configuration for HTTP load balancing, called [Routes](../../project-user-guide/application-workloads/routes/). A Route defines rules for external connections to Services within a cluster. Users who need to provide external access to their Services create a Route resource that defines rules, including the URI path, backing service name, and other information.

In addition to project gateways, KubeSphere also supports [cluster-scope gateway](../../cluster-administration/cluster-settings/cluster-gateway/) to let all projects share a global gateway.

This tutorial demonstrates how to enable a project gateway on KubeSphere for external access to Services and Routes.

## Prerequisites

You need to create a workspace, a project and a user (`project-admin`). The user must be invited to the project with the role of `admin` at the project level. For more information, see [Create Workspaces, Projects, Users and Roles](../../quick-start/create-workspace-and-project/).

## Enable a Gateway

1. Log in to the KubeSphere web console as `project-admin` and go to your project. In **Project Settings** from the navigation bar, click **Gateway Settings**.

2. Click **Enable Gateway**. In the pop-up window, you can select two access modes for the gateway.

   **NodePort**: You can access Services with corresponding node ports through the gateway.
   
   **LoadBalancer**: You can access Services with a single IP address through the gateway.
   
3. You can also enable **Tracing** on the **Enable Gateway** page. You have to turn on **Application Governance** when you create composed applications so that you can use the Tracing feature and use [different grayscale release strategies](../../project-user-guide/grayscale-release/overview/). Once it is enabled, check whether an annotation (for example, `nginx.ingress.kubernetes.io/service-upstream: true`) is added for your route (Ingress) if the route is inaccessible.

3. In **Configuration Options**, add key-value pairs to provide configurations for system components of NGINX Ingress controller. For more information, see [NGINX Ingress Controller documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#configuration-options).

4. After you select an access method, click **OK**.

## NodePort

If you select **NodePort**, KubeSphere will set a port for http and https requests respectively. You can access your Service at `EIP:NodePort` or `Hostname:NodePort`.

For example, to access your Service with an elastic IP address (EIP), visit:

- `http://EIP:32734`
- `https://EIP:32471`

When you create a [Route](../../project-user-guide/application-workloads/routes/) (Ingress), you can customize a host name to access your Service. For example, to access your Service with the host name set in your Route, visit:

- `http://demo.kubesphere.io:32734`
- `https://demo.kubesphere.io:32471`

{{< notice note >}}

- You may need to open ports in your security groups and configure relevant port forwarding rules depending on your environment.

- If you access your Service using the host name, make sure the domain name you set can be resolved to the IP address.
- **NodePort** is not recommended for a production environment. You can use **LoadBalancer** instead.

{{</ notice >}} 

## LoadBalancer

You must configure a load balancer in advance before you select **LoadBalancer**. The IP address of the load balancer will be bound to the gateway to provide access to internal Services and Routes. 

{{< notice note >}}

Cloud providers often support load balancer plugins. If you install KubeSphere on major Kubernetes engines on their platforms, you may notice a load balancer is already available in the environment for you to use. If you install KubeSphere in a bare metal environment, you can use [OpenELB](https://github.com/kubesphere/openelb) for load balancing.

{{</ notice >}} 