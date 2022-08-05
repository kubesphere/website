---
title: extreme-vision
description:

css: scss/case-detail.scss

section1:
  title: 极视角科技
  content: 极视角科技是专业的人工智能计算机视觉算法提供商。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 极视角科技是专业的人工智能计算机视觉算法提供商。公司成立于 2015 年，管理团队来自腾讯、微软、北京大学、杜克大学、香港中文大学、浙江大学等顶尖企业及实验室。目前公司已获得由经控金融投资集团、兰馨亚洲、青岛国信、高通创投、北高峰资本、天奇创投、华润创新基金等知名产业资本的 C 轮系列融资，在深圳、青岛、上海、珠海、成都、杭州及港澳等地设有研发中心及下属机构。
        - content: 极视角开创了全球首家视觉算法商城，目前商城已上架 1000 余种算法，覆盖超过 100 个行业领域的应用场景。极视角致力于开拓 AI 视觉算法在不同行业场景的开发与应用，汇聚超过 240,000 海内外视觉算法开发者，并成功服务过 3000 多家政企与科研院所，为产业提供丰富的人工智能算法与基建平台，赋能百业完成智能化转型升级。 
      image: 

    - title: 背景
      contentList:
        - content: 在国外众多知名网站 2021 年对 Kubernetes 的预测中，人工智能技术与 Kubernetes 的更好结合通常都名列其中。Kubernetes 以其良好的扩展和分布式特性，以及强大的调度能力成为运行 DL/ML 工作负载的理想平台。
      image: https://pek3b.qingstor.com/kubesphere-community/images/Kubernetes-prediction.png
    - title: 
      contentList:     
        - content: Kubernetes 很强大，但通常在 Kubernetes 上运行 AI 的工作负载还需要更多非 K8s 原生能力的支持比如：
        - content: 1. 用户管理：涉及多租户权限管理等
        - content: 2. 多集群管理
        - content: 3. 图形化 GPU 工作负载调度
        - content: 4. GPU 监控
        - content: 5. 训练、推理日志管理
        - content: 6. Kubernetes 事件与审计
        - content: 7. 告警与通知
      image: 
    - title: 
      contentList:     
        - content: 具体来说 Kubernetes 并没有提供完善的用户管理能力，而这是一个企业级机器学习平台的刚需；同样原生的 Kubernetes 也并没有提供多集群管理的能力，而用户有众多 K8s 集群需要统一管理；运行 AI 工作负载需要用到 GPU，昂贵的 GPU 需要有更好的监控及调度才能提高 GPU 利用率并节省成本；AI 的训练需要很长时间才能完成，从几个小时到几天不等，通过容器平台提供的日志系统可以更容易地看到训练进度；容器平台事件管理可以帮助开发者更好地定位问题；容器平台审计管理可以更容易地获知谁对哪些资源做了什么操作，让用户对整个容器平台有深入的掌控。
        - content: 总的来说，K8s 就像 Linux/Unix, 但用户仍然需要 Ubuntu 或 Mac 。KubeSphere 是企业级分布式多租户容器平台，本质上是一个现代的分布式操作系统。KubeSphere 在 Kubernetes 之上提供了丰富的平台能力如用户管理、多集群管理、可观测性、应用管理、微服务治理、CI/CD等。

    - title: 极栈 AI 平台迭代演变的挑战
      contentList:
        - content: 极栈平台是一个面向企业或机构的机器学习服务平台，提供从数据处理、模型训练、模型测试到模型推理的 AI 全生命周期管理服务，致力于帮助企业或机构迅速构建 AI 算法开发与应用能力。平台提供低代码开发与自动化测试功能，支持任务智能调度与资源智能监控，帮助企业全面提升 AI 算法开发效率，降低 AI 算法应用与管理成本，快速实现智能化升级。
      image: https://pek3b.qingstor.com/kubesphere-community/images/platform-jizhan.png
    - title: 
      contentList:     
        - content: 在使用 Kubernetes 之前，平台使用 Docker 挂载指定 GPU 来分配算力，容器内置 Jupyter 在线 IDE 实现和开发者交互，开发者在分配的容器内完成训练测试代码编写、模型训练，当时存在四个问题需要解决。
        - content: 1. 算力利用率低：开发者在编码时，GPU 仅仅用于代码调试；同时开发者需手动开启或者关闭环境，如果开发者训练结束未关闭环境，将继续占用算力资源。以算法大赛的场景为例，算力利用率平均在 50%，算力资源浪费严重。
        - content: 2. 存储运维成本高：平台使用Ceph来存储数据集、代码，比如容器挂载了 Ceph 的块存储来持久化存储开发环境，方便再次使用时能在其他node还原。在大量开发者使用时，出现挂载卷释放不了、容器无法停止等问题，影响开发者使用。
        - content: 3. 数据集安全无法保障：商用算法数据集往往涉密，需要实现数据所有权和使用权分离，比如许多大型政企开发算法往往外包给专业的 AI 公司。怎么让外部 AI 公司的算法工程师在既能完成算法开发，又能不接触到数据集，是政企算法平台客户的迫切需求。
        - content: 4. 算法测试人力成本高：对于算法开发者提交的算法，要对精度和性能等指标进行评测，达到算法需求方要求的精度和性能指标后方可上线。还是以算法大赛的场景举例，一般的 AI平台会提供训练数据集、测试数据集给到用户，用户完成算法开发后，用算法跑测试集，将结果写入到 CSV 文件里面和算法一起提交。对于获奖的开发者，我们要还原开发者测试环境，重新用开发者的算法来跑测试集，并和开发者提交的 CSV 结果对比，确定 CSV 文件没有被修改，保证比赛公平，这些都需要大量的测试人员参与，作为定位全栈 AI 开发的极栈平台来说，要在平台上开发万千算法，急需降低测试的人工成本。
      image: 
    - title: 
      contentList:     
        - content: 为解决这些问题，2018 年中决定引入 Kubernetes 对平台进行重构，但当时团队没有精通 Kubernetes 的人员，Kubernetes 的学习成本也不低，重构进展受到一定影响；后来我们发现了由青云科技开源的容器管理平台 KubeSphere，它把很多 Kubernetes 底层细节都屏蔽了，用户只需要像用公有云一样，用可视化的方式使用，可以降低使用 Kubernetes 的成本。同时社区的维护团队也非常认真负责，最开始把 KubeSphere 部署到我们测试环境，集群运行一段时间会崩溃，开源社区的同学手把手帮助我们解决了问题，后来又陆续引入了 QingStor NeonSAN 来替代 Ceph，极大地提升了平台稳定性。
        - content: KubeSphere v3.0.0 支持了多集群管理、自定义监控，提供了完善的事件、审计查询及告警能力；KubeSphere v3.1.x 新增对 KubeEdge 边缘节点管理的功能、新增多维度计量计费的能力、重构了告警系统，提供了兼容 Prometheus 格式的告警设置、新增了包括企业微信/钉钉/邮件/Slack/Webhook 等众多通知渠道、同时对应用商店和 DevOps 也进行了重构；还在开发当中的 KubeSphere v3.2 将对运行 AI 工作负载提供更好的支持包括 GPU 工作负载调度、GPU 监控等；未来 KubeSphere v4.0.0 将升级为可插拔架构，前后端将都会获得可插拔的能力，基于此可以构建可插拔到 KubeSphere 的机器学习平台。
      image: https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-roadmap.png

    - type: 1
      contentList:
        - content: Kubernetes 对 GPU 管理比较弱，Kubesphere 支持 GPU 调度管理和监控，对 AI 平台非常友好
        - content: KubeSphere 存储管理结合 QingStor NeonSan，读效率提升了 6 倍，对于依赖大数据训练的 AI 平台来说至关重要
        - content: 多云多集群管理方便纳管分布在各地的算力集群

    - title: 云原生 AI 平台实践
      contentList:
        - specialContent:
            text: 提高算力资源利用
            level: 3
        - content: 1. GPU 虚拟化
        - content: 首先针对开发者编码算力利用率低的情况，我们将编码和训练算力集群分开，同时使用 GPU虚拟化技术来更好利用 GPU 算力，这方面市场上已经有成熟的解决方案。在技术调研之后，选择了腾讯云开源的 GPUManager 作为虚拟化解决方案。
      image: https://pek3b.qingstor.com/kubesphere-community/images/gpu-virtualization.png
    - title:
      contentList:
        - content: GPUManager 基于 GPU 驱动封装实现，用户需要对驱动的某些关键接口（如显存分配、cuda thread 创建等）进行封装劫持，在劫持过程中限制用户进程对计算资源的使用，整体方案较为轻量化、性能损耗小，自身只有 5% 的性能损耗，支持同一张卡上容器间 GPU 和显存使用隔离，保证了编码这种算力利用率不高的场景开发者可以共享 GPU，同时在同一块调试时资源不会被抢占。
      image: https://pek3b.qingstor.com/kubesphere-community/images/gpu-vitualization-solution.png
    - title:
      contentList:
        - content: 2. 训练集群算力调度
        - content: 在 Kubernetes 里面使用 Job 来创建训练任务，只需要指定需要使用的GPU资源，结合消息队列，训练集群算力资源利用率可以达到满载。
      image: 
    - title:
      contentList:
        - content: 3. 资源监控
        - content: 资源监控对集群编码、训练优化有关键指导作用，KubeSphere 不仅能对 CPU 等传统资源监控，通过自定义监控面板，简单几个步骤配置，便可顺利完成可观察性监控，同时极栈平台也在 Kubernetes 基础上，按照项目等维度，可以限制每个项目 GPU 总的使用量和每个用户GPU 资源分配。
      image: https://pek3b.qingstor.com/kubesphere-community/images/gpu-monitor.png
    - title:
      contentList:
        - content: 现在，比如算法大赛的场景，我们监控到的 GPU 平均使用率在编码集群达到了 70%，训练集群达到了 95%。
      image:
    - title: 
      contentList:
        - specialContent:
            text: 存储：QingStor NeonSan Rdma
            level: 3
        - content: 我们采用 NVMe SSD+25GbE（RDMA）的 NeonSAN 来替换开源的 Ceph，NeonSAN 的表现很惊艳：比如随机读写的 IOPS，读达到了 180K，是 Ceph 的 6 倍，写也可以达到 75.7K，是Ceph 的 5.3倍，之后 AI 平台最高 1000 个 Pod 并发训练，没有再出现存储挂载卷释放不了引起的卡顿问题。 
      image: https://pek3b.qingstor.com/kubesphere-community/images/stor-jishijiao.png
    - title:
      contentList:
        - specialContent:
            text: 数据集安全
            level: 3
        - content: 我们做了数据安全沙箱来解决数据集安全的问题，数据安全沙箱实现了在不泄漏数据的同时，又能让算法开发者基于客户数据训练模型和评估算法质量。
        - content: 数据安全沙箱要解决两个问题：
        - content: 1. 安全隔离问题：对外集群不能连通外网，把数据传出去；在平台内部，可以通过程序把数据传输到开发者能够访问的环境。比如在开发者可以控制的编码环境里面起个 http 服务接收训练集群传输过来的训练数据。KubeSphere 提供了基于租户的可视化网络安全策略管理，极大地降低了容器平台在网络层面的运维工作压力。通过网络策略，可以在同一集群内实现网络隔离，这意味着可以在 Pod 之间设置防火墙，如果多个策略选择了一个 Pod, 则该 Pod 受限于这些策略的入站（Ingress）/出站（Egress）规则的并集，它们不会冲突，所以这里只要设置一个限制访问外网的策略和禁止访问编码 Pod 的策略即可。 
      image: https://pek3b.qingstor.com/kubesphere-community/images/network-policy.png
    - title:
      contentList:
        - content: 2. 训练体验问题：隔离之后，开发者要能够实时知道训练和测试状态，训练和测试不能是一个黑箱，否则会极大影响模型训练和算法测试效率，如下图。
        - content: 开发者发起训练或者测试，任务在算力集群里面跑了起来，EFK 收集和存储容器日志，针对不同数据集，可以设置不同等级的黑白名单过滤策略，防止图片数据转码成日志泄露出来，比如高安全性数据集直接设置白名单日志展示。
        - content: 我们开发了 EV_toolkit 可视化工具包，来查看训练的指标如精度、损失函数（比如交叉熵）等，原理是训练指标通过 toolkit 的 api 接口写入到指定位置，再展示到界面上。
        - content: 训练监控：支持无人值守训练，错误消息通知，训练进展定制化提醒，训练结束通知。
      image: https://pek3b.qingstor.com/kubesphere-community/images/ev-board.png
    - title:
      contentList:
        - specialContent:
            text: 自动测试
            level: 3
        - content: 要完成算法的自动测试需要解决 3 个问题：
        - content: 1. 各个算法框架开发出来的模型格式不统一，怎么规范化统一调用。
        - content: 2. 所有算法输入要统一、标准化。
        - content: 3. 客户对算法要求越来越高，算法输出的数据结构也越来越复杂，算法输出怎么跟数据标注的正确结果比对。
        - content: 先来看看我们自研的推理框架 EvSdk，它解决了前两个问题，一是制定了算法统一封装标准，不同于其他 AI 平台针对单模型进行评估，极栈自动测试系统针对封装好的算法进行评估，因为随着算法越来越复杂，一个算法有多个模型的情况也越来越常见，只是对单模型进行评估并不能评估交付给客户的成品质量，另外对模型评估还要考虑各种开发框架模型格式兼容问题；二是 EVSDK 抽象出了算法输入接口，比如针对视频分析，第一个参数是创建的检测器实例，第二个参数是输入的源帧，第三个参数是可配置的 json，比如 roi、置信度等，通过 EVSDK 制定规范实现了算法输入的标准化。除了解决自动测试的两个问题，EV_SDK 还提供工具包,比如算法授权，另外有了统一的推理框架，外面一层的算法工程化工作也可以标准化，由平台统一提供，以安装包形式安装进去，不用开发者来做了，比如处理视频流、算法对外提供GRPC 服务等。
      image: https://pek3b.qingstor.com/kubesphere-community/images/ev-sdk.png
    - title:
      contentList:
        - content: 还要解决算法输出的问题，算法输出就是要找到输出 JSON 或者 XML 的节点里面的算法预测数据，找到之后和标注的正确数据做对比。自动测试系统引入了两个概念：
        - content: 模版：定义了算法输出的数据结构，这个数据结构中包含若干个变量和如何从原始数据中获取到具体值的路由路径，根据模版解析原始数据之后，模版中的所有变量将被填充具体的值。
        - content: 路由路径：一种针对数据查询的路由规则，使用这种规则可以把 xml / json 等不同的数据对象映射到相同的数据结构。对于不同来源或者不同结构的测试数据，就可以通过改变配置文件，得到相同数据结构的数据，从而可以对同一类型的任务使用同一个解析器来计算算法指标。
        - content: 下图示例里面截取了一个模板里面最小单元，但足以说明自动测试原理。自动测试程序要在算法输出里找到年龄这个值，来和图片或视频标注的标签里面的年龄做对比。`route_path` 字段告诉系统有个根节点的 `key` 是 `people`，`age` 这个字段的 `value` 就是我们要找的路由路径了，`[0]` 代表了这是一个数组，这也很好理解，因为可以有多个人出现在一帧视频里面，`.` 代表了下一级，`[]` 里如果不是 `0`，比如 `age` 代表这是个对象，`key` 名叫做 `age`，`@num` 就是他的数据类型，至此程序就找到了 `age` 在算法输出的位置，找到后拿去和标注的正确数据作对比。当然有更复杂的评判标准，例如年龄误差在 3 岁以内系统认为算法分析结果是正确的。
      image: https://pek3b.qingstor.com/kubesphere-community/images/automatictesting.png

    - type: 2
      content: 'AI 平台最重要的资源是 GPU，占据整个平台 60% 成本，通过使用 KubeSphere， GPU 平均使用率在开发集群达到了 70%，训练集群达到了 95%，使算力资源得到更好的管理和利用。'
      author: '极视角'

    - title: 极栈平台现状
      contentList:
        - content: PaaS 层用 KubeSphere 作为底座打造了三个平台：数据平台，开发平台，推理平台。采集到原始数据之后对数据大类进行打标，再用算法对数据进行去重，以及把低质量数据去除掉等初筛工作，人工再进行筛选。因为 AI 训练数据量非常大，我们还支持对数据生命周期进行设置，比如根据数据重要性进行保存，然后到数据标注，标注是非常占用时间的工作，需要做任务的分配和对标注人员做绩效管理，通过再训练的模型进行自动标注和人工调整标注。数据标注好之后流转到开发平台，开发平台支持两种开发模式，一是交互式开发，二是低代码的开发。最后算法生产出来之后上架到推理平台的算法商店，推理平台的客户端可以部署到用户侧，用户只需要输入激活码就可以安装算法，然后分析本地实时视频流或图片。
      image: https://pek3b.qingstor.com/kubesphere-community/images/jizhanplatform.png
    - title:
      contentList:
        - content:
      image: https://pek3b.qingstor.com/kubesphere-community/images/lowcode.jpg

    - title: 极栈平台未来展望
      contentList:
        - content: 1. 计算机视觉算法和其他软件不同在哪里呢，比如说 KubeSphere，给我们用的产品和给另外公司用的是一致的。但是对于算法来说，在 A 客户那里效果很好，到 B 客户摄像头距离远一些、角度不同，或者是检测物体多了个颜色，效果就不达标了，要重新采集数据来训练模型。算法可复制性不强，难以标准化、产品化。对于解决通用场景的问题，每提高一个百分点识别率需要的算力和数据成本要翻倍，所以目前业界总共花了百亿成本才让人脸识别达到产品化，针对万千算法，如何大规模可复用，这是我们要攻克的难题。
      image: 
    - title:
      contentList:
        - content: 2. 既然适配通用场景非常难，回到现实场景中来，我们真的需要不断去优化一个算法适配所有用户的场景吗？对于每个用户来说，他真正关心的是算法在他自己场景下的算法效果。而在实践中，对于新场景，我们会将新场景数据集加入到训练集里面，对算法进行再训练来解决。如果系统能够实现不让算法工程师介入再训练过程，而是由客户通过简单的操作来完成,就解决了这个问题。
      image: https://pek3b.qingstor.com/kubesphere-community/images/algorithm-scene.png
    - title:
      contentList:
        - content: 3. 我们下一步会开发行业低代码套件，算法开发者在平台内只需开发算法和维护算法在行业的领先性，用户拿自己场景数据来标注，训练模型，适配自己的场景，无需任何编码工作，就可以完成算法优化，优化效果不达标的场景，再由开发者介入。 模型优化的工作如果无法避免，放到用户侧，算法就相当于用户喂养的宠物，这其实会重新定义用户和算法之间的关系，只有这样走，算法才能产品化，万千场景才能打开。 



  rightPart:
    icon: /images/case/section6-extreme-vision.jpg
    list:
      - title: 行业
        content: 计算机视觉
      - title: 地点
        content: 中国深圳
      - title: 云类型
        content: 公有云 + 私有云
      - title: 挑战
        content: 算力资源管理和监控
      - title: 采用功能
        content: GPU 资源管理、监控、存储管理

---
