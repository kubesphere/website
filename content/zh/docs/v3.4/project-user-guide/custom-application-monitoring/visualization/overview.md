---
title: "概述"
keywords: '监控, Prometheus, Prometheus Operator'
description: '了解创建监控仪表板的一般步骤及其布局。'
linkTitle: "概述"
weight: 10815
---

本节介绍监控面板功能。您将会学习如何在 KubeSphere 中为您的自定义应用实现指标数据的可视化。如果您不知道如何将应用指标集成至 KubeSphere 的监控系统，请先参阅[介绍](../../introduction/)。

## 创建监控面板

您可以在项目的**监控告警**下的**自定义监控**页面为应用指标创建监控面板。共有三种方式可创建监控面板：使用内置模板创建、使用空白模板进行自定义或者使用 YAML 文件创建。

内置模板包括 MySQL、Elasticsearch、Redis等。这些模板仅供演示使用，并会根据 KubeSphere 新版本的发布同步更新。此外，您还可以创建自定义监控面板。

KubeSphere 自定义监控面板可以视作为一个 YAML 配置文件。数据模型主要基于 [Grafana](https://github.com/grafana/grafana)（一个用于监控和可观测性的开源工具）创建，您可以在 [kubesphere/monitoring-dashboard](https://github.com/kubesphere/monitoring-dashboard) 中找到 KubeSphere 监控面板数据模型的设计。该配置文件便捷，可进行分享，欢迎您通过  [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery) 对 KubeSphere 社区贡献面板模板。

### 使用内置模板

KubeSphere 为 MySQL、Elasticsearch 和 Redis 提供内置模板方便您快速创建监控面板。如果您想使用内置模板，请选择一种并点击**下一步**。

### 使用空白模板

若要使用空白模板，请直接点击**下一步**。

### 使用 YAML 文件

打开右上角的**编辑 YAML** 并粘贴您的面板 YAML 文件。

## 面板布局

监控面板包括四个部分，全局设置位于页面顶部，最左侧栏以文本图表的形式显示当前指标的数值，中间栏包括多个图表，显示指标在一段时间内的变化，最右侧栏显示图表中的详细信息。

### 顶部栏

在顶部栏中，您可以配置以下设置：名称、主题、时间范围和刷新间隔。

### 文本图表栏

您可以在最左侧栏中添加新的文本图表。

### 图表显示栏

您可以在中间栏中查看图表。

### 详情栏

您可以在最右侧栏中查看图表详情，包括一段时间内指标的 **max**、**min**、**avg** 和 **last** 等数值。

## 编辑监控面板

您可以在右上角点击**编辑模板**以修改当前模板。

### 添加图表

若要添加文本图表，点击左侧栏中的 ➕。若要在中间栏添加图表，点击右下角的**添加监控项**。

### 添加监控组

若要将监控项分组，您可以点击 <img src="/images/docs/v3.3/zh-cn/project-user-guide/custom-application-monitoring/visualization/overview/six-dots.png" width="20px" alt="icon" /> 将右侧的项目拖放至目标组。若要添加新的分组，点击**添加监控组**。如果您想修改监控组的位置，请将鼠标悬停至监控组上并点击右侧的 <img src="/images/docs/v3.3/zh-cn/project-user-guide/custom-application-monitoring/visualization/overview/up-arrow.png" width="20px" align="center" /> 或 <img src="/images/docs/v3.3/zh-cn/project-user-guide/custom-application-monitoring/visualization/overview/down-arrow.png" width="20px" align="center" />。

{{< notice note >}}

监控组在右侧所显示的位置和中间栏图表的位置一致。换言之，如果您修改监控组在右侧的顺序，其所对应的图表位置也会随之变化。

{{</ notice >}} 

## 面板模板

您可以在 [Monitoring Dashboards Gallery](https://github.com/kubesphere/monitoring-dashboard/tree/master/contrib/gallery) 中找到并分享面板模板，KubeSphere 社区用户可以在这里贡献他们模板设计。