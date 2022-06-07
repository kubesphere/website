---
title: "Set Up External Authentication"
keywords: "LDAP, external, third-party, authentication"
description: "How to set up external authentication on KubeSphere."

linkTitle: "Set Up External Authentication"
weight: 12210
---

This document describes how to use an external identity provider such as an LDAP service or Active Directory service on KubeSphere.

KubeSphere provides a built-in OAuth server. Users can obtain OAuth access tokens to authenticate themselves to the KubeSphere API. As a KubeSphere administrator, you can edit  `ks-installer` of the CRD `ClusterConfiguration` to configure OAuth and specify identity providers.

## Prerequisites

You need to deploy a Kubernetes cluster and install KubeSphere in the cluster. For details, see [Installing on Linux](/docs/installing-on-linux/) and [Installing on Kubernetes](/docs/installing-on-kubernetes/).


## Procedure

1. Log in to KubeSphere as `admin`, move the cursor to <img src="/images/docs/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px"> in the lower-right corner, click **kubectl**, and run the following command to edit `ks-installer` of the CRD `ClusterConfiguration`:

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

2. Add the following fields under `spec.authentication.jwtSecret`. 

   Example:

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
   
   The fields are described as follows:

   * `jwtSecret`: Secret used to sign user tokens. In a multi-cluster environment, all clusters must [use the same Secret](../../../multicluster-management/enable-multicluster/direct-connection/#prepare-a-member-cluster). 
   * `authenticateRateLimiterMaxTries`: Maximum number of consecutive login failures allowed during a period specified by `authenticateRateLimiterDuration`. If the number of consecutive login failures of a user reaches the limit, the user will be blocked.
   * `authenticateRateLimiterDuration`: Period during which `authenticateRateLimiterMaxTries` applies.
   * `loginHistoryRetentionPeriod`: Retention period of login records. Outdated login records are automatically deleted.
   * `maximumClockSkew`: Maximum clock skew for time-sensitive operations such as token expiration validation. The default value is `10s`.
   * `multipleLogin`: Whether multiple users are allowed to log in from different locations. The default value is `true`.
   * `oauthOptions`: OAuth settings.
     * `accessTokenMaxAge`: Access token lifetime. For member clusters in a multi-cluster environment, the default value is `0h`, which means access tokens never expire. For other clusters, the default value is `2h`.
     * `accessTokenInactivityTimeout`: Access token inactivity timeout period. An access token becomes invalid after it is idle for a period specified by this field. After an access token times out, the user needs to obtain a new access token to regain access.
     * `identityProviders`: Identity providers.
       * `name`: Identity provider name.
       * `type`: Identity provider type.
       * `mappingMethod`: Account mapping method. The value can be `auto` or `lookup`.
         * If the value is `auto` (default), you need to specify a new username. KubeSphere automatically creates a user according to the username and maps the user to a third-party account.
         * If the value is `lookup`, you need to perform step 3 to manually map an existing KubeSphere user to a third-party account.
       * `provider`: Identity provider information. Fields in this section vary according to the identity provider type.
   
3. If `mappingMethod` is set to `lookup`, run the following command and add the labels to map a KubeSphere user to a third-party account. Skip this step if `mappingMethod` is set to `auto`.

   ```bash
   kubectl edit user <KubeSphere username>
   ```
   
   ```yaml
   labels:
     iam.kubesphere.io/identify-provider: <Identity provider name>
     iam.kubesphere.io/origin-uid: <Third-party username>
   ```
   
4. After the fields are configured, save your changes, and wait until the restart of ks-installer is complete.

   {{< notice note >}}
   
   In a multi-cluster environment, you only need to configure the host cluster.
   
   {{</ notice >}} 


## Identity provider

You can configure multiple identity providers (IdPs) in the 'identityProviders' section. The identity provider authenticates the user and provides an identity token to kubesphere.

Kubesphere provides the following types of identity providers by default:

* [LDAP Identity Provider](../use-an-ldap-service)

* [OIDC Identity Provider](../oidc-identity-provider)

* GitHub Identity Provider

* CAS Identity Provider

* Aliyun IDaaS Provider

You can also expand the kubesphere [OAuth2 authentication plug-in](../use-an-oauth2-identity-provider) to integrate with your account system.
