---
title: "Enable Billing"
keywords: "Kubernetes, KubeSphere, ConfigMap, Billing"
description: "Enable the billing function in KubeSphere to view the billing data of your resources during a period."
linkTitle: "Enable Billing"
weight: 15420
version: "v3.3"
---

This tutorial demonstrates how to enable KubeSphere Billing to view the cost of different resources in your cluster. By default, the Billing function is disabled so you need to manually add the price information in a ConfigMap.

Perform the following steps to enable KubeSphere Billing.

1. Run the following command to edit the ConfigMap `kubesphere-config`:

   ```bash
   kubectl edit cm kubesphere-config -n kubesphere-system
   ```

2. Add the retention day and price information under `metering` in the ConfigMap. The following is an example for your reference:

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

   The following table describes the parameters.

   <table>
     <tbody>
       <tr>
         <th>Parameter</th>
         <th>Description</th>
       </tr>
       <tr>
         <td><code>retentionDay</code></td>
         <td><code>retentionDay</code> determines the date range displayed on the <b>Metering and Billing</b> page for users. The value of this parameter must be the same as the value of <code>retention</code> in <a href='../../../faq/observability/monitoring/#how-to-change-the-monitoring-data-retention-period'>Prometheus</a>.</td>
       </tr>
       <tr>
         <td><code>currencyUnit</code></td>
         <td>The currency that is displayed on the <b>Metering and Billing</b> page. Currently allowed values are <code>CNY</code> (Renminbi) and <code>USD</code> (US dollars). If you specify other currencies, the console will display cost in USD by default.</td>
       </tr>
       <tr>
         <td><code>cpuCorePerHour</code></td>
         <td>The unit price of CPU per core/hour.</td>
       </tr><tr>
         <td><code>memPerGigabytesPerHour</code></td>
         <td>The unit price of memory per GB/hour.</td>
       </tr><tr>
         <td><code>ingressNetworkTrafficPerMegabytesPerHour</code></td>
         <td>The unit price of ingress traffic per MB/hour.</td>
       </tr><tr>
         <td><code>egressNetworkTrafficPerMegabytesPerHour</code></td>
         <td>The unit price of egress traffic per MB/hour.</td>
       </tr><tr>
         <td><code>pvcPerGigabytesPerHour</code></td>
         <td>The unit price of PVC per GB/hour. Note that KubeSphere calculates the total cost of volumes based on the storage capacity PVCs request regardless of the actual storage in use.</td>
       </tr>
     </tbody>
   </table>

3. Run the following command to restart `ks-apiserver`:

   ```bash
   kubectl rollout restart deploy ks-apiserver -n kubesphere-system
   ```

4. On the **Metering and Billing** page, you can see the cost information of resources.