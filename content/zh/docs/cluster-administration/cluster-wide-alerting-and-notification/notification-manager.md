---
title: "使用 Notification Manager 管理多租户通知"
keywords: "Kubernetes, KubeSphere, Notification Manager, email, 微信, slack"
description: "了解如何使用 Notification Manager 管理通知。"
linkTitle: "Notification Manager"
weight: 8520
---

[Notification Manager](https://github.com/kubesphere/notification-manager) 管理 KubeSphere 中的通知。它接收来自不同发送器的告警或者通知，然后将通知发送给不同用户。

支持的发送器包括：

- Prometheus Alertmanager
- 自定义发送器（即将上线）

支持的接收器包括：

- 电子邮件
- [企业微信](https://work.weixin.qq.com/)
- Slack
- Webhook（即将上线）

![notification-manager](/images/docs/cluster-administration/cluster-wide-alerting-and-notification/notification-manager/notification-manager.png)

## 快速入门

### 配置 Prometheus Alertmanager 向 Notification Manager 发送告警

Notification Manager 使用端口 `19093` 和 API 路径 `/api/v2/alerts` 来接收由 KubeSphere 的 Prometheus Alertmanager 发送的告警。

为了接收 Alertmanager 告警，**KubeSphere 已添加如下所示的 Alertmanager Webhook 和路由配置**（编辑命名空间 `kubesphere-monitoring-system` 中的密钥 `alertmanager-main`）：

将 Prometheus 告警发送至 Notification Manager：

```yaml
    "receivers":
    - "name": "prometheus"
      "webhook_configs":
      - "url": "http://notification-manager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
    "route":
      "routes":
      - "match":
          "alerttype": ""
        "receiver": "prometheus"
```

将事件告警发送至 Notification Manager：

```yaml
    "receivers":
    - "name": "event"
      "webhook_configs":
      - "url": "http://notification-manager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
        "send_resolved": false
    "route":
      "routes":
      - "match":
          "alerttype": "event"
        "receiver": "event"
        "group_interval": "30s"
```

将审计告警发送至 Notification Manager：

```yaml
    "receivers":
    - "name": "auditing"
      "webhook_configs":
      - "url": "http://notification-manager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
        "send_resolved": false
    "route":
      "routes":
      - "match":
          "alerttype": "auditing"
        "receiver": "auditing"
        "group_interval": "30s"
```

{{< notice note >}}

以上所示为默认配置。如果您不想接收某种类型的告警，可以删除相应配置。

{{</ notice >}}

### 配置接收器

Notification Manager 目前支持三种类型的接收器：电子邮件、企业微信和 Slack。只有管理员才能配置接收器。

#### 电子邮件

如果一个名为 `test-user` 的租户想接收电子邮件通知，请创建一个电子邮件接收器，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  password: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-email-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailConfig
metadata:
  labels:
    app: notification-manager
    type: tenant
    user: test-user
  name: test-user-config
  namespace: kubesphere-monitoring-system
spec:
  authPassword:
    key: password
    name: test-user-email-secret
  authUsername: abc1
  from: abc1@xyz.com
  requireTLS: true
  smartHost:
    host: imap.xyz.com
    port: "25"

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailReceiver
metadata:
  labels:
    app: notification-manager
    type: tenant
    user: test-user
  name: test-user-receiver
  namespace: kubesphere-monitoring-system
spec:
  emailConfigSelector:
    matchLabels:
      type: tenant
      user: test-user
  to:
  - abc2@xyz.com
  - abc3@xyz.com
EOF
```

`emailConfigSelector` 是一个选择器，用于选择电子邮件接收器的 `EmailConfig`。如果没有设置 `emailConfigSelector`，接收器将使用默认电子邮件配置。您可以创建一个默认电子邮件配置，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  password: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: default-email-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailConfig
metadata:
  labels:
    app: notification-manager
    type: default
  name: default-email-config
  namespace: kubesphere-monitoring-system
spec:
  authPassword:
    key: password
    name: default-email-secret
  authUsername: default
  from: default@xyz.com
  requireTLS: true
  smartHost:
    host: imap.xyz.com
    port: "25"
EOF
```

带有 `type: tenant` 标签的电子邮件接收器只接收来自指定租户可以访问的命名空间的通知。如果您想让接收器接收来自所有命名空间的通知，或者不带命名空间标签，您可以创建一个全局电子邮件接收器，标签为 `type: global`，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailReceiver
metadata:
  labels:
    app: notification-manager
    type: global
  name: global-email-receiver
  namespace: kubesphere-monitoring-system
spec:
  to:
  - global@xyz.com
EOF
```

{{< notice note >}}

全局电子邮件接收器将使用默认电子邮件配置。

{{</ notice >}}

#### 企业微信

Notification Manager 支持向企业微信发送通知。如果一个名为 `test-user` 的租户想接收企业微信通知，请创建一个微信接收器，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  wechat: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-wechat-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatConfig
metadata:
  name: test-user-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  wechatApiUrl: https://qyapi.weixin.qq.com/cgi-bin/
  wechatApiSecret:
    key: wechat
    name: test-user-wehat-secret
  wechatApiCorpId: wwfd76b24f06513578
  wechatApiAgentId: "1000002"

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatReceiver
metadata:
  name: test-user-wechat
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  wechatConfigSelector:
    matchLabels:
      type: tenant
      user: test-user
  # optional
  # One of toUser, toParty, toParty should be specified.
  toUser: user1 | user2
  toParty: party1 | party2
  toTag: tag1 | tag2
EOF
```

{{< notice info >}}

- `wechatApiCorpId` 即您的企业微信 ID。
- `wechatApiAgentId` 即在您的企业微信中向用户发送消息的应用的 ID。
- `wechatApiSecret` 即该应用的密钥。您可以在企业微信的**应用管理**中获取这两个参数。
- 想接收通知的任意用户、团体或标签必须在该应用的允许用户列表中。

{{</ notice >}}

`wechatConfigSelector` 是一个选择器，用于选择微信接收器的 `WechatConfig`。如果没有设置 `wechatConfigSelector`，微信接收器将使用默认微信配置。您可以创建一个默认微信配置，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  wechat: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: default-wechat-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatConfig
metadata:
  name: default-wechat-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: default
spec:
  wechatApiUrl: https://qyapi.weixin.qq.com/cgi-bin/
  wechatApiSecret:
    key: wechat
    name: default-wechat-secret
  wechatApiCorpId: wwfd76b24f06513578
  wechatApiAgentId: "1000002"
EOF
```

带有 `type: tenant` 标签的微信接收器只接收来自指定租户可以访问的命名空间的通知。如果您想让接收器接收来自所有命名空间的通知，或者不带命名空间标签，您可以创建一个全局微信接收器，标签为 `type: global`，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatReceiver
metadata:
  name: global-wechat-wechat
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: global
spec:
  # optional
  # One of toUser, toParty, toParty should be specified.
  toUser: global
  toParty: global
  toTag: global
EOF
```

{{< notice note >}}

全局微信接收器将使用默认微信配置。

{{</ notice >}}

#### Slack

Notification Manager 支持向 Slack 频道发送通知。如果一个名为 `test-user` 的租户想接收 Slack 通知，请创建一个 Slack 接收器，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  token: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-slack-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackConfig
metadata:
  name: test-user-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  slackTokenSecret: 
    key: token
    name: test-user-slack-secret

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackReceiver
metadata:
  name: test-user-slack
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  slackConfigSelector:
    matchLabels:
      type: tenant
      user: test-user
  channel: alert
EOF
```

{{< notice info>}}

- 当您创建 Slack 应用时，Slack 令牌为 OAuth 访问令牌或者 Bot 用户 OAuth 访问令牌。
- 该应用必须有作用域 [chat:write](https://api.slack.com/scopes/chat:write)。
- 创建该应用的用户或者 Bot 用户必须在您想发送通知的频道中。

{{</ notice >}}

`slackConfigSelector` 是一个选择器，用于选择 Slack 接收器的 `SlackConfig`。如果没有设置 `slackConfigSelector`，Slack 接收器将使用默认 Slack 配置。您可以创建一个默认 Slack 配置，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  token: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: default-slack-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackConfig
metadata:
  name: default-slack-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: default
spec:
  slackTokenSecret: 
    key: token
    name: default-slack-secret
EOF
```

带有 `type: tenant` 标签的 Slack 接收器只接收来自指定租户可以访问的命名空间的通知。如果您想让接收器接收来自所有命名空间的通知，或者不带命名空间标签，您可以创建一个全局 Slack 接收器，标签为 `type: global`，如下所示：

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackReceiver
metadata:
  name: global-slack-slack
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: global
spec:
  channel: global
EOF
```

{{< notice note>}}

全局 Slack 接收器将使用默认 Slack 配置。

{{</ notice >}}
