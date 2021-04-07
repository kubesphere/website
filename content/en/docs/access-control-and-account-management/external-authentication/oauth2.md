---
title: "OAuth2 Identity Providers"
keywords: 'Kubernetes, KubeSphere, OAuth2, Identity Provider'
description: 'Integrate external OAuth2 providers with KubeSphere using the standard OAuth2 protocol.'
linkTitle: "OAuth2 Identity Providers"
weight: 12230
---

## Overview

You can integrate external OAuth2 providers with KubeSphere using the standard OAuth2 protocol. After the account authentication by external OAuth2 servers, accounts can be associated with KubeSphere. 

![oauth2](/images/docs/access-control-and-account-management/oauth2-identity-provider/oauth2.svg)

## GitHubIdentityProvider

KubeSphere provides you with an example of configuring GitHubIdentityProvider for OAuth2 authentication.

### Parameter settings

To set IdentityProvider parameters, edit the ConfigMap of `kubesphere-config` in the namespace of `kubesphere-system`.

1. Execute the following command.

   ```bash
   kubectl -n kubesphere-system edit cm kubesphere-config
   ```

2. This is an example configuration for your reference.

   ```yaml
   apiVersion: v1
   data:
     kubesphere.yaml: |
       authentication:
         authenticateRateLimiterMaxTries: 10
         authenticateRateLimiterDuration: 10m0s
         loginHistoryRetentionPeriod: 7d
         maximumClockSkew: 10s
         multipleLogin: true
         kubectlImage: kubesphere/kubectl:v1.0.0
         jwtSecret: "jwt secret"
         oauthOptions:
           accessTokenMaxAge: 1h
           accessTokenInactivityTimeout: 30m
           identityProviders:
           - name: github
             type: GitHubIdentityProvider
             mappingMethod: auto
             provider:
               clientID: 'Iv1.547165ce1cf2f590'
               clientSecret: 'c53e80ab92d48ab12f4e7f1f6976d1bdc996e0d7'
               endpoint:
                 authURL: 'https://github.com/login/oauth/authorize'
                 tokenURL: 'https://github.com/login/oauth/access_token'
               redirectURL: 'https://ks-console/oauth/redirect'
               scopes:
               - user
       ...
   ```

3. Add the configuration block for GitHubIdentityProvider in `authentication.oauthOptions.identityProviders`. See the following table for more information about different fields.

   | Field           | Description                                                  |
   | --------------- | ------------------------------------------------------------ |
   | `name`          | The unique name of IdentityProvider.                         |
   | `type`          | The type of IdentityProvider plugin. GitHubIdentityProvider is a default implementation type. |
   | `mappingMethod` | The account mapping configuration. You can use different mapping methods, such as:<br/>- `auto`: The default value. The user account will be automatically created and mapped if the login is successful. <br/>- `lookup`: Using this method requires you to manually provision accounts. <br/>For more information, see [the parameters in GitHub](https://github.com/kubesphere/kubesphere/blob/master/pkg/apiserver/authentication/oauth/oauth_options.go#L37-L44). |
   | `clientID`      | The OAuth2 client ID.                                        |
   | `clientSecret`  | The OAuth2 client secret.                                    |
   | `authURL`       | The OAuth2 endpoint.                                         |
   | `tokenURL`      | The OAuth2 endpoint.                                         |
   | `redirectURL`   | The redirected URL to ks-console.                            |

4. Restart `ks-apiserver` to update the configuration.

   ```bash
   kubectl -n kubesphere-system rollout restart deploy ks-apiserver
   ```

5. Access the login page of the KubeSphere console and you can see the option **Log in with GitHub**.

   ![github-login-page](/images/docs/access-control-and-account-management/oauth2-identity-provider/github-login-page.png)

   ![github-authentication](/images/docs/access-control-and-account-management/oauth2-identity-provider/github-authentication.jpg)

   ![logged-in](/images/docs/access-control-and-account-management/oauth2-identity-provider/logged-in.png)

6. After you log in to the console, the account [can be invited to a workspace](../../workspace-administration/role-and-member-management/) to work in one or more projects.