---
title: vsleem
description:

css: scss/case-detail.scss

section1:
  title:  苏州威视通智能科技
  content: 苏州威视通智能科技有限公司，是一家全球领先的全景 AI 平台提供商。

section2:
  listLeft:
    - title: 公司简介
      contentList:
        - content: 苏州威视通智能科技有限公司，是一家全球领先的全景 AI 平台提供商，结合极致高效的数字孪生技术，实现房建公建、地产物业、城市更新、应急管理、石油化工、家装、零售等多元行业数字化赋能。
        - content: 公司技术现状：
        - content: 框架：SpringCloud；部署模式：手动 Docker Compose；监控：无；告警：无；日志查看：手动 Docker logs；服务运维：纯手动。
        - content: 公司平台介绍
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBAKFkrAmz1IY4P8iaRls-9u.png

    - title: 背景介绍
      contentList:
        - content: 随着公司业务增长，云端服务器和边端服务器数量增长迅速，而且伴随着海外业务的落地海外服务器也迅速增长，如果使用现在的技术去做运维，肯定是不可取的。
        - content: 云原生具有弹性扩展、高可用、高效运维、快速迭代、降低成本、灵活部署、简化架构设计、提高可移植性等优点。所以，我们打算拥抱云原生。
      image: http://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBBP-pUuyWFHMrNF5Ui-dK0Z.png

    - title: 选型
      contentList:
        - content: 我们最终选择了 KubeSphere，是因为其具有以下功能特性，较符合我们的需求：
        - content: 1. 简单多样化的安装方式（All in one、K8s、AWS）
        - content: 2. 集群可视化、监控可视化
        - content: 3. 多集群管理、多租户管理
        - content: 4. 一体化的 DevOps（Jenkins+GitOps）
        - content: 5. 丰富的开源组件（Fluent Bit、tower、jaeger）
        - content: 6. 开箱即用的微服务治理
        - content: 7. 支持 KubeEdge 边端运维
      image: 

    - type: 1
      contentList:
        - content: 高效管理不同云上多套环境
        - content: 可视化的 DevOps
        - content: 统一的底层分布式存储

    - title: 实践过程
      contentList:
        - specialContent:
            text: 架构演变
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBDEYps4W4dJS5Q-eY5DaWVr.png
    - title:
      contentList:
        - specialContent:
            text: 技术架构
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBBAg35JOSNDfYwieQVBItAz.png
    - title:
      contentList:
        - specialContent:
            text: 生产集群规模
            level: 3
        - content: 目前我们国内的业务部署在华为云、日本的业务部署在 AWS 上。
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBCXC2s37eBOYo0FF1ExebDG.png
    - title:
      contentList:
        - specialContent:
            text: 多集群配置
            level: 3
        - content: 多集群的连接方式有直接连接和代理连接，目前我的环境两套集群网络不互通所以采用了代理连接的方式。
        - content: 在主集群上登录 KubeSphere 控制台添加集群即可。
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBCd1ZUSTNZFD7H3GSzLVGgA.png
    - title:
      contentList:
        - specialContent:
            text: 服务部署
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBC9JDBHk_dI3I80fn5XKsHW.png
    - title:
      contentList:
        - specialContent:
            text: 监控
            level: 3
        - content: 
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBDwT8OB92xA6ogawNYMhYm5.png
    - title:
      contentList:
        - specialContent:
            text: CI/CD
            level: 3
        - content: CI 这块我们使用了其他开源项目，CD 则使用了 Argo CD 同步服务。
      image: https://pek3b.qingstor.com/kubesphere-community/images/AgAABW2pSBAqNPUa-uNMTqP0YhBB14vs.png


    - title: 使用效果
      contentList:
        - content: 1. 使用了 KubeSphere 后，使得不同云上的 K8s 集群能够方便的统一管理，对于云端服务和边端服务能够有效的统一运维。
        - content: 2. 在监控和日志上能够更快捷的获取到服务器和项目的数据。
        - content: 3. 可视化的操作界面大大降低了用户的学习成本。
      image: 
    
    - type: 2
      content: '借助 KubeSphere，使得我们云端和边端的资源更加高效的利用和监控。'
      author: '威视通科技'

    - title: 未来规划
      contentList:
        - content: 鉴于 KubeSphere 在华为云和 AWS-日本的成功落地，年底继续着手在 AWS-新加坡的部署。
        - content: 使用 EdgeMesh，彻底打通云边、边边的网络通信。
        - content: 使用灰度发布代替滚动更新部署。
      image: 

  rightPart:
    icon: /images/case/logo-vsleem.png
    list:
      - title: 行业
        content: AI
      - title: 地点
        content: 江苏苏州
      - title: 云类型
        content: 混合云
      - title: 挑战
        content: 高可用、边缘应用、多集群管理
      - title: 采用功能
        content: 多集群、Edge、监控告警及日志
---
