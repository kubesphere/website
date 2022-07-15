---
title: "容器组弹性伸缩"
keywords: "容器组, 弹性伸缩, 弹性伸缩程序"
description: "如何在 KubeSphere 上配置容器组弹性伸缩."
weight: 10290

---

本文档描述了如何在 KubeSphere 上配置容器组弹性伸缩 (HPA)。

HPA 功能会自动调整容器组的数量，将容器组的平均资源使用（CPU 和内存）保持在预设值附近。有关 HPA 功能的详细情况，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/tasks/run-application/horizontal-pod-autoscale/)。

本文档使用基于 CPU 使用率的 HPA 作为示例，基于内存使用量的 HPA 操作与其相似。

## 准备工作

- 您需要[启用 Metrics Server](../../../pluggable-components/metrics-server/)。
- 您需要创建一个企业空间、一个项目以及一个用户（例如，`project-regular`）。`project-regular` 必须被邀请至此项目中，并被赋予 `operator` 角色。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../quick-start/create-workspace-and-project/)。

## 创建服务

1. 以 `project-regular` 身份登录 KubeSphere 的 Web 控制台，然后访问您的项目。 

2. 在左侧导航栏中选择**应用负载**下的**服务**，然后点击右侧的**创建**。

3. 在**创建服务**对话框中，点击**无状态服务**。

4. 设置服务名称（例如，`hpa`），然后点击**下一步**。

5. 点击**添加容器**，将**镜像**设置为 `mirrorgooglecontainers/hpa-example` 并点击**使用默认端口**。

6. 为每个容器设置 CPU 请求（例如，0.15 core），点击 **√**，然后点击**下一步**。

   {{< notice note >}}

   * 若要使用基于 CPU 使用率的 HPA，就必须为每个容器设置 CPU 请求，即为每个容器预留的最低 CPU 资源（有关详细信息，请参见 [Kubernetes 官方文档](https://kubernetes.io/zh/docs/tasks/run-application/horizontal-pod-autoscale/)）。HPA 功能会将容器组平均 CPU 使用率与容器组平均 CPU 请求的目标比率进行比较。
   * 若要使用基于内存使用量的 HPA，则不需要配置内存请求。

   {{</ notice >}}

7. 点击**存储设置**选项卡上的**下一步**，然后点击**高级设置**选项卡上的**创建**。

## 配置 HPA

1. 左侧导航栏上选择**工作负载**中的**部署**，然后点击右侧的 HPA 部署（例如，hpa-v1）。

2. 点击**更多操作**，从下拉菜单中选择**编辑自动扩缩**。

3. 在**自动伸缩**对话框中，配置 HPA 参数，然后点击**确定**。

   * **目标 CPU 用量（%）**：容器组平均 CPU 请求的目标比率。
   * **目标内存用量（MiB）**：以 MiB 为单位的容器组平均内存目标使用量。
   * **最小副本数**：容器组的最小数量。
   * **最大副本数**：容器组的最大数量。

   在示例中，**目标 CPU 用量（%）**设置为 `60`，**最小副本数**设置为 `1`，**最大副本数**设置为 `10`。

   {{< notice note >}}

   当容器组的数量达到最大值时，请确保集群可以为所有容器组提供足够的资源。否则，一些容器组将创建失败。

   {{</ notice >}}

## 验证 HPA

本节使用将请求发送到 HPA 服务的部署，以验证 HPA 是否会自动调整容器组的数量来满足资源使用目标。

### 创建负载生成器部署

1. 在左侧导航栏中选择**应用负载**中的**工作负载**，然后点击右侧的**创建**。

2. 在**创建部署**对话框中，设置部署名称（例如，`load-generator`），然后点击**下一步**。

3. 点击**添加容器**，将**镜像**设置为 `busybox`。

4. 在对话框中向下滚动，选择**启动命令**，然后将**命令**设置为 `sh,-c`，将**参数**设置为 `while true; do wget -q -O- http://<Target Service>.<Target project>.svc.cluster.local; done`（例如，`while true; do wget -q -O- http://hpa.demo-project.svc.cluster.local; done`）。

5. 点击 **√**，然后点击**下一步**。

6. 点击**存储设置**选项卡上的**下一步**，然后点击**高级设置**选项卡上的**创建**。

### 查看 HPA 部署状态

1. 负载生成器部署创建好后，在左侧导航栏中选择**应用负载**下的**工作负载**，然后点击右侧的 HPA 部署（例如，hpa-v1）。页面中显示的容器组的数量会自动增加以满足资源使用目标。

2. 在左侧导航栏选择**应用负载**中的**工作负载**，点击负载生成器部署（例如，load-generator-v1）右侧的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/horizontal-pod-autoscaling/three-dots.png" width="20px" alt="icon" />，从下拉菜单中选择**删除**。负载生成器部署删除后，再次检查 HPA 部署的状态。容器组的数量会减少到最小值。

{{< notice note >}}

系统可能需要一些时间来调整容器组的数量以及收集数据。

{{</ notice >}}

## 编辑 HPA 配置

您可以重复[配置 HPA](#配置-hpa) 中的步骤来编辑 HPA 配置。

## 取消 HPA

1. 在左侧导航栏选择**应用负载**中的**工作负载**，点击右侧的 HPA 部署（例如，hpa-v1）。

2. 点击**自动伸缩**右侧的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/application-workloads/horizontal-pod-autoscaling/three-dots.png" width="20px" alt="icon" />，从下拉菜单中选择**取消**。

