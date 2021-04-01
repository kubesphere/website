---
title: "Blue-green Deployment"
keywords: 'KubeSphere, Kubernetes, service mesh, istio, release, blue-green deployment'
description: 'Learn how to release a blue-green deployment in KubeSphere.'
linkTitle: "Blue-green Deployment"
weight: 10520
---


The blue-green release provides a zero downtime deployment, which means the new version can be deployed with the old one preserved. At any time, only one of the versions is active serving all the traffic, while the other one remains idle. If there is a problem with running, you can quickly roll back to the old version.

![blue-green-0](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-0.png)


## Prerequisites

- You need to enable [KubeSphere Service Mesh](../../../pluggable-components/service-mesh/).
- You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project/).
- You need to enable **Application Governance** and have an available app so that you can implement the blue-green deployment for it. The sample app used in this tutorial is Bookinfo. For more information, see [Deploy Bookinfo and Manage Traffic](../../../quick-start/deploy-bookinfo-to-k8s/).

## Create a Blue-green Deployment Job

1. Log in to KubeSphere as `project-regular`. Under **Categories**, click **Create Job** on the right of **Blue-green Deployment**.

   ![blue-green-1](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-1.jpg)

2. Set a name for it and click **Next**.

   ![blue-green-2](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-2.jpg)

3. Select your app from the drop-down list and the service for which you want to implement the blue-green deployment. If you also use the sample app Bookinfo, select **reviews** and click **Next**.

   ![blue-green-3](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-3.jpg)

4. On the **Grayscale Release Version** page, add another version of it (e.g `v2`) as shown in the image below and click **Next**:

   ![blue-green-4](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-4.jpg)

   {{< notice note >}}

   The image version is `v2` in the screenshot.

   {{</ notice >}} 

5. To allow the app version `v2` to take over all the traffic, select **Take over all traffic** and click **Create**.

   ![blue-green-5](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-5.jpg)

6. The blue-green deployment job created displays under the tab **Job Status**. Click it to view details.

   ![blue-green-job-list](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-job-list.jpg)

7. Wait for a while and you can see all the traffic go to the version `v2`:

   ![blue-green-6](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-6.jpg)

8. The new **Deployment** is created as well.

   ![version2-deployment](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/version2-deployment.jpg)

9. You can directly get the virtual service to identify the weight by executing the following command:

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - When you execute the command above, replace `demo-project` with your own project (i.e. namespace) name.
   - If you want to execute the command from the web kubectl on the KubeSphere console, you need to use the account `admin`.

   {{</ notice >}}

10. Expected output:

    ```yaml
    ...
      spec:
        hosts:
        - reviews
        http:
        - route:
          - destination:
              host: reviews
              port:
                number: 9080
              subset: v2
            weight: 100
            ...
    ```

## Take a Job Offline

After you implement the blue-green deployment, and the result meets your expectation, you can take the task offline with the version `v1` removed by clicking **Job offline**.

![blue-green-7](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-7.jpg)

