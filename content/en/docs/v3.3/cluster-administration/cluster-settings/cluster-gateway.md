---
title: "Cluster Gateway"
keywords: 'KubeSphere, Kubernetes, Cluster, Gateway, NodePort, LoadBalancer'
description: 'Learn how to create a cluster-scope gateway on KubeSphere.'
linkTitle: "Cluster Gateway"
weight: 8630
---

KubeSphere 3.3 provides cluster-scope gateways to let all projects share a global gateway. This document describes how to set a cluster gateway on KubeSphere.

## Prerequisites

You need to prepare a user with the `platform-admin` role, for example, `admin`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).

## Create a Cluster Gateway

1. Log in to the KubeSphere web console as `admin`. Click **Platform** in the upper-left corner and select **Cluster Management**.

2. Go to **Gateway Settings** under **Cluster Settings** from the navigation pane, select the **Cluster Gateway** tab, and click **Enable Gateway**.

3. In the displayed dialog box, select an access mode for the gateway from the following two options:

   - **NodePort**: Access Services with corresponding node ports through the gateway. The NodePort access mode provides the following configurations:
     - **Tracing**: Turn on the **Tracing** toggle to enable the Tracing feature on KubeSphere. Once it is enabled, check whether an annotation (`nginx.ingress.kubernetes.io/service-upstream: true`) is added for your route when the route is inaccessible. If not, add an annotation to your route.
     - **Configuration Options**: Add key-value pairs to the cluster gateway.
   - **LoadBalancer**: Access Services with a single IP address through the gateway. The LoadBalancer access mode provides the following configurations:
     - **Tracing**: Turn on the **Tracing** toggle to enable the Tracing feature on KubeSphere. Once it is enabled, check whether an annotation (`nginx.ingress.kubernetes.io/service-upstream: true`) is added for your route when the route is inaccessible. If not, add an annotation to your route.
     - **Load Balancer Provider**: Select a load balancer provider from the drop-down list.
     - **Annotations**: Add annotations to the cluster gateway.
     - **Configuration Options**: Add key-value pairs to the cluster gateway.

   {{< notice info >}}

   - To use the Tracing feature, turn on **Application Governance** when you create composed applications.
   - For more information about how to use configuration options, see [Configuration options](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#configuration-options).

   {{</ notice >}}

4. Click **OK** to create the cluster gateway.

5. The cluster gateway created is displayed and the basic information of the gateway is also shown on the page.

   {{< notice note >}}

   A gateway named `kubesphere-router-kubesphere-system` is also created, which serves as a global gateway for all projects in your cluster.

   {{</ notice >}}

6. Click **Manage** to select an operation from the drop-down menu:

   - **View Details**: Go to the details page of the cluster gateway.
   - **Edit**: Edit configurations of the cluster gateway.
   - **Disable**: Disable the cluster gateway.

7. After a cluster gateway is created, see [Routes](../../../project-user-guide/application-workloads/routes/#create-a-route) for more information about how to create a route.

## Cluster Gateway Details Page

1. Under the **Cluster Gateway** tab, click **Manage** on the right of a cluster gateway and select **View Details** to open its details page.
2. On the details page, click **Edit** to edit configurations of the cluster gateway or click **Disable** to disable the gateway.
3. Click the **Monitoring** tab to view the monitoring metrics of the cluster gateway.
4. Click the **Configuration Options** tab to view configuration options of the cluster gateway.
5. Click the **Gateway Logs** tab to view logs of the cluster gateway.
6. Click the **Resource Status** tab to view workload status of the cluster gateway. Click <img src="/images/docs/v3.3/common-icons/replica-plus-icon.png" width="15" alt="icon" /> or <img src="/images/docs/v3.3/common-icons/replica-minus-icon.png" width="15" /> to scale up or scale down the number of replicas.
7. Click the **Metadata** tab to view annotations of the cluster gateway.

## View Project Gateways

On the **Gateway Settings** page, click the **Project Gateway** tab to view project gateways.

Click <img src="/images/docs/v3.3/project-administration/role-and-member-management/three-dots.png" width="20px" alt="icon"> on the right of a project gateway to select an operation from the drop-down menu:

- **Edit**: Edit configurations of the project gateway.
- **Disable**: Disable the project gateway.

{{< notice note >}}

If a project gateway exists prior to the creation of a cluster gateway, the project gateway address may switch between the address of the cluster gateway and that of the project gateway. It is recommended that you should use either the cluster gateway or project gateway.

{{</ notice >}}

For more information about how to create project gateways, see [Project Gateway](../../../project-administration/project-gateway/).