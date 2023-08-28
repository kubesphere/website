---
title: "Upgrade QingCloud CSI"
keywords: "Kubernetes, upgrade, KubeSphere, v3.4.0"
description: "Upgrade the QingCloud CSI after you upgrade KubeSphere."
linkTitle: "Upgrade QingCloud CSI"
weight: 16210
---

## Upgrade QingCloud CSI after Upgrading KubeSphere

Currently QingCloud CSI cannot be upgraded by KubeKey. You can run the following command to upgrade the CSI manually after you upgrade KubeSphere:

```
git clone https://github.com/yunify/qingcloud-csi.git
```

```
cd qingcloud-csi/
```

```
git checkout v1.2.0
```

```
kubectl delete -f  deploy/disk/kubernetes/releases/qingcloud-csi-disk-v1.1.1.yaml
```

```
kubectl delete sc csi-qingcloud
```

```
helm repo add test https://charts.kubesphere.io/test
```

```
helm install test/csi-qingcloud --name-template csi-qingcloud --namespace kube-system \
  --set config.qy_access_key_id=KEY,config.qy_secret_access_key=SECRET,config.zone=ZONE,sc.type=2
```

Wait until the CSI controller and DaemonSet are up and running.

```
$ kubectl get po -n kube-system | grep csi
csi-qingcloud-controller-56979d46cb-qk9ck   5/5     Running            0          24h
csi-qingcloud-node-4s8n5                    2/2     Running            0          24h
csi-qingcloud-node-65dqn                    2/2     Running            0          24h
csi-qingcloud-node-khk49                    2/2     Running            0          24h
csi-qingcloud-node-nz9q9                    2/2     Running            0          24h
csi-qingcloud-node-pxr56                    2/2     Running            0          24h
csi-qingcloud-node-whqhk                    2/2     Running            0          24h
```

Run the following command to check whether the CSI image version is 1.2.x:

```
$ kubectl get po -n kube-system csi-qingcloud-controller-56979d46cb-qk9ck -ojson | jq '.spec.containers[].image' | grep qingcloud
"csiplugin/csi-qingcloud:v1.2.0-rc.4"
```
