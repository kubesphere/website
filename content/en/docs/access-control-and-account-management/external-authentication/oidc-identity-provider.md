---
title: "OIDC identity provider"
keywords: "OIDC, identity provider"
description: "How to use an external OIDC identity provider."

linkTitle: "OIDC identity provider"
weight: 12221
---

## OIDC Identity Provider

[OpenID Connect](https://openid.net/connect/) is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. It uses straightforward REST/JSON message flows with a design goal of “making simple things simple and complicated things possible”. It’s uniquely easy for developers to integrate, compared to any preceding Identity protocol, such as Keycloak, Okta, Dex, Auth0, Gluu, and many more.

## Prerequisites

You need to deploy a Kubernetes cluster and install KubeSphere in the cluster. For details, see [Installing on Linux](/docs/installing-on-linux/) and [Installing on Kubernetes](/docs/installing-on-kubernetes/).

## Procedure

1. Log in to KubeSphere as `admin`, move the cursor to <img src="/images/docs/access-control-and-account-management/external-authentication/set-up-external-authentication/toolbox.png" width="20px" height="20px"> in the lower-right corner, click **kubectl**, and run the following command to edit `ks-installer` of the CRD `ClusterConfiguration`:

   ```bash
   kubectl -n kubesphere-system edit cc ks-installer
   ```

2. Add the following fields under `spec.authentication.jwtSecret`. 

   *Example of using [Google Identity Platform](https://developers.google.com/identity/protocols/oauth2/openid-connect)*:

   ```yaml
   spec:
     authentication:
       jwtSecret: ''
       authenticateRateLimiterMaxTries: 10
       authenticateRateLimiterDuration: 10m0s
       oauthOptions:
         accessTokenMaxAge: 1h
         accessTokenInactivityTimeout: 30m
         identityProviders:
         - name: google
           type: OIDCIdentityProvider
           mappingMethod: auto
           provider:
             clientID: '********'
             clientSecret: '********'
             issuer: https://accounts.google.com
             redirectURL:  'https://ks-console/oauth/redirect/google'
   ```

   See description of parameters as below:

   | Parameter            | Description                                                  |
   | -------------------- | ------------------------------------------------------------ |
   | clientID             | The OAuth2 client ID.                                        |
   | clientSecret         | The OAuth2 client secret.                                    |
   | redirectURL          | The redirected URL to ks-console.                            |
   | issuer               | Defines how Clients dynamically discover information about OpenID Providers. |
   | preferredUsernameKey | Configurable key which contains the preferred username claims. |
   | emailKey             | Configurable key which contains the email claims.            |
   | getUserInfo          | GetUserInfo uses the userinfo endpoint to get additional claims for the token. This is especially useful where upstreams return "thin" ID tokens. |
   | insecureSkipVerify   | Used to turn off TLS certificate verify.                     |

