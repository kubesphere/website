---
title: "Kubernetes HPA (Horizontal Pod Autoscaling) on KubeSphere"
keywords: "Horizontal, Pod, Autoscaling, Autoscaler"
description: "How to configure Kubernetes Horizontal Pod Autoscaling on KubeSphere."
weight: 10290

---

This document describes how to configure Horizontal Pod Autoscaling (HPA) on KubeSphere.

The Kubernetes HPA feature automatically adjusts the number of Pods to maintain average resource usage (CPU and memory) of Pods around preset values. For details about how HPA functions, see the [official Kubernetes document](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).

This document uses HPA based on CPU usage as an example. Operations for HPA based on memory usage are similar.

## Prerequisites

- You need to [enable the Metrics Server](https://kubesphere.io/docs/pluggable-components/metrics-server/).
- You need to create a workspace, a project and a user (for example, `project-regular`). `project-regular` must be invited to the project and assigned the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](/docs/quick-start/create-workspace-and-project/).

## Create a Service

1. Log in to the KubeSphere web console as `project-regular` and go to your project.

2. Choose **Services** in **Application Workloads** on the left navigation bar and click **Create** on the right.

   ![create-service](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/create-service.png)

3. In the **Create Service** dialog box, click **Stateless Service**.

   ![stateless-service](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/stateless-service.png)

4. Set the Service name (for example, `hpa`) and click **Next**.

   ![service-name](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/service-name.png)

5. Click **Add Container Image**, set **Image** to `mirrorgooglecontainers/hpa-example` and click **Use Default Ports**.

   ![add-container-image](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/add-container-image.png)

6. Set the CPU request (for example, 0.15 cores) for each container, click **√**, and click **Next**.

   {{< notice note >}}

   * To use HPA based on CPU usage, you must set the CPU request for each container, which is the minimum CPU resource reserved for each container (for details, see the [official Kubernetes document](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)). The HPA feature compares the average Pod CPU usage with a target percentage of the average Pod CPU request.
   * For HPA based on memory usage, you do not need to configure the memory request.

   {{</ notice >}}

   ![cpu-request](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/cpu-request.png)

7. Click **Next** on the **Mount Volumes** tab and click **Create** on the **Advanced Settings** tab.

## Configure Kubernetes HPA

1. Choose **Deployments** in **Workloads** on the left navigation bar and click the HPA Deployment (for example, hpa-v1) on the right.

   ![hpa-deployment](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/hpa-deployment.png)

2. Click **More** and choose **Horizontal Pod Autoscaling** from the drop-down list.

   ![horizontal-pod-autoscaling](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/horizontal-pod-autoscaling.png)

3. In the **Horizontal Pod Autoscaling** dialog box, configure the HPA parameters and click **OK**.

   * **CPU Target Utilization**: Target percentage of the average Pod CPU request.
   * **Memory Target Usage**: Target average Pod memory usage in MiB.
   * **Min Replicas Number**: Minimum number of Pods.
   * **Max Replicas Number**: Maximum number of Pods.

   In this example, **CPU Target Utilization** is set to `60`, **Min Replicas Number** is set to `1`, and **Max Replicas Number** is set to `10`.

   {{< notice note >}}

   Ensure that the cluster can provide sufficient resources for all Pods when the number of Pods reaches the maximum. Otherwise, the creation of some Pods will fail.

   {{</ notice >}}

   ![hpa-parameters](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/hpa-parameters.png)

## Verify HPA

This section uses a Deployment that sends requests to the HPA Service to verify that HPA automatically adjusts the number of Pods to meet the resource usage target.

### Create a load generator Deployment

1. Choose **Workloads** in **Application Workloads** on the left navigation bar and click **Create** on the right.

   ![create-deployment](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/create-deployment.png)

2. In the **Create Deployment** dialog box, set the Deployment name (for example, `load-generator`) and click **Next**.

   ![deployment-name](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/deployment-name.png)

3. Click **Add Container Image** and set **Image** to `busybox`.

   ![busybox](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/busybox.png)

4. Scroll down in the dialog box, select **Start Command**, and set **Run Command** to `sh,-c` and **Parameters** to `while true; do wget -q -O- http://<Target Service>.<Target project>.svc.cluster.local; done` (for example, `while true; do wget -q -O- http://hpa.demo-project.svc.cluster.local; done`).

   ![start-command](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/start-command.png)

5. Click **√** and click **Next**.

6. Click **Next** on the **Mount Volumes** tab and click **Create** on the **Advanced Settings** tab.

### View the HPA Deployment status

1. After the load generator Deployment is created, choose **Workloads** in **Application Workloads** on the left navigation bar and click the HPA Deployment (for example, hpa-v1) on the right.

   The number of Pods automatically increases to meet the resource usage target.

   ![target-cpu-utilization](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/target-cpu-utilization.png)

   ![pods-increase](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/pods-increase.png)

2. Choose **Workloads** in **Application Workloads** on the left navigation bar, click <img src="/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/three-dots.png" width="20px" /> on the right of the load generator Deployment (for example, load-generator-v1), and choose **Delete** from the drop-down list. After the load-generator Deployment is deleted, check the status of the HPA Deployment again.

   The number of Pods decreases to the minimum.

   ![pods-decrease](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/pods-decrease.png)

{{< notice note >}}

The system may require a few minutes to adjust the number of Pods and collect data.

{{</ notice >}}

## Edit HPA Configuration

You can repeat steps in [Configure HPA](#configure-hpa) to edit the HPA configuration.

## Cancel HPA

1. Choose **Workloads** in **Application Workloads** on the left navigation bar and click the HPA Deployment (for example, hpa-v1) on the right.

2. Click <img src="/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/three-dots.png" width="20px" /> on the right of **Horizontal Pod Autoscaling** and choose **Cancel** from the drop-down list.

   ![cancel-hpa](/images/docs/project-user-guide/application-workloads/horizontal-pod-autoscaling/cancel-hpa.png)

