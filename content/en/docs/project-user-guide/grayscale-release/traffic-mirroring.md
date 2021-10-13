---
title: "Traffic Mirroring"
keywords: 'KubeSphere, Kubernetes, traffic mirroring, istio'
description: 'Learn how to conduct a traffic mirroring job in KubeSphere.'
linkTitle: "Traffic Mirroring"
weight: 10540
---

Traffic mirroring, also called shadowing, is a powerful, risk-free method of testing your app versions as it sends a copy of live traffic to a service that is being mirrored. Namely, you implement a similar setup for acceptance test so that problems can be detected in advance. As mirrored traffic happens out of band of the critical request path for the primary service, your end users will not be affected during the whole process.

## Prerequisites

- You need to enable [KubeSphere Service Mesh](../../../pluggable-components/service-mesh/).
- You need to create a workspace, a project and a user (`project-regular`). The user must be invited to the project with the role of `operator`. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- You need to enable **Application Governance** and have an available app so that you can mirror the traffic of it. The sample app used in this tutorial is Bookinfo. For more information, see [Deploy Bookinfo and Manage Traffic](../../../quick-start/deploy-bookinfo-to-k8s/).

## Create a Traffic Mirroring Job

1. Log in to KubeSphere as `project-regular` and go to **Grayscale Release**. Under **Categories**, click **Create Job** on the right of **Traffic Mirroring**.

2. Set a name for it and click **Next**.

3. On the **Grayscale Release Components** tab, select your app from the drop-down list and the Service of which you want to mirror the traffic. If you also use the sample app Bookinfo, select **reviews** and click **Next**.

4. On the **Grayscale Release Version** tab, add another version of it (for example, `v2`) as shown in the image below and click **Next**:

   ![traffic-mirroring-4](/images/docs/project-user-guide/grayscale-release/traffic-mirroring/traffic-mirroring-4.png)

   {{< notice note >}}

   The image version is `v2` in the screenshot.

   {{</ notice >}} 

5. On the **Policy Config** tab, click **Create**.

6. The traffic mirroring job created is displayed under the tab **Job Status**. Click it to view details.

   ![traffic-mirroing-task](/images/docs/project-user-guide/grayscale-release/traffic-mirroring/traffic-mirroing-task.png)

7. You can see the traffic is being mirrored to `v2` with real-time traffic displayed in the line chart.

   ![traffic-mirroring-6](/images/docs/project-user-guide/grayscale-release/traffic-mirroring/traffic-mirroring-6.png)

8. The new **Deployment** is created as well.

   ![new-deployment](/images/docs/project-user-guide/grayscale-release/traffic-mirroring/new-deployment.png)

9. You can get the virtual service to view `mirror` and `weight` by running the following command:

   ```bash
   kubectl -n demo-project get virtualservice -o yaml
   ```

   {{< notice note >}} 

   - When you run the command above, replace `demo-project` with your own project (namely, namespace) name.
   - If you want to run the command from the web kubectl on the KubeSphere console, you need to use the user `admin`.

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
          weight: 100
        mirror:
          host: reviews
          port:
            number: 9080
          subset: v2
          ...
    ```

    This route rule sends 100% of the traffic to `v1`. The `mirror` field specifies that you want to mirror to the service `reviews v2`. When traffic gets mirrored, the requests are sent to the mirrored service with their Host/Authority headers appended with `-shadow`. For example, `cluster-1` becomes `cluster-1-shadow`.

    {{< notice note >}}

These requests are mirrored as “fire and forget”, which means that the responses are discarded. You can specify the `weight` field to mirror a fraction of the traffic, instead of mirroring all requests. If this field is absent, for compatibility with older versions, all traffic will be mirrored. For more information, see [Mirroring](https://istio.io/v1.5/pt-br/docs/tasks/traffic-management/mirroring/).

{{</ notice >}}

## Take a Job Offline

You can remove the traffic mirroring job by clicking **Job offline**, which does not affect the current app version.

![remove-traffic-mirroring](/images/docs/project-user-guide/grayscale-release/traffic-mirroring/remove-traffic-mirroring.png)