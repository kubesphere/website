---
title: "监控系统"
keywords: 'Kubernetes, KubeSphere, API, 监控系统'
description: 'KubeSphere 3.3 中监控系统（服务组件）的 API 变更。'
linkTitle: "监控系统"
weight: 17320
---

## API 版本

监控系统 API 版本已提升至 `v1alpha3`。

## 时间格式

查询参数的时间格式必须是 Unix 时间戳（自 Unix Epoch 以来已经过去的秒数）。不再支持使用小数。该变更影响 `start`、`end` 和 `time` 参数。

## 已弃用的指标

在 KubeSphere 3.3 中，下表左侧的指标已重命名为右侧的指标。

|V2.0|V3.3|
|---|---|
|workload_pod_cpu_usage | workload_cpu_usage|
|workload_pod_memory_usage| workload_memory_usage|
|workload_pod_memory_usage_wo_cache | workload_memory_usage_wo_cache|
|workload_pod_net_bytes_transmitted | workload_net_bytes_transmitted|
|workload_pod_net_bytes_received | workload_net_bytes_received|

下列指标已被弃用并移除。

|已弃用的指标|
|---|
|cluster_workspace_count|
|cluster_account_count|
|cluster_devops_project_count|
|coredns_up_sum|
|coredns_cache_hits|
|coredns_cache_misses|
|coredns_dns_request_rate|
|coredns_dns_request_duration|
|coredns_dns_request_duration_quantile|
|coredns_dns_request_by_type_rate|
|coredns_dns_request_by_rcode_rate|
|coredns_panic_rate|
|coredns_proxy_request_rate|
|coredns_proxy_request_duration|
|coredns_proxy_request_duration_quantile|
|prometheus_up_sum|
|prometheus_tsdb_head_samples_appended_rate|

KubeSphere 3.3 中引入的新指标。

|新指标|
|---|
|kubesphere_workspace_count|
|kubesphere_user_count|
|kubesphere_cluser_count|
|kubesphere_app_template_count|

## 响应字段

在 KubeSphere 3.3 中，已移除响应字段 `metrics_level`、`status` 和 `errorType`。

另外，字段名称 `resource_name` 已替换为具体资源类型名称。这些类型是 `node`、`workspace`、`namespace`、`workload`、`pod`、`container` 和 `persistentvolumeclaim`。例如，您将获取 `node: node1`，而不是 `resource_name: node1`。请参见以下示例响应：

```json
{
    "results":[
        {
            "metric_name":"node_cpu_utilisation",
            "data":{
                "resultType":"vector",
                "result":[
                    {
                        "metric":{
                            "__name__":"node:node_cpu_utilisation:avg1m",
                            "node":"master"
                        },
                        "value":[
                            1588841175.979,
                            "0.04587499999997817"
                        ]
                    },
                    {
                        "metric":{
                            "__name__":"node:node_cpu_utilisation:avg1m",
                            "node":"node1"
                        },
                        "value":[
                            1588841175.979,
                            "0.06379166666670245"
                        ]
                    },
                    {
                        "metric":{
                            "__name__":"node:node_cpu_utilisation:avg1m",
                            "node":"node2"
                        },
                        "value":[
                            1588841175.979,
                            "0.19008333333367772"
                        ]
                    }
                ]
            }
        }
    ]
}

```
