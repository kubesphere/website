---
title: "Managing Canary Release of Microservice App based on Istio"
keywords: 'kubesphere, kubernetes, docker, istio, canary release, jaeger'
description: 'How to manage canary release of microservices using Istio platform'


linkTitle: "11"
weight: 3110
---

[Istio](https://istio.io/)，as an open source service mesh, provides powerful traffic management which makes canary release of a microservice possible. **Canary release** provides canary rollouts, and staged rollouts with percentage-based traffic splits.

> The following paragraph is from [Istio](https://istio.io/docs/concepts/traffic-management/) official website.

Istio’s traffic routing rules let you easily control the flow of traffic and API calls between services. Istio simplifies configuration of service-level properties like circuit breakers, timeouts, and retries, and makes it easy to set up important tasks like A/B testing, canary rollouts, and staged rollouts with percentage-based traffic splits. It also provides out-of-box failure recovery features that help make your application more robust against failures of dependent services or the network.

KubeSphere provides three kinds of grayscale strategies based on Istio, including blue-green deployment, canary release and traffic mirroring.

## Objective

In this tutorial, we are going to deploy a Bookinfo sample application composed of four separate microservices to demonstrate the canary release, tracing and traffic monitoring using Istio on KubeSphere.

## Prerequisites

- You need to [Enable Service Mesh System](../../installation/install-servicemesh).
- You need to complete all steps in [Getting Started with Multi-tenant Management](../admin-quick-start.md).
- Log in with `project-admin` and go to your project, then navigate to **Project Settings → Advanced Settings → Set Gateway** and turn on **Application Governance**.

### What is Bookinfo Application

The Bookinfo application is composed of four distributed microservices as shown below. There are three versions of the Reviews microservice.

- The **productpage** microservice calls the details and reviews microservices to populate the page.
- The **details** microservice contains book information.
- The **reviews** microservice contains book reviews. It also calls the ratings microservice.
- The **ratings** microservice contains book ranking information that accompanies a book review.

The end-to-end architecture of the application is shown below, see [Bookinfo Application](https://istio.io/docs/examples/bookinfo/) for more details.

![Bookinfo Application](https://pek3b.qingstor.com/kubesphere-docs/png/20190718152533.png#align=left&display=inline&height=1030&originHeight=1030&originWidth=1712&search=&status=done&width=1712)

## Hands-on Lab

### Step 1: Deploy Bookinfo Application

1.1. Log in with account `project-regular` and enter the **demo-project**, navigate to **Application Workloads → Applications**, click **Deploy Sample Application**.

![Application List](https://pek3b.qingstor.com/kubesphere-docs/png/20200210234559.png)

1.2. Click **Create** in the pop-up window, then the Bookinfo application will be deployed automatically, and the application components are listed in the following page, as well as the routes and hostname.

![Create Bookinfo Application](https://pek3b.qingstor.com/kubesphere-docs/png/20200210235159.png)

1.3. Now you can access the Bookinfo homepage as the following screenshot shown via **Click to visit** button. Click on the **Normal user** to enter into the summary page.

![Product Page](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161448.png#align=left&display=inline&height=922&originHeight=922&originWidth=2416&search=&status=done&width=2416)

> Note you need to make the URL above accessible from your computer.

1.4. Notice that at this point it only shows **- Reviewer1** and **- Reviewer2** without any stars at the Book Reviews section. This is the initial status of this step.

![Review Page](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161819.png#align=left&display=inline&height=986&originHeight=986&originWidth=2854&search=&status=done&width=2854)

### Step 2: Create Canary Release for Reviews Service

2.1. Back to KubeSphere console, choose **Grayscale Release**, and click **Create Canary Release Job**. Then select **Canary Release** and click **Create Job**.

![Grayscale Release List](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162152.png#align=left&display=inline&height=748&originHeight=748&originWidth=2846&search=&status=done&width=2846)

![Create Grayscale release](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162308.png#align=left&display=inline&height=1416&originHeight=1416&originWidth=2822&search=&status=done&width=2822)

2.2. Fill in the basic information, e.g. name it `canary-release`, click **Next** and select **reviews** as the canary service, then click **Next**.

![Reviews New Version](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162550.png#align=left&display=inline&height=926&originHeight=926&originWidth=1908&search=&status=done&width=1908)

2.3. Enter `v2` as **Grayscale Release Version Number** and fill in the new image box with `kubesphere/examples-bookinfo-reviews-v2:1.13.0`. You can simply change the version of the default value in the box from `v1` to `v2`. Then click **Next**.

![Reviews New Version Info](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162840.png#align=left&display=inline&height=754&originHeight=754&originWidth=1910&search=&status=done&width=1910)

2.4. The canary release supports **Forward by traffic ratio** and **Forward by request content**. In this tutorial we choose adjusting the traffic ratio to manage traffic routing between v1 and v2. Drag the slider to adjust v2 up 30% traffic, and v2 up 70%.

![Policy Config](https://pek3b.qingstor.com/kubesphere-docs/png/20190718163639.png#align=left&display=inline&height=750&originHeight=750&originWidth=1846&search=&status=done&width=1846)

2.5. Click **Create** when you have completed the configuration, then you are able to see the `canary-release` has been created successfully.

![Canary Release](https://pek3b.qingstor.com/kubesphere-docs/png/20190718164216.png#align=left&display=inline&height=850&originHeight=850&originWidth=2822&search=&status=done&width=2822)

### Step 3: Verify the Canary Release

When you visit the Bookinfo website again and refresh your browser repeatedly, you will be able to see that the Bookinfo reviews section switch between v1 and v2 at a random rate of about 30% and 70% respectively.

![Verify Canary Release](https://pek3b.qingstor.com/kubesphere-docs/png/bookinfo-canary.gif#align=left&display=inline&height=1016&originHeight=1016&originWidth=2844&search=&status=done&width=2844)

### Step 4: Inspect the Traffic Topology Graph

4.1. Connect to your SSH Client, use the following command to introduce real traffic to simulate the access to the bookinfo application every 0.5 seconds.

```bash
$ curl http://productpage.demo-project.192.168.0.88.nip.io:32565/productpage?u=normal

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0< 74  5183   74  3842    0     0  73957      0 --:--:-- --:--:-- --:--:-- 73884<!DOCTYPE html>
   ···
```

4.2. From the traffic management diagram, you can easily see the service invocation and dependencies, health, performance between different microservices.

![Inject Traffic](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170256.png#align=left&display=inline&height=1338&originHeight=1338&originWidth=2070&search=&status=done&width=2070)

4.3. Click on the reviews card. The traffic monitoring graph will come out including real-time data of **Success rate**, **Traffic** and **Duration**.

![Traffic Graph](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170727.png#align=left&display=inline&height=1150&originHeight=1150&originWidth=2060&search=&status=done&width=2060)

### Step 5: Inspect the Tracing Details

KubeSphere provides distributed tracing feature based on [Jaeger](https://www.jaegertracing.io/), which is used for monitoring and troubleshooting microservices-based distributed application.

5.1. Choose **Tracing** tab. You can clearly see all phases and internal calls of a request, as well as the period in each phase.

![Tracing](https://pek3b.qingstor.com/kubesphere-docs/png/20190718171052.png#align=left&display=inline&height=1568&originHeight=1568&originWidth=2824&search=&status=done&width=2824)

5.2. Click any item, you can even drill down to see the request details and this request is being processed by which machine or container.

![Request Details](https://pek3b.qingstor.com/kubesphere-docs/png/20190718173117.png#align=left&display=inline&height=1382&originHeight=1382&originWidth=2766&search=&status=done&width=2766)

### Step 6: Take Over All Traffic

6.1. As mentioned previously, when the canary version v2 is released, it could be used to send a portion of traffic to the canary version. Publishers can test the new version online and collect user feedbacks.

Switch to **Grayscale Release** tab, click into **canary-release**.

![Canary Release List](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181326.png#align=left&display=inline&height=756&originHeight=756&originWidth=2824&search=&status=done&width=2824)

6.2. Click **···** at **reviews v2** and select **Take Over**. Then 100% of traffic will be sent to the new version v2.

> Note: If anything goes wrong along the way, we can abort and roll back to the previous version v1 in no time.

![Adjust Traffic](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181413.png#align=left&display=inline&height=1438&originHeight=1438&originWidth=2744&search=&status=done&width=2744)

6.3. Open the Bookinfo page again and refresh the browsers several times. We can find that it only shows the result of reviews v2, i.e., ratings with black stars.

![New Traffic Result](https://pek3b.qingstor.com/kubesphere-docs/png/20190718235627.png#align=left&display=inline&height=1108&originHeight=1108&originWidth=2372&search=&status=done&width=2372)

### Step 7: Take Down the Old Version

When the new version v2 has been released online and takes over all the traffic successfully. Also, the testing results and online users feedback are confirmed to be correct. You can take down the old version and remove the resources of v1.

Click on the **Job Offline** button to take down the old version.

![Take Down Old Version](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001803.png#align=left&display=inline&height=1466&originHeight=1466&originWidth=2742&search=&status=done&width=2742)

> Notice: If take down a specific version of the component, the associated workloads and Istio related configuration resources will be removed simultaneously. It turns out that v1 is being replaced by v2.

![Canary Release Result](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001945.png#align=left&display=inline&height=1418&originHeight=1418&originWidth=1988&search=&status=done&width=1988)
