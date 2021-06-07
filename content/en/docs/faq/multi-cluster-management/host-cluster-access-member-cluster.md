---
title: "Restore the Host Cluster Access to A Member Cluster"
keywords: "Kubernetes, KubeSphere, Multi-cluster, Host Cluster, Member Cluster"
description: "Learn how to restore the Host Cluster access to a Member Cluster."
linkTitle: "Restore the Host Cluster Access to A Member Cluster"
Weight: 16720
---

KubeSphere features [multi-cluster maganement](../../../multicluster-management/introduction/kubefed-in-kubesphere/) and tenants with necessary permissions (usually cluster administrators) can access the central control plane from the Host Cluster to manage all the Member Clusters. It is highly recommended that you manage your resources across your cluster through the Host Cluster.

This tutorial demomstrates how to restore the Host Cluster access to a Member Cluster.

## Possible Error Message

If you can't access a Member Cluster from the central control plane and your browser keeps redirecting you to the login page of KubeSphere, run the following command on that Member Cluster to get the logs of the ks-apiserver.

```
kubectl -n kubesphere-system logs ks-apiserver-7c9c9456bd-qv6bs
```

{{< notice note >}}

`ks-apiserver-7c9c9456bd-qv6bs` refers to the Pod ID on that Member Cluster. Make sure you use the ID of your own Pod.

{{</ notice >}}

You will probably see the following error message:

```
E0305 03:46:42.105625       1 token.go:65] token not found in cache
E0305 03:46:42.105725       1 jwt_token.go:45] token not found in cache
E0305 03:46:42.105759       1 authentication.go:60] Unable to authenticate the request due to error: token not found in cache
E0305 03:46:52.045964       1 token.go:65] token not found in cache
E0305 03:46:52.045992       1 jwt_token.go:45] token not found in cache
E0305 03:46:52.046004       1 authentication.go:60] Unable to authenticate the request due to error: token not found in cache
E0305 03:47:34.502726       1 token.go:65] token not found in cache
E0305 03:47:34.502751       1 jwt_token.go:45] token not found in cache
E0305 03:47:34.502764       1 authentication.go:60] Unable to authenticate the request due to error: token not found in cache
```

## Solution

### Step 1: Verify the jwtSecret

Run the following command on your Host Cluster and Member Cluser respectively to confirm whether their jwtSecrets are identical.

```
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v “apiVersion” | grep jwtSecret
```

### Step 2: Modify `accessTokenMaxAge`

Make sure the jwtSecrets are identical, then run the following command on that Member Cluster to get the value of `accessTokenMaxAge`. 

```
kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep accessTokenMaxAge
```

If the value is not `0`, run the following command to modify the value of `accessTokenMaxAge`.

```
kubectl -n kubesphere-system edit cm kubesphere-config -o yaml
```

After you modified the value of `accessTokenMaxAge` to `0`, run the following command to restart the ks-apiserver.

```
kubectl -n kubesphere-system rollout restart deploy ks-apiserver
```

Now, you can access that Member Cluster from the central control plane again.