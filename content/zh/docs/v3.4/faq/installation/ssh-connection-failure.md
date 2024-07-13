---
title: "SSH 连接故障"
keywords: "安装, SSH, KubeSphere, Kubernetes"
description: "SSH 连接故障"
linkTitle: "SSH 连接故障"
Weight: 16600
version: "v3.4"
---

使用 KubeKey 设置集群时，将创建一个包含必要主机信息的配置文件。以下是 `hosts` 字段的示例：

```bash
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
```

在您开始使用 `./kk` 命令创建集群之前，建议使用 SSH 测试任务机与其他实例之间的连接情况。

## 可能出现的错误信息

```bash
Failed to connect to xx.xxx.xx.xxx: could not establish connection to xx.xxx.xx.xxx:xx: ssh: handshake failed: ssh: unable to authenticate , attempted methods [none], no supported methods remain node=xx.xxx.xx.xxx
```

如果出现了以上错误信息，请确保：

- 您使用的端口号无误。端口 `22` 是 SSH 的默认端口，如果您使用的是不同的端口，则需要在 IP 地址后添加该端口号。例如：

  ```bash
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```

- `/etc/ssh/sshd_config` 文件中没有限制 SSH 连接。例如，`PasswordAuthentication` 应设置为 `true`。

- 您使用的用户名、密码或密钥正确。请注意，用户必须拥有 sudo 权限。

- 您的防火墙配置允许 SSH 连接。
