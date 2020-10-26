---
title: "Air-Gapped Upgrade with KubeKey"
keywords: "Air-Gapped, kubernetes, upgrade, kubesphere, v3.0.0"
description: "Air-Gapped Upgrade Kubernetes and KubeSphere"

linkTitle: "Air-Gapped Upgrade with KubeKey"
weight: 4020
---
Air-gapped upgrade with KubeKey is recommended for users whose KubeSphere and Kubernetes were both deployed by [All-in-One Installation](https://v2-1.docs.kubesphere.io/docs/installation/all-in-one/) or [Multi-node Installation](https://v2-1.docs.kubesphere.io/docs/installation/multi-node/). If your Kubernetes cluster was provisioned by yourself or cloud providers, please refer to [Air-Gapped Upgrade with ks-installer](../air-gapped-upgrade-with-ks-installer/).

## Prerequisites

- You need to have a KubeSphere cluster running version 2.1.1.

{{< notice warning >}}

If your KubeSphere version is v2.1.0 or earlier, please upgrade to v2.1.1 first.

{{</ notice >}}

- Download KubeKey and upload to the kubernetes server.
```bash
# md5: 212091024dca02f8f34323e00f4be81d
wget https://kubesphere-installer.pek3b.qingstor.com/offline/v3.0.0/kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```
- Docker Registry

You need to have a harbor or other Docker registry.

{{< notice tip >}}

You can [quick start yourself docker registry](https://kubesphere.com.cn/forum/d/2240-docker-registry)

{{</ notice >}}

- Make sure you read [Release Notes For 3.0.0](../../release/release-v300/) carefully.

{{< notice warning >}}

In v3.0.0, KubeSphere refactors many of its components such as Fluent Bit Operator and IAM. Make sure you back up any important components in case you heavily customized them but not from console.

{{</ notice >}}

- Make your upgrade plan. Two upgrading scenarios are documented below.

## Air-Gapped Upgrade KubeSphere and Kubernetes

Upgrading steps are different for single-node clusters (all-in-one) and multi-node clusters.

{{< notice info >}}

- Air-gapped upgrading with Kubernetes will cause helm to be upgraded from v2 to v3. If you want to continue using helm2, please back up it: `cp /usr/local/bin/helm /usr/local/bin/helm2`
- When upgrading Kubernetes, KubeKey will upgrade from one MINOR version to the next MINOR version until the target version. For example, you may see the upgrading process going from 1.16 to 1.17 and to 1.18, instead of directly jumping to 1.18 from 1.16.

{{</ notice >}}


### Air-Gapped Upgrade All-in-one Cluster

- Versions

|       | Kubernetes |  KubeSphere |
|------ | ---------- | ----------- |
| Befor |  v1.16.7   |   v2.1.1    |
| After |  v1.17.9   |   v3.0.0    |

- Environment

|      Service     | Host     |  IP        |  Port |   URL   |
| ---------------- | -------- | ---------- | ------ | ----- |
| Docker Registry  |  ks.all  | 192.168.1.1|  5000  | http://192.168.1.1:5000 |

#### Upgrade the cluster

- Unzip upgrade package.

```bash
tar zxvf kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```

- Push docker images to the docker registry.

```bash
cd kubesphere-all-v3.0.0-offline-linux-amd64/kubesphere-images-v3.0.0/
./push-images.sh 192.168.1.1:5000
```

- Generate a configuration file with KubeKey

```bash
cd ..
./kk create config --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

- Modify the configuration file template

Modify `config-sample.yaml` to fit your cluster setup. Make sure you replace the following fields correctly.

1. `hosts`: Input connection information among your hosts.
2. `roleGroups.etcd`: Input etcd member.
3. `roleGroups.master`: Input master member.
4. `roleGroups.worker`: Input worker member.
5. `controlPlaneEndpoint`: Input your load balancer address (Optional).
6. `registry.privateRegistry`: Input private image registry information.

Set the `hosts` of your `config-sample.yaml` file:

```yaml
  hosts:
  - {name: node1, address: 192.168.1.1, internalAddress: 192.168.1.1, user: root, password: Qcloud@123}
  roleGroups:
    etcd:
    - ks.all
    master:
    - ks.all
    worker:
    - ks.all
```

Set the `privateRegistry` value of your `config-sample.yaml` file:
```yaml
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: 192.168.1.1:5000
```

For more information of configuration, please refer to [kubekey config-example](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)

- Upgrades your single-node cluster to KubeSphere v3.0.0 and Kubernetes v1.17.9 (default)

```bash
./kk upgrade -f config-sample.yaml
```

To upgrade Kubernetes to a specific version, please explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.15.12
- v1.16.8, v1.16.10, v1.16.12, v1.16.13
- v1.17.0, v1.17.4, v1.17.5, v1.17.6, v1.17.7, v1.17.8, v1.17.9
- v1.18.3, v1.18.5, v1.18.6


### Air-Gapped Upgrade Multi-node Cluster

- Versions

|       | Kubernetes |  KubeSphere |
|------ | ---------- | ----------- |
| Befor |  v1.16.7   |   v2.1.1    |
| After |  v1.17.9   |   v3.0.0    |

- Environment

|      IP     | Hosrname |     Cluster Roles     |
| ----------- | -------- | --------------------- |
| 192.168.1.5 |  ks.m1   | master，etcd ,registry|
| 192.168.1.6 |  ks.s1   | node                  |
| 192.168.1.7 |  ks.s2   | node                  |

#### Upgrade the cluster

- Unzip upgrade package.

```bash
tar zxvf kubesphere-all-v3.0.0-offline-linux-amd64.tar.gz
```

- Push docker images to the docker registry.

```bash
cd kubesphere-all-v3.0.0-offline-linux-amd64/kubesphere-images-v3.0.0/
./push-images.sh 192.168.1.5:5000
```

- Generate a configuration file with KubeKey

```bash
cd ..
./kk create config --with-kubernetes v1.17.9 --with-kubesphere v3.0.0
```

- Modify the configuration file template

Modify `config-sample.yaml` to fit your cluster setup. Make sure you replace the following fields correctly.

1. `hosts`: Input connection information among your hosts.
2. `roleGroups.etcd`: Input etcd member.
3. `roleGroups.master`: Input master member.
4. `roleGroups.worker`: Input worker member.
5. `controlPlaneEndpoint`: Input your load balancer address (Optional).
6. `registry.privateRegistry`: Input private image registry information.

Set the `hosts` of your `config-sample.yaml` file:

```yaml
  hosts:
  - {name: ks.m1, address: 192.168.1.5, internalAddress: 192.168.1.5, user: root, password: Qcloud@123}
  - {name: ks.s1, address: 192.168.1.6, internalAddress: 192.168.1.6, user: root, privateKeyPath: "/root/.ssh/kp-qingcloud"}
  - {name: ks.s2, address: 192.168.1.7, internalAddress: 192.168.1.7, user: root, privateKeyPath: "/root/.ssh/kp-qingcloud"}
  roleGroups:
    etcd:
    - ks.m1
    master:
    - ks.m1
    worker:
    - ks.s1
    - ks.s2
```

Set the `privateRegistry` value of your `config-sample.yaml` file:
```yaml
  registry:
    registryMirrors: []
    insecureRegistries: []
    privateRegistry: 192.168.1.1:5000
```

For more information of configuration, please refer to [kubekey config-example](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md)

- Upgrades your cluster to KubeSphere v3.0.0 and Kubernetes v1.17.9 (default)

```bash
./kk upgrade -f config-sample.yaml
```

To upgrade Kubernetes to a specific version, please explicitly provide the version after the flag `--with-kubernetes`. Available versions are:

- v1.15.12
- v1.16.8, v1.16.10, v1.16.12, v1.16.13
- v1.17.0, v1.17.4, v1.17.5, v1.17.6, v1.17.7, v1.17.8, v1.17.9
- v1.18.3, v1.18.5, v1.18.6

## Demo 
<script src="https://asciinema.org/a/367852.js" id="asciicast-367852" async></script>

