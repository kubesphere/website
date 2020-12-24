---
title: "KubeSphere API"
keywords: 'Kubernetes, KubeSphere, API'
description: 'KubeSphere API documentation'


weight: 17100
---

## Architecture

The KubeSphere API server validates and configures data for the API objects. 
The API Server services REST operations and provide the frontend to the
cluster's shared state through which all other components interact.

![ks-apiserver](/images/docs/api-reference/ks-apiserver.png)

## How to use KubeSphere API

In KubeSphere v3.0, we move the functionalities of _ks-apigateway_, _ks-account_ into _ks-apiserver_ to make the architecture more compact and straight forward. In order to use KubeSphere API, you need to expose _ks-apiserver_ to your client.


### Step 1: Expose KubeSphere API service

If you are going to access KubeSphere inside the cluster, you can skip the following section and just use the KubeSphere API server endpoint **`http://ks-apiserver.kubesphere-system.svc`**.

On the other hand, you need to expose the KubeSphere API server endpoint to the outside of the cluster first.

There are many ways to expose a Kubernetes service. For simplicity, we use _NodePort_ in our case. Change service `ks-apiserver` type to NodePort by using the following command.

```bash
$ kubectl -n kubesphere-system patch service ks-apiserver -p '{"spec":{"type":"NodePort"}}'
$ kubectl -n kubesphere-system get svc
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)              AGE
etcd            ClusterIP      10.233.34.220   <none>           2379/TCP             44d
ks-apiserver    NodePort       10.233.15.31    <none>           80:31407/TCP         49d
ks-console      NodePort       10.233.3.45     <none>           80:30880/TCP         49d
```

Now, you can access `ks-apiserver` outside the cluster through URL like `http://[node ip]:31407`, where `[node ip]` means IP of any node in your cluster.

### Step 2: Generate a token

You need to identify yourself before making any call to the API server. Let's take a user `jeff` with password `P#$$w0rd` as an example. He needs to issue a request to generate a token like the following:

```bash
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \
 'http://[node ip]:31407/oauth/token' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=admin' \
  --data-urlencode 'password=P#$$w0rd'
```

{{< notice note >}}

Please substitue `[node ip]` with the real ip address.

{{</ notice >}}

If the identity is correct, the server will response something like the following. `access_token` is the token to access the KubeSphere API Server.

```json
{
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTYwMDg1MjM5OCwiaWF0IjoxNjAwODQ1MTk4LCJpc3MiOiJrdWJlc3BoZXJlIiwibmJmIjoxNjAwODQ1MTk4fQ.Hcyf-CPMeq8XyQQLz5PO-oE1Rp1QVkOeV_5J2oX1hvU",
 "token_type": "Bearer",
 "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6InJlZnJlc2hfdG9rZW4iLCJleHAiOjE2MDA4NTk1OTgsImlhdCI6MTYwMDg0NTE5OCwiaXNzIjoia3ViZXNwaGVyZSIsIm5iZiI6MTYwMDg0NTE5OH0.PerssCLVXJD7BuCF3Ow8QUNYLQxjwqC8m9iOkRRD6Tc",
 "expires_in": 7200
}
```

### Step 3: Make the call

Now you got everything you need to access KubeSphere API server. Make the call using the access token acquired above as the following to get node list:

```bash
$ curl -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTYwMDg1MjM5OCwiaWF0IjoxNjAwODQ1MTk4LCJpc3MiOiJrdWJlc3BoZXJlIiwibmJmIjoxNjAwODQ1MTk4fQ.Hcyf-CPMeq8XyQQLz5PO-oE1Rp1QVkOeV_5J2oX1hvU" \
  -H 'Content-Type: application/json' \
  'http://[node ip]:31407/kapis/resources.kubesphere.io/v1alpha3/nodes'

{
 "items": [
  {
   "metadata": {
    "name": "node3",
    "selfLink": "/api/v1/nodes/node3",
    "uid": "dd8c01f3-76e8-4695-9e54-45be90d9ec53",
    "resourceVersion": "84170589",
    "creationTimestamp": "2020-06-18T07:36:41Z",
    "labels": {
     "a": "a",
     "beta.kubernetes.io/arch": "amd64",
     "beta.kubernetes.io/os": "linux",
     "gitpod.io/theia.v0.4.0": "available",
     "gitpod.io/ws-sync": "available",
     "kubernetes.io/arch": "amd64",
     "kubernetes.io/hostname": "node3",
     "kubernetes.io/os": "linux",
     "kubernetes.io/role": "new",
     "node-role.kubernetes.io/worker": "",
     "topology.disk.csi.qingcloud.com/instance-type": "Standard",
     "topology.disk.csi.qingcloud.com/zone": "ap2a"
    },
    "annotations": {
     "csi.volume.kubernetes.io/nodeid": "{\"disk.csi.qingcloud.com\":\"i-icjxhi1e\"}",
     "kubeadm.alpha.kubernetes.io/cri-socket": "/var/run/dockershim.sock",
     "node.alpha.kubernetes.io/ttl": "0",
     ....
```

{{< notice note >}}

Please substitue `[node ip]` with the real ip address.

{{</ notice >}}

## API Reference

KubeSpehre API swagger json can be found in repo https://github.com/kubesphere/kubesphere/tree/release-3.0/api

- KubeSphere specified API [swagger json](https://github.com/kubesphere/kubesphere/blob/release-3.0/api/ks-openapi-spec/swagger.json). It contains all the APIs that are only applied to KubeSphere.
- KubeSphere specified CRD [swagger json](https://github.com/kubesphere/kubesphere/blob/release-3.0/api/openapi-spec/swagger.json). It contains all the generated CRDs API documentation. It is same with Kubernetes api objects.
