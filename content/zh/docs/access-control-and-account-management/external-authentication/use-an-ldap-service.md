---
title: "LDAP身份提供者"
keywords: "LDAP, 身份提供者, 外部, 身份验证"
description: "如何使用 LDAP 服务。"

linkTitle: "LDAP身份提供者"
weight: 12220
---

本文档描述了如何使用 LDAP 服务作为外部身份提供者，允许您根据 LDAP 服务对用户进行身份验证。

## 准备工作

* 您需要部署一个 Kubernetes 集群，并在集群中安装 KubeSphere。有关详细信息，请参阅[在 Linux 上安装](../../../installing-on-linux/)和[在 Kubernetes 上安装](../../../installing-on-kubernetes/)。
* 您需要获取 LDAP 服务的管理员专有名称（DN）和管理员密码。

## 步骤

1. 以 `admin` 身份登录 KubeSphere，将光标移动到右下角 <img src="/images/docs/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px"> ，点击 **kubectl**，然后执行以下命令来编辑 CRD `ClusterConfiguration` 中的 `ks-installer`：

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```
   
    示例：

    ```yaml
   spec:
     authentication:
       jwtSecret: ''
       authenticateRateLimiterMaxTries: 10
       authenticateRateLimiterDuration: 10m0s
       loginHistoryRetentionPeriod: 168h
       maximumClockSkew: 10s
       multipleLogin: true
       oauthOptions:
         accessTokenMaxAge: 1h
         accessTokenInactivityTimeout: 30m
         identityProviders:
         - name: LDAP
           type: LDAPIdentityProvider
           mappingMethod: auto
           provider:
             host: 192.168.0.2:389
             managerDN: uid=root,cn=users,dc=nas
             managerPassword: ********
             userSearchBase: cn=users,dc=nas
             loginAttribute: uid
             mailAttribute: mail
    ```
   
2. 在 `spec:authentication` 部分配置 `oauthOptions:identityProviders` 以外的字段信息请参阅[设置外部身份认证](../set-up-external-authentication/)。

3. 在 `oauthOptions:identityProviders` 部分配置字段。

   * `name`: 用户定义的 LDAP 服务名称。
   * `type`: 必须将该值设置为 `LDAPIdentityProvider` 才能将 LDAP 服务用作身份提供者。
   * `mappingMethod`: 帐户映射方式，值可以是 `auto` 或者 `lookup`。
      *  如果值为 `auto`（默认），需要指定新的用户名。KubeSphere 根据用户名自动创建并关联 LDAP 用户。
      *  如果值为 `lookup`，需要执行步骤 4 以手动关联现有 KubeSphere 用户和 LDAP 用户。
   * `provider`:
      * `host`: LDAP 服务的地址和端口号。
      * `managerDN`: 用于绑定到 LDAP 目录的 DN 。
      * `managerPassword`: `managerDN` 对应的密码。
      * `userSearchBase`: 用户搜索基。设置为所有 LDAP 用户所在目录级别的 DN 。
      * `loginAttribute`: 标识 LDAP 用户的属性。
      * `mailAttribute`: 标识 LDAP 用户的电子邮件地址的属性。

4. 如果 `mappingMethod` 设置为 `lookup`，可以运行以下命令并添加标签来进行帐户关联。如果 `mappingMethod` 是 `auto` 可以跳过这个部分。

   ```bash
   kubectl edit user <KubeSphere username>
   ```

   ```yaml
   labels:
     iam.kubesphere.io/identify-provider: <LDAP service name>
     iam.kubesphere.io/origin-uid: <LDAP username>
   ```

5. 字段配置完成后，执行以下命令重启 ks-installer 。

   ```bash
   kubectl -n kubesphere-system rollout restart deploy/ks-installer
   ```

   {{< notice note >}}

   KubeSphere Web 控制台在 ks-installer 重新启动期间不可用。请等待重启完成。

   {{</ notice >}}

6. 进入KubeSphere登录页面，输入 LDAP 用户的用户名和密码登录。

   {{< notice note >}}

   LDAP 用户的用户名是 `loginAttribute` 指定的属性值。

   {{</ notice >}}
