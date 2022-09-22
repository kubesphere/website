---
title: "3.2.0 版本说明"  
keywords: "Kubernetes, KubeSphere, 版本说明"  
description: "KubeSphere 3.2.0 版本说明"  
linkTitle: "3.2.0 版本说明"  
weight: 18100
---

## 多租户和多集群

### 新特性

- 新增支持在多集群场景设置主集群名称（默认值为 `host`）。（[#4211](https://github.com/kubesphere/kubesphere/pull/4211)，[@yuswift](https://github.com/yuswift)）
- 新增支持在单集群场景设置集群名称。（[#4220](https://github.com/kubesphere/kubesphere/pull/4220)，[@yuswift](https://github.com/yuswift)）
- 新增支持使用 `globals.config` 初始化默认集群名称。（[#2283](https://github.com/kubesphere/console/pull/2283)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 新增支持创建部署时跨多个集群调度容器组副本。（[#2191](https://github.com/kubesphere/console/pull/2191)，[@weili520](https://github.com/weili520)）
- 新增支持在项目详情页面修改集群权重。（[#2192](https://github.com/kubesphere/console/pull/2192)，[@weili520](https://github.com/weili520)）

### 问题修复

- 修复**集群管理**的**创建部署**对话框中可以通过输入项目名称选择多集群项目的问题。（[#2125](https://github.com/kubesphere/console/pull/2125)，[@fuchunlan](https://github.com/fuchunlan)）
- 修复编辑企业空间或集群基本信息时发生的错误。（[#2188](https://github.com/kubesphere/console/pull/2188), [@xuliwenwenwen](https://github.com/xuliwenwenwen)）
- 移除主集群**基本信息**页面上有关已删除集群的信息。（[#2211](https://github.com/kubesphere/console/pull/2211)，[@fuchunlan](https://github.com/fuchunlan)）
- 新增支持在多集群项目中对服务进行排序和编辑。（[#2167](https://github.com/kubesphere/console/pull/2167)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 重构多集群项目的网关功能。（[#2275](https://github.com/kubesphere/console/pull/2275)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 修复删除企业空间后多集群项目无法删除的问题。（[#4365](https://github.com/kubesphere/kubesphere/pull/4365)，[@wansir](https://github.com/wansir)）

## 可观察性

### 新特性

- 新增支持与 Elasticsearch 进行 HTTPS 通信。（[#4176](https://github.com/kubesphere/kubesphere/pull/4176)，[@wanjunlei](https://github.com/wanjunlei)）
- 新增支持调度 GPU 工作负载设置 GPU 类型。（[#4225](https://github.com/kubesphere/kubesphere/pull/4225)，[@zhu733756](https://github.com/zhu733756)）
- 新增支持验证通知设置。（[#4216](https://github.com/kubesphere/kubesphere/pull/4216)，[@wenchajun](https://github.com/wenchajun)）
- 新增支持通过指定监控面板 URL 或上传 Grafana 监控面板 JSON 配置文件导入 Grafana 监控面板。KubeSphere 自动将 Grafana 监控面板转换为 KubeSphere 集群监控面板。（[#4194](https://github.com/kubesphere/kubesphere/pull/4194)，[@zhu733756](https://github.com/zhu733756)）
- 新增支持在**自定义监控**页面创建 Grafana 监控面板。（[#2214](https://github.com/kubesphere/console/pull/2214)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 优化**通知配置**功能。（[#2261](https://github.com/kubesphere/console/pull/2261), [@xuliwenwenwen](https://github.com/xuliwenwenwen)）
- 新增支持在**编辑默认容器配额**对话框中设置 GPU 限制。（[#2253](https://github.com/kubesphere/console/pull/2253)，[@weili520](https://github.com/weili520)）
- 新增默认 GPU 监控面板。（[#2580](https://github.com/kubesphere/console/pull/2580)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 在 etcd 监控页面对 etcd leader 增加 **Leader** 标签。（[#2445](https://github.com/kubesphere/console/pull/2445), [@xuliwenwenwen](https://github.com/xuliwenwenwen)）

### 问题修复

- 修复**告警消息**页面和告警策略详情页面容器组信息错误的问题。（[#2215](https://github.com/kubesphere/console/pull/2215)，[@harrisonliu5](https://github.com/harrisonliu5)）

## 验证和授权

### 新特性

- 新增内置 OAuth 2.0 服务器（支持 OpenID Connect）。（[#3525](https://github.com/kubesphere/kubesphere/pull/3525)，[@wansir](https://github.com/wansir)）
- 移除使用外部身份认证提供者时所需的信息确认过程。（[#4238](https://github.com/kubesphere/kubesphere/pull/4238)，[@wansir](https://github.com/wansir)）

### 问题修复

- 修复登录历史记录中源 IP 地址错误的问题。（[#4331](https://github.com/kubesphere/kubesphere/pull/4331)，[@wansir](https://github.com/wansir)）

## 存储

### 新特性

- 变更用于确定是否允许存储卷克隆、存储卷快照和存储卷扩展的参数。（[#2199](https://github.com/kubesphere/console/pull/2199)，[@weili520](https://github.com/weili520)）
- 新增支持创建存储卷时设置存储卷绑定模式。（[#2220](https://github.com/kubesphere/console/pull/2220)，[@weili520](https://github.com/weili520)）
- 新增存储卷实例管理功能。（[#2226](https://github.com/kubesphere/console/pull/2226)，[@weili520](https://github.com/weili520)）
- 新增支持多个存储卷快照类型。用户可以在创建存储卷快照时选择快照类型。（[#2218](https://github.com/kubesphere/console/pull/2218)，[@weili520](https://github.com/weili520)）

### 问题修复

- 更改**存储卷设置**页签上存储卷访问模式的可选项。（[#2348](https://github.com/kubesphere/console/pull/2348)，[@live77](https://github.com/live77)）

## 网络

### 新特性

- 在应用路由列表页面新增应用路由排序、路由规则编辑和注解编辑功能。（[#2165](https://github.com/kubesphere/console/pull/2165)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 重构项目网关和新增集群网关功能。（[#2262](https://github.com/kubesphere/console/pull/2262)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 在路由规则创建过程中新增服务名称自动补全功能。（[#2196](https://github.com/kubesphere/console/pull/2196)，[@wengzhisong-hz](https://github.com/wengzhisong-hz)）
- 对 ks-console 进行了以下 DNS 优化：
  - 直接使用 ks-apiserver 服务的名称作为 API URL，不再使用 `ks-apiserver.kubesphere-system.svc`。
  - 新增 DNS 缓存插件 (dnscache) 用于缓存 DNS 结果。（[#2435](https://github.com/kubesphere/console/pull/2435)，[@live77](https://github.com/live77)）

### 问题修复

- 在**启用网关**对话框中新增**取消**按钮。（[#2245](https://github.com/kubesphere/console/pull/2245)，[@weili520](https://github.com/weili520)）

## 应用和应用商店

### 新特性

- 新增支持在应用仓库创建和编辑过程中设置同步时间间隔。（[#2311](https://github.com/kubesphere/console/pull/2311), [@xuliwenwenwen](https://github.com/xuliwenwenwen)）
- 在应用商店增加免责声明。（[#2173](https://github.com/kubesphere/console/pull/2173), [@xuliwenwenwen](https://github.com/xuliwenwenwen)）
- 新增支持将社区开发的 Helm chart 动态加载到应用商店。（[#4250](https://github.com/kubesphere/kubesphere/pull/4250)，[@xyz-li](https://github.com/xyz-li)）

### 问题修复

- 修复调用 `GetKubeSphereStats` 时 `kubesphere_app_template_count` 的值始终为 `0` 的问题。（[#4130](https://github.com/kubesphere/kubesphere/pull/4130)，[@Hanamichi](https://github.com/ks-ci-bohttps://github.com/x893675)）

## DevOps

### 新特性

- 设置系统在当前流水线不是多分支流水线时隐藏**运行记录**页签的**分支**列。（[#2379](https://github.com/kubesphere/console/pull/2379)，[@live77](https://github.com/live77)）
- 新增自动从 ConfigMaps 加载 Jenkins 配置的功能。（[#75](https://github.com/kubesphere/ks-devops/pull/75)，[@JohnNiang](https://github.com/JohnNiang)）
- 新增支持通过操纵 CRD 而不是调用 Jenkins API 来触发流水线。（[#41](https://github.com/kubesphere/ks-devops/issues/41), [@rick](https://github.com/LinuxSuRen)）
- 新增支持基于 containerd 的流水线。（[#171](https://github.com/kubesphere/ks-devops/pull/171), [@rick](https://github.com/LinuxSuRen)）
- 将 Jenkins 任务元数据添加流水线注解中。（[#254](https://github.com/kubesphere/ks-devops/issues/254)，[@JohnNiang](https://github.com/JohnNiang)）

### 问题修复

- 修复参数值过长时凭证创建和更新失败的问题。（[#123](https://github.com/kubesphere/ks-devops/pull/123)，[@shihh](https://github.com/shihaoH)）
- 修复打开并行流水线**运行记录**页签时 ks-apiserver 崩溃的问题。（[#93](https://github.com/kubesphere/ks-devops/pull/93)，[@JohnNiang](https://github.com/JohnNiang)）

### 依赖项升级

- 升级 Configuration as Code 版本到 1.53。（[#42](https://github.com/kubesphere/ks-jenkins/pull/42), [@rick](https://github.com/LinuxSuRen)）

## 安装
### 新特性

- 新增支持 Kubernetes 1.21.5 和 1.22.1，Kubernetes最低版本要求为1.19。（[#634](https://github.com/kubesphere/kubekey/pull/634)，[@pixiake](https://github.com/pixiake)）
- 新增支持自动设置容器运行时。（[#738](https://github.com/kubesphere/kubekey/pull/738)，[@pixiake](https://github.com/pixiake)）
- 新增支持自动更新 Kubernetes 证书。（[#705](https://github.com/kubesphere/kubekey/pull/705)，[@pixiake](https://github.com/pixiake)）
- 新增支持使用二进制文件安装 Docker 和 conatinerd。（[#657](https://github.com/kubesphere/kubekey/pull/657)，[@pixiake](https://github.com/pixiake)）
- 新增支持 Flannel VxLAN 和直接路由。（[#606](https://github.com/kubesphere/kubekey/pull/606)，[@kinglong08](https://github.com/kinglong08)）
- 新增支持使用二进制文件部署 etcd。（[#634](https://github.com/kubesphere/kubekey/pull/634)，[@pixiake](https://github.com/pixiake)）
- 新增内部负载均衡器用于部署高可用系统。（[#567](https://github.com/kubesphere/kubekey/pull/567)，[@24sama](https://github.com/24sama)）

### 问题修复

- 修复 `runtime.RawExtension` 序列化错误。（[#731](https://github.com/kubesphere/kubekey/pull/731)，[@pixiake](https://github.com/pixiake)）
- 修复集群升级期间出现的空指针错误。（[#684](https://github.com/kubesphere/kubekey/pull/684)，[@24sama](https://github.com/24sama)）
- 新增支持更新 Kubernetes 1.20.0 及以上版本的证书。（[#690](https://github.com/kubesphere/kubekey/pull/690)，[@24sama](https://github.com/24sama)）
- 修复 DNS 地址配置错误。（[#637](https://github.com/kubesphere/kubekey/pull/637)，[@pixiake](https://github.com/pixiake)）
- 修复缺少默认网关地址时出现的集群创建错误。（[#661](https://github.com/kubesphere/kubekey/pull/661)，[@liulangwa](https://github.com/liulangwa)）

## 用户体验

- 修复语言错误并优化措辞。（[@Patrick-LuoYu](https://github.com/Patrick-LuoYu)、[@Felixnoo](https://github.com/Felixnoo)、[@serenashe](https://github.com/serenashe)）
- 修复错误的功能说明。（[@Patrick-LuoYu](https://github.com/Patrick-LuoYu)、[@Felixnoo](https://github.com/Felixnoo)、[@serenashe](https://github.com/serenashe)）
- 删除硬编码和拼接 UI 字符串，以更好地支持 UI 本地化和国际化。（[@Patrick-LuoYu](https://github.com/Patrick-LuoYu)、[@Felixnoo](https://github.com/Felixnoo)、[@serenashe](https://github.com/serenashe)）
- 添加条件语句以显示正确的英文单复数形式。（[@Patrick-LuoYu](https://github.com/Patrick-LuoYu)、[@Felixnoo](https://github.com/Felixnoo)、[@serenashe](https://github.com/serenashe)）
- 优化**创建部署**对话框中的**容器组调度规则**区域。（[#2170](https://github.com/kubesphere/console/pull/2170)，[@qinyueshang](https://github.com/qinyueshang)）
- 修复**编辑项目配额**中配额值设置为无穷大时值变为 `0` 的问题。（[#2118](https://github.com/kubesphere/console/pull/2118)，[@fuchunlan](https://github.com/fuchunlan)）
- 修复**创建配置字典**对话框中数据条目为空时锤子图标位置不正确的问题。（[#2206](https://github.com/kubesphere/console/pull/2206)，[@fuchunlan](https://github.com/fuchunlan)）
- 修复项目**概览**页面时间范围下拉列表默认值显示错误的问题。（[#2340](https://github.com/kubesphere/console/pull/2340)，[@fuchunlan](https://github.com/fuchunlan)）
- 修复 `referer` URL 包含 & 字符时登录重定向失败的问题。（[#2194](https://github.com/kubesphere/console/pull/2194)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 在自定义监控面板创建页面将 **1 hours** 修改为 **1 hour**。（[#2276](https://github.com/kubesphere/console/pull/2276)，[@live77](https://github.com/live77)）
- 修复服务列表页面服务类型显示错误的问题。（[#2178](https://github.com/kubesphere/console/pull/2178), [@xuliwenwenwen](https://github.com/xuliwenwenwen)）
- 修复灰度发布任务详细信息中流量数据显示错误的问题。（[#2422](https://github.com/kubesphere/console/pull/2422)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 解决**编辑项目配额**对话框中无法设置带两位小数或大于 8 的值的问题。（[#2127](https://github.com/kubesphere/console/pull/2127)，[@weili520](https://github.com/weili520)）
- 允许通过单击窗口其他区域关闭**关于**对话框。（[#2114](https://github.com/kubesphere/console/pull/2114)，[@fuchunlan](https://github.com/fuchunlan)）
- 优化项目标题，使光标悬停在项目标题上时变为手形。（[#2128](https://github.com/kubesphere/console/pull/2128)，[@fuchunlan](https://github.com/fuchunlan)）
- 新增支持在**创建部署**对话框的**环境变量**区域创建配置字典和保密字典。（[#2227](https://github.com/kubesphere/console/pull/2227)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 新增支持在**创建部署**对话框中设置容器组注解。（[#2129](https://github.com/kubesphere/console/pull/2129)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 允许域名以星号（*）开头。（[#2432](https://github.com/kubesphere/console/pull/2432)，[@wengzhisong-hz](https://github.com/wengzhisong-hz)）
- 新增支持在**创建部署**对话框搜索 Harbor 镜像。（[#2132](https://github.com/kubesphere/console/pull/2132)，[@wengzhisong-hz](https://github.com/wengzhisong-hz)）
- 新增支持为初始化容器挂载存储卷。（[#2166](https://github.com/kubesphere/console/pull/2166)，[@Sigboom](https://github.com/Sigboom)）
- 移除存储卷扩展中过程中工作负载自动重新启动的功能。（[#4121](https://github.com/kubesphere/kubesphere/pull/4121)，[@wenhuwang](https://github.com/wenhuwang)）

## API

- 弃用 router API v1alpha2 版本。（[#4193](https://github.com/kubesphere/kubesphere/pull/4193)，[@RolandMa1986](https://github.com/RolandMa1986)）
- 将流水线 API 版本从 v2 升级到 v3。（[#2323](https://github.com/kubesphere/console/pull/2323)，[@harrisonliu5](https://github.com/harrisonliu5)）
- 更改保密字典校验 API。（[#2368](https://github.com/kubesphere/console/pull/2368)，[@harrisonliu5](https://github.com/harrisonliu5)）
- OAuth2 Token endpoint 需要客户端凭证。（[#3525](https://github.com/kubesphere/kubesphere/pull/3525)，[@wansir](https://github.com/wansir)）

## 组件更改

- kubefed: v0.7.0 -> v0.8.1
- prometheus-operator: v0.42.1 -> v0.43.2
- notification-manager: v1.0.0 -> v1.4.0
- fluent-bit: v1.6.9 -> v1.8.3
- kube-events: v0.1.0 -> v0.3.0
- kube-auditing: v0.1.2 -> v0.2.0
- istio: 1.6.10 -> 1.11.1
- jaeger: 1.17 -> 1.27
- kiali: v1.26.1 -> v1.38
- KubeEdge: v1.6.2 -> 1.7.2
