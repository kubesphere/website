---
title: '使用 KubeSphere 实现微服务的灰度发布'
tag: 'KubeSphere'
keywords: 'KubeSphere, 微服务, 灰度发布, Istio, 服务网格, Service Mesh, Java'
description: 'KubeSphere 基于 Istio 微服务框架提供可视化的微服务治理功能，如果您在 Kubernetes 上运行和伸缩微服务，您可以为您的分布式系统配置基于 Istio 的微服务治理功能。'
createTime: '2022-10-12'
author: '何昌涛'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-microservice-grayrelease-cover.png'
---

## 前言

今天来说一说，在 KubeSphere 中两个 " 小姐姐 " 如何来回切换，这是什么意思哩？其实就是互联网产品中常用的灰度发布方式。

互联网产品需要快速迭代上线，既要保证新功能运行正常，又要保证质量，一旦出现问题可以很快控制局面，就需要设计一套灰度发布系统。用大白话讲就是某个 APP 的新版本已经开发完成了，而老版本用户正在正常使用着，这个时候要是直接上线新版本，那么所有的用户都会用新版本，但是这种情况下，一旦出现问题，将导致所有的用户都不可用，所以会有策略的挑选一部分用户先用新版本，即使出现问题，也只是一小部分用户，方便回滚到旧版本，提升用户良好的体验性。

## 概述

灰度发布（又名金丝雀发布）是指在黑与白之间，能够平滑过渡的一种发布方式。在其上可以进行 A/B testing，即让一部分用户继续用产品特性 A，一部分用户开始用产品特性 B，如果用户对 B 没有什么反对意见，那么逐步扩大范围，把所有用户都迁移到 B 上面来。灰度发布可以保证整体系统的稳定，在初始灰度的时候就可以发现、调整问题，以保证其影响度。

我们假设这个 A/B，就是 A 小姐姐和 B 小姐姐。

## KubeSphere 的微服务治理功能

KubeSphere 基于 Istio 微服务框架提供可视化的微服务治理功能，如果您在 Kubernetes 上运行和伸缩微服务，您可以为您的分布式系统配置基于 Istio 的微服务治理功能。KubeSphere 提供统一的操作界面，便于您集成并管理各类工具，包括 Istio、Envoy 和 Jaeger 等。

**流量治理**
- **金丝雀发布**提供灵活的灰度策略，将流量按照所配置的比例转发至当前不同的灰度版本
- **蓝绿部署**支持零宕机部署，让应用程序可以在独立的环境中测试新版本的功能和特性
- **流量镜像**模拟生产环境，将实时流量的副本发送给被镜像的服务
- **熔断机制**支持为服务设置对单个主机的调用限制

**在 KubeSphere 中应用治理可以以可插拔式方式开启。开启后如下：**

![](https://pek3b.qingstor.com/kubesphere-community/images/abdf6330-d75d-4fc2-9039-179af7030b9e.png)

## 准备工作

**创建一个 SpringBoot 的项目用于测试，如下 pom.xml 文件：**

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.pkulaw</groupId>
  <artifactId>ServiceA</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>ServiceA</name>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>1.8</java.version>
    <docker.image.prefix>springboot</docker.image.prefix>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>

    <!-- 引入Actuator监控依赖 -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
    </dependency>

    <dependency>
      <groupId>cn.hutool</groupId>
      <artifactId>hutool-all</artifactId>
      <version>5.8.0</version>
    </dependency>
  </dependencies>

  <build>
    <finalName>ServiceA</finalName>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>

```
**controller 代码：**

```java
@RestController
@Slf4j
public class CommonController {

    /**
     * 返回A/B小姐姐图片
     * @param response
     * @throws IOException
     */
    @RequestMapping(method = RequestMethod.GET, produces = "image/jpeg")
    public void getImage2(HttpServletResponse response) throws IOException {
        ClassPathResource classPathResource = new ClassPathResource("images/B.jpg");
        InputStream  inputStream = classPathResource.getInputStream();
        //将InputStream 转 File
        File file = asFile(inputStream);
        FileCopyUtils.copy(new FileInputStream(file), response.getOutputStream());
        response.setHeader("Content-Type", "application/octet-stream");
    }

    /**
     * InputStream To File
     * @param in
     * @return
     * @throws IOException
     */
    public static File asFile(InputStream in) throws IOException {
        File tempFile = File.createTempFile("test", ".tmp");
        tempFile.deleteOnExit();
        FileOutputStream out = new FileOutputStream(tempFile);
        IOUtils.copy(in, out);
        return tempFile;
    }
}
```

> 注：直接通过接口返回一张图片。

**项目目录结构如下：**

![](https://pek3b.qingstor.com/kubesphere-community/images/ef463e94-ba8e-49f9-bc78-79d1dce473be.png)

## 镜像构建

在 KubeSphere 中有个超炫的功能叫镜像构建器，镜像构建器（Image Builder）是将代码或者制品制作成容器镜像的工具。您可以通过简单的设置将制品或代码直接制作成容器镜像，无需 Dockerfile 文件。

![](https://pek3b.qingstor.com/kubesphere-community/images/d10e594e-b990-4869-aedd-86f767ea45a1.png)

> 上面图片来自 KubeSphere 镜像构建官方介绍。

**3.3.0 版本中就长下面这个样子：**

![](https://pek3b.qingstor.com/kubesphere-community/images/4172d743-4200-4923-8ef2-7232bab5f558.png)

**harbor 中新建项目**

![](https://pek3b.qingstor.com/kubesphere-community/images/952aea6f-5ad5-486a-aa01-f8398526a9fc.png)

**创建镜像构建器**

![](https://pek3b.qingstor.com/kubesphere-community/images/566be1bc-daf6-4370-a891-a60fd67452b6.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/6fb4eb86-1896-4d2e-9db8-335cd09ce4d8.png)

> gitlab 仓库秘钥和 harbor 镜像服务提前设置好。镜像名称为 service-a/service-a，镜像标签设置为 v1。

**创建成功后，开始运行**

![](https://pek3b.qingstor.com/kubesphere-community/images/bffbb9da-a857-4844-905a-87fd68aa105d.png)

> 构建成功如上所示。

**harbor 中查看 v1 标签的镜像**

![](https://pek3b.qingstor.com/kubesphere-community/images/b0b9b36b-9c67-4094-aa51-82276e51e4d4.png)

> 以上就是 v1 版本由来的整个过程，我们简称为 A 小姐姐。

接下来制作 B 小姐姐，新建一个代码分支为 release, 调整代码返回为 B 小姐姐。

![](https://pek3b.qingstor.com/kubesphere-community/images/6ca2439f-2525-4fca-9f49-b5b5567d07ad.png)

构建 v2 版本的镜像，也就是我们的 B 小姐姐。

![](https://pek3b.qingstor.com/kubesphere-community/images/ca73660a-1714-43cd-b87e-624267f6c77c.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ccaaec88-6292-42f5-9b4b-e0d36fafbb25.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/37019016-c003-490d-899d-28640c357b24.png)

## 项目网关

KubeSphere 项目中的网关是一个 NGINX Ingress 控制器。KubeSphere 内置的用于 HTTP 负载均衡的机制称为应用路由 (Ingress 路由规则)，它定义了从外部到集群服务的连接规则。如需允许从外部访问服务，用户可创建路由资源来定义 URI 路径、后端服务名称等信息。

KubeSphere 除了提供项目范围的网关外，还提供集群范围的网关，使得所有项目都能共享全局网关。

在 KubeSphere 中开启项目网关以从外部访问服务和路由。

![](https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-network-microservice-123.png)

## 自制应用

在 KubeSphere 中实现金丝雀发布，必须先开启应用治理，且必须有一个可用的应用。

![](https://pek3b.qingstor.com/kubesphere-community/images/5292a48b-4f10-4d45-82e4-4fd3f4beaf53.png)

> KubeSphere 支持基于模板的应用和自制应用。基于模板的应用创建自 KubeSphere 应用商店或应用模板，自制应用由用户自定义。这里我们以自制应用为例。

**创建自制应用**

![](https://pek3b.qingstor.com/kubesphere-community/images/d366eadb-c6cf-4c88-9656-824981222531.png)

**创建服务**

![](https://pek3b.qingstor.com/kubesphere-community/images/3472221e-4636-480b-b37e-1b043ae47bad.png)

**选择无状态服务**

![](https://pek3b.qingstor.com/kubesphere-community/images/e0110cee-d3dc-40e1-901f-9aac8e3f4546.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/c319cfc4-68a4-43a8-b42e-ddf5cbe83c25.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/db41f7ba-b338-4100-b4b6-3f2640105d94.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/6ab79a65-204d-4454-b0d9-6c4be59b517a.png)

> 容器端口为 ServiceA 服务的端口 7777

![](https://pek3b.qingstor.com/kubesphere-community/images/b6bb6b2b-d2a5-4726-a13e-c3faa8a825d0.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/c897876f-d8e9-4911-adf5-97b8beb57626.png)

> 在这里添加路由规则后，KubeSphere 会自动帮我们创建 ingress 路由规则。

**创建成功后如下：**

![](https://pek3b.qingstor.com/kubesphere-community/images/26d45356-ea03-4790-9332-95133b201cb7.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/f3b5c98e-89b6-4047-9fda-f8cec6a49323.png)

**应用路由下会自动生成 ingress 路由规则，如下：**

![](https://pek3b.qingstor.com/kubesphere-community/images/833625e5-924b-42dc-9a03-7ae3b021f19b.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/5a7185c5-d694-4ad1-aded-7efc98362a3a.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/3877c952-7196-47a8-aaac-11357aab6e1c.png)

> 配置本地 hosts, 如：192.168.0.156 servicea.com
> **点击访问服务，立即返回 A 小姐姐，如下：**

![](https://pek3b.qingstor.com/kubesphere-community/images/microservice-a-a.png)

## 金丝雀发布

**创建金丝雀发布任务**

![](https://pek3b.qingstor.com/kubesphere-community/images/ba89e4a1-3a4f-4fc1-a769-6a712e6a853e.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/0a4fd672-b8fe-47ce-bb1a-cfddb2d9bf6c.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/171d4684-3464-456f-b409-623c22f41a98.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/e7c5b47e-a8fa-4ab8-8450-2748796b0d16.png)

> 可以指定流量进行分配，也可以指定请求参数

![](https://pek3b.qingstor.com/kubesphere-community/images/164c32cf-4f86-44f3-9aea-8923acebff8c.png)

创建成功，查看任务状态

![](https://pek3b.qingstor.com/kubesphere-community/images/47bb0cae-249f-40cc-a0da-a0e3db575dd3.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/60a5c50e-d8ce-4c82-9f4b-636b8d85eb77.png)

> 默认 v1 和 v2 各占 50% 流量。

**请求服务来查看流量走向，v1 和 v2 各占 50% 流量**

![](https://pek3b.qingstor.com/kubesphere-community/images/microservice-a-a.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/microservice-b-b.png)

![](https://pek3b.qingstor.com/kubesphere-community/images/ccfad950-50c8-47ca-b358-4d615e5065be.png)

> 拖动滑块设置发送给 v1 版本的流量比例和发送给 v2 版本的流量比例。

## 总结

利用 KubeSphere 我们可以很轻松的实现金丝雀发布，缓慢地向一小部分用户推送变更，从而将版本升级的风险降到最低。
