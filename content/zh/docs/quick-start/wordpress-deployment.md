---
title: "创建 Wordpress 应用并发布至 Kubernetes"
keywords: 'KubeSphere, Kubernetes, app, Wordpress'
description: '创建 Wordpress 应用并发布至 Kubernetes。'

linkTitle: "Compose and Deploy Wordpress"
weight: 3050
---

## WordPress 简介

WordPress 是使用 PHP 语言开发的内容管理系统软件，用户可以在支持 PHP 和 MySQL 数据库的服务器上使用自己的博客，一个完整的 Wordpress 应用程序包括以下 Kubernetes 对象。

![WordPress](/images/docs/quickstart/WordPress-1.png)

## 目的

本教程演示如何在 KubeSphere 中创建应用程序（以 WordPress 为例）并在集群外访问它。

## 准备工作

需要一个 `project regular` 帐户，并在其中一个项目中分配角色 `operator`（该用户已被邀请参加该项目）。有关详细信息，请参见[创建企业空间、项目、帐户和角色](../create-workspace-and-project/).

## 预计操作时间

大约15分钟。

## 动手操作

### 任务 1: 创建密钥

#### 创建 MySQL 密钥

环境变量 `WORDPRESS_DB_PASSWORD` 是连接到 WORDPRESS 数据库的密码。在这一步中，您需要创建一个 ConfigMap 来存储将在 MySQL pod 模板中使用的环境变量。

1. 使用`project regular`帐户登录 KubeSphere 控制台。转到`demo project`的详细页面并导航到 **配置**。在 **密钥** 中，单击右侧的 **创建**。

![create-secret](/images/docs/quickstart/create-secret.png)

2. 输入基本信息 (例如，将其命名为 `mysql-secret`) ，然后单击 **下一步**。在下一页中, 选择 **类型** 为 **默认** ，然后单击 **添加数据** 来添加一个键值对。 输入键（Key） `MYSQL_ROOT_PASSWORD` 和值（Value） `123456` 单击右下角 `√` 的确认按钮, 完成后，单击 **创建** 按钮并继续.

![key-value](/images/docs/quickstart/key-value.png)

#### 创建 WordPress 密钥

按照上面创建 MySQL 密钥相同的步骤创建一个名字为 `wordpress-secret` 的密钥， 输入键（Key） `WORDPRESS_DB_PASSWORD` 和值（Value） `123456`，创建的密钥显示在列表中，如下所示：

![wordpress-secrets](/images/docs/quickstart/wordpress-secrets.png)

### 任务 2: 创建存储卷

1. 点击 **存储管理** 下面的 **存储卷** 并单击 **创建**。

![create-volume](/images/docs/quickstart/create-volume.png)

2. 输入卷的基本信息 (例如，将其命名为 `wordpress-pvc`) ，然后单击 **下一步**。
3. 在 **存储卷设置**, 您需要选择一个可用的 **存储类型**, 并设置 **访问模式** 和 **存储卷容量**。您可以直接使用默认值，如下所示。单击 **下一步** 继续。

![volume-settings](/images/docs/quickstart/volume-settings.png)

4. 对于 **高级设置**，您不需要为当前操作设置额外的配置，单击 **创建** 即可完成。

### 任务 3: 创建应用程序

#### 添加 MySQL 后端组件

1. 导航到 **应用负载** 下的 **应用**, 选择 **自制应用** 然后单击 **构建自制应用**。

![add-mysql-backend-component](/images/docs/quickstart/add-mysql-backend-component.png)

2. 输入基本信息 (例如在应用程序名称中输入 `wordpress`) 然后单击 **下一步**。

![basic-info](/images/docs/quickstart/basic-info.png)

3. 在 **服务组件** 中, 单击 **添加服务** 在应用程序中设置组件。

![add-service](/images/docs/quickstart/add-service.png)

4. 设置组件的服务类型， 选择 **服务类型** 。
5. 输入有状态服务的名称 (例如 **mysql**) ，然后单击 **下一步**。

![mysql-name](/images/docs/quickstart/mysql-name.png)

6. 在 **容器镜像** 中, 单击 **添加容器镜像**。

![container-image](/images/docs/quickstart/container-image.png)

7. 在镜像搜索框中输入 `mysql:5.6` , 单击 **回车键** 然后单击 **使用默认端口**。 配置还没有设置完成，请您不要点击右下角的 `√` 按钮。

![container-image-mysql](/images/docs/quickstart/container-image-mysql.png)

{{< notice note >}}

在 **高级设置** 中, 请确保内存限制不小于 1000 Mi，否则 MySQL 可能因内存不足而无法启动。

{{</ notice >}} 

8. 向下滚动到 **环境变量** 然后单击 **引用配置文件或密匙**。 输入名称 `MYSQL_ROOT_PASSWORD` 然后选择资源 `mysql-secret` 和前面步骤中创建的密钥 `MYSQL_ROOT_PASSWORD` 完成后单击 `√` 保存配置 ，最后单击 **下一步** 继续。

![environment-var](/images/docs/quickstart/environment-var.png)

9. 选择 **挂载存储** 中的 **添加存储卷**。 输入 **存储卷名称** (`mysql`) 和 **存储类型** (类型: `读写`, 路径: `/var/lib/mysql`)的值，如下所示：

![volume-template](/images/docs/quickstart/volume-template.png)

完成后单击 `√` 保存设置并单击 **下一步** 继续。

10. 在 **高级设置** 中, 不需要设置，您可以直接点击 **添加** ，也可以根据需要选择其他选项。

![advanced-setting](/images/docs/quickstart/advanced-setting.png)

11. 现在，您添加了MySQL组件，如下所示：

![mysql-done](/images/docs/quickstart/mysql-done.png)

#### 添加 WordPress 前端组件

12. 点击 **添加服务** 选择 **无状态服务** 输入名称 `wordpress` 然后单击 **下一步**。

![add-wordPress-frontend-component](/images/docs/quickstart/add-wordPress-frontend-component.png)

13. 与上述步骤类似，单击 **添加容器镜像**, 在搜索框中输入 `wordpress:4.8-apache` 镜像, 按 **回车** ，然后单击 **使用默认端口**。

![container-image-wordpress](/images/docs/quickstart/container-image-wordpress.png)

14. 向下滚动到 **环境变量** 然后单击 **引用配置文件或密匙**，这里需要添加两个环境变量。根据下面的屏幕截图输入值。

- 对于 `WORDPRESS_DB_PASSWORD`, 请选择在任务 1 中创建的 `wordpress-secret` 和 `WORDPRESS_DB_PASSWORD`。
- 单击 **添加环境变量**, 输入 `WORDPRESS_DB_HOST` 和 `mysql` 作为作为键（Key）和值（Value）。
{{< notice warning >}}

对于此处添加的第二个环境变量，该值必须与步骤 5 中为 MySQL 设置的名称完全相同。否则，Wordpress 将无法连接到 MySQL 对应的数据库。

{{</ notice >}}

![environment-varss](/images/docs/quickstart/environment-varss.png)

单击 `√` 保存配置，单击 **下一步** 继续。

15. 在 **挂载存储** 设置中, 单击 **添加存储卷** 然后单击 **选择已有存储卷**。

![volume-template-wordpress](/images/docs/quickstart/volume-template-wordpress.png)



![choose-existing](/images/docs/quickstart/choose-existing.png)

16. 选择上一步创建的 `wordpress-pvc`， 将模式设置为 `读写`，并输入装载路径 `/var/www/html` 。 单击 `√` 保存并单击 **下一步** 继续。

![choose-existing-volume](/images/docs/quickstart/choose-existing-volume.png)

17. 在 **高级设置** 中, 您可以直接点击 **添加** 创建服务，也可以根据需要选择其他选项。

![advanced-settings-wordpress](/images/docs/quickstart/advanced-settings-wordpress.png)

18. 现在也设置了前端组件。单击 **下一步** 继续。

![two-components-done](/images/docs/quickstart/two-components-done.png)

19. 您可以在这里设置路由规则（入口），也可以直接单击 **创建** 来创建应用程序。

![ingress](/images/docs/quickstart/ingress.png)

20. 创建后，应用程序将显示在下面的列表中。

![create](/images/docs/quickstart/create.png)

### Task 4: 验证资源

在 **工作负载** 中，分别检查 **部署** 和 **有状态副本集** 中的 `wordpress-v1` 和 `mysql-v1` 的状态。 如果他们运行如下图所示，这意味着 WordPress 已经成功创建。

![wordpress-deployment](/images/docs/quickstart/wordpress-deployment.png)

![wordpress-statefulset](/images/docs/quickstart/wordpress-statefulset.png)

### Task 5: 通过 NodePort 访问 WordPress

1. 要访问集群外的服务，请首先导航到 **服务** 。 单击 `wordpress` 右侧的三个点后选择 **编辑外网访问**。

![edit-internet-access](/images/docs/quickstart/edit-internet-access.png)

2. 在 **访问方式** 中选择 `NodePort`， 然后单击 **确定**。

![access-method](/images/docs/quickstart/access-method.png)

3. 单击服务，您可以看到暴露的端口。

![nodeport-number](/images/docs/quickstart/nodeport-number.png)

4. 通过 `{Node IP}:{NodePort}` 访问此应用程序，您可以看到下图：

![wordpress](/images/docs/quickstart/wordpress.png)

{{< notice note >}}

在访问服务之前，请确保安全组中的端口已打开。

{{</ notice >}} 