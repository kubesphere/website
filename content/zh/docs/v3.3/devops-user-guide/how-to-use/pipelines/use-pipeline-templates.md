---
title: "使用流水线模板"
keywords: 'KubeSphere, Kubernetes, Jenkins, 图形化流水线, 流水线模板'
description: '了解如何在 KubeSphere 上使用流水线模板。'
linkTitle: "使用流水线模板"
weight: 11213
---

KubeSphere 提供图形编辑面板，您可以通过交互式操作定义 Jenkins 流水线的阶段和步骤。KubeSphere 3.3 中提供了内置流水线模板，如 Node.js、Maven 以及 Golang，使用户能够快速创建对应模板的流水线。同时，KubeSphere 3.3 还支持自定义流水线模板，以满足企业不同的需求。

本文档演示如何在 KubeSphere 上使用流水线模板。

## 准备工作

- 您需要有一个企业空间、一个 DevOps 项目和一个用户 (`project-regular`)，并已邀请此帐户至 DevOps 项目中且授予 `operator` 角色。如果尚未准备好，请参考[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

- 您需要启用 [KubeSphere DevOps 系统](../../../../pluggable-components/devops/)。

- 您需要[创建流水线](../../../how-to-use/pipelines/create-a-pipeline-using-graphical-editing-panel/)。

## 使用内置流水线模板

下面以 Node.js 为例演示如何使用内置流水线模板。如果需要使用 Maven 以及 Golang 流水线模板，可参考该部分内容。

1. 以 `project-regular` 用户登录 KubeSphere 控制台，在左侧导航树，点击 **DevOps 项目**。

2. 在右侧的 **DevOps 项目**页面，点击您创建的 DevOps 项目。

3. 在左侧的导航树，点击**流水线**。

4. 在右侧的**流水线**页面，点击已创建的流水线。

5. 在右侧的**任务状态**页签，点击**编辑流水线**。


6. 在**创建流水线**对话框，点击 **Node.js**，然后点击**下一步**。

7. 在**参数设置**页签，按照实际情况设置以下参数，点击**创建**。
   
   | 参数  | 参数解释 |
   | ----------- | ------------------------- |
   | GitURL     | 需要克隆的项目仓库的地址。                  |
   | GitRevision | 需要检出的分支。                  |
   | NodeDockerImage  | Node.js 的 Docker 镜像版本。  |
   | InstallScript     | 安装依赖项的 Shell 脚本。  |
   | TestScript     | 项目测试的 Shell 脚本。  |
   | BuildScript     | 构建项目的 Sell 脚本。  |
   | ArtifactsPath     | 归档文件所在的路径。  |

8. 在左侧的可视化编辑页面，系统默认已添加一系列步骤，您可以添加步骤或并行阶段.

9. 点击指定步骤，在页面右侧，您可以执行以下操作：
   - 修改阶段名称。
   - 删除阶段。
   - 设置代理类型。
   - 添加条件。
   - 编辑或删除某一任务。
   - 添加步骤或嵌套步骤。

   {{< notice note >}}

   您还可以按需在流水线模板中自定义步骤和阶段。有关如何使用图形编辑面板的更多信息，请参考[使用图形编辑面板创建流水线](../create-a-pipeline-using-graphical-editing-panel/)。

   {{</ notice >}}

10. 在右侧的**代理**区域，选择代理类型，默认值为 **kubernetes**，点击**确定**。

    | 代理类型  | 说明 |
    | ----------- | ------------------------- |
    | any     | 调用默认的 base pod 模板创建 Jenkins agent 运行流水线。                  |
    | node | 调用指定类型的 pod 模板创建 Jenkins agent 运行流水线，可配置的 label 标签为 base、java、nodejs、maven、go 等。                  |
    | kubernetes  | 通过 yaml 文件自定义标准的 kubernetes pod 模板运行 agent 执行流水线任务。  |

11. 在弹出的页面，您可以查看已创建的流水线模板详情，点击**运行**即可运行该流水线。

在之前的版本中，KubeSphere 还提供了 CI 以及 CI & CD 流水线模板，但是由于这两个模板难以满足定制化需求，因为建议您采用其它内置模板或直接自定义模板。下面分别介绍了这两个模板。

- CI 流水线模板

   ![ci-template](/images/docs/v3.3/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/ci-template.png)

   ![ci-stages](/images/docs/v3.3/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/ci-stages.png)

   CI 流水线模板包含两个阶段。**clone code** 阶段用于检出代码，**build & push** 阶段用于构建镜像并将镜像推送至 Docker Hub。您需要预先为代码仓库和 Docker Hub 仓库创建凭证，然后在相应的步骤中设置仓库的 URL 以及凭证。完成编辑后，流水线即可开始运行。

- CI & CD 流水线模板

   ![cicd-template](/images/docs/v3.3/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/cicd-template.png)

   ![cicd-stages](/images/docs/v3.3/zh-cn/devops-user-guide/use-devops/use-pipeline-templates/cicd-stages.png)

   CI & CD 流水线模板包含六个阶段。有关每个阶段的更多信息，请参考[使用 Jenkinsfile 创建流水线](../create-a-pipeline-using-jenkinsfile/#流水线概述)，您可以在该文档中找到相似的阶段及描述。您需要预先为代码仓库、Docker Hub 仓库和集群的 kubeconfig 创建凭证，然后在相应的步骤中设置仓库的 URL 以及凭证。完成编辑后，流水线即可开始运行。
