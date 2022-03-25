---
title: 'Dockershim Deprecation: Is Docker Truly out of Game?'
keywords: Kubernetes, KubeSphere, Docker
description: What does dockershim deprecation mean for KubeSphere users？
tag: 'KubeSphere, Kubernetes, Docker'
createTime: '2020-12-11'
author: 'Pixiake, Feynman, Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/container-runtime.png'
---

Recently, the Kubernetes community announced it is [deprecating Docker](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation) as a container runtime after v1.20.

### Is Docker truly out of the game

Strictly speaking, what’s actually happening is that dockershim is being removed from Kubelet. In other words, Docker will not be used as the default container runtime. However, you may still integrate Docker into your environment. For more information, you can take a look at the official announcement of Kubernetes:

**[Don\'t Panic: Kubernetes and Docker](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/)**

**[Dockershim Deprecation FAQ](https://kubernetes.io/blog/2020/12/02/dockershim-faq/)**

### What does dockershim deprecation mean for KubeSphere users

Dockershim was a temporary solution proposed by the Kubernetes community to add support for Docker so that it could serve as its container runtime. Dockershim deprecation only means the code maintenance of Dockershim in the code repository of Kubernetes will stop. This is because Dockershim has become a heavy burden on the Kubernetes maintainers. After this change, the Kubernetes community will be able to maintain the Kubernetes Container Runtime Interface (CRI) only. In fact, all CRI-compliant runtimes can be the runtime for Kubernetes, such as CRI-O and containerd.

Currently, the KubeSphere [Container Platform](https://kubesphere.io/) is using Docker as the container runtime of Kubernetes. Meanwhile, it also supports any CRI-compliant implementations. For KubeSphere and Docker users, dockershim deprecation does not affect the existing KubeSphere system and will not take any toll on your cluster or on your business. KubeSphere users can continue to use Docker which has already been tested at scale.

In future releases, other KubeSphere components, such as [DevOps](https://kubesphere.io/devops/), will support these container runtimes and you will be able to use these CRI implementations.

### The next game changer: containerd, CRI-O, and iSula

![runtime](https://ap3.qingstor.com/kubesphere-website/docs/container-runtime.png)

#### containerd

[containerd](https://containerd.io/), a Cloud Native Computing Foundation graduated project, is an industry-standard container runtime with an emphasis on simplicity, robustness and portability. It manages the complete container lifecycle of its host system.

#### CRI-O

[CRI-O](https://cri-o.io), an open-source project started by Red Hat, is an implementation of the Kubernetes CRI to enable using OCI (Open Container Initiative) compatible runtimes. It allows Kubernetes to use any OCI-compliant runtime as the container runtime for running Pods.

#### iSula

[iSula](https://openeuler.org/en/docs/20.09/docs/Container/isulad-container-engine.html) is an open-source container solution with unified architecture design to meet different requirements in CT and IT fields. Lightweight containers are implemented using C/C++. They are smart, fast, and not restricted by hardware and architecture. With less noise floor overhead, the containers can be widely used.

### Deploy containerd, CRI-O, and iSula 

As KubeSphere supports any implementation of the Kubernetes CRI, you can easily deploy containerd, CRI-O or iSula and integrate one of them into KubeSphere. Note that in a multi-node cluster, the container runtime should be the same on all nodes.

#### containerd

1. Install runc.

   ```bash
   curl -OL https://github.com/opencontainers/runc/releases/download/v1.0.0-rc92/runc.amd64
   ```

   ```bash
   mv runc.amd64 /usr/local/bin/runc && chmod +x /usr/local/bin/runc
   ```

2. Download the containerd installation package.

   ```bash
   curl -OL https://github.com/containerd/containerd/releases/download/v1.4.3/containerd-1.4.3-linux-amd64.tar.gz
   ```

   ```bash
   tar -zxvf containerd-1.4.3-linux-amd64.tar.gz -C /usr/local
   ```

   ```bash
   curl -o /etc/systemd/system/containerd.service https://raw.githubusercontent.com/containerd/cri/master/contrib/systemd-units/containerd.service
   ```

3. Configure containerd.

   ```bash
   mkdir -p /etc/containerd
   ```

   ```
   cat > /etc/containerd/config.toml << EOF
   [plugins]
     [plugins."io.containerd.grpc.v1.cri"]
       sandbox_image = "kubesphere/pause:3.2"
       [plugins."io.containerd.grpc.v1.cri".registry]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
           [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
             endpoint = ["https://registry-1.docker.io"]     ## You can input your registry mirror.
   EOF
   ```

   ```bash
   systemctl enable containerd && systemctl restart containerd
   ```
   
> If `containerd config dump |grep sandbox_image` still shows `k8s.gcr.io/pause:xxx`, please add `version = 2` to the beginning of `/etc/containerd/config.toml` and run `systemctl restart containerd`.

4. Install crictl.

   ```bash
   VERSION="v1.19.0"
   ```

   ```bash
   curl -OL https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/crictl-$VERSION-linux-amd64.tar.gz
   ```

   ```bash
   sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
   ```

   ```bash
   rm -f crictl-$VERSION-linux-amd64.tar.gz
   ```

5. Configure crictl.

   ```bash
   cat > /etc/crictl.yaml << EOF
   runtime-endpoint: unix:///run/containerd/containerd.sock
   image-endpoint: unix:///run/containerd/containerd.sock
   timeout: 2
   debug: false
   pull-image-on-create: false
   EOF
   ```

#### CRI-O

1. Download and install CRI-O.

   ```bash
   yum install git make
   ```

   ```bash
   curl -OL https://github.com/cri-o/cri-o/releases/download/v1.18.4/crio-v1.18.4.tar.gz
   ```

   ```bash
   tar -zxf crio-v1.18.4.tar.gz
   ```

   ```bash
   cd crio-v1.18.4
   ```

   ```bash
   mkdir -p /etc/crio /opt/cni/bin /usr/local/share/oci-umount/oci-umount.d /usr/local/lib/systemd/system
   ```

   ```bash
   make install
   ```

   ```bash
   echo "fs.may_detach_mounts=1" >> /etc/sysctl.conf
   ```

   ```bash
   sysctl -p
   ```

2. Configure CRI-O.

   ```bash
   vi /etc/crio/crio.conf
   ```

   Navigate to the following fields and make changes.

   ```bash
   pause_image = "kubesphere/pause:3.2"
   registries = [
     "docker.io"       ## You can input your registry mirror.
   ]
   ```

3. Start CRI-O.

   ```bash
   systemctl enable crio && systemctl restart crio
   ```

#### iSula (openEuler 20.09)

1. Install iSula on openEuler 20.09.

   ```bash
   yum install iSulad -y
   ```

2. Configure iSula.

   ```bash
   vim /etc/isulad/daemon.json
   ```

3. Navigate to the following fields and make changes.

   ```bash
   "registry-mirrors": [
       "docker.io"           ## You can input your registry mirror.
    ]
   "pod-sandbox-image": "kubesphere/pause:3.2"
   "network-plugin": "cni"
   "cni-bin-dir": "/opt/cni/bin"
   "cni-conf-dir": "/etc/cni/net.d"
   ```

4. Start iSula.

   ```bash
   systemctl enable isulad && systemctl restart isulad
   ```

### Deploy Kuberenetes and KubeSphere using KubeKey

We can use the open-source tool [KubeKey](https://github.com/kubesphere/kubekey) to quickly deploy both Kubernetes and KubeSphere.

1. Download KubeKey v1.1.0-alpha.1 to create a cluster. This is an alpha version and future releases will also support the integration of different container runtimes.

   ```bash
   curl -OL https://github.com/kubesphere/kubekey/releases/download/v1.1.0-alpha.1/kubekey-v1.1.0-alpha.1-linux-amd64.tar.gz
   ```

   ```bash
   tar -zxvf  kubekey-v1.1.0-alpha.1-linux-amd64.tar.gz
   ```

2. Make `kk` executable.

   ```bash
   chmod +x kk
   ```

3. Create a configuration file. For example, run the following command to create the configuration for KubeSphere v3.0.0.

   ```bash
   ./kk create config --with-kubesphere v3.2.1
   ```

4. Edit the configuration file (default file name: `config-sample.yaml`). 

   ```bash
   $ vi config-sample.yaml
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   ...
     kubernetes:
       version: v1.17.9
       imageRepo: kubesphere
       clusterName: cluster.local
       containerManager: containerd ## Input the container runtime: containerd/crio/isula
   ...
   ```

   {{< notice note >}}

   For more information about the configuration file and installation, see [Multi-node Installation](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/#step-3-create-a-cluster).

   {{</ notice >}} 

5. Create a cluster.

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

### Access the KubeSphere console to verify the runtime

After you deploy the cluster, you can access the web console of KubeSphere. On the **Cluster Management** page, check the container runtime that your cluster is using.

![cluster-management](https://ap3.qingstor.com/kubesphere-website/docs/20201211153052.png)

#### containerd

![containerd](https://ap3.qingstor.com/kubesphere-website/docs/containerd.jpg)

#### **CRI-O**

![crio](https://ap3.qingstor.com/kubesphere-website/docs/20201211171940.png)

#### iSula on openEuler 20.09

![isula](https://ap3.qingstor.com/kubesphere-website/docs/20201211182531.png)

### Reference

[KubeSphere GitHub](https://github.com/kubesphere/kubesphere)

[Kubernetes Blog](https://kubernetes.io/blog/2020/12/02/dockershim-faq/)

[KubeSphere Documentation](https://kubesphere.io/docs/)
