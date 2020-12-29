---
title: "Session timeout"
keywords: "Session timeout, KubeSphere, Kubernetes"
description: "How to solve the session timeout problem."
linkTitle: "Session timeout"
Weight: 16420
---

Encountered an unexpected session timeout error `Session timeout or this account is logged in elsewhere, please login again`.

## Inactivity session timeout

You can control when an inactive user session expires. The default session timeout is two hours of inactivity.

[Configure accessTokenMaxAge and accessTokenInactivityTimeout](../../access-control-and-account-management/configuring-authentication/#authentication-configuration).

## JWT signature verification failed

In [multi-cluster environment]((../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster)) `clusterRole` and `jwtSecret` needs to be set correctly.

## Node clock skew 

Node clock skew will affect time-sensitive operations such as validating the expiration time of a user token. You can configure the server time synchronization with an NTP server. [MaximumClockSkew](../../access-control-and-account-management/configuring-authentication/#authentication-configuration) can also be set, the default value is 10 seconds.