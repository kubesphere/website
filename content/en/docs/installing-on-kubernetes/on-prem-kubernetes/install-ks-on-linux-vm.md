---
title: "Install KubeSphere and Kubernetes with Kubeadm"
keywords: 'kubernetes, kubesphere, kubeadm, installation, vmware'
description: 'How to install KubeSphere and Kubernetes with Kubeadm'


weight: 2240
---

# Prepare Environment

##  Prerequisites

- One or more machines running a deb/rpm-compatible Linux OS; for example: Ubuntu or CentOS.
- 2 GiB or more of RAM per machine--any less leaves little room for your apps.
- At least 2 CPUs on the machine that you use as a control-plane node.
- Full network connectivity among all machines in the cluster. You can use either a public or a private network.

## Machines in this Lab

| Role       | IP address          | Hostname       | Docker version | Hardware | System         | Kernel                     |
| ---------- | ------------------- | -------------- | -------------- | -------- | -------------- | -------------------------- |
| **master** | **192.168.144.131** | **k8s-master** | **18.09.9**    | **2c4g** | **CentOS 7.7** | **3.10.0-1062.el7.x86_64** |
| **node**   | **192.168.144.136** | **k8s-node1**  | **18.09.9**    | **2c4g** | **CentOS 7.7** | **3.10.0-1062.el7.x86_64** |
| **node**   | **192.168.144.135** | **k8s-node2**  | **18.09.9**    | **2c4g** | **CentOS 7.7** | **3.10.0-1062.el7.x86_64** |

assign ip to host, make sure the network connection is normal 

## Configure hosts info for each node

```bash
cat >> /etc/hosts <<EOF
192.168.144.131 k8s-master
192.168.144.136 k8s-node1
192.168.144.135 k8s-node2
EOF
```

## Disable firewall and seLinux for each node

> Disable firewall
>
> ```bash
> systemctl stop firewalld && systemctl disable firewalld
> ```
>
> Disable selinux, alter temperate
>
> ```bash
> setenforce 0
> ```
>
> Change forever, you could make it after restart
>
> ```bash
> sed -i '7s/enforcing/disabled/' /etc/selinux/config
> ```

## Create /etc/sysctl.d/k8s.conf file, add this for each node

add this content to file

```bash
cat >/etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
```

execute this command

```bash
modprobe br_netfilter && sysctl -p /etc/sysctl.d/k8s.conf
```

## Install ipvs for node

Create`/etc/sysconfig/modules/ipvs.modules`file var script, ensure that the node can auto load module when node restart。Use`lsmod | grep -e ip_vs -e nf_conntrack_ipv4` command to look whether to load kernel module correctly

write this content to file

```bash
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
```

change permission and have a look whether have load the kernel module correctly

```bash
chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

**install `ipset` and `ipvsadm`(in order to show the proxy rules of `ipvs`)**

```bash
yum -y install ipset ipvsadm
```

## Sync Server time for each node

> install chrony
>
> ```bash
> yum -y install chrony
> ```
>
> change the address of server to alicloud
>
> ```bash
> sed -i.bak '3,6d' /etc/chrony.conf && sed -i '3cserver ntp1.aliyun.com iburst' \
> /etc/chrony.conf
> ```
>
> start chronyd and add to powerboot
>
> ```bash
> systemctl start chronyd && systemctl enable chronyd
> ```
>
> check 
>
> ```bash
> chronyc sources
> ```

## Close swap partition for each node

> **Change `etc/fstab`file, and make annotation the auto mount of `swap`,use `free -m` to make sure `swap` has done**
>
> close swap by hand
>
> ```bash
> swapoff -a
> ```
>
> change fstab file
>
> ```bash
> sed -i '/^\/dev\/mapper\/centos-swap/c#/dev/mapper/centos-swap swap                    swap    defaults        0 0' /etc/fstab
> ```
>
> check swap has done or not
>
> ```bash
> free -m
> ```
>
> **change `swappiness`,change `/etc/sysctl.d/k8s.conf` add one line**
>
> ```bash
> cat >>/etc/sysctl.d/k8s.conf <<EOF
> vm.swappiness=0
> EOF
> ```
>
> make it works
>
> ```bash
> sysctl -p /etc/sysctl.d/k8s.conf
> ```

## Install docker18.09.9 for each node

> add alicloud yum source
>
> ```bash
> yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
> ```
>
> get available version
>
> ```bash
> yum list docker-ce --showduplicates | sort -r
> ```
>
> install docker 18.09.9
>
> ```bash
> yum -y install docker-ce-18.09.9-3.el7 docker-ce-cli-18.09.9
> ```
>
> start docker and set auto start
>
> ```bash
> systemctl enable docker && systemctl start docker
> ```
>
> configure alicloud docker mirror speed
>
> ```bash
> cat > /etc/docker/daemon.json <<-'EOF'
> {
>   "registry-mirrors": ["https://gqk8w9va.mirror.aliyuncs.com"]
> }
> EOF
> ```
>
> after configure, restart docker
>
> ```bash
> systemctl restart docker
> ```
>
> show speed
>
> ```bash
> docker info
> ```
>
> look docker version
>
> ```bash
> docker version
> ```

## Change docker Cgroup Driver as systemd

```bash
sed -i.bak "s#^ExecStart=/usr/bin/dockerd.*#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd#g" /usr/lib/systemd/system/docker.service
```

restart docker

```bash
systemctl daemon-reload && systemctl restart docker
```

## Install Kubeadm for each node

Creating a minimum viable Kubernetes cluster that conforms to best practices. In fact, you can use `kubeadm` to set up a cluster that will pass the [Kubernetes Conformance tests](https://kubernetes.io/blog/2017/10/software-conformance-certification). `kubeadm` also supports other cluster lifecycle functions, such as [bootstrap tokens](https://kubernetes.io/docs/reference/access-authn-authz/bootstrap-tokens/) and cluster upgrades.

The `kubeadm` tool is good if you need:

- A simple way for you to try out Kubernetes, possibly for the first time.
- A way for existing users to automate setting up a cluster and test their application.
- A building block in other ecosystem and/or installer tools with a larger scope.

You can install and use `kubeadm` on various machines: your laptop, a set of cloud servers, a Raspberry Pi, and more. Whether you're deploying into the cloud or on-premises, you can integrate `kubeadm` into provisioning systems such as Ansible or Terraform

```bash
cat >/etc/yum.repos.d/kubernetes.repo<<EOF
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
```

**use alicloud yum source**

```bash
cat >/etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
        http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

**install `kubeadm, kubelet, kubectl`**

install 1.16.9 version

```bash
yum -y install kubelet-1.16.9 kubeadm-1.16.9 kubectl-1.16.9
```

show version

```bash
kubeadm version
```

**set kubelet auto start when power on**

```python
systemctl enable kubelet
```

**Set k8s command to complete automatically**

```python
yum -y install bash-completion
source /usr/share/bash-completion/bash_completion
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> ~/.bashrc
```

till now, basic environment installation has completed 

# Init the cluster

## Configure  kubeadm init file for master node

```bash
cat <<EOF > ./kubeadm-config.yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.9	
imageRepository: registry.cn-hangzhou.aliyuncs.com/google_containers

# master address
controlPlaneEndpoint: "192.168.144.131:6443"	
networking:
  serviceSubnet: "10.96.0.0/16"	

  # k8s container's subnet
  podSubnet: "10.20.0.1/16"	
  dnsDomain: "cluster.local"
EOF
```

## Init master node

**if you want to reinit, exec the command`kubeadm reset -f` and `rm -rf $HOME/.kube`**

```bash
kubeadm init --config=kubeadm-config.yaml --upload-certs
```

**copy kubeconfig files**

```python
//root is /root, please exec cd /root
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

## Master add node

**node1 and node2 have same operation**

**put the node ofmaster's $HOME/.kube/config file copy to node files**

> make dir, the path is /root
>
> ```bash
> mkdir -p $HOME/.kube 
> ```
>
> put the node of master's' config file to node1 and node2 $HOME/.kube
>
> ```bash
> scp k8s-master:~/.kube/config $HOME/.kube
> ```
>
> change permission
>
> ```bash
> chown $(id -u):$(id -g) $HOME/.kube/config
> ```

**put node1 and node2 to cluster**

Here need the token and sha256 value in 2.2,  exec it for each client node

```python
kubeadm join 192.168.144.131:6443 --token 1upxcb.5bcdacfoo0q1gts5 \
    --discovery-token-ca-cert-hash sha256:15613ac8af2663996fe19b16c991c6df140eaacba061ead09016b257fd4638ce
```

**if you forget token and sha256 value, you could show in master node using this command**

```python
// show token
kubeadm token list

// show sha256
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51

// show token and sha256
# kubeadm token create --print-join-command
kubeadm join 192.168.9.10:6443 --token 9b28zg.oyt0kvvpmtrem4bg     --discovery-token-ca-cert-hash sha256:5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51
```

**master node show node, the state is NotReady, for we have not install internet plugin, here we install calio**[Docs](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

```python
kubectl get nodes
NAME         STATUS     ROLES    AGE     VERSION
k8s-master   NotReady   master   19m     v1.16.9
k8s-node1    NotReady   <none>   4m10s   v1.16.9
k8s-node2    NotReady   <none>   4m3s    v1.16.9
```

## Master node install the plugin calico

> download file
>
> ```bash
> wget https://docs.projectcalico.org/v3.8/manifests/calico.yaml
> 
> // change 620 line to (192.168.0.0/16)
> // value: "10.20.0.1/16"
> ```
>
> install the plugin
>
> ```bash
> kubectl apply -f calico.yaml
> ```
>
> later, show the state of pod
>
> ```bash
> kubectl get pods -n kube-system
> ```
>
> show node state
>
> ```bash
> kubectl get nodes 
> ```

## Install k8s switch namespace tools for each node

```python
git clone https://github.com.cnpmjs.org/ahmetb/kubectx
cp kubectx/kubens /usr/local/bin

# show all namespaces
kubens

# switch to kube-system namespace
kubens kube-system

Context "kubernetes-admin@kubernetes" modified.
Active namespace is "kube-system".
```

till now, use kubeadm install k8s 1.16.3 has **completed**

# K8s cluster install kubesphere

[The prerequisites for installing kubesphere on the official website are as follows](https://kubesphere.io/docs/zh-CN/installation/prerequisites/)

- `Kubernetes Version： `1.15.x ≤ K8s version ≤ 1.17.x`；
- `Helm`Version： `2.10.0 ≤ Helm Version ＜ 3.0.0`（do not support helm 2.16.0 [#6894](https://github.com/helm/helm/issues/6894)）, and has installed Tiller, refer [How to install and configure Helm](https://devopscube.com/install-configure-helm-kubernetes/) （3.0 could suppose Helm v3）；
- The cluster has a default storage type (storageclass). If you have not prepared storage, please refer to [install OpenEBS create LocalPV storage type](https://kubesphere.io/docs/zh-CN/appendix/install-openebs) as test environment。
- The cluster can access the Internet. If there is no Internet, please refer to [Installing kubesphere offline in kubernetes](https://kubesphere.com.cn/docs/installation/install-on-k8s-airgapped/)。

## Install nfs storage

- Official [openebs storage](https://kubesphere.io/docs/zh-CN/appendix/install-openebs/ ). It doesn't seem to work very well. Anyway, the status of the pod is always pending after I install it
- NFS storage is relatively simple, suitable for experimental environment
- Other persistent storage can also be used

[article to install nfs](https://blog.csdn.net/weixin_37546425/article/details/104290906)

> **NFS would better install on client node rather than master**

### Configure NFS

**client end, it has two nodes**

```python
yum -y install nfs-utils
```

**server end, master node**

> install package
>
> ```bash
> yum -y install nfs-utils rpcbind
> ```
>
> edit configure file
> The * in the configuration file allows all network segments to be specified according to the actual situation
>
> ```bash
> cat >/etc/exports <<EOF
> /data *(insecure,rw,async,no_root_squash) 
> EOF
> ```
>
> Create a directory and modify permissions. In order to facilitate the experiment, 777 is granted to mount the directory. Please modify the directory permission and owner according to the actual situation
>
> ```bash
> mkdir /data && chmod 777 /data
> ```
>
> start service
>
> ```bash
> systemctl enable nfs-server rpcbind && systemctl start nfs-server rpcbind
> ```

**Configure the storageclass and pay attention to modifying the NFS server IP and shared directory(master node)**

```python
cat >storageclass.yaml <<EOF
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-provisioner
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
   name: nfs-provisioner-runner
   namespace: default
rules:
   -  apiGroups: [""]
      resources: ["persistentvolumes"]
      verbs: ["get", "list", "watch", "create", "delete"]
   -  apiGroups: [""]
      resources: ["persistentvolumeclaims"]
      verbs: ["get", "list", "watch", "update"]
   -  apiGroups: ["storage.k8s.io"]
      resources: ["storageclasses"]
      verbs: ["get", "list", "watch"]
   -  apiGroups: [""]
      resources: ["events"]
      verbs: ["watch", "create", "update", "patch"]
   -  apiGroups: [""]
      resources: ["services", "endpoints"]
      verbs: ["get","create","list", "watch","update"]
   -  apiGroups: ["extensions"]
      resources: ["podsecuritypolicies"]
      resourceNames: ["nfs-provisioner"]
      verbs: ["use"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-provisioner
    namespace: default
roleRef:
  kind: ClusterRole
  name: nfs-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Deployment
apiVersion: apps/v1
metadata:
  name: nfs-client-provisioner
spec:
  selector:
    matchLabels:
      app: nfs-client-provisioner
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccount: nfs-provisioner
      containers:
        - name: nfs-client-provisioner
          image: quay.io/external_storage/nfs-client-provisioner:latest
          imagePullPolicy: IfNotPresent
          volumeMounts:
            - name: nfs-client
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: fuseim.pri/ifs
            - name: NFS_SERVER
              value: 192.168.144.131
            - name: NFS_PATH
              value: /data   # this is nfs sharing path
      volumes:
        - name: nfs-client
          nfs:
            server: 192.168.144.131
            path: /data   # this is nfs sharing path
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-storage
provisioner: fuseim.pri/ifs
reclaimPolicy: Retain
EOF
```

**create storageclass**

```python
kubectl apply -f storageclass.yaml
```

**set default strorageclass**

```python
kubectl patch storageclass nfs-storage -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

**check nfs-client pod state**

```python
# This is created under the default namespace, it may take long time
kubectl get pods

NAME                                      READY   STATUS    RESTARTS   AGE
nfs-client-provisioner-7b9746695c-nrz4n   1/1     Running   0          2m38s
```

**check default storage**

```python
# This is created under the default namespace
kubectl get sc

NAME                    PROVISIONER      AGE
nfs-storage (default)   fuseim.pri/ifs   7m22s
```

## Install KubeSphere v3.0.0-dev on Existing Kubernetes Cluster

### Prerequisites

> - Kubernetes Version: 1.15.x, 1.16.x, 1.17.x, 1.18.x;
> - CPU > 1 Core, Memory > 2 G;
> - An existing default Storage Class in your Kubernetes clusters.
> - The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters, see [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

Make sure your Kubernetes version is compatible by running `kubectl version` in your cluster node. The output looks as the following:

```
kubectl version
```

> Note: Pay attention to `Server Version` line, if `GitVersion` is greater than `v1.15.0`, it's good to go. Otherwise you need to upgrade your kubernetes first.

Check if the available resources meet the minimal prerequisite in your cluster.

```
free -g
              total        used        free      shared  buff/cache   available
Mem:              16          4          10           0           3           2
Swap:             0           0           0
```

Check if there is a default Storage Class in your cluster. An existing Storage Class is the prerequisite for KubeSphere installation.

```
kubectl get sc
```

If your Kubernetes cluster environment meets all requirements mentioned above, then you can start to install KubeSphere.

### To Start Deploying KubeSphere

 **Minimal Installation**

```
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/kubesphere-installer.yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/deploy/cluster-configuration.yaml
```

> if you get `The connection to the server raw.githubusercontent.com was refused`
>
> you could `sudo vim /etc/hosts`, and add `151.101.76.133 raw.githubusercontent.com`

Then inspect the logs of installation.

```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

When all Pods of KubeSphere are running, it means the installation is successful. Check the port (30880 by default) of the console service by the following command. Then you can use `http://IP:30880` to access the console with the default account `admin/P@88w0rd`.

```
kubectl get svc/ks-console -n kubesphere-system
```

Enable Pluggable Components

> Attention:
>
> - KubeSphere supports enable the pluggable components before or after the installation, you can refer to the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml) for more details.
> - Make sure there is enough CPU and memory available in your cluster.

[Optional] Create the secret of certificate for Etcd in your Kubernetes cluster. This step is only needed when you want to enable Etcd monitoring.

> Note: Create the secret according to the actual Etcd certificate path of your cluster; If the Etcd has not been configured certification, an empty secret needs to be created.

- If the Etcd has been configured with certificates, refer to the following step (The following command is an example that is only used for the cluster created by `kubeadm`):

```
$ kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs  \
--from-file=etcd-client-ca.crt=/etc/kubernetes/pki/etcd/ca.crt  \
--from-file=etcd-client.crt=/etc/kubernetes/pki/etcd/healthcheck-client.crt  \
--from-file=etcd-client.key=/etc/kubernetes/pki/etcd/healthcheck-client.key
```

- If the Etcd has not been configured with certificates.

```
kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs
```

If you already have a minimal KubeSphere setup, you still can enable the pluggable components by editing the ClusterConfiguration of ks-installer using the following command.

> Note: Please make sure there is enough CPU and memory available in your cluster.

```
kubectl edit cc ks-installer -n kubesphere-system
```

Inspect the logs of installation.

```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```