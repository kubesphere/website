---
title: '使用 x509-certificate-exporter 监控 Kubernetes 集群组件的证书'
tag: 'Prometheus, KubeSphere'
keywords: 'x509-certificate-exporter, Prometheus, Kubernetes, Helm, KubeSphere, 证书监控'
description: '本文详细描述了如何在 Kubernetes 中部署 x509-certificate-exporter，并结合 KubeSphere 的自定义告警策略来监控 Kubernetes 集群组件的证书。'
createTime: '2021-06-30'
author: '杨传胜'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/20210713231336.jpg'
---

KubeSphere 虽然提供了运维友好的向导式操作界面，简化了 Kubernetes 的运维操作，但它还是建立在底层 Kubernetes 之上的，Kubernetes 默认的证书有效期都是一年，即使使用 [KubeKey](https://github.com/kubesphere/kubekey) 这样的集群安装利器也不能改变这个结果。如果不想办法对 Kubernetes 各个组件的证书有效期进行监控，说不定哪天就会掉进坑里。

有部分读者可能听说过 [ssl-exporter](https://github.com/ribbybibby/ssl_exporter) 这个项目，它能提供多种针对 SSL 的检测手段，包括：HTTPS 证书、文件证书、Kubernetes Secret、Kubeconfig 文件。从功能上来看，它基本可以满足上述需求，但它的指标还不够丰富，本文将介绍一个更为强大的 Prometheus Exporter：[x509-certificate-exporter](https://github.com/enix/x509-certificate-exporter)。

与 ssl-exporter 不同，x509-certificate-exporter 只专注于监控 Kubernetes 集群相关的证书，包括各个组件的文件证书、Kubernetes TLS Secret、Kubeconfig 文件，而且指标更加丰富。我们来看看在 KubeSphere 中如何部署 x509-certificate-exporter 以监控集群的所有证书。

## 准备 KubeSphere 应用模板

[KubeSphere](https://kubesphere.com.cn) 集成了 [OpenPitrix](https://github.com/openpitrix/openpitrix) 来提供应用程序全生命周期管理，OpenPitrix 是一个多云应用管理平台，KubeSphere 利用它实现了应用商店和应用模板，以可视化的方式部署并管理应用。对于应用商店中不存在的应用，用户可以将 Helm Chart 交付至 KubeSphere 的公共仓库，或者导入私有应用仓库来提供应用模板。

本教程将使用 KubeSphere 的应用模板来部署 x509-certificate-exporter。

要想从应用模板部署应用，需要创建一个企业空间、一个项目和两个用户帐户（`ws-admin` 和 `project-regular`）。`ws-admin` 必须被授予企业空间中的 `workspace-admin` 角色， `project-regular` 必须被授予项目中的 `operator` 角色。在创建之前，我们先来回顾一下 KubeSphere 的多租户架构。

### 多租户架构

KubeSphere 的多租户系统分**三个**层级，即集群、企业空间和项目。KubeSphere 中的项目等同于 Kubernetes 的[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

您需要创建一个新的[企业空间](https://kubesphere.com.cn/docs/workspace-administration/what-is-workspace/)进行操作，而不是使用系统企业空间，系统企业空间中运行着系统资源，绝大部分仅供查看。出于安全考虑，强烈建议给不同的租户授予不同的权限在企业空间中进行协作。

您可以在一个 KubeSphere 集群中创建多个企业空间，每个企业空间下可以创建多个项目。KubeSphere  为每个级别默认设有多个内置角色。此外，您还可以创建拥有自定义权限的角色。KubeSphere  多层次结构适用于具有不同团队或组织以及每个团队中需要不同角色的企业用户。

### 创建帐户

安装 KubeSphere 之后，您需要向平台添加具有不同角色的用户，以便他们可以针对自己授权的资源在不同的层级进行工作。一开始，系统默认只有一个用户 `admin`，具有 `platform-admin` 角色。在本步骤中，您将创建一个用户 `user-manager`，然后使用 `user-manager` 创建新帐户。

1. 以 `admin` 身份使用默认帐户和密码 (`admin/P@88w0rd`) 登录 Web 控制台。

> 出于安全考虑，强烈建议您在首次登录控制台时更改密码。若要更改密码，在右上角的下拉菜单中选择**个人设置**，在**密码设置**中设置新密码，您也可以在**个人设置**中修改控制台语言。

2. 登录控制台后，点击左上角的**平台管理**，然后选择**访问控制**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602121105.png)

   在**帐户角色**中，有如下所示四个可用的内置角色。接下来要创建的第一个用户将被分配 `users-manager` 角色。

   | 内置角色             | 描述                                                         |
   | -------------------- | ------------------------------------------------------------ |
   | `workspaces-manager` | 企业空间管理员，管理平台所有企业空间。                       |
   | `users-manager`      | 用户管理员，管理平台所有用户。                               |
   | `platform-regular`   | 平台普通用户，在被邀请加入企业空间或集群之前没有任何资源操作权限。 |
   | `platform-admin`     | 平台管理员，可以管理平台内的所有资源。                       |

3. 在**帐户管理**中，点击**创建**。在弹出窗口中，提供所有必要信息（带有*标记），然后在**角色**字段选择 `users-manager`。请参考下图示例。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602121344.png)

   完成后，点击**确定**。新创建的帐户将显示在**帐户管理**中的帐户列表中。

4. 切换帐户使用 `user-manager` 重新登录，创建如下三个新账户。

   | 帐户              | 角色                 | 描述                                                         |
   | ----------------- | -------------------- | ------------------------------------------------------------ |
   | `ws-manager`      | `workspaces-manager` | 创建和管理所有企业空间。                                     |
   | `ws-admin`        | `platform-regular`   | 管理指定企业空间中的所有资源（此帐户用于邀请成员 project-regular 加入该企业空间）。 |
   | `project-regular` | `platform-regular`   | 该帐户将用于在指定项目中创建工作负载、流水线和其他资源。     |
   
5. 查看创建的三个帐户。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602125533.png)

### 创建企业空间

在本步骤中，您需要使用上一个步骤中创建的帐户 `ws-manager` 创建一个企业空间。作为管理项目、创建工作负载和组织成员的基本逻辑单元，企业空间是 KubeSphere 多租户系统的基础。

1. 以 `ws-manager` 身份登录 KubeSphere，它具有管理平台上所有企业空间的权限。点击左上角的**平台管理**，选择**访问控制**。在**企业空间**中，可以看到仅列出了一个默认企业空间 `system-workspace`，即系统企业空间，其中运行着与系统相关的组件和服务，您无法删除该企业空间。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602124954.png)

2. 点击右侧的**创建**，将新企业空间命名为 `demo-workspace`，并将用户 `ws-admin` 设置为企业空间管理员，如下图所示：

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602125154.png)

   完成后，点击**创建**。
   
3. 登出控制台，然后以 `ws-admin` 身份重新登录。在**企业空间设置**中，选择**企业成员**，然后点击**邀请成员**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602130213.png)

4. 邀请 `project-regular` 进入企业空间，授予其 `workspace-viewer` 角色。

   > 实际角色名称的格式：`<workspace name>-<role name>`。例如，在名为 `demo-workspace` 的企业空间中，角色 `viewer` 的实际角色名称为 `demo-workspace-viewer`。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602130602.png)

5. 将 `project-regular` 添加到企业空间后，点击**确定**。在**企业成员**中，您可以看到列出的两名成员。

   | 帐户              | 角色               | 描述                                                         |
   | ----------------- | ------------------ | ------------------------------------------------------------ |
   | `ws-admin`        | `workspace-admin`  | 管理指定企业空间中的所有资源（在此示例中，此帐户用于邀请新成员加入企业空间、创建项目）。 |
   | `project-regular` | `workspace-viewer` | 该帐户将用于在指定项目中创建工作负载和其他资源。             |

### 创建项目

在此步骤中，您需要使用在上一步骤中创建的帐户 `ws-admin` 来创建项目。KubeSphere 中的项目与 Kubernetes 中的命名空间相同，为资源提供了虚拟隔离。有关更多信息，请参见[命名空间](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)。

1. 以 `ws-admin` 身份登录 KubeSphere，在**项目管理**中，点击**创建**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602133054.png)

2. 输入项目名称（例如 `exporter`），然后点击**确定**完成，您还可以为项目添加别名和描述。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210625224726.png)

3. 在**项目管理**中，点击刚创建的项目查看其详细信息。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210625225425.png)

4. 邀请 `project-regular` 至该项目，并授予该用户 `operator` 角色。请参考下图以了解具体步骤。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210625225331.png)

   > 具有 `operator` 角色的用户是项目维护者，可以管理项目中除用户和角色以外的资源。

### 添加应用仓库

1. 以 `ws-admin` 用户登录 KubeSphere 的 Web 控制台。在您的企业空间中，进入**应用管理**下的**应用仓库**页面，并点击**添加仓库**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602134919.png)

2. 在弹出的对话框中，将应用仓库名称设置为 `enix`，将应用仓库的 URL 设置为 `https://charts.enix.io`，点击**验证**对 URL 进行验证，再点击**确定**进入下一步。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210625230002.png)

3. 应用仓库导入成功后会显示在如下图所示的列表中。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629133503.png)

## 部署 x509-certificate-exporter

导入 x509-certificate-exporter 的应用仓库后，就可以通过应用模板来部署 x509-certificate-exporter 了。

1. 登出 KubeSphere 并以 `project-regular` 用户重新登录。在您的项目中，进入**应用负载**下的**应用**页面，再点击**部署新应用**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140249.png)

2. 在弹出的对话框中选择**来自应用模板**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140535.png)

3. 在弹出的对话框中选择**来自应用模板**。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602140626.png)

   **来自应用商店**：选择内置的应用和以 Helm Chart 形式单独上传的应用。

   **来自应用模板**：从私有应用仓库和企业空间应用池选择应用。

4. 从下拉列表中选择之前添加的私有应用仓库 `enix`。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629133811.png)

5. 选择 x509-certificate-exporter 进行部署。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629134000.png)

6. 您可以查看应用信息和配置文件，在**版本**下拉列表中选择版本，然后点击部署。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629134135.jpg)

7. 设置应用名称，确认应用版本和部署位置，点击下一步。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629134221.png)
   
8. 接下来进入应用配置页面。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210602141412.png)

9. 这里需要手动编辑配置清单，指定证书文件的路径。

   ```yaml
     daemonSets:
       master:
         nodeSelector:
           node-role.kubernetes.io/master: ''
         tolerations:
           - effect: NoSchedule
             key: node-role.kubernetes.io/master
             operator: Exists
         watchFiles:
           - /var/lib/kubelet/pki/kubelet-client-current.pem
           - /etc/kubernetes/pki/apiserver.crt
           - /etc/kubernetes/pki/apiserver-kubelet-client.crt
           - /etc/kubernetes/pki/ca.crt
           - /etc/kubernetes/pki/front-proxy-ca.crt
           - /etc/kubernetes/pki/front-proxy-client.crt
         watchKubeconfFiles:
           - /etc/kubernetes/admin.conf
           - /etc/kubernetes/controller-manager.conf
           - /etc/kubernetes/scheduler.conf
       nodes:
         tolerations:
           - effect: NoSchedule
             key: node-role.kubernetes.io/ingress
             operator: Exists
         watchFiles:
           - /var/lib/kubelet/pki/kubelet-client-current.pem
           - /etc/kubernetes/pki/ca.crt
   ```

   该配置会创建两个 `DaemonSet`，master 运行在控制节点，nodes 运行在计算节点。

   ```bash
   $ kubectl -n exporter get ds
   
   NAME                                    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                     AGE
   x509-x509-certificate-exporter-master   1         1         1       1            1           node-role.kubernetes.io/master=   3d14h
   x509-x509-certificate-exporter-nodes    3         3         3       3            3           <none>                            3d14h
   ```

   参数解释：

   + **watchFiles** : 证书文件所在的路径。
   + **watchKubeconfFiles** : Kubeconfig 文件所在的路径。

   改完后的效果如图所示。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629134847.png)

10. 点击部署，等待应用创建完成并开始运行。

   ![](https://pek3b.qingstor.com/kubesphere-community/images/20210629140202.png)

## 接入监控系统

通过应用模板部署完成后，除了会创建两个 DaemonSet 之外，还会创建一个 `ServiceMonitor`。

```bash
$ kubectl -n exporter get servicemonitor
NAME                             AGE
x509-x509-certificate-exporter   3d15h
```

打开 Prometheus 的 Web UI，可以看到相应的 `Targets` 已经在线。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629142812.png)

x509-certificate-exporter 官方提供了一个 [Grafana Dashboard](https://grafana.com/grafana/dashboards/13922)，导入 Grafana 后的效果如图：

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629143502.jpg)

各项指标一目了然，一般我们只需要关注已经过期的证书和即将过期的证书即可。假设我想查看证书还有多久失效，可以使用表达式 `(x509_cert_not_after{filepath!=""} - time()) / 3600 / 24`。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629160148.png)

可以创建相应的告警规则，以便在证书即将过期时通知运维人员尽快更新证书。例如：

进入**监控告警**下的**告警策略**页面，点击**创建**。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629170615.png)

填写告警名称，设置告警级别，点击下一步。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629170849.png)

选择自定义规则，告警规则填入 `(x509_cert_not_after{filepath!=""} - time()) / 3600 / 24 < 30`。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629171044.png)

点击下一步，填写标题和消息。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629171534.png)

点击创建，告警规则就创建完成了。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210629171839.png)

## 结语

事实上 KubeSphere 从 3.1 版本开始就内置了证书过期的告警策略，可以在**告警策略**页面的**内置策略**中输入 `expir` 进行搜索。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210630150523.png)

点进去可以看到具体的告警规则表达式。

![](https://pek3b.qingstor.com/kubesphere-community/images/20210630150804.png)

告警规则表达式里面的指标是 API Server 组件自身暴露的指标，并没有兼顾到整个集群所有组件的证书。想要全面监控所有组件的证书，建议结合 x509-certificate-exporter 在 KubeSphere 中添加自定义告警策略，从此不再为证书过期而烦恼。
