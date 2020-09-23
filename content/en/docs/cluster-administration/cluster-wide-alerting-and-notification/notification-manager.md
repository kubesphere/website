---
title: "Manage multi-tenant notifications with Notification Manager"
keywords: "kubernetes, KubeSphere, notification manager, email, wechat, slack"
description: "K8s native notification management with multi-tenancy support"

linkTitle: "Notification Manager"
weight: 2020
---

[Notification Manager](https://github.com/kubesphere/notification-manager) manages notifications in KubeSphere. It receives alerts or notifications from different senders and then send notifications to different users.

Supported senders includes:

- Prometheus Alertmanager
- Custom sender (Coming soon)

Supported receivers includes:

- Email
- [Wechat Work](https://work.weixin.qq.com/)
- Slack
- Webhook (Coming soon)

![Notification Manager](/images/docs/cluster-administration/cluster-settings/cluster-wide-alerting-and-notification/notification-manager.png)

## QuickStart

### Config Prometheus Alertmanager to send alerts to Notification Manager

Notification Manager uses port `19093` and API path `/api/v2/alerts` to receive alerts sent from Prometheus Alertmanager of Kubesphere.

To receive Alertmanager alerts, **KubeSphere already added Alertmanager webhook and route configurations like below** ( by editing the Secret alertmanager-main in the namespace `kubesphere-monitoring-system` ):

Send Prometheus alerts to Notification Manager:

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

Send event alerts to Notification Manager:

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

Send auditing alerts to Notification Manager:

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

The above is the default configuration. If you do not want to receive a certain type of alert, you can delete the corresponding configuration.

{{</ notice >}}

### Configure receivers

Notification Manager now supports three types of receivers: Email, WeChat Work and Slack. Only the administrator can configure receivers.

#### Email

If a tenant named **test-user** who wants to receive notifications from email, just create an email receiver like this.

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

The emailConfigSelector is a selector to select EmailConfig for email receiver, if the emailConfigSelector is not set, receiver will use the default email config. You can create a default email config like this.

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

Email receivers with label `type: tenant` only receive notifications from the namespace to which the specified tenant user has access. If you want them to receive notifications from all namespaces or even without a namespace label, you can create a global email receiver with label `type: global` as below::

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

Global email receiver will use the default email config.

{{</ notice >}}

#### Wechat Work

Notification Manager supports sending notification to Wechat Work. 
If a tenant named **test-user** who wants to receive notifications from Wechat Work, just create a wechat receiver like this.

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

- wechatApiCorpId is the id of your Wechat Work. 
- wechatApiAgentId is the id of app sending message to user in your Wechat Work
- wechatApiSecret is the secret of this app, you can get these two parameters in App Management of your Wechat Work. 
- Any user, party or tag who wants to receive notifications must be in the allowed users list of this app.

{{</ notice >}}

The wechatConfigSelector is a selector to select WechatConfig for wechat receiver, if the wechatConfigSelector is not set, wechat receiver will use the default wechat config. You can create a default wechat config like this.

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

Wechat receivers with label `type: tenant` can only receive notifications from the namespace to which the specified tenant user has access. If you want them to receive notifications from all namespaces or even without a namespace label, you can create a global wechat receiver with label `type: global` as below:

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

Global wechat receiver will use the default wechat config.

{{</ notice >}}

#### Slack

Notification Manager supports sending notification to slack channels. If a tenant named **test-user** who wants to receive notifications from slack, just create a slack receiver like this.

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

- Slack token is the OAuth Access Token or Bot User OAuth Access Token when you create a slack app.
- This app must have the scope chat:write. 
- The user who creates the app or bot user must be in the channel to which you want to send notifications.

{{</ notice >}}

The slackConfigSelector is a selector to select SlackConfig for slack receiver, if the slackConfigSelector is not set, slack receiver will use the default slack config. You can create a default slack config like this.

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

Slack receivers with label `type: tenant` can only receive notifications from the namespace to which the specified tenant user has access. If you want them to receive notifications from all namespaces or even without a namespace label, you can create a global slack receiver with label `type: global` as below:

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

Global slack receiver will use the default slack config.

{{</ notice >}}
