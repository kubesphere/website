---
title: "4.1.1 版本说明"
keywords: "Kubernetes, KubeSphere, 版本说明"
description: "KubeSphere 4.1.1 版本说明"
linkTitle: "4.1.1 版本说明"
weight: 45
---
## KubeSphere

### 新特性

- 基于全新微内核架构 KubeSphere LuBan 重构
- 内置 KubeSphere 扩展市场
- 支持通过扩展中心统一管理扩展组件
- 支持 UI、API 扩展
- 支持通过 kubeconfig 一键导入 member 集群
- 支持 KubeSphere 服务帐户
- 支持动态扩展 Resource API
- 支持添加集群、企业空间、项目到快捷访问
- 支持通过容器终端进行文件上传和下载
- 支持适配不同厂商的云原生网关（Kubernetes Ingress API）
- 支持 API 限流
- 支持在页面创建持久卷

### 优化

- 创建企业空间时支持选取所有集群
- 优化 web kubectl，支持 pod 动态回收、切换集群时支持模糊搜索
- 优化节点管理列表，将默认排序修改为升序
- 仅允许受信的 OAuth Client 直接使用用户名和密码对用户身份进行校验
- 精简 member 集群中部署的 Agent 组件
- 拆分 KubeSphere Config 中部分配置作为独立的配置项
- 容器镜像搜索调整为按时间倒序进行排序
- 支持编辑用户别名
- 集群列表新增调度状态的展示
- 配置字典详情页支持 binaryData 数据显示
- 重构工作台管理页面
- 删除不必要的扩展组件
- 支持通过 helm 快速部署和卸载
- 简化成员集群中 agent 的部署
- 支持禁用控制平面节点终端
- 支持主动触发集群资源同步
- 集群下工作负载页面的用户体验优化
- 应用列表页的用户体验优化
- 持久卷声明和存储类列表页的用户体验优化
- 资源名超长显示优化
- 支持全局开启 fieldValidation
- 集群节点的列表页支持横向移动

### 缺陷修复

- 修复节点终端一直显示 connecting 的问题
- 修复潜在的企业空间资源越权访问的问题
- 修复潜在的企业空间集群授权 API 越权访问的问题
- 修复因错误配置导致会话异常登出的问题
- 修复添加镜像服务信息从指定仓库拉取镜像时异常的问题
- 编辑保密字典编辑时 ownerReferences 丢失的问题
- 修复首次登录白屏和页面错误重定向的问题
- 修复 Windows 环境下，选择框滚动的问题
- 修复当 cluster-admin 登录时找不到集群管理入口的问题
- 修复 kubectl 容器终端关闭 pod 未停止的问题
- 修复 kubeconfig 下载时无法选择集群的问题
- 修复部分列表中资源名称过长无法完全显示的问题
- 修复部分页面文本翻译缺失的问题
- 修复容器详情页显示空白的问题
- 修复创建镜像服务地址选 https 时，默认跳过证书验证的问题
- 修复 member 集群的服务账户无法编辑项目角色的问题
- 修复无键值对的配置字典无法编辑设置的问题
- 修复 member 集群的配置字典无法编辑、删除键值对数据的问题
- 修复集群管理页面，移除未就绪集群时弹窗的样式问题
- 修复集群管理页面，移除集群时进度条的显示问题
- 修复在“添加标签到集群”的弹窗中，搜索集群后，之前已选中的集群选中状态消失
- 修复工作负载详情页的容器组未分页的问题
- 修复扩展组件详情页面的更新日志显示 HTML 注释的问题
- 修复在某些情况下列表页面的悬浮元素显示不完整的问题
- 修复右上角错误提示显示异常的问题
- 修复“创建企业空间”弹窗的样式问题
- 修复无法搜索 Harbor（ 2.8.0 及之后的版本）镜像的问题
- 修复在 https 协议下 console 加载缓慢的问题
- 创建集群时默认指定创建者为集群管理员
- 修复删除节点的标签数据时出现异常的问题
- 修复添加 member 集群时，页面未实时更新的问题
- 添加容器上传的提示信息
- 修复选择集群时，未根据用户权限过滤集群的问题
- 修复 helm 应用部署存在潜在的权限提升、越权风险
- 修复创建应用模板时上传文件卡住
- 修复项目中创建的应用在其他项目中也可见的问题
- 修复应用仓库的 bitnami 源无法同步的问题
- 修复应用模板显示无数据的问题
- 修复无权限用户在应用商店部署应用时白屏的问题
- 修复保密字典的类型显示错误
- 修复企业空间列表的显示问题
- 修复持久卷列表的状态错误
- 修复基于快照创建 pvc 失败的问题
- 删除持久卷扩容时的无用提示
- 修复创建保密字典时类型下拉框显示错误
- 修复创建“镜像服务信息”类型的保密字典时，数据填充错误
- 修复工作负载列表不能检索全部项目的问题
- 修复工作负载中容器组的提示信息显示异常
- 修复定制资源定义页面中显示的版本不是最新版本的问题
- 修复在集群列表搜索集群时的显示问题
- 修复 EKS 环境中 web kubectl 终端无法使用的问题

### API 更新

#### API 移除

v4.1 版本将停止提供以下 API：

**多集群**

`/API_PREFIX/clusters/{cluster}/API_GROUP/API_VERSION/...` 多集群代理请求 API 被移除。请使用新的多集群代理请求路径规则代替，`/clusters/{cluster}/API_PREFIX/API_GROUP/API_VERSION/...`。

**访问控制**

- `iam.kubesphere.io/v1alpha2` API 版本被移除。请使用 `iam.kubesphere.io/v1beta1` API 版本代替。
- `iam.kubesphere.io/v1beta1` 中的显著变化：
  Role、RoleBinding、ClusterRole、ClusterRoleBinding 资源的 API Group 从 `rbac.authorization.k8s.io` 变更为 `iam.kubesphere.io`。

**多租户**

- `tenant.kubesphere.io/v1alpha1` 和 `tenant.kubesphere.io/v1alpha2` API 版本部分 API 被移除。请使用 `tenant.kubesphere.io/v1beta1` API 版本代替。
- `tenant.kubesphere.io/v1beta1` 中的显著变化：
  `Workspace` 中 `spec.networkIsolation` 被移除。

**kubectl**

- `/resources.kubesphere.io/v1alpha2/users/{user}/kubectl` 接口已移除，终端相关操作无需再调用该接口
- 用户 web kubectl 终端 API 路径从 `/kapis/terminal.kubesphere.io/v1alpha2/namespaces/{namespace}/pods/{pod}/exec` 调整为 `/kapis/terminal.kubesphere.io/v1alpha2/users/{user}/kubectl`

**gateway**

`gateway.kubesphere.io/v1alpha1` API 版本被移除。

- 配置 Ingress 查询相关网关的 API 调整为 `/kapis/gateway.kubesphere.io/v1alpha2/namespaces/{namespace}/availableingressclassscopes`。

#### API 弃用

以下 API 标记为弃用，将在未来的版本中移除：

- Cluster validation API
- Config configz API
- OAuth token review API
- Operations job rerun API
- Resources v1alpha2 API
- Resources v1alpha3 API
- Tenant v1alpha3 API
- Legacy version API

### 已知问题

- 目前不支持从 3.x 版升级到 4.x，将在后续版本支持
- 以下功能已在 KubeSphere 4.1.2 中作为扩展组件提供：
  * 监控
  * 告警
  * 通知
  * Istio
  * DevOps
  * 项目网关和集群网关
  * 卷快照
  * 网络隔离
  * 用于应用管理的 OpenPitrix
- 以下功能暂不可用，将在后续版本支持：
  * 企业空间的部门管理功能

### 其他

- 默认移除除英文和简体中文之外的所有语言选项
- 移除系统组件相关内容
