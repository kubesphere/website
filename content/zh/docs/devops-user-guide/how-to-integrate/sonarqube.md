---
title: "将 SonarQube 集成到流水线"
keywords: 'Kubernetes, KubeSphere, devops, jenkins, sonarqube, 流水线'
description: '将 SonarQube 集成到流水线中进行代码质量分析。'
linkTitle: "将 SonarQube 集成到流水线"
weight: 11310
---

[SonarQube](https://www.sonarqube.org/) 是一种主流的代码质量持续检测工具。您可以将其用于代码库的静态和动态分析。SonarQube 集成到 KubeSphere 流水线后，如果在运行的流水线中检测到问题，您可以直接在仪表板上查看常见代码问题，例如 Bug 和漏洞。

本教程演示如何将 SonarQube 集成到流水线中。在[使用 Jenkinsfile 创建流水线](../../../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)之前，请先参考以下步骤。

## 准备工作

您需要[启用 KubeSphere DevOps 系统](../../../pluggable-components/devops/)。

## 安装 SonarQube 服务器

要将 SonarQube 集成到您的流水线，必须先安装 SonarQube 服务器。

1. 请先安装 Helm，以便后续使用该工具安装 SonarQube。例如，运行以下命令安装 Helm 3：

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
   ```

   查看 Helm 版本。

   ```bash
   helm version
   
   version.BuildInfo{Version:"v3.4.1", GitCommit:"c4e74854886b2efe3321e185578e6db9be0a6e29", GitTreeState:"clean", GoVersion:"go1.14.11"}
   ```

   {{< notice note >}}

   有关更多信息，请参见 [Helm 文档](https://helm.sh/zh/docs/intro/install/)。

   {{</ notice >}} 

2. 执行以下命令安装 SonarQube 服务器。

   ```bash
   helm upgrade --install sonarqube sonarqube --repo https://charts.kubesphere.io/main -n kubesphere-devops-system  --create-namespace --set service.type=NodePort
   ```

   {{< notice note >}}

   请您确保使用 Helm 3 安装 SonarQube Server。

   {{</ notice >}}

3. 您会获取以下提示内容：

   ![安装 SonarQube](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-install.png)

## 获取 SonarQube 控制台地址

1. 执行以下命令以获取 SonarQube NodePort。

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. 您可以获得如下输出（本示例中端口号为 `31377`，可能与您的端口号不同）：

   ```bash
   http://10.77.1.201:31377
   ```

## 配置 SonarQube 服务器

### 步骤 1：访问 SonarQube 控制台

1. 执行以下命令查看 SonarQube 的状态。请注意，只有在 SonarQube 启动并运行后才能访问 SonarQube 控制台。

   ```bash
   $ kubectl get pod -n kubesphere-devops-system
   NAME                                       READY   STATUS    RESTARTS   AGE
   devops-jenkins-68b8949bb-7zwg4                 1/1     Running   0          84m
   s2ioperator-0                              1/1     Running   1          84m
   sonarqube-postgresql-0                     1/1     Running   0          5m31s
   sonarqube-sonarqube-bb595d88b-97594        1/1     Running   2          5m31s
   ```

2. 在浏览器中访问 SonarQube 控制台 `http://<Node IP>:<NodePort>`。

3. 点击右上角的 **Log in**，然后使用默认帐户 `admin/admin` 登录。

   {{< notice note >}}

   取决于您的实例的部署位置，您可能需要设置必要的端口转发规则，并在您的安全组中放行该端口，以便访问 SonarQube。

   {{</ notice >}}

### 步骤 2：创建 SonarQube 管理员令牌 (Token)

1. 点击右上角字母 **A**，然后从菜单中选择 **My Account** 以转到 **Profile** 页面。

   ![SonarQube 配置-1](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-config-1.png)

2. 点击 **Security** 并输入令牌名称，例如 `kubesphere`。

   ![SonarQube 配置-2](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-config-2.png)

3. 点击 **Generate** 并复制此令牌。

   ![SonarQube 配置-3](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-config-3.png)

   {{< notice warning >}} 

   如提示所示，您无法再次查看此令牌，因此请确保复制成功。

   {{</ notice >}}

### 步骤 3：创建 Webhook 服务器 

1. 执行以下命令获取 SonarQube Webhook 的地址。

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT/sonarqube-webhook/
   ```

2. 预期输出结果：

   ```bash
   http://10.77.1.201:30180/sonarqube-webhook/
   ```

3. 依次点击 **Administration**、**Configuration** 和 **Webhooks** 创建一个 Webhook。

   ![SonarQube Webhook-1](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-webhook-1.png)

4. 点击 **Create**。

   ![SonarQube Webhook-2](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-webhook-2.png)

5. 在弹出的对话框中输入 **Name** 和 **Jenkins Console URL**（即 SonarQube Webhook 地址）。点击 **Create** 完成操作。

   ![Webhook 页面信息](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/webhook-page-info.png)

### 步骤 4：将 SonarQube 配置添加到 ks-installer

1. 执行以下命令编辑 `ks-installer`。

   ```bash
   kubectl edit cc -n kubesphere-system ks-installer
   ```

2. 搜寻至 `devops`。添加字段 `sonarqube` 并在其下方指定 `externalSonarUrl` 和 `externalSonarToken`。

   ```yaml
   devops:
     enabled: true
     jenkinsJavaOpts_MaxRAM: 2g
     jenkinsJavaOpts_Xms: 512m
     jenkinsJavaOpts_Xmx: 512m
     jenkinsMemoryLim: 2Gi
     jenkinsMemoryReq: 1500Mi
     jenkinsVolumeSize: 8Gi
     sonarqube: # Add this field manually.
       externalSonarUrl: http://10.77.1.201:31377 # The SonarQube IP address.
       externalSonarToken: 00ee4c512fc987d3ec3251fdd7493193cdd3b91d # The SonarQube admin token created above.
   ```

3. 完成操作后保存此文件。

### 步骤 5：将 SonarQube 服务器添加至 Jenkins

1. 执行以下命令获取 Jenkins 的地址。

   ```bash
   export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services devops-jenkins)
   export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
   echo http://$NODE_IP:$NODE_PORT
   ```

2. 您可以获得以下输出，获取 Jenkins 的端口号。

   ```bash
   http://10.77.1.201:30180
   ```

3. 请使用地址 `http://<Node IP>:30180` 访问 Jenkins。安装 KubeSphere 时，默认情况下也会安装 Jenkins 仪表板。此外，Jenkins 还配置有 KubeSphere LDAP，这意味着您可以直接使用 KubeSphere 帐户（例如 `admin/P@88w0rd`）登录 Jenkins。有关配置 Jenkins 的更多信息，请参见 [Jenkins 系统设置](../../../devops-user-guide/how-to-use/jenkins-setting/)。

   {{< notice note >}}

   取决于您的实例的部署位置，您可能需要设置必要的端口转发规则，并在您的安全组中放行端口 `30180`，以便访问 Jenkins。

   {{</ notice >}} 

4. 点击左侧导航栏中的**系统管理**。

5. 向下翻页找到并点击**系统配置**。

6. 搜寻到 **SonarQube servers**，然后点击 **Add SonarQube**。

7. 输入 **Name** 和 **Server URL** (`http://<Node IP>:<NodePort>`)。点击**添加**，选择 **Jenkins**，然后在弹出的对话框中用 SonarQube 管理员令牌创建凭证（如下方第二张截图所示）。创建凭证后，从 **Server authentication token** 旁边的下拉列表中选择该凭证。点击**应用**完成操作。

   ![sonarqube-jenkins-settings](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-jenkins-settings.png)
   
   ![add-credentials](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/add-credentials.png)
   
   {{< notice note >}}
   
   如果点击**添加**按钮无效（Jenkins 已知问题），您可以前往**系统管理**下的 **Manage Credentials** 并点击 **Stores scoped to Jenkins** 下的 **Jenkins**，再点击**全局凭据 (unrestricted)**，然后点击左侧导航栏的**添加凭据**，参考上方第二张截图用 SonarQube 管理员令牌添加凭证。添加凭证后，从 **Server authentication token** 旁边的下拉列表中选择该凭证。
   
   {{</ notice >}}

### 步骤 6：将 sonarqubeURL 添加到 KubeSphere 控制台

您需要指定 `sonarqubeURL`，以便可以直接从 KubeSphere 控制台访问 SonarQube。

1. 执行以下命令：

   ```bash
   kubectl edit  cm -n kubesphere-system  ks-console-config
   ```

2. 搜寻到 `data.client.enableKubeConfig`，在下方添加 `devops` 字段并指定 `sonarqubeURL`。 

   ```bash
   client:
     enableKubeConfig: true
     devops: # 手动添加该字段。
       sonarqubeURL: http://10.77.1.201:31377 # SonarQube IP 地址。
   ```

3. 保存该文件。

### 步骤 7：重启服务

执行以下命令。

```bash
kubectl -n kubesphere-system rollout restart deploy ks-apiserver
```

```bash
kubectl -n kubesphere-system rollout restart deploy ks-console
```

## 为新工程创建 SonarQube Token

您需要一个 SonarQube 令牌，以便您的流水线可以在运行时与 SonarQube 通信。

1. 在 SonarQube 控制台上，点击 **Create new project**。

   ![SonarQube 创建项目](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-create-project.png)

2. 输入工程密钥，例如 `java-demo`，然后点击 **Set Up**。

   ![Jenkins 项目密钥](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/jenkins-projet-key.png)

3. 输入工程名称，例如 `java-sample`，然后点击 **Generate**。

   ![创建令牌](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/generate-a-token.png)

4. 创建令牌后，点击 **Continue**。

   ![令牌已创建](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/token-created.png)

5. 分别选择 **Java** 和 **Maven**。复制下图所示绿色框中的序列号，如果要在流水线中使用，则需要在[凭证](../../../devops-user-guide/how-to-use/credential-management/#创建凭证)中添加此序列号。

   ![sonarqube-example](/images/docs/zh-cn/devops-user-guide/tool-integration/integrate-sonarqube-into-pipelines/sonarqube-example.png)

## 在 KubeSphere 控制台查看结果

您[使用图形编辑面板创建流水线](../../how-to-use/create-a-pipeline-using-graphical-editing-panel/)或[使用 Jenkinsfile 创建流水线](../../how-to-use/create-a-pipeline-using-jenkinsfile/)之后，可以查看代码质量分析的结果。
