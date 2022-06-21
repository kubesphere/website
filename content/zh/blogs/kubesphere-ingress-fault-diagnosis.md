---
title: 'Kubernetes 集群中 Ingress 故障的根因诊断'
tag: 'Kubernetes, Ingress'
keywords: 'Kubernetes, KubeSphere, 集群, Ingress, 网络故障'
description: '本文记录了一次 KubeSphere 环境下的网络故障的解决过程。'
createTime: '2022-06-17'
author: 'scwang18'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-cluster-network.png'
---

> 作者：scwang18，主要负责技术架构，在容器云方向颇有研究。

## 前言

KubeSphere 是青云开源的基于 Kubernetes 的云原生分布式操作系统，提供了比较炫酷的 Kubernetes 集群管理界面，我们团队用 KubeSphere 来作为开发平台。

本文记录了一次 KubeSphere 环境下的网络故障的解决过程。

## 现象

开发同学反馈自己搭建的 Harbor 仓库总是出问题，偶尔会报 `net/http: TLS handshake timeout` ， 通过 curl 的方式访问 harbor.xxxx.cn ，也会随机频繁挂起。但是 ping 的反馈一切正常。

## 原因分析

接到错误报障后，经过了多轮分析，才最终定位到原因，应该是安装 KubeSphere 时，使用了最新版的 Kubernetes 1.23.1 。

虽然使用 ` ./kk version --show-supported-k8s` 可以看到 KubeSphere 3.2.1 可以支持 Kubernetes 1.23.1 ，但实际上只是试验性支持，有坑的。

分析过程如下：

1. 出现 Harbor registry 访问问题，下意识以为是 Harbor 部署有问题，但是在检查 Harbor core 的日志的时候，没有看到异常时有相应错误信息，甚至 info 级别的日志信息都没有。

2. 又把目标放在 Harbor portal， 查看访问日志，一样没有发现异常信息。

3. 根据访问链，继续追查 kubesphere-router-kubesphere-system ， 即 KubeSphere 版的 nginx ingress controller ，同样没有发现异常日志。

4. 尝试在集群内其他 Pod 里访问 Harbor 的集群内 Service 地址，发现不会出现访问超时问题。初步判断是 KubeSphere 自带的 Ingress 的问题。

5. 把 kubeSphere 自带的 Ingress Controller 关闭，安装 Kubernetes 官方推荐的 ingress-nginx-controller 版本， 故障依旧，而且 Ingress 日志里也没有发现异常信息。 

6. 综合上面的分析，问题应该出现在客户端到 Ingress Controller 之间，我的 Ingress Controller 是通过 NodePort 方式暴露到集群外面。因此，测试其他通过 NodePort 暴露到集群外的 service，发现是一样的故障，至此，可以完全排除  Harbor 部署问题了，基本确定是客户端到 Ingress Controller 的问题。

7. 外部客户端通过 NodePort 访问 Ingress Controller 时，会通过 kube-proxy 组件，分析 kube-proxy 的日志，发现告警信息 

```bash
can’t set sysctl net/ipv4/vs/conn_reuse_mode, kernel version must be at least 4.1
```

这个告警信息是因为我的 centos 7.6 的内核版本过低， 当前是 3.10.0-1160.21.1.el7.x86_64 ，与 Kubernetes 新版的 ipvs 存在兼容性问题。

可以通过升级操作系统的 kernel 版本可以解决。

8. 升级完 kernel 后，Calico 启动不了，报以下错误信息
```bash
ipset v7.1: kernel and userspace incompatible: settype hash:ip,port with revision 6 not supported by userspace.
```

原因是安装 KubeSphere 时默认安装的 Calico 版本是 v3.20.0 , 这个版本不支持最新版的 Linux Kernel ，升级后的内核版本是 5.18.1-1.el7.elrepo.x86_64，calico 需要升级到 v3.23.0 以上版本。

9. 升级完 Calico 版本后，Calico 继续报错
```bash
user "system:serviceaccount:kube-system:calico-node" cannot list resource "caliconodestatuses" in api group "crd.projectcalico.org"
```

还有另外一个错误信息，都是因为 clusterrole 的资源权限不足，可以通过修改 clusterrole 来解决问题。

10. 至此，该莫名其妙的网络问题解决了。

## 解决过程

根据上面的分析，主要解决方案如下：

### 升级操作系统内核

1. 使用阿里云的 yum 源

```bash
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all && yum -y update
```
2. 启用 elrepo 仓库

```bash
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm
```
3. 安装最新版本内核

```bash
yum --enablerepo=elrepo-kernel install kernel-ml
```
4. 查看系统上的所有可用内核

```bash
awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
```
5. 设置新的内核为 grub2 的默认版本

查看第4步返回的系统可用内核列表，不出意外第1个应该是最新安装的内核。

```bash
grub2-set-default 0
```
6. 生成 grub 配置文件并重启

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
reboot now
```

7. 验证

```bash
uname -r
```

### 升级 Calico

Kubernetes 上的 Calico 一般是使用 Daemonset 方式部署，我的集群里，Calico 的 Daemonset 名字是 calico-node。

直接输出为 yaml 文件，修改文件里的所有 image 版本号为最新版本 v3.23.1 。重新创建 Daemonset。

1. 输出 yaml

```bash
kubectl -n kube-system get ds  calico-node -o yaml>calico-node.yaml
```

2. calico-node.yaml：

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  labels:
    k8s-app: calico-node
  name: calico-node
  namespace: kube-system
spec:
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: calico-node
  template:
    metadata:
      creationTimestamp: null
      labels:
        k8s-app: calico-node
    spec:
      containers:
      - env:
        - name: DATASTORE_TYPE
          value: kubernetes
        - name: WAIT_FOR_DATASTORE
          value: "true"
        - name: NODENAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: spec.nodeName
        - name: CALICO_NETWORKING_BACKEND
          valueFrom:
            configMapKeyRef:
              key: calico_backend
              name: calico-config
        - name: CLUSTER_TYPE
          value: k8s,bgp
        - name: NODEIP
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: status.hostIP
        - name: IP_AUTODETECTION_METHOD
          value: can-reach=$(NODEIP)
        - name: IP
          value: autodetect
        - name: CALICO_IPV4POOL_IPIP
          value: Always
        - name: CALICO_IPV4POOL_VXLAN
          value: Never
        - name: FELIX_IPINIPMTU
          valueFrom:
            configMapKeyRef:
              key: veth_mtu
              name: calico-config
        - name: FELIX_VXLANMTU
          valueFrom:
            configMapKeyRef:
              key: veth_mtu
              name: calico-config
        - name: FELIX_WIREGUARDMTU
          valueFrom:
            configMapKeyRef:
              key: veth_mtu
              name: calico-config
        - name: CALICO_IPV4POOL_CIDR
          value: 10.233.64.0/18
        - name: CALICO_IPV4POOL_BLOCK_SIZE
          value: "24"
        - name: CALICO_DISABLE_FILE_LOGGING
          value: "true"
        - name: FELIX_DEFAULTENDPOINTTOHOSTACTION
          value: ACCEPT
        - name: FELIX_IPV6SUPPORT
          value: "false"
        - name: FELIX_HEALTHENABLED
          value: "true"
        envFrom:
        - configMapRef:
            name: kubernetes-services-endpoint
            optional: true
        image: calico/node:v3.23.1
        imagePullPolicy: IfNotPresent
        livenessProbe:
          exec:
            command:
            - /bin/calico-node
            - -felix-live
            - -bird-live
          failureThreshold: 6
          initialDelaySeconds: 10
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 10
        name: calico-node
        readinessProbe:
          exec:
            command:
            - /bin/calico-node
            - -felix-ready
            - -bird-ready
          failureThreshold: 3
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 10
        resources:
          requests:
            cpu: 250m
        securityContext:
          privileged: true
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /host/etc/cni/net.d
          name: cni-net-dir
        - mountPath: /lib/modules
          name: lib-modules
          readOnly: true
        - mountPath: /run/xtables.lock
          name: xtables-lock
        - mountPath: /var/run/calico
          name: var-run-calico
        - mountPath: /var/lib/calico
          name: var-lib-calico
        - mountPath: /var/run/nodeagent
          name: policysync
        - mountPath: /sys/fs/
          mountPropagation: Bidirectional
          name: sysfs
        - mountPath: /var/log/calico/cni
          name: cni-log-dir
          readOnly: true
      dnsPolicy: ClusterFirst
      hostNetwork: true
      initContainers:
      - command:
        - /opt/cni/bin/calico-ipam
        - -upgrade
        env:
        - name: KUBERNETES_NODE_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: spec.nodeName
        - name: CALICO_NETWORKING_BACKEND
          valueFrom:
            configMapKeyRef:
              key: calico_backend
              name: calico-config
        envFrom:
        - configMapRef:
            name: kubernetes-services-endpoint
            optional: true
        image: calico/cni:v3.23.1
        imagePullPolicy: IfNotPresent
        name: upgrade-ipam
        resources: {}
        securityContext:
          privileged: true
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /var/lib/cni/networks
          name: host-local-net-dir
        - mountPath: /host/opt/cni/bin
          name: cni-bin-dir
      - command:
        - /opt/cni/bin/install
        env:
        - name: CNI_CONF_NAME
          value: 10-calico.conflist
        - name: CNI_NETWORK_CONFIG
          valueFrom:
            configMapKeyRef:
              key: cni_network_config
              name: calico-config
        - name: KUBERNETES_NODE_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: spec.nodeName
        - name: CNI_MTU
          valueFrom:
            configMapKeyRef:
              key: veth_mtu
              name: calico-config
        - name: SLEEP
          value: "false"
        envFrom:
        - configMapRef:
            name: kubernetes-services-endpoint
            optional: true
        image: calico/cni:v3.23.1
        imagePullPolicy: IfNotPresent
        name: install-cni
        resources: {}
        securityContext:
          privileged: true
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /host/opt/cni/bin
          name: cni-bin-dir
        - mountPath: /host/etc/cni/net.d
          name: cni-net-dir
      - image: calico/pod2daemon-flexvol:v3.23.1
        imagePullPolicy: IfNotPresent
        name: flexvol-driver
        resources: {}
        securityContext:
          privileged: true
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /host/driver
          name: flexvol-driver-host
      nodeSelector:
        kubernetes.io/os: linux
      priorityClassName: system-node-critical
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      serviceAccount: calico-node
      serviceAccountName: calico-node
      terminationGracePeriodSeconds: 0
      tolerations:
      - effect: NoSchedule
        operator: Exists
      - key: CriticalAddonsOnly
        operator: Exists
      - effect: NoExecute
        operator: Exists
      volumes:
      - hostPath:
          path: /lib/modules
          type: ""
        name: lib-modules
      - hostPath:
          path: /var/run/calico
          type: ""
        name: var-run-calico
      - hostPath:
          path: /var/lib/calico
          type: ""
        name: var-lib-calico
      - hostPath:
          path: /run/xtables.lock
          type: FileOrCreate
        name: xtables-lock
      - hostPath:
          path: /sys/fs/
          type: DirectoryOrCreate
        name: sysfs
      - hostPath:
          path: /opt/cni/bin
          type: ""
        name: cni-bin-dir
      - hostPath:
          path: /etc/cni/net.d
          type: ""
        name: cni-net-dir
      - hostPath:
          path: /var/log/calico/cni
          type: ""
        name: cni-log-dir
      - hostPath:
          path: /var/lib/cni/networks
          type: ""
        name: host-local-net-dir
      - hostPath:
          path: /var/run/nodeagent
          type: DirectoryOrCreate
        name: policysync
      - hostPath:
          path: /usr/libexec/kubernetes/kubelet-plugins/volume/exec/nodeagent~uds
          type: DirectoryOrCreate
        name: flexvol-driver-host
  updateStrategy:
    rollingUpdate:
      maxSurge: 0
      maxUnavailable: 1
    type: RollingUpdate
```

### ClusterRole

还需要修改 ClusterRole ，否则 Calico 会一直报权限错。

1. 输出 yaml 

```bash
kubectl get clusterrole calico-node -o yaml >calico-node-clusterrole.yaml
```
2. calico-node-clusterrole.yaml

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: calico-node
rules:
- apiGroups:
  - ""
  resources:
  - pods
  - nodes
  - namespaces
  verbs:
  - get
- apiGroups:
  - discovery.k8s.io
  resources:
  - endpointslices
  verbs:
  - watch
  - list
- apiGroups:
  - ""
  resources:
  - endpoints
  - services
  verbs:
  - watch
  - list
  - get
- apiGroups:
  - ""
  resources:
  - configmaps
  verbs:
  - get
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
  - update
- apiGroups:
  - networking.k8s.io
  resources:
  - networkpolicies
  verbs:
  - watch
  - list
- apiGroups:
  - ""
  resources:
  - pods
  - namespaces
  - serviceaccounts
  verbs:
  - list
  - watch
- apiGroups:
  - ""
  resources:
  - pods/status
  verbs:
  - patch
- apiGroups:
  - crd.projectcalico.org
  resources:
  - globalfelixconfigs
  - felixconfigurations
  - bgppeers
  - globalbgpconfigs
  - bgpconfigurations
  - ippools
  - ipamblocks
  - globalnetworkpolicies
  - globalnetworksets
  - networkpolicies
  - networksets
  - clusterinformations
  - hostendpoints
  - blockaffinities
  - caliconodestatuses
  - ipreservations
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - crd.projectcalico.org
  resources:
  - ippools
  - felixconfigurations
  - clusterinformations
  verbs:
  - create
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - crd.projectcalico.org
  resources:
  - bgpconfigurations
  - bgppeers
  verbs:
  - create
  - update
- apiGroups:
  - crd.projectcalico.org
  resources:
  - blockaffinities
  - ipamblocks
  - ipamhandles
  verbs:
  - get
  - list
  - create
  - update
  - delete
- apiGroups:
  - crd.projectcalico.org
  resources:
  - ipamconfigs
  verbs:
  - get
- apiGroups:
  - crd.projectcalico.org
  resources:
  - blockaffinities
  verbs:
  - watch
- apiGroups:
  - apps
  resources:
  - daemonsets
  verbs:
  - get
```

## 总结

这次奇怪的网络故障，最终原因还是因为 KubeSphere 的版本与 Kubernetes 的版本不匹配。所以工作环境要稳字为先，不要冒进使用最新的版本。否则会耽搁很多时间来解决莫名其妙的问题。
