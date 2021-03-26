---
title: "将 MeterSphere 集成到流水线"
keywords: 'Kubernetes, Docker, DevOps, Jenkins, MeterSphere'
description: '如何将 MeterSphere 集成到流水线'
linkTitle: "将 MeterSphere 集成到流水线"
weight: 11330
---

本教程演示如何将 MeterSphere 集成到流水线。

## 准备工作

- 您需要启用 [KubeSphere DevOps 系统](../../../pluggable-components/devops/)。
- 您需要[在 KubeSphere 上部署 MeterSphere](../../../application-store/external-apps/deploy-metersphere/)。
- 您需要创建一个企业空间、一个 DevOps 工程和一个帐户 (`project-regular`)。需要邀请该帐户至 DevOps 工程并赋予 `operator` 角色。如果尚未创建，请参见[创建企业空间、项目、帐户和角色](http://localhost:1313/zh/docs/quick-start/create-workspace-and-project/)。

## 动手实验

### 步骤 1：在 MeterSphere 上创建 API Keys

1. 登录 MeterSphere 控制台。访问**个人信息**下的 **API Keys**，点击**新建**来创建 API Keys。

   ![create-api-keys](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/create-api-keys.png)

2. API Keys 创建好之后，您可以进行查看。复制 **Access Key**。

   ![api-key-created](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/api-key-created.png)

3. 点击 **Secret Key** 下的**显示**并复制 Secret Key。

   ![click-show](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-show.png)

   ![copy-secret-key](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/copy-secret-key.png)

### 步骤 2：在 Jenkins 上安装 MeterSphere 插件

1. 登录 Jenkins 控制台，点击 **Manage Jenkins**。有关如何登录 Jenkins 控制台的更多信息，请参考[将 SonarQube 集成到流水线](../sonarqube/#step-5-add-the-sonarqube-server-to-jenkins)。

   ![click-manage-jenkins](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-manage-jenkins.PNG)

2. 在 **Manage Jenkins** 页面，下滑至 **Manage Plugins** 并点击。

   ![click-manage-plugins](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-manage-plugins.PNG)

3. 访问**高级**选项卡，下滑至**上传插件**。点击**文件**旁边的按钮上传 [MeterSphere 插件的 HPI 文件](https://github.com/metersphere/jenkins-plugin/releases/download/v1.7.3/metersphere-jenkins-plugin-v1.7.3.hpi)。

   ![choose-file](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/choose-file.PNG)

4. 上传 HPI 文件之后，点击**上传**以继续。

   ![click-upload](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-upload.PNG)

5. 您可以在页面上看到安装状态，请确保选择**安装完成后重启 Jenkins（空闲时）**。安装成功后，Jenkins 会重启。

   ![installation-success](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/installation-success.PNG)

6. 待 Jenkins 完成重启，请登录并再次访问 **Manage Jenkins** 中的 **Manage Plugins**。在**已安装**选项卡，可以看到已安装 MeterSphere 插件。

   ![installed-tab](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/installed-tab.PNG)

   ![metersphere-in-list](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/metersphere-in-list.PNG)

### 步骤 3：生成流水线代码段

1. 点击**新建Item** 创建条目。

   ![click-new-item](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-new-item.PNG)

2. 将条目名称设为 `metersphere-test`，选择**流水线**。点击**确定**继续。

   ![set-item-info](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/set-item-info.PNG)

3. 在本教程中，直接点击**保存**使用默认设置。

   ![click-save](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-save.PNG)

4. 在 **Pipeline metersphere-test** 页面，点击**流水线语法**。

   ![click-pipeline-syntax](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-pipeline-syntax.PNG)

5. 在**步骤**下，选择**范例步骤**下拉菜单中的 **meterSphere: MeterSphere**。

   ![select-metersphere](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/select-metersphere.PNG)

6. 输入上述步骤中创建的 MeterSphere API Keys 以及 API Endpoint `http://NodeIP:NodePort`。您可以在下拉菜单中设置其他的值，然后点击**生成流水线脚本**。

   ![input-values](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/input-values.PNG)

   {{< notice note >}}

   本教程使用 MeterSphere 的 `demo-workspace` 工作空间和 `demo` 项目进行演示。您首先需要创建工作空间和项目，并在 MeterSphere 上配置测试用例，否则上图所示的下拉列表里将没有可选的条目。有关如何使用 MeterSphere 的更多信息，请参考 [MeterSphere GitHub 网站](https://github.com/metersphere/metersphere/blob/master/README-EN.md)。

   {{</ notice >}}

7. 您将看到以下输出：

   ![snippet-output](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/snippet-output.PNG)

### 步骤 4：创建流水线

1. 以 `project-regular` 身份登录 KubeSphere 的 Web 控制台。在 DevOps 工程中，访问**流水线**，然后点击**创建**。

   ![create-pipeline](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/create-pipeline.png)

2. 将**名称**设置为 `metersphere-pipeline`，点击**下一步**。在**高级设置**页面，点击**创建**使用默认配置。

   ![set-pipeline-name](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/set-pipeline-name.png)

   ![click-create-pipeline](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-create-pipeline.png)

3. 点击列表中的流水线访问其详情页，然后点击**编辑 Jenkinsfile**。

   ![click-pilepine-item](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/click-pilepine-item.png)

   ![edit-jenkinsfile](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/edit-jenkinsfile.png)

4. 在出现的对话框中，根据之前的步骤中 Jenkins 生成的代码段输入以下流水线代码，然后点击**确定**。

   ```
   node('base') {
       stage('stage-zewwa') {
         meterSphere method: 'single',
         msAccessKey: 'O4baJHYpybhPizFS',
         msEndpoint: 'http://103.61.37.135:31397/',
         msSecretKey: 'tIKidlPrpZFJgGl9',
         projectId: 'e72714e2-dfc5-4370-a9bc-f17e596caf66',
         result: 'jenkins',
         testCaseId: '2fc3210b-6c99-4633-9701-1a8941640018',
         testPlanId: '',
         workspaceId: 'f9dbbadb-0d0c-4d2e-bf6d-0e996d92899d'
        }
   }
   ```

   ![pipeline-script](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/pipeline-script.png)

   {{< notice note >}}

   请确保将以下字段的值更改为您在 Jenkins 控制台上生成的值： `msAccessKey`、`msSecretKey`、`msEndpoint`、`projectId`、`testCaseId` 和 `workspaceId`。

   {{</ notice >}}

5. 点击**运行**来运行流水线。

   ![run-pipeline](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/run-pipeline.png)

6. 稍等片刻，您可以在**活动**选项卡下看到流水线的状态变为**成功**。点击该流水线查看其详情。

   ![pipeline-success](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/pipeline-success.PNG)

7. 在详情页，您可以点击右上角的**显示日志**来查看日志。

   ![show-logs](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/show-logs.PNG)

   ![view-logs](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/view-logs.PNG)
   
8. 您可以在 MeterSphere 的控制台上查看测试报告，点击测试报告可查看其详情。

   ![test-report](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/test-report.PNG)

   ![test-report-detail](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-metersphere/test-report-detail.PNG)