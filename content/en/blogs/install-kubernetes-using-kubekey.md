---
title: 'KubeKey: A Lightweight Installer for Kubernetes and Cloud Native Addons'
keywords: Kubernetes, KubeSphere, KubeKey, addons, installer
description: KubeKey allows you to deploy a Kubernetes cluster in the most graceful and efficient way.
tag: 'KubeSphere, Kubernetes, KubeKey, addons, installer'
createTime: '2021-01-07'
author: 'Sherlock'
snapshot: 'https://ap3.qingstor.com/kubesphere-website/docs/KubeKey-lightweight-installer.png'
---

As Kubernetes is the de-facto standard in container orchestration, the installation of Kubernetes has remained one of the top challenges facing Kubernetes users, especially neophytes. Apart from Kubernetes itself, they also need to figure out how to install different tools required for the installation, such as kubelet, kubeadm and kubectl. They have been wondering if there is a tool that contains all the stacks so that they can just run only few commands for the installation.

In this article, I am going to demonstrate how to set up a three-node Kubernetes cluster using KubeKey.

## What is KubeKey

Developed in Go, [KubeKey](https://github.com/kubesphere/kubekey) provides an easy, fast and flexible way to install Kubernetes and any add-ons that can be deployed as YAML or Chart files. KubeKey uses kubeadm to install Kubernetes clusters on nodes in parallel as much as possible in order to reduce installation complexity and improve efficiency. It greatly saves installation time compared to other installation methods.

As we all know, Kubernetes clusters can be deployed across on-premises environments, public clouds, private clouds, or bare metal. As such, it serves as a comprehensive platform for deploying cloud-native apps. Nevertheless, each environment may entail different configurations and settings. In fact, this is where KubeKey comes to change the game as you can use it to deploy Kubernetes across any environments.

The general steps of installing Kubernetes using KubeKey:

1. Download KubeKey.
2. Create a configuration file that contains cluster information, such as hosts and add-ons.
3. Apply the configuration file and the installation starts automatically. Tools such as docker will all be installed automatically.

## Prepare Hosts

I am going to create a cluster with three nodes on cloud. Here is my machine configuration for your reference:

| Host IP     | Host Name | Role         | System                                    |
| ----------- | --------- | ------------ | ----------------------------------------- |
| 192.168.0.2 | master    | master, etcd | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 192.168.0.3 | worker1   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |
| 192.168.0.4 | worker2   | worker       | CentOS 7.5, 8 Cores, 8 G Memory, 50 G Disk |

{{< notice note >}}

- The path `/var/lib/docker` is mainly used to store the container data, and will gradually increase in size during use and operation. In the case of a production environment, it is recommended that `/var/lib/docker` should mount a drive separately.
- It’s recommended that your OS be clean (without any other software installed). Otherwise, there may be conflicts.

{{</ notice >}} 

## Node Requirements

- All nodes must be accessible through `SSH`.
- Time synchronization for all nodes.
- `sudo`/`curl`/`openssl` should be used in all nodes.
- You can install docker on all nodes in advance. Alternatively, KubeKey will install docker automatically as it installs Kubernetes. A registry mirror is recommended to be prepared if you have trouble downloading images from `dockerhub.io`. For more information, see [Configure registry mirrors for the Docker daemon](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon).

## Dependency Requirements

You can use KubeKey to install a specified Kubernetes version. The dependency that needs to be installed may be different based on the Kubernetes version to be installed. You can refer to the list below to see if you need to install relevant dependencies on all your nodes in advance.

| Dependency  | Kubernetes Version ≥ 1.18 | Kubernetes Version < 1.18 |
| ----------- | ------------------------- | ------------------------- |
| `socat`     | Required                  | Optional but recommended  |
| `conntrack` | Required                  | Optional but recommended  |
| `ebtables`  | Optional but recommended  | Optional but recommended  |
| `ipset`     | Optional but recommended  | Optional but recommended  |

## Network and DNS Requirements

- Make sure the DNS address in `/etc/resolv.conf` is available. Otherwise, it may cause some issues of DNS in your cluster.
- If your network configuration uses firewall rules or security groups, you must ensure infrastructure components can communicate with each other through specific ports. It’s recommended that you turn off the firewall. For more information, see [Network Access](https://github.com/kubesphere/kubekey/blob/master/docs/network-access.md).

## Install Kubernetes

1. Download KubeKey from its [GitHub Release Page](https://github.com/kubesphere/kubekey/releases) or use the following command to download KubeKey version 1.0.1. You only need to download KubeKey to one of your machines that serves as the **taskbox** for installation, such as the master node.

   ```bash
   curl -sfL https://get-kk.kubesphere.io | VERSION=v1.0.1 sh -
   ```

   {{< notice note >}}

   You can change the version number in the command to download a specific version.

   {{</ notice >}}

2. The above command downloads KubeKey and unzips the file. Your folder now contains a file called `kk`. Make it executable:

   ```bash
   chmod +x kk
   ```

3. Now that I have KubeKey ready, I can start to create the configuration file to specify cluster information. Here is the command template to create a configuration file, which allows you to install a specified Kubernetes version with a customized name and path:

   ```bash
   ./kk create config [--with-kubernetes version] [(-f | --file) path]
   ```

   The default Kubernetes version is v1.17.9. For more information about supported Kubernetes versions, see this [file](https://github.com/kubesphere/kubekey/blob/master/docs/kubernetes-versions.md). Execute the following command as an example:

   ```bash
   ./kk create config --with-kubernetes v1.17.9
   ```

4. A default file `config-sample.yaml` will be created if you do not customize the name. Edit the file.

   ```bash
   vi config-sample.yaml
   ```

5. You will see the file prepopulated with some values. Here is my configuration for your reference:

   ```yaml
   apiVersion: kubekey.kubesphere.io/v1alpha1
   kind: Cluster
   metadata:
     name: sample
   spec:
     hosts:
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: root, password: Testing123}
     - {name: worker1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: root, password: Testing123}
     - {name: worker2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: root, password: Testing123}
     roleGroups:
       etcd:
       - master
       master:
       - master
       worker:
       - worker1
       - worker2
     controlPlaneEndpoint:
       domain: lb.kubesphere.local
       address: ""
       port: "6443"
     kubernetes:
       version: v1.17.9
       imageRepo: kubesphere
       clusterName: cluster.local
     network:
       plugin: calico
       kubePodsCIDR: 10.233.64.0/18
       kubeServiceCIDR: 10.233.0.0/18
     registry:
       registryMirrors: []
       insecureRegistries: []
     addons: []
   ```

   In this example file, list all your machines under `hosts` and add their detailed information.

   - `name`: The hostname of the instance.

   - `address`: The IP address you use for the connection between the taskbox and other instances through SSH. This can be either the public IP address or the private IP address depending on your environment. For example, some cloud platforms provide every instance with a public IP address which you use to access instances through SSH. In this case, you can input the public IP address for this field.

   - `internalAddress`: The private IP address of the instance.

   - The `user` and `password` field means the user and password you use to connect to instances. For passwordless login with SSH keys, you need to provide the path of your private key like this:

     ```yaml
     hosts:
     - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
     ```

   - `etcd`: etcd node names.

   - `master`: master node names.

   - `worker`: worker node names.

   You can provide more values in this configuration file, such as `addons`. KubeKey can install all [addons](https://github.com/kubesphere/kubekey/blob/release-1.0/docs/addons.md) that can be installed as a YAML file or Chart file. For example, KubeKey does not install any storage plugin for Kubernetes by default, but you can [add your own storage systems](https://kubesphere.io/docs/installing-on-linux/persistent-storage-configurations/understand-persistent-storage/), including NFS Client, Ceph, and GlusterFS. For more information about the configuration file, see [Kubernetes Cluster Configurations](https://kubesphere.io/docs/installing-on-linux/introduction/vars/) and [this file](https://github.com/kubesphere/kubekey/blob/release-1.0/docs/config-example.md).

6. Save the file when you finish editing and execute the following command to install Kubernetes:

   ```bash
   ./kk create cluster -f config-sample.yaml
   ```

7. You can see the output as below when the installation finishes.

   ```bash
   Congratulations! Installation is successful.
   ```

8. Execute the following command to check the status of namespaces.

   ```bash
   kubectl get pod --all-namespaces
   ```

   ```bash
   NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
   kube-system   calico-kube-controllers-59d85c5c84-mqk9g   1/1     Running   0          2m56s
   kube-system   calico-node-hp6b5                          1/1     Running   0          2m56s
   kube-system   calico-node-stxj8                          1/1     Running   0          2m55s
   kube-system   calico-node-wzjn9                          1/1     Running   0          2m55s
   kube-system   coredns-74d59cc5c6-dkpq4                   1/1     Running   0          3m5s
   kube-system   coredns-74d59cc5c6-v2bvx                   1/1     Running   0          3m5s
   kube-system   kube-apiserver-master                      1/1     Running   0          3m22s
   kube-system   kube-controller-manager-master             1/1     Running   0          3m22s
   kube-system   kube-proxy-5h6bv                           1/1     Running   0          2m55s
   kube-system   kube-proxy-btfxl                           1/1     Running   0          3m5s
   kube-system   kube-proxy-rht2m                           1/1     Running   0          2m55s
   kube-system   kube-scheduler-master                      1/1     Running   0          3m22s
   kube-system   nodelocaldns-2fkqb                         1/1     Running   0          2m55s
   kube-system   nodelocaldns-5gzmn                         1/1     Running   0          2m55s
   kube-system   nodelocaldns-mggpb                         1/1     Running   0          3m5s
   ```

## Access the Kubernetes Dashboard

1. To gain a more straightforward view of your cluster resources, you can access the web-based Kubernetes user interface. By default, KubeKey does not install it. To deploy it, run the following command:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
   ```

2. To access the Kubernetes dashboard, you can run `kubectl proxy` as stated in [its official documentation](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#accessing-the-dashboard-ui) while the dashboard can only be accessed from the machine where the command is executed. Execute the following command and you can see the dashboard service type is `ClusterIP`.

   ```bash
   kubectl get svc -n kubernetes-dashboard
   ```

   ```bash
   NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   dashboard-metrics-scraper   ClusterIP   10.233.45.187   <none>        8000/TCP   5m51s
   kubernetes-dashboard        ClusterIP   10.233.62.52    <none>        443/TCP    5m51s
   ```

3. As my machines are all on the cloud, I need to expose the dashboard service through `NodePort` so that I can access it outside the cluster. Run the following command:

   ```bash
   kubectl edit svc kubernetes-dashboard -o yaml -n kubernetes-dashboard
   ```

4. Navigate to `.spec.type` and change `ClusterIP` to `NodePort`.

   ```bash
   spec:
     clusterIP: 10.233.62.52
     ports:
     - port: 443
       protocol: TCP
       targetPort: 8443
     selector:
       k8s-app: kubernetes-dashboard
     sessionAffinity: None
     type: NodePort  # Change ClusterIP to NodePort.
   ```

5. Save the file and check the dashboard service again. You can see that the dashboard service is exposed.

   ```bash
   kubectl get svc -n kubernetes-dashboard
   ```

   ```bash
   NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
   dashboard-metrics-scraper   ClusterIP   10.233.45.187   <none>        8000/TCP        12m
   kubernetes-dashboard        NodePort    10.233.62.52    <none>        443:31259/TCP   12m
   ```

6. As port `31259` is exposed in this example, I can access the dashboard at `https://IP:31259`.

   ![k8s-dashboard](https://ap3.qingstor.com/kubesphere-website/docs/k8s-dashboard.png)

   {{< notice note >}}

   You may need to configure port forwarding rules and open the port in your security groups depending on your environment.

   {{</ notice >}} 

7. To log in to the dashboard, you need to create a ServiceAccount object and a ClusterRoleBinding object. Create the account with the name `admin-user` in the namespace `kubernetes-dashboard`.

   ```bash
   cat <<EOF | kubectl apply -f -
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: admin-user
     namespace: kubernetes-dashboard
   EOF
   ```

   Create a ClusterRoleBinding object.

   ```bash
   cat <<EOF | kubectl apply -f -
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: admin-user
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: cluster-admin
   subjects:
   - kind: ServiceAccount
     name: admin-user
     namespace: kubernetes-dashboard
   EOF
   ```

8. Execute the following command to get a bearer token to log in to the dashboard.

   For Bash:

   ```bash
   kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')
   ```

   For Powershell:

   ```powershell
   kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | sls admin-user | ForEach-Object { $_ -Split '\s+' } | Select -First 1)
   ```

   Expected output:

   ```bash
   Name:         admin-user-token-flkqz
   Namespace:    kubernetes-dashboard
   Labels:       <none>
   Annotations:  kubernetes.io/service-account.name: admin-user
                 kubernetes.io/service-account.uid: 78870e66-89c1-4750-915d-b147dbba66cb
   
   Type:  kubernetes.io/service-account-token
   
   Data
   ====
   ca.crt:     1025 bytes
   namespace:  20 bytes
   token:      eyJhbGciOiJSUzI1NiIsImtpZCI6Im9EaXNLOWUyV21UcDhOVzFUanl6bnRzdHBocWF6bjhLcXltSGM1Ulc5aVUifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWZsa3F6Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI3ODg3MGU2Ni04OWMxLTQ3NTAtOTE1ZC1iMTQ3ZGJiYTY2Y2IiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.SKseCm1u7Yga0jx2nFf5x4FoHgOONWQ8S1yDdPGXoZpuUShCr8b6ofmISHDi_Tsk3qQfwlMA99NWkLKeM6ijktULIbk9Y11GjMh0-rWjdxQPbxB6Bh0LGYh4SGLl_hNkYOVxd_1r8H-hddRHbkfs8t4eH-pUjQewC7LrCG5SQNrHtQnyuDleQQdSq1TNtDviCA17cL_XFomRkomqi4Vy7QExwEDYaNy7-9c_C-59Hh5QexZ4MoR8WsZewR-uXr_z2RmbTnuXaK-1wkIHt-niFdgxozGg4tcPvlIQ7XvJGMKXcSnrqnaieImUY_Y_6_Z8wm6LJl4XaypjhnYqJZD3wA
   ```

9. Copy the token and past it into the **Enter token** field and click **Sign in**. You can view node information and edit resources on the dashboard now.

   ![k8s-dashboard-node-page](https://ap3.qingstor.com/kubesphere-website/docs/k8s-dashboard-node-page.png)

## KubeSphere and its Graphic Dashboard

KubeSphere is a **distributed operating system managing cloud-native applications** with Kubernetes as its kernel. As an [open-source enterprise-grade container platform](https://kubesphere.io/), it boasts full-stack automated IT operation, multi-cluster management, and streamlined [DevOps workflows](https://kubesphere.io/devops/). Here is the architecture of KubeSphere.

![architecture](https://ap3.qingstor.com/kubesphere-website/docs/architecture.png)

Besides, KubeSphere also has its own responsive web-based console, which is more powerful and comprehensive than the Kubernetes dashboard. Users with necessary permissions can operate on resources on the console directly while they also have the option to use the built-in web tool kubectl.

![kubesphere-dashboard-compared-to-k8s](https://ap3.qingstor.com/kubesphere-website/docs/kubesphere-dashboard-compared-to-k8s.png)

In fact, you can use KubeKey to install Kubernetes and KubeSphere at the same time. The process is basically the same while you need to add the flag `--with-kubesphere [version]` when you run the command `./kk create config`. For more information, have a look at [the KubeSphere documentation](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/).

## Summary

The installation process I demonstrate in this article is only a tiny part of what KubeKey is capable of. In addition to installing Kubernetes and KubeSphere, you can also use it to scale and upgrade your cluster. It also supports [air-gapped installation](https://kubesphere.io/docs/installing-on-linux/introduction/air-gapped-installation/) as long as you download installation images in advance.

I hope this article can be useful especially for those who have been seeking for an installation method for so long. With KubeKey, I think, the Kubernetes community sees a significant step forward in terms of installation efficiency and user experience.

## Reference

[KubeKey](https://github.com/kubesphere/kubekey)

[Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

[Multi-node Installation](https://kubesphere.io/docs/installing-on-linux/introduction/multioverview/)
