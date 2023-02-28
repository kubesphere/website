---
title: 'Deploying a Grafana Application to Kubernetes Using Application Template'

author: 'xxx'
---

## Objective

This tutorial shows you how to quickly deploy a [Grafana](https://grafana.com/) application in KubeSphere via App Template, demonstrating the basic functionality of the application repository, application templates, and application management.

## Prerequisites

You've completed all steps in [Tutorial 1](admin-quick-start.md).

## Hands-on Lab

### Step 1: Add a Application Repository

> Note: The application repository can be either the Object Storage, e.g. [QingStor Object Storage](https://www.qingcloud.com/products/qingstor/), [AWS S3](https://aws.amazon.com/cn/what-is-cloud-object-storage/), or [GitHub Repository](https://github.com/). The packages are composed of Helm Chart template files of the applications. Therefore, before adding an application repository to KubeSphere, you need to create an object storage and upload Helm packages in advance. This tutorial prepares a demo repository based on QingStor Object Storage.

1.1. Sign in with `admin` account and navigate to **Platform → Platform Settings → App Repositories**, then Click **Add App Repository**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717133759.png)

1.2. Fill in the basic information, name it as demo-repo and input the URL with `https://charts.kubesphere.io/main`, you can validate if this URL is available, choose **OK** when you've done.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717134319.png)

1.3. Click **App Templates** on the top of this page, it will automatically import all of the applications from the demo repository.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717134714.png)

### Step 2: Deploy the Grafana Application

2.1. When you've already added the repository, you can logout and sign in with `project-regular` account. Then select **App Templates** on the top of this page, input "grafana" in the search box to find the application.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717145209.png)

2.2. Click into grafana, **Deploy App** and fill in the basic information.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717145338.png)

2.3. **Name** can be customized by yourself, choose the corresponding Workspace (e.g. `demo-workspace`) and Project (e.g. `demo-project`) as the environment. Then choose **Deploy** to deploy Grafana to KubeSphere.

2.4. Back to the `demo-project` and choose **Applications**, then you can see the application `grafana` showing `active` from the application list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717145741.png)

### Step 3: View App Details

3.1. Click into `grafana` application, you will be able to see its Services and Workloads in `Resource Status` page, as well as Environmental Variables and App Template information.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150124.png)

3.2. Next we are going to expose this service outside of the cluster through a NodePort. Enter into its service e.g. `grafana-l47bmc`, then click **More → Edit Internet Access**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150338.png)

3.3. Select `NodePort` from the drop down list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150427.png)

3.4. Therefore it will generate a Node Port, for example, here is `31126` that we can access this service using `<$NodeIP>:<$NodePort>`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150540.png)

### Step 4: Access the Grafana Service

At this point, you will be able to access the Nginx service via `${Node IP}:${NODEPORT}`, e.g. `http://192.168.0.88:31126`, or click the button **Click to visit** to access the Grafana dashboard.

4.1. Note that you have to obtain the account and password from the grafana secret in advance. Navigate to **Configuration Center → Secrets**, click into **grafana-l47bmc (Type: Default)**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152250.png)

4.2. Click the button to display the secret information, then copy and paste the value of **admin-user** and **admin-password**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152352.png)

4.3. Open the Grafana log in page, sign in with the **admin** account.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152831.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152929.png)

## Next Step

Tutorial 7 - [Create Horizontal Pod Autoscaler for Deployment](hpa.md).
