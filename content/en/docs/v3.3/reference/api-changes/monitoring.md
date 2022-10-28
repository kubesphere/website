---
title: "Monitoring"
keywords: 'Kubernetes, KubeSphere, API, Monitoring'
description: 'The API changes of the component **monitoring** in KubeSphere v3.3.1.'
linkTitle: "Monitoring"
weight: 17320
---

## API Version

The monitoring API version is bumped to `v1alpha3`.

## Time Format

The time format of query parameters must be in Unix timestamps (the number of seconds that has elapsed since the Unix epoch). Decimals are no longer allowed. The change affects the parameters `start`, `end` and `time`.

## Deprecated Metrics

In KubeSphere 3.3, the metrics on the left have been renamed to the ones on the right.

|V2.0|V3.3|
|---|---|
|workload_pod_cpu_usage | workload_cpu_usage|
|workload_pod_memory_usage| workload_memory_usage|
|workload_pod_memory_usage_wo_cache | workload_memory_usage_wo_cache|
|workload_pod_net_bytes_transmitted | workload_net_bytes_transmitted|
|workload_pod_net_bytes_received | workload_net_bytes_received|

The following metrics have been deprecated and removed.

|Deprecated Metrics|
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

New metrics are introduced in KubeSphere 3.3.

|New Metrics|
|---|
|kubesphere_workspace_count|
|kubesphere_user_count|
|kubesphere_cluser_count|
|kubesphere_app_template_count|

## Response Fields

In KubeSphere 3.3, the response fields `metrics_level`, `status` and `errorType` are removed.

In addition, the field name `resource_name` has been replaced with the specific resource type names. These types are `node`, `workspace`, `namespace`, `workload`, `pod`, `container` and `persistentvolumeclaim`. For example, instead of `resource_name: node1`, you will get `node: node1`. See the example response below:

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
