---
title: '云原生安全产品 NeuVector 简介'
tag: '云原生安全'
keywords: 'KubeSphere, 云原生安全,  NeuVector, Kubernetes'
description: '本文对各大开源云原生安全产品进行了对比，也以一个 SecDevOps 的视角对 NeuVector 进行简要分析。'
createTime: '2022-02-15'
author: '马岩，姚锐'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/cloudnative-security.png'
---

近日一则《SUSE 发布 NeuVector：业内首个开源容器安全平台》的文章被转载于各大 IT 新闻网站。作为 SUSE 家族的新进成员，在 3 个月后便履行了开源承诺，着实让人赞叹。那么 NeuVector 究竟有哪些过人之处能得到 SUSE 的青睐？而对比各安全厂商的开源安全产品又有哪些突破？接下来，我会以一个 SecDevOps 的视角对 NeuVector 进行简要分析。

## 开源云原生安全产品现状

NeuVector 此次开源的并非某个组件或者安全工具，而是一套完整的容器安全平台。这与其他各大云原生安全厂商的开源策略有很大的区别。目前，云原生领域活跃的开源厂商包括：Aqua Security, Falco(sysdig), Anchore, Fairwinds, Portshift 等，以及被红帽收购的 Stackrox，除此还有像 Clair 这样来自大厂的安全工具。而传统的安全厂商虽然都有面向原生安全的产品，然而鲜有软件开源。云原生安全产品成为了创新型安全厂商突破传统厂商重围的一条重要赛道。而开源则更像他们检验其产品的试金石。

| 项目           | 厂商                  | 链接                                            | Star  | 类型                               | 开源时间   |
| -------------- | --------------------- | ----------------------------------------------- | ----- | ---------------------------------- | ---------- |
| clair          | Quay                  | https://github.com/quay/clair                   | 8.4k  | 镜像扫描                           | 2015-11-13 |
| trivy          | Aqua                  | https://github.com/aquasecurity/trivy           | 10.1k | 镜像扫描                           | 2019-04-11 |
| kube-hunter    | Aqua                  | https://github.com/aquasecurity/kube-hunter/    | 3.4k  | 漏洞扫描                           | 2018-07-18 |
| kube-bench     | Aqua                  | https://github.com/aquasecurity/kube-bench      | 4.5k  | CIS 安全基线                       | 2017-06-19 |
| starboard      | Aqua                  | https://github.com/aquasecurity/starboard       | 968   | Dashboard                          | 2020-03-17 |
| tracee         | Aqua                  | https://github.com/aquasecurity/tracee          | 1.5k  | 基于 eBPF 的系统事件追踪           | 2019-09-18 |
| anchore-engine | anchore               | https://github.com/anchore/anchore-engine       | 1.4k  | 漏洞扫描                           | 2017-09-06 |
| kyverno        | kyverno.io            | https://github.com/kyverno/kyverno              | 1.8k  | Kubernetes 策略与审计              | 2019-02-04 |
| GateKeeper     | OPA (sysdig)          | https://github.com/open-policy-agent/gatekeeper | 1.3k  | Kubernetes 策略与审计              | 2018-10-26 |
| falco          | falcosecurity(sysdig) | https://github.com/falcosecurity/falco          | 4.4k  | 基于内核模块的系统事件追踪、警告   | 2016-01-19 |
| terrascan      | accurics.com          | https://github.com/accurics/terrascan           | 2.7k  | 通用的 IaS 配置扫描                | 2017-09-11 |
| Kubei          | portshift             | https://github.com/cisco-open/kubei             | 489   | 镜像扫描(带面板)                   | 2020-03-22 |
| Polaris        | Fairwinds             | https://github.com/FairwindsOps/polaris         | 2.4k  | 配置扫描与策略                     | 2018-11-15 |
| kubesec        | controlplaneio        | https://github.com/controlplaneio/kubesec       | 667   | Kubernetes 配置扫描                | 2017-10-10 |
| KubeEye        | KubeSphere            | https://github.com/kubesphere/kubeeye           | 424   | 基于策略的 Kubernetes 集群配置扫描 | 2020-11-07 |
| kube-linter    | Stackrox(RedHat)      | https://github.com/stackrox/kube-linter         | 1.8k  | Kubernetes 配置扫描                | 2020-08-13 |

上表中，我们列举出了来自各个安全厂商的主要开源项目。从上面的表格中我们可以看出,目前开源安全软件集中在四大类别：

1. 镜像漏洞扫描
2. 合规、基线扫描
3. Kubernetes 安全策略、配置管理
4. 威胁检测

除上述四类工具外，网络安全也是云原生安全的重要一环，但目前主要由 CNI 网络插件支持，并未在其他安全厂商找到相关产品。这些工具目前都处于相对割裂的状态。除 starboard 项目是整合了 Aqua 开源安全产品线的简易安全平台外，其他厂商并未开源类似 NeuVector 的平台级别项目。且 starboard 目前也仅能只能自动执行漏洞扫描、配置审计、CIS 基线等基本功能。仅仅利用以上工具，运维开发人员则很难将其整合，形成一套完善的安全解决方案。从各个项目的 Star 数量上也可看出像 Trivy，TerraScan 等各类扫描工具相较运行时安全工具 Falco，Tracee 更受到社区用户的欢迎。这跟扫描类工具更易于实施，可以与 CI/CD 流水线快速集成有，也许有着密切的关系。而运行时安全工具则需要与其它 IT 系统进行整合或二次开发才能发挥出安全防护的作用。学习、使用、实施难度的提升，大大的阻碍了其普及程度。而 NeuVector 的开源则很可能打破这一现状，让社区用户轻松的部署一套完整的安全平台，使用以往付费商业平台才具有的功能。

## 云原生容器安全平台

接下来，我们看一下作为云原生容器安全平台的 NeuVector 究竟有哪些独一无二的开源功能。

### 统一平台

首先，作为一个平台应具备统一的安装部署能力，而不需要用户去思考如何去集成各类安全组件从而达到相应的安全需求。目前，可以通过官方提供的 Helm 安装包或 yaml 文件在已有的 Kubernetes 集群上可轻松的部署 NeuVector。 NeuVector 由 5 个主要服务组成：

![NeuVector 架构](https://open-docs.neuvector.com/user/pages/01.basics/01.overview/architecture.png)

- Manager, NeuVector 的 Web 控制台，为用户提供了统一的管理 UI，便于用户查看安全事件、管理安全解决方案、规则等。
- Controller, Backend 服务器及控制器，管理如 Enforcer、Scanner 等其他组件，分发安全策略及调度扫描任务。
- Scanner, 用户执行漏洞扫描、基线扫描等任务。
- Enforcer, 一个轻量级的容器，用于拦截系统事件，执行安全策略等。通常以 Daemon set 运行再集群中的每个节点上。
- Updater， 用于更新 CVE 数据库。

其次，统一的管理平面。能够管理 Kubernetes 平台中的各种资产，如容器、镜像、主机、进程等。针对各种组件配置规则，策略。执行计划任务，如合规扫描，镜像扫描等。NeuVector 目前功能已经相对比较完善，与 Sysdig、Aqua 等商业平台的主要功能类似。成功安装 NeuVector 后，用户即可通过浏览器打开 NeuVector 的控制台。在控制台的导航栏中包含了，资产管理、策略管理、安全风险、通知、平台设置及联邦集群等五项核心功能，依次展开后便可窥见它强大的功能了。

| Assets            | Policy            | Security Risks          | Notifications   | Settings         |
| ----------------- | ----------------- | ----------------------- | --------------- | ---------------- |
| Platforms         | Admission Control | Vulnerabilities         | Security Events | Users & Roles    |
| Nodes             | Groups            | Vulnerabilities Profile | Risk Reports    | Configuration    |
| Containers        | Network Rules     | Compliance              | Events          | LDAP/AD Settings |
| Registries        | Response Rules    | Compliance Profile      | -               | SAML Setting     |
| System Components | DLP Sensors       | -                       | -               | OIDC Settings    |
| --                | WAF Sensors       | -                       | -               | -                |

再次，组件之间的联动能力。NeuVector 能自动发现应用程序、容器和服务的行为。通过学习模式、监控模式、保护模式的转换有效的提升了效率。对已知的容器行为建模后，违反规则的行为都将触发安全事件。这些的安全事件会被汇总到`Security Events` 模块，并通过于 `Response Rules` 配置事件的响应规则，执行通知告警、自动阻断等响应动作。

### 可视化安全威胁分析面板

NeuVector 的可视化面板能有效的帮助管理员分析当前系统存在的风险。汇总显示了系统中的安全事件，主机/容器漏洞，Ingress/Egress 流量等。还支持 pdf、csv 导出功能，方便用户生成报告和分析。

### 资产管理

资产管理显示了节点、容器、镜像仓库、NeuVector 自身组件的相关信息。以不同的视角查看相关资产的安全风险，针对不同资产执行扫描任务。

### 事件通知

NeuVector 的通知模块包含了安全事件、风险(合规与漏洞)事件与系统事件。

安全事件中记录了违反白名单的事件或匹配的黑名单事件。例如，我们可以在网络规则中设置白名单，所有未在白名单中允许的网络连接都将被拦截，并记录安全事件。在安全事件中，还可以查看网络、进程、文件事件等各类事件。并修改事件规则，将误报加入信任事件中。

### 用户权限管理与认证系统集成

NeuVector 控制台具有用户管理功能，对用户权限进行限制。并且可以与第三方用户管理系统进行集成，如 LDAP、SAML、OIDC 等，可以通过与用户管理系统内的用户组权限进行匹配，简化用户授权的流程。方法用户集成已有的用户授权基础设施。

### 联邦集群管理

NeuVector 支持多集群管理功能，创建主集群后，即可在主集群中配置联邦规则。这些规则可以被自动的分发到其他集群中。通过联邦集群可以统一的部署管理各个集群的安全策略与规则，简化管理流程。被纳管集群无权求改这些联邦规则，保证了纳管集群不会违反安全规则，提升了纳管集群的安全性。

## 功能对比

接下来，我们再看一下 NeuVector 内置的安全工具箱与当前主流的开源安全工具对比。

### 镜像漏洞扫描

镜像漏洞扫描工具中，Clair，Trivy，Anchore-engine 垄断绝大部分开源市场，又有像 Snyk 这样的商业产品。在这些项目中 Trivy 作为后起之秀，在短短 3 年内即超越了 Clair，成为最流行的工具，这与 Trivy 强大的功能有着密不可分的关系。Trivy 不但支持 Alpine, RHEL, CentOS, Ubuntu 等系统软件包的漏洞扫描。还支持基于开发语言的依赖包漏洞扫描，如 Go, Python, PHP, Node.js Java, .Net 等。基于 GitHub Action 自动化任务会从各大厂商的官方 CVE 漏洞库拉取最新的漏洞信息，及时更新 Trivy 漏洞库。

从 NeuVector 的代码库中可以看出，目前漏洞扫描可以支持基于 apk, dpkg, rpm 分发包的检测，核心代码非常简练。但由于其尚未发布漏洞库，因此很难判断其漏洞扫描的准确性和全面性。还需要等待 NeuVector 发布下一步的开源计划，以全面的了解其相关的发展规划。相信在短期内 NeuVector 的漏洞扫描应该难以撼动 Trivy 的地位。

### 合规检查

NeuVector 内置的合规性检测支持包括 CIS Kubernetes/docker Benchmarks， 以及 PCI, NIST,GDPR 和 HIPAA 等行业标准合规检测模板。对于 CIS Kubernetes Benchmarks 可以支持 OpenShift 和 GKE 的自动检测，但由于 CIS Kubernetes Benchmarks 检测脚本尚不能支持自定义规则，目前对于私有云或使用第三方安装工具部署的集群环境会受到限制。另外,由于 NeuVector 的检测代码都是由 bash 脚本开发，其扩展性和配置性不如 kube-bench 灵活。

目前，其他合规性检测工具都只针对某一种标准，很难兼顾其它，而 NeuVector 更加全面和通用，用户可以自定义合规检测脚本，可以定制针对主机或容器或第三方组件的合规性检测。而不局限于 CIS 或其他标准的规则。但另一方面，官方文档中建议谨慎使用自定义合规检测脚本，因为自定义脚本具有主机和容器的 root 执行权限，并且没有命令限制，可能存在潜在的安全风险。

### 网络拓补图

网络拓补图使用了可视化的方式显示容器-容器和容器-主机之间间网络通讯关系，帮助我们分析潜在的安全风险，提升了网络的可观测性。Weave Scope, Cilium Hubble 都支持网络拓补图功能。Weave Scope 的使用范围更加广泛,不局限于 Kubernetes，还可在 Docker，Mesosphere 等平台进行部署。Hubble 虽然依赖于 Cilium，但是 Cilium 不仅性能优越，而且将可观察性和安全性作为首要的功能特性，因此 Hubble 也作为其核心组件也被广泛使用。而且 Cilium 作为社区中炙手可热的网络插件，未来大有超越 Calico 之势。

从功能角度分析，Weave Scope 更加侧重于网络性能分析和调试，并支持插件，可定制化 UI 功能。Hubble 则更偏向于微服务治理，可显示微服务的依赖关系，对应用层协议有更好的支持。通过 Hubble 也可观测到哪些服务发起了外网访问或域名解析以及被网络策略拦截的网络连接等。

NeuVector 的 Network Activity 功能着重于网络安全性。帮助网络管理员识别异常流量。管理网络安全策略，执行隔离命令等。虽然他们的视图功能相似、原理相通，但由于其功能重点不一样，横向对比的意义有限。

### 内核事件审计

通过内核事件分析系统和应用的行为是运行时安全检测的重要一环。通过 Linux 内核监控的系统中的事件，事件产生速度极快，对核心模块效率要求极高。因此，目前主流方案会采用 eBPF，像 Tracee 就使用了 eBPF + Golang 的组合作为事件的收集引擎。内核模块也是另一种可选方案，Falco 目前即支持 eBPF 也支持内核模块，灵活性较高，对低版本内核有更好的支持。NeuVector 还缺少事件收集的设计文档，由于时间仓促，并未通过代码深入了解 NeuVector 事件收集的模式。仅从代码结构上看，代码相对较复杂，缺少注释，组件之间的关系仅凭命名很难确定。希望官方能尽快完善相关文档，便于进一步理解分析。

## 安装试用

接下来我们通过 KubeSphere 来安装试用 NeuVector。

### 进入 kubectl 终端

首先登录 KubeSphere Console，进入"平台管理"，选择"集群管理"。

![](https://pek3b.qingstor.com/kubesphere-community/images/202202151725374.png)

进入"ks-installer"，选择"应用负载"，选择"工作负载"，项目设置为"kubesphere-system"，选择"ks-installer"。

![](https://pek3b.qingstor.com/kubesphere-community/images/202202151726268.png)

进入 ks-installer 的 Pod 终端。

![](https://pek3b.qingstor.com/kubesphere-community/images/202202151726307.png)

### 使用 helm 安装 NeuVector

- 创建 namespace

```bash
kubectl create namespace neuvector
```

- 创建 serviceaccount

```bash
kubectl create serviceaccount neuvector -n neuvector
```

- 添加 neuvector 的 helm 仓库

```bash
helm repo add neuvector https://neuvector.github.io/neuvector-helm/
```

- 安装 neuvector

```bash
helm install my-neuvector --namespace neuvector neuvector/core
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202202151736913.png)

- 替换镜像
  > 由于 neuvector 镜像需要权限才能获取，这里将镜像替换为 preview 版本
  > 更多安装信息请参考：https://github.com/neuvector/neuvector-helm/tree/master/charts/core

```bash
kubectl set image deployment.apps/neuvector-controller-pod *=neuvector/controller.preview:5.0.0-preview.1 -n neuvector
kubectl set image deployment.apps/neuvector-manager-pod *=neuvector/manager.preview:5.0.0-preview.1 -n neuvector
kubectl set image deployment.apps/neuvector-scanner-pod *=neuvector/scanner.preview:latest -n neuvector
kubectl set image daemonset.apps/neuvector-enforcer-pod *=neuvector/enforcer.preview:5.0.0-preview.1 -n neuvector
kubectl get cronjob/neuvector-updater-pod -n neuvector -o yaml | sed 's#image: registry.neuvector.com/updater:latest#image: neuvector/updater.preview:latest#' | kubectl replace -f -
```

![](https://pek3b.qingstor.com/kubesphere-community/images/202202151736303.png)

- 查看 neuvector 服务状态

  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151737985.png)

  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151737548.png)

  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151738324.png)

  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151738099.png)

### 访问 neuvector UI

- 使用 kubernetes node ip 和 node port 访问 neuvector UI, e.g. http://1.2.3.4:34567
- 默认用户密码：`admin/admin`
  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151743794.png)
- 使用条款点击 "I accept"
  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151743079.png)
- 修改默认密码
  点击用户选择"my profile",点击"EDIT PROFILE"
  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151744911.png)
- 查看 Dashboard
  ![](https://pek3b.qingstor.com/kubesphere-community/images/202202151745349.png)

## 开源社区

从 Github 仓库的信息来看，NeuVector 开源还处于起步阶段。仅仅公布了代码而已，目前还没有明确的 RoadMap，Release Plan， 社区的治理方式也尚不明确。这些问题都亟待解决。考虑到 Rancher 社区的成熟度，这一切应该只是时间问题，相信 NeuVector 会很快的步入正轨。

## 总结

NeuVector 填补了安全产品的空缺。虽然各个功能模块并非业界最强，但是其全生命周期的安全治理能力是其他开源工具所不能企及的。如果未来 NeuVector 可打造成开放式平台，集成业内的优秀工具取长补短，必将发挥出更大的作，并在开源安全市场占有一席之地。
