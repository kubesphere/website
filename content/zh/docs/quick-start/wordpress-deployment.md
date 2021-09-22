---
title: "创建并部署 WordPress"
keywords: 'KubeSphere, Kubernetes, 应用, WordPress'
description: '了解在 KubeSphere 中部署示例应用程序的整个流程，包括创建凭证、创建存储卷、组件设置等。'
linkTitle: "创建并部署 WordPress"
weight: 2500
---

## WordPress 简介

WordPress（使用 PHP 语言编写）是免费、开源的内容管理系统，用户可以使用 WordPress 搭建自己的网站。完整的 WordPress 应用程序包括以下 Kubernetes 对象，由 MySQL 作为后端数据库。

![WordPress](/images/docs/zh-cn/quickstart/wordpress-deployment/WordPress.png)

## 目的

本教程演示了如何在 KubeSphere 中创建应用程序（以 WordPress 为例）并在集群外进行访问。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P006C202109_%E5%88%9B%E5%BB%BA%E5%B9%B6%E9%83%A8%E7%BD%B2%20WordPress.mp4">
</video>

## 准备工作

您需要准备一个 `project regular` 帐户，并在一个项目中赋予该帐户 `operator` 角色（该用户已被邀请参加该项目）。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../create-workspace-and-project/)。

## 预计操作时间

大约 15 分钟。

## 动手实验

### 步骤 1：创建密钥

#### 创建 MySQL 密钥

环境变量 `WORDPRESS_DB_PASSWORD` 是连接到 WordPress 数据库的密码。在此步骤中，您需要创建一个密钥来保存将在 MySQL Pod 模板中使用的环境变量。

1. 使用 `project-regular` 帐户登录 KubeSphere 控制台，访问 `demo-project` 的详情页并导航到**配置中心**。在**密钥**中，点击右侧的**创建**。

    ![create-secret1](/images/docs/zh-cn/quickstart/wordpress-deployment/create-secret1.png)

2. 输入基本信息（例如，将其命名为 `mysql-secret`）并点击**下一步**。在下一页中，选择**类型**为 **Opaque（默认）**，然后点击**添加数据**来添加键值对。输入如下所示的键 (Key) `MYSQL_ROOT_PASSWORD` 和值 (Value) `123456`，点击右下角 **√** 进行确认。完成后，点击**创建**按钮以继续。

    ![key-value](/images/docs/zh-cn/quickstart/wordpress-deployment/key-value.png)

#### 创建 WordPress 密钥

按照以上相同的步骤创建一个名为 `wordpress-secret` 的 WordPress 密钥，输入键 (Key) `WORDPRESS_DB_PASSWORD` 和值 (Value) `123456`。创建的密钥显示在列表中，如下所示：

![wordpress-secrets1](/images/docs/zh-cn/quickstart/wordpress-deployment/wordpress-secrets1.png)

### 步骤 2：创建存储卷

1. 访问**存储管理**下的**存储卷**，点击**创建**。

    ![volumes1](/images/docs/zh-cn/quickstart/wordpress-deployment/volumes1.png)

2. 输入卷的基本信息（例如，将其命名为 `wordpress-pvc`），然后点击**下一步**。

3. 在**存储卷设置**中，需要选择一个可用的**存储类型**，并设置**访问模式**和**存储卷容量**。您可以直接使用如下所示的默认值，点击**下一步**继续。

    ![volume-settings1](/images/docs/zh-cn/quickstart/wordpress-deployment/volume-settings1.png)

4. 对于**高级设置**，您无需为当前步骤添加额外的配置，点击**创建**完成即可。

### 步骤 3：创建应用程序

#### 添加 MySQL 后端组件

1. 导航到**应用负载**下的**应用**，选择**自制应用**，再点击**构建自制应用**。

    ![composing-app1](/images/docs/zh-cn/quickstart/wordpress-deployment/composing-app1.png)

2. 输入基本信息（例如，在应用名称一栏输入 `wordpress`），然后点击**下一步**。

    ![basic-info](/images/docs/zh-cn/quickstart/wordpress-deployment/basic-info.png)

3. 在**服务组件**中，点击**添加服务**以在应用中设置组件。

    ![add-service](/images/docs/zh-cn/quickstart/wordpress-deployment/add-service.png)

4. 设置组件的服务类型为**有状态服务**。

5. 输入有状态服务的名称（例如 **mysql**）并点击**下一步**。

    ![mysqlname](/images/docs/zh-cn/quickstart/wordpress-deployment/mysqlname.png)

6. 在**容器镜像**中，点击**添加容器镜像**。

    ![container-image](/images/docs/zh-cn/quickstart/wordpress-deployment/container-image.png)

7. 在搜索框中输入 `mysql:5.6`，按下**回车键**，然后点击**使用默认端口**。由于配置还未设置完成，请不要点击右下角的 **√** 按钮。

    ![add-container](/images/docs/zh-cn/quickstart/wordpress-deployment/add-container.png)

    {{< notice note >}}
在**高级设置**中，请确保内存限制不小于 1000 Mi，否则 MySQL 可能因内存不足而无法启动。
    {{</ notice >}}

8. 向下滚动到**环境变量**，点击**引用配置文件或密钥**。输入名称 `MYSQL_ROOT_PASSWORD`，然后选择资源 `mysql-secret` 和前面步骤中创建的密钥 `MYSQL_ROOT_PASSWORD`，完成后点击 **√** 保存配置，最后点击**下一步**继续。

    ![environment-var](/images/docs/zh-cn/quickstart/wordpress-deployment/environment-var.png)

9. 选择**挂载存储**中的**添加存储卷模板**，输入**存储卷名称** (`mysql`) 和**挂载路径**（模式：`读写`，路径：`/var/lib/mysql`）的值，如下所示：

    ![volume-template1](/images/docs/zh-cn/quickstart/wordpress-deployment/volume-template1.png)

    完成后，点击 **√** 保存设置并点击**下一步**继续。

10. 在**高级设置**中，可以直接点击**添加**，也可以按需选择其他选项。

    ![advanced-setting1](/images/docs/zh-cn/quickstart/wordpress-deployment/advanced-setting1.png)

11. 现在，MySQL 组件已经添加完成，如下所示：

    ![mysql-finished](/images/docs/zh-cn/quickstart/wordpress-deployment/mysql-finished.png)

#### 添加 WordPress 前端组件

12. 再次点击**添加服务**，这一次选择**无状态服务**。输入名称 `wordpress` 并点击**下一步**。

    ![name-wordpress](/images/docs/zh-cn/quickstart/wordpress-deployment/name-wordpress.png)

13. 与上述步骤类似，点击**添加容器镜像**，在搜索栏中输入 `wordpress:4.8-apache` 并按下**回车键**，然后点击**使用默认端口**。

    ![container-image-page](/images/docs/zh-cn/quickstart/wordpress-deployment/container-image-page.png)

14. 向下滚动到**环境变量**，点击**引用配置文件或密钥**。这里需要添加两个环境变量，请根据以下截图输入值：

    - 对于 `WORDPRESS_DB_PASSWORD`，请选择在步骤 1 中创建的 `wordpress-secret` 和 `WORDPRESS_DB_PASSWORD`。
    - 点击**添加环境变量**，分别输入 `WORDPRESS_DB_HOST` 和 `mysql` 作为键 (Key) 和值 (Value)。

    {{< notice warning >}}
对于此处添加的第二个环境变量，该值必须与步骤 5 中创建 MySQL 有状态服务设置的名称完全相同。否则，WordPress 将无法连接到 MySQL 对应的数据库。
    {{</ notice >}}

    ![environment-varss](/images/docs/zh-cn/quickstart/wordpress-deployment/environment-varss.png)

    点击 **√** 保存配置，再点击**下一步**继续。

15. 在**挂载存储**中，点击**添加存储卷**，并**选择已有存储卷**。

    ![add-volume-page](/images/docs/zh-cn/quickstart/wordpress-deployment/add-volume-page.png)

    ![choose-existing-volume](/images/docs/zh-cn/quickstart/wordpress-deployment/choose-existing-volume.png)

16. 选择上一步创建的 `wordpress-pvc`，将模式设置为`读写`，并输入挂载路径 `/var/www/html`。点击 **√** 保存，再点击**下一步**继续。

    ![mount-volume-page](/images/docs/zh-cn/quickstart/wordpress-deployment/mount-volume-page.png)

17. 在**高级设置**中，可以直接点击**添加**创建服务，也可以按需选择其他选项。

    ![advanced1](/images/docs/zh-cn/quickstart/wordpress-deployment/advanced1.png)

18. 现在，前端组件也已设置完成。点击**下一步**继续。

    ![components-finished](/images/docs/zh-cn/quickstart/wordpress-deployment/components-finished.png)

19. 您可以在这里设置路由规则（应用路由 Ingress），也可以直接点击**创建**。

    ![ingress-create](/images/docs/zh-cn/quickstart/wordpress-deployment/ingress-create.png)

20. 创建后，应用将显示在下面的列表中。

    ![application-created1](/images/docs/zh-cn/quickstart/wordpress-deployment/application-created1.png)

### 步骤 4：验证资源

在**工作负载**中，分别检查**部署**和**有状态副本集**中 `wordpress-v1` 和 `mysql-v1` 的状态。如果它们的运行状态如下图所示，就意味着 WordPress 已经成功创建。

![wordpress-deployment1](/images/docs/zh-cn/quickstart/wordpress-deployment/wordpress-deployment1.png)

![mysql-running1](/images/docs/zh-cn/quickstart/wordpress-deployment/mysql-running1.png)

### 步骤 5：通过 NodePort 访问 WordPress

1. 若要在集群外访问服务，请首先导航到**服务**。点击 `wordpress` 右侧的三个点后，选择**编辑外网访问**。

    ![edit-internet-access1](/images/docs/zh-cn/quickstart/wordpress-deployment/edit-internet-access1.png)

2. 在**访问方式**中选择 `NodePort`，然后点击**确定**。

    ![access-method](/images/docs/zh-cn/quickstart/wordpress-deployment/access-method.png)

3. 点击服务进入详情页，可以看到暴露的端口。

    ![nodeport-number1](/images/docs/zh-cn/quickstart/wordpress-deployment/nodeport-number1.png)

4. 通过 `{Node IP}:{NodePort}` 访问此应用程序，可以看到下图：

    ![wordpress-page](/images/docs/zh-cn/quickstart/wordpress-deployment/wordpress-page.png)

    {{< notice note >}}
    在访问服务之前，请确保安全组中的端口已打开。
    {{</ notice >}}
