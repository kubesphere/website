---
title: 'KubeSphere 网关组件（ingress-nginx）安全漏洞公告'
tag: '产品动态'
keyword: '社区, 安全, KubeSphere, 网关, 权限控制'
description: '近期，Kubernetes 官方维护的 Ingress-Nginx 控制器被发现存在多个高危漏洞，包括权限提升、信息泄露、安全绕过和目录遍历等问题。'
createTime: '2025-4-3'
author: 'KubeSphere'
image: 'https://pek3b.qingstor.com/kubesphere-community/images/ingress-nginx-zh-2025.png'
---

近期，Kubernetes 官方维护的 Ingress-Nginx 控制器被发现存在多个高危漏洞，包括权限提升、信息泄露、安全绕过和目录遍历等问题。这些漏洞影响了 KubeSphere 和 KSE 的多个版本，攻击者利用这些漏洞，可能在未经授权的情况下执行任意代码、访问敏感信息，甚至完全控制集群。

鉴于这些漏洞的严重性，建议受影响的用户立即采取措施，确保集群安全。

# KubeSphere 网关组件（ingress-nginx）安全漏洞公告

## 1. 漏洞概述

### 影响版本：
- KubeSphere & KSE v3.x 所有版本
- KubeSphere & KSE v4.1.x 所有版本

### 漏洞等级：严重
### 漏洞类型：
权限提升、信息泄露、安全绕过、目录遍历

### 相关漏洞一览：

| 漏洞编号         | 类型     | CVSS评分 | 简述                                           | 详细信息     |
|------------------|----------|----------|------------------------------------------------|--------------|
| CVE-2025-1097    | 配置注入 | 8.8（高危） | 通过 `auth-tls-match-cn` 注解注入恶意配置，可导致任意代码执行和信息泄露 | [官方链接](https://github.com/kubernetes/kubernetes/issues/131007) |
| CVE-2025-24514   | 配置注入 | 8.8（高危） | 通过 `auth-url` 注解注入恶意配置，可导致任意代码执行和信息泄露 | [官方链接](https://github.com/kubernetes/kubernetes/issues/131006) |
| CVE-2025-24513   | 目录遍历 | 4.8（中危） | Admission Controller 中的文件路径遍历，可能导致拒绝服务和信息泄露 | [官方链接](https://github.com/kubernetes/kubernetes/issues/131005)|
| CVE-2025-1974    | 远程代码执行 | 9.8（严重） | Pod网络可达的未授权远程代码执行漏洞，可导致完全控制集群 | [官方链接](https://github.com/kubernetes/kubernetes/issues/131009)|
| CVE-2025-1098    | 配置注入 | 8.8（高危） | 通过`mirror-target`和`mirror-host`注解注入恶意配置，可导致任意代码执行和信息泄露 | [官方链接](https://github.com/kubernetes/kubernetes/issues/131008) |

## 2. 漏洞影响分析

这些漏洞主要通过以下方式影响系统：
- **代码执行风险**：CVE-2025-1097、CVE-2025-24514、CVE-2025-1098 和 CVE-2025-1974 都可能导致在 ingress-nginx 控制器上下文中执行任意代码。
- **信息泄露**：由于默认情况下，ingress-nginx 控制器可访问集群内所有命名空间中的 Secrets，这可能导致敏感凭证泄露。
- **未授权访问**：特别是 CVE-2025-1974，任何能够访问 Pod 网络的攻击者无需认证即可获取集群控制权，CVSS 评分高达 9.8（严重）。
- **缓解条件**：对于 CVE-2025-24514，如果已启用 `enable-annotation-validation` 参数（v1.12.0 起默认启用），则不受该漏洞影响。


## 3. 验证是否受影响
请执行以下步骤检查您的系统是否受影响：

 **确认是否使用 ingress-nginx 组件：**


`kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx`

如果命令返回结果，表明您正在使用 ingress-nginx。

 **检查已安装的 ingress-nginx 版本：**

`kubectl exec -it -n ingress-nginx deploy/ingress-nginx-controller -- /nginx-ingress-controller --version`

受影响版本：

- `< v1.11.0`
- `v1.11.0 - v1.11.4`
- `v1.12.0`

**注意：** 如果您使用的是受影响版本，请立即采取本文档中的解决方案或缓解措施。

## 4. 解决方案
### 1. 升级（nginx 社区推荐方案）
升级至以下安全版本之一：
- v1.11.5
- v1.12.1或更高版本

### 2. 升级修复（KubeSphere 产品中的网关）

**KS/KSE v4.1.3 参考下方步骤升级网关。**

- **v4.1.3 之前的 KS/KSE：** 请先升级至 v4.1.3。

- **将Kubesphere 网关升级到 v1.0.4 版本**（Ingress-Nginx controller 版本 v1.12.1）。

**Gateway 扩展组件升级方法可参考：**[Gateway升级指南](https://ask.kubesphere.com.cn/forum/d/24664-sheng-ji-gateway-zhi-v104) 

### 3. 临时缓解措施
如无法立即升级，可执行以下临时缓解措施：

**CVE-2025-1097 缓解措施**
- 检查并移除所有 Ingress 中的 `auth-tls-match-cn `注解：

```
# 检查
kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_TLS_MATCH_CN:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-tls-match-cn'

# 移除
kubectl annotate ingress -n <命名空间> <Ingress名称> nginx.ingress.kubernetes.io/auth-tls-match-cn-
```



**CVE-2025-24514 缓解措施**
检查并移除所有 Ingress 中的 `auth-url` 注解：

```
# 检查
kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_URL:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-url'

# 移除
kubectl annotate ingress -n <命名空间> <Ingress名称> nginx.ingress.kubernetes.io/auth-url-
```


- 或启用 `enable-annotation-validation` 参数（此参数在 v1.12.0 起默认启用，但低版本需手动配置）：

```
# 检查是否启用了注解验证功能
kubectl get deployment -n ingress-nginx ingress-nginx-controller -o yaml | grep enable-annotation-validation

# 如未启用，编辑 deployment 加入参数
kubectl edit deployment -n ingress-nginx ingress-nginx-controller
# 添加 --enable-annotation-validation=true
# 保存后控制器会自动重启
```


**CVE-2025-24513 和 CVE-2025-1974 缓解措施**

KubeSphere 网关默认不开启 Admission Controller，通过以下方法检查您的网关是否开启了 Admission Controller。

**检查所有网关的 release**

`helm list -n A | grep kubesphere-router`

**查看所有 release 是否开启了 Admission Controller**

`helm get values [RELEASE_NAME] -n [RELEASE_NAMESPACE]`

如果有 `controller.admissionWebhooks.enabled` 为 true，请立即联系青云技术支持人员为您解决。

如果您自行安装了 ingress-nginx，可使用以下方法检查和解决。

- 禁用 Admission Controller（注意：这仅作为临时缓解措施，如果已升级到安全版本v1.11.5或v1.12.1，则无需禁用）：

**如果使用Helm安装ingress-nginx：**

```
# 重新安装，设置Helm参数禁用admission webhook
helm upgrade [RELEASE_NAME] ingress-nginx/ingress-nginx \
  --set controller.admissionWebhooks.enabled=false \
  -n ingress-nginx
```
**如果手动安装ingress-nginx：**

```
# 方法1：删除ValidatingWebhookConfiguration
kubectl delete validatingwebhookconfigurations ingress-nginx-admission

# 方法2：编辑Deployment或DaemonSet，移除--validating-webhook参数
kubectl edit deployment -n ingress-nginx ingress-nginx-controller
# 找到containers.args部分，删除--validating-webhook相关行
```
**重要提示：** 升级到安全版本（v1.11.5、v1.12.1或更高版本）是解决所有漏洞的完整修复方案。禁用Admission Controller仅是在无法立即升级时的临时措施。升级后应保持Admission Controller启用，以确保正常功能。

**CVE-2025-1098 缓解措施**
- 检查并移除所有 Ingress 中的 `mirror-target` 和 `mirror-host` 注解：

```
# 检查
kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,MIRROR_TARGET:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-target,MIRROR_HOST:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-host'

# 移除
kubectl annotate ingress -n <命名空间> <Ingress名称> nginx.ingress.kubernetes.io/mirror-target-
kubectl annotate ingress -n <命名空间> <Ingress名称> nginx.ingress.kubernetes.io/mirror-host-
```

## 5. 检测方法
### 可疑配置和活动检测
使用以下命令检查可能被利用的配置或可疑活动：

 1. 检查可能被用于攻击的 `auth-tls-match-cn` 注解（CVE-2025-1097）：

`kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_TLS_MATCH_CN:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-tls-match-cn'`

-  检查返回结果中是否有可疑内容，特别注意包含特殊字符如 `#`、`}}`、换行符等的注解值。

 2. 检查可能被用于攻击的 `auth-url` 注解（CVE-2025-24514）：

`kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,AUTH_URL:.metadata.annotations.nginx\.ingress\.kubernetes\.io/auth-url'`
  - 检查返回结果中是否有可疑内容，特别注意包含 #; 或换行符的URL。

 3. 检查 Admission Controller 是否开启，这与 CVE-2025-24513 和 CVE-2025-1974 相关：

`kubectl get validatingwebhookconfigurations -l app.kubernetes.io/name=ingress-nginx`
- 如果返回结果，表示 Admission Controller 已开启，可能存在被攻击的风险。

4. 检查可能被用于攻击的` mirror-target` 或 `mirror-host` 注解（CVE-2025-1098）：

`kubectl get ingress -A -o custom-columns='NAMESPACE:.metadata.namespace,NAME:.metadata.name,MIRROR_TARGET:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-target,MIRROR_HOST:.metadata.annotations.nginx\.ingress\.kubernetes\.io/mirror-host'`

- 检查返回结果中是否有可疑内容。

5. 检查 Pod 日志中是否有可疑活动：

`kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=1000 | grep -E "error|warn|critical|suspicious|unauthorized"`

- 如果发现可疑配置或活动，请立即隔离受影响的资源并联系安全团队进行进一步分析。

## 6. 安全最佳实践
- 实施严格的网关访问控制
- 配置网关路由隔离策略
- 启用 TLS
- 限制 Ingress 资源访问权限
- 启用审计日志监控
- 实施 RBAC 最小权限原则
- 定期检查和升级 ingress-nginx 控制器
- 确保admission控制器不对外暴露
- 实施网络策略限制Pod网络通信

## 7. 技术支持

如发现漏洞利用证据或需要技术支持，请联系：

- KubeSphere 安全团队：security@kubesphere.io
- GitHub Issues：[KubeSphere GitHub Issues](https://github.com/kubesphere/kubesphere/issues)


## 8. 参考信息
- [ingress-nginx 升级文档](https://kubernetes.github.io/ingress-nginx/deploy/upgrade/) 
- [Wiz Research: IngressNightmare漏洞分析](https://www.wiz.io/blog/ingress-nginx-kubernetes-vulnerabilities)
- [Kubernetes 官方博客: CVE-2025-1974简介](https://kubernetes.io/blog/2025/03/24/ingress-nginx-cve-2025-1974/)