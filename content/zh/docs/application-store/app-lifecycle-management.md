---
title: "应用程序生命周期管理"
keywords: 'Kubernetes, KubeSphere, 应用商店'
description: '您可以跨整个生命周期管理应用，包括提交、审核、测试、发布、升级和下架。'
linkTitle: '应用程序生命周期管理'
weight: 14100
---

KubeSphere 集成了 [OpenPitrix](https://github.com/openpitrix/openpitrix)（一个跨云管理应用程序的开源平台）来构建应用商店，管理应用程序的整个生命周期。应用商店支持两种应用程序部署方式：

- **应用模板**：这种方式让开发者和独立软件供应商 (ISV) 能够与企业空间中的用户共享应用程序。您也可以在企业空间中导入第三方应用仓库。
- **自制应用**：这种方式帮助用户使用多个微服务来快速构建一个完整的应用程序。KubeSphere 让用户可以选择现有服务或者创建新的服务，用于在一站式控制台上创建自制应用。

![应用商店](/images/docs/zh-cn/appstore/application-lifecycle-management/app-store.png)

本教程使用 [Redis](https://redis.io/) 作为示例应用程序，演示如何进行应用全生命周期管理，包括提交、审核、测试、发布、升级和下架。

## 视频演示

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-community.pek3b.qingstor.com/videos/KubeSphere-v3.1.x-tutorial-videos/zh/KS311_200P007C202109_%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E7%AE%A1%E7%90%86.mp4">
</video>

## 准备工作

- 您需要启用 [KubeSphere 应用商店 (OpenPitrix)](../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目以及一个帐户 (`project-regular`)。有关更多信息，请参见[创建企业空间、项目、帐户和角色](../../quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤一：创建自定义角色和帐户

首先，您需要创建两个帐户，一个是 ISV 的帐户 (`isv`)，另一个是应用技术审核员的帐户 (`reviewer`)。

1. 使用 `admin` 帐户登录 KubeSphere 控制台。点击左上角的**平台管理**，选择**访问控制**。转到**帐户角色**，点击**创建**。

   ![创建角色](/images/docs/zh-cn/appstore/application-lifecycle-management/create-role-2.PNG)

2. 为角色设置一个名称，例如 `app-review`，然后点击**编辑权限**。

   ![设置名称](/images/docs/zh-cn/appstore/application-lifecycle-management/app-review-name-3.PNG)

3. 转到**应用管理**，选择权限列表中的**应用商店管理**和**应用商店查看**，然后点击**确定**。

   ![创建角色](/images/docs/zh-cn/appstore/application-lifecycle-management/create-roles-4.PNG)

   {{< notice note >}}

   被授予 `app-review` 角色的帐户能够查看平台上的应用商店并管理应用，包括审核和下架应用。

   {{</ notice >}} 

4. 创建角色后，您需要创建一个帐户，并授予 `app-review` 角色。转到**帐户管理**，点击**创建**。输入必需的信息，然后点击**确定**。

   ![创建审核帐户](/images/docs/zh-cn/appstore/application-lifecycle-management/create-review-role-5.PNG)

5. 再创建另一个帐户 `isv`，把 `platform-regular` 角色授予它。

   ![帐户已创建](/images/docs/zh-cn/appstore/application-lifecycle-management/account-ready-6.PNG)

6. 邀请上面创建好的两个帐户进入现有的企业空间，例如 `demo-workspace`，并授予它们 `workspace-admin` 角色。

### 步骤二：上传和提交应用程序

1. 以 `isv` 身份登录控制台，转到您的企业空间。您需要上传示例应用 Redis 至该企业空间，供后续使用。首先，下载应用 [Redis 11.3.4](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-11.3.4.tgz)，然后转到**应用模板**，点击**上传模板**。

   ![上传应用](/images/docs/zh-cn/appstore/application-lifecycle-management/upload-app-7.PNG)

   {{< notice note >}}

   在本示例中，稍后会上传新版本的 Redis 来演示升级功能。

   {{</ notice >}} 

2. 在弹出的对话框中，点击**上传 Helm 配置文件**上传 Chart 文件。点击**确定**继续。

   ![上传模板](/images/docs/zh-cn/appstore/application-lifecycle-management/upload-template-8.PNG)

3. **应用信息**下显示了应用的基本信息。要上传应用的图标，点击**上传图标**。您也可以跳过上传图标，直接点击**确定**。

   {{< notice note >}}

   应用图标支持的最大分辨率为 96 × 96 像素。

   {{</ notice >}} 

   ![上传图标](/images/docs/zh-cn/appstore/application-lifecycle-management/upload-icon-9.PNG)

4. 成功上传后，模板列表中会列出应用，状态为**开发中**，意味着该应用正在开发中。上传的应用对同一企业空间下的所有成员均可见。

   ![应用开发中](/images/docs/zh-cn/appstore/application-lifecycle-management/app-draft-10.PNG)

5. 点击列表中的 Redis 进入应用模板详情页面。您可以点击**编辑信息**来编辑该应用的基本信息。

   ![编辑应用模板](/images/docs/zh-cn/appstore/application-lifecycle-management/edit-app-template-11.PNG)

6. 您可以通过在弹出窗口中指定字段来自定义应用的基本信息。

   ![编辑应用信息](/images/docs/zh-cn/appstore/application-lifecycle-management/edit-app-information-12.PNG)

7. 点击**确定**保存更改，然后您可以通过将其部署到 Kubernetes 来测试该应用程序。点击待提交版本展开菜单，选择**测试部署**。

   ![测试部署](/images/docs/zh-cn/appstore/application-lifecycle-management/test-deployment-13.PNG)

   {{< notice note >}} 

   如果您不想测试应用，可以直接提交审核。但是，建议您先测试应用部署和功能，再提交审核，尤其是在生产环境中。这会帮助您提前发现问题，加快审核过程。

   {{</ notice >}} 

8. 选择要部署应用的集群和项目，为应用设置不同的配置，然后点击**部署**。

   ![部署位置](/images/docs/zh-cn/appstore/application-lifecycle-management/deployment-place-14.PNG)

   ![部署应用](/images/docs/zh-cn/appstore/application-lifecycle-management/deploying-app-15.PNG)

   {{< notice note >}}

   有些应用可以在表单中设置所有配置后进行部署。您可以使用拨动开关查看它的 YAML 文件，文件中包含了需要在表单中指定的所有参数。

   {{</ notice >}} 

9. 稍等几分钟，切换到**部署实例**选项卡。您会看到 Redis 已经部署成功。

   ![部署实例成功](/images/docs/zh-cn/appstore/application-lifecycle-management/deployed-instance-success-16.PNG)

10. 测试应用并且没有发现问题后，便可以点击**提交审核**，提交该应用程序进行审核。

    ![提交审核](/images/docs/zh-cn/appstore/application-lifecycle-management/submit-for-review-17.PNG)

    {{< notice note >}}

版本号必须以数字开头并包含小数点。

{{</ notice >}}

11. 应用提交后，它的状态会变成**等待审核**。现在，应用审核员便可以进行审核。

    ![应用已提交](/images/docs/zh-cn/appstore/application-lifecycle-management/submitted-app-18.PNG)

### 步骤三：审核应用程序

1. 登出控制台，然后以 `reviewer` 身份重新登录 KubeSphere。点击左上角的**平台管理**，选择**应用商店管理**。在**应用审核**页面，上一步中提交的应用会显示在**待处理**选项卡下。

   ![应用待审核](/images/docs/zh-cn/appstore/application-lifecycle-management/app-to-be-reviewed-19.PNG)

2. 点击该应用进行审核，在弹出窗口中查看应用信息、介绍、配置文件和更新日志。

   ![审核中](/images/docs/zh-cn/appstore/application-lifecycle-management/reviewing-20.PNG)

3. 审核员的职责是决定该应用是否符合发布至应用商店的标准。点击**通过**来批准，或者点击**拒绝**来拒绝提交的应用。

### 步骤四：发布应用程序至应用商店

应用获批后，`isv` 便可以将 Redis 应用程序发布至应用商店，让平台上的所有用户都能找到并部署该应用程序。

1. 登出控制台，然后以 `isv` 身份重新登录 KubeSphere。转到您的企业空间，点击**应用模板**页面上的 Redis。在详情页面上展开版本菜单，然后点击**发布到商店**。在弹出的提示框中，点击**确定**以确认操作。

   ![应用模板页面](/images/docs/zh-cn/appstore/application-lifecycle-management/app-templates-page-21.PNG)

2. 在**应用审核**下，您可以查看应用状态。**已上架**意味着它在应用商店中可用。

   ![应用已上架](/images/docs/zh-cn/appstore/application-lifecycle-management/app-active-22.PNG)

3. 点击**在商店查看**转到应用商店的**应用信息**页面，或者点击左上角的**应用商店**也可以查看该应用。

   ![redis](/images/docs/zh-cn/appstore/application-lifecycle-management/redis-23.PNG)

   {{< notice note >}}

   您可能会在应用商店看到两个 Redis 应用，其中一个是 KubeSphere 中的内置应用。请注意，新发布的应用会显示在应用商店列表的开头。

   {{</ notice >}} 

4. 现在，企业空间中的用户可以从应用商店中部署 Redis。要将应用部署至 Kubernetes，请点击应用转到**应用信息**页面，然后点击**部署**。

   ![部署 redis](/images/docs/zh-cn/appstore/application-lifecycle-management/deploy-redis-24.PNG)
   
   {{< notice note >}}
   
   如果您在部署应用时遇到问题，**状态**栏显示为**失败**，您可以将光标移至**失败**图标上方查看错误信息。
   
   {{</ notice >}}

### 步骤五：创建应用分类

`reviewer` 可以根据不同类型应用程序的功能和用途创建多个分类。这类似于设置标签，可以在应用商店中将分类用作筛选器，例如大数据、中间件和物联网等。

1. 以 `reviewer` 身份登录 KubeSphere。要创建分类，请转到**应用商店管理**页面，再点击**应用分类**页面中的 <img src="/images/docs/zh-cn/appstore/application-lifecycle-management/plus.png" height="20px">。

   ![应用分类](/images/docs/zh-cn/appstore/application-lifecycle-management/app-category-25.PNG)

2. 在弹出的对话框中设置分类名称和图标，然后点击**确定**。对于 Redis，您可以将**分类名称**设置为 `Database`。

   ![设置应用分类](/images/docs/zh-cn/appstore/application-lifecycle-management/set-app-type-26.PNG)

   {{< notice note >}}

   通常，应用审核员会提前创建必要的分类，ISV 会选择应用所属的分类，然后提交审核。新创建的分类中没有应用。

   {{</ notice >}} 

3. 创建好分类后，您可以给您的应用分配分类。在**未分类**中选择 Redis，点击**调整分类**。

   ![设置分类](/images/docs/zh-cn/appstore/application-lifecycle-management/set-category-for-app-27.PNG)

4. 在弹出对话框的下拉列表中选择分类 (**Database**) 然后点击**确定**。

   ![确认分类](/images/docs/zh-cn/appstore/application-lifecycle-management/confirm-category-28.PNG)

5. 该应用便会显示在对应分类中。

   ![分类显示](/images/docs/zh-cn/appstore/application-lifecycle-management/app-in-category-list-expected-29.PNG)

### 步骤六：添加新版本

要让企业空间用户能够更新应用，您需要先向 KubeSphere 添加新的应用版本。按照下列步骤为示例应用添加新版本。

1. 再次以 `isv` 身份登录 KubeSphere，搜寻到**应用模板**，点击列表中的 Redis 应用。

2. 下载 [Redis 12.0.0](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/redis-12.0.0.tgz)，这是 Redis 的一个新版本，本教程用它来演示。在**版本**选项卡中点击右侧的**添加版本**，上传您刚刚下载的文件包。

   ![新版本](/images/docs/zh-cn/appstore/application-lifecycle-management/new-version-redis-30.PNG)

3. 点击**上传 Helm 配置文件**，上传完成后点击**确定**。

   ![上传 redis 新版本](/images/docs/zh-cn/appstore/application-lifecycle-management/upload-new-redis-version-31.PNG)

4. 新的应用版本会显示在版本列表中。您可以通过点击来展开菜单并测试新的版本。另外，您也可以提交审核并发布至应用商店，操作步骤和上面说明的一样。

   ![上传新版本](/images/docs/zh-cn/appstore/application-lifecycle-management/uploaded-new-version-32.PNG)

   ![查看新版本](/images/docs/zh-cn/appstore/application-lifecycle-management/see-new-version-33.PNG)

### 步骤七：升级

新版本发布至应用商店后，所有用户都可以升级该应用程序至新版本。

{{< notice note >}}

要完成下列步骤，您必须先部署应用的一个旧版本。本示例中，Redis 11.3.4 已经部署至项目 `demo-project`，它的新版本 12.0.0 也已经发布至应用商店。

{{</ notice >}} 

1. 以 `project-regular` 身份登录 KubeSphere，搜寻到项目的**应用**页面，点击要升级的应用。

   ![待升级应用](/images/docs/zh-cn/appstore/application-lifecycle-management/app-to-be-upgraded-34.PNG)

2. 点击**更多操作**，在下拉菜单中选择**编辑模板**。

   ![编辑模板](/images/docs/zh-cn/appstore/application-lifecycle-management/edit-template-35.PNG)

3. 在弹出窗口中，您可以查看应用配置 YAML 文件。在右侧的下拉列表中选择新版本，您可以自定义新版本的 YAML 文件。在本教程中，点击**更新**，直接使用默认配置。

   ![升级应用](/images/docs/zh-cn/appstore/application-lifecycle-management/upgrade-an-app-36.PNG)

   {{< notice note >}}

   您可以在右侧的下拉列表中选择与左侧相同的版本，通过 YAML 文件自定义当前应用的配置。

   {{</ notice >}}

4. 在**应用**页面，您会看到应用正在升级中。升级完成后，应用状态会变成**运行中**。

   ![版本升级](/images/docs/zh-cn/appstore/application-lifecycle-management/version-upgraded-37.PNG)

   ![升级完成](/images/docs/zh-cn/appstore/application-lifecycle-management/upgrade-finish-38.PNG)

### 步骤八：下架应用程序

您可以选择将应用完全从应用商店下架，或者下架某个特定版本。

1. 以 `reviewer` 身份登录 KubeSphere。点击左上角的**平台管理**，选择**应用商店管理**。在**应用商店**页面，点击 Redis。

   ![下架应用](/images/docs/zh-cn/appstore/application-lifecycle-management/remove-app-39.PNG)

2. 在详情页面，点击**下架应用**，在弹出的对话框中选择**确定**，确认将应用从应用商店下架的操作。

   ![应用下架](/images/docs/zh-cn/appstore/application-lifecycle-management/suspend-app-40.PNG)

   {{< notice note >}}

   将应用从应用商店下架不影响正在使用该应用的租户。

   {{</ notice >}} 

3. 要让应用再次在应用商店可用，点击**上架应用**。

   ![上架应用](/images/docs/zh-cn/appstore/application-lifecycle-management/activate-app-41.PNG)

4. 要下架应用的特定版本，展开版本菜单，点击**下架版本**。在弹出的对话框中，点击**确定**以确认操作。

   ![下架版本](/images/docs/zh-cn/appstore/application-lifecycle-management/suspend-version-42.PNG)

   {{< notice note >}}

   下架应用版本后，该版本在应用商店将不可用。下架应用版本不影响正在使用该版本的租户。

   {{</ notice >}}

5. 要让应用版本再次在应用商店可用，点击**上架版本**。

   ![上架版本](/images/docs/zh-cn/appstore/application-lifecycle-management/activate-version-43.PNG)

   

   

   

   

