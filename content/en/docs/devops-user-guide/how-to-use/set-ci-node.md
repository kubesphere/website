---
title: "Set CI Node for Dependency Cache"
keywords: 'kubernetes, docker, kubesphere, jenkins, cicd, pipeline'
description: 'How to Set CI Node for dependency cache of KubeSphere pipeline '
---

## Introduction

Generally, applications often need to pull a lot of dependencies during the build process. It might cause some issues like long pulling time, or unstable network causing failure. In order to make build robust, and to speed up the build by using cache, we recommend you configure one or a set of CI nodes which the system schedules the task of CI/CD pipelines or S2I/B2I builds running on.

## Label CI Nodes

1. Log in KubeSphere with `admin` account, navigate to **Platform → Infrastructure**.

![Node Management](/images/devops/set-node-1.png)

2. Choose any of nodes as the CI running nodes, here we choose `node2` and enter its detailed page. Click **More → Edit Labels**.

![Select CI Node](/images/devops/set-node-2.png)

3. Click **Add Labels**, add a new label with key `node-role.kubernetes.io/worker` and value `ci`, click **Save**.

> Note the node may already have the key with empty value. You can just change the value to `ci`.

![Add CI Label](/images/devops/set-node-3.png)

## Set CI Nodes Dedicated

Basically, pipelines and S2I/B2I workflows will be scheduled to this node according to the [Node affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity). If you want to make CI nodes as the dedicated ones, which means these nodes are not allowed other workloads to be scheduled to them, you can follow with the steps below to set [Taint](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/).

1. Click **More → Taint Management**.

![Taint Management](/images/devops/set-node-2.png)

2. Click **Add Taint**, enter a key `node.kubernetes.io/ci` without specifying value. You can choose `NoSchedule` or `PreferNoSchedule` at your will.

![Add Taint](/images/devops/set-node-4.png)

3. Click **Save**. At this point, you have completed the CI node settings. You can go back to work on your DevOps pipeline.

![Taint Result](/images/devops/set-node-5.png)
