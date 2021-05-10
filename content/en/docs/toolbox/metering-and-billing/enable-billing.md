---
title: "Enable Billing"
keywords: "Kubernetes, KubeSphere, ConfigMap, Billing"
description: "Enable the billing function in KubeSphere to view the billing data of your resources during a period."
linkTitle: "Enable Billing"
weight: 15420
---

This tutorial demonstrates how to enable KubeSphere Billing to view the cost of different resources in your cluster. By default, the Billing function is disabled so you need to manually add the price information in a ConfigMap.

Perform the steps below to enable KubeSphere Billing.

1. Edit the ConfigMap `kubesphere-config` by running the following command:

   ```bash
   kubectl edit cm kubesphere-config -n kubesphere-system
   ```

2. Add the retention day and price information under `metering` in the ConfigMap.

   | Parameter                                  | Description                                                  |
   | ------------------------------------------ | ------------------------------------------------------------ |
   | `retentionDay`                             | `retentionDay` determines the date range displayed on the **Metering and Billing** page for users. The value of this parameter must be the same as the value of `retention` in [Prometheus](../../../faq/observability/monitoring/#how-to-change-the-monitoring-data-retention-period). |
   | `currencyUnit`                             | The currency that displays on the **Metering and Billing** page. Currently allowed values are `CNY` (Renminbi) and `USD` (US dollars). If you specify other currencies, the console will display cost in USD by default. |
   | `cpuPerCorePerHour`                        | The unit price of CPU per core/hour.                         |
   | `memPerGigabytesPerHour`                   | The unit price of memory per GB/hour.                        |
   | `ingressNetworkTrafficPerMegabytesPerHour` | The unit price of ingress traffic per MB/hour.               |
   | `egressNetworkTrafficPerMegabytesPerHour`  | The unit price of egress traffic per MB/hour.                |
   | `pvcPerGigabytesPerHour`                   | The unit price of PVC per GB/hour. Note that KubeSphere calculates the total cost of volumes based on the storage capacity PVCs request regardless of the actual storage in use. |

   The following is an example for your reference:

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

3. After you set the price information, restart `ks-apiserver`.

   ```bash
   kubectl rollout restart deploy ks-apiserver -n kubesphere-system
   ```

4. On the **Metering and Billing** page, you can see the cost information of resources.

   ![billing-dashboard](/images/docs/toolbox/metering-and-billing/enable-billing/billing-dashboard.png)