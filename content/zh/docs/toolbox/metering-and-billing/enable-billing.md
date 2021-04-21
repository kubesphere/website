---
title: "启用计费"
keywords: "Kubernetes, KubeSphere, ConfigMap, 计费"
description: "启用 KubeSphere 中的计费功能，查看一段时间内您资源的消费情况。"
linkTitle: "启用计费"
weight: 15420
---

## 开启计费功能

默认计费(billing)功能是关闭的，可以通过以下步骤开启计费功能：

1. 在 ConfigMap `kubesphere-config` 中指定 `retentionDay` 和相关资源的价格信息

```shell
# kubectl edit cm kubesphere-config -n kubesphere-system

# kubectl get cm kubesphere-config -n kubesphere-system -oyaml
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

> 可以通过配置 `retentionDay` 和 `billing` 相关参数来开启计费功能。其中 `retentionDay` 参数需要与 Prometheus 中的 `retention` 参数保持一致。 而 `billing` 部分包含货币单位在内的价格信息：货币目前支持人民币 (CNY) 和美元 (USD) ，如果指定其他币种，则前端统一显示美元。举例来说，上面配置的含义是 CPU 每 core 每小时 1.5 美元，内存每 GB 每小时 5 美元， ingress 网络流量每 MB 每小时 1 美元， egress 网络流量每 MB 每小时 1 美元， PVC 每 GB 每小时 2.1 美元。


2. 重启 ks-apiserver

```shell
kubectl rollout restart deploy ks-apiserver -n kubesphere-system
```
