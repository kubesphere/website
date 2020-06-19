---
title: 'Kubernetes Üzerinde CI/CD İş Planı Oluşturmak için Spring Boot Uygulaması'nın Dağıtımı'

author: 'xxx'
---

## Amaç

Bu eğitim, DevOps projesi içinde Kubernetes üzerinde bir Spring Boot uygulama örneği dağıtmak üzere tasarlanan bir CI / CD İş Planının'ın nasıl oluşturulacağını gösterir.

## Genel Bakış

Örneğin GitHub deposundaki mevcut Jenkinsfile'a dayanarak, aşamaları ve adımları (örn. Birim testi, sonarqube analizi) oluşturmak ve tamamlamak için aşağıda gösterildiği gibi tamamen sekiz aşamadan oluşan bir iş planı oluşturabiliriz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719005547.png)

## Gereklilikler

[Tutorial 1](admin-quick-start.md) eğitimindeki tüm adımların tamamlanması gereklidir.

## Uygulama

### Adım 1: Kimlik Bilgilerinin Oluşturulması 

Başlamak için 3 farklı kimlik oluşturmanız gerekiyor. Ör: DockerHub 、GitHub, kubeconfig.

1.1. `Proje-üye` hesabı ile oturum açın ve “demo-devops”a girin, ** Kimlik Bilgileri ** 'ne gidin, ardından ** Kimlik Bilgileri Oluştur **' a tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719010621.png)

| Kimlik ID   | Tip                | Kullanıcı Adı/Şifre/Secret                                             | İçerik |
| --------------- | ------------------- | -------------------------------------------------------------------- | ------- |
| dockerhub-id    | Hesap Bilgileri | Kişisel DockerHub hesap bilgilerinizi girin.                    | \|      |
| github-id       | Hesap Bilgileri | Kişisel GitHub hesap bilgilerinizi girin.                       | \|      |
| kube-config     |
| demo-kubeconfig | kubeconfig          | \|Kümeye ait kubeconfig ile otomatik olarak doldurulacaktır. |
| sonar-token     | secret_text         | SonarQube token'ı oluşturarak bir secret elde edebilirsiniz.                        | \       |
