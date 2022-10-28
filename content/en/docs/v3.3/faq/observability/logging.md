---
title: "Observability — Logging FAQ"
keywords: "Kubernetes, Elasticsearch, KubeSphere, Logging, logs"
description: "Questions asked frequently about the logging functionality."
linkTitle: "Logging"
weight: 16310
---

This page contains some of the frequently asked questions about logging.

- [How to change the log store to the external Elasticsearch and shut down the internal Elasticsearch](#how-to-change-the-log-store-to-the-external-elasticsearch-and-shut-down-the-internal-elasticsearch)
- [How to change the log store to Elasticsearch with X-Pack Security enabled](#how-to-change-the-log-store-to-elasticsearch-with-x-pack-security-enabled)
- [How to set the data retention period of logs, events, auditing logs, and Istio logs](#how-to-set-the-data-retention-period-of-logs-events-auditing-logs-and-istio-logs)
- [I cannot find logs from workloads on some nodes using Toolbox](#i-cannot-find-logs-from-workloads-on-some-nodes-using-toolbox)
- [The log search page in Toolbox gets stuck when loading](#the-log-search-page-in-toolbox-gets-stuck-when-loading)
- [Toolbox shows no log record today](#toolbox-shows-no-log-record-today)
- [I see Internal Server Error when viewing logs in Toolbox](#i-see-internal-server-error-when-viewing-logs-in-toolbox)
- [How to make KubeSphere only collect logs from specified workloads](#how-to-make-kubesphere-only-collect-logs-from-specified-workloads)

## How to change the log store to the external Elasticsearch and shut down the internal Elasticsearch

If you are using the KubeSphere internal Elasticsearch and want to change it to your external alternate, follow the steps below. If you haven't enabled the logging system, refer to [KubeSphere Logging System](../../../pluggable-components/logging/) to setup your external Elasticsearch directly.

1. First, you need to update the KubeKey configuration. Execute the following command:

   ```bash
   kubectl edit cc -n kubesphere-system ks-installer
   ```

2. Comment out `es.elasticsearchDataXXX`, `es.elasticsearchMasterXXX` and `status.logging`, and set `es.externalElasticsearchUrl` to the address of your Elasticsearch and `es.externalElasticsearchPort` to its port number. Below is an example for your reference.

   ```yaml
   apiVersion: installer.kubesphere.io/v1alpha1
   kind: ClusterConfiguration
   metadata:
     name: ks-installer
     namespace: kubesphere-system
     ...
   spec:
     ...
     common:
       es:
         # elasticsearchDataReplicas: 1
         # elasticsearchDataVolumeSize: 20Gi
         # elasticsearchMasterReplicas: 1
         # elasticsearchMasterVolumeSize: 4Gi
         elkPrefix: logstash
         logMaxAge: 7
         externalElasticsearchUrl: <192.168.0.2>
         externalElasticsearchPort: <9200>
     ...
   status:
     ...
     # logging:
     #  enabledTime: 2020-08-10T02:05:13UTC
     #  status: enabled
     ...
   ```

3. Rerun `ks-installer`.

   ```bash
   kubectl rollout restart deploy -n kubesphere-system ks-installer
   ```

4. Remove the internal Elasticsearch by running the following command. Please make sure you have backed up data in the internal Elasticsearch.

   ```bash
   helm uninstall -n kubesphere-logging-system elasticsearch-logging
   ```
   
5. Change the configuration of Jaeger if Istio is enabled.

   ```yaml
   $ kubectl -n istio-system edit jaeger 
   ...
    options:
         es:
           index-prefix: logstash
           server-urls: http://elasticsearch-logging-data.kubesphere-logging-system.svc:9200  # Change it to the external address.
   ```

## How to change the log store to Elasticsearch with X-Pack Security enabled

Currently, KubeSphere doesn't support the integration of Elasticsearch with X-Pack Security enabled. This feature is coming soon.

## How to set the data retention period of logs, events, auditing logs, and Istio logs

Before KubeSphere 3.3, you can only set the retention period of logs, which is 7 days by default. In KubeSphere 3.3, apart from logs, you can also set the data retention period of events, auditing logs, and Istio logs.

You need to update the KubeKey configuration and rerun `ks-installer`.

1. Execute the following command:

   ```bash
   kubectl edit cc -n kubesphere-system ks-installer
   ```

2. In the YAML file, if you only want to change the retention period of logs, you can directly change the default value of `logMaxAge` to a desired one. If you want to set the retention period of events, auditing logs, and Istio logs, you need to add parameters `auditingMaxAge`, `eventMaxAge`, and `istioMaxAge` and set a value for them, respectively, as shown in the following example:
  

   ```yaml
   apiVersion: installer.kubesphere.io/v1alpha1
   kind: ClusterConfiguration
   metadata:
     name: ks-installer
     namespace: kubesphere-system
     ...
   spec:
     ...
     common:
       es:   # Storage backend for logging, events and auditing.
         ...
         logMaxAge: 7             # Log retention time in built-in Elasticsearch. It is 7 days by default.
         auditingMaxAge: 2
         eventMaxAge: 1
         istioMaxAge: 4
     ...
   ```

3. Rerun `ks-installer`.

   ```bash
   kubectl rollout restart deploy -n kubesphere-system ks-installer
   ```

## I cannot find logs from workloads on some nodes using Toolbox

If you deployed KubeSphere through [multi-node installation](../../../installing-on-linux/introduction/multioverview/) and are using symbolic links for the docker root directory, make sure all nodes follow the same symbolic links. Logging agents are deployed in DaemonSets onto nodes. Any discrepancy in container log paths may cause collection failures on that node.

To find out the docker root directory path on nodes, you can run the following command. Make sure the same value applies to all nodes.

```bash
docker info -f '{{.DockerRootDir}}'
```

## The log search page in Toolbox gets stuck when loading

If the log search page is stuck when loading, check the storage system you are using. For example, a misconfigured NFS storage system may cause this issue.

## Toolbox shows no log record today

Check if your log volume exceeds the storage limit of Elasticsearch. If so, you need to increase the Elasticsearch disk volume.

## I see Internal Server Error when viewing logs in Toolbox

There can be several reasons for this issue:

- Network partition
- Invalid Elasticsearch host and port
- The Elasticsearch health status is red

## How to make KubeSphere only collect logs from specified workloads

The KubeSphere logging agent is powered by Fluent Bit. You need to update the Fluent Bit configuration to exclude certain workload logs. To modify the Fluent Bit input configuration, run the following command:

```bash
kubectl edit input -n kubesphere-logging-system tail
```

Update the field `Input.Spec.Tail.ExcludePath`. For example, set the path to `/var/log/containers/*_kube*-system_*.log` to exclude any log from system components.

For more information, see [Fluent Operator](https://github.com/kubesphere/fluentbit-operator).
