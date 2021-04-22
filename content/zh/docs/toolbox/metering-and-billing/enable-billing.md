---
title: "启用计费"
keywords: "Kubernetes, KubeSphere, ConfigMap, 计费"
description: "在 KubeSphere 中启用计费功能，查看一段时期内资源的计费数据。"
linkTitle: "启用计费"
weight: 15420
---

本教程介绍如何启用 KubeSphere 的计费功能，以查看集群中不同资源的消费情况。计费功能默认不启用，因此您需要在 ConfigMap 中手动添加价格信息。

## 启用计费

1. 运行以下命令编辑 ConfigMap `kubesphere-config`：

   ```bash
   kubectl edit cm kubesphere-config -n kubesphere-system
   ```

2. 在该 ConfigMap 的 `metering` 下添加保留期限和价格信息。

   | 参数                                       | 描述                                                         |
   | ------------------------------------------ | ------------------------------------------------------------ |
   | `retentionDay`                             | `retentionDay` 决定用户的**资源消费统计**页面显示的日期范围。该参数的值必须与 [Prometheus](../../../faq/observability/monitoring/#how-to-change-the-monitoring-data-retention-period) 中 `retention` 的值相同。 |
   | `currencyUnit`                             | **资源消费统计**页面显示的货币单位。目前可用的单位有 `CNY`（人民币）和 `USD`（美元）。若指定其他货币，控制台将默认以美元为单位显示消费情况。 |
   | `cpuPerCorePerHour`                        | 每内核/小时的 CPU 单价。                                     |
   | `memPerGigabytesPerHour`                   | 每 GB/小时的内存单价。                                       |
   | `ingressNetworkTrafficPerMegabytesPerHour` | 每 MB/小时的应用路由（Ingress）网络单价。                    |
   | `egressNetworkTrafficPerMegabytesPerHour`  | 每 MB/小时的 egress 网络单价。                               |
   | `pvcPerGigabytesPerHour`                   | 每 GB/小时的 PVC 单价。请注意，无论实际使用的存储是多少，KubeSphere 都会根据 PVC 请求的存储容量来计算存储卷的总消费情况。 |

   以下示例供您参考：

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

3. 价格信息设置完成后，重启 `ks-apiserver`。

   ```bash
   kubectl rollout restart deploy ks-apiserver -n kubesphere-system
   ```

4. 在**资源消费统计**页面，您可以看到资源的消费信息。

   ![metering-and-billing](/images/docs/zh-cn/toolbox/metering-and-billing/enable-billing/metering-and-billing.png)