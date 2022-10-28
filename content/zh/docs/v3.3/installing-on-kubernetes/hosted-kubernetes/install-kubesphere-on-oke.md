---
title: "在 Oracle OKE 上部署 KubeSphere"
keywords: 'Kubernetes, KubeSphere, OKE, 安装, Oracle-cloud'
description: '了解如何在 Oracle Cloud Infrastructure Container Engine 上部署 KubeSphere。'

weight: 4260
---

本文演示在 [Oracle Kubernetes Engine](https://www.oracle.com/cn/cloud/compute/container-engine-kubernetes.html) 上部署 KubeSphere 的步骤。

## 创建 Kubernetes 集群

1. 在 OKE 上创建一个标准的 Kubernetes 集群是安装 KubeSphere 的前提条件。在导航栏中，请参考下图创建集群。

    ![创建集群](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/创建集群.jpg)

2. 在弹出窗口中，选择**快速创建**并点击**启动工作流**。

    ![快速创建](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/快速创建.jpg)

    {{< notice note >}}
本示例演示**快速创建**，Oracle Cloud 通过此模式会为集群自动创建所必需的资源。如果您选择**定制创建**，您需要自己创建所有资源（例如 VCN 和负载均衡器子网）。
    {{</ notice >}}

3. 接下来，您需要为集群设置基本信息（可参考以下图例）。完成后，请点击**下一步**。

    ![集群基本信息](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/集群基本信息.jpg)

    {{< notice note >}}

- 如需在 Kubernetes 上安装 KubeSphere 3.3，您的 Kubernetes 版本必须为：v1.19.x，v1.20.x，v1.21.x，v1.22.x 或 v1.23.x（实验性支持）。
- 建议您在**可见性类型**中选择**公共**，即每个节点会分配到一个公共 IP 地址，此地址之后可用于访问 KubeSphere Web 控制台。
- 在 Oracle Cloud 中，**配置**定义了一个实例会分配到的 CPU 和内存等资源量，本示例使用 `VM.Standard.E2.2 (2 CPUs and 16G Memory)`。有关更多信息，请参见 [Standard Shapes](https://docs.cloud.oracle.com/en-us/iaas/Content/Compute/References/computeshapes.htm#vmshapes__vm-standard)。
- 本示例包含 3 个节点，可以根据需求自行添加节点（尤其是生产环境）。

    {{</ notice >}}

4. 检查集群信息，确认无需修改后点击**创建集群**。

    ![完成创建集群](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/完成创建集群.jpg)

5. 集群创建后，点击**关闭**。

    ![集群创建完成](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/集群创建完成.jpg)

6. 确保集群状态为**活动**后，点击**访问集群**。

    ![访问集群](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/访问集群.jpg)

7. 在弹出窗口中，选择 **Cloud Shell 访问权限**。点击**启动 Cloud Shell**，并将 Oracle Cloud 所提供的命令复制到 Cloud Shell。

    ![启动Cloud-shell](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/启动Cloud-shell.jpg)

8. 在 Cloud Shell 中，粘贴该命令以便之后可以执行 KubeSphere 安装命令。

    ![cloud-shell-oke](/images/docs/v3.3/zh-cn/installing-on-kubernetes/hosted-kubernetes/install-kubesphere-on-oke/cloud-shell-oke.jpg)

    {{< notice warning >}}如果不在 Cloud Shell 中执行该命令，您无法继续进行以下操作。
    
    {{</ notice >}}

## 在 OKE 上安装 KubeSphere

1. 使用 kubectl 安装 KubeSphere。直接输入以下命令会默认执行 KubeSphere 的最小化安装。

    ```bash
    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/kubesphere-installer.yaml

    kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.3.1/cluster-configuration.yaml
    ```

2. 检查安装日志：

    ```bash
    kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
    ```

3. 安装完成后会输出以下信息：

    ```yaml
    #####################################################
    ###              Welcome to KubeSphere!           ###
    #####################################################
    
    Console: http://10.0.10.2:30880
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
    https://kubesphere.io             20xx-xx-xx xx:xx:xx
    ```

## 访问 KubeSphere 控制台

KubeSphere 安装完成后，您可以通过 `NodePort` 或 `LoadBalancer` 的模式访问 KubeSphere 的 Web 控制台。

1. 通过以下命令查看 KubeSphere 控制台的服务状态。

    ```bash
    kubectl get svc -n kubesphere-system
    ```

2. 输出如下，将类型修改为 `LoadBalancer`，从而暴露外部 IP 地址。

    ![console-nodeport](https://ap3.qingstor.com/kubesphere-website/docs/nodeport-console.jpg)

    {{< notice tip >}}
在上图中，`ks-console` 服务通过 `NodePort` 的类型暴露，即您可以通过 `NodeIP:NodePort` 的方式直接访问 Web 控制台（任意节点的公共 IP 都可用），值得注意的是需要在防火墙中提前开启端口 30880。
    {{</ notice >}}

3. 执行以下命令编辑服务配置。

    ```bash
    kubectl edit svc ks-console -o yaml -n kubesphere-system
    ```

4. 将 `type` 字段所对应的值修改为 `LoadBalancer`，然后保存配置。

    ![change-svc-type](https://ap3.qingstor.com/kubesphere-website/docs/change-service-type.png)

5. 再次执行以下命令，可以看到 IP 地址现已暴露（如下图）。

    ```bash
    kubectl get svc -n kubesphere-system
    ```

    ![console-service](https://ap3.qingstor.com/kubesphere-website/docs/console-service.png)

6. 访问此外部 IP 地址并通过默认的帐户和密码 (`admin/P@88w0rd`) 登录 Web 控制台。在**集群管理**页面，您可以看到集群概览。


## 启用可插拔组件（可选）

上面的示例演示了默认的最小安装过程，要在 KubeSphere 中启用其他组件，请参阅[启用可插拔组件](../../../pluggable-components/)。
