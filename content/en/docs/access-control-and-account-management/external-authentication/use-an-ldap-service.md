---
title: "Use an LDAP Service"
keywords: "LDAP, identity provider, external, authentication"
description: "How to use an LDAP service."

linkTitle: "Use an LDAP Service"
weight: 12220
---

This document describes how to use an LDAP service as an external identity provider, which allows you to authenticate users against the LDAP service.

## Prerequisites

* You need to deploy a Kubernetes cluster and install KubeSphere in the cluster. For details, see [Installing on Linux](/docs/installing-on-linux/) and [Installing on Kubernetes](/docs/installing-on-kubernetes/).
* You need to obtain the manager distinguished name (DN) and manager password of an LDAP service.

## Procedure

1. Log in to KubeSphere as `admin`, move the cursor to <img src="/images/docs/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px"> in the lower-right corner, click **kubectl**, and run the following command to edit `ks-installer` of the CRD `ClusterConfiguration`:

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

   Example:

   ```yaml
   spec:
     authentication:
       jwtSecret: ''
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
   
2. Configure fields other than `oauthOptions:identityProviders` in the `spec:authentication` section. For details, see [Set Up External Authentication](../set-up-external-authentication/).

3. Configure fields in `oauthOptions:identityProviders` section.

   * `name`: User-defined LDAP service name.
   * `type`: To use an LDAP service as an identity provider, you must set the value to `LDAPIdentityProvider`.
   * `mappingMethod`: Account mapping method. The value can be `auto` or `lookup`.
     *  If the value is `auto` (default), you need to specify a new username. KubeSphere automatically creates a user according to the username and maps the user to an LDAP user.
     *  If the value is `lookup`, you need to perform step 4 to manually map an existing KubeSphere user to an LDAP user.
   * `provider`:
     * `host`: Address and port number of the LDAP service.
     * `managerDN`: DN used to bind to the LDAP directory.
     * `managerPassword`: Password corresponding to `managerDN`.
     * `userSearchBase`: User search base. Set the value to the DN of the directory level below which all LDAP users can be found.
     * `loginAttribute`: Attribute that identifies LDAP users.
     * `mailAttribute`: Attribute that identifies email addresses of LDAP users.
   
4. If `mappingMethod` is set to `lookup`, run the following command and add the labels to map a KubeSphere user to an LDAP user. Skip this step if `mappingMethod` is set to `auto`.

   ```bash
   kubectl edit user <KubeSphere username>
   ```

   ```yaml
   labels:
     iam.kubesphere.io/identify-provider: <LDAP service name>
     iam.kubesphere.io/origin-uid: <LDAP username>
   ```

5. After the fields are configured, save your changes, and wait until the restart of ks-installer is complete.

   {{< notice note >}}
   
   The KubeSphere web console is unavailable during the restart of ks-installer. Please wait until the restart is complete.
   
   {{</ notice >}}
   
6. Go to the KubeSphere login page and enter the username and password of an LDAP user to log in.

   {{< notice note >}}

   The username of an LDAP user is the value of the attribute specified by `loginAttribute`.

   {{</ notice >}}
