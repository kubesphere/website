---
title: "Create a Microservices-based App"
keywords: 'KubeSphere, Kubernetes, service mesh, microservices'
description: 'Learn how to compose a microservice-based application from scratch.'
linkTitle: "Create a Microservices-based App"
weight: 10140
---

With each microservice handling a single part of the app's functionality, an app can be divided into different components. These components have their own responsibilities and limitations, independent from each other. In KubeSphere, this kind of app is called **Composed App**, which can be built through newly created Services or existing Services.

This tutorial demonstrates how to create a microservices-based app Bookinfo, which is composed of four Services, and set a customized domain name to access the app.

## Prerequisites

- You need to create a workspace, a project, and a user (`project-regular`) for this tutorial. The user needs to be invited to the project with the `operator` role. For more information, see [Create Workspaces, Projects, Users and Roles](../../../quick-start/create-workspace-and-project/).
- `project-admin` needs to [set the project gateway](../../../project-administration/project-gateway/) so that `project-regular` can define a domain name when creating the app.

## Create Microservices that Compose an App

1. Log in to the web console of KubeSphere and navigate to **Apps** in **Application Workloads** of your project. On the **Composed Apps** tab, click **Create**.

2. Set a name for the app (for example, `bookinfo`) and click **Next**.

3. On the **Service Settings** page, you need to create microservices that compose the app. Click **Create Service** and select **Stateless Service**.

4. Set a name for the Service (e.g `productpage`) and click **Next**.

   {{< notice note >}}

   You can create a Service on the dashboard directly or enable **Edit YAML** in the upper-right corner to edit the YAML file.

   {{</ notice >}} 

5. Click **Add Container** under **Containers** and enter `kubesphere/examples-bookinfo-productpage-v1:1.13.0` in the search box to use the Docker Hub image.

   {{< notice note >}}

   You must press **Enter** in your keyboard after you enter the image name.

   {{</ notice >}} 

6. Click **Use Default Ports**. For more information about image settings, see [Pod Settings](../../../project-user-guide/application-workloads/container-image-settings/). Click **√** in the lower-right corner and **Next** to continue.

7. On the **Storage Settings** page, [add a volume](../../../project-user-guide/storage/volumes/) or click **Next** to continue.

8. Click **Create** on the **Advanced Settings** page.

9. Similarly, add the other three microservices for the app. Here is the image information:

   | Service   | Name      | Image                                            |
   | --------- | --------- | ------------------------------------------------ |
   | Stateless | `details` | `kubesphere/examples-bookinfo-details-v1:1.13.0` |
   | Stateless | `reviews` | `kubesphere/examples-bookinfo-reviews-v1:1.13.0` |
   | Stateless | `ratings` | `kubesphere/examples-bookinfo-ratings-v1:1.13.0` |

10. When you finish adding microservices, click **Next**.

11. On the **Route Settings** page, click **Add Routing Rule**. On the **Specify Domain** tab, set a domain name for your app (for example, `demo.bookinfo`) and select `HTTP` in the **Protocol** field. For `Paths`, select the Service `productpage` and port `9080`. Click **OK** to continue.

    {{< notice note >}}

The button **Add Routing Rule** is not visible if the project gateway is not set.

{{</ notice >}} 

12. You can add more rules or click **Create** to finish the process.

13. Wait for your app to reach the **Ready** status.


## Access the App

1. As you set a domain name for the app, you need to add an entry in the hosts (`/etc/hosts`) file. For example, add the IP address and hostname as below:

   ```txt
   192.168.0.9 demo.bookinfo
   ```

   {{< notice note >}}

   You must add your **own** IP address and hostname.

   {{</ notice >}} 

2. In **Composed Apps**, click the app you just created.

3. In **Resource Status**, click **Access Service** under **Routes** to access the app.

   {{< notice note >}}

   Make sure you open the port in your security group.

   {{</ notice >}}

4. Click **Normal user** and **Test user** respectively to see other **Services**.

