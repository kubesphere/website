---
title: "Configure Authentication"
keywords: "LDAP, identity provider"
description: "Learn how to set up authentication in KubeSphere."

linkTitle: "Configure Authentication"
weight: 12200
---

## Objective

This guide demonstrates how to set up authentication. You can use external identity providers such as LDAP or Active Directory for KubeSphere.

## Prerequisites

KubeSphere needs to be installed in your machines.

## Overview

KubeSphere includes a built-in OAuth server. Users obtain OAuth access tokens to authenticate themselves to the API.

As an administrator, you can configure OAuth by editing configmap to specify an identity provider.




## Authentication Configuration

KubeSphere has an internal account management system. You can modify the kubesphere authentication configuration by the following command:

*Example Configuration*:

```bash
kubectl -n kubesphere-system edit cm kubesphere-config
```

```yaml
apiVersion: v1
data:
  kubesphere.yaml: |
    authentication:
      authenticateRateLimiterMaxTries: 10
      authenticateRateLimiterDuration: 10m0s
      loginHistoryRetentionPeriod: 168h
      maximumClockSkew: 10s
      multipleLogin: true
      jwtSecret: "xxxxxxxxxxxx"
      oauthOptions:
        accessTokenMaxAge: 1h
        accessTokenInactivityTimeout: 30m
        identityProviders:
          ...
```

For the above example:

| Parameter | Description |
|-----------|-------------|
| authenticateRateLimiterMaxTries | AuthenticateRateLimiter defines under which circumstances we will block user. |
| authenticateRateLimiterDuration | A user will be blocked if his/her failed login attempt reaches AuthenticateRateLimiterMaxTries in AuthenticateRateLimiterDuration for about AuthenticateRateLimiterDuration. |
| loginHistoryRetentionPeriod | Retention login history, records beyond this amount will be deleted. |
| maximumClockSkew |  Controls the maximum allowed clock skew when performing time-sensitive operations, such as validating the expiration time of a user token. The default value for maximum clock skew is `10 seconds`. |
| multipleLogin |  Allow multiple users login from different location at the same time. The default value for multiple login is `true`. |
| jwtSecret | Secret to sign user token. Multi-cluster environments [need to use the same secret](../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster). |
| accessTokenMaxAge |  AccessTokenMaxAge control the lifetime of access tokens. The default lifetime is 2 hours. Setting the `accessTokenMaxAge` to 0 means the token will not expire, it will be set to 0 when the cluster role is member. |
| accessTokenInactivityTimeout | Inactivity timeout for tokens. The value represents the maximum amount of time that can occur between consecutive uses of the token. Tokens become invalid if they are not used within this temporal window. The user will need to acquire a new token to regain access once a token times out. |


After modifying the identity provider configuration, you need to restart the ks-apiserver.

```bash
kubectl -n kubesphere-system rollout restart deploy/ks-apiserver
```

## Identity Providers

You can define additional authentication configuration in the `identityProviders `section.

### LDAP Authentication

Set LDAPIdentityProvider in the identityProviders section to validate username and password against an LDAPv3 server using simple bind authentication.

During authentication, the LDAP directory is searched for an entry that matches the provided username. If a single unique match is found, a simple bind is attempted using the DN of the entry plus the provided password.

There are four parameters common to all identity providers:

| Parameter | Description |
|-----------|-------------|
| name | The name of the identity provider is associated with the user label. |
| mappingMethod | The account mapping configuration. You can use different mapping methods, such as:<br/>- `auto`: The default value. The user account will be automatically created and mapped if the login is successful. <br/>- `lookup`: Using this method requires you to manually provision accounts. |

*Example Configuration Using LDAPIdentityProvider*:

```yaml
apiVersion: v1
data:
  kubesphere.yaml: |
    authentication:
      authenticateRateLimiterMaxTries: 10
      authenticateRateLimiterDuration: 10m0s
      loginHistoryRetentionPeriod: 168h
      maximumClockSkew: 10s
      multipleLogin: true
      jwtSecret: "xxxxxxxxxxxx"
      oauthOptions:
        accessTokenMaxAge: 1h
        accessTokenInactivityTimeout: 30m
        identityProviders:
        - name: ldap
          type: LDAPIdentityProvider
          mappingMethod: auto
          provider:
            host: 192.168.0.2:389
            managerDN: uid=root,cn=users,dc=nas
            managerPassword: 4p4@XuP#dP6U
            userSearchBase: cn=users,dc=nas
            loginAttribute: uid
            mailAttribute: mail
```

For the above example:

| Parameter | Description |
|-----------|-------------|
| host | The name and port of the LDAP server. |
| managerDN | DN to use to bind during the search phase. |
| managerPassword | Password to use to bind during the search phase. |
| userSearchBase | The search base is the distinguished name (DN) of a level of the directory tree below which all users can be found.  |
| loginAttribute | User naming attributes identify user objects, will be mapped to KubeSphere account name. |
| mailAttribute | The mail attribute will be mapped to the KubeSphere account. |

{{< notice tip >}}

LDAPS is not supported now. Planned at `v3.1.0`.

{{</ notice >}}
