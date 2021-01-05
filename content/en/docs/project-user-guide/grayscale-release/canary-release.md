---
title: "Canary Release"
keywords: 'KubeSphere, Kubernetes, canary release, istio, service mesh'
description: 'How to implement the canary release for an app.'

linkTitle: "Canary Release"
weight: 10530
---

On the back of [Istio](https://istio.io/), KubeSphere provides users with necessary control to deploy canary services. In a canary release, you introduce a new version of a service and test it by sending a small percentage of traffic to it. At the same time, the old version is responsible for handling the rest of the traffic. If everything goes well, you can gradually increase the traffic sent to the new version, while simultaneously phasing out the old version. In the case of any occurring issues, KubeSphere allows you to roll back to the previous version as you change the traffic percentage.

This method serves as an efficient way to test performance and reliability of a service. It can help detect potential problems in the actual environment while not affecting the overall system stability.

![canary-release-0](/images/docs/project-user-guide/grayscale-release/canary-release/canary-release-0.png)

## Prerequisites

- You need to enable [KubeSphere Service Mesh](../../../pluggable-components/service-mesh/).
- You need to create a workspace, a project and an account (`project-regular`). The account must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Accounts and Roles](../../../quick-start/create-workspace-and-project).
- You need to enable **Application Governance** and have an available app so that you can implement the canary release for it. The sample app used in this tutorial is Bookinfo. For more information, see [Deploy Bookinfo and Manage Traffic](../../../quick-start/deploy-bookinfo-to-k8s/).

## Create Canary Release Job

1. Log in to KubeSphere as `project-regular`. Under **Categories**, click **Create Job** on the right of **Canary Release**.

   ![create-canary-release](/images/docs/project-user-guide/grayscale-release/canary-release/create-canary-release.jpg)

2. Set a name for it and click **Next**.

   ![set-task-name](/images/docs/project-user-guide/grayscale-release/canary-release/set-task-name.jpg)

3. Select your app from the drop-down list and the service for which you want to implement the canary release. If you also use the sample app Bookinfo, select **reviews** and click **Next**.

   ![cabary-release-3](/images/docs/project-user-guide/grayscale-release/canary-release/cabary-release-3.jpg)

4. On the **Grayscale Release Version** page, add another version of it (e.g `v2`) as shown in the image below and click **Next**:

   ![canary-release-4](/images/docs/project-user-guide/grayscale-release/canary-release/canary-release-4.jpg)

   {{< notice note >}}

   The image version is `v2` in the screenshot.

   {{</ notice >}} 

5. You send traffic to these two versions (`v1` and `v2`) either by a specific percentage or by the request content such as `Http Header`, `Cookie` and `URI`. Select **Forward by traffic ratio** and drag the icon in the middle to change the percentage of traffic sent to these two versions respectively (e.g. set 50% for either one). When you finish, click **Create**.

   ![canary-release-5](/images/docs/project-user-guide/grayscale-release/canary-release/canary-release-5.gif)

6. The canary release job created displays under the tab **Job Status**. Click it to view details.

   ![canary-release-job](/images/docs/project-user-guide/grayscale-release/canary-release/canary-release-job.jpg)

7. Wait for a while and you can see half of the traffic go to each of them:

   ![canary-release-6](/images/docs/project-user-guide/grayscale-release/canary-release/canary-release-6.jpg)

8. The new **Deployment** is created as well.

   ![deployment-list-1](/images/docs/project-user-guide/grayscale-release/canary-release/deployment-list-1.jpg)

9. You can directly get the virtual service to identify the weight by executing the following command:

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - When you execute the command above, replace `demo-project` with your own project (i.e. namespace) name.
   - If you want to execute the command from the web kubectl on the KubeSphere console, you need to use the account `admin`.

   {{</ notice >}} 

10. Expected output:

    ```bash
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
            subset: v1
          weight: 50
        - destination:
            host: reviews
            port:
              number: 9080
            subset: v2
          weight: 50
          ...
    ```

## Take a Job Offline

1. After you implement the canary release, and the result meets your expectation, you can select **Take Over** from the menu, sending all the traffic to the new version. 

   ![take-over-traffic](/images/docs/project-user-guide/grayscale-release/canary-release/take-over-traffic.jpg)

2. To remove the old version with the new version handling all the traffic, click **Job offline**.

   ![job-offline](/images/docs/project-user-guide/grayscale-release/canary-release/job-offline.jpg)
