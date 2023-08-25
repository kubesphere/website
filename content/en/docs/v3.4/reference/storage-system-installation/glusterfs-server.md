---
 title: "Set up a GlusterFS Server"
keywords: 'Kubernetes, KubeSphere, GlusterFS'
description: 'How to set up a GlusterFS Server'
linkTitle: "Set up a GlusterFS Server"
weight: 17420
---

As an open-source distributed file system, [GlusterFS](https://kubernetes.io/docs/concepts/storage/volumes/#glusterfs) allows you to mount `glusterfs` volumes to your Pods. If a `glusterfs` volume is pre-populated with data, they can be shared among your Pods in a Kubernetes cluster.

This tutorial demonstrates how to configure GlusterFS on three server machines and install [Heketi](https://github.com/heketi/heketi) to manage your GlusterFS cluster.

Once you have GlusterFS and Heketi set up, you can install GlusterFS on your client machine and use KubeKey to create a KubeSphere cluster with GlusterFS as a storage class.

## Prepare GlusterFS Nodes

There are three server machines of Ubuntu 16.04 in this example with each having one attached disk.

| Hostname | IP Address  | Operating System                      | Device          |
| -------- | ----------- | ------------------------------------- | --------------- |
| server1  | 192.168.0.2 | Ubuntu 16.04, 4 Cores, 4 GB of Memory | /dev/vdd 300 GB |
| server2  | 192.168.0.3 | Ubuntu 16.04, 4 Cores, 4 GB of Memory | /dev/vdd 300 GB |
| server3  | 192.168.0.4 | Ubuntu 16.04, 4 Cores, 4 GB of Memory | /dev/vdd 300 GB |

{{< notice note >}}

- Heketi will be installed on `server1`, which provides a RESTful management interface to manage the lifecycle of GlusterFS volumes. You can install it on a separate machine as well.

- Attach more block storage disks to your server machine if you need more storage space.
- Data will be saved to `/dev/vdd` (block device), which must be original without partitioning or formatting.

{{</ notice >}} 

## Set up Passwordless SSH Login

### Configure root login

1. Log in to `server1` and switch to the root user.

   ```bash
   sudo -i
   ```
   
2. Change the root user password:

   ```bash
   passwd
   ```
   
   {{< notice note >}}

Make sure password authentication is enabled in the file `/etc/ssh/sshd_config` (the value of `PasswordAuthentication` should be `yes`).

{{</ notice >}} 

3. Change the root user password of `server2` and `server3` as well.

### Add hosts file entries

1. Configure your DNS or edit the `/etc/hosts` file on all server machines to add their hostnames and IP addresses:

   ```bash
   vi /etc/hosts
   ```

   ```txt
   # hostname loopback address
   192.168.0.2  server1
   192.168.0.3  server2
   192.168.0.4  server3
   ```

2. Make sure you add the above entries to the `hosts` file of all server machines.

### Configure passwordless SSH login

1. On `server1`, create a key by running the following command. Press **Enter** directly for all the prompts.

   ```bash
   ssh-keygen
   ```

2. Copy the key to all GlusterFS nodes.

   ```bash
   ssh-copy-id root@server1
   ```

   ```bash
   ssh-copy-id root@server2
   ```

   ```bash
   ssh-copy-id root@server3
   ```

3. Verify that you can access all server machines from `server1` through passwordless login.

   ```bash
   ssh root@server1
   ```

   ```bash
   ssh root@server2
   ```

   ```bash
   ssh root@server3
   ```

## Install GlusterFS on All Server Machines

1. On `server1`, run the following command to install `software-properties-common`.

   ```bash
   apt-get install software-properties-common
   ```

2. Add the community GlusterFS PPA.

   ```bash
   add-apt-repository ppa:gluster/glusterfs-7
   ```

3. Make sure you are using the latest package.

   ```bash
   apt-get update
   ```

4. Install the GlusterFS server.

   ```bash
   apt-get install glusterfs-server -y
   ```

5. Make sure you run the above commands on `server2` and `server3` as well and verify the version on all machines.

   ```text
   glusterfs -V
   ```

{{< notice note >}}

The above commands may be slightly different if you do no install GlusterFS on Ubuntu. For more information, see [the Gluster documentation](https://docs.gluster.org/en/latest/Install-Guide/Install/#installing-gluster).

{{</ notice >}} 

## Load Kernel Modules

1. Run the following commands to load three necessary kernel modules on `server1`.

   ```bash
   echo dm_thin_pool | sudo tee -a /etc/modules
   ```

   ```bash
   echo dm_snapshot | sudo tee -a /etc/modules
   ```

   ```bash
   echo dm_mirror | sudo tee -a /etc/modules
   ```

2. Intall `thin-provisioning-tools`.

   ```bash
   apt-get -y install thin-provisioning-tools
   ```

3. Make sure you run the above commands on `server2` and `server3` as well.

## Create a GlusterFS Cluster

1. Run the following command on `server1` to add other nodes and create a cluster.

   ```bash
   gluster peer probe server2
   ```

   ```
   gluster peer probe server3
   ```

2. Verify that all nodes in the cluster are connected successfully.

   ```bash
   gluster peer status
   ```

3. Expected output:

   ```bash
   Number of Peers: 2
   
   Hostname: server2
   Uuid: e1192d6a-b65e-4ce8-804c-72d9425211a6
   State: Peer in Cluster (Connected)
   
   Hostname: server3
   Uuid: 9bd733e4-96d4-49d5-8958-6c947a2b4fa6
   State: Peer in Cluster (Connected)
   ```

## Install Heketi

As GlusterFS itself does not provide a way for API calls, you can install [Heketi](https://github.com/heketi/heketi) to manage the lifecycle of GlusterFS volumes with a RESTful API for Kubernetes calls. In this way, your Kubernetes cluster can dynamically provision GlusterFS volumes. Heketi v7.0.0 will be installed in this example. For more information about available Heketi versions, see its [Release Page](https://github.com/heketi/heketi/releases/).

1. Download Heketi on `server1`.

   ```bash
   wget https://github.com/heketi/heketi/releases/download/v7.0.0/heketi-v7.0.0.linux.amd64.tar.gz
   ```

   {{< notice note >}}

   You can also install Heketi on a separate machine.

   {{</ notice >}} 

2. Unzip the file.

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
   
3. Create a Heketi service file.

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

4. Create Heketi folders.

   ```bash
   mkdir -p /var/lib/heketi
   ```

   ```
   mkdir -p /etc/heketi
   ```

5. Create a JSON file for Heketi configurations.

   ```
   vi /etc/heketi/heketi.json
   ```

   An example file:

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

   The account `admin` and its `key` value must be provided when you install GlusterFS as a storage class of your KubeSphere cluster.

   {{</ notice >}} 

6. Start Heketi.

   ```bash
   systemctl start heketi
   ```

7. Check the status of Heketi.

   ```bash
   systemctl status heketi
   ```

   If you can see `active (running)`, it means the installation is successful. Expected output:

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

8. Enable Heketi.

   ```bash
   systemctl enable heketi
   ```

   Expected output:

   ```bash
   Created symlink from /etc/systemd/system/multi-user.target.wants/heketi.service to /lib/systemd/system/heketi.service.
   ```

9. Create a topology configuration file for Heketi. It contains the information of clusters, nodes, and disks added to Heketi.

   ```bash
   vi /etc/heketi/topology.json
   ```

   An example file:

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

   - Replace the IP addresses above with your own.
   - Add your own disk name for `devices`.

   {{</ notice >}} 

10. Load the Heketi JSON file.

    ```bash
    export HEKETI_CLI_SERVER=http://localhost:8080
    ```

    ```bash
    heketi-cli topology load --json=/etc/heketi/topology.json
    ```

    Expected output:

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

11. The above output displays both your cluster ID and node ID. Run the following command to view your cluster information.

    ```bash
    heketi-cli cluster info 2d9e11adede04fe6d07cb81c5a1a7ea4 # Use your own cluster ID.
    ```

    Expected output:

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

