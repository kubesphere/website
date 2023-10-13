---
title: "使用流水线步骤模板"
keywords: 'KubeSphere, Kubernetes, Jenkins, 图形化流水线, 流水线步骤模板'
description: '了解如何在 KubeSphere 上使用流水线步骤模板。'
linkTitle: "使用流水线步骤模板"
weight: 11214
---


在最新版的 KubeSphere 3.4.0 版本中，DevOps 项目支持在流水线模板中使用步骤模板来优化使用流水线

## 准备工作
- [启用 KubeSphere DevOps 系统](../../../../pluggable-components/devops/)
- 创建企业用户，请参见[创建企业空间、项目、用户和角色](../../../../quick-start/create-workspace-and-project/)。

### 开启 DevOps 方式

1.以 admin 用户登录控制台，点击左上角的平台管理，选择集群管理。

2.点击定制资源定义，在搜索栏中输入 clusterconfiguration，点击搜索结果查看其详细页面。

3.在自定义资源中，点击 ks-installer 右侧的操作符号，选择编辑 YAML，将 devops 下的 enabled 配置更改为true。

```
devops:
  enabled: true # 将“false”更改为“true”

```
4.使用 kubectl 命令检查安装过程
```
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f

```
5.使用 kubectl 命令验证是否安装完成
```
kubectl get pod -n kubesphere-devops-system
```
对应的 pod 为 Running 状态即表示成功
```
devops-apiserver-7576cfc79c-j9kdz    1/1     Running     0          23h
devops-controller-7bcbbfc546-lszkt   1/1     Running     0          23h
devops-jenkins-79b59bdd5-tjrj8       1/1     Running     0          23h
s2ioperator-0                        1/1     Running     0          23h
```

## 配置使用自定义步骤模板
### 创建自定义的步骤模板
目前自定义的步骤模板只能通过控制台去操作
1.通过 kubectl 命令查看现有的步骤模板
```
kubectl get clustersteptemplates
```
```
NAME                 AGE
archiveartifacts     6d7h
build                6d7h
cd                   6d7h
checkout             6d7h
container            6d7h
echo                 6d7h
error                6d7h
git                  6d7h
input                6d7h
junit                6d7h
mail                 6d7h
retry                6d7h
script               6d7h
shell                6d7h
sleep                6d7h
timeout              6d7h
waitforqualitygate   6d7h
withcredentials      6d7h
withsonarqubeenv     6d7h
```

2.创建自定义步骤模板，先创建一个 yaml 文件，简单实现写文件
```
apiVersion: devops.kubesphere.io/v1alpha3
kind: ClusterStepTemplate
metadata:
  annotations:
    devops.kubesphere.io/descriptionEN: Write message to file in the build
    devops.kubesphere.io/descriptionZH: 在构建过程中写入文件
    devops.kubesphere.io/displayNameEN: writeFile
    devops.kubesphere.io/displayNameZH: 写文件
    meta.helm.sh/release-name: devops
    meta.helm.sh/release-namespace: kubesphere-devops-system
    step.devops.kubesphere.io/icon: loudspeaker
  generation: 1
  labels:
    app.kubernetes.io/managed-by: Helm
    step.devops.kubesphere.io/category: General
  name: writefile
spec:
  parameters:
  - display: file
    name: file
    required: true
    type: string
  - display: text
    name: text
    required: true
    type: string  
  runtime: dsl
  template: |
    {
      "arguments": [
        {
          "key": "file",
          "value": {
            "isLiteral": true,
            "value": "{{.param.file}}"
          }
        },
        {
          "key": "text",
          "value": {
            "isLiteral": true,
            "value": "{{.param.text}}"
          }
        }
      ],
      "name": "writeFile"
    }
```
备注:

a.步骤模板是通过 crd 实现的，详细可参考 [步骤模板的crd](https://github.com/kubesphere-sigs/ks-devops-helm-chart/blob/master/charts/ks-devops/crds/devops.kubesphere.io_clustersteptemplates.yaml)

b.yaml 文件中的 metadata.name 字段和 spec.template.name 字段需要保持一致，同时 name 字段依赖 jenkins 中的函数来实现对应功能,如上的 yaml 文件中使用了 writeFile 函数来实现输出功能，详细可参考[ pipeline steps](https://www.jenkins.io/doc/pipeline/steps/)

3.使用 kubectl 命令创建自定义的步骤
```
kubectl apply -f test-writefile.yaml
```
4.再次查看自定义步骤模板 writefile 已创建
```
kubectl get clustersteptemplates
NAME                 AGE
archiveartifacts     37d
build                37d
cd                   37d
checkout             37d
container            37d
echo                 37d
error                37d
git                  37d
input                37d
junit                37d
mail                 37d
pwd                  28d
retry                37d
script               37d
shell                37d
sleep                37d
timeout              37d
waitforqualitygate   37d
withcredentials      37d
withsonarqubeenv     37d
writefile            28s
```


### 使用自定义步骤模板
1.选择进入 DevOps 项目后，建立新的 pipeline 流水线
 ![](/images/docs/v3.x/zh-cn/devops-user-guide/use-devops/use-step-templates/create-pipeline-1.png)
 
2.进入编辑流水线中，可以按需选择固定模板（比如  Node.js/Maven/Golang 等），也可以选择创建自定义流水线
![](/images/docs/v3.x/zh-cn/devops-user-guide/use-devops/use-step-templates/create-pipeline-2.png)

3.这里选择固定模板 Golang 创建流水线，进入流水线后，可以按需增加一个阶段。我们选择在流水线最后创建一个通知的阶段
![](/images/docs/v3.x/zh-cn/devops-user-guide/use-devops/use-step-templates/create-step-1.png)

4.在通知的阶段这里，继续添加执行步骤，这里有很多的步骤模板，我们选择
写文件 的这个自定义步骤
![](/images/docs/v3.x/zh-cn/devops-user-guide/use-devops/use-step-templates/use-step-1.png)


至此，我们完成了一个自定义步骤模板的配置