---
title: "在 AWS EKS 上部署 KubeSphere"
keywords: 'Kubernetes, KubeSphere, EKS, 安装'
description: '了解如何在 Amazon Elastic Kubernetes Service 上部署 KubeSphere。'

weight: 4220
---

本指南将介绍如何在 [AWS EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) 上部署 KubeSphere。您也可以通过 [KubeSphere on AWS Quick Start](https://aws.amazon.com/quickstart/architecture/qingcloud-kubesphere/) 在 AWS 上自动部署 EKS 和 KubeSphere。

## 安装 AWS CLI

AWS EKS 没有像 GKE CloudShell 这样的 Web 终端，因此我们必须先安装 aws cli。下面以 linux 为例，macOS 和其他操作系统可参考 [EKS 入门](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html)。

```shell
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

使用`aws --version`检查安装版本。

```shell
$ aws --version
aws-cli/2.1.2 Python/3.7.3 Linux/4.18.0-193.6.3.el8_2.x86_64 exe/x86_64.centos.8
```

## 准备 EKS 集群

1. 在 AWS 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件，转到导航菜单，然后参考下图创建集群。

    ![create-cluster-eks](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/eks-launch-icon.png)

2. 在**配置集群**页面，配置以下集群信息：

    ![config-cluster-page](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/config-cluster-page.png)

    配置选项说明：

    - 名称：集群的唯一名称。
    - Kubernetes 版本：指定创建集群的 Kubernetes 版本。
    - 集群服务角色：选择通过[创建 Amazon EKS 集群 IAM 角色](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#role-create)创建的 IAM 角色。
    - Secrets 加密（可选）：选择使用 AWS 密钥管理服务（AWS KMS）启用 Kubernetes secrets 的信封加密。如果启用信封加密，Kubernetes secrets 将使用您选择的客户主密钥（CMK）进行加密。CMK 必须是对称的，在与集群相同的区域中创建，如果 CMK 是在不同的帐户中创建的，则用户必须有权访问 CMK。有关详细信息，请在 AWS 密钥管理服务开发人员指南中参阅 [允许其他帐户中的用户使用CMK](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html)。
    - 使用 AWS KMS CM 进行 Kubernetes 秘钥加密需要 Kubernetes 1.13 或更高版本。如果密钥不存在，则必须先创建一个。有关更多信息，请参见[创建密钥](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html)。
    - 标签（可选）：将所有标签添加到您的集群。有关更多信息，请参阅[标记 Amazon EKS 资源](https://docs.aws.amazon.com/eks/latest/userguide/eks-using-tags.html)。

3. 选择下一步，在**指定联网**页面上，为以下字段选择值：
  
    ![network](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/networking.png)
  
    - VPC：您之前在[创建 Amazon EKS 集群 VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create) 中创建的 VPC，您可以在下拉列表中找到 VPC 的名称。
    - 子网：默认情况下，上一字段中指定的 VPC 中的可用子网是预选的。选择您不想承载集群资源的任何子网，例如工作节点或负载均衡器。
    - 安全组：通过[创建 Amazon EKS 集群 VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create) 中生成的 AWS CloudFormation 输出的 SecurityGroups 值。该安全组在下拉名称中具有`ControlPlaneSecurityGroup`。

    - 对于集群`endpoints`访问–选择以下选项之一：

        ![endpoints](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/endpoints.png)

        - 公有：仅启用对集群的 Kubernetes API server 端点的公共访问，来自集群 VPC 外部的 Kubernetes API 请求使用这个公共端点。默认情况下，允许从任何源 IP 地址进行访问，您也可以只允许一个或多个 CIDR 地址段访问，例如选择**高级设置**，然后选择**添加源**指定地址段 192.168.0.0/16 才能访问。
        - 私有：仅启用对集群的 Kubernetes API server 端点的专用访问。来自集群 VPC 内部的 Kubernetes API 请求使用这个私有 VPC 端点。

            {{< notice note >}}
      如果创建的 VPC 没有出站 Internet 访问，则必须启用私有访问。
            {{</ notice >}}

        - 公有和私有：启用公有和私有访问。

4. 选择下一步，在**配置日志记录**页面上，可以选择要启用的日志类型。默认情况下，每种日志类型均为**禁用**。有关更多信息，请参阅[Amazon EKS 控制平面日志记录](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)。
    ![logging](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/logging.png)

5. 选择下一步，在**查看和创建**页面上，查看在之前页面上输入或选择的信息。如果需要更改任何选择，请选择**编辑**。对设置满意后，选择**创建**，状态字段将显示**正在创建**，直到集群创建完毕。
    ![revies](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/review.png)

    - 有关先前选项的更多信息，请参阅[修改集群端点访问](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html#modify-endpoint-access)。集群配置完成后（通常在10到15分钟之间），请记下 API server 端点和证书颁发机构值，这些将在您的 kubectl 配置中使用。
      ![creating](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/creating.png)

6. 点击**添加节点组**，在此集群中定义 3 个节点。

    ![node-group](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/node-group.png)

7. 配置节点组，注意创建[节点角色](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html)。

    ![config-node-group](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/config-node-grop.png)

    {{< notice note >}}

- 如需在 Kubernetes 上安装 KubeSphere 3.3，您的 Kubernetes 版本必须为：v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 此示例中包括 3 个节点。您可以根据自己的需求添加更多节点，尤其是在生产环境中。
- t3.medium（2 个 vCPU，4 GB 内存）机器类型仅用于最小化安装，如果要启用可插拔组件或集群用于生产，请选择具有更大规格的机器类型。
- 对于其他设置，您也可以根据自己的需要进行更改，也可以使用默认值。

    {{</ notice >}}

8. 当 EKS 集群准备就绪时，您可以使用 kubectl 连接到集群。

## 配置 kubectl

我们将使用 kubectl 命令行工具与集群 API Server 进行通信。首先需要获取刚刚创建的 EKS 集群的 kubeconfig。

1. 配置您的 AWS CLI 凭证

    ```shell
    $ aws configure
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: region-code
    Default output format [None]: json
    ```

2. 使用 AWS CLI 创建 kubeconfig 文件

    ```shell
    aws eks --region us-west-2 update-kubeconfig --name cluster_name
    ```

    - 默认情况下，生成的配置文件在主目录中的默认 kubeconfig 路径（`.kube/config`）中创建，或与该位置处的现有 kubeconfig 合并。您可以使用`--kubeconfig`选项指定其他路径。

    - 您可以使用`--role-arn`选项指定 IAM 角色 ARN，以在执行 kubectl 命令时用于身份验证。否则，将使用默认 AWS CLI 或 SDK 证书链中的 IAM 实体。您可以通过运行`aws sts get-caller-identity`命令查看默认的 AWS CLI 或 SDK 身份。

    有关更多信息，请参阅带有 aws eks update-kubeconfig help 命令的帮助页面，或参阅[AWS CLI命令参考](https://docs.aws.amazon.com/eks/latest/userguide/security_iam_id-based-policy-examples.html)中的update-kubeconfig。

3. 测试您的配置。

    ```shell
    kubectl get svc
    ```

## 在 EKS 上安装 KubeSphere

- 使用 kubectl 安装 KubeSphere，以下命令仅用于默认的最小安装。

  ```bash
  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml

  kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
  ```

- 检查安装日志：

  ```bash
  kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
  ```

- 安装完成后，您会看到以下消息：

  ```yaml
  #####################################################
  ###              Welcome to KubeSphere!           ###
  #####################################################
  Account: admin
  Password: P@88w0rd
  NOTES：
    1. After logging into the console, please check the
      monitoring status of service components in
      the "Cluster Management". If any service is not
      ready, please wait patiently until all components
      are ready.
    2. Please modify the default password after login.
  #####################################################
  https://kubesphere.io             2020-xx-xx xx:xx:xx
  ```

## 访问 KubeSphere 控制台

现在已经安装了 KubeSphere，您可以按照以下步骤访问 KubeSphere 的 Web 控制台。

- 查看 ks-console 服务。

  ```shell
  kubectl get svc -n kubesphere-system
  ```

- 执行`kubectl edit ks-console`将 service 类型`NodePort` 更改为`LoadBalancer`，完成后保存文件。

  ```shell
  # kubectl edit svc ks-console -n kubesphere-system
  ......
  spec:
    clusterIP: 10.100.160.240
    externalTrafficPolicy: Cluster
    ports:
    - name: nginx
      nodePort: 30880
      port: 80
      protocol: TCP
      targetPort: 8000
    selector:
      app: ks-console
      tier: frontend
      version: v3.0.0
    sessionAffinity: None
    type: LoadBalancer
  ```

- 执行`kubectl get svc -n kubesphere-system`获取您的 EXTERNAL-IP。

  ```shell
  # kubectl get svc -n kubesphere-system
  NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)        AGE
  ks-apiserver            ClusterIP      10.100.108.212   <none>                                                                    80/TCP         6m28s
  ks-console              LoadBalancer   10.100.160.240   ad107c54ee456744c91c8da0b9321f2c-1235661477.ap-east-1.elb.amazonaws.com   80:30880/TCP   6m25s
  ks-controller-manager   ClusterIP      10.100.126.96    <none>                                                                    443/TCP        6m28s
  openldap                ClusterIP      None             <none>                                                                    389/TCP        6m54s
  redis                   ClusterIP      10.100.218.34    <none>                                                                    6379/TCP       6m59s
  ```

- 使用 EKS 生成的 external-ip 访问 KubeSphere 的 Web 控制台。

- 使用默认帐户和密码（`admin/P@88w0rd`）登录控制台。


## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程，要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)。
