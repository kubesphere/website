---
title: "Create Horizontal Pod Autoscaler for Deployment"
keywords: 'kubesphere, kubernetes, docker, HPA, Horizontal Pod Autoscaler'
description: 'How to scale deployment replicas using horizontal Pod autoscaler'

linkTitle: "6"
weight: 3060
---

The Horizontal Pod Autoscaler (HPA) automatically scales the number of pods in a deployment based on observed CPU utilization or memory usage. The controller periodically adjusts the number of replicas in a deployment to match the observed average CPU utilization or memory usage to the target value specified by user.

## How does the HPA work

The Horizontal Pod Autoscaler is implemented as a control loop with a period of default 30 seconds controlled by the controller manager HPA sync-period flag. For per-pod resource metrics like CPU, the controller fetches the metrics from the resource metrics API for each pod targeted by the Horizontal Pod Autoscaler. See [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for more details.

![HPA Arch](https://pek3b.qingstor.com/kubesphere-docs/png/20190716214909.png#alt=)

## Objective

This document walks you through an example of configuring Horizontal Pod Autoscaler for the hpa-example deployment. In addition, we will create a deployment to send an infinite loop of queries to the hpa-example application, demonstrating its autoscaling function and the HPA principle.

## Estimate Time

About 25 minutes

## Prerequisites

- You need to [enable HPA](../../installation/install-metrics-server).
- You need to create a workspace, a project, and a `project-regular` user account, and this account needs to be invited into the project with the role `operator`. Please refer to [Get started with multi-tenant management](../admin-quick-start).

## Hands-on Lab

### Step 1: Create Stateless Service

1.1. Log in with `project-regular` account. Enter **demo-project**, then select **Application Workloads → Services**

![Service List](https://pek3b.qingstor.com/kubesphere-docs/png/20200221075410.png)

1.2.  Click **Create Service** and choose **Stateless service**, name it `hpa`, then click **Next**.

![Create Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200221075509.png)

1.3. Click **Add Container Image**, then input `mirrorgooglecontainers/hpa-example`and press return key. It will automatically search and load the image information, choose `Use Default Ports`.

![Add Container](https://pek3b.qingstor.com/kubesphere-docs/png/20200221075857.png)

1.4. Click `√` to save it, and click **Next**. Then skip **Mount Volumes** and **Advanced Settings**, and click **Create**. At this point, the stateless service `hpa` has been created successfully.

> Note: At the same time, the corresponding Deployment and Service have been created in KubeSphere.

![HPA Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200221080648.png)

### Step 2: Configure HPA

2.1. Choose **Workloads → Deployments**. Enter `hpa` to view its detailed page.

![Deployment List](https://pek3b.qingstor.com/kubesphere-docs/png/20200221081356.png)

2.2. Choose **More → Horizontal Pod Autoscaler**.

![HPA Menu](https://pek3b.qingstor.com/kubesphere-docs/png/20200221081517.png)

2.3. Give some sample values for HPA configuration as follows. Click **OK** to finish the configuration.

- CPU Request Target(%): `50` (represents the percent of target CPU utilization)
- Min Replicas Number: `1`
- Max Replicas Number: `10`

> Note: After setting HPA for Deployment, it will create a `Horizontal Pod Autoscaler` in Kubernetes for autoscaling.

![HPA Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200221083958.png)

### Step 3: Create Load-generator

3.1. In the current project, navigate to **Workloads → Deployments**. Click **Create** and fill in the basic information in the pop-up window, name it `load-generator`, click **Next**.

3.2. Click on the **Add Container Image**, enter `busybox` into Image edit box, and press return key.

3.3. Scroll down to **Start command**. Add commands and parameters as follows. These commands are used to request hpa service and create CPU load.

#### Run command

```bash
sh,-c
```

#### Parameters

> Note the http address example is like http://{$service-name}.{$project-name}.svc.cluster.local. You need to replace the following http address with the actual name of service and project.

```bash
while true; do wget -q -O- http://hpa.demo-project.svc.cluster.local; done
```

![Load Generator configuration](https://pek3b.qingstor.com/kubesphere-docs/png/20200221090034.png)

3.4. Click on the `√` button when you are done, then click **Next**. We do not use volume in this demo, therefore click **Next → Create** to complete the creation.

So far, we have created two deployments, i.e. `hpa` and `load-generator`, and one service, i.e. `hpa`.

![Deployments](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222833.png#alt=)

### Step 4: Verify HPA

#### View Deployment Status

Choose **Workloads → Deployments**,  enter the deployment `hpa` to view detailed page. Please pay attention to the replicas, Pod status and CPU utilization, as well as the Pods monitoring graphs.

![Deployment Status](https://pek3b.qingstor.com/kubesphere-docs/png/20200221091126.png)

#### View HPA Status

When the `load-generator` Pod works, it will continuously request `hpa` service. As shown from the following screenshot, the CPU utilization is significantly increased after refreshing the page. Currently it is rising to `1012%`, and the desired replicas and current replicas is rising to `10/10`.

![HPA Status](https://pek3b.qingstor.com/kubesphere-docs/png/20200221091504.png)

After around two minutes, the CPU decreased to `509%`, which proves the principle of HPA.

![HPA Changed Status](https://pek3b.qingstor.com/kubesphere-docs/png/20200221092228.png)

### Step 5: Verify Monitoring

5.1. Scroll down to the Pods list, and pay attention to the first Pod that we created. Generally, we can see the CPU usage of the Pod shows a significant upward trend in the monitoring graph. When HPA starts working, the CPU usage has an obvious decreased trend. Finally it tends to be smooth.

![HPA Monitoring](https://pek3b.qingstor.com/kubesphere-docs/png/20200221093302.png)

#### View workloads monitoring

5.2. Switch to the **Monitoring** tab and select `Last 30 minutes` in the filter.

![Detailed Monitoring](https://pek3b.qingstor.com/kubesphere-docs/png/20200221092927.png)

#### View all replicas monitoring

5.3. Click **View all replicas** on the right of monitoring graph to inspect all replicas monitoring graphs.

![Replicas Monitoring](https://pek3b.qingstor.com/kubesphere-docs/png/20200221093939.png)

### Step 6: Stop Load Generation

6.1. Go back to **Workloads → Deployments** and delete `load-generator` to cease the load increasing.

6.2. Inspect the status of the `hpa` again. You will find that its current CPU utilization has slowly dropped to 10% **in a few minutes**. Eventually the HPA reduces its deployment replicas to one which is the initial value. The trend in the monitoring curve can also help us to understand the working principle of HPA.

![Stop Load Generator](https://pek3b.qingstor.com/kubesphere-docs/png/20200221095630.png)

6.3. Now, drill into the **Pod** detailed page from Pod list, inspect the monitoring graph and review the CPU utilization and Network inbound/outbound trends. We can find the trends match this HPA example.

![HPA Result](https://pek3b.qingstor.com/kubesphere-docs/png/20200221094853.png)

6.4. Then drill into the container of this Pod, we can find it has the same trend as the Pod.

![Pod Monitoring](https://pek3b.qingstor.com/kubesphere-docs/png/20200221095007.png)

## Modify HPA Settings

If you need to modify the settings of the HPA, you can go to the deployment detailed page, and click **More → Horizontal Pod Autoscaler**, edit the pop-up window at your will.

## Cancel HPA

If you do not need HPA for deployment, you can click **··· → Cancel**.

![Cancel HPA](https://pek3b.qingstor.com/kubesphere-docs/png/20200221095420.png)

Congratulation! You have been familiar with how to set HPA for deployment through KubeSphere console.
