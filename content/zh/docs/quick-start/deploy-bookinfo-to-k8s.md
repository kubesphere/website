---
title: "部署 Bookinfo 和管理流量"
keywords: 'kubesphere, kubernetes, docker, 多租户'
description: '部署一个 Bookinfo 应用'

linkTitle: "部署 Bookinfo 和管理流量"
weight: 3040
---

[Istio](https://istio.io/)，作为一种开源服务网格解决方案，为微服务提供了强大的流量管理功能。以下是[Istio](https://istio.io/latest/zh/docs/concepts/traffic-management/)官方网站上关于流量管理的简介：

*Istio 的流量路由规则可以让您很容易的控制服务之间的流量和 API 调用。Istio 简化了服务级别属性的配置，比如熔断器、超时和重试，并且能轻松的设置重要的任务，如 A/B 测试、金丝雀发布、基于流量百分比切分的概率发布等。它还提供了开箱即用的故障恢复特性，有助于增强应用的健壮性，从而更好地应对被依赖的服务或网络发生故障的情况。*

KubeSphere 基于 Istio 提供了三种灰度策略，包括蓝绿部署，金丝雀发布和流量镜像。

Among others, a canary release represents an effective software development strategy in which a new version is deployed for testing with the base version preserved in the production environment. This strategy will bring part of the traffic to the new version being tested and the production release takes up the rest.

## 目标

在本教程中，您将学习如何部署由四个独立的微服务组成的示例应用程序 Bookinfo ，以及如何使用 KubeSphere 的流量管理功能来发布新版本。

## 前置条件

- 您需要启用 [KubeSphere Service Mesh](../../pluggable-components/service-mesh/) 。

- 您需要完成 [Create Workspace, Project, Account and Role](../create-workspace-and-project/) 中的所有任务。

- You need to enable **Application Governance**. To do so, follow the steps below:

  Log in the console as `project-admin` and go to your project. Navigate to **Advanced Settings** under **Project Settings**, click **Edit**, and select **Edit Gateway**. In the dialog that appears, flip on the toggle switch next to **Application Governance**.

![edit-gateway](https://ap3.qingstor.com/kubesphere-website/docs/20200908145220.png)

![switch-application-governance](https://ap3.qingstor.com/kubesphere-website/docs/20200908150358.png)

{{< notice note >}} 

You need to enable **Application Governance** so that you can use the Tracing feature. Once it is enabled, please check whether an annotation (e.g. `nginx.ingress.kubernetes.io/service-upstream: true`) is added for your route (Ingress) if the route is inaccessible.

{{</ notice >}} 

## 预计时间

20分钟左右。

## 什么是 Bookinfo 应用程序

The Bookinfo application is composed of four separate microservices as shown below. There are three versions of the **reviews** microservice.

- The **productpage** microservice calls the **details** and **reviews** microservices to populate the page.
- The **details** microservice contains book information.
- The **reviews** microservice contains book reviews. It also calls the ratings microservice.
- The **ratings** microservice contains book ranking information that accompanies a book review.

The end-to-end architecture of the application is shown below. See [Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/) for more details.

![Bookinfo Application](https://pek3b.qingstor.com/kubesphere-docs/png/20190718152533.png#align=left&display=inline&height=1030&originHeight=1030&originWidth=1712&search=&status=done&width=1712)

## Hands-on Lab

### Task 1: Deploy Bookinfo

1. Log in the console as `project-regular` and enter **demo-project**. Navigate to **Applications** under **Application Workloads**, and click **Deploy Sample Application** on the right.

![sample-bookinfo](https://ap3.qingstor.com/kubesphere-website/docs/20200908100219.png)

2. Click **Next** in the dialog that appears where required fields are pre-populated and relevant components are already set. You do not need to change the setting and just click **Create** in the final page (**Internet Access**).

![create-bookinfo](https://ap3.qingstor.com/kubesphere-website/docs/20200908101041.png)

3. In **Workloads**, make sure the status of all four deployments displays `running`, which means the app has been created successfully.

![running](https://ap3.qingstor.com/kubesphere-website/docs/20200908101328.png)

{{< notice note >}} 

It may take a few minutes before the deployments are up and running.

{{</ notice >}} 

### Task 2: Access Bookinfo

1. In **Applications**, go to **Composing App** and click the app `bookinfo` to see its detailed information.

![click-bookinfo](https://ap3.qingstor.com/kubesphere-website/docs/20200908102119.png)

{{< notice note >}} 

If you do not see the app in the list, refresh your page.

{{</ notice >}} 

2. In the detail page, record the hostname and port number of the app which will be used to access Bookinfo.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908102821.png)

3. As the app will be accessed outside the cluster via NodePort, you need to open the port in the image above (in this case, the port number is 32277) in your security group for outbound traffic and set any port forwarding rules if necessary.
4. Edit your local host file (`/etc/hosts`) by adding an entry in it to map the hostname to the public IP address. For example:

```bash
# {Public IP} {hostname}
139.198.19.38 productpage.demo-project.192.168.0.2.nip.io
```

{{< notice warning >}} 

Do not copy the content above directly to your local host file. Please replace it with your own public IP address and hostname.

{{</ notice >}} 

5. When you finish, click the button **Click to visit** to access the app.

![click-to-visit](https://ap3.qingstor.com/kubesphere-website/docs/20200908105527.png)

6. In the app detail page, click **Normal user** in the bottom-left corner.

![normal-user](https://ap3.qingstor.com/kubesphere-website/docs/20200908105756.png)

7. In the image below, you can notice that only **Reviewer1** and **Reviewer2** are displayed without any stars in the **Book Reviews** section. This is the status of this app version. In the task below, you can see a different UI appearance through a canary release.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908110106.png)

### Task 3: Create Canary Release

1. Go back to KubeSphere console and select **Grayscale Release**. Click **Create Canary Release Job** and you will be directed to **Grayscale Release** section of the project. Select **Canary Release** and click **Create Job**.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908110903.png)

![create-job](https://ap3.qingstor.com/kubesphere-website/docs/20200908111003.png)

2. Add a name (e.g. `canary-release`) and click **Next**. Select **reviews** as the component to roll out a change and click **Next**.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908111359.png)

3. In the next dialog, enter `v2` as **Grayscale Release Version Number** and change the image to `kubesphere/examples-bookinfo-reviews-v2:1.13.0` (`v1` changed to `v2`). Click **Next** to continue.

![release-version](https://ap3.qingstor.com/kubesphere-website/docs/20200908111958.png)

4. The canary release supports two release strategies: **Forward by traffic ratio** and **Forward by request content**. In this tutorial, please select **Forward by traffic ratio** and set the same traffic ratio for v1 and v2 (50% each). You can click the icon in the middle and move leftwards or rightwards to change the traffic ratio. Click **Create** to finish the setting.

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908113031.png)

5. The job created will display in **Job Status**.

![canary-release-test](https://ap3.qingstor.com/kubesphere-website/docs/20200908113728.png)

### Task 4: Verify Canary Release

Visit the Bookinfo website again and refresh your browser repeatedly. You will be able to see the **Book Reviews** section switched between v1 and v2 at a rate of 50%.

![verify-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/canary.gif)

### Task 5: View Network Topology

1. Execute the following command in the machine where KubeSphere runs to bring in real traffic to simulate the access to Bookinfo every 0.5 seconds.

```bash
watch -n 0.5 "curl http://productpage.demo-project.192.168.0.2.nip.io:32277/productpage?u=normal"
```

{{< notice note >}}

Make sure you replace the project name, IP address and port number in the above command with your own.

{{</ notice >}} 

2. In **Traffic Management**, you can see communications, dependency, health and performance among different microservices.

![traffic-management](https://ap3.qingstor.com/kubesphere-website/docs/20200908133652.png)

3. Click a component (e.g. **reviews**) and you can see the information of traffic monitoring on the right, displaying real-time data of **Traffic**, **Success rate** and **Duration**.

![real-time-data](https://ap3.qingstor.com/kubesphere-website/docs/20200908134454.png)

### Task 6: View Tracing Details

KubeSphere provides the distributed tracing feature based on [Jaeger](https://www.jaegertracing.io/), which is used to monitor and troubleshoot microservices-based distributed applications.

1. In **Tracing** tab, you can clearly see all phases and internal calls of requests, as well as the period in each phase.

![tracing](https://ap3.qingstor.com/kubesphere-website/docs/20200908135108.png)

2. Click any item, and you can even drill down to see request details and where this request is being processed (which machine or container).

![tracing-kubesphere](https://ap3.qingstor.com/kubesphere-website/docs/20200908135252.png)

### Task 7: Take Over All Traffic

With the canary release, you can test the new version online by bringing in part of the actual traffic and collect user feedback. If everything runs smoothly without any issues, you can bring all the traffic to the new version.

1. In **Grayscale Release**, click the canary release job.

![open-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908140138.png)

2. In the dialog that appears, click the three dots of **reviews v2** and select **Take Over**. It means 100% of the traffic will be sent to the new version (v2).

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908140314.png)

{{< notice note >}}

If anything goes wrong with the new version, you can roll back to the previous version v1 anytime.

{{</ notice >}} 

3. Open the Bookinfo page again and refresh the browser several times. You can find that it only shows the result of **reviews v2** (i.e. ratings with black stars).

![](https://ap3.qingstor.com/kubesphere-website/docs/20200908140921.png)

### Task 8: Remove the Old Version

Now that the new version v2 takes over all the traffic successfully, you can remove the old version and release the resources of v1 based on your needs.

{{< notice warning >}} 

After you remove a certain version, related workloads and Istio-based configuration resources will also be deleted.

{{</ notice >}}

1. In **Grayscale Release**, click the canary release job.

![open-canary-release](https://ap3.qingstor.com/kubesphere-website/docs/20200908140138.png)

2. In the dialog that appears, click **Job offline** to remove the old version.

![job-offline](https://ap3.qingstor.com/kubesphere-website/docs/20200908142246.png)

The above tasks serve as a example of how to adopt a canary release to control traffic and publish a new version of your app. You can also try different strategies in **Grayscale Release** or see related sections in **Project Administration and Usage**.

## Reference

[Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/)