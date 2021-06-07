---
title: "LDAP身份提供者"
keywords: "LDAP, identity provider"
description: "How to configure authentication"

linkTitle: "LDAP身份提供者"
weight: 12201
---

## LDAP Authentication

Set LDAPIdentityProvider in the identityProviders section to validate username and password against an LDAPv3 server using simple bind authentication.

During authentication, the LDAP directory is searched for an entry that matches the provided username. If a single unique match is found, a simple bind is attempted using the DN of the entry plus the provided password.

*Example Configuration Using LDAPIdentityProvider*:

```yaml
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
spec:
  authentication:
    jwtSecret: ********************************
    authenticateRateLimiterMaxTries: 10
    authenticateRateLimiterDuration: 10m
    oauthOptions:
      accessTokenInactivityTimeout: 30m
      accessTokenMaxAge: 1h
      identityProviders:
      - name: ldap
        type: LDAPIdentityProvider
        mappingMethod: auto
        provider:
          host: 192.168.0.2:389
          managerDN: uid=root,cn=users,dc=nas
          managerPassword: ******
          userSearchBase: cn=users,dc=nas
          loginAttribute: uid
          mailAttribute: mail
```

For the above example:

| Parameter | Description |
|-----------|-------------|
| insecureSkipVerify | Used to turn off TLS certificate checks. |
| startTLS | If specified, connections will use the ldaps:// protocol. |
| rootCA | Path to a trusted root certificate file. Default: use the host's root CA. |
| rootCAData | A raw certificate file can also be provided inline. Base64 encoded PEM file. |
| host | The name and port of the LDAP server. |
| managerDN | DN to use to bind during the search phase. |
| managerPassword | Password to use to bind during the search phase. |
| userSearchBase | The search base is the distinguished name (DN) of a level of the directory tree below which all users can be found. |
| userSearchFilter | LDAP filter used to identify objects of type user. e.g. (objectClass=person) |
| loginAttribute | User naming attributes identify user objects, will be mapped to KubeSphere account name. |
| mailAttribute | The mail attribute will be mapped to the KubeSphere account. |