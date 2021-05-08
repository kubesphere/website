---
title: "查看资源消耗"
keywords: "Kubernetes, KubeSphere, 计量, 计费, 消耗"
description: "在不同层级追踪您集群工作负载的资源用量。"
linkTitle: "查看资源消耗"
weight: 15410
---

本教程介绍透过计量计费如何在不同层级追踪集群资源的使用量。计量计费当前支持 2 个维度的数据查询方式，即基于集群层级进行数据统计和基于企业空间层级进行数据统计。

## 查看集群资源消费情况

1. 集群资源消费情况是以集群维度统计包含节点在内的集群的 CPU ，内存、存储等资源消费情况。点击查看消费进入集群层级主面板。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-172746.png)

2. 在集群层级左边显示的是一个集群列表，对于单集群，这里显示的是一个 default 集群，如果集群本身已经开启了多集群的功能，那么这里看到的是一个包含 Host 集群和 Member 集群在内的多个集群。右侧显示的是指定集群具体的计量计费统计数据，大体分为上中下 3 部分，最上面显示的是该集群自创建以来的消费总和，并且按照各个资源类型分别进行了统计。如果已经在后台配置了计费价格信息，那么这里还会显示出相关的价格信息。中间这部分默认显示的是截止到昨天的消费历史，同时计量计费也支持用户自定义查询的开始时间，结束时间和时间间隔。最下面显示的当前集群包含的节点的计量计费信息。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-173129.png)

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-173324.png)

3. 点击左边集群列表中的某一个集群，可以进入到该集群的详情页，可以看到集群内各个节点的计量计费统计数据。页面布局和上面的集群层级类似。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-173415.png)

4. 点击左边节点列表，可以进一步进入到某个节点的计量计费详情页。在此页面内可以看到该结点内各个容器组的计量计费信息。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-173717.png)

## 查看企业空间（项目）资源消费情况

1. 企业空间（项目）资源消费情况是以企业空间维度统计包含项目在内的各个企业空间的 CPU ，内存、存储等资源消费情况。点击查看消费进入企业空间层级主面板。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-173839.png)

2. 在企业空间层级左边显示的是一个企业空间列表，右侧显示的是指定企业空间具体的计量计费统计数据。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-174139.png)

3. 点击左边企业空间列表中的某一个企业空间，可以进入到该企业空间的详情页，可以看到该企业空间内各个项目的计量计费统计数据。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-174335.png)

4. 点击左边的项目列表，可以进一步进入到某个项目的计量计费详情页。在项目详情页面内可以看到各类 K8s 资源（包含 deployment , statefulset 等）的统计数据。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-174551.png)

5. 点击某一个资源可以进入到资源内部的详情页，可以看到资源内部各个容器组的计量计费统计数据。

![view-resource-consumption](/images/docs/zh-cn/toolbox/metering-and-billing/view-resource-consumption/ksnip_20210508-174648.png)
