---
title: "Session Timeout"
keywords: "Session timeout, KubeSphere, Kubernetes"
description: "How to solve the session timeout problem."
linkTitle: "Session Timeout"
Weight: 16420
---

A session starts as a user logs in the console of KubeSphere. You may see a message of "**Session timeout or this account is logged in elsewhere, please login again**" when the session expires.

## Inactivity Session Timeout

You can control when an inactive user session expires. The default session timeout is two hours of inactivity. It means once the session timeout is reached, the user will be automatically logged out of the console. You can [configure accessTokenMaxAge and accessTokenInactivityTimeout](../../../access-control-and-account-management/configuring-authentication/#authentication-configuration) for the session timeout.

## JWT Signature Verification Failed

In a [multi-cluster environment](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster), `clusterRole` and `jwtSecret` must be set correctly.

## Node Clock Skew 

The node clock skew affects time-sensitive operations such as validating the expiration time of a user token. You can configure the server time synchronization with an NTP server. [MaximumClockSkew](../../../access-control-and-account-management/configuring-authentication/#authentication-configuration) can also be set, which defaults to 10 seconds.