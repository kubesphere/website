---
title: "在AWS EKS上部署KubeSphere"
keywords: 'Kubernetes, KubeSphere, EKS, 安装'
description: '介绍如何在AWS EKS上部署 KubeSphere'

weight: 2265
---

本指南将引导您完成在[AWS EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)上部署KubeSphere的步骤。

## 安装AWS CLI
AWS EKS没有像GKE这样的Web终端，因此我们必须先安装aws cli。下面以linux为例，macOS和其他操作系统可参考[EKS入门](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html)。
```shell
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

使用`aws --version`检查安装版本 

```shell
# aws --version
aws-cli/2.1.2 Python/3.7.3 Linux/4.18.0-193.6.3.el8_2.x86_64 exe/x86_64.centos.8
```

## 准备EKS集群

- 在 AWS 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件, 转到导航菜单，然后参考下图创建集群。

  ![create-cluster-eks](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/eks-launch-icon.png)

- 在“配置集群”页面上，填写以下字段：
![config-cluster-page](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/config-cluster-page.png)

  - 名称–集群的唯一名称。

  - Kubernetes版本–用于集群创建的Kubernetes版本。

  - 集群服务角色–选择通过[创建Amazon EKS集群IAM角色](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#role-create)创建的IAM角色。

  - Secrets加密–（可选）选择使用AWS密钥管理服务（AWS KMS）启用Kubernetes secrets的信封加密。如果启用信封加密，Kubernetes secrets 将使用您选择的客户主密钥（CMK）进行加密。CMK必须是对称的，在与集群相同的区域中创建，如果CMK是在不同的帐户中创建的，则用户必须有权访问CMK。有关详细信息，请在AWS密钥管理服务开发人员指南中参阅[允许其他帐户中的用户使用CMK](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html)。

  - 使用AWS KMS CMK进行Kubernetes秘密加密需要Kubernetes版本1.13或更高版本。如果未列出密钥，则必须先创建一个。有关更多信息，请参见[创建密钥](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html)。

  - 标签–（可选）将所有标签添加到您的集群。有关更多信息，请参阅[标记Amazon EKS资源](https://docs.aws.amazon.com/eks/latest/userguide/eks-using-tags.html)。


- 选择下一步。

  - 在“指定网络”页面上，为以下字段选择值：
  ![network](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/networking.png)

  - VPC –您之前在[创建Amazon EKS集群VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create)中创建的VPC。您可以在下拉列表中找到VPC的名称。

  - 子网–默认情况下，上一字段中指定的VPC中的可用子网是预选的。选择您不想承载集群资源的任何子网，例如工作程序节点或负载平衡器。

  - 安全组–通过[创建Amazon EKS集群VPC](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#vpc-create)中生成的AWS CloudFormation输出的SecurityGroups值。该安全组在下拉名称中具有`ControlPlaneSecurityGroup`。

对于集群`endpoints`访问–选择以下选项之一：

![endpoints](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/endpoints.png)

  - 公有-仅启用对集群的Kubernetes API服务器端点的公共访问。来自集群VPC外部的Kubernetes API请求使用公共端点。默认情况下，允许从任何源IP地址进行访问。您可以选择限制访问一个或多个CIDR范围，例如192.168.0.0/16，例如，选择“高级设置”，然后选择“添加源”。

  - 私有-仅启用对群集的Kubernetes API服务器端点的专用访问。来自集群VPC内部的Kubernetes API请求使用私有VPC端点。

    > 重要说明:
    如果创建的VPC没有出站Internet访问，则必须启用私有访问。

  - 公有和私有-启用公有和私有访问。
- 选择下一步。
![logging](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/logging.png)

  - 在“配置日志记录”页面上，可以选择要启用的日志类型。默认情况下，每种日志类型均为“禁用”。有关更多信息，请参阅[Amazon EKS控制平面日志记录](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)。

- 选择下一步。
  ![revies](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/review.png)

- 在“查看和创建”页面上，查看在之前页面上输入或选择的信息。如果需要更改任何选择，请选择“编辑”。对设置满意后，选择创建。状态字段显示“正在创建”，直到群集设置过程完成。有关先前选项的更多信息，请参阅修改集群端点访问。集群配置完成后（通常在10到15分钟之间），请记下API服务器端点和证书颁发机构值。这些将在您的kubectl配置中使用。
  ![creating](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/creating.png)

- 添加节点组，在此集群中定义3个节点。

  ![node-group](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/node-group.png)

- 配置节点组，注意创建[节点角色](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html)。

  ![config-node-group](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/config-node-grop.png)

{{< notice note >}}

KubeSphere 3.0.0支持的Kubernetes版本：1.15.x，1.16.x，1.17.x，1.18.x。
- 这里以Ubuntu为操作系统。有关支持的系统的更多信息，请参见概述。
- 此示例中包括3个节点。您可以根据自己的需求添加更多节点，尤其是在生产环境中。
- 机器类型t3.medium（2个vCPU，4GB内存）用于最小化安装。如果要启用可插拔组件或将群集用于生产，请选择具有更多资源的机器类型。
- 对于其他设置，您也可以根据自己的需要进行更改，也可以使用默认值。

{{</ notice >}}

- 当EKS集群准备就绪时，您可以使用kubectl连接到集群。
## 配置 kubectl

我们将使用kubectl命令行实用程序与集群API Server进行通信。首先，我们应该获取刚刚创建的eks集群的kubeconfig。

- 配置您的AWS CLI凭证
```shell
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: region-code
Default output format [None]: json
```
- 使用AWS CLI创建kubeconfig文件

```shell
aws eks --region us-west-2 update-kubeconfig --name cluster_name
```
  - 默认情况下，生成的配置文件在主目录中的默认kubeconfig路径（.kube / config）中创建，或与该位置处的现有kubeconfig合并。您可以使用–kubeconfig选项指定其他路径。

  - 您可以使用–role-arn选项指定IAM角色ARN，以在执行kubectl命令时用于身份验证。否则，将使用默认AWS CLI或SDK证书链中的IAM实体。您可以通过运行aws sts get-caller-identity命令查看默认的AWS CLI或SDK身份。

有关更多信息，请参阅带有aws eks update-kubeconfig help命令的帮助页面，或参阅[AWS CLI命令参考](https://docs.aws.amazon.com/eks/latest/userguide/security_iam_id-based-policy-examples.html)中的update-kubeconfig 。

- 测试您的配置。
  ```shell
  kubectl get svc
  ```

## 在EKS上安装KubeSphere

- 使用kubectl安装KubeSphere。以下命令仅用于默认的最小安装。

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
```

- 创建一个本地cluster-configuration.yaml。
```shell
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

- 检查安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

- 安装完成后，您会看到以下消息：

```bash
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

## 访问KubeSphere控制台

现在已经安装了KubeSphere，您可以按照以下步骤访问KubeSphere的Web控制台。

- 查看ks-console服务。
```shell
kubectl get svc -n kubesphere-system
```

- 执行`kubectl edit ks-console`将service类型从`NodePort`更改为`LoadBalancer`，完成后保存文件。

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

- 执行`kubectl get svc -n kubesphere-system` 获取您的EXTERNAL-IP
```shell
# kubectl get svc -n kubesphere-system
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)        AGE
ks-apiserver            ClusterIP      10.100.108.212   <none>                                                                    80/TCP         6m28s
ks-console              LoadBalancer   10.100.160.240   ad107c54ee456744c91c8da0b9321f2c-1235661477.ap-east-1.elb.amazonaws.com   80:30880/TCP   6m25s
ks-controller-manager   ClusterIP      10.100.126.96    <none>                                                                    443/TCP        6m28s
openldap                ClusterIP      None             <none>                                                                    389/TCP        6m54s
redis                   ClusterIP      10.100.218.34    <none>                                                                    6379/TCP       6m59s
```

- 使用EKS生成的external-ip访问KubeSphere的Web控制台。

- 使用默认帐户和密码（admin/P@88w0rd）登录控制台。在集群概述页面中，您可以看到如下图所示的仪表板。

![gke-cluster](/images/docs/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-eks/gke-cluster.png)

## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程。要在KubeSphere中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)以获取更多详细信息。
