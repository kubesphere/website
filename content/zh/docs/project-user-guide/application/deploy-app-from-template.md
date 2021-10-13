---
title: "从应用模板部署应用"
keywords: 'Kubernetes, Chart, Helm, KubeSphere, 应用程序, 应用模板'
description: '了解如何使用基于 Helm 的模板部署应用程序。'
linkTitle: "从应用模板部署应用"

weight: 10120
---

部署应用时，您可选择使用应用商店。应用商店包含了 KubeSphere 的内置应用和[以 Helm Chart 形式上传的应用](../../../workspace-administration/upload-helm-based-application/)。此外，您还可以使用应用模板。应用模板可由添加至 KubeSphere 的私有应用仓库提供。

本教程演示如何使用私有应用仓库中的应用模板快速部署 [Grafana](https://grafana.com/)。该私有应用仓库基于 QingStor 对象存储。

## 准备工作

- 您需要启用 [OpenPitrix (App Store)](../../../pluggable-components/app-store/)。
- 您需要先完成[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)教程。您必须创建一个企业空间、一个项目和两个用户帐户（`ws-admin ` 和 `project-regular`）。`ws-admin` 必须被授予企业空间中的 `workspace-admin` 角色， `project-regular` 必须被授予项目中的 `operator` 角色。

## 动手实验

### 步骤 1：添加应用仓库

1. 以 `ws-admin` 用户登录 KubeSphere Web 控制台。在您的企业空间中，进入**应用管理**下的**应用仓库**页面，并点击**添加仓库**。

   ![add-app-repo](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/add-app-repo.png)

2. 在弹出的对话框中，将应用仓库名称设置为 `test-repo`，将应用仓库的 URL 设置为 `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/`，点击**验证**对 URL 进行验证，再点击**确定**。

   ![input-repo-info](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/input-repo-info.png)

3. 应用仓库导入成功后会显示在如下图所示的列表中。

   ![repository-list](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/repository-list.png)

   {{< notice note >}}

   有关添加私有仓库时的更多参数信息，请参见[导入 Helm 仓库](../../../workspace-administration/app-repository/import-helm-repository/)。

   {{</ notice >}} 

### 步骤 2：从应用模板部署应用

1. 登出 KubeSphere 并以 `project-regular` 用户重新登录。在您的项目中，进入**应用负载**下的**应用**页面，再点击**部署新应用**。

   ![create-new-app](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/create-new-app.png)

2. 在弹出的对话框中选择**来自应用模板**。

   ![select-app-templates](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/select-app-templates.png)

   **来自应用商店**：选择内置的应用和以 Helm Chart 形式单独上传的应用。

   **来自应用模板**：从私有应用仓库和企业空间应用池选择应用。

3. 从下拉列表中选择之前添加的私有应用仓库 `test-repo`。

   ![private-app-template](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/private-app-template.png)

   {{< notice note >}}

   下拉列表中的**来自企业空间**选项表示企业空间应用池，包含以 Helm Chart 形式上传的应用。这些应用也属于应用模板。

   {{</ notice >}} 

4. 在搜索框中输入 `grafana` 找到该应用，点击搜索结果进行部署。

   ![search-grafana](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/search-grafana.png)

   {{< notice note >}} 

   本教程使用的应用仓库与 Google Helm 仓库同步。由于其中的 Helm Chart 由不同的组织维护，部分应用可能无法部署成功。

   {{</ notice >}} 

5. 您可以查看应用信息和配置文件，在**版本**下拉列表中选择版本，然后点击**部署**。

   ![deploy-grafana](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/deploy-grafana.png)

6. 设置应用名称，确认应用版本和部署位置，点击**下一步**。

   ![confirm-info](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/confirm-info.png)

7. 在**应用配置**页面，您可以手动编辑清单文件或直接点击**部署**。

   ![app-config](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/app-config.png)

8. 等待 Grafana 创建完成并开始运行。

### 步骤 3：暴露 Grafana 服务

要从集群外访问 Grafana，您需要先用 NodePort 暴露该应用。

1. 打开**服务**页面，点击 Grafana 的服务名称。

   ![grafana-services](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/grafana-services.png)

2. 点击**更多操作**，在下拉菜单中选择**编辑外网访问**。

   ![edit-access](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/edit-access.png)

3. 将**访问方式**设置为 **NodePort** 并点击**确定**。有关更多信息，请参见[项目网关](../../../project-administration/project-gateway/)。

   ![nodeport](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/nodeport.png)

4. 您可以在**服务端口**区域查看暴露的端口。

   ![exposed-port](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/exposed-port.png)

### 步骤 4：访问 Grafana

1. 您需要获取用户名和密码才能登录 Grafana 主页。前往**密钥**页面，点击与应用名称相同的条目。

   ![grafana-secret](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/grafana-secret.png)

2. 在详情页面，点击眼睛图标查看用户名和密码。

   ![secret-page](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/secret-page.png)

   ![click-eye-icon](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/click-eye-icon.png)

2. 用 `<Node IP>:<NodePort>` 地址访问 Grafana。

   ![grafana-UI](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/grafana-UI.png)

   ![home-page](/images/docs/zh-cn/project-user-guide/applications/deploy-apps-from-app-templates/home-page.png)

   {{< notice note >}}

   取决于您的 Kubernetes 集群的部署位置，您可能需要在安全组中放行端口并配置相关的端口转发规则。

   {{</ notice >}} 