---
title: '在 KubeSphere 中监控集群外部 Etcd'
tag: 'Kubernetes, KubeSphere'
keywords: 'Kubernetes, Etcd, KubeSphere'
description: '经研究发现，KubeSphere 自带的集群状态监控中有 Etcd 监控的页面展示，但是在 KubeSphere 3.2.1 版本中，默认配置开启 Etcd 监控后，集群状态中的 Etcd 监控页面确实没有任何数据。本文将记录里解决该问题的排障之旅。'
createTime: '2022-04-21'
author: '老 Z'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-k8s-etcd-cover.png'
---

## 1. 本文简介

本文源于 KubeSphere 开源社区 8 群里的一个小伙伴 @Jam 提到的 Ectd 监控没有数据，希望我帮忙看一下。本来我也是没有启用 Etcd 监控的，但是既然小伙伴如此信任我提了要求了，那必须安排。所以才有了本文。

经研究发现，KubeSphere 自带的集群状态监控中有 Etcd 监控的页面展示，但是在 KubeSphere 3.2.1 版本中，默认配置开启 Etcd 监控后，集群状态中的 Etcd 监控页面确实没有任何数据。本文将记录里解决该问题的排障之旅。

**本文知识点**

- 定级：**入门级**
- **Prometheus-Operator**
- KubeSphere 开启 Etcd 监控

**演示服务器配置**

|      主机名      |      IP      | CPU | 内存 | 系统盘 | 数据盘 |               用途               |
| :--------------: | :----------: | :-: | :--: | :----: | :----: | :------------------------------: |
|  zdeops-master   | 192.168.9.9  |  2  |  4   |   40   |  200   |       Ansible 运维控制节点       |
| ks-k8s-master-0  | 192.168.9.91 |  8  |  32  |   40   |  200   | KubeSphere/k8s-master/k8s-worker |
| ks-k8s-master-1  | 192.168.9.92 |  8  |  32  |   40   |  200   | KubeSphere/k8s-master/k8s-worker |
| ks-k8s-master-2  | 192.168.9.93 |  8  |  32  |   40   |  200   | KubeSphere/k8s-master/k8s-worker |
| glusterfs-node-0 | 192.168.9.95 |  4  |  8   |   40   |  200   |     GlusterFS/ElasticSearch      |
| glusterfs-node-1 | 192.168.9.96 |  4  |  8   |   40   |  200   |     GlusterFS/ElasticSearch      |
| glusterfs-node-2 | 192.168.9.97 |  4  |  8   |   40   |  200   |     GlusterFS/ElasticSearch      |

## 2. KubeSphere CRD 开启 Etcd 监控

1. 编辑 **CRD** 中的 **ks-installer** 的 YAML 配置文件。

   在 YAML 文件中，搜索 **Etcd**，并将 **monitoring** 的 **false** 改为 **true。**

   ```yaml
   etcd:
     endpointIps: '192.168.9.91,192.168.9.92,192.168.9.93'
     monitoring: true
     port: 2379
     tlsEnable: true
   ```

2. 所有配置完成后，点击右下角的确定，保存配置。

3. 在 Kubectl 中执行以下命令检查安装过程。

   ```shell
   kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
   ```

   结果不做展示。

4. 验证安装结果。

   登录控制台，**平台管理**->**集群管理**->**监控告警**->**集群状态**，检查 **etcd 监控**标签页是否存在，如果存在，表明监控开启成功。

5. 虽然前面配置开启了，但是此时监控数据并不存在。同时，检查 **prometheus-k8s** 的 Pod 会发现如下报错。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-5.png)

6. 接下来我们会讲解原因和配置方法。

## 3. 问题解决过程记录

1. 查找官方论坛，关键词使用 **Etcd** 找到了以下一篇看着比较接近的文档，打开来看看。

   > [Etcd 使用自签名证书，prometheus 报错未知机构签发 #2.11](https://ask.kubesphere.io/forum/d/1322-etcd-prometheus-2-11 "etcd 使用自签名证书，prometheus 报错未知机构签发 #2.11")

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-1.png)

   但是文档里并没有详细的问题解决过程，看的我是一头雾水，但是获得了很重要的配置步骤。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/image-20220419121600932.png)

2. 根据上面 get 到的关键点 **1**，**用外部 Etcd 的证书生成 secret**。

   这条命令就是为了根据 Etcd 的 cert 生成一个 secret 配置。

   ```shell
   # kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs --from-file=etcd-client-ca.crt=/etc/ssl/etcd/ssl/ca.pem --from-file=etcd-client.crt=/etc/ssl/etcd/ssl/admin-i-ezjb7gsk.pem --from-file=etcd-client.key=/etc/ssl/etcd/ssl/admin-i-ezjb7gsk-key.pem
   ```

   先不急，先看看 secret 是否存在，如果不存在再根据命令生成。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get secrets -n kubesphere-monitoring-system
   NAME                                         TYPE                                  DATA   AGE
   additional-scrape-configs                    Opaque                                1      9d
   alertmanager-main                            Opaque                                1      9d
   alertmanager-main-generated                  Opaque                                1      9d
   alertmanager-main-tls-assets                 Opaque                                0      9d
   alertmanager-main-token-7b9xc                kubernetes.io/service-account-token   3      9d
   default-token-tnxh7                          kubernetes.io/service-account-token   3      9d
   kube-etcd-client-certs                       Opaque                                3      9d
   kube-state-metrics-token-czbrg               kubernetes.io/service-account-token   3      9d
   node-exporter-token-qrhl7                    kubernetes.io/service-account-token   3      9d
   notification-manager-sa-token-lc6z4          kubernetes.io/service-account-token   3      9d
   notification-manager-webhook-server-cert     kubernetes.io/tls                     2      9d
   prometheus-k8s                               Opaque                                1      9d
   prometheus-k8s-tls-assets                    Opaque                                0      9d
   prometheus-k8s-token-7fk45                   kubernetes.io/service-account-token   3      9d
   prometheus-operator-token-wlmcf              kubernetes.io/service-account-token   3      9d
   sh.helm.release.v1.notification-manager.v1   helm.sh/release.v1                    1      9d
   ```

   居然发现了 **kube-etcd-client-certs**。

   再看看具体内容 , 发现该有的都有，一个不少。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get secrets -n kubesphere-monitoring-system kube-etcd-client-certs -o yaml
   apiVersion: v1
   data:
     etcd-client-ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM5VENDQWQyZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFTTVJBd0RnWURWUVFERXdkbGRHTmsKTFdOaE1CNFhEVEl5TURRd09URTBNekl5TjFvWERUTXlNRFF3TmpFME16SXlOMW93RWpFUU1BNEdBMVVFQXhNSApaWFJqWkMxallUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU53SnpobDFPSVpyCkZYOUNsbER3czVVdnA5NkxHOHpxWkZGbmRGZVBlb1RrTXlFSVpESFRQM0lYSFhzaFFPNjF3VlpVd3VvMmJoeTcKdTBLbEFUcXZmZ1ZJTWE2MlpKTFVNcGwrendvMnFDcWpzbHd1b3RacHArTHVYaldYRTFOeWcwWi9MRmd3NDArOQpGSDV3Y2VWK0FhNjhETElKQWw4a0l6VktScVgraENjZGVTOFRWbDNVeS9PMWRkRFJGODExYzB6VTNteEF2Z0h5CmlxOFF0S2dBQ3E0L294N3RPRFRZUVNlVVdOa25tZTBLMituWmR6M1RveHpUamdIZ2FDVlFXVW5nNFNyMVlSYWwKV2owTGlET2tWb2l3TlFrSVd6ZnBrVXUrM2RJUGNPL29Wc0E3eEJLenhGdEp2dmthTGU1ZDd6a3p2d2xVdE1NYgp2NzNzNERqNU0yc0NBd0VBQWFOV01GUXdEZ1lEVlIwUEFRSC9CQVFEQWdLa01BOEdBMVVkRXdFQi93UUZNQU1CCkFmOHdIUVlEVlIwT0JCWUVGREh3WUNYcW90OG9oYWNZa1FBaHMrRjNSWW5tTUJJR0ExVWRFUVFMTUFtQ0IyVjAKWTJRdFkyRXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBS3l3SEJpVEkxYjExQjNrTDJNZFN0WGRaZ2ZNT05obApuZ1QyUjVuQWZISUVTZVRGNnpFbWh6QnBRb3ozMm1GbG1VdlRKMjdhdVk4UGh2cC9pT0pKbWZIZnY3RWcyYVpJCmlkK2w5YTJoQXFrMnVnNmV4NFpjUzgvOUxyTUV3SlhDOGZqeTA0OWdLQjIyMXFuSFh0Q3VyNE95MUFyMHBiUUwKaEQ4T0lpaExBbHpZNnIvQTlzVDYrNU12cy80OE5LeWN0Sy9KYzFhbVVQK0tnWXlPWDNWNXVsM096MFpIT2ptRAo5akIrdlNHUHM5REdrdnJEeFp4SDRIM0NhaTF5cHBlc29YVFZndS81UTFjcVlvdGNJalZpekx5eVNjZ1EzQ2ZqCmVvdnk3NW8vZUdiRmpYSmJQV0NncDhYV2RJWkVmcmNXMXZtWjZPZDVmcXIwblY5QVExekhueWs9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
     etcd-client.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUQrVENDQXVHZ0F3SUJBZ0lJT2Y3Ky90T3NYa013RFFZSktvWklodmNOQVFFTEJRQXdFakVRTUE0R0ExVUUKQXhNSFpYUmpaQzFqWVRBZUZ3MHlNakEwTURreE5ETXlNamRhRncwek1qQTBNRFl4TkRNeU16QmFNQ1F4SWpBZwpCZ05WQkFNVEdXVjBZMlF0Ym05a1pTMXJjeTFyT0hNdGJXRnpkR1Z5TFRBd2dnRWlNQTBHQ1NxR1NJYjNEUUVCCkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDN0NvS1dWKzJKeXRVRTc2VnhvU3lOZzZXOU4yRUlxaTA5UkQ3TThTYUMKZzNHSFZJcXRjWUZzWEhNSHNGeGkyc0ltRWdTblRQMU1sS2Y2Q2xoZ1llSUJqbHJjdWVGNzNDUW45dkw3bXdqMwpJVzV0cUJ4Z1BwRmpvc1FQcGs5eU5XWmpEVGJsbHJTbkZjTXNKekFEOXNIZjdiRWUrQTZJcnJDUnhLZGJWaVY1CnFveFR5THhJenF4c2NDMlMwclJCYk5YbHAzZFU1QStldGZhOUYxUFNCeDQxdmk1MXcvTnBVRkNOa2ZuaWhyZnUKcUVoYW0zNUdCbFYrRzd4ZENSVGt6K3h3V3IwdnhMUitueGZ5MElHL2hyYlIxL0RLbHo5Y3BnbHhTWUg5S3ZvbgpzVXRpemhQYXVsRFZIN2NFdTJGOWZuTHZlK2hZemt3c3hhS1RsQTFlQ2VEeEFnTUJBQUdqZ2dFL01JSUJPekFPCkJnTlZIUThCQWY4RUJBTUNCYUF3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdFR0NDc0dBUVVGQndNQ01Bd0cKQTFVZEV3RUIvd1FDTUFBd0h3WURWUjBqQkJnd0ZvQVVNZkJnSmVxaTN5aUZweGlSQUNHejRYZEZpZVl3Z2RvRwpBMVVkRVFTQjBqQ0J6NElFWlhSalpJSVFaWFJqWkM1cmRXSmxMWE41YzNSbGJZSVVaWFJqWkM1cmRXSmxMWE41CmMzUmxiUzV6ZG1PQ0ltVjBZMlF1YTNWaVpTMXplWE4wWlcwdWMzWmpMbU5zZFhOMFpYSXViRzlqWVd5Q0QydHoKTFdzNGN5MXRZWE4wWlhJdE1JSVBhM010YXpoekxXMWhjM1JsY2kweGdnOXJjeTFyT0hNdGJXRnpkR1Z5TFRLQwpFMnhpTG10MVltVnpjR2hsY21VdWJHOWpZV3lDQ1d4dlkyRnNhRzl6ZEljRWZ3QUFBWWNRQUFBQUFBQUFBQUFBCkFBQUFBQUFBQVljRXdLZ0pXNGNFd0tnSlhJY0V3S2dKWFRBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQXZOR2gKdHdlTG1QS2F2YjVhOFoxU2sxQkFZdzZ6dEdHTnJGdzg2M1dKRVBEblFFa3duOFhJNGh4SU82UVV3eHJic1MweAp0YUg2ZmRKeFZZcEN5UXVrV3JldHpkZ05zMTVWYnlNdUlqVkJRMytGZnBRaDB5T25tUXlmRWc2UWZNdU5IWGpJCjZCdVp5M0p0S0tFZGZmUFh4U3VlMFV2TG5idlN6U0tVQkRIcy9nNVV0Q3cyeHVIVFU5bFdoQXY2dm1WQ08yQW4KZmc2MjAzMUpUNG9ya2F6c1hmdENOTlZqUmdIZ2pjQ0NDZkMwY1hSRVZTVFZqZUFaZU40ZUdtYWlRcFdEUWkxbApUVWZJMlE0dGRySlFsOXk0dDNKRDgrSmFLT0VJWkt3NWVWaTc3cUZobWR1MmFkRThkODc0aVBnN2ZEYmVFS2tWCkYxVWVKb3NKOFN3Z1psWTRpQT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
     etcd-client.key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBdXdxQ2xsZnRpY3JWQk8rbGNhRXNqWU9sdlRkaENLb3RQVVErelBFbWdvTnhoMVNLCnJYR0JiRnh6QjdCY1l0ckNKaElFcDB6OVRKU24rZ3BZWUdIaUFZNWEzTG5oZTl3a0ovYnkrNXNJOXlGdWJhZ2MKWUQ2Ulk2TEVENlpQY2pWbVl3MDI1WmEwcHhYRExDY3dBL2JCMysyeEh2Z09pSzZ3a2NTblcxWWxlYXFNVThpOApTTTZzYkhBdGt0SzBRV3pWNWFkM1ZPUVBuclgydlJkVDBnY2VOYjR1ZGNQemFWQlFqWkg1NG9hMzdxaElXcHQrClJnWlZmaHU4WFFrVTVNL3NjRnE5TDhTMGZwOFg4dENCdjRhMjBkZnd5cGMvWEtZSmNVbUIvU3I2SjdGTFlzNFQKMnJwUTFSKzNCTHRoZlg1eTczdm9XTTVNTE1XaWs1UU5YZ25nOFFJREFRQUJBb0lCQVFDamQ1c0x4SXNRMjFsegpOL0xUTFhhZnM0ZmRxQkhCSGVIdDRzQTBJeXB4OUdqN1NwTHM1UCtrOGVPQ3U4cnlocGdaNTdOemVDRUVsZ044Cnp4L1FGSndPbWhpbFFqdGtJZERqc0x0SjFJUndZQ0ovNmVYcTQ2UHpmV1IyL1BZQUxkVnZDalNKVVQ1UHJRQm4KalZRMGtxdDhodU0rMnJMeEdDT3ZNanpGNGJOYzhZZGFSOTI0c095Y1Q2UzI1Vzg3TklQWnVqY3VBUXIzaEE2bwpUbEdmVU44Q0hSM21jVnBIbEJ1NDhEeEpYaml2MkVKZTRHSmN2L0NWQTVqVGNNNlNoTjJuSGN3OGpHYVg0bGJtCjJYaktKemE0RStON3hGRXBRVEJRMUNqRGM1cndKY0tKUm9IQkxFUGtJVE5LWnNWSDlmK0tuNmpjQWtmOTZoWVkKKzY1TTMza1ZBb0dCQU5GMVdRNG4wcTE0YlpSY1FkbnFoWDdYT0pFbDBtOUZuYVhOTjNsb0M1SnNneGxkbXh5bgpRV1IvZkJVQnRaTUc5MmgzdTBheWUyaWdZdGtSc1pDV0wwL2VicmJGMWlmYXozR2Z1b3lSZWozMHVsRDJYY3phCmQzSEUwdVpTSVQrUkFSTTF1VjJUczVUSHJqUStIT3Z5cEpFQjFlSnY1L21LWmRpUTRtMzBGMDUzQW9HQkFPU1oKL21NWXd4V1Y4SFRtaENyNGsycDJQd1NLTHVrajhZaVJQZHhVSFpXWXdRTGFFRU1uSVVnUFJBSnFHc1VtWng5TApacDVjYXp3bW9ldDI0cXpGeVhkemFUMi96VGc1Rjg1d0FzRDl1WEZSWWYzc01OZ0VkazJkSmc1VGZmcWcrNlRQCjBla2VtWG9vSTYxTTc3VVFjWVdSVCtPWUtFd1V3dzZMcjJ3bGFKM1hBb0dBTzF3alVlU3RTeVllLy9XcFgrV2IKMFplUzIyZTVuSGxCTlRUVWJONjBzTmw1eWQyQ1VQdUJoOGF0VnBLMmI2V0F4aVZ3ZUplcWE3dFFhQzRnZ1ZaZQpzQ2JjZjRYUHJGblJnbVQvREVsS09IYTd1cWduYXgvYXkrNDR5cmNwM3dic0pCS01wdDF0L2xNY3BvZVgwTEppCk93b25JRllRaXVMUy9DNExUWmZvWnY4Q2dZQnIrMlhUajRYUE0zVlM4dlJwaStPdWZVNkZLWFRCUWU0OHNVYkUKUmFOMzM2RUVaTmNic1djaUw3dlRYQ1ZyRFJuWENYbmV3ZzhSYWJwQWpIYkVYK1VybklPUTNJSG0xZWt0NVhFWAprb0kvU2M3ODc4MmVySFRwY3ByZ1Y0WUJsbnRudlpjTkJCeEJQS2Fsbk5yNTcxdUFXVVNnWUdaZ2tjb1ZtOXZ3ClBMZHZId0tCZ0dYS2l5Y29zZzFuZHhkclQ0S05SSmdWZUd1M3ZqSjg4N0tQbThpbHB4alF3ekM2cjNRZDhYUWIKbGdWUnFBcG5mTnA1amM0WUZ5c2RvKzFhc2JrRTloczVUZk5sVUVtSWdvR3dxVnlmUkRiOEl0TklRQTBXZDZLdQpONy81UkZYRVlkUFR4YVhpNjl0cTZnRXp6cThTcnQyUUY5eEk5eG1EV0U5bGVEeDUwd1dZCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
   kind: Secret
   metadata:
     creationTimestamp: "2022-04-09T14:34:37Z"
     name: kube-etcd-client-certs
     namespace: kubesphere-monitoring-system
     resourceVersion: "856"
     uid: c74b122b-438d-4e40-8e1a-1b9445d4b3d5
   type: Opaque
   ```

   看到这说明 secrets 暂时看着没问题，最起码资源配置存在，我们先继续往后排查，不行的话再回来。

   > **在写文档的过程中，Jam 反馈他的环境并没有这个 secrets 资源配置。可以按照上面的命令生成一个 secrets，注意检查 Etcd 密钥的实际路径。**

3. 根据上面 get 到的关键点 **2**，**用外部 Etcd 各节点的 ip 生成 endpoint **。

   先看看 **prometheus-endpointsEtcd.yaml** 文件是个啥。

   **prometheus-endpointsEtcd.yaml**

   ```yaml
   apiVersion: v1
   kind: Endpoints
   metadata:
     labels:
       k8s-app: etcd
     name: etcd
     namespace: kube-system
   subsets:
   - addresses:
     - ip: 127.0.0.1
     ports:
     - name: metrics
       port: 2379
       protocol: TCP
   ```

   再看看我们的 kubernetes 中有没有 **Endpoints** 资源。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get endpoints -n kubesphere-monitoring-system
   NAME                                      ENDPOINTS                                                                AGE
   alertmanager-main                         10.233.116.11:9093,10.233.117.10:9093,10.233.87.9:9093                   9d
   alertmanager-operated                     10.233.116.11:9094,10.233.117.10:9094,10.233.87.9:9094 + 6 more...       9d
   kube-state-metrics                        10.233.87.8:8443,10.233.87.8:9443                                        9d
   node-exporter                             192.168.9.91:9100,192.168.9.92:9100,192.168.9.93:9100                    9d
   notification-manager-controller-metrics   10.233.116.8:8443                                                        9d
   notification-manager-svc                  10.233.116.13:19093,10.233.116.14:19093                                  9d
   notification-manager-webhook              10.233.116.8:9443                                                        9d
   prometheus-k8s                            10.233.117.43:9090,10.233.87.160:9090                                    9d
   prometheus-operated                       10.233.117.43:9090,10.233.87.160:9090                                    9d
   prometheus-operator                       10.233.116.7:8443                                                        9d
   thanos-ruler-operated                     10.233.117.18:10902,10.233.87.17:10902,10.233.117.18:10901 + 1 more...   8d
   ```

   居然没有跟 **Etcd** 相关的 Endpoints，需要新建？

   正要根据配置文件重新创建的时候，突然发现了自己的错误，惯性思维，被上面的命令带偏了，用错了命令空间，配置文件实例的命令空间是 **kube-system**。

   再次在 **kube-system** 中查询，查询到了我们要的资源配置。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get endpoints -n kube-system
   NAME                          ENDPOINTS                                                              AGE
   coredns                       10.233.117.2:53,10.233.117.3:53,10.233.117.2:53 + 3 more...            9d
   etcd                          192.168.9.91:2379,192.168.9.92:2379,192.168.9.93:2379                  3d20h
   kube-controller-manager-svc   192.168.9.91:10257,192.168.9.92:10257,192.168.9.93:10257               9d
   kube-scheduler-svc            192.168.9.91:10259,192.168.9.92:10259,192.168.9.93:10259               9d
   kubelet                       192.168.9.91:10250,192.168.9.92:10250,192.168.9.93:10250 + 6 more...   9d
   openebs.io-local              <none>                                                                 9d
   ```

   看看配置文件内容。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get endpoints etcd -n kube-system -o yaml
   apiVersion: v1
   kind: Endpoints
   metadata:
     annotations:
       kubectl.kubernetes.io/last-applied-configuration: |
         {"apiVersion":"v1","kind":"Endpoints","metadata":{"annotations":{},"labels":{"k8s-app":"etcd"},"name":"etcd","namespace":"kube-system"},"subsets":[{"addresses":[{"ip":"192.168.9.91"},{"ip":"192.168.9.92"},{"ip":"192.168.9.93"}],"ports":[{"name":"metrics","port":2379,"protocol":"TCP"}]}]}
     creationTimestamp: "2022-04-15T08:24:18Z"
     labels:
       k8s-app: etcd
     name: etcd
     namespace: kube-system
     resourceVersion: "1559305"
     uid: c6d0ee2c-a228-4ea8-8ef1-73b387030950
   subsets:
   - addresses:
     - ip: 192.168.9.91
     - ip: 192.168.9.92
     - ip: 192.168.9.93
     ports:
     - name: metrics
       port: 2379
       protocol: TCP
   ```

   配置文件看着也正确，那我们继续往下查。

4. 根据上面 get 到的关键点 **3**，**生成利用上述 endpoint 的 etcd service**。

   先看看 **prometheus-serviceEtcd.yaml** 文件是个啥。

   **prometheus-serviceEtcd.yaml**

   ```yaml

   apiVersion: v1
   kind: Service
   metadata:
     labels:
       k8s-app: etcd
     name: etcd
     namespace: kube-system
   spec:
     clusterIP: None
     ports:
     - name: metrics
       port: 2379
       targetPort: 2379
     selector: null
   ```

   再看看我们的 kubernetes 中有没有 **Service** 资源。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get service -n kube-system
   NAME                          TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                        AGE
   coredns                       ClusterIP   10.233.0.3   <none>        53/UDP,53/TCP,9153/TCP         9d
   etcd                          ClusterIP   None         <none>        2379/TCP                       3d21h
   kube-controller-manager-svc   ClusterIP   None         <none>        10257/TCP                      9d
   kube-scheduler-svc            ClusterIP   None         <none>        10259/TCP                      9d
   kubelet                       ClusterIP   None         <none>        10250/TCP,10255/TCP,4194/TCP   9d
   ```

   看看资源配置详细内容。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get service etcd -n kube-system -o yaml
   apiVersion: v1
   kind: Service
   metadata:
     annotations:
       kubectl.kubernetes.io/last-applied-configuration: |
         {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"k8s-app":"etcd"},"name":"etcd","namespace":"kube-system"},"spec":{"clusterIP":"None","ports":[{"name":"metrics","port":2379,"targetPort":2379}],"selector":null}}
     creationTimestamp: "2022-04-15T08:24:18Z"
     labels:
       k8s-app: etcd
     name: etcd
     namespace: kube-system
     resourceVersion: "1559307"
     uid: cfd92ee5-dbd1-4ee4-a4c4-d683ca7a41ea
   spec:
     clusterIP: None
     clusterIPs:
     - None
     ipFamilies:
     - IPv4
     - IPv6
     ipFamilyPolicy: RequireDualStack
     ports:
     - name: metrics
       port: 2379
       protocol: TCP
       targetPort: 2379
     sessionAffinity: None
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

   配置文件看着正确，那我们继续往下查。

5. 根据上面 get 到的关键点 **4**，**生成用于抓取 Etcd 数据的 ServiceMonitor**。

   先看看 **prometheus-serviceMonitorEtcd.yaml** 文件是个啥。

   **prometheus-serviceMonitorEtcd.yaml**

   ```yaml

   apiVersion: monitoring.coreos.com/v1
   kind: ServiceMonitor
   metadata:
     labels:
       k8s-app: etcd
     name: etcd
     namespace: kubesphere-monitoring-system
   spec:
     endpoints:
     - interval: 1m
       port: metrics
       scheme: https
       tlsConfig:
         caFile: /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client-ca.crt
         certFile: /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client.crt
         keyFile: /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client.key
         serverName: etcd.kube-system.svc.cluster.local
     jobLabel: k8s-app
     namespaceSelector:
       matchNames:
       - kube-system
     selector:
       matchLabels:
         k8s-app: etcd
   ```

   再看看我们的 Kubernetes 中有没有 **ServiceMonitor** 资源。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get servicemonitor -n kubesphere-monitoring-system
   NAME                      AGE
   alertmanager              9d
   coredns                   9d
   devops-jenkins            8d
   etcd                      3d21h
   kube-apiserver            9d
   kube-controller-manager   9d
   kube-scheduler            9d
   kube-state-metrics        9d
   kubelet                   9d
   node-exporter             9d
   prometheus                9d
   prometheus-operator       9d
   s2i-operator              8d
   ```

   看看资源配置详细内容。

   ```shell
   [root@ks-k8s-master-0 ~]# kubectl get servicemonitor etcd -n kubesphere-monitoring-system -o yaml
   apiVersion: monitoring.coreos.com/v1
   kind: ServiceMonitor
   metadata:
     annotations:
       kubectl.kubernetes.io/last-applied-configuration: |
         {"apiVersion":"monitoring.coreos.com/v1","kind":"ServiceMonitor","metadata":{"annotations":{},"labels":{"app.kubernetes.io/vendor":"kubesphere","k8s-app":"etcd"},"name":"etcd","namespace":"kubesphere-monitoring-system"},"spec":{"endpoints":[{"interval":"1m","port":"metrics","scheme":"https","tlsConfig":{"caFile":"/etc/prometheus/secrets/kube-etcd-client-certs/etcd-client-ca.crt","certFile":"/etc/prometheus/secrets/kube-etcd-client-certs/etcd-client.crt","keyFile":"/etc/prometheus/secrets/kube-etcd-client-certs/etcd-client.key"}}],"jobLabel":"k8s-app","namespaceSelector":{"matchNames":["kube-system"]},"selector":{"matchLabels":{"k8s-app":"etcd"}}}}
     creationTimestamp: "2022-04-15T08:24:18Z"
     generation: 1
     labels:
       app.kubernetes.io/vendor: kubesphere
       k8s-app: etcd
     name: etcd
     namespace: kubesphere-monitoring-system
     resourceVersion: "1559308"
     uid: 386f16c0-74cd-4dbf-aa35-cc227062c881
   spec:
     endpoints:
     - interval: 1m
       port: metrics
       scheme: https
       tlsConfig:
         caFile: /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client-ca.crt
         certFile: /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client.crt
         keyFile: /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client.key
     jobLabel: k8s-app
     namespaceSelector:
       matchNames:
       - kube-system
     selector:
       matchLabels:
         k8s-app: etcd
   ```

   配置文件看着也正确，那我们继续往下查。

6. 查到现在我发现自己能查的都查了，该有的配置都有，那为啥还有问题呢，参考文档中也没有更详细的说明了。

7. 这时我发现我忘记了一点，还有没看过 Pod 的日志，赶紧去看看。

   在**集群管理**->**应用负载**->**工作负载**->**有状态副本集**, 选择 **kubesphere-monitoring-system** 项目，找到 **prometheus-k8s**。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-2.png)

   点击 **prometheus-k8s**，进入详细页面，点击容器组中的 **prometheus-k8s-0** 容器。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-3.png)

   点击按钮**容器日志**，弹出容器日志页面。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-4.png)

   这时会发现有大量的报错日志。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-5.png)

   详细报错日志。

   ```yaml
   level=error ts=2022-04-19T06:49:08.169Z caller=manager.go:188 component="scrape manager" msg="error creating nescrape pool" err="error creating HTTP client: unable to load specified CA cert /etc/prometheus/secrets/kube-etcclient-certs/etcd-client-ca.crt: open /etc/prometheus/secrets/kube-etcd-client-certs/etcd-client-ca.crt: no sucfile or directory" scrape_pool=kubesphere-monitoring-system/etcd/0
   ```

   看到这我们发现了问题的原因，找不到文件 **/etc/prometheus/secrets/kube-etcd-client-certs/etcd-client-ca.crt**。

   打开 Pod 的**终端**，进入系统里验证。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-6.png)

   结果显示，整个文件夹都不存在。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/image-20220419145321885.png)

   再去看一眼 Pod 的配置，是否有 secrets 的配置。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-11.png)

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-12.png)

   看到这，**实锤了**，我认为我发现了问题的根本，也想到了问题的解决办法，那就是 Pod 中没有挂载 **kube-etcd-client-certs** 这个 secrets，那我们想办法挂载上，问题就能解决了？？？

   在控制台中，找到我们的有状态副本集 **prometheus-k8s**，点击**更多操作**->**编辑设置**。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-7.png)

   在**存储卷**中，**挂载配置字典或保密字典**。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-8.png)

   选择**保密字典**，只读挂载 **kube-etcd-client-certs** 到 **/etc/prometheus/secrets/kube-etcd-client-certs**，最终确定。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-9.png)

   点击确定后，你会发现 Pod 开始重建，我以为这就可以了等着看效果就完了，结果。。。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-10.png)

   待 Pod 重建成功后，我以为一切都被我掌控了，肯定没有问题了。结果我发现，改过的配置又变回了原来的样子，Pod 中根本没有挂载我们想要的 secrets，配置跟原来一样。

   反复操作三次后，我崩溃了，幡然醒悟，我改的方法不对，这个是由 **prometheus-operator**，单独修改不会配置不会生效的。

8. **prometheus-operator**，这玩意我以前没玩过，不了解技术细节，咋办。。。继续百度。

9. 百度。

   关键字 **prometheus operator etcd**。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/image-20220419151317571.png)

   第一名看了一眼，没啥帮助，不展示了，各位有兴趣的可以自己看
   2 分钟后打开了排名第二的文章，文章思路过程比较清晰，迅速下翻，看到第**三**点找到了我要的方法。

   ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/image-20220419151544778.png)

10. 细节我也不知道，但是我们的目的是为了挂载 secrets，既然这里提到了，那我们就去试试。

    ```shell
    [root@ks-k8s-master-0 ~]# kubectl edit prometheuses -n kubesphere-monitoring-system
    ```

    ```yaml
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: monitoring.coreos.com/v1
    kind: Prometheus
    metadata:
      annotations:
        kubectl.kubernetes.io/last-applied-configuration: |
    ....
    ```

    文件内容类似上面的，我们搜索 secret，出现报错 **E486: Pattern not found: secret**。

    说明默认配置里没有 secret 的配置，我们自己添加 , 在文件 78 行左右加入。

    ```yaml
    secrets:
    - kube-etcd-client-certs
    ```

    最终效果类似 (为了看的清楚，我加了行号)：

    ```yaml
    71   securityContext:
    72     fsGroup: 0
    73     runAsNonRoot: false
    74     runAsUser: 0
    75   serviceAccountName: prometheus-k8s
    76   serviceMonitorNamespaceSelector: {}
    77   serviceMonitorSelector: {}
    78   secrets:
    79   - kube-etcd-client-certs
    80   storage:
    81     volumeClaimTemplate:
    82       spec:
    83         resources:
    84           requests:
    85             storage: 20Gi
    86   tolerations:
    87   - effect: NoSchedule
    88     key: dedicated
    89     operator: Equal
    90     value: monitoring
    91   version: v2.26.0
    ```

    保存退出。

    我们再去查看有状态副本集的配置，会发现多了一个保密字典的配置。

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/image-20220419153245471.png)

    再去看 Pod 的具体配置，会发现 Pod 的配置也多了保密字典的配置

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-13.png)

    再看看 Pod 的日子，发现也没有 **error** 了

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-14.png)

    感觉问题都解决了，那我们去看看监控是否有图形了（**还有点小期待呢**）。

11. 揭晓最终答案的时刻。

    先来一张全景图。

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-15.png)

    再来几张局部高清图（后补的，刚开始没抓）。

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-16.png)

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-17.png)

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-18.png)

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-19.png)

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-20.png)

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-21.png)

    ![](https://znotes-1258881081.cos.ap-beijing.myqcloud.com/k8s-on-kubesphere/etcd-monitoring-22.png)

12. 至此，问题初步解决，不过还有很多细节需要我们在后面深入学习了解更深的底层知识。

## 4. Prometheus-Operator 监控 Etcd 的技术关键点

### 技术关键点

1. Etcd 的安装方式

   KubeSphere 安装的 Etcd 为二进制方式，验证方法如下。

   ```shell
   ## 看进程确认是二进制方式
   [root@ks-k8s-master-0 ~]# ps -ef | grep etcd
   root      1158 56409  0 15:43 pts/0    00:00:00 grep --color=auto etcd
   root     15301     1  6 Apr09 ?        15:35:08 /usr/local/bin/etcd
   root     17247 17219 13 Apr09 ?        1-06:55:24 kube-apiserver --advertise-address=192.168.9.91 --allow-privileged=true --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --authorization-mode=Node,RBAC --bind-address=0.0.0.0 --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/ssl/etcd/ssl/ca.pem --etcd-certfile=/etc/ssl/etcd/ssl/node-ks-k8s-master-0.pem --etcd-keyfile=/etc/ssl/etcd/ssl/node-ks-k8s-master-0-key.pem --etcd-servers=https://192.168.9.91:2379,https://192.168.9.92:2379,https://192.168.9.93:2379 --feature-gates=CSIStorageCapacity=true,RotateKubeletServerCertificate=true,TTLAfterFinished=true,ExpandCSIVolumes=true --insecure-port=0 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.233.0.0/18 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key

   ## 看 ssl 密钥文件有哪些
   [root@ks-k8s-master-0 ~]# ll /etc/ssl/etcd/ssl/
   total 80
   -rw------- 1 root root 1675 Apr  9 22:32 admin-ks-k8s-master-0-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 admin-ks-k8s-master-0.pem
   -rw------- 1 root root 1679 Apr  9 22:32 admin-ks-k8s-master-1-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 admin-ks-k8s-master-1.pem
   -rw------- 1 root root 1679 Apr  9 22:32 admin-ks-k8s-master-2-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 admin-ks-k8s-master-2.pem
   -rw------- 1 root root 1675 Apr  9 22:32 ca-key.pem
   -rw-r--r-- 1 root root 1086 Apr  9 22:32 ca.pem
   -rw------- 1 root root 1679 Apr  9 22:32 member-ks-k8s-master-0-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 member-ks-k8s-master-0.pem
   -rw------- 1 root root 1675 Apr  9 22:32 member-ks-k8s-master-1-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 member-ks-k8s-master-1.pem
   -rw------- 1 root root 1675 Apr  9 22:32 member-ks-k8s-master-2-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 member-ks-k8s-master-2.pem
   -rw------- 1 root root 1675 Apr  9 22:32 node-ks-k8s-master-0-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 node-ks-k8s-master-0.pem
   -rw------- 1 root root 1679 Apr  9 22:32 node-ks-k8s-master-1-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 node-ks-k8s-master-1.pem
   -rw------- 1 root root 1679 Apr  9 22:32 node-ks-k8s-master-2-key.pem
   -rw-r--r-- 1 root root 1440 Apr  9 22:32 node-ks-k8s-master-2.pem
   ```

2. Prometheus-Operator 监控 Etcd 的配置

- 用外部 Etcd 的证书生成 secret
- 用外部 Etcd 各节点的 ip 生成 endpoint
- 生成利用 Endpoint 的 etcd service
- 生成用于抓取 Etcd 数据的 ServiceMonitor

### 需要深入学习的地方（占位，待补充）

1. Prometheus-Operator 的实现原理和技术细节。
2. KubeSphere 对于 Prometheus-Operator 的配置过程。

## 5. 总结

本文根据运维实际需求，介绍了开启 Etcd 监控的正确姿势，同时也详细介绍了解决该问题的排障流程。有需要开启 KubeSphere 3.2.1 版本的 Etcd 监控功能的小伙伴，可以参考本文进行配置。

### **参考文档**

- [etcd 使用自签名证书，prometheus 报错未知机构签发 #2.11](https://ask.kubesphere.io/forum/d/1322-etcd-prometheus-2-11 "etcd 使用自签名证书，prometheus 报错未知机构签发 #2.11")
- https://www.cnblogs.com/lvcisco/p/12575608.html?ivk_sa=1024320u

### **Get 文档**

- Github https://github.com/devops/z-notes
- Gitee https://gitee.com/zdevops/z-notes

### **Get 代码**

- Github https://github.com/devops/ansible-zdevops
- Gitee https://gitee.com/zdevops/ansible-zdevops

### **B 站**

- [老Z 手记](https://space.bilibili.com/1039301316 "老Z 手记")
