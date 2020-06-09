---
title: 'Creating Horizontal Pod Autoscaler for Deployment'

author: 'xxx'
---

The Horizontal Pod Autoscaler automatically scales the number of pods in a deployment based on observed CPU utilization or Memory usage. The controller periodically adjusts the number of replicas in a deployment to match the observed average CPU utilization to the target value specified by user.

## How does the HPA work

The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled by the controller manager’s HPA sync-period flag (with a default value of 15 seconds). For per-pod resource metrics (like CPU), the controller fetches the metrics from the resource metrics API for each pod targeted by the Horizontal Pod Autoscaler. See [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for more details.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716214909.png)

## Objective

This document walks you through an example of configuring Horizontal Pod Autoscaler for the hpa-example deployment.

We will create a deployment to send an infinite loop of queries to the hpa example application, demonstrating its autoscaling function and the HPA Principle.

## Prerequisites

- You need to create a workspace and project, see the [Tutorial 1](admin-quick-start.md) if not yet.
- You need to sign in with `project-regular` and enter into the corresponding project.

## Hands-on Lab

### Step 1: Create a Deployment

1.1. Enter into `demo-project`, then select **Workload → Deployments** and click **Create Deployment** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716215848.png)

1.2. Fill in the basic information in the pop-up window. e.g. `Name: hpa-example`, then click **Next** when you've done.

### Step 2: Configure the HPA

2.1. Choose **Horizontal Pod Autoscaling**, and fill in the table as following:

- Min Replicas Number: 2
- Max Replicas Number: 10
- CPU Request Target(%): 50 (represents the percent of target CPU utilization)

Then click on the **Add Container** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716220122.png)

2.2. Fill in the Pod Template with following values, then click **Save** to save these settings.

- Image: `mirrorgooglecontainers/hpa-example`
- Service Settings
  - Name: port
  - port: 80 (TCP protocol by default)

![Add a Container](https://pek3b.qingstor.com/kubesphere-docs/png/20190321234139.png)

2.3. Skip the Volume and Label Settings, click the **Create** button directly. Now the hpa-example deployment has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221028.png)

### Step 3: Create a Service

3.1. Choose **Network & Services → Services** on the left menu, then click on the **Create Service** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221110.png)

3.2. Fill in the basic information, e.g. `name : hpa-example`, then click **Next**.

3.3. Choose the first item `Virtual IP: Access the service through the internal IP of the cluster` for the service Settings.

3.4. In Selector blanks, click **Specify Workload** and select the `hpa-example` as the backend workload. Then choose **Save** and fill in the Ports blanks.

- Ports:
  - Name: port
  - Protocol: TCP
  - Port: 80
  - Target port: 80

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221536.png)

Click **Next → Create** to complete the creation. Now the hpa-example service has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221828.png)

### Step 4: Create Load-generator

4.1. In the current project, redirect to **Workload → Deployments**. Click **Create** button and fill in the basic information in the pop-up window, e.g. `Name : load-generator`. Click **Next** when you've done.

4.2. Click on **Add Container** button, and fill in the Pod template as following:

- Image: busybox
- Scroll down to **Start command**, add commands and parameters as following:

```
# Commands
sh
-c

# Parameters (Note: the http service address like http://{$service name}.{$project name}.svc.cluster.local)
while true; do wget -q -O- http://hpa-example.demo-project.svc.cluster.local; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222521.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222549.png)

Click on the **Save** button when you've done, then click **Next**.

4.3. Click **Next → Create** to complete creation.

So far, we've created 2 deployments (i.e. hpa-example and load-generator) and 1 service (i.e. hpa-example).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222833.png)

### Step 5: Verify the HPA

5.1. Click into `hpa-example` and inspect the changes, please pay attention to the HPA status and the CPU utilization, as well as the Pods monitoring graphs.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322010021.png)

### Step 6: Verify the Auto Scaling

6.1. When all of the load-generator pods are successfully created and begin to access the hpe-example service, as shown in the following figure, the CPU utilization is significantly increased after refreshing the page, currently rising to `722%`, and the desired replicas and current replicas is rising to `10/10`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716223104.png)

> Note: Since the Horizontal Pod Autoscaler is working right now, the load-generator looply requests the hpa-example service to make the CPU utilization rised rapidly. After the HPA starts working, it makes the backend of the service increases fast to handle a large number of requests together. Also the replicas of hpa-example continues to increase follow with the CPU utilization increases, which demonstrates the working principle of HPA.

6.2. In the monitoring graph, it can be seen that the CPU usage of the first Pod that we originally created, showing a significant upward trend. When HPA started working, the CPU usage has a significant decreased trend, finally it tends to be smooth. Accordingly, the CPU usage is increasing on the newly created Pods.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716223415.png)

### Step 7: Stop the Load Generation

7.1. Redirect to **Workload → Deployments** and delete `load-generator` to cease the load increasing.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225225.png)

7.2. Inspect the status of the `hpa-example` again, you'll find that its current CPU utilization has slowly dropped to 10% in a few minutes, eventually the HPA has reduced its deployment replicas to 1 (initial value). The trend reflected by the monitoring curve can also help us to further understand the working principle of HPA;

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716230725.png)

7.3. It enables user to inspect the monitoring graph of Deloyment, see the CPU utilization and Network inbound/outbound trend, they just match with the HPA example.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716230333.png)

## Modify HPA Settings

If you need to modify the settings of the HPA, you can click into the deployment, and click **More → Horizontal Pod Autoscaler**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225918.png)

## Cancel HPA

Click **···** button on the right and **Cancel** if you don't need HPA within this deployment.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225953.png)

## Next Step

Tutorial 8 - [Source-to-Image: Build Reproducible Images from Source Code](s2i.md).
