---
title: "contribution"

css: "scss/contribution.scss"

section1:
  title: 'Community is the Soul of KubeSphere'
  content: 'Join the community to get help, get involved, or get updates and KubeSphere news!'
  topImage: "/images/contribution/contribution-top.jpg"

section2:
  topType:
    - name: 'Download'
      icon1: 'images/contribution/download.svg'
      icon2: 'images/contribution/37.png'
      children:
        - content: 'Download KubeSphere'
          link: '/docs/quick-start/all-in-one-on-linux/'
        - content: 'Quickstart'
          link: '/docs/quick-start/create-workspace-and-project/'
        - content: 'Tutorial Videos'
          link: '../videos/'

    - name: 'Contribute'
      icon1: 'images/contribution/contribute.svg'
      icon2: 'images/contribution/38.png'
      children:
        - content: 'Join the SIGs and WGs'
          link: 'https://github.com/kubesphere/community#kubesphere-community'
        - content: 'Improve the Docs'
          link: 'https://github.com/kubesphere/website/issues'
        - content: 'Submit a Bug or Suggestion'
          link: 'https://github.com/kubesphere/kubesphere/issues/new/choose'

    - name: 'Get in Touch'
      icon1: 'images/contribution/business.svg'
      icon2: 'images/contribution/39.png'
      children:
        - content: 'Join KubeSphere Slack'
          link: 'https://join.slack.com/t/kubesphere/shared_invite/zt-2b4t6rdb4-ico_4UJzCln_S2c1pcrIpQ'
        - content: 'Join the Mailing List'
          link: 'https://groups.google.com/forum/#!forum/kubesphere'
        - content: 'Follow us on Twitter'
          link: 'https://twitter.com/KubeSphere'

  organization:
    topic: 'Community Governance'
    name: 'KubeSphere Community'
    icon: 'images/contribution/28.svg'
    topIcon: 'images/contribution/8.png'
    type:
      - name: 'TOC'
        icon: 'images/contribution/toc.svg'

      - name: 'Developer Group'
        icon: 'images/contribution/developer-group.svg'
        children:
          - name: 'Owner /  Lead'
            content: 'A lead is also a member of the project who is an experienced and active reviewer of the project.'

          - name: 'Member'
            content: 'A member has notable contributions to the project, helps us review PRs from other contributors.'

          - name: 'Contributor'
            content: 'Anyone who has at least one non-trivial PR merged into any project under KubeSphere organization becomes a contributor.'

      - name: 'User Research Group'
        icon: 'images/contribution/user.svg'
        children:
          - name: 'Champion'
            content: 'A Champion is someone who uses KubeSphere in production, and willing to spread KubeSphere by sharing your experience, in a case study, in a blog and on the community conference!'

          - name: 'Ambassador'
            content: 'An Ambassador is playing a role as blogger, influencer, evangelist who is already engaged with a kubeSphere project in some way including contributing to blogs, case studies, community forums, etc..'

      - name: 'Steering Committee'
        icon: 'images/contribution/steering.svg'

section3:
  interestGroup:
    title: 'Find Your Special Interest Group'
    content: 'SIGs are designed to let you find everything you need in one place around a central topic. Find an interesting one and join the SIG.'
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
    title: 'Get Involved'
    children:
      - title: 'Be an Ambassador'
        icon: 'images/contribution/group-1.png'
        content: 'You will be a public-facing community representative. We will provide you with resources to help you be successful as a speaker, or a writer.'
        link: 'request/'
        linkContent: 'Become a KubeSphere Ambassador →'

      - title: 'Be a Contributor'
        icon: 'images/contribution/group-2.png'
        content: 'KubeSphere is 100% open source and driven by the community. We appreciate contributions to our code and documentation! Significant contributions will earn you a contributor T-shirt.'
        link: 'https://github.com/kubesphere/community/blob/master/ROLES.md#kubesphere-community-roles'
        linkContent: 'Become a KubeSphere Contributor →'

section5:
  title: Participated Organizations
  list:
    - icon: /images/contribution/section5-1.svg
    - icon: /images/contribution/section5-2.jpg
    - icon: /images/contribution/section5-3.jpg
    - icon: /images/contribution/section5-4.jpg
    - icon: /images/contribution/section5-5.jpg

---
