---
title: "Open Source Community - Projects | KubeSphere"
description: KubeSphere is an open source container platform based on Kubernetes for enterprise app development and deployment, suppors installing anywhere from on-premise datacenter to any cloud to edge.
keywords: KubeSphere, Kubernetes Dashboard,  Install Enterprise Kubernetes, DevOps, Istio, Service Mesh, Jenkins, container platform

css: "scss/projects.scss"
name: Open Source Projects
groups:
  - name: Container Platform
    children:
      - title: "KubeSphere"
        icon: 'images/projects/kubesphere.svg'
        link: 'https://github.com/kubesphere/kubesphere'
        description: KubeSphere is a distributed operating system managing cloud native applications with Kubernetes as its kernel, and provides plug-and-play architecture for the seamless integration of third-party applications to boost its ecosystem.

  - name: Application Management
    children:
      - title: OpenPitrix
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200607231502.png'
        link: 'https://github.com/openpitrix/openpitrix'
        description: OpenPitrix is an open source multi-cloud application management platform. It is useful in packing, deploying and managing applications of different kinds (e.g. traditional, microservice and serverless) in multiple cloud platforms, including AWS, Kubernetes, QingCloud and VMWare.

  - name: Service Proxy
    children:
      - title: OpenELB
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608102707.png'
        link: 'https://github.com/openelb'
        description: OpenELB is an open source load balancer designed for bare metal Kubernetes clusters. It’s implemented by physical switch, and uses BGP and ECMP to achieve the best performance and high availability.

  - name: Installer
    children:
      - title: KubeKey
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608103108.png'
        link: 'https://github.com/kubesphere/kubekey'
        description: KubeKey is the next-gen installer for Kubernetes and KubeSphere. KubeKey changes from ansible-based technology to Go, supports installing Kubernetes and KubeSphere separately or as a whole easily, efficiently and flexibly.

  - name: Serverless
    children:
      - title: OpenFunction
        icon: 'http://pek3b.qingstor.com/kubesphere-community/images/openfunction-logo-2.png'
        link: 'https://github.com/OpenFunction'
        description: OpenFunction is a cloud-native open-source FaaS (Function as a Service) platform aiming to let you focus on your business logic without having to maintain the underlying runtime environment and infrastructure. You can concentrate on developing business-related source code in the form of functions.

  - name: Logging
    children:
      - title: Fluent Operator
        icon: 'http://pek3b.qingstor.com/kubesphere-community/images/fluent-operator-icon.svg'
        link: 'https://github.com/fluent/fluent-operator'
        description: Fluent Operator provides great flexibility in building a logging layer based on Fluent Bit and Fluentd.

  - name: Notification
    children:
      - title: Notification Manager
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608105148.png'
        link: 'https://github.com/kubesphere/notification-manager'
        description: Notification Manager manages notifications in multi-tenant K8s environment. It receives alerts or notifications from different senders and then send notifications to various tenant receivers based on alerts/notifications' tenant label like "namespace".

  - name: Events
    children:
      - title: Kube-events
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111002.png'
        link: 'https://github.com/kubesphere/kube-events'
        description: Kube-events revolves around Kubernetes Event, covering multi-dimensional processing of them, such as emitting events to sinks, issuing notifications and generating alerts. And in some of these dimensions, configurable filtering rules are provided to meet different business needs.

  - name: Alert
    children:
      - title: Alerting System
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111200.png'
        link: 'https://github.com/kubesphere/alert'
        description: Alert is an enterprise-grade general-purpose high-performance alerting system.

  - name: CI/CD
    children:
      - title: S2i-operator
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111455.png'
        link: 'https://github.com/kubesphere/s2ioperator'
        description: Source-to-image(S2I)-Operator is a Kubernetes Custom Resource Defintion (CRD) controller that provides easy Kubernetes-style resources for declaring CI/CD-style pipelines. S2I Operator create a ready-to-run images by injecting source code into a container image and letting the container prepare that source code for execution.

  - name: Design
    children:
      - title: kube-design
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608114816.png'
        link: 'https://github.com/kubesphere/kube-design'
        description: Kube Design is a set of React component libraries created for KubeSphere console. If you want to develop KubeSphere console, this library will be pretty useful in customizing front end.

  - name: Storage Plugins
    children:
      - title: QingStor-CSI
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608111848.png'
        link: 'https://github.com/yunify/qingstor-csi'
        description: QingStor CSI plugin implements an interface between Container Storage Interface (CSI) enabled Container Orchestrator (CO) and the storage of NeonSAN, which has passed CSI sanity test.

      - title: QingCloud-CSI
        icon: 'https://pek3b.qingstor.com/kubesphere-docs/png/20200608112327.png'
        link: 'https://github.com/yunify/qingcloud-csi'
        description: QingCloud CSI plugin implements an interface between Container Storage Interface (CSI) enabled Container Orchestrator (CO) and the storage of QingCloud. Currently, QingCloud CSI disk plugin has been developed and manages disk volume in QingCloud platform.

---
