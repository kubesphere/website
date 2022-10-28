---
title: "构建基于微服务的应用"
keywords: 'KubeSphere, Kubernetes, 服务网格, 微服务'
description: '了解如何从零开始构建基于微服务的应用程序。'
linkTitle: "构建基于微服务的应用"
weight: 10140
---

由于每个微服务都在处理应用的一部分功能，因此一个应用可以被划分为不同的组件。这些组件彼此独立，具有各自的职责和局限。在 KubeSphere 中，这类应用被称为**自制应用**，用户可以通过新创建的服务或者现有服务来构建自制应用。

本教程演示了如何创建基于微服务的应用 Bookinfo（包含四种服务），以及如何设置自定义域名以访问该应用。

## 准备工作

- 您需要为本教程创建一个企业空间、一个项目以及一个用户 (`project-regular`)。该用户需要被邀请至项目中并赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。
- `project-admin` 需要[设置项目网关](../../../project-administration/project-gateway/)，以便 `project-regular` 能在创建应用时定义域名。

## 构建自制应用的微服务

1. 登录 KubeSphere 的 Web 控制台，导航到项目**应用负载**中的**应用**。在**自制应用**选项卡中，点击**创建**。

2. 设置应用名称（例如 `bookinfo`）并点击**下一步**。

3. 在**服务设置**页面，您需要构建自制应用的微服务。点击**创建服务**，选择**无状态服务**。

4. 设置服务名称（例如 `productpage`）并点击**下一步**。

   {{< notice note >}}

   您可以直接在面板上创建服务，或者启用右上角的**编辑 YAML**以编辑 YAML 文件。

   {{</ notice >}} 

5. 点击**容器**下的**添加容器**，在搜索栏中输入 `kubesphere/examples-bookinfo-productpage-v1:1.13.0` 以使用 Docker Hub 镜像。

   {{< notice note >}}

   输入镜像名称之后，必须按下键盘上的**回车**键。

   {{</ notice >}} 

6. 点击**使用默认端口**。有关更多镜像设置的信息，请参见[容器组设置](../../../project-user-guide/application-workloads/container-image-settings/)。点击右下角的 **√** 和**下一步**以继续操作。

7. 在**存储设置**页面，[添加持久卷声明](../../../project-user-guide/storage/volumes/)或点击**下一步**以继续操作。

8. 在**高级设置**页面，直接点击**创建**。

9. 同样，为该应用添加其他三个微服务。以下是相应的镜像信息：

   | 服务       | 名称      | 镜像                                             |
   | ---------- | --------- | ------------------------------------------------ |
   | 无状态服务 | `details` | `kubesphere/examples-bookinfo-details-v1:1.13.0` |
   | 无状态服务 | `reviews` | `kubesphere/examples-bookinfo-reviews-v1:1.13.0` |
   | 无状态服务 | `ratings` | `kubesphere/examples-bookinfo-ratings-v1:1.13.0` |

10. 添加微服务完成后，点击**下一步**。

11. 在**路由设置**页面，点击**添加路由规则**。在**指定域名**选项卡中，为您的应用设置域名（例如 `demo.bookinfo`）并在**协议**字段选择 `HTTP`。在`路径`一栏，选择服务 `productpage` 以及端口 `9080`。点击**确定**以继续操作。

    {{< notice note >}}

若未设置项目网关，则无法看见**添加路由规则**按钮。

{{</ notice >}} 

12. 您可以添加更多规则或点击**创建**以完成创建过程。

13. 等待应用达到**就绪**状态。


## 访问应用

1. 在为应用设置域名时，您需要在 hosts (`/etc/hosts`) 文件中添加一个条目。 例如，添加如下所示的 IP 地址和主机名：

   ```txt
   192.168.0.9 demo.bookinfo
   ```

   {{< notice note >}}

   您必须添加**自己的** IP 地址和主机名。

   {{</ notice >}} 

2. 在**自制应用**中，点击刚才创建的应用。

3. 在**资源状态**中，点击**路由**下的**访问服务**以访问该应用。

   {{< notice note >}}

   请确保在您的安全组中打开端口。

   {{</ notice >}}

4. 分别点击 **Normal user** 和 **Test user** 以查看其他**服务**。

