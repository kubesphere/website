---
title: 'CKS 认证备考指南'
tag: 'KubeSphere, Kubernetes, CKS'
keywords: 'KubeSphere, Kubernetes, CKSt'
description: '本文主要介绍 CKS 认证是什么，如何备考及一些知识点。'
createTime: '2022-09-01'
author: 'scwang'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/cks-guide-cover.png'
---

## 前言

CKA 和 CKS 是 Linux 基金会联合 CNCF 社区组织的云原生技术领域权威的技术水平认证考试，考试采用实操方式进行。CKS 全称是 Certified Kubernetes Security Specialist，它在一个模拟真实的环境中测试考生对 Kubernetes 和云安全的知识。在参加 CKS 考试之前，必须已经通过 CKA（Kubernetes 管理员认证），在获得 CKA 证书之后才可以预约 CKS 考试。CKS 的考试难度相对于 CKA 提高了很多，2 个小时的考试时间很紧张，因为考试是在外网上进行，这两个考试又是实操考试，网络条件不好，很影响效率，如果不抓紧的话，很可能做不完所有实操题。提醒备考的同学善用考试软件提供的 notepad 功能，先把 yaml 文件或命令写到 notepad 里，再粘贴到 Terminal 里。

我因为上次 CKA 考试还是比较顺利，所以这次的 CKS 考试有点疏忽了，搞忘带身份证和护照，CKA/CKS 考试需要身份证 + 护照/信用卡，因此跟监考老师沟通了很久时间，最后修改了考试人姓名为中文，是用驾驶证完成的考试。意外之喜是 CKS 给我的证书是中文名的。

我这次考试的 Kubernetes 版本是 1.22，特意记录了一下考试会考到的知识点，分享给需要的同学。

> 补充：Kubernetes 1.25 开始，正式废止了 PSP，这个部分可以参考本文的记录。

## NetworkPolicy

通常使用标签选择器来选择 Pod，控制流量。所以要对 kubectl label 的使用方法熟悉起来。

```bash
$ kubectl label [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version] [options]
```

网络策略的使用方法见注释：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  # podSelector: {} 表示选择所有 pod 应用 NetworkPolicy
  podSelector: # 表示选择包含标签 role=db 的 pod 应用下面的 NetworkPolicy
    matchLabels:
      role: db
  policyTypes: # 表示 NetworkPolicy 包含 ingress 和 egress 流量规则
  - Ingress
  - Egress
  ingress: 
  # ingress 规则白名单列表，每条规则包括 from 和 ports 两个属性。
  # 如果不设置 ingress 或者 ingress 为空值，将禁止该类型流量。
  # from 和 ports 属性如果没有设置或者为空{}，表示匹配所有，这一点同 podSelector 一样。
  # inress 规则是数组，多条规则之间是 or 关系。
  # 以下示例中，第1条白名单，包含 from + ports 的组合规则，允许来自172.17网段(172.17.1除外)、或标签 project=myproject 的命名空间的所 有 pod 、或 default 命名空间下标签 role=frontend 的 pod 访问（限 tcp 6379 端口）
  - from: 
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  # 第二条白名单，只包含 from 规则，允许来自所有命名空间包含 environment=testing 标签的 pod 访问（不限端口）
  - from:
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          environment: testing
  egress: 
  # egress 规则白名单列表，同 ingress 规则一样，包含 to 和 ports 两个属性。
  # 如果不设置 egress 或者 egress 为空值，将禁止该类型流量。
  # to 和 ports 属性如果没有设置或者为空{}，表示匹配所有，这一点同 podSelector 一样。
  # egress 规则是数组，多条规则之间是 or 关系。
  # {} 代表全部放行

  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

## Apparmor

查看当前节点加载的 apparmor profile ，如果没有加载，要手工加载。

```bash
$ apparmor_status|grep nginx

$ apparmor_parser /etc/apparmor.d/nginx_apparmor
```
CKS 考试的 apparmor profile 文件内容：

```nginx
#include <tunables/global>
#nginx-profile-3  
profile nginx-profile-3 flags=(attach_disconnected) {
  #include <abstractions/base>
  file,
  # Deny all file writes.
  deny /** w,
}

```

注意： nginx-profile-3 这一行要确保注释掉，考试环境提供的可能没有注释，加载配置文件按时会报错。

```bash
$ apparmor_parser  /etc/apparmor.d/nginx_apparmor
AppArmor parser error for /etc/apparmor.d/nginx_apparmor in /etc/apparmor.d/ninx_apparmor at line 2: Found unexpected character: '-'
```

修改 Pod yaml 文件，在注释里设置为 Pod 加载 apparmor profile 。

```yaml
annotations:
  container.apparmor.security.beta.kubernetes.io/podx: localhost/nginx-profile-3
```

yaml 文件内容如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: podx
  annotations:
    container.apparmor.security.beta.kubernetes.io/podx: localhost/nginx-profile-3
spec:
  containers:
  - image: busybox
    imagePullPolicy: IfNotPresent
    name: podx
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
    resources: {}
  nodeName: node01
  dnsPolicy: ClusterFirst
  restartPolicy: Always
```

## 修复 kube-bench 发现的安全问题

kube-bench 是一个 CIS 评估工具，扫描 Kubernetes 集群存在的安全问题，基本上按照扫描结果的修复建议进行修复就可以了，系统会给出很具体的修复措施。

```bash
# 修复 kube-apiserver 安全问题
$ vi /etc/kubernetes/manifests/kube-apiserver
#修改：
--authorization-mode=Node,RBAC
#添加
--insecure-port=0
#删除
# --insecure-bind-address=0.0.0.0

#修复 kubelet 安全问题
$ vi /var/lib/kubelet/config.yaml
# 将authentication.anonymous.enabled 设置为 false
authentication:
  anonymous:
    enabled: false
# authorization.mode 设置为 Webhook
authorization:
  mode: Webhook
  
# 修复 etcd 安全问题
$ vi /etc/kubernetes/manifests/etcd.yaml
# 修改为true：
- --client-cert-auth=true

# 以上修复完成后，重新加载配置文件并重启 kubelet

$ systemctl daemon-reload
$ systemctl restart kubelet
```

## 解决 Pod 的 serviceaccount 设置错误问题

这个题要注意 serviceaccount 有个选项 **automountServiceAccountToken**, 这个选项决定是否自动挂载 Secret 到 Pod。
有这个选项，我们可以控制 Pod 创建并绑定 serviceaccount 时，不自动挂载对应的 Secret，这样 Pod 就没有权限访问 apiserver，提高了业务 Pod 的安全性。 

可以在 serviceaccount 和 Pod 的 spec 里设置，Pod 的设置优先于 serviceaccount 里的设置。

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backend-sa 
  namespace: qa 
automountServiceAccountToken: false
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: backend
  namespace: qa
spec:
  serviceAccountName: backend-sa
  containers:
  - image: nginx:1.9
    imagePullPolicy: IfNotPresent
    name: backend
```
删除未使用的 serviceaccount

## 设置默认网络策略

这道题是送分题，设置默认拒绝所有出站和入站的 Pod 流量，基本上可以参考官网的案例直接改一下名字就可以了。

[默认网络策略](https://kubernetes.io/zh/docs/concepts/services-networking/network-policies/#%E9%BB%98%E8%AE%A4%E6%8B%92%E7%BB%9D%E6%89%80%E6%9C%89%E5%85%A5%E5%8F%A3%E5%92%8C%E6%89%80%E6%9C%89%E5%87%BA%E7%AB%99%E6%B5%81%E9%87%8F)

## RBAC

这道题也基本是送分题，参考官网文档，根据题目要求，设置 role 的 资源访问权限，绑定到 serviceaccount 就可以了。

[RBAC](https://kubernetes.io/zh/docs/reference/access-authn-authz/rbac/#role-and-clusterole)

## 日志审计

这道题稍复杂，需要按照要求启动日志审计，包括两个步骤：

(1) 编写日志审计策略文件。

[日志审计策略](https://kubernetes.io/zh/docs/tasks/debug-application-cluster/audit/#audit-policy)。

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
omitStages:
  - "RequestReceived"
rules:
  - level: RequestResponse   
    resources:
    - group: ""
      resources: ["namespaces"]
  
  - level: Request
    resources:
    - group: ""
      resources: ["persistentvolumes"] 
    namespaces: ["front-apps"]

  - level: Metadata
    resources:
    - group: ""
      resources: ["secrets", "configmaps"]

  - level: Metadata
    omitStages:
      - "RequestReceived"
```

(2) 修改 kube-apiserver.yaml 配置文件，启用日志审计策略，日志策略配置文件位置、日志文件存储位置、循环周期。

[启动日志配置](https://kubernetes.io/zh/docs/tasks/debug-application-cluster/audit/#log-%E5%90%8E%E7%AB%AF)

```yaml
# /etc/kubernetes/manifests/kube-apiserver.yaml

...
# 设置日志审计策略文件在 pod 里的 mount 位置
- --audit-policy-file=/etc/kubernetes/logpolicy/sample-policy.yaml

# 设置日志文件存储位置
- --audit-log-path=/var/log/kubernetes/audit-logs.txt

# 设置日志文件循环
- --audit-log-maxage=10    
- --audit-log-maxbackup=2

# mount 日志策略和日志文件的
volumeMounts:
  - mountPath: /etc/kubernetes/logpolicy/sample-policy.yaml
    name: audit
    readOnly: true
  - mountPath: /var/log/kubernetes/audit-logs.txt
    name: audit-log
    readOnly: false
volumes:
  - name: audit
    hostPath:
      path: /etc/kubernetes/logpolicy/sample-policy.yaml
      type: File
  - name: audit-log
    hostPath:
      path: /var/log/kubernetes/audit-logs.txt
      type: FileOrCreate

```

重启 kubelet。

```
$ systemctl daemon-reload
$ systemctl restart kubelet
```

## 创建 Secret

这道题考解码 Secret 的 base64 编码信息，创建新的 Secret 并 mount 到 Pod 的特定位置。

[解码 Secret](https://kubernetes.io/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret
)。

```bash
$ kubectl get secrets -n istio-system db1-test -o jsonpath={.data.username} | base64 -d >  /cks/sec/user.txt
$ kubectl get secrets -n istio-system db1-test -o jsonpath={.data.password} | base64 -d >  /cks/sec/pass.txt
```

[创建 Secret](https://kubernetes.io/zh/docs/tasks/configmap-secret/managing-secret-using-kubectl/#create-a-secret
)。

```bash
$ kubectl create secret generic db2-test -n istio-system --from-literal=username=production-instance --from-literal=password=KvLftKgs4aVH
```

[使用 Secret](https://kubernetes.io/zh/docs/concepts/configuration/secret/#using-secrets)。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
  namespace: istio-system
spec:
  containers:
  - name: dev-container
    image: nginx
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secret
  volumes:
  - name:
    secret:
      secretName: db2-test
```

## 检测 Dockerfile 的不安全指令

这道题也是送分题，主要是把 Dockerfile 里使用 root 用户的指令删除，把添加特定能力的 securityContext 安全上下文注释掉。

```dockerfile
# 删除两处
USER root

# 注释 securityContext
# securityContext:
#   {"Capabilities": {'add':{NET_BIND_SERVICE}, 'drop: []'}, 'privileged': TRUE}
```

## 运行沙箱容器

支持安全沙箱容器运行时 handler `runsc`， 我们需要创建一个 RuntimeClass 并在 Pod spec 里指定是用该 RuntimeClass。

[参考资料](https://kubernetes.io/zh/docs/concepts/containers/runtime-class/#2-%E5%88%9B%E5%BB%BA%E7%9B%B8%E5%BA%94%E7%9A%84-runtimeclass-%E8%B5%84%E6%BA%90)

- 创建 RuntimeClass
```yaml
apiVersion: node.k8s.io/v1beta1
kind: RuntimeClass
metadata:
  name: untrusted 
handler: runsc
```
- 修改 server 命名空间里所有 Pod，设置 runtimeClassName

> 注意：运行中的 pod 只能修改有限的几个属性，不支持修改 RuntimeClass，需要将所有 pod 的 yaml 解析出来，修改 yaml 后，再重新创建 pod

还需要修改 deployment：

```yaml
    spec:。
      runtimeClassName: untrusted 
      containers:
      - image: vicuu/nginx:host
        imagePullPolicy: IfNotPresent
        name: nginx-host
```

## 删除不符合最佳实践的 Pod

[参考链接](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)

1. 删除启用了特权的 Pod

主要是检查 Pod 是否含 privileged: true

```bash
$ kubectl get po xxx -n production -o yaml| grep -i "privileged: true"
```

2. 删除有状态 Pod

```bash
$ kubectl get pods XXXX -n production -o jsonpath={.spec.volumes} | jq
```

## 扫描镜像安全漏洞并删除使用有安全漏洞镜像的 Pod

这道题考察对于镜像扫描工具 trivy 的使用

```bash
# 获取镜像名
$ kubect get pod XXXX -n kamino -o yaml | grep image
# 扫描镜像
$ trivy image -s HIGH,CRITICAL imagename
# kubectl delete po xxx
```

## 使用 sysdig 检查容器里里的异常进程

本体考察是否掌握 sysdig 的基本用法，记住两个帮助命令：

- sysdig -h 查看 sysdig 帮助
- sysdig -l 查看 sysdig 支持的元数据

另外 sysdig 支持指定 Containerid 分析特定容器。

```bash
# 查看容器id
$ docker ps |grep tomcat
$ sysdig -M 30 -p "*%evt.time,%user.uid,%proc.name" container.id=xxxx>opt/DFA/incidents/summary
```

## PodSecurityPolicy

这道题考察是否掌握 PSP 的用法。包括 5 步骤。

(1) 创建 PSP。

[参考链接](https://kubernetes.io/zh/docs/concepts/policy/pod-security-policy/#example)

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restrict-policy
spec:
  privileged: false 
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  runAsUser:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  volumes:
  - '*'
```
(2) 创建 clusterrole，使用 PSP

```bash
$ kubectl create clusterrole restrict-access-role --verb=use --resource=psp --resource-name=restrict-policy
```

(3) 创建 serviceaccount

```bash
$ kubectl create sa psp-denial-sa -n staging
```

(4) 绑定 clusterrole 到 serviceaccount

```bash
$ kubectl create clusterrolebinding dany-access-bind --clusterrole=restrict-access-role --serviceaccount=staging:psp-denial-sa
```

(5) 启用 PodSecurityPolicy

```bash
$ vi /etc/kubernetes/manifests/kube-apiserver.yaml 
#确保有以下内容：
- --enable-admission-plugins=NodeRestriction,PodSecurityPolicy
```

## 启用 API server 认证

这道题同前面 kube-bench 的考核内容有点重合，题目中是用 kubeadm 创建的  Kubernetes 服务器权限设置有问题，允许未经授权的访问。

[参考链接](https://kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-apiserver/)

需要进行以下修改：

- 使用 Node,RBAC 授权模式和 NodeRestriction 准入控制器。

```bash
$ vi /etc/kubernetes/manifests/kube-apiserver.yaml
# 确保以下内容
- --authorization-mode=Node,RBAC
- --enable-admission-plugins=NodeRestriction
- --client-ca-file=/etc/kubernetes/pki/ca.crt
- --enable-bootstrap-token-auth=true
```

- 删除 system:anonymous 的 ClusterRolebinding 角色绑定，取消匿名用户的集群管理员权限。

```bash
$ kubectl delete clusterrolebinding system:anonymous
```

## ImagePolicyWebhook

这道题考察 ImagePolicyWebhook 准入控制器的使用，分 4 个步骤。

- 修改控制器配置文件，将未找到有效后端时的默认拒绝改为默认不拒绝。

[参考链接](https://kubernetes.io/zh/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)

```json
# /etc/kubernetes/epconfig/admission_configuration.json

{

  "imagePolicy": {
     "kubeConfigFile": "/etc/kubernetes/epconfig/kubeconfig.yaml",
     "allowTTL": 50,
     "denyTTL": 50,
     "retryBackoff": 500,
     "defaultAllow": false
  }
}
```
- 修改 控制器访问 webhook server 的 kubeconfig。

```yaml
# /etc/kubernetes/epconfig/kubeconfig.yaml

apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority: /etc/kubernetes/epconfig/webhook.pem
    server: https://acme.local:8082/image_policy  # web hook server 的地址
  name: bouncer_webhook
# 以下省略
```

- 启用 ImagePolicyWebhook。

```yaml
# /etc/kubernetes/manifests/kube-apiserver.yaml

# 启用 ImagePolicyWebhook
- --enable-admission-plugins=NodeRestriction,ImagePolicyWebhook
# 指定准入控制器配置文件
- --admission-control-config-file=/etc/kubernetes/epconfig/admission_configuration.json
# mount
    volumeMounts:
    - mountPath: /etc/kubernetes/epconfig
      name: epconfig
# 映射 volumes      
  volumes:
    - name: epconfig
    hostPath:
      path: /etc/kubernetes/epconfig
```
- 测试是否生效。

```bash
$ systemctl daemon-reload
$ systemctl restart kubelet
$ kubectl apply -f /cks/img/web1.yaml
```