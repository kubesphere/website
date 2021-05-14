---
title: "搭建 GlusterFS 服务器"
keywords: 'Kubernetes, KubeSphere, GlusterFS'
description: '如何搭建 GlusterFS 服务器'
linkTitle: "搭建 GlusterFS 服务器"
weight: 17420
---

[GlusterFS](https://kubernetes.io/zh/docs/concepts/storage/volumes/#glusterfs) 是开源的分布式文件系统，您能使用 GlusterFS 将 `glusterfs` 存储卷挂载到 Pod。如果 `glusterfs` 存储卷中预先填充了数据，则可以在 Kubernetes 集群中的 Pod 之间共享这些数据。

本教程演示了如何在三台服务器机器上配置 GlusterFS 以及如何安装 [Heketi](https://github.com/heketi/heketi) 来管理 GlusterFS 集群。

GlusterFS 和 Heketi 搭建好之后，就可以在客户端机器上安装 GlusterFS，并使用 KubeKey 创建一个存储类型为 GlusterFS 的 KubeSphere 集群。

## 准备 GlusterFS 节点

本示例中包含三台 Ubuntu 16.04 服务器机器，每台服务器都有一个附带的磁盘。

| 主机名  | IP 地址     | 操作系统                      | 设备            |
| ------- | ----------- | ----------------------------- | --------------- |
| server1 | 192.168.0.2 | Ubuntu 16.04，4 核，4 GB 内存 | /dev/vdd 300 GB |
| server2 | 192.168.0.3 | Ubuntu 16.04，4 核，4 GB 内存 | /dev/vdd 300 GB |
| server3 | 192.168.0.4 | Ubuntu 16.04，4 核，4 GB 内存 | /dev/vdd 300 GB |

{{< notice note >}}

- Heketi 将安装在 `server1` 上，该服务器提供 RESTful 管理接口来管理 GlusterFS 存储卷的生命周期。您也可以将 Heketi 安装在不同的服务器机器上。

- 若需要更多存储空间，请在服务器上加装存储磁盘。
- 数据将保存到 `/dev/vdd`（块设备），必须是没有经过分区或格式化的原始块设备。

{{</ notice >}} 

## 设置无密码 SSH 登录

### 配置 root 登录

1. 登录 `server1` 并切换到 root 用户。

   ```bash
   sudo -i
   ```
   
2. 更改 root 用户密码：

   ```bash
   passwd
   ```
   
   {{< notice note >}}
   

请确保在文件 `/etc/ssh/sshd_config` 中启用了密码认证（`PasswordAuthentication` 的值应该为 `yes`）。

{{</ notice >}} 

3. `server2` 和 `server3` 的 root 用户密码也需要进行更改。

### 添加 hosts 文件条目

1. 在所有服务器机器上配置 DNS 或编辑 `/etc/hosts` 文件，添加相应的主机名和 IP 地址：

   ```bash
   vi /etc/hosts
   ```

   ```txt
   # hostname loopback address
   192.168.0.2  server1
   192.168.0.3  server2
   192.168.0.4  server3
   ```

2. 请确保将以上条目添加到所有服务器机器的 `hosts` 文件中。

### 配置无密码 SSH 登录

1. 通过运行以下命令在 `server1` 上创建密钥。直接按**回车键**跳过所有提示。

   ```bash
   ssh-keygen
   ```

2. 将密钥复制到所有 GlusterFS 节点。

   ```bash
   ssh-copy-id root@server1
   ```

   ```bash
   ssh-copy-id root@server2
   ```

   ```bash
   ssh-copy-id root@server3
   ```

3. 请验证您可以从 `server1` 通过无密码登录访问所有服务器机器。

   ```bash
   ssh root@server1
   ```

   ```bash
   ssh root@server2
   ```

   ```bash
   ssh root@server3
   ```

## 在所有服务器机器上安装 GlusterFS

1. 运行以下命令在 `server1` 上安装 `software-properties-common`。

   ```bash
   apt-get install software-properties-common
   ```

2. 添加社区 GlusterFS PPA。

   ```bash
   add-apt-repository ppa:gluster/glusterfs-7
   ```

3. 请确保使用的是最新安装包。

   ```bash
   apt-get update
   ```

4. 安装 GlusterFS 服务器。

   ```bash
   apt-get install glusterfs-server -y
   ```

5. 请确保也在 `server2` 和 `server3` 上运行上述命令，并在所有机器上验证安装包版本。

   ```text
   glusterfs -V
   ```

{{< notice note >}}

如果您是在 Ubuntu 之外的其他系统上安装 GlusterFS，那么上述命令可能会略有不同。有关更多信息，请参见 [Gluster 文档](https://docs.gluster.org/en/latest/Install-Guide/Install/#installing-gluster)。

{{</ notice >}} 

## 加载内核模块

1. 运行以下命令在 `server1` 上加载三个必要的内核模块。

   ```bash
   echo dm_thin_pool | sudo tee -a /etc/modules
   ```

   ```bash
   echo dm_snapshot | sudo tee -a /etc/modules
   ```

   ```bash
   echo dm_mirror | sudo tee -a /etc/modules
   ```

2. 安装 `thin-provisioning-tools`。

   ```bash
   apt-get -y install thin-provisioning-tools
   ```

3. 请确保您也在 `server2` 和 `server3` 上运行以上命令。

## 创建 GlusterFS 集群

1. 在 `server1` 上运行以下命令添加其他节点并创建集群。

   ```bash
   gluster peer probe server2
   ```

   ```
   gluster peer probe server3
   ```

2. 请验证集群中的所有节点均已成功连接。

   ```bash
   gluster peer status
   ```

3. 预计输出如下：

   ```bash
   Number of Peers: 2
   
   Hostname: server2
   Uuid: e1192d6a-b65e-4ce8-804c-72d9425211a6
   State: Peer in Cluster (Connected)
   
   Hostname: server3
   Uuid: 9bd733e4-96d4-49d5-8958-6c947a2b4fa6
   State: Peer in Cluster (Connected)
   ```

## 安装 Heketi

由于 GlusterFS 本身不提供 API 调用的方法，因此您可以安装 [Heketi](https://github.com/heketi/heketi)，通过用于 Kubernetes 调用的 RESTful API 来管理 GlusterFS 存储卷的生命周期。这样，您的 Kubernetes 集群就可以动态地配置 GlusterFS 存储卷。在此示例中将会安装 Heketi v7.0.0。有关 Heketi 可用版本的更多信息，请参见其[发布页面](https://github.com/heketi/heketi/releases/)。

1. 在 `server1` 上下载 Heketi。

   ```bash
   wget https://github.com/heketi/heketi/releases/download/v7.0.0/heketi-v7.0.0.linux.amd64.tar.gz
   ```

   {{< notice note >}}

   您也可以在单独的机器上安装 Heketi。

   {{</ notice >}} 

2. 将文件解压缩。

   ```
   tar -xf heketi-v7.0.0.linux.amd64.tar.gz
   ```

   ```
   cd heketi
   ```

   ```
   cp heketi /usr/bin
   ```
   
   ```
   cp heketi-cli /usr/bin
   ```
   
3. 创建 Heketi 服务文件。

   ```
   vi /lib/systemd/system/heketi.service
   ```

   ```
   [Unit]
   Description=Heketi Server
   [Service]
   Type=simple
   WorkingDirectory=/var/lib/heketi
   ExecStart=/usr/bin/heketi --config=/etc/heketi/heketi.json
   Restart=on-failure
   StandardOutput=syslog
   StandardError=syslog
   [Install]
   WantedBy=multi-user.target
   ```

4. 创建 Heketi 文件夹。

   ```bash
   mkdir -p /var/lib/heketi
   ```

   ```
   mkdir -p /etc/heketi
   ```

5. 创建 JSON 文件以配置 Heketi。

   ```
   vi /etc/heketi/heketi.json
   ```

   示例文件：

   ```json
   {
     "_port_comment": "Heketi Server Port Number",
     "port": "8080",
   
     "_use_auth": "Enable JWT authorization. Please enable for deployment",
     "use_auth": false,
   
     "_jwt": "Private keys for access",
     "jwt": {
       "_admin": "Admin has access to all APIs",
       "admin": {
         "key": "123456"
       },
       "_user": "User only has access to /volumes endpoint",
       "user": {
         "key": "123456"
       }
     },
   
     "_glusterfs_comment": "GlusterFS Configuration",
     "glusterfs": {
       "_executor_comment": [
         "Execute plugin. Possible choices: mock, ssh",
         "mock: This setting is used for testing and development.",
         "      It will not send commands to any node.",
         "ssh:  This setting will notify Heketi to ssh to the nodes.",
         "      It will need the values in sshexec to be configured.",
         "kubernetes: Communicate with GlusterFS containers over",
         "            Kubernetes exec api."
       ],
       "executor": "ssh",
   
       "_sshexec_comment": "SSH username and private key file information",
       "sshexec": {
         "keyfile": "/root/.ssh/id_rsa",
         "user": "root"
       },
   
       "_kubeexec_comment": "Kubernetes configuration",
       "kubeexec": {
         "host" :"https://kubernetes.host:8443",
         "cert" : "/path/to/crt.file",
         "insecure": false,
         "user": "kubernetes username",
         "password": "password for kubernetes user",
         "namespace": "Kubernetes namespace",
         "fstab": "Optional: Specify fstab file on node.  Default is /etc/fstab"
       },
   
       "_db_comment": "Database file name",
       "db": "/var/lib/heketi/heketi.db",
       "brick_max_size_gb" : 1024,
   	"brick_min_size_gb" : 1,
   	"max_bricks_per_volume" : 33,
   
   
       "_loglevel_comment": [
         "Set log level. Choices are:",
         "  none, critical, error, warning, info, debug",
         "Default is warning"
       ],
       "loglevel" : "debug"
     }
   }
   ```

   {{< notice note >}}

   在安装 GlusterFS 作为 KubeSphere 集群的存储类型时，必须提供帐户 `admin` 及其 `Secret` 值。

   {{</ notice >}} 

6. 启动 Heketi。

   ```bash
   systemctl start heketi
   ```

7. 检查 Heketi 的状态。

   ```bash
   systemctl status heketi
   ```

   如果出现了 `active (running)`，则意味着安装成功。预计输出：

   ```bash
   ● heketi.service - Heketi Server
      Loaded: loaded (/lib/systemd/system/heketi.service; disabled; vendor preset: enabled)
      Active: active (running) since Tue 2021-03-09 13:04:30 CST; 4s ago
    Main PID: 9282 (heketi)
       Tasks: 8
      Memory: 6.5M
         CPU: 62ms
      CGroup: /system.slice/heketi.service
              └─9282 /usr/bin/heketi --config=/etc/heketi/heketi.json
   
   Mar 09 13:04:30 server1 systemd[1]: Started Heketi Server.
   Mar 09 13:04:30 server1 heketi[9282]: Heketi v7.0.0
   Mar 09 13:04:30 server1 heketi[9282]: [heketi] INFO 2021/03/09 13:04:30 Loaded ssh executor
   Mar 09 13:04:30 server1 heketi[9282]: [heketi] INFO 2021/03/09 13:04:30 Adv: Max bricks per volume set to 33
   Mar 09 13:04:30 server1 heketi[9282]: [heketi] INFO 2021/03/09 13:04:30 Adv: Max brick size 1024 GB
   Mar 09 13:04:30 server1 heketi[9282]: [heketi] INFO 2021/03/09 13:04:30 Adv: Min brick size 1 GB
   Mar 09 13:04:30 server1 heketi[9282]: [heketi] INFO 2021/03/09 13:04:30 GlusterFS Application Loaded
   Mar 09 13:04:30 server1 heketi[9282]: [heketi] INFO 2021/03/09 13:04:30 Started Node Health Cache Monitor
   Mar 09 13:04:30 server1 heketi[9282]: Listening on port 8080
   ```

8. 启用 Heketi。

   ```bash
   systemctl enable heketi
   ```

   预计输出：

   ```bash
   Created symlink from /etc/systemd/system/multi-user.target.wants/heketi.service to /lib/systemd/system/heketi.service.
   ```

9. 为 Heketi 创建拓扑配置文件，该文件包含添加到 Heketi 的集群、节点和磁盘的信息。

   ```bash
   vi /etc/heketi/topology.json
   ```

   示例文件：

   ```json
      {
       "clusters": [
          {
            "nodes": [
              {
                "node": {
                  "hostnames": {
                    "manage": [
                      "192.168.0.2" 
                   ],
                   "storage": [
                     "192.168.0.2" 
                   ]
                 },
                 "zone": 1
               },
               "devices": [
                 "/dev/vdd" 
               ]
             },
             {
               "node": {
                 "hostnames": {
                   "manage": [
                     "192.168.0.3" 
                   ],
                   "storage": [
                     "192.168.0.3"
                   ]
                 },
                 "zone": 1
               },
               "devices": [
                 "/dev/vdd" 
               ]
             },
             {
                "node": {
                  "hostnames": {
                    "manage": [
                      "192.168.0.4"
                   ],
                   "storage": [
                     "192.168.0.4"  
                   ]
                 },
                 "zone": 1
               },
               "devices": [
                 "/dev/vdd"
               ]
             }
           ]
         }
       ]
     }
   ```

   {{< notice note >}} 

   - 请使用您自己的 IP 替换上述 IP 地址。
   - 请在 `devices` 一栏添加您自己的磁盘名称。

   {{</ notice >}} 

10. 加载 Heketi JSON 文件。

    ```bash
    export HEKETI_CLI_SERVER=http://localhost:8080
    ```

    ```bash
    heketi-cli topology load --json=/etc/heketi/topology.json
    ```

    预计输出：

    ```bash
    Creating cluster ... ID: 2d9e11adede04fe6d07cb81c5a1a7ea4
    	Allowing file volumes on cluster.
    	Allowing block volumes on cluster.
    	Creating node 192.168.0.2 ... ID: 0a9f240ab6fd96ea014948c5605be675
    		Adding device /dev/vdd ... OK
    	Creating node 192.168.0.3 ... ID: 2468086cadfee8ef9f48bc15db81c88a
    		Adding device /dev/vdd ... OK
    	Creating node 192.168.0.4 ... ID: 4c21b33d5c32029f5b7dc6406977ec34
    		Adding device /dev/vdd ... OK
    ```

11. 以上输出同时显示了集群 ID 和节点 ID。运行以下命令查看集群信息。

    ```bash
    heketi-cli cluster info 2d9e11adede04fe6d07cb81c5a1a7ea4 # Use your own cluster ID.
    ```

    预计输出：

    ```bash
    Cluster id: 2d9e11adede04fe6d07cb81c5a1a7ea4
    Nodes:
    0a9f240ab6fd96ea014948c5605be675
    2468086cadfee8ef9f48bc15db81c88a
    4c21b33d5c32029f5b7dc6406977ec34
    Volumes:
    
    Block: true
    
    File: true
    ```

