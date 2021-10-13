---
title: "Configure S2I and B2I Webhooks"
keywords: 'KubeSphere, Kubernetes, S2I, Source-to-Image, B2I, Binary-to-Image, Webhook'
description: 'Learn how to configure S2I and B2I webhooks.'
linkTitle: "Configure S2I and B2I Webhooks"
weight: 10650
---

KubeSphere provides Source-to-Image (S2I) and Binary-to-Image (B2I) features to  automate image building and pushing and application deployment. In KubeSphere v3.1, you can configure S2I and B2I webhooks so that your Image Builder can be automatically triggered when there is any relevant activity in your code repository.

This tutorial demonstrates how to configure S2I and B2I webhooks.

## Prerequisites

- You need to enable the [KubeSphere DevOps System](../../../pluggable-components/devops/).
- You need to create a workspace, a project (`demo-project`) and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to create an S2I Image Builder and a B2I Image Builder. For more information, refer to [Source to Image: Publish an App without a Dockerfile](../source-to-image/) and [Binary to Image: Publish an Artifact to Kubernetes](../binary-to-image/).

## Configure an S2I Webhook

### Step 1: Expose the S2I trigger Service

1. Log in to the KubeSphere web console as `admin`. Click **Platform** in the top-left corner and then select **Cluster Management**.

2. In **Services** under **Application Workloads**, select **kubesphere-devops-system** from the drop-down list and click **s2ioperator-trigger-service** to go to its detail page.

   ![s2i-trigger-service](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/s2i-trigger-service.png)

3. Click **More** and select **Edit Internet Access**.

   ![edit-trigger-service](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/edit-trigger-service.png)

4. In the window that appears, select **NodePort** from the drop-down list for **Access Method** and then click **OK**.

   ![select-nodeport](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/select-nodeport.png)

   {{< notice note >}}

   This tutorial selects **NodePort** for demonstration purposes. You can also select **LoadBalancer** based on your needs.

   {{</ notice >}}

5. You can view the **Node Port** on the detail page. It will be included in the S2I webhook URL.

   ![s2i-nodeport](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/s2i-nodeport.png)

### Step 2: Configure an S2I webhook

1. Log out of KubeSphere and log back in as `project-regular`. Go to `demo-project`.

2. In **Image Builder**, click the S2I Image Builder to go to its detail page.

   ![click-s2i](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/click-s2i.png)

3. You can see an auto-generated link shown in **Remote Trigger Link**. Copy `/s2itrigger/v1alpha1/general/namespaces/demo-project/s2ibuilders/felixnoo-s2i-sample-latest-zhd/` as it will be included in the S2I webhook URL.

   ![s2i-trigger-link](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/s2i-trigger-link.png)

4. Log in to your GitHub account and go to the source code repository used for the S2I Image Builder. Go to **Webhooks** under **Settings** and then click **Add webhook**.

   ![click-add-webhook](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/click-add-webhook.png)

5. In **Payload URL**, enter `http://<IP>:<Service NodePort>/s2itrigger/v1alpha1/general/namespaces/demo-project/s2ibuilders/felixnoo-s2i-sample-latest-zhd/`. You can select trigger events based on your needs and then click **Add webhook**. This tutorial chooses **Just the push event** for demonstration purposes.

   ![add-payload-url](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/add-payload-url.png)

   {{< notice note >}}

   `<IP>` is your own IP address, `<Service NodePort>` is the NodePort you get in step 1, and `/s2itrigger/v1alpha1/general/namespaces/demo-project/s2ibuilders/felixnoo-s2i-sample-latest-zhd/` is from the S2I remote trigger link. Make sure you use your own IP, Service NodePort and S2I remote trigger link. You may also need to configure necessary port forwarding rules and open the port in your security groups depending on where your Kubernetes cluster is deployed.

   {{</ notice >}}

6. Once the webhook is added, you can click the webhook to view delivery details in **Recent Deliveries**. You can see a green tick if the Payload URL is valid.

   ![webhook-delivery](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/webhook-delivery.png)

7. After you finish all the above operations, the S2I Image Builder will be automatically triggered if there is a push event to the source code repository.

   ![s2i-auto-build](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/s2i-auto-build.png)

## Configure a B2I Webhook

You can follow the same steps to configure a B2I webhook.

1. Expose the S2I trigger Service.

2. View the **Remote Trigger Link** in the detail page of your B2I Image Builder.

   ![b2i-trigger-link](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/b2i-trigger-link.png)

3. Add the payload URL in the source code repository. The B2I payload URL format is the same as that of S2I payload URL.

   ![b2i-payload-url](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/b2i-payload-url.png)

   {{< notice note >}}

   You may need to configure necessary port forwarding rules and open the port in your security groups depending on where your Kubernetes cluster is deployed.

   {{</ notice >}}

4. The B2I Image Builder will be automatically triggered if there is a relevant event to the source code repository.

   ![b2i-auto-build](/images/docs/project-user-guide/image-builder/s2i-and-b2i-webhooks/b2i-auto-build.png)



