---
title: "监控示例 Web 应用程序"
keywords: '监控, prometheus, prometheus operator'
description: '使用 Helm Chart 来部署示例 Web 应用程序并为该应用程序创建监控面板。'
linkTitle: "监控示例 Web 应用程序"
weight: 10813
---

本教程演示如何监控示例 Web 应用程序。该应用程序在代码中已接入 Prometheus Go 客户端，因此可以直接暴露指标，无需使用导出器 (Exporter)。

## 准备工作

- 请确保[已启用 OpenPitrix 系统](../../../../pluggable-components/app-store/)。
- 您需要创建一个企业空间、一个项目和一个用户。有关更多信息，请参见[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。该用户需要是平台普通用户，邀请至该企业空间中并赋予 `self-provisioner` 角色。故请创建一个 `workspace-self-provisioner` 用户，赋予 `self-provisioner` 角色，并使用该用户创建一个项目（例如 `test`）。在本教程中，您以 `workspace-self-provisioner` 身份登录控制台，并在 `demo-workspace` 企业空间的 `test` 项目中进行操作。

- 了解 Helm Chart 和 [PromQL](https://prometheus.io/docs/prometheus/latest/querying/examples/)。

## 动手实验

### 步骤 1：准备示例 Web 应用程序的镜像

示例 Web 应用程序暴露一个名为 `myapp_processed_ops_total` 的用户定义指标。这是一个计数器型指标，计算已处理操作的数量。计数器每 2 秒自动增加 1。

该示例应用程序通过 Endpoint `http://localhost:2112/metrics` 暴露应用具体指标。

在本教程中，您可以使用现成的镜像 `kubespheredev/promethues-example-app`。源代码请见 [kubesphere/prometheus-example-app](https://github.com/kubesphere/prometheus-example-app)。您也可以按照 Prometheus 官方文档 [Instrument A Go Application For Prometheus](https://prometheus.io/docs/guides/go-application/) 进行操作。

### 步骤 2：将应用程序打包成 Helm Chart

将部署、服务和 ServiceMonitor 的 YAML 模板打包成一个 Helm Chart 用来复用。在部署和服务模板中，您可以为指标 Endpoint 定义示例 Web 容器和端口。ServiceMonitor 是由 Prometheus Operator 定义和使用的自定义资源，它连接您的应用程序和 KubeSphere 监控引擎 (Prometheus)，以便监控引擎知道抓取指标的位置和方式。KubeSphere 在未来发布版本中将提供易于操作的图形用户界面。

源代码请见 [kubesphere/prometheus-example-app](https://github.com/kubesphere/prometheus-example-app) 的 `helm` 文件夹。Helm Chart 包已准备完成并命名为 `prometheus-example-app-0.1.0.tgz`。请下载该 .tgz 文件，用于下面的步骤。

### 步骤 3：上传 Helm Chart

1. 在 `demo-workspace` 企业空间的**概览**页面上转到**应用管理**下的**应用模板**。

2. 点击**创建**，上传 `prometheus-example-app-0.1.0.tgz`。

### 步骤 4：部署示例 Web 应用程序

您需要将示例 Web 应用程序部署至 `test` 项目，可以简单运行一个测试部署用于演示。

1. 点击 `prometheus-example-app`。

2. 展开菜单，点击**安装**。

3. 请确保将示例 Web 应用程序部署至 `test` 项目，点击**下一步**。

4. 请确保将 `serviceMonitor.enabled` 设置为 `true`，点击**安装**。

5. 在 `test` 项目的**工作负载**下，稍等片刻待示例 Web 应用程序启动并运行。

### 步骤 5：创建监控面板

该部分演示如何从零创建监控面板。您需要创建一个显示已处理操作总数的文本图表和一个显示操作率的折线图。

1. 转到**自定义监控**，点击**创建**。

2. 设置名称（例如 `sample-web`），点击**下一步**。

3. 在左上角输入标题（例如 `示例 Web 概览`）。

4. 点击左列的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/custom-application-monitoring/examples/monitor-sample-web-app/plus-icon.png" height="16px" width="20px" alt="icon" />，创建文本图表。

5. 在**监控指标**字段输入 PromQL 表达式 `myapp_processed_ops_total`，并设置图表名称（例如 `操作数`）。点击右下角的 **√** 继续。

6. 点击**添加监控项**，选择**折线图**，然后点击**确认**。

7. 在**监控指标**中输入 PromQL 表达式 `irate(myapp_processed_ops_total[3m])` 并将图表命名为 `操作率`。要改进外观，可以将**图例名称**设置为 `{{service}}`。它会用图例标签 `service` 的值命名每一段折线。然后将**精确位**设置为 `2`，以便将结果保留两位小数。点击右下角的 **√** 继续。

8. 点击**保存模板**进行保存。
