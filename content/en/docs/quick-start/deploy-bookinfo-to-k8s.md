---
title: "Deploy and Access Bookinfo"
keywords: 'KubeSphere, Kubernetes, Bookinfo, Istio'
description: 'Explore the basics of KubeSphere service mesh by deploying an example application Bookinfo.'
linkTitle: "Deploy and Access Bookinfo"
weight: 2400
---

[Istio](https://istio.io/), as an open-source service mesh solution, provides powerful features of traffic management for microservices. Here is the introduction of traffic management from the official website of [Istio](https://istio.io/latest/docs/concepts/traffic-management/):

*Istio’s traffic routing rules let you easily control the flow of traffic and API calls between services. Istio simplifies configuration of service-level properties like circuit breakers, timeouts, and retries, and makes it easy to set up important tasks like A/B testing, canary rollouts, and staged rollouts with percentage-based traffic splits. It also provides out-of-box failure recovery features that help make your application more robust against failures of dependent services or the network.*

To provide consistent user experiences of managing microservices, KubeSphere integrates Istio on the container platform. This tutorial demonstrates how to deploy a sample application Bookinfo composed of four separate microservices and access it through a NodePort.

## Prerequisites

- You need to enable [KubeSphere Service Mesh](../../pluggable-components/service-mesh/).

- You need to finish all tasks in [Create Workspaces, Projects, Accounts and Roles](../create-workspace-and-project/).

- You need to enable **Application Governance**. To do so, perform the following steps:

  Log in to the console as `project-admin` and go to your project. Navigate to **Advanced Settings** under **Project Settings**, click **Edit**, and select **Edit Gateway**. In the dialog that appears, flip on the toggle switch next to **Application Governance**.

  {{< notice note >}}
You need to enable **Application Governance** so that you can use the Tracing feature. Once it is enabled, check whether an annotation (for example, `nginx.ingress.kubernetes.io/service-upstream: true`) is added for your Route (Ingress) if the Route is inaccessible.
  {{</ notice >}}

## What is Bookinfo

Bookinfo is composed of four separate microservices as shown below. There are three versions of the **reviews** microservice.

- The **productpage** microservice calls the **details** and **reviews** microservices to populate the page.
- The **details** microservice contains book information.
- The **reviews** microservice contains book reviews. It also calls the **ratings** microservice.
- The **ratings** microservice contains book ranking information that accompanies a book review.

The end-to-end architecture of the application is shown below. See [Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/) for more details.

![bookinfo](/images/docs/quickstart/deploy-bookinfo-to-k8s/bookinfo.png)

## Hands-on Lab

### Step 1: Deploy Bookinfo

1. Log in to the console as `project-regular` and go to your project (`demo-project`). Navigate to **Apps** under **Application Workloads**, and click **Deploy Sample App** on the right.

2. Click **Next** in the dialog that appears where required fields are pre-populated and relevant components are already set. You do not need to change the settings and just click **Create** on the final page (**Internet Access**).

    ![create-bookinfo1](/images/docs/quickstart/deploy-bookinfo-to-k8s/create-bookinfo1.png)

    {{< notice note >}}

KubeSphere creates the hostname automatically. To change the hostname, hover over the default route rule and click the pencil icon to edit it. For more information, see [Create a Microservices-based App](../../project-user-guide/application/compose-app/).

{{</ notice >}}

3. In **Workloads**, verify that the statuses of all four Deployments reach `running`, which means the app has been created successfully.

    ![running1](/images/docs/quickstart/deploy-bookinfo-to-k8s/running1.png)

    {{< notice note >}}
It may take a few minutes before the Deployments are up and running.
    {{</ notice >}}

### Step 2: Access Bookinfo

1. In **Apps**, go to **Composing Apps** and click the app `bookinfo` to see its detailed information.

    ![click-bookinfo1](/images/docs/quickstart/deploy-bookinfo-to-k8s/click-bookinfo1.png)

    {{< notice note >}}If you do not see the app in the list, refresh your page.
    {{</ notice >}}

2. On the detail page, record the hostname and port number of the app which will be used to access Bookinfo.

    ![detail-page1](/images/docs/quickstart/deploy-bookinfo-to-k8s/detail-page1.png)

3. As the app will be accessed outside the cluster through a NodePort, you need to open the port in the image above (in this case, it is `32535`) in your security group for outbound traffic and set any port forwarding rules if necessary.

4. Edit your local host file (`/etc/hosts`) by adding an entry in it to map the hostname to the IP address. For example:

    ```bash
    139.198.179.20 productpage.demo-project.192.168.0.2.nip.io
    ```

    {{< notice note >}}

Do not copy the content above directly to your local host file. Replace it with your own IP address and hostname.
    {{</ notice >}}

5. When you finish, click the button **Click to visit** to access the app.

    ![click-to-visit1](/images/docs/quickstart/deploy-bookinfo-to-k8s/click-to-visit1.png)

6. On the app detail page, click **Normal user** in the bottom-left corner.

    ![normal-user](/images/docs/quickstart/deploy-bookinfo-to-k8s/normal-user.png)

7. In the image below, you can notice that only **Reviewer1** and **Reviewer2** are displayed without any stars in the **Book Reviews** section. This is the status of this app version. To explore more features of traffic management, you can implement a [canary release](../../project-user-guide/grayscale-release/canary-release/) for this app.

    ![ratings-page](/images/docs/quickstart/deploy-bookinfo-to-k8s/ratings-page.png)
    
    {{< notice note >}}
    

KubeSphere provides three kinds of grayscale strategies based on Istio, including [blue-green deployment](../../project-user-guide/grayscale-release/blue-green-deployment/), [canary release](../../project-user-guide/grayscale-release/canary-release/) and [traffic mirroring](../../project-user-guide/grayscale-release/traffic-mirroring/).
    {{</ notice >}}

