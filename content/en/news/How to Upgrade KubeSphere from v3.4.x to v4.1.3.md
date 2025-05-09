---
title: 'Upgrading KubeSphere from v3.4.x to v4.1.3: Everything You Need to Know'
tag: 'Product News'
keyword: 'open source, Kubernetes, KubeSphere'
description: 'This guide provides comprehensive steps for upgrading from KubeSphere v3.4.x to v4.x, helping you complete the upgrade process smoothly.'
createTime: '2025-04-19'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/upgrade%20kubesphere%20from%203.4.x-4.1.3.png'
---

This guide provides comprehensive steps for upgrading from KubeSphere v3.4.x to v4.x, helping you complete the upgrade process smoothly. Note: If your KubeSphere version is earlier than v3.4.x, you must first upgrade to v3.4.x before proceeding.

The upgrade process consists of the following three major steps. Please execute them in order:

1. Upgrade the host cluster and migrate extension component data.
2. Upgrade the member clusters and migrate extension component data.
3. Upgrade the gateway.

## Download the Upgrade Script

Download the upgrade script in both the host and member cluster environments:

```bash
curl -LO https://github.com/kubesphere/ks-installer/archive/refs/tags/v4.1.3.tar.gz
tar -xzvf v4.1.3.tar.gz
```

## Modify the Upgrade Configuration File


Adjust the upgrade configuration file in both the host and all member clusters. The config file path is `scripts/ks-core-values.yaml.` The `upgrade`section contains upgrade-related settings. Before upgrading, you must confirm which components and configurations are to be upgraded. Use` upgrade.jobs.config.<name>.enabled `to control whether to upgrade a specific component.

Example configuration:

```
upgrade:
  enabled: true
  image:
    registry: ""
    repository: kubesphere/ks-upgrade
    tag: "v4.1.3"
    pullPolicy: IfNotPresent
  persistenceVolume:
    name: ks-upgrade
    storageClassName: ""
    accessMode: ReadWriteOnce
    size: 5Gi
  config:
    storage:
      local:
        path: /tmp/ks-upgrade
    validator:
      ksVersion:
        enabled: true
      extensionsMuseum:
        enabled: true
        namespace: kubesphere-system
        name: extensions-museum
        syncInterval: 0
        watchTimeout: 30m
    jobs:
      network:
        enabled: true
        priority: 100
        extensionRef:
          name: "network"
          version: "1.1.0"
        dynamicOptions: {
          "rerun": "false"
        }
      gateway:
        enabled: true
        priority: 90
        extensionRef:
          name: "gateway"
          version: "1.0.5"
```



For more configuration details, refer to the [Extension Component Upgrade Configuration Guide](https://github.com/kubesphere/ks-upgrade/tree/release-4.1/docs).

## Cluster Status Check

Before upgrading the clusters, run the following script to check cluster status and ensure upgrade readiness:

```bash
bash pre-check.sh
```

## Upgrade the Host Cluster

Run the following command to upgrade the host cluster, install extension components, and migrate data:

```
bash upgrade.sh host | tee host-upgrade.log
```
You can open a new terminal window and run the following command to monitor Pod status in the `kubesphere-system` namespace in real-time:


```bash
watch kubectl get pod -n kubesphere-system
```

## Upgrade the Member Cluster

Run the following command to upgrade the member cluster, install the extension component agent, and migrate data:


```
# Optional: Specify image registry
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks
# Optional: Specify extension component image registry
# export EXTENSION_IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks
bash upgrade.sh member | tee member-upgrade.log
```

Monitor the Pod status similarly in the `kubesphere-system` namespace:

```bash
watch kubectl get pod -n kubesphere-system
```

After the successful upgrade of the member cluster, execute the following command on the host cluster to remove the taint from the member cluster. This allows the extension component agent to be scheduled onto the member cluster.

```bash
kubectl get clusters.cluster.kubesphere.io <MEMBER_CLUSTER_NAME> -o json | jq 'del(.status.conditions[] | select(.type=="Schedulable"))' | kubectl apply -f -
```


## Upgrade the Gateway

Upgrading the gateway will cause the Nginx Ingress Controller to restart, which may lead to service interruptions dependent on the gateway. It is recommended to perform the upgrade during off-peak business hours.

Before starting the upgrade, check the deployed gateway instances and their status in the cluster using the following command:

```bash
helm -n kubesphere-controls-system list -a
```

To upgrade the gateway individually, use the following command:

```
# Optional: Specify image registry
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks
bash upgrade.sh gateway kubesphere-router-<NAMESPACE> | tee gateway-upgrade.log
```

Alternatively, to upgrade all gateways at once, use the following command:

```
# Optional: Specify image registry
# export IMAGE_REGISTRY=swr.cn-southwest-2.myhuaweicloud.com/ks
bash upgrade.sh gateway all | tee gateway-upgrade.log
```


After the gateway upgrade is complete, check the deployment status of the gateway using the following command:

```bash
helm -n kubesphere-controls-system list -a
```

## Completing the Upgrade

Once the upgrade is complete, ensure that all services are running normally and check the system’s health. You can verify this using the following command:

```bash
for ns in $(kubectl get namespaces -l kubesphere.io/workspace=system-workspace -o jsonpath='{.items[*].metadata.name}'); do
    kubectl get pods -n $ns --no-headers --ignore-not-found | grep -vE 'Running|Completed'
done
```

Ensure that all Pod statuses are `Running`. If any issues arise, check the relevant container logs for troubleshooting.

By following the smooth upgrade steps provided in this guide, you should be able to successfully upgrade the platform from v3.4.x to v4.x. If you encounter any difficulties or have further needs during the upgrade process, the KubeSphere community welcomes your participation and feedback. Through continuous optimization and updates, we are committed to providing a more stable and efficient cloud-native platform for all users.

Thank you for choosing KubeSphere. We look forward to seeing you have a better experience and achieve greater success with the new version of the platform!


## Special Note: Product Lifecycle Management Policy

During the upgrade, it is recommended to review the [KubeSphere Product Lifecycle Management Policy](https://kubesphere.io/zh/news/kubesphere-product-lifecycle-policy/).This policy provides the product version lifecycle termination plan, ensuring that the version you are using always meets the latest market demands and technical standards. Understanding the support and update strategy for each version will help you plan system updates and version migration in a timely manner, avoiding potential risks associated with using versions that are no longer supported.