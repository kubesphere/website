---
title: "Logging"
keywords: "Kubernetes, Elasticsearch, KubeSphere, Logging, logs"
description: "FAQ"

linkTitle: "Logging"
weight: 6920
---

- [How to change the log store to external elasticsearch and shut down the internal elasticsearch](#how-to-change-the-log-store-to-external-elasticsearch-and-shut-down-the-internal-elasticsearch)
- [How to change the log store to elasticsearch with X-Pack Security enabled](#how-to-change-the-log-store-to-elasticsearch-with-x-pack-security-enabled)
- [How to modify log data retention days](#how-to-modify-log-data-retention-days)
- [Cannot find out logs from workloads on some nodes in Toolbox](#cannot-find-out-logs-from-workloads-on-some-nodes-in-toolbox)
- [The log view page in Toolbox gets stuck in loading](#the-log-view-page-in-toolbox-gets-stuck-in-loading)
- [Toolbox shows no log record today](#toolbox-shows-no-log-record-today)
- [Internal Server Error when viewing logs in Toolbox](#internal-server-error-when-viewing-logs-in-toolbox)
- [How to make KubeSphere only collect logs from specified workloads](#how-to-make-kubesphere-only-collect-logs-from-specified-workloads)

## How to change the log store to external elasticsearch and shut down the internal elasticsearch

If you are using KubeSphere internal elasticsearch and want to change it to your external alternate, follow the guide below. Otherwise, if you haven't enabled logging system yet, go to [Enable Logging](../../logging/) to setup external elasticsearch directly.

First, update KubeKey config.

```bash
kubectl edit cc -n kubesphere-system ks-installer
```

- Comment out `es.elasticsearchDataXXX`, `es.elasticsearchMasterXXX` and `status.logging` as below.

- Set `es.externalElasticsearchUrl` to the address of your elasticsearch and `es.externalElasticsearchPort` to its port number.

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

Second, rerun ks-installer.

```bash
kubectl rollout restart deploy -n kubesphere-system ks-installer
```

Finally, to remove the internal elasticsearch, run the following command. Please make sure you have backed up data in the internal elasticsearch.

```bash
helm uninstall -n kubesphere-logging-system elasticsearch-logging
```

## How to change the log store to elasticsearch with X-Pack Security enabled

Currently, KubeSphere doesn't support integration with elasticsearch having X-Pack Security enabled. This feature is coming soon.

## How to modify log data retention days

You need update KubeKey config and rerun ks-installer.

```shell
kubectl edit cc -n kubesphere-system ks-installer
```

- Comment out `status.logging` as below

- Set `es.logMaxAge` to the desired days (7 by default)

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
        ...
        logMaxAge: <7>
    ...
  status:
    ...
    # logging:
    #  enabledTime: 2020-08-10T02:05:13UTC
    #  status: enabled
    ...
  ```

Rerun ks-installer

```bash
kubectl rollout restart deploy -n kubesphere-system ks-installer
```

## Cannot find out logs from workloads on some nodes in Toolbox

If you adopt [Multi-node installation](../../../installing-on-linux/introduction/multioverview/) and are using symbolic links for docker root directory, make sure all nodes follow the exactly same symbolic links. Logging agents are deployed in DaemonSet onto nodes. Any discrepancy in container log paths may cause failure of collection on that node. 

To find out the docker root directory path on nodes, you can run the following command. Make sure the same value applies to all nodes.

```bash
docker info -f '{{.DockerRootDir}}'
```

## The log view page in Toolbox gets stuck in loading

If you observe log searching gets stuck in loading, please check the storage system you are using. For example, a malconfigured NFS storage system may cause this issue.  

## Toolbox shows no log record today

Please check if your log volume exceeds the storage capacity limit of elasticsearch. If so, increase elasticsearch disk volume.

## Internal Server Error when viewing logs in Toolbox

If you observe Internal Server Error in the Toolbox, there may be several reasons leading to this issue:

- Network partition
- Invalid elasticsearch host and port
- Elasticsearch health status is red

## How to make KubeSphere only collect logs from specified workloads

KubeSphere logging agent is powered by Fluent Bit. You need update Fluent Bit config to exclude certain workload logs. To modify Fluent Bit input config, run the following command:

```bash
kubectl edit input -n kubesphere-logging-system tail
```

Update the field `Input.Spec.Tail.ExcludePath`. For example, set the path to `/var/log/containers/*_kube*-system_*.log` to exclude any log from system components.

Read the project [Fluent Bit Operator](https://github.com/kubesphere/fluentbit-operator) for more information.
