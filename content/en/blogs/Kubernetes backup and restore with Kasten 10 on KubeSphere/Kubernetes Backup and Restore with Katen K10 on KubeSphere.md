# Kubernetes Backup and Restore with Katen K10 on KubeSphere

## Kasten on KubeSphere

Purpose-built for Kubernetes, [**Kasten 10** ](https://docs.kasten.io/)provides enterprise operations teams an easy-to-use, scalable, and secure system for backup/restore, disaster recovery, and mobility of Kubernetes applications. 

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmn82SkdfugiaHXich4WNXhrGAib38icvgVlz7iboIR1t7nqu2wEGgp9qlicqw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
**[KubeSphere](https://kubesphere.io/docs/introduction/what-is-kubesphere/)** is a distributed operating system for cloud-native application management, using Kubernetes as its kernel. It provides a plug-and-play architecture, allowing third-party applications to be seamlessly integrated into its ecosystem.
![图片](https://kubesphere.io/images/docs/introduction/what-is-kubesphere/architecture-1.png)

In this article, we will introduce the deployment of Kasten K10 on KubeSphere.

## Provision a KubeSphere Cluster

This article will introduce how to deploy Kasten on on KubeSphere Container Platform. You can install KubeSphere on any Kubernetes cluster or Linux system, refer to [**KubeSphere documentation**](https://kubesphere.io/docs/quick-start/all-in-one-on-linux/) for more details or vist the [**Github**]( https://github.com/kubesphere/website) of KubeSphere.

After the creation of KubeSphere cluster, you can log in to KubeSphere web console:

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmdfABicRCXlj9YWuJN7OiaeodbIzz4niaChwzib5dWZeWlH6jEM2jt3opibA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Click the button  "Platform" in the upper left corner and then select "Access Control"; Create a new workspace called Kasten-Workspace.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmbXUeVRNAxFhYVicwnvtzOfbKyaPRUfEEDl41hh0yGCFcFNuiaPYIYTibg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Enter "Kasten-workspace" and select "App Repositoties"; Add an application repository named Kasten.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmO95B3EsAEmS0lIXsibicTGYUZJQlphHtkqkNceIrnJPByQTd9euOwKFA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Add the official Helm Repository of Kasten to KubeSphere. **Helm repository address**[2]：https://charts.kasten.io/

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmiamCwAqias6U61st20oibzJLrhSXKEjwjREodIPsxfP8LB0Eewqy50l4Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Once completed, the repository will find its status be "successful".

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmpa2jFHavCoXCrzV4ZokjLQMWXtEVbPo69ojGd0ahg5Mz0wicDDDNqMw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
## Deploy Kasten K10 on Kubernetes to Backup and Restore Cluster

First, create a Namespace to run Kasten.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmSl6j2NWGVAUEHLj9YwJ6iaXntB14hS1keCjfCZeOztz6T5Eg91a5oLw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
After creation, click the Namespace and select "App"-"Deploy New APP"-"From App Template"successively.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmBJEPnZhqskCUicU9eibfIxLko8nPzULL2IAWUnG1gnN8ZiaY8ibBJnHic5g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Select "Kasten" from the drop-down menu and then select "K10".

![图片](/Users/xieyicen/Desktop/Kubernetes backup and restore with Kasten 10 on KubeSphere/图片10.png)
Click "K10" and enter the detail page of Chart; Click "Configuration File" to view or download the default values.yaml; Select the version and click to deploy; Set "App Name" as "K10" and select the "App Version"; Confirm the "Deployment Location", and click "Next".

![图片](/Users/xieyicen/Desktop/Kubernetes backup and restore with Kasten 10 on KubeSphere/图片11.png)
For this step, we need to input required parameters to deploy Kasten K10 on KubeSphere. We need to adjust the parameters in line with our own needs. During the installation, adjust the parameters as follows and click "Deploy".

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmeqAXArS9CiajcH99oYgPxNceq5LOrorPq8kCSqqM2ljjw6GuptkFN2g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
  ```
global: 
    airgapped: 
      repository: "ccr.ccs.tencentyun.com/kasten-k10"
    persistence: 
      storageClass: "csi-hostpath-sc"
  auth: 
    basicAuth: 
      enabled: "true"
      htpasswd: "mars:$apr1$Cgu1sGVZ$w/8aLHZkVT73OqYZ06C0v."
  metering: 
    mode: "airgap"
  injectKanisterSidecar: 
    enabled: "true"
  prometheus: 
    server: 
      persistentVolume: 
        enabled: "false"
  ingress: 
    create: "true"
    class: "nginx"
  ```
Click "Deploy" and wait the status to turn into "running".
![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCm0KD3VeIUXR9LqChiaHiaVxY9EXiaMlXRphlk14vBnClmV79LxrKiaAic8icg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Click "Deployment" to check if Kasten has deployed workload and is in running status.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCm4DCcT0BkLvBsVVYPiaZzbQtytibDiaJz4ZtffjlFq1eF5dldUqOuCbngA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
In "Application Workloads" - "Routes" page, we can find the Gateway of Ingress configured previously.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCm0mpn3orh3I7P7nebE1B9AuN1KsXKSiczsklNWGic1pwQeibrTVmlz68uA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
## Log in the Management Page of Kasten K10

Input https://192.168.99.100/k10/#  to the browser for the following log-in interface; Input the company and e-mail address to sign up.
![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCm7NQr7PVwVdLvJficZgHDZURCet4iclt4RgqrItn1ic2pibEMchakFGjzDQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Set the locations for storing our backup data. In this case S3 compatible storage is selected.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmqhHQ2JSRssJkic1px6dvawJtkTD1ejfibe3RW6ibWM5WUXfVV5uIvau6A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Finally, start "K10 Disaster Recovery" and we can start to set "Disaster Recovery" for our cloud native application.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmy5JuDZHyljwwwpiaXXqPAFZFQ0g29oT86WIVEibzZu6ib0Hp5fAn4ibjmQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
## Deploy Cloud Native Applications on Kubernetes

Kasten Dashboard holds 16 applications, which are shown as follows. We can create a Wordpress application with a Wordpress Pod and Mysql Pod, a typical application that is partly stateful and partly stateless. Here are the steps.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmJaPIjJaPW8XyWhg6u1Npona1ibsMaCLVLAVApPZhjDJ7CqOk9t5g7KQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
### Create kustomization.yaml

Create “Secret Generator". A Secrete can store sensitive data such as passwords or keys. Since v1.14, kubectl supports kustomization to manage Kubernetes objects. We can use the generator in `kustomization.yaml` to create a Secret.

We can add a Secret Generator to `kustomization.yaml` as follows. It should be noted that we need to replace YOUR_PASSWORD with our actual passwords.
```
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```
**Download configuration file of MySQL deployment**
`curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml`
**Download configuration file of Wordpress**
`curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml`
**Add to kustomization.yaml**
```
cat <<EOF >>./kustomization.yaml
resources:
  - mysql-deployment.yaml
  - wordpress-deployment.yaml
EOF
```
Apply and verify all resources applied to deploy WordPress website within `kustomization.yaml` and MySQL  database. We can set and apply the content as follows.
```
kubectl create ns wordpress
kubectl apply -k ./  -n wordpress
```
Once completed, we can find the number of application increase to 17.
![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmWIocX6ZcCTOIKvibdRvzSeKXKM6Tb4aib70HfknpXf7LxIZtCP8WLLgA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
In addition, applications of the WordPress can also be find in "Applications".

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmu3s5qaSZAoTzOdC5hUBwXFyIpjEdP66ia9ks3p1OoiaCcGsk4rwHo4Ng/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
## Back Up Cloud Native Applications

Click "Create Policy" and create a data backup strategy. In such case, Kasten can protect applications by creating local snapshot, and back up the application data to cloud, thus to realize the long-term retention of data.
![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmmVGTH3dQgtHM3IwB2RyC6ZuHI7KlCbfsjwLPpNuMvjueXsRjlsmiaVA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Click "Run Once" to start backup.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmzh4wYWcU98YInBxSicocILus7G9PC8hLJcJ0jbkpblnBy9dqrFf9nvQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Observe Dashboard and we can find backup is completed.

## Complete the Recovery of Cloud Native Applications

Find "Applications" in Dashboard and then click "Restore".

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmacsMzgj5D5QJtelj9TJzibiacTq9TCQ34BqT9h4jC2my4TEKj0CqTmuw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Set the time for recovery.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmbUouIkOhLhuGAVmjcDPuoZcm4kE5bO5E9Fg7L3q94gUgoJ4NLSicqaw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
Create a Namespace for recovery, which is named as "Wordpress-restore" in this case.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmkOqytfVVUg0FpZUlBHm9Ue716l0OicofKsQ6LR43uyd0OV4I09uqCLg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
As every application recovered will create a new Namespace, the number of applications increases from 17 to 18. In Dashboard we can find that applications have been fully recovered.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmwpIQDlUK4nSiaVaxeK7uznIBIN44LiaR6OlpgAUAk7oBjc9051DuL9fA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
In KubeSphere Dashboard, we can find these applications recovered are running.

![图片](https://mmbiz.qpic.cn/mmbiz_png/u5Pibv7AcsEVk4LkRgDb1pZe8ppcY6iaCmHz5Q9CFFjCouqfAM9iaZm0q4H5icicf1LjW6ml0pIsUPIC77Z3aquPk0Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
## Summary

As a container platform, KubeSphere excels in cloud native application deployment. For application developers who are not familiar with Kubernetes and hope to make simple configuration to deploy Kasten, it is easy to follow the above steps and deploy Kasten with KubeSphere. KubeSphere helps to directly deploy the official Helm repository of Kasten K10, which performs well in data management, including backup, migration and disaster recovery.


### Reference

[KubeSphere Official Documentation](https://kubesphere.io/docs/)

[Helm Repository Address](https://charts.kasten.io/)

[Kasten Official Documentation](https://docs.kasten.io/)

[KubeSphere GitHub](https://github.com/kubesphere/kubesphere)

[KubeSphere Official Document](https://kubesphere.io/docs/introduction/what-is-kubesphere/)

[KubeSphere Documentation](https://kubesphere.io/docs/) 