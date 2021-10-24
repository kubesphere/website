---
title: "Kubernetes Blue-Green Deployment on Kubesphere"
keywords: 'KubeSphere, Kubernetes, Service Mesh, Istio, Grayscale Release, Blue-Green deployment'
description: 'Learn how to release a blue-green deployment on KubeSphere.'
linkTitle: "Blue-Green Deployment with Kubernetes"
weight: 10520
---


The blue-green release provides a zero downtime deployment, which means the new version can be deployed with the old one preserved. At any time, only one of the versions is active serving all the traffic, while the other one remains idle. If there is a problem with running, you can quickly roll back to the old version.

![blue-green-0](/images/docs/project-user-guide/grayscale-release/blue-green-deployment/blue-green-0.png)


## Prerequisites

- You need to enable [KubeSphere Service Mesh](../../../pluggable-components/service-mesh/).
- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to enable **Application Governance** and have an available app so that you can implement the blue-green deployment for it. The sample app used in this tutorial is Bookinfo. For more information, see [Deploy Bookinfo and Manage Traffic](../../../quick-start/deploy-bookinfo-to-k8s/).

## Create a Blue-green Deployment Job

1. Log in to KubeSphere as `project-regular` and go to **Grayscale Release**. Under **Release Modes**, click **Create** on the right of **Blue-Green Deployment**.

2. Set a name for it and click **Next**.

3. On the **Service Settings** tab, select your app from the drop-down list and the Service for which you want to implement the blue-green deployment. If you also use the sample app Bookinfo, select **reviews** and click **Next**.

4. On the **New Version Settings** tab, add another version (e.g `kubesphere/examples-bookinfo-reviews-v2:1.16.2`) as shown in the following figure and click **Next**.

5. On the **Strategy Settings** tab, to allow the app version `v2` to take over all the traffic, select **Take Over** and click **Create**.

6. The blue-green deployment job created is displayed under the **Release Jobs** tab. Click it to view details.

7. Wait for a while and you can see all the traffic go to the version `v2`.

8. The new **Deployment** is created as well.

9. You can get the virtual service to identify the weight by running the following command:

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - When you run the command above, replace `demo-project` with your own project (namely, namespace) name.
   - If you want to run the command from the web kubectl on the KubeSphere console, you need to use the user `admin`.

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

After you implement the blue-green deployment, and the result meets your expectation, you can take the task offline with the version `v1` removed by clicking **Delete**.


