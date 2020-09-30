---
title: "KubeSphere API"
keywords: 'Kubernetes, KubeSphere, API'
description: 'KubeSphere API documentation'


weight: 240
---

In KubeSphere v3.0, we move the functionalities of _ks-apigateway_, _ks-account_ into _ks-apiserver_ to make the architecture more compact and straight forward. In order to use KubeSphere API, you need to expose _ks-apiserver_ to your client.

## Expose KubeSphere API service
If you are going to access KubeSphere inside the cluster, you can skip the following section and just using the KubeSphere API server endpoint **`http://ks-apiserver.kubesphere-system.svc`**. 

But if not, you need to expose the KubeSphere API server endpoint to the outside of the cluster first.

There are many ways to expose a Kubernetes service, for simplicity, we use _NodePort_ in our case. Change service `ks-apiserver` type to NodePort by using following command, and then you are done.
```bash
root@master:~# kubectl -n kubesphere-system patch service ks-apiserver -p '{"spec":{"type":"NodePort"}}'
root@master:~# kubectl -n kubesphere-system get svc
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)              AGE
etcd            ClusterIP      10.233.34.220   <none>           2379/TCP             44d
ks-apiserver    NodePort       10.233.15.31    <none>           80:31407/TCP         49d
ks-console      NodePort       10.233.3.45     <none>           80:30880/TCP         49d
```

Now, you can access `ks-apiserver` outside the cluster through URL like `http://[node ip]:31407`, where `[node ip]` means IP of any node in your cluster.

## Generate a token
There is one more thing to do before calling the API, authorization. Any clients that talk to the KubeSphere API server need to identify themselves first, only after successful authorization will the server respond to the call.

Let's say now a user `jeff` with password `P#$$w0rd` want to generate a token. He/She can issue a request like the following:
```bash
root@master:~# curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \
 'http://[node ip]:31407/oauth/token' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=admin' \
  --data-urlencode 'password=P#$$w0rd'
``` 
If the identity is correct, the server will response something like the following. `access_token` is the token what we need to access the KubeSphere API Server.
```json
{
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTYwMDg1MjM5OCwiaWF0IjoxNjAwODQ1MTk4LCJpc3MiOiJrdWJlc3BoZXJlIiwibmJmIjoxNjAwODQ1MTk4fQ.Hcyf-CPMeq8XyQQLz5PO-oE1Rp1QVkOeV_5J2oX1hvU",
 "token_type": "Bearer",
 "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6InJlZnJlc2hfdG9rZW4iLCJleHAiOjE2MDA4NTk1OTgsImlhdCI6MTYwMDg0NTE5OCwiaXNzIjoia3ViZXNwaGVyZSIsIm5iZiI6MTYwMDg0NTE5OH0.PerssCLVXJD7BuCF3Ow8QUNYLQxjwqC8m9iOkRRD6Tc",
 "expires_in": 7200
}
```
> **Note**: Please substitue `[node ip]:31407` with the real ip address. 

## Make the call

Now you got everything you need to access api server, make the call using the access token just acquire :
```bash
root@master1:~# curl -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTYwMDg1MjM5OCwiaWF0IjoxNjAwODQ1MTk4LCJpc3MiOiJrdWJlc3BoZXJlIiwibmJmIjoxNjAwODQ1MTk4fQ.Hcyf-CPMeq8XyQQLz5PO-oE1Rp1QVkOeV_5J2oX1hvU" \
  -H 'Content-Type: application/json' \
  'http://10.233.15.31/kapis/resources.kubesphere.io/v1alpha3/nodes'

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

## API Reference
KubeSpehre API swagger json can be found in repo https://github.com/kubesphere/kubesphere/blob/master/api/

- KubeSphere specified API [swagger json](https://github.com/kubesphere/kubesphere/blob/master/api/ks-openapi-spec/swagger.json). It contains all the API that only applied to KubeSphere.
- KubeSphere specified CRD [swagger json](https://github.com/kubesphere/kubesphere/blob/master/api/openapi-spec/swagger.json). Contains all the generated CRD api documentation, it's same with Kubernetes api objects.
