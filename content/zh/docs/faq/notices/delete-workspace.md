---
title: "删除企业空间"
keywords: "Kubernetes, KubeSphere, 删除企业空间"
description: "删除企业空间"
linkTitle: "删除企业空间"
weight: 16251
---

## 删除企业空间需要注意的事项

在 KubeSphere 中，可以通过企业空间（workspace）对项目（namespace）进行分组管理，企业空间下项目的生命周期会受到企业空间的影响。

企业空间删除之后，企业空间下的项目及资源也同时会被销毁。在删除企业空间时需要多加注意，务必确认是否需要对企业空间下所有的项目及资源进行释放。

通过 kubectl 直接操作企业空间资源对象时由于没有风险提示，务必注意相关风险。

### 从企业空间中移除项目

如果你在删除企业空间时，需要保留一些项目，或者是希望将项目与企业空间进行解绑，可以通过一下命令进行操作

```
kubectl label ns <namespace> kubesphere.io/workspace- && kubectl patch ns <namespace>   -p '{"metadata":{"ownerReferences":[]}}' --type=merge
```

{{< notice note >}}

移除与企业空间关联的 label 并移除 ownerReferences。

{{</ notice >}}

你可以重新将项目[添加至其他的的企业空间](../../access-control/add-kubernetes-namespace-to-kubesphere-workspace/#添加命名空间至-kubesphere-企业空间)