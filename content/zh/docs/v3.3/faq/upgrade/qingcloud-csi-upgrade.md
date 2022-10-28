---
title: "升级 QingCloud CSI"
keywords: "Kubernetes, 升级, KubeSphere, v3.3.1"
description: "升级 KubeSphere 后升级 QingCloud CSI。"
linkTitle: "升级 QingCloud CSI"
weight: 16210
---

## 升级 KubeSphere 后升级 QingCloud CSI

目前 QingCloud CSI 无法通过 KubeKey 升级。升级 KubeSphere 之后您可以运行以下命令手动升级 CSI：

```
git clone https://github.com/yunify/qingcloud-csi.git
```

```
cd qingcloud-csi/
```

```
git checkout v1.1.1
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

等待 CSI 控制器和守护进程集启动并运行：

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

运行以下命令查看 CSI 镜像版本是否是 1.2.x：

```
$ kubectl get po -n kube-system csi-qingcloud-controller-56979d46cb-qk9ck -ojson | jq '.spec.containers[].image' | grep qingcloud
"csiplugin/csi-qingcloud:v1.2.0-rc.4"
```
