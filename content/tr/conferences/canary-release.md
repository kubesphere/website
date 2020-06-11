---
title: 'Managing Canary Release of Microservice Application on Kubernetes with Istio'

author: 'xxx'
---

Istio’s service mesh is able to manage traffic distribution with complete independence from deployment scaling, which enables a simpler, yet significantly more functional way to realize canary release and rollout. It allows users to introduce a new version of a service by first testing it using a small percentage of user traffic, and then if all goes well, increase, possibly gradually in increments, the percentage while simultaneously phasing out the old version.

KubeSphere provides three kind of grayscale strategies based on Istio, including blue-green deployment, canary release and traffic mirroring. Without modifying the source code, KubeSphere can realize grayscale, traffic governance, tracing, traffic monitoring and other service mesh features.

## What is Bookinfo Application

The Bookinfo application is broken into four separate microservices (There are 3 versions of the reviews microservice):

- productpage. The productpage microservice calls the details and reviews microservices to populate the page.
- details. The details microservice contains book information.
- reviews. The reviews microservice contains book reviews. It also calls the ratings microservice.
- ratings. The ratings microservice contains book ranking information that accompanies a book review.

The end-to-end architecture of the application is shown below, see [Bookinfo Application](https://istio.io/docs/examples/bookinfo/) for more details.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718152533.png)

## Objective

In this tutorial, we're going to deploy a Bookinfo sample application composed of four separate microservices used to demonstrate the canary release, tracing and traffic monitoring using Istio on KubeSphere.

## Prerequisites

- You've completed all steps in [Tutorial 1](admin-quick-start.md).
- You need to turn on the **Application Governance** to enable the tracing feature. (Choose **Project Settings → Internet Access → Edit Gateway → Turn it On**)

## Hands-on Lab

### Step 1: Deploy Bookinfo Application

1.1. Sign in with `project-regular` account and enter into the `demo-project`, navigate to **Application**, click on the **Deploy New Application** then choose **Deploy sample app Bookinfo**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718154143.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718154251.png)

1.2. Click **Create** in the pop-up window, then Bookinfo application has been deployed successfully, application components are listed in this following page, as well as the routes and hostname.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718154424.png)

1.3. Next you can access the Bookinfo homepage as following screenshot via **Click to visit** button. Click on the **Normal user** to enter into the summary page.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161448.png)

1.4. Notice that at this point it only shows **- Reviewer1** and **- Reviewer2** without any stars at the Book Reviews section, this is the initial status of this section.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161819.png)

### Step 2: Create Canary Release for reviews service

2.1. Back to KubeSphere console, choose **Grayscale Release** and click on the **Create Canary Release Job**, then select **Canary Release** and click **Create Job**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162152.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162308.png)

2.2. Fill in the basic information, e.g. `canary-release`, click **Next** and select **reviews** as the canary service, then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162550.png)

2.3. Enter `v2` as **Grayscale Release Version Number** and fill in the new image blank with `kubesphere/examples-bookinfo-reviews-v2:1.13.0` (i.e. Modify v1 to v2), then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162840.png)

2.4. The canary release supports **Forward by traffic ratio** and **Forward by request content**, in this tutorial we choose adjust the traffic ratio to manage traffic distribution between v1 and v2. Drag the slider to adjust v2 takes up 30% traffic, and v2 takes up 70%.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718163639.png)

2.5. Click **Create** when you've completed configuration, then you're able to see the `canary-release` has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718164216.png)

### Step 3: Verify the Canary Release

When you visit the Bookinfo website again and refresh your browser repeatedly, you'll be able to see that the Bookinfo reviews section will switch between v1 and v2 at a random rate of about 30% and 70% respectively.

![](https://pek3b.qingstor.com/kubesphere-docs/png/bookinfo-canary.gif)

### Step 4: Inspect the Traffic Topology Graph

4.1. Connect to your SSH Client, use the following command to introduce real traffic to simulate the access to a bookinfo application every 0.5 seconds.

```
$ curl http://productpage.demo-project.192.168.0.88.nip.io:32565/productpage?u=normal

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0< 74  5183   74  3842    0     0  73957      0 --:--:-- --:--:-- --:--:-- 73884<!DOCTYPE html>
   ···
```

4.2. From the traffic management diagram, you can easily see the service invocation and dependencies, health, performance between different microservices.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170256.png)

4.3. Click on the reviews card, the traffic monitoring graph will come out, including real-time data of **Success rate**, **Traffic** and **Duration**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170727.png)

### Step 5: Inspect the Tracing Details

KubeSphere provides distributed tracing feature based on [Jaeger](https://www.jaegertracing.io/), which is used for monitoring and troubleshooting microservices-based distributed application.

5.1. Choose **Tracing** tab, you can clearly see all phases and internal calls of a request, as well as the period in each phase.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718171052.png)

5.2. Click into any one item, you can even drill down to see the request details and this request is being processed by which machine (or container).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718173117.png)

### Step 6: Take over all traffic

6.1. As mentioned previously, when the canary version (v2) is released, it could be used to send 70% of traffic to the canary version. Publishers can test the new version online and collect user feedback.

Switch to **Grayscale Release** tab, click into `canary-release`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181326.png)

6.2. Click **···** and select **Take Over** at `reviews-v2`, then 100% of traffic will be sent to the new version (v2).

> Note: If anything goes wrong along the way, we can abort and rollback to the previous version (v1) in time.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181413.png)

6.3. Open the bookinfo page again and refresh the browsers several times, we can find that it only shows the v2 (ratings with black stars) in reviews module.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718235627.png)

### Step 7: Take Down the Old Version

When the new version v2 jas been totally released online and takes over all the traffic, also the testing results and online users feedback are confirmed to be correct, you can take down the old version and remove the resources of v1.

Click on the **Job Offline** button to take down the old version,

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001803.png)

> Notice: If take down a specific version of the component, the associated workloads and istio related configuration resources will be removed simultaneously, it turns out that v1 is being replaced by v2.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001945.png)
