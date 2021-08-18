---
title: "审计日志查询"
keywords: "Kubernetes, KubeSphere, 审计, 日志, 查询"
description: "了解如何快速执行审计日志查询，追踪集群的最新审计信息。"
linkTitle: "审计日志查询"
weight: 15330
---

KubeSphere 支持租户隔离的审计日志查询。本教程演示了如何使用查询功能，包括界面、搜索参数和详情页面。

## 准备工作

您需要启用 [KubeSphere 审计日志](../../../pluggable-components/auditing-logs/)。

## 进入查询界面

1. 所有用户都可以使用该查询功能。使用任意帐户登录控制台，在右下角的**工具箱**图标上悬停，然后在弹出菜单中选择**操作审计**。

   {{< notice note >}} 

任意帐户都有权限查询审计日志，但每个帐户能查看的日志有区别。

- 如果一个帐户有权限查看项目中的资源，该帐户便可以查看此项目中发生的审计日志，例如在项目中创建工作负载。
- 如果一个帐户有权限在企业空间中列出项目，该帐户便可以查看此企业空间（而非项目）中发生的审计日志，例如在企业空间中创建项目。
- 如果一个帐户有权限在集群中列出项目，该帐户便可以查看此集群（而非企业空间和项目）中发生的审计日志，例如在集群中创建企业空间。

{{</ notice >}} 

2. 在弹出窗口中，您可以查看最近 12 小时内审计日志总数的趋势。

   ![操作审计](/images/docs/zh-cn/toolbox/auditing/auditing-logs/操作审计.png)

3. **操作审计**控制台支持以下查询参数：

   <table>
     <tbody>
       <tr>
         <th width="100">参数</th>
         <th>描述</th>
       </tr>
       <tr>
         <td>集群</td>
         <td>发生操作的集群。如果开启了<a href='../../../multicluster-management/'>多集群功能</a>，则会启用该参数。</td>
       </tr><tr>
         <td>项目</td>
         <td>发生操作的项目。支持精确匹配和模糊匹配。</td>
       </tr><tr>
         <td>企业空间</td>
         <td>发生操作的企业空间。支持精确匹配和模糊匹配。</td>
       </tr><tr>
         <td>资源类型</td>
         <td>与请求相关联的资源类型。支持模糊匹配。</td>
       </tr><tr>
         <td>资源名称</td>
         <td>与请求相关联的资源名称。支持模糊匹配。</td>
       </tr><tr>
         <td>操作行为</td>
         <td>与请求相关联的 Kubernetes 操作行为。对于非资源请求，该参数为小写 HTTP 方式。支持精确匹配。</td>
       </tr><tr>
         <td>状态码</td>
         <td>HTTP 响应码。支持精确匹配。</td>
       </tr><tr>
         <td>操作帐户</td>
         <td>调用该请求的用户。支持精确匹配和模糊匹配。</td>
       </tr><tr>
         <td>来源 IP</td>
         <td>该请求源自的 IP 地址和中间代理。支持模糊匹配。</td>
       </tr>
       <tr>
         <td>时间范围</td>
         <td>该请求到达 Apiserver 的时间。</td>
       </tr>
     </tbody>
   </table>
   
   {{< notice note >}} 

- 模糊匹配不区分大小写，并且根据 ElasticSearch 分段规则，通过单词或词组的前半部分来检索完整术语。
- KubeSphere 默认存储最近七天的日志。您可以在 `elasticsearch-logging-curator` ConfigMap 中修改保留期限。

{{</ notice >}} 

## 输入查询参数

1. 选择一个过滤器，输入您想搜索的关键字。例如，查询包含 `services` 创建信息的审计日志，如下方截图所示：

   ![过滤审计日志](/images/docs/zh-cn/toolbox/auditing/auditing-logs/过滤审计日志.png)

2. 点击列表中的任一结果，您便可以查看审计日志的详细信息。

   ![审计日志详情](/images/docs/zh-cn/toolbox/auditing/auditing-logs/审计日志详情.png)
