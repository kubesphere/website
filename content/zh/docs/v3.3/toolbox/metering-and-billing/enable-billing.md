---
title: "启用计费"
keywords: "Kubernetes, KubeSphere, ConfigMap, 计费"
description: "在 KubeSphere 中启用计费功能，查看一段时期内资源的计费数据。"
linkTitle: "启用计费"
weight: 15420
version: "v3.3"
---

本教程介绍如何启用 KubeSphere 的计费功能，以查看集群中不同资源的消费情况。计费功能默认不启用，因此您需要在 ConfigMap 中手动添加价格信息。

请按照以下步骤启用 KubeSphere 的计费功能。

1. 执行以下命令编辑 ConfigMap `kubesphere-config`：

   ```bash
   kubectl edit cm kubesphere-config -n kubesphere-system
   ```

2. 在该 ConfigMap 的 `metering` 下添加保留期限和价格信息。以下为示例配置：

   ```yaml
   $ kubectl get cm kubesphere-config -n kubesphere-system -oyaml
   ...
       alerting:
         prometheusEndpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
         thanosRulerEndpoint: http://thanos-ruler-operated.kubesphere-monitoring-system.svc:10902
         thanosRuleResourceLabels: thanosruler=thanos-ruler,role=thanos-alerting-rules
       ...
       metering:
         retentionDay: 7d
         billing:
           priceInfo:
             currencyUnit: "USD"
             cpuPerCorePerHour: 1.5
             memPerGigabytesPerHour: 5
             ingressNetworkTrafficPerMegabytesPerHour: 1
             egressNetworkTrafficPerMegabytesPerHour: 1
             pvcPerGigabytesPerHour: 2.1
   kind: ConfigMap
   ...
   ```

   相关参数描述如下：

   <table>
     <tbody>
       <tr>
         <th>参数</th>
         <th>描述</th>
       </tr>
       <tr>
         <td><code>retentionDay</code></td>
         <td><code>retentionDay</code> 决定用户的<b>资源消费统计</b>页面显示的日期范围。该参数的值必须与 <a href='../../../faq/observability/monitoring/#如何更改监控数据保留期限'>Prometheus</a> 中 <code>retention</code> 的值相同.</td>
       </tr>
       <tr>
         <td><code>currencyUnit</code></td>
         <td><b>资源消费统计</b>页面显示的货币单位。目前可用的单位有 <code>CNY</code>（人民币）和 <code>USD</code>（美元）。若指定其他货币，控制台将默认以美元为单位显示消费情况。</td>
       </tr>
       <tr>
         <td><code>cpuCorePerHour</code></td>
         <td>每核/小时的 CPU 单价。</td>
       </tr><tr>
         <td><code>memPerGigabytesPerHour</code></td>
         <td>每 GB/小时的内存单价。</td>
       </tr><tr>
         <td><code>ingressNetworkTrafficPerMegabytesPerHour</code></td>
         <td>每 MB/小时的入站流量单价。</td>
       </tr><tr>
         <td><code>egressNetworkTrafficPerMegabytesPerHour</code></td>
         <td>每 MB/小时的出站流量单价。</td>
       </tr><tr>
         <td><code>pvcPerGigabytesPerHour</code></td>
         <td>每 GB/小时的 PVC 单价。请注意，无论实际使用的存储是多少，KubeSphere 都会根据 PVC 请求的存储容量来计算存储卷的总消费情况。</td>
       </tr>
     </tbody>
   </table>
3. 执行以下命令重启 `ks-apiserver`。

   ```bash
   kubectl rollout restart deploy ks-apiserver -n kubesphere-system
   ```

4. 在**资源消费统计**页面，您可以看到资源的消费信息。
