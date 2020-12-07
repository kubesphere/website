---
title: "将 SonarQube 集成到流水线"
keywords: 'Kubernetes, KubeSphere, devops, jenkins, sonarqube, pipeline'
description: '本教程演示了如何将 SonarQube 集成到流水线中。'
linkTitle: "将 SonarQube 集成到流水线"
weight: 11310
---

[SonarQube](https://www.sonarqube.org/) 是一种流行的代码质量持续监测工具。 您可以将其用于代码库的静态和动态分析。将其集成到 KubeSphere 的流水线中后， 当 SonarQube 在运行的流水线检测到问题时，您可以直接在仪表盘上查看常见的代码问题，比如 bug 和漏洞。</br>
本教程演示了如何将 SonarQube 集成到流水线中。 在[使用 Jenkinsfile 创建流水线](../../../devops-user-guide/how-to-use/create-a-pipeline-using-jenkinsfile/)之前，请先参考以下步骤。

## 先决条件

您需要[启用 KubeSphere DevOps 系统](../../../../docs/pluggable-components/devops/)。

## 安装 SonarQube 服务

1. 如果尚未安装，请执行以下命令来安装 SonarQube 服务：

```bash
helm upgrade --install sonarqube sonarqube --repo https://charts.kubesphere.io/main -n kubesphere-devops-system  --create-namespace --set service.type=NodePort
```

2. 您将得到以下提示：

![sonarqube-install](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-install.png)

## 获取 SonarQube 控制台地址

1. 执行以下命令以获取 SonarQube 控制台地址。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services sonarqube-sonarqube)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

2. 您可以得到如下输出 (`31377` 是此示例中的端口号，可能与您的端口号不同):

```bash
http://10.77.1.201:31377
```

## 配置 SonarQube 服务器

### 步骤 1: 访问 SonarQube 控制台

1. 执行以下命令以查看 SonarQube 的状态。 请注意，只有在 SonarQube 启动并运行后才能访问 SonarQube 控制台。

```bash
$ kubectl get pod -n kubesphere-devops-system
NAME                                       READY   STATUS    RESTARTS   AGE
ks-jenkins-68b8949bb-7zwg4                 1/1     Running   0          84m
s2ioperator-0                              1/1     Running   1          84m
sonarqube-postgresql-0                     1/1     Running   0          5m31s
sonarqube-sonarqube-bb595d88b-97594        1/1     Running   2          5m31s
uc-jenkins-update-center-8c898f44f-m8dz2   1/1     Running   0          85m
```

2. 在浏览器中访问 SonarQube 控制台 `http://10.77.1.201:31377`，您可以看到其主页，如下所示：

![access-sonarqube-console](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/access-sonarqube-console.png)

3. 单击右上角的 **Log in**，然后使用默认帐户登陆 `admin/admin`。

![log-in-page](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/log-in-page.png)

{{< notice note >}}

您可能需要设置必要的端口转发规则并打开端口以访问安全组中的 SonarQube ，具体取决于实例的部署位置。

{{</ notice >}}

### 步骤 2: 创建 SonarQube 管理员 Token

1. 单击右上角字母 **A**，然后从菜单中选择 **My Account** 以转到 **Profile** 页面。

![sonarqube-config-1](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-config-1.png)

2. 单击 **Security** 并输入Token 名称，如 kubesphere。

![sonarqube-config-2](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-config-2.png)

3. 单击 **Generate** 并复制 token。

![sonarqube-config-3](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-config-3.png)

{{< notice warning >}}

如提示所示，请确保您确实复制了 token，因为您将无法再次看到此 token。

{{</ notice >}}

### 步骤 3: 创建一个 SonarQube Webhook 服务 

1. 执行以下命令以获取 SonarQube Webhook 的地址。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT/sonarqube-webhook/
```

2. 预期的输出结果:

```bash
http://10.77.1.201:30180/sonarqube-webhook/
```

3. 依次单击 **Administration**, **Configuration** 和 **Webhooks** 创建一个 webhook。

![sonarqube-webhook-1](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-webhook-1.png)

4. 点击 **Create**。

![sonarqube-webhook-3](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-webhook-2.png)

5. 在出现的对话框中输入**Name** 和 **Jenkins Console URL**（即SonarQube Webhook地址）。 单击 **Create** 完成。

![webhook-page-info](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/webhook-page-info.png)

### 步骤 4: 将 SonarQube 配置添加到 ks-installer

1. 执行以下命令编辑 `ks-installer`。

```bash
kubectl edit cc -n kubesphere-system ks-installer
```

2. 导航至 `devops`。 添加字段 `sonarqube` 并在其下指定 `externalSonarUrl` 和 `externalSonarToken`。

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

3. 完成后保存文件。

### 步骤 5: 将 SonarQube Server 添加到 Jenkins

1. 执行以下命令获取 Jenkins 的地址。

```bash
export NODE_PORT=$(kubectl get --namespace kubesphere-devops-system -o jsonpath="{.spec.ports[0].nodePort}" services ks-jenkins)
export NODE_IP=$(kubectl get nodes --namespace kubesphere-devops-system -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

2. 您可以得到以下输出，获取您 Jenkins 的端口号。

```bash
http://10.77.1.201:30180
```

3. 使用地址 `http://10.77.1.201:30180` 访问 Jenkins。安装 KubeSphere 时，默认情况下也会安装 Jenkins 仪表板。 Jenkins 配置了KubeSphere LDAP，这意味着您可以直接使用 KubeSphere 帐户（例如 admin/P@88w0rd）登录 Jenkins。 有关配置 Jenkins 的更多信息，请参阅 [Jenkins 系统设置](../../../devops-user-guide/how-to-use/jenkins-setting/)。

![jenkins-login-page](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/jenkins-login-page.png)

{{< notice note >}}

您可能需要设置必要的端口转发规则并打开端口 `30180` 才能访问安全组中的 Jenkins，具体取决于您的实例部署的位置。

{{</ notice >}} 

4. 单击左侧的 **Manage Jenkins**。

![manage-jenkins](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/manage-jenkins.png)

5. 向下翻页找到并单击 **Configure System**。

![configure-system](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/configure-system.png)

6. 导航到 **SonarQube servers**，然后单击 **Add SonarQube**。

![add-sonarqube](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/add-sonarqube.png)

7. 输入 **Name**，**Server URL** (`http://10.77.1.201:31377`)和 **Server authentication token**（SonarQube 管理管理员 token）。 单击**Apply**完成。

![sonarqube-jenkins-settings](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-jenkins-settings.png)

### 步骤 6: 将 sonarqubeUrl 添加到 KubeSphere 控制台

您需要指定 `sonarqubeURL`，以便可以直接从 KubeSphere 控制台访问 SonarQube。

1. 执行以下命令：

```bash
kubectl edit  cm -n kubesphere-system  ks-console-config
```

2. 导航到 `client`，添加 `devops`字段，填写 `sonarqubeURL` 的值。 

```yaml
client:
  version:
    kubesphere: v3.0.0
    kubernetes: v1.17.9
    openpitrix: v0.3.5
  enableKubeConfig: true
  devops: # Add this field manually.
    sonarqubeURL: http://10.77.1.201:31377 # The SonarQube IP address.
```

3. 保存文件。

### 步骤 7: 重新启动服务使所有功能生效

执行以下命令：

```bash
kubectl -n kubesphere-system rollout restart deploy ks-apiserver
```

```bash
kubectl -n kubesphere-system rollout restart deploy ks-console
```

## 为新项目创建 SonarQube Token

您需要一个 SonarQube Token，以便您的流水线可以在运行时与 SonarQube 通信。

1. 在 SonarQube 控制台上，单击 **Create new project**。

![sonarqube-create-project](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-create-project.png)

2. 输入项目密钥，例如 `java-demo`，然后单击 **Set Up**。

![jenkins-projet-key](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/jenkins-projet-key.png)

3. 输入项目名称，例如 `java-sample`，然后单击 **Generate**。

![generate-a-token](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/generate-a-token.png)

4. 创建令牌后，单击 **Continue**。

![token-created](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/token-created.png)

1. 分别选择 **Java** 和 **Maven** 。 复制下图中的绿色框中的序列号，如果要在流水线中使用，则需要在[凭据](../../../devops-user-guide/how-to-use/credential-management/#create-credentials)中添加此序列号。

![sonarqube-example](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-example.png)

## 在 KubeSphere 控制台查看结果

使用[图形编辑面板创建流水线](../../how-to-use/create-a-pipeline-using-graphical-editing-panel)或[使用 Jenkinsfile 创建流水线](../../how-to-use/create-a-pipeline-using-jenkinsfile)之后，您可以查看代码质量分析的结果。 如果 SonarQube 成功运行，您可能会看到以下图片所示结果。

![sonarqube-view-result](/images/docs/devops-user-guide-zh/integrate-sonarqube-into-pipeline-zh/sonarqube-view-result.png)