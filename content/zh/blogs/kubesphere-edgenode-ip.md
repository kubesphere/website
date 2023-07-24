---
title: 'KubeSphere 边缘节点 IP 冲突的分析和解决思路分享'
tag: 'Kubernetes, KubeSphere, 边缘节点'
keywords: 'Kubernetes, KubeSphere, 边缘节点, IP 冲突'
description: '在上一篇监控问题排查的文章中，笔者分析了 KubeSphere 3.1.0 集成 KubeEdge 中的边缘监控原理和问题排查思路，在介绍 EdgeWatcher 组件时提到了“边缘节点的内网 IP 需要集群内唯一”这样的限制条件。本文就来深入分析一下这个问题，并尝试给各位边缘开发者提供一些解决的建议和思路。'
createTime: '2021-08-05'
author: ' 何毓川'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-edgenode-ip-cover.png'
---

在上一篇[监控问题排查的文章](https://kubesphere.com.cn/blogs/edge-node-monitoring/)中，笔者分析了 KubeSphere 3.1.0 集成 KubeEdge 中的边缘监控原理和问题排查思路，在介绍 EdgeWatcher 组件时提到了“边缘节点的内网 IP 需要集群内唯一”这样的限制条件。本文就来深入分析一下这个问题，并尝试给各位边缘开发者提供一些解决的建议和思路。

## 正常场景

在边缘节点加入云端集群时，需要指定 “Node Name” 和 “Internal IP”，顾名思义，就是边缘节点的节点名称和内网 IP 地址。这里的内网 IP 地址就是本文的主题，该地址需要在集群内唯一。

KubeSphere 在 EdgeWatcher 中提供了用户指定的内网 IP是否被占用的验证功能。验证失败(IP 已被占用)的情况下，则不会为该边缘节点提供加入集群的命令行输出。下面两张图展示了验证成功和失败的场景。

**验证成功：**

![](https://pek3b.qingstor.com/kubesphere-community/images/1623996910-446834-image.png)

**验证失败：**

![](https://pek3b.qingstor.com/kubesphere-community/images/1623996958-232941-image.png)

可以说，KubeSphere 在这一点上已经做的非常用心了，给用户提供了 UI 的 “Validate” 按钮和后台 API，不管是直接使用还是基于 KubeSphere 的二次开发都会非常便捷。

## 非法场景

在上一节中展示了内网 IP 被占用的结果就是不能加入集群，因为该 IP 已经被注册在了 EdgeWatcher 中，不能再被其他边缘节点使用。

那么如果一个 IP 还没有被注册到 EdgeWatcher 中，也就是边缘节点没有被真正接入集群时，还是可以跳过这一步验证，将相同内网 IP 的两个边缘节点加入同一个集群中，制造这个非法的使用场景。

这个非法场景带来的问题就是：相同 IP 的“较早加入集群”的边缘节点在 logs exec 和 metrics 的功能上都会失效。即下图的运维功能都是没有数据的。

![](https://pek3b.qingstor.com/kubesphere-community/images/1623997023-119243-image.png)

之前，笔者也在 KubeSphere 的开发者社区提过这个[问题](https://ask.kubesphere.io/forum/d/4388-kubesphere-31)，同时也和负责边缘模块的社区开发者有过交流，确认了在 KubeSphere 的产品设计上，内网 IP 需要管理员或者用户自行按需进行规划，保证不重复。

## 潜在问题

私有部署的场景下，做到 IP 的统一规划是比较容易的。那么如果基于 KubeSphere 的边缘解决方案在公有云场景中会怎么样呢？

公有云用户不受规划限制，同时并发量比较大，出现“相同 IP 加入集群”这个问题的概率会非常大。最终会导致部分用户的 logs exec 和 metrics 功能失效，大量问题工单随之而来，用户黏度下降。所以公有云场景下，这个问题是必须要解决的，下面我们就详细分析一下问题的根本原因和解决思路。

## 根本原因

解决问题前，要把问题产生的根本原因摸清楚，这样才能有的放矢地去解决和处理问题。

在上一篇文章中，其实也简要介绍了 metrics 数据获取在 KubeEdge 边缘场景下的实现原理：kube-apiserver 上的 iptables 转发给云端的 Cloudcore，Cloudcore 通过和 Edgecore 之间的 WebSocket 通道向边缘端进行消息和数据传递。

logs 和 exec 功能的实现原理与 metrics 是一样的。下面这张图简要的描述了这几项功能在 KubeEdge 下的工作流程。

![](https://pek3b.qingstor.com/kubesphere-community/images/1623997107-160022-image.png)

结合上面这张图的 cloudcore (KubeEdge 云端组件)的红色部分，来解释一下为什么内网 IP 需要集群内唯一。

边缘节点(edgecore，即 KubeEdge 边缘组件)在连接到云端集群时，和云端之间会建立一个 websocket 通道。云端为了后续通过该 websocket 通道和边缘节点通信，需要将这个通道作为 session 保存在云端。表现在数据结构上就是一个“内网 IP”为 key，session (websocket 通道)为 value 的 map。

看到这里，各位开发者应该就很容易理解了，如果内网 IP 相同，则会覆盖较早加入集群的边缘节点的 session 记录。这时云端去查找“被覆盖了 session 的边缘节点”上 POD 的监控和运维数据，肯定是找不到的。

问题的根本原因找到了，解决的思路也就比较明确了，下一小节笔者简单阐述下这个问题的解决思路。

下图是在 KubeEdge 的边缘场景下，logs 功能的时序图，感兴趣的开发者可以进一步了解。

![](https://pek3b.qingstor.com/kubesphere-community/images/1623997129-774680-image.png)

## 解决思路

上一节梳理清楚了根本原因，解决思路也就比较清晰明了。本着非侵入式的改造原则，尽量少改动 KubeSphere 和 KubeEdge，对上层业务逻辑进行增强和扩展是笔者心目中的最佳选择。

既然根本原因是 IP 冲突导致 session 被覆盖，那就很自然的想到提供集群内不重复 IP 的分配服务，也就是常说的 IPAM。在云端的业务逻辑层引入 IPAM 服务，为用户边缘节点提供集群内唯一的 IP 分配能力。

同时还需要关注一点的是，IPAM 服务分配出来的唯一 IP 属于内部实现，不能当作 “Internal IP” 展示给用户。用户看到的边缘节点内网 IP 地址仍然是用户自行规划和填写的 IP，只不过改造后的内网 IP 不再作为 session 的 key，也不再需要进行冲突查验，只在页面上展示方便用户搜索，提高产品的易用性。

下面就是该思路下的节点加入流程图，供各位开发者参考。

![](https://pek3b.qingstor.com/kubesphere-community/images/1623997171-290105-image.png)

根据上面的流程图，笔者也大概罗列一下上述解决方案，需要修改的点：

1. 新建集群内 IPAM 服务，提供分配，回收 IP 等功能，注意并发处理。
2. 新建业务层节点服务，提供节点名称，展示用 IP，唯一 IP 等持久化能力。
3. 修改 keadm 和 edgecore，支持 node IP 可选。
4. 修改 cloudcore，在节点注册时通过节点名称查询唯一 IP，作为 Internal IP 注册节点。
5. 在业务层北向接口隐藏唯一 IP(K8s 上的  internal IP)，替换成用户输入的展示 IP。

## 后记

通过对现象和原理的分析，我们提出了在公有云环境下基于 KubeSphere 的边缘节点 IP 冲突问题的解决方案。限于笔者的技术能力，有可能还存在着更为简单有效的解决办法，欢迎各位开发者提出宝贵意见，让我们一起把基于 KubeSphere 的边缘解决方案做大做强。