---
title: "参与贡献"

css: "scss/contribution.scss"

section1:
  title: '社区是 KubeSphere 的灵魂'
  content: '加入社区获得帮助，参与互动并获取 KubeSphere 的最新消息！'
  topImage: "/images/contribution/contribution-top.jpg"

section2:
  topType:
    - name: '下载'
      icon1: 'images/contribution/download.svg'
      icon2: 'images/contribution/37.png'
      children:
        - content: '下载 KubeSphere'
          link: '/docs/quick-start/all-in-one-on-linux/'
        - content: '快速入门'
          link: '/docs/quick-start/create-workspace-and-project/'
        - content: '视频教程'
          link: '../videos/'

    - name: '贡献'
      icon1: 'images/contribution/contribute.svg'
      icon2: 'images/contribution/38.png'
      children:
        - content: '加入 SIG 或微信群'
          link: 'https://github.com/kubesphere/community#kubesphere-community'
        - content: '完善文档'
          link: 'https://github.com/kubesphere/website/issues'
        - content: '提交 Bug 或建议'
          link: 'https://github.com/kubesphere/kubesphere/issues/new/choose'

    - name: '联系我们'
      icon1: 'images/contribution/business.svg'
      icon2: 'images/contribution/39.png'
      children:
        - content: '加入 KubeSphere Slack'
          link: 'https://join.slack.com/t/kubesphere/shared_invite/zt-1ilxbsp39-t4ES4xn5OI0eF5hvOoAhEw'
        - content: '加入邮件列表'
          link: 'https://groups.google.com/forum/#!forum/kubesphere'
        - content: '关注 X'
          link: 'https://x.com/KubeSphere'

  organization:
    topic: '社区治理'
    name: 'KubeSphere Community'
    icon: 'images/contribution/28.svg'
    topIcon: 'images/contribution/8.png'
    type:
      - name: 'TOC'
        icon: 'images/contribution/toc.svg'

      - name: '开发者社群'
        icon: 'images/contribution/developer-group.svg'
        children:
          - name: 'Owner /  Lead'
            content: ' 作为项目的一员，Lead 具有丰富的经验，并且是位积极活跃的项目审阅者。'

          - name: 'Member'
            content: 'Member 对项目做出重大贡献，并帮助我们审阅其他贡献者的 PR。'

          - name: 'Contributor'
            content: '提交过一次重要 PR 且被合并到 KubeSphere 项目下的用户都将成为 Contributor。'

      - name: '用户调查小组'
        icon: 'images/contribution/user.svg'
        children:
          - name: 'Champion'
            content: 'Champion 是指在生产环境中部署了 KubeSphere 并愿意通过案例研究、博客、社区会议等形式主动宣传 KubeSphere 使用体验的用户。'

          - name: 'Ambassador'
            content: 'Ambassador 类似于博主、影响者、布道者的角色。Ambassador 可以通过贡献博客文章、案例、社区论坛互动等方式参与 KubeSphere 项目。'

      - name: '社区委员会'
        icon: 'images/contribution/steering.svg'

section3:
  interestGroup:
    title: '加入您的特殊兴趣小组'
    content: '如果您对某一个主题感兴趣，可以加入我们的 SIG。在那里您可以找到与您感兴趣的主题所相关的一切内容。'
    children:
      - name: 'Apps'
        icon: '/images/contribution/apps.svg'
        iconActive: '/images/contribution/apps-active.svg'
        content: 'App charts for the built-in App Store'
        link: 'https://github.com/kubesphere/community/tree/master/sig-apps'
        linkContent: 'Join SIG - Apps →'
        children:
          - icon: '/images/contribution/calicq1.jpg'
          - icon: '/images/contribution/calicq2.jpg'
          - icon: '/images/contribution/calicq3.jpg'

      - name: 'App Store'
        icon: '/images/contribution/app-store.svg'
        iconActive: '/images/contribution/app-store-active.svg'
        content: 'App Store, App template management'
        link: 'https://github.com/kubesphere/community/tree/master/sig-appstore'
        linkContent: 'Join SIG - Application store →'
        children:
          - icon: '/images/contribution/calicq4.jpg'
          - icon: '/images/contribution/calicq5.svg'
          - icon: '/images/contribution/calicq6.jpg'

      - name: 'Architecture'
        icon: '/images/contribution/architecture.svg'
        iconActive: '/images/contribution/architecture-active.svg'
        content: ' System architecture design and investigation'
        link: 'https://github.com/kubesphere/community/tree/master/sig-architecture'
        linkContent: 'Join SIG - Architecture →'
        children:
          - icon: '/images/contribution/calicq7.jpg'
          - icon: '/images/contribution/calicq8.svg'

      - name: 'Cloud Providers'
        icon: '/images/contribution/cloud-providers.svg'
        iconActive: '/images/contribution/cloud-providers-active.svg'
        content: 'Support KubeSphere on multi-cloud '
        link: 'https://github.com/kubesphere/community/tree/master/sig-cloud-providers'
        linkContent: 'Join SIG - Cloud-Providers →'
        children:
          - icon: '/images/contribution/calicq9.jpg'
          - icon: '/images/contribution/calicq10.svg'
          - icon: '/images/contribution/calicq11.jpg'

      - name: 'Console (Front-end)'
        icon: '/images/contribution/console.svg'
        iconActive: '/images/contribution/console-active.svg'
        content: 'Web console and framework devlopment'
        link: 'https://github.com/kubesphere/community/tree/master/sig-console'
        linkContent: 'Join SIG - Console (Front-end) →'
        children:
          - icon: '/images/contribution/calicq12.jpg'
          - icon: '/images/contribution/calicq13.jpg'
          - icon: '/images/contribution/calicq14.jpg'

      - name: 'DevOps'
        icon: '/images/contribution/dev-ops.svg'
        iconActive: '/images/contribution/dev-ops-active.svg'
        content: 'Pipeline, S2I, B2I, Image Registry'
        link: 'https://github.com/kubesphere/community/tree/master/sig-devops'
        linkContent: 'Join SIG - DevOps →'
        children:
          - icon: '/images/contribution/calicq15.jpg'
          - icon: '/images/contribution/calicq16.jpg'
          - icon: '/images/contribution/calicq17.jpg'

      - name: ' Documentation'
        icon: '/images/contribution/docs.svg'
        iconActive: '/images/contribution/docs-active.svg'
        content: 'Documentation and website'
        link: 'https://github.com/kubesphere/community/tree/master/sig-docs'
        linkContent: 'Join SIG - Docs →'
        children:
          - icon: '/images/contribution/calicq8.svg'
          - icon: '/images/contribution/calicq7.jpg'
          - icon: '/images/contribution/calicq18.svg'

      - name: 'Edge'
        icon: '/images/contribution/edge.svg'
        iconActive: '/images/contribution/edge-active.svg'
        content: 'Support edge computing platforms such as KubeEdge, K3s etc.'
        link: 'https://github.com/kubesphere/community/tree/master/sig-edge'
        linkContent: 'Join SIG - Edge →'
        children:
          - icon: '/images/contribution/calicq19.jpg'
          - icon: '/images/contribution/calicq20.jpg'

      - name: 'Installation'
        icon: '/images/contribution/installation.svg'
        iconActive: '/images/contribution/installation-active.svg'
        content: 'KubeSphere installer and deployment'
        link: 'https://github.com/kubesphere/community/tree/master/sig-installation'
        linkContent: 'Join SIG - Installation →'
        children:
          - icon: '/images/contribution/calicq21.jpg'
          - icon: '/images/contribution/calicq7.jpg'
          - icon: '/images/contribution/calicq22.jpg'

      - name: 'Microservice'
        icon: '/images/contribution/microservice.svg'
        iconActive: '/images/contribution/microservice-active.svg'
        content: ' Microservices governance, tracing, traffic management'
        link: 'https://github.com/kubesphere/community/tree/master/sig-microservice'
        linkContent: 'Join SIG - Microservice →'
        children:
          - icon: '/images/contribution/calicq23.jpg'
          - icon: '/images/contribution/calicq24.jpg'
          - icon: '/images/contribution/calicq25.jpg'

      - name: 'Multi-cluster'
        icon: '/images/contribution/multicluster.svg'
        iconActive: '/images/contribution/multicluster-active.svg'
        content: 'Multi-cluster and multi-cloud management'
        link: 'https://github.com/kubesphere/community/tree/master/sig-multicluster'
        linkContent: 'Join SIG - Multicluster →'
        children:
          - icon: '/images/contribution/calicq26.jpg'
          - icon: '/images/contribution/calicq27.jpg'

      - name: 'Multi-tenancy'
        icon: '/images/contribution/multitenancy.svg'
        iconActive: '/images/contribution/multitenancy-active.svg'
        content: 'Workspace management, IAM, Security, RBAC'
        link: 'https://github.com/kubesphere/community/tree/master/sig-multitenancy'
        linkContent: 'Join SIG - Multitenancy →'
        children:
          - icon: '/images/contribution/calicq27.jpg'
          - icon: '/images/contribution/calicq28.jpg'
          - icon: '/images/contribution/calicq29.jpg'

      - name: 'Network'
        icon: '/images/contribution/network.svg'
        iconActive: '/images/contribution/network-active.svg'
        content: 'Network policy, Service Proxy, CNI plugins, SDN'
        link: 'https://github.com/kubesphere/community/tree/master/sig-network'
        linkContent: 'Join SIG - Network →'
        children:
          - icon: '/images/contribution/calicq30.svg'
          - icon: '/images/contribution/calicq31.jpg'
          - icon: '/images/contribution/calicq32.jpg'

      - name: 'Observability'
        icon: '/images/contribution/observability.svg'
        iconActive: '/images/contribution/observability-active.svg'
        content: 'Logging, Monitoring, Alerting, Notification, Audit, Events'
        link: 'https://github.com/kubesphere/community/tree/master/sig-observability'
        linkContent: 'Join SIG - Observability →'
        children:
          - icon: '/images/contribution/calicq33.jpg'
          - icon: '/images/contribution/calicq34.jpg'
          - icon: '/images/contribution/calicq35.jpg'

      - name: 'Release'
        icon: '/images/contribution/release.svg'
        iconActive: '/images/contribution/release-active.svg'
        content: 'Release of each version'
        link: 'https://github.com/kubesphere/community/tree/master/sig-release'
        linkContent: 'Join SIG - Release →'
        children:
          - icon: '/images/contribution/calicq7.jpg'
          - icon: '/images/contribution/calicq8.svg'

      - name: 'Storage'
        icon: '/images/contribution/storage.svg'
        iconActive: '/images/contribution/storage-active.svg'
        content: 'CSI plugins, storage integration'
        link: 'https://github.com/kubesphere/community/tree/master/sig-storage'
        linkContent: 'Join SIG - Storage →'
        children:
          - icon: '/images/contribution/calicq36.jpg'
          - icon: '/images/contribution/calicq37.jpg'
          - icon: '/images/contribution/calicq7.jpg'

      - name: 'Testing'
        icon: '/images/contribution/testing.svg'
        iconActive: '/images/contribution/testing-active.svg'
        content: 'Effectively and automatically test KubeSphere on different environments'
        link: 'https://github.com/kubesphere/community/tree/master/sig-testing'
        linkContent: 'Join SIG - Testing →'
        children:
          - icon: '/images/contribution/calicq38.jpg'
          - icon: '/images/contribution/calicq39.jpg'
          - icon: '/images/contribution/calicq7.jpg'

sectionCalendar:
  iframeUrl: https://calendar.google.com/calendar/embed?src=kubesphere%40gmail.com&ctz=Asia%2FShanghai

section4:
  involved:
    title: '社区参与'
    children:
      - title: '成为 Ambassador'
        icon: 'images/contribution/group-1.png'
        content: '您将会成为面向公众用户的 KubeSphere 社区代表。我们将为您提供资源，以帮助您成为一名成功的演讲者或作者。'
        link: 'request/'
        linkContent: '成为 KubeSphere Ambassador →'

      - title: '成为 Contributor'
        icon: 'images/contribution/group-2.png'
        content: 'KubeSphere 100% 开放源代码，并由社区推动。我们非常感谢对代码和文档做出贡献的用户！为了表达谢意，我们将为有突出贡献者赠送贡献者 T 恤。'
        link: 'https://github.com/kubesphere/community/blob/master/ROLES.md#kubesphere-community-roles'
        linkContent: '成为 KubeSphere Contributor →'

section5:
  title: 合作机构
  list:
    - icon: /images/contribution/section5-1.svg
    - icon: /images/contribution/section5-2.jpg
    - icon: /images/contribution/section5-3.jpg
    - icon: /images/contribution/section5-4.jpg
    - icon: /images/contribution/section5-5.jpg

---

