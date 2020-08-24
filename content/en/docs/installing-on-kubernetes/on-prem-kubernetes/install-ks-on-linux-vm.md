---
title: "VmWare Installation"
keywords: 'kubernetes, kubesphere, VmWare, installation'
description: 'How to install KubeSphere on VmWare Linux machines'


weight: 2240
---


# 1、Prepare Environment

## 1.1 Lab

| Role       | IP address          | hostname       | docker version | hardware | 系统          | 内核                       |
| ---------- | ------------------- | -------------- | -------------- | -------- | ------------- | -------------------------- |
| **master** | **192.168.144.131** | **k8s-master** | **18.09.9**    | **2c4g** | **CentOS7.7** | **3.10.0-1062.el7.x86_64** |
| **node1**  | **192.168.144.136** | **k8s-node1**  | **18.09.9**    | **2c4g** | **CentOS7.7** | **3.10.0-1062.el7.x86_64** |
| **node2**  | **192.168.144.135** | **k8s-node2**  | **18.09.9**    | **2c4g** | **CentOS7.7** | **3.10.0-1062.el7.x86_64** |

assign ip to host, make sure the network connection is normal 

## 1.2 Configure hosts info for each node

```bash
cat >> /etc/hosts <<EOF
192.168.144.131 k8s-master
192.168.144.136 k8s-node1
192.168.144.135 k8s-node2
EOF
```

## 1.3 Disable firewall and seLinux for each node

```bash
// Disable firewall
systemctl stop firewalld && systemctl disable firewalld

// Disable selinux
# alter temperate
setenforce 0

#change forever, you could make it after restart
sed -i '7s/enforcing/disabled/' /etc/selinux/config
```

## 1.4 Create `/etc/sysctl.d/k8s.conf` file，add this for each node

```bash
//add this content to file
cat >/etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

// execute this command
modprobe br_netfilter && sysctl -p /etc/sysctl.d/k8s.conf
```

## 1.5 install ipvs for node

**Create`/etc/sysconfig/modules/ipvs.modules`file var script，ensure that the node can auto load module when node restart。Use`lsmod | grep -e ip_vs -e nf_conntrack_ipv4` command to look whether to load kernel module correctly**

```bash
//write this content to file
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF

// change permission and have a look whether have load the kernel module correctly
chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4

------------------------------------------------------------------------------------------
nf_conntrack_ipv4      15053  0 
nf_defrag_ipv4         12729  1 nf_conntrack_ipv4
ip_vs_sh               12688  0 
ip_vs_wrr              12697  0 
ip_vs_rr               12600  0 
ip_vs                 145497  6 ip_vs_rr,ip_vs_sh,ip_vs_wrr
nf_conntrack          133095  2 ip_vs,nf_conntrack_ipv4
libcrc32c              12644  3 xfs,ip_vs,nf_conntrack
```

**install `ipset` and `ipvsadm`(in order to show the proxy rules of `ipvs`)**

```bash
yum -y install ipset ipvsadm
```

## 1.6 Sync Server time for each node

```bash
// install chrony
yum -y install chrony

// change the address of server to alicloud
sed -i.bak '3,6d' /etc/chrony.conf && sed -i '3cserver ntp1.aliyun.com iburst' \
/etc/chrony.conf

// start chronyd and add to powerboot
systemctl start chronyd && systemctl enable chronyd

// check 
chronyc sources

210 Number of sources = 4
MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^* 111.230.189.174               2   9   377   415  -3773us[-3874us] +/-   31ms
^- sv1.ggsrv.de                  2   9   167   410    -16ms[  -16ms] +/-  120ms
^+ dns1.synet.edu.cn             2   9   377   414  +3681us[+3681us] +/-   34ms
^- tick.ntp.infomaniak.ch        1   9   177   407  -9818us[-9818us] +/-  121ms
```

## 1.7 close swap partition for each node

**Change `etc/fstab`file, and make annotation the auto mount of `swap`,use `free -m` to make sure `swap` has done**

```bash
// close swap by hand
swapoff -a

// change fstab file
sed -i '/^\/dev\/mapper\/centos-swap/c#/dev/mapper/centos-swap swap                    swap    defaults        0 0' /etc/fstab

// check swap has done or not
free -m
```

**change `swappiness`,change `/etc/sysctl.d/k8s.conf` add one line**

```bash
cat >>/etc/sysctl.d/k8s.conf <<EOF
vm.swappiness=0
EOF

// make it works
sysctl -p /etc/sysctl.d/k8s.conf

net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
```

## 1.8 install docker18.09.9 for each node

```bash
1.add alicloud yum source
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

------------------------------------------------------------------------------------------
if you get this
`-bash: yum-config-manager: command not found`
you could exec `yum -y install yum-utils`
------------------------------------------------------------------------------------------
2.get available version
yum list docker-ce --showduplicates | sort -r

 * updates: mirrors.aliyun.com
Loading mirror speeds from cached hostfile
Loaded plugins: fastestmirror, langpacks
 * extras: mirrors.aliyun.com
docker-ce.x86_64            3:19.03.9-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.8-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.7-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.6-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.5-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.4-3.el7                     docker-ce-stable
docker-ce.x86_64            3:19.03.3-3.el7                     docker-ce-stable
...................

    
3.install docker18.09.9
yum -y install docker-ce-18.09.9-3.el7 docker-ce-cli-18.09.9

4.start docker and set auto start
systemctl enable docker && systemctl start docker

5.configure alicloud docker mirror speed
cat > /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://gqk8w9va.mirror.aliyuncs.com"]
}
EOF

6.after configure, restart docker
systemctl restart docker

7.show speed
docker info

find Registry Mirrors line
Registry Mirrors:
 https://gqk8w9va.mirror.aliyuncs.com/
  
10.look docker version
docker version

Client:
 Version:           18.09.9
 API version:       1.39
 Go version:        go1.11.13
 Git commit:        039a7df9ba
 Built:             Wed Sep  4 16:51:21 2019
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          18.09.9
  API version:      1.39 (minimum version 1.12)
  Go version:       go1.11.13
  Git commit:       039a7df
  Built:            Wed Sep  4 16:22:32 2019
  OS/Arch:          linux/amd64
  Experimental:     false
```

## 1.9 Change docker Cgroup Driver as systemd

```bash
# change docker Cgroup Driver to systemd
// change /usr/lib/systemd/system/docker.service line ExecStart=/usr/bin/dockerd -H fd:
// -containerd=/run/containerd/containerd.sock
// to ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock -- // exec-opt native.cgroupdriver=systemd

// if not change, you could encouter this problem
// [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The 
// recommended driver is "systemd". 
// Please follow the guide at https://kubernetes.io/docs/setup/cri/


// use this command  
sed -i.bak "s#^ExecStart=/usr/bin/dockerd.*#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd#g" /usr/lib/systemd/system/docker.service

// restart docker
systemctl daemon-reload && systemctl restart docker
```

## 1.10 install Kubeadm for each node

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

```bash
//install 1.16.9 version
yum -y install kubelet-1.16.9 kubeadm-1.16.9 kubectl-1.16.9

//show version
kubeadm version

kubeadm version: &version.Info{Major:"1", Minor:"16", GitVersion:"v1.16.9", GitCommit:"a17149e1a189050796ced469dbd78d380f2ed5ef", GitTreeState:"clean", BuildDate:"2020-04-16T11:42:30Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
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

# 2、init the cluster

## 2.1 configure  kubeadm init file for master node

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

## 2.2 init master node

**if you want to reinit，exec the command`kubeadm reset -f` and `rm -rf $HOME/.kube`**

```bash
kubeadm init --config=kubeadm-config.yaml --upload-certs

------------------------------------------------------------------------------------------
you could get this

[init] Using Kubernetes version: v1.16.9
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [localhost.localdomain kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.144.131 192.168.144.131]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [localhost.localdomain localhost] and IPs [192.168.144.131 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [localhost.localdomain localhost] and IPs [192.168.144.131 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 19.007200 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.16" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
f519943eb1ed60c35d09b65720fb2c1bc57985d16ccd6450dec475bcf6a50238
[mark-control-plane] Marking the node localhost.localdomain as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node localhost.localdomain as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: 1upxcb.5bcdacfoo0q1gts5
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of the control-plane node running the following command on each as root:

  kubeadm join 192.168.144.131:6443 --token 1upxcb.5bcdacfoo0q1gts5 \
    --discovery-token-ca-cert-hash sha256:15613ac8af2663996fe19b16c991c6df140eaacba061ead09016b257fd4638ce \
    --control-plane --certificate-key f519943eb1ed60c35d09b65720fb2c1bc57985d16ccd6450dec475bcf6a50238

Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use 
"kubeadm init phase upload-certs --upload-certs" to reload certs afterward.

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.144.131:6443 --token 1upxcb.5bcdacfoo0q1gts5 \
    --discovery-token-ca-cert-hash sha256:15613ac8af2663996fe19b16c991c6df140eaacba061ead09016b257fd4638ce
```

**copy kubeconfig files**

```python
//root is /root, please exec cd /root
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

## 2.3 master add node

**node1 and node2 have same operation**

**put the node ofmaster's $HOME/.kube/config file copy to node files**

```python
1.make dir，the path is /root
mkdir -p $HOME/.kube 

2.put the node of master's' config file to node1 and node2 $HOME/.kube
scp k8s-master:~/.kube/config $HOME/.kube

3.change permission
chown $(id -u):$(id -g) $HOME/.kube/config
```

**put node1 and node2 to cluster**

Here need the token and sha256 value in 2.2,  exec it for each client node

```python
kubeadm join 192.168.144.131:6443 --token 1upxcb.5bcdacfoo0q1gts5 \
    --discovery-token-ca-cert-hash sha256:15613ac8af2663996fe19b16c991c6df140eaacba061ead09016b257fd4638ce
  
------------------------------------------------------------------------------------------
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.16" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Activating the kubelet service
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

**if you forget token and sha256 value，you could show in master node using this command**

```python
// show token
kubeadm token list

------------------------------------------------------------------------------------------
TOKEN                     TTL       EXPIRES                     USAGES                   DESCRIPTION   EXTRA GROUPS
px979r.mphk9ee5ya8fgy44   20h       2020-03-18T13:49:48+08:00   authentication,signing   <none>        system:bootstrappers:kubeadm:default-node-token
            
            
// show sha256
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51

// show token and sha256
# kubeadm token create --print-join-command
kubeadm join 192.168.9.10:6443 --token 9b28zg.oyt0kvvpmtrem4bg     --discovery-token-ca-cert-hash sha256:5e7c7cd1cc1f86c0761e54b9380de22968b6b221cb98939c14ab2942223f6f51
```

**master node show node，the state is NotReady，for we have not installed internet plugin，here we install calio**[Docs](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

```python
kubectl get nodes
NAME         STATUS     ROLES    AGE     VERSION
k8s-master   NotReady   master   19m     v1.16.9
k8s-node1    NotReady   <none>   4m10s   v1.16.9
k8s-node2    NotReady   <none>   4m3s    v1.16.9
```

## 2.4 master node install the plugin calico

```python
// download file
wget https://docs.projectcalico.org/v3.8/manifests/calico.yaml
  
change 620 line to (192.168.0.0/16)
value: "10.20.0.1/16"
  

// install the plugin
kubectl apply -f calico.yaml

// later, show the state of pod
kubectl get pods -n kube-system

------------------------------------------------------------------------------------------
NAME                                      READY   STATUS    RESTARTS   AGE
calico-kube-controllers-dc6cb64cb-8sh59   1/1     Running   0          6m22s
calico-node-89s9k                         1/1     Running   0          6m22s
calico-node-dkt7w                         1/1     Running   0          6m22s
calico-node-tgg2h                         1/1     Running   0          6m22s
coredns-667f964f9b-7hrj9                  1/1     Running   0          33m
coredns-667f964f9b-8q7sh                  1/1     Running   0          33m
etcd-k8s-master                           1/1     Running   0          33m
kube-apiserver-k8s-master                 1/1     Running   0          32m
kube-controller-manager-k8s-master        1/1     Running   0          33m
kube-proxy-b2r5d                          1/1     Running   0          12m
kube-proxy-nd982                          1/1     Running   0          11m
kube-proxy-zh6cz                          1/1     Running   0          33m
kube-scheduler-k8s-master                 1/1     Running   0          32m


// show node state
[root@k8s-master ~]# kubectl get nodes 
------------------------------------------------------------------------------------------
NAME         STATUS   ROLES    AGE     VERSION
k8s-master   Ready    master   31m     v1.16.9
k8s-node1    Ready    <none>   9m46s   v1.16.9
k8s-node2    Ready    <none>   9m22s   v1.16.9
```

## 2.5 install Dashboard(Optional)

**install files and change content**

[k8s version of dashboard](https://github.com/kubernetes/dashboard/releases)

```python
// download file  v2.0.0-rc3 is for chinese，beta8 is the english version
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml

wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc3/aio/deploy/recommended.yaml  
  
// change Service to NodePort type
# add one line under 42 line
nodePort: 30001
  
# add one line under 42 line
type: NodePort
  

// origin
spec:
  ports:
    - port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard


//after
spec:
  ports:
    - port: 443
      targetPort: 8443
      nodePort: 30001   # nodeport port
  selector:
    k8s-app: kubernetes-dashboard
  type: NodePort		# type: nodeport
```

**deploy dashboard**

```python
kubectl apply -f recommended.yaml
```

**show dashboard's state and port of external internet**

```python
// show dashboard state
kubectl get pods -n kubernetes-dashboard -l k8s-app=kubernetes-dashboard

------------------------------------------------------------------------------------------
NAME                                    READY   STATUS    RESTARTS   AGE
kubernetes-dashboard-5996555fd8-2ppc5   1/1     Running   0          8m16s

// show dashboard's' port of external internet，name to kubernetes-dashboard
kubectl get svc -n kubernetes-dashboard -l k8s-app=kubernetes-dashboard

------------------------------------------------------------------------------------------
kubectl get svc -n kubernetes-dashboard -l k8s-app=kubernetes-dashboard
NAME                   TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
kubernetes-dashboard   NodePort   10.96.142.172   <none>        443:30001/TCP   8m37s
```

**access to dashboard var 30001 port，take care, it is https**

**k8s1.16.9 version，dashboard version is 2.0.0-beta8，only firefox can access**

> **Using the Firefox browser to access, because the dashboard default is a self built HTTPS certificate, the certificate is not trusted by the browser, so we need to force the redirect**

**Then create a user with global permissions to log in to the dashboard**

```python
// edit admin.yaml
cat > admin.yaml <<EOF
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: admin
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
subjects:
- kind: ServiceAccount
  name: admin
  namespace: kube-system

---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin
  namespace: kube-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
EOF

// create directly
kubectl apply -f admin.yaml

// show token
kubectl get secret -n kube-system|grep admin-token

admin-token-j7sfh                                kubernetes.io/service-account-token   3      23s


// Get the decoded string of Base64. Note that you need to use the token seen in the above command to generate a long string
kubectl get secret admin-token-j7sfh -o jsonpath={.data.token} -n kube-system |base64 -d

# Just use this command
kubectl get secret `kubectl get secret -n kube-system|grep admin-token|awk '{print $1}'` -o jsonpath={.data.token} -n kube-system |base64 -d && echo
```

## 2.6 install k8s switch namespace tools for each node

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

till now，use kubeadm install k8s 1.16.3 has **completed**！！！

# 3、k8s cluster install kubesphere

[The prerequisites for installing kubesphere on the official website are as follows](https://kubesphere.io/docs/zh-CN/installation/prerequisites/)

- `Kubernetes Version： `1.15.x ≤ K8s version ≤ 1.17.x`；
- `Helm`Version： `2.10.0 ≤ Helm Version ＜ 3.0.0`（do not support helm 2.16.0 [#6894](https://github.com/helm/helm/issues/6894)），and has installed Tiller，refer [How to install and configure Helm](https://devopscube.com/install-configure-helm-kubernetes/) （3.0 could suppose Helm v3）；
- The cluster has a default storage type (storageclass). If you have not prepared storage, please refer to [install OpenEBS create LocalPV storage type](https://kubesphere.io/docs/zh-CN/appendix/install-openebs) as test environment。
- The cluster can access the Internet. If there is no Internet, please refer to [Installing kubesphere offline in kubernetes](https://kubesphere.com.cn/docs/installation/install-on-k8s-airgapped/)。

## 3.1 install helm2.16.3(Optional)

**install helm client**

### 3.1.1 install helm client

```python
wget https://get.helm.sh/helm-v2.16.3-linux-amd64.tar.gz
```

### 3.1.2 Extract and copy the helm binary

```python
tar xf helm-v2.16.3-linux-amd64.tar.gz
cp linux-amd64/helm /usr/local/bin
```

**install tiller to server**

### 3.1.3 every node in cluster install socat

> **or u could get the error`Error: cannot connect to Tiller`**

```python
yum install -y socat 
```

### 3.1.4 init helm, deploy tiller

Tiller is deployed in the kubernetes cluster in the mode of deployment. Simply execute the `helm init` command to complete the installation. However, helm will go there by default storage.googleapis.com Pull the mirror image...... Here you need to use alicloud's warehouse to complete the installation

```python
# Add alicloud's warehouse
helm init --client-only --stable-repo-url https://aliacs-app-catalog.oss-cn-hangzhou.aliyuncs.com/charts/
  
helm repo add incubator https://aliacs-app-catalog.oss-cn-hangzhou.aliyuncs.com/charts-incubator/
  
helm repo update

# Create a server and use - I to specify the alicloud warehouse
helm init --service-account tiller --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.3  --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts

# Create TLS authentication server, reference address：#https://github.com/gjmzj/kubeasz/blob/master/docs/guide/helm.md

helm init --service-account tiller --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.3 --tiller-tls-cert /etc/kubernetes/ssl/tiller001.pem --tiller-tls-key /etc/kubernetes/ssl/tiller001-key.pem --tls-ca-cert /etc/kubernetes/ssl/ca.pem --tiller-namespace kube-system --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts    
```

### 3.1.5 Authorize tiller

> Because helm's server tiller is a deployment deployed in the kubernetes Kube system namespace, it will connect to the Kube API to create and delete applications in kubernetes.
>
> Since kubernetes version 1.6, RBAC authorization is enabled in API server. The current tiller deployment does not define an authorized serviceaccount by default, which will result in access to the API server denied. So we need to explicitly add authorization for tiller deployment.

**Create a service account and binding role for kubernetes**

```python
# Create serviceaccount
kubectl create serviceaccount --namespace kube-system tiller

# Create role binding
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
```

**Set up an account for tiller**

```python
# Use kubectl patch update API
kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}' 

# Verify authorization success
kubectl get deploy --namespace kube-system   tiller-deploy  --output yaml|grep  serviceAccount

      serviceAccount: tiller
      serviceAccountName: tiller
```

### 3.1.6 Verify tiller is installed successfully

```python
kubectl -n kube-system get pods|grep tiller
tiller-deploy-6d8dfbb696-4cbcz             1/1     Running   0          88s

// input 	
helm version
// The following results are shown as success

------------------------------------------------------------------------------------------
Client: &version.Version{SemVer:"v2.16.3", GitCommit:"1ee0254c86d4ed6887327dabed7aa7da29d7eb0d", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.16.3", GitCommit:"1ee0254c86d4ed6887327dabed7aa7da29d7eb0d", GitTreeState:"clean"}
```

### 3.1.7 uninstall helm client tiller

```python
$ helm reset 
# or
$ helm reset -f		# force delete
```

## 3.2 install nfs storage

- Official [openebs storage](https://kubesphere.io/docs/zh-CN/appendix/install-openebs/ ). It doesn't seem to work very well. Anyway, the status of the pod is always pending after I install it
- NFS storage is relatively simple, suitable for experimental environment
- Other persistent storage can also be used

[article to install nfs](https://blog.csdn.net/weixin_37546425/article/details/104290906)

> **NFS would better install on client node rather than master**

### 3.2.1 configure NFS

**client end, it has two nodes**

```python
yum -y install nfs-utils
```

**server end, master node**

```python
1. install package
yum -y install nfs-utils rpcbind

2.edit configure file
The * in the configuration file allows all network segments to be specified according to the actual situation
cat >/etc/exports <<EOF
/data *(insecure,rw,async,no_root_squash) 
EOF

3.Create a directory and modify permissions
In order to facilitate the experiment, 777 is granted to mount the directory. Please modify the directory permission and owner according to the actual situation

mkdir /data && chmod 777 /data

4.start service
systemctl enable nfs-server rpcbind && systemctl start nfs-server rpcbind
```

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

## 3.3 Install KubeSphere v3.0.0-dev on Existing Kubernetes Cluster

### 3.3.1 Prerequisites

> - Kubernetes Version: 1.15.x, 1.16.x, 1.17.x, 1.18.x;
> - CPU > 1 Core, Memory > 2 G;
> - An existing default Storage Class in your Kubernetes clusters.
> - The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters, see [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

1. Make sure your Kubernetes version is compatible by running `kubectl version` in your cluster node. The output looks as the following:

```
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
```

> Note: Pay attention to `Server Version` line, if `GitVersion` is greater than `v1.15.0`, it's good to go. Otherwise you need to upgrade your kubernetes first.

2. Check if the available resources meet the minimal prerequisite in your cluster.

```
$ free -g
              total        used        free      shared  buff/cache   available
Mem:              16          4          10           0           3           2
Swap:             0           0           0
```

3. Check if there is a default Storage Class in your cluster. An existing Storage Class is the prerequisite for KubeSphere installation.

```
$ kubectl get sc
NAME                      PROVISIONER               AGE
glusterfs (default)               kubernetes.io/glusterfs   3d4h
```

If your Kubernetes cluster environment meets all requirements mentioned above, then you can start to install KubeSphere.

### 3.3.2 To Start Deploying KubeSphere

### Minimal Installation

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

### Enable Pluggable Components

> Attention:
>
> - KubeSphere supports enable the pluggable components before or after the installation, you can refer to the [cluster-configuration.yaml](https://github.com/kubesphere/ks-installer/blob/master/deploy/cluster-configuration.yaml) for more details.
> - Make sure there is enough CPU and memory available in your cluster.

1. [Optional] Create the secret of certificate for Etcd in your Kubernetes cluster. This step is only needed when you want to enable Etcd monitoring.

> Note: Create the secret according to the actual Etcd certificate path of your cluster; If the Etcd has not been configured certificate, an empty secret needs to be created.

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

1. If you already have a minimal KubeSphere setup, you still can enable the pluggable components by editing the ClusterConfiguration of ks-installer using the following command.

> Note: Please make sure there is enough CPU and memory available in your cluster.

```
kubectl edit cc ks-installer -n kubesphere-system
```

1. Inspect the logs of installation.

```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```