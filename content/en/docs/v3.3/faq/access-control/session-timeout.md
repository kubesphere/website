---
title: "Session Timeout"
keywords: "Session timeout, KubeSphere, Kubernetes"
description: "Understand session timeout and customize the timeout period."
linkTitle: "Session Timeout"
Weight: 16420
version: "v3.3"
---

A session starts as a user logs in to the console of KubeSphere. You may see a message of "**Session timeout or this account is logged in elsewhere, please login again**" when the session expires.

## Session Timeout

You can control when a session expires. The default session timeout is two hours of inactivity. It means once the session timeout is reached, the user will be automatically logged out of the console. You can [configure accessTokenMaxAge and accessTokenInactivityTimeout](../../../access-control-and-account-management/external-authentication/set-up-external-authentication/) for the session timeout.

## Signature Verification Failed

In a [multi-cluster environment](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster), `clusterRole` and `jwtSecret` must be set correctly.

## Node Clock Skew 

The node clock skew affects time-sensitive operations such as validating the expiration time of a user token. You can configure the server time synchronization with an NTP server. [MaximumClockSkew](../../../access-control-and-account-management/external-authentication/set-up-external-authentication/) can also be set, which defaults to 10 seconds.