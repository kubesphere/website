---
title: "SSH Connection Failure"
keywords: "Installation, SSH, KubeSphere, Kubernetes"
description: "Understand why the SSH connection may fail when you use KubeKey to create a cluster."
linkTitle: "SSH Connection Failure"
Weight: 16600
---

When you use KubeKey to set up a cluster, you create a configuration file which contains necessary host information. Here is an example of the field `hosts`:

```bash
spec:
  hosts:
  - {name: control plane, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
```

Before you start to use the `./kk` command to create your cluster, it is recommended that you test the connection between the taskbox and other instances using SSH.

## Possible Error Message

```bash
Failed to connect to xx.xxx.xx.xxx: could not establish connection to xx.xxx.xx.xxx:xx: ssh: handshake failed: ssh: unable to authenticate , attempted methods [none], no supported methods remain node=xx.xxx.xx.xxx
```

If you see an error message as above, verify that:

- You are using the correct port number. Port `22` is the default port of SSH and you need to add the port number after the IP address if your port is different. For example:

  ```bash
  hosts:
    - {name: control plane, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```

- SSH connections are not restricted in `/etc/ssh/sshd_config`. For example, `PasswordAuthentication` should be set to `true`.

- You are using the correct username, password or key. Note that the user must have sudo privileges.

- Your firewall configurations allow SSH connections.