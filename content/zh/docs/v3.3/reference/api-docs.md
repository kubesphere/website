---
title: "KubeSphere API"
keywords: 'Kubernetes, KubeSphere, API'
description: 'REST API 是 KubeSphere 的基本结构。本指南向您展示如何访问 KubeSphere API 服务器。'
linkTitle: "KubeSphere API"
weight: 17200
---

## 架构

KubeSphere API 服务器为 API 对象验证和配置数据。API 服务器为 REST 操作提供服务，并为集群的共享状态提供前端，其他所有组件通过它进行交互。

其中 /kapi 和/kapis 是 KubeSphere 拓展聚合的 API，/api和 /apis开头的都属于 Kubernetes 原生的 API，KubeSphere 把用户对原生 Kubernetes 资源的请求通过 API Server 转发到 Kubernetes API Server 对原生资源进行操作和管理。

![ks-apiserver](/images/docs/v3.3/zh-cn/reference/kubesphere-api/ks-apiserver.png)

## 使用 KubeSphere API

KubeSphere 3.0 将 **ks-apigateway** 和 **ks-account** 功能移动至 **ks-apiserver** 中，使架构更加紧凑和清晰。要使用 KubeSphere API，您需要将 **ks-apiserver** 暴露给您的客户端。


### 步骤 1：暴露 KubeSphere API 服务

如果您要在集群内部访问 KubeSphere，可以跳过以下内容，使用 KubeSphere API 服务器 Endpoint **`http://ks-apiserver.kubesphere-system.svc`** 即可。

如果从集群外部访问，您需要先将 KubeSphere API 服务器 Endpoint 暴露给集群外部。

暴露 Kubernetes 服务的方式有很多。本示例使用 `NodePort` 来演示。使用以下命令将 `ks-apiserver` 的服务类型变更为 `NodePort`。

```bash
$ kubectl -n kubesphere-system patch service ks-apiserver -p '{"spec":{"type":"NodePort"}}'
$ kubectl -n kubesphere-system get svc
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)              AGE
etcd            ClusterIP      10.233.34.220   <none>           2379/TCP             44d
ks-apiserver    NodePort       10.233.15.31    <none>           80:31407/TCP         49d
ks-console      NodePort       10.233.3.45     <none>           80:30880/TCP         49d
```

现在，您可以从集群外部通过 URL（例如 `http://[node ip]:31407`）访问 `ks-apiserver`，其中 `[node ip]` 是您集群中任意节点的 IP 地址。

### 步骤 2：生成令牌

您需要先验证身份，然后才能向 API 服务器发起调用。下面的示例使用的密码是 `P#$$w0rd`。用户需要发起请求来生成令牌，如下所示：

```bash
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \
 'http://[node ip]:31407/oauth/token' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=admin' \
  --data-urlencode 'password=P#$$w0rd'
  --data-urlencode 'client_id=kubesphere' \
  --data-urlencode 'client_secret=kubesphere'
```

{{< notice note >}}

将 `[node ip]` 替换为您的实际 IP 地址。你可以在 `ClusterConfiguration` 中配置客户端凭证, 存在一个默认的客户端凭证 `client_id` 和 `client_secret` 的值为 `kubesphere`。

{{</ notice >}}

如果身份正确，服务器将输出响应，如下所示。`access_token` 是访问 KubeSphere API 服务器的令牌。

```json
{
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTYwMDg1MjM5OCwiaWF0IjoxNjAwODQ1MTk4LCJpc3MiOiJrdWJlc3BoZXJlIiwibmJmIjoxNjAwODQ1MTk4fQ.Hcyf-CPMeq8XyQQLz5PO-oE1Rp1QVkOeV_5J2oX1hvU",
 "token_type": "Bearer",
 "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidWlkIjoiYTlhNjJmOTEtYWQ2Yi00MjRlLWIxNWEtZTFkOTcyNmUzNDFhIiwidG9rZW5fdHlwZSI6InJlZnJlc2hfdG9rZW4iLCJleHAiOjE2MDA4NTk1OTgsImlhdCI6MTYwMDg0NTE5OCwiaXNzIjoia3ViZXNwaGVyZSIsIm5iZiI6MTYwMDg0NTE5OH0.PerssCLVXJD7BuCF3Ow8QUNYLQxjwqC8m9iOkRRD6Tc",
 "expires_in": 7200
}
```

### 步骤 3：发起调用

如果您访问 KubeSphere API 服务器的准备工作都已做完，请使用上一步中获取的访问令牌来发起调用，以获取节点列表，如下所示：

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

将 `[node ip]` 替换为您的实际 IP 地址。

{{</ notice >}}

## API 参考

KubeSphere API Swagger JSON 文件可以在 https://github.com/kubesphere/kubesphere/tree/release-3.3/api 仓库中找到。

- KubeSphere 已指定 API [Swagger Json](https://github.com/kubesphere/kubesphere/blob/release-3.1/api/ks-openapi-spec/swagger.json) 文件，它包含所有只适用于 KubeSphere 的 API。
- KubeSphere 已指定 CRD [Swagger Json](https://github.com/kubesphere/kubesphere/blob/release-3.1/api/openapi-spec/swagger.json) 文件，它包含所有已生成的 CRD API 文档，与 Kubernetes API 对象相同。
- kubernetes API 参考：https://kubernetes.io/docs/concepts/overview/kubernetes-api/

您也可以[点击这里](https://kubesphere.io/api/kubesphere)查看 KubeSphere API 文档。
