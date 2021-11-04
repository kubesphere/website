---
title: "Use an OAuth 2.0 Identity Provider"
keywords: 'Kubernetes, KubeSphere, OAuth2, Identity Provider'
description: 'How to use an external OAuth2 identity provider.'
linkTitle: "Use an OAuth 2.0 Identity Provider"
weight: 12230
---

This document describes how to use an external identity provider based on the OAuth 2.0 protocol.

The following figure shows the authentication process between KubeSphere and an external OAuth 2.0 identity provider.

![oauth2](/images/docs/access-control-and-account-management/external-authentication/use-an-oauth2-identity-provider/oauth2.svg)

## Prerequisites

You need to deploy a Kubernetes cluster and install KubeSphere in the cluster. For details, see [Installing on Linux](/docs/installing-on-linux/) and [Installing on Kubernetes](/docs/installing-on-kubernetes/).

## Develop an OAuth 2.0 Plugin

{{< notice note >}}

KubeSphere provides two built-in OAuth 2.0 plugins: [GitHubIdentityProvider](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) for GitHub and  [AliyunIDaasProvider](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) for Alibaba Cloud IDaaS. You can develop other plugins according to the built-in plugins.

{{</ notice >}}

1. Clone the [KubeSphere repository](https://github.com/kubesphere/kubesphere) on your local machine, go to the local KubeSphere repository, and create a package for your plugin in the `/pkg/apiserver/authentication/identityprovider/` directory.

2. In the plugin package, implement the following interfaces:

   ```go
   // /pkg/apiserver/authentication/identityprovider/oauth_provider.go
   type OAuthProvider interface {
   	// Exchange identity with a remote server.
   	IdentityExchange(code string) (Identity, error)
   }
   
   type OAuthProviderFactory interface {
   	// Return the identity provider type.
   	Type() string
   	// Apply settings from kubesphere-config.
   	Create(options oauth.DynamicOptions) (OAuthProvider, error)
   }
   ```

   ```go
   // /pkg/apiserver/authentication/identityprovider/identity_provider.go
   type Identity interface {
     // (Mandatory) Return the identifier of the user at the identity provider.
   	GetUserID() string
     // (Optional) Return the name of the user to be referred as on KubeSphere.
   	GetUsername() string
     // (Optional) Return the email address of the user.
   	GetEmail() string
   }
   ```

3. Register the plugin in the `init()` function of the plugin package.

   ```go
   // Custom plugin package
   func init() {
     // Change <StructName> to the actual name of the struct that
     // implements the OAuthProviderFactory interface.
   	identityprovider.RegisterOAuthProvider(&<StructName>{})
   }
   ```

4. Import the plugin package in `/pkg/apiserver/authentication/options/authenticate_options.go`.

   ```go
   // Change <CustomPackage> to the actual name of your plugin package.
   import (
   	...
   	_ "kubesphere.io/kubesphere/pkg/apiserver/authentication/identityprovider/<CustomPackage>"
   	...
   	)
   ```

5. [Build the image of ks-apiserver](https://github.com/kubesphere/community/blob/104bab42f67094930f2ca87c603b7c6365cd092a/developer-guide/development/quickstart.md) and deploy it in your cluster.

## Integrate an Identity Provider with KubeSphere

1. Log in to KubeSphere as `admin`, move the cursor to <img src="/images/docs/access-control-and-account-management/external-authentication/use-an-oauth2-identity-provider/toolbox.png" width="20px" height="20px"> in the lower-right corner, click **Kubectl**, and run the following command to edit the `kubesphere-config` ConfigMap:

   ```bash
   kubectl -n kubesphere-system edit cm kubesphere-config
   ```

2. Configure fields other than `oauthOptions:identityProviders` in the `data:kubesphere.yaml:authentication` section. For details, see [Set Up External Authentication](../set-up-external-authentication/).

3. Configure fields in `oauthOptions:identityProviders` section according to the identity provider plugin you have developed.

   The following is a configuration example that uses GitHub as an external identity provider. For details, see the [official GitHub documentation](https://docs.github.com/en/developers/apps/building-oauth-apps) and the [source code of the GitHubIdentityProvider](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) plugin.

   ```yaml
   apiVersion: v1
   data:
     kubesphere.yaml: |
       authentication:
         authenticateRateLimiterMaxTries: 10
         authenticateRateLimiterDuration: 10m0s
         jwtSecret: '******'
         oauthOptions:
           accessTokenMaxAge: 1h
           accessTokenInactivityTimeout: 30m
           identityProviders:
           - name: github
             type: GitHubIdentityProvider
             mappingMethod: auto
             provider:
               clientID: '******'
               clientSecret: '******'
               redirectURL: 'https://ks-console/oauth/redirect/github'
   ```

   Similarly, you can also use Alibaba Cloud IDaaS as an external identity provider. For details, see the official [Alibaba IDaaS documentation](https://www.alibabacloud.com/help/product/111120.htm?spm=a3c0i.14898238.2766395700.1.62081da1NlxYV0) and the [source code of the AliyunIDaasProvider](https://github.com/kubesphere/kubesphere/blob/release-3.1/pkg/apiserver/authentication/identityprovider/github/github.go) plugin.

4. After the `kubesphere-config` ConfigMap is modified, run the following command to restart ks-apiserver.

   ```bash
   kubectl -n kubesphere-system rollout restart deploy/ks-apiserver
   ```

   {{< notice note >}}

   The KubeSphere web console is unavailable during the restart of ks-apiserver. Please wait until the restart is complete.

   {{</ notice >}}

5. Go to the KubeSphere login page, click **Log In with XXX** (for example, **Log In with GitHub**).

6. On the login page of the external identity provider, enter the username and password of a user configured at the identity provider to log in to KubeSphere.

   ![github-login-page](/images/docs/access-control-and-account-management/external-authentication/use-an-oauth2-identity-provider/github-login-page.png)

