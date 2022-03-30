---
title: '删除 KubeSphere 中一直卡在 Terminating 的 Namespace'
tag: 'KubeSphere'
keywords: 'Kubernetes, KubeSphere, Terminating, Namespace '
description: '本文是删除 KubeSphere 中一直卡在 Terminating 的 Namespace 的实操过程。'
createTime: '2022-02-23'
author: '雪文龙'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/eks-terminating-namespace.png'
---

## 介绍

最近一直在玩 EKS（Elastic Kubernetes Service -- Amazon EKS） 和 KubeSphere。 因为之前没有使用过 EKS 和 KubeSphere，所以这个过程也是一个试错的过程，在我使用 KubeSphere 的时候发现有一个日志服务，在好奇心的驱使下，我创建了它。

在我创建了日志服务（KubeSphere Logging System）以后，我发现我并不想使用它。（可能我只是想看看它到底是什么吧。）强迫症的我就想把它给删除掉。于是我在我的 EKS 中对他进行了强制删除：

```bash
$ kubectl delete ns kubesphere-logging-system  --force --grace-period=0
```

让人尴尬的是，这个 Namespace 并没有立马删除，我自我安慰道，可能 Namespace 下边有其他没有删除的资源在等待删除，我再等等。。。

过了半个小时，再次查看删除进度：

```bash
$ kubectl get  ns  kubesphere-logging-system
NAME                              STATUS        AGE
kubesphere-logging-system         Terminating   6d19h
```

它好像这地卡在了 Terminating 的状态。我试着寻找解决方法，参考这个 issue： http://github.com/kubernetes/kubernetes/issues/60807。但是这种方法要通过 API 才可以实现。EKS 是托管在 AWS 中的，我根本没有办法去操作 EKS 的后台。

终于我在这个 issue 中找到了答案： https://github.com/kubernetes/kubernetes/issues/60807#issuecomment-663853215

## 如何彻底删除 namespace

### 获取 namespace 的详情信息并转为 json

```bash
$ kubectl get namespace kubesphere-logging-system -o json > kubesphere-logging-system.json
```

### 打开 json 文件编辑

```json
{
    "apiVersion": "v1",
    "kind": "Namespace",
    "metadata": {
        "creationTimestamp": "2021-12-31T05:03:58Z",
        "deletionTimestamp": "2022-01-05T08:05:40Z",
        "labels": {
            "kubesphere.io/namespace": "kubesphere-logging-system",
            "kubesphere.io/workspace": "system-workspace"
        },
        "managedFields": [
            {
                "apiVersion": "v1",
                "fieldsType": "FieldsV1",
                "fieldsV1": {
                    "f:metadata": {
                        "f:labels": {
                            ".": {},
                            "f:kubesphere.io/namespace": {}
                        },
                        "f:ownerReferences": {
                            ".": {},
                            "k:{\"uid\":\"6d535470-2592-4f3c-a155-eabc362c339d\"}": {
                                ".": {},
                                "f:apiVersion": {},
                                "f:blockOwnerDeletion": {},
                                "f:controller": {},
                                "f:kind": {},
                                "f:name": {},
                                "f:uid": {}
                            }
                        }
                    }
                },
                "manager": "controller-manager",
                "operation": "Update",
                "time": "2021-12-31T05:04:01Z"
            },
            {
                "apiVersion": "v1",
                "fieldsType": "FieldsV1",
                "fieldsV1": {
                    "f:metadata": {
                        "f:labels": {
                            "f:kubesphere.io/workspace": {}
                        }
                    },
                    "f:status": {
                        "f:phase": {}
                    }
                },
                "manager": "kubectl",
                "operation": "Update",
                "time": "2021-12-31T05:04:01Z"
            },
            {
                "apiVersion": "v1",
                "fieldsType": "FieldsV1",
                "fieldsV1": {
                    "f:status": {
                        "f:conditions": {
                            ".": {},
                            "k:{\"type\":\"NamespaceContentRemaining\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceDeletionContentFailure\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceDeletionDiscoveryFailure\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceDeletionGroupVersionParsingFailure\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceFinalizersRemaining\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            }
                        }
                    }
                },
                "manager": "kube-controller-manager",
                "operation": "Update",
                "time": "2022-01-05T08:05:47Z"
            }
        ],
        "name": "kubesphere-logging-system",
        "ownerReferences": [
            {
                "apiVersion": "tenant.kubesphere.io/v1alpha1",
                "blockOwnerDeletion": true,
                "controller": true,
                "kind": "Workspace",
                "name": "system-workspace",
                "uid": "6d535470-2592-4f3c-a155-eabc362c339d"
            }
        ],
        "resourceVersion": "7376520",
        "uid": "2b76e9b1-75f2-4a2e-a819-73b36aea188e"
    },
    "spec": {
        "finalizers": [
            "kubernetes" # 将此行删除
        ]
    },
    "status": {
        "conditions": [
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "All resources successfully discovered",
                "reason": "ResourcesDiscovered",
                "status": "False",
                "type": "NamespaceDeletionDiscoveryFailure"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "All legacy kube types successfully parsed",
                "reason": "ParsedGroupVersions",
                "status": "False",
                "type": "NamespaceDeletionGroupVersionParsingFailure"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "All content successfully deleted, may be waiting on finalization",
                "reason": "ContentDeleted",
                "status": "False",
                "type": "NamespaceDeletionContentFailure"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "Some resources are remaining: fluentbits.logging.kubesphere.io has 1 resource instances",
                "reason": "SomeResourcesRemain",
                "status": "True",
                "type": "NamespaceContentRemaining"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "Some content in the namespace has finalizers remaining: fluentbit.logging.kubesphere.io in 1 resource instances",
                "reason": "SomeFinalizersRemain",
                "status": "True",
                "type": "NamespaceFinalizersRemaining"
            }
        ],
        "phase": "Terminating"
    }
}
```

找到 spec 将 finalizers 下的 kubernetes 删除。

具体如下

```json
{
    "apiVersion": "v1",
    "kind": "Namespace",
    "metadata": {
        "creationTimestamp": "2021-12-31T05:03:58Z",
        "deletionTimestamp": "2022-01-05T08:05:40Z",
        "labels": {
            "kubesphere.io/namespace": "kubesphere-logging-system",
            "kubesphere.io/workspace": "system-workspace"
        },
        "managedFields": [
            {
                "apiVersion": "v1",
                "fieldsType": "FieldsV1",
                "fieldsV1": {
                    "f:metadata": {
                        "f:labels": {
                            ".": {},
                            "f:kubesphere.io/namespace": {}
                        },
                        "f:ownerReferences": {
                            ".": {},
                            "k:{\"uid\":\"6d535470-2592-4f3c-a155-eabc362c339d\"}": {
                                ".": {},
                                "f:apiVersion": {},
                                "f:blockOwnerDeletion": {},
                                "f:controller": {},
                                "f:kind": {},
                                "f:name": {},
                                "f:uid": {}
                            }
                        }
                    }
                },
                "manager": "controller-manager",
                "operation": "Update",
                "time": "2021-12-31T05:04:01Z"
            },
            {
                "apiVersion": "v1",
                "fieldsType": "FieldsV1",
                "fieldsV1": {
                    "f:metadata": {
                        "f:labels": {
                            "f:kubesphere.io/workspace": {}
                        }
                    },
                    "f:status": {
                        "f:phase": {}
                    }
                },
                "manager": "kubectl",
                "operation": "Update",
                "time": "2021-12-31T05:04:01Z"
            },
            {
                "apiVersion": "v1",
                "fieldsType": "FieldsV1",
                "fieldsV1": {
                    "f:status": {
                        "f:conditions": {
                            ".": {},
                            "k:{\"type\":\"NamespaceContentRemaining\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceDeletionContentFailure\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceDeletionDiscoveryFailure\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceDeletionGroupVersionParsingFailure\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            },
                            "k:{\"type\":\"NamespaceFinalizersRemaining\"}": {
                                ".": {},
                                "f:lastTransitionTime": {},
                                "f:message": {},
                                "f:reason": {},
                                "f:status": {},
                                "f:type": {}
                            }
                        }
                    }
                },
                "manager": "kube-controller-manager",
                "operation": "Update",
                "time": "2022-01-05T08:05:47Z"
            }
        ],
        "name": "kubesphere-logging-system",
        "ownerReferences": [
            {
                "apiVersion": "tenant.kubesphere.io/v1alpha1",
                "blockOwnerDeletion": true,
                "controller": true,
                "kind": "Workspace",
                "name": "system-workspace",
                "uid": "6d535470-2592-4f3c-a155-eabc362c339d"
            }
        ],
        "resourceVersion": "7376520",
        "uid": "2b76e9b1-75f2-4a2e-a819-73b36aea188e"
    },
    "spec": {
        "finalizers": [
        ]
    },
    "status": {
        "conditions": [
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "All resources successfully discovered",
                "reason": "ResourcesDiscovered",
                "status": "False",
                "type": "NamespaceDeletionDiscoveryFailure"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "All legacy kube types successfully parsed",
                "reason": "ParsedGroupVersions",
                "status": "False",
                "type": "NamespaceDeletionGroupVersionParsingFailure"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "All content successfully deleted, may be waiting on finalization",
                "reason": "ContentDeleted",
                "status": "False",
                "type": "NamespaceDeletionContentFailure"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "Some resources are remaining: fluentbits.logging.kubesphere.io has 1 resource instances",
                "reason": "SomeResourcesRemain",
                "status": "True",
                "type": "NamespaceContentRemaining"
            },
            {
                "lastTransitionTime": "2022-01-05T08:05:47Z",
                "message": "Some content in the namespace has finalizers remaining: fluentbit.logging.kubesphere.io in 1 resource instances",
                "reason": "SomeFinalizersRemain",
                "status": "True",
                "type": "NamespaceFinalizersRemaining"
            }
        ],
        "phase": "Terminating"
    }
}
```

### 执行清理命令

现在我们只需要一条命令，就可以彻底删除这个 Namespace。

```bash
 $ kubectl replace --raw "/api/v1/namespaces/kubesphere-logging-system/finalize" -f ./kubesphere-logging-system.json 
```

执行完以后，你需要等待一会，再次执行命令检查 Namespace。

```bash
 $ kubectl replace --raw "/api/v1/namespaces/kubesphere-logging-system/finalize" -f ./kubesphere-logging-system.json 
```

## 最后的检查

``` bash
$ kubectl get ns kubesphere-logging-system
Error from server (NotFound): namespaces "kubesphere-logging-system" not found

$ kubectl get ns 
NAME                              STATUS   AGE
default                           Active   23d
kubesphere-controls-system        Active   9d
kubesphere-devops-system          Active   9d
kubesphere-devops-worker          Active   16h
kubesphere-monitoring-federated   Active   9d
kubesphere-monitoring-system      Active   9d
kubesphere-sample-dev             Active   8d
kubesphere-system                 Active   9d
```

再次查看的时候，它已经不存在了。