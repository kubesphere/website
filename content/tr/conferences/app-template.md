---
title: 'Uygulama Şablonu kullanarak Kubernetes üzerinde Grafana Uygulamasının Kurulumu'

author: 'xxx'
---

## Amaç

Bu eğitim, uygulama havuzunun, uygulama şablonlarının ve uygulama yönetiminin temel işlevlerini göstererek KubeSphere'de bir [Grafana] (https://grafana.com/) uygulamasının Uygulama Şablonu ile nasıl hızlı bir şekilde dağıtılacağını ve gösterir.

## Gereklilikler

Bu eğitimdeki tüm adımları tamamlanız gerekir. [Tutorial 1](admin-quick-start.md).

## Uygulama

### Adım 1: Uygulama Havuzu eklemek

> Note: uygulama havuzu aynı zamanda bir Nesne Depolaması da olabilir. ör: [QingStor Object Storage](https://www.qingcloud.com/products/qingstor/), [AWS S3](https://aws.amazon.com/cn/what-is-cloud-object-storage/), or [GitHub Repository](https://github.com/). Paketler, uygulamaların Helm Tablosu şablon dosyalarından oluşur. Bu nedenle, KubeSphere'e bir uygulama havuzu eklemeden önce, bir nesne deposu oluşturmanız ve Helm paketlerini önceden yüklemeniz gerekir. Bu eğitimde QingStor Nesne Depolamasına dayalı bir demo deposu hazırlanmaktadır.

1.1. `Admin` hesabıyla oturum açın ve ** Platform → Platform Ayarları → Uygulama Depoları ** seçeneğine gidin, ardından ** Uygulama Havuzu Ekle ** seçeneğine tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717133759.png)

1.2. Temel bilgileri doldurun ve demo-repo olarak adlandırın. URL'yi  URL'yi`https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/` şeklinde girin. Eğer URL müsaitse doğrulama yapabilirsiniz. İşlemi tamamladığınızda **OK** seçeneği ile devam edin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717134319.png)

1.3. Bu sayfanın üst kısmındaki ** Uygulama Şablonları ** seçeneğini tıklayarak tüm uygulamaları demo havuzundan otomatik olarak içe aktarın. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717134714.png)

### Adım 2: Grafana Uygulamasının Dağıtımı

2.1. Uygulama Havuzunu eklediğinizde, oturumu kapatıp ``proje-üye`` hesabıyla oturum açabilirsiniz. Ardından bu sayfanın üst kısmındaki ** Uygulama Şablonları ** 'nı seçin, uygulamayı bulmak için arama kutusuna "grafana" yazın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717145209.png)

2.2. Grafana'yı tıklayın, ** Uygulamayı Dağıt ** seçeneğine tıklayın ve temel bilgileri doldurun.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717145338.png)

2.3. ** Ad ** bölümünü kendiniz özelleştirilebilir, ortam olarak ilgili Çalışma Alanını (örneğin, `` demo-çalışma alanı '') ve Proje'yi (örneğin `` demo-proje '') seçin. Ardından Grafana'yı KubeSphere'e dağıtmak için ** Dağıt ** seçeneğini belirleyin. 


2.4. Demo projesine dönün ve ** Uygulamalar ** 'ı seçin, ardından uygulama listesinde `grafana` uygulaması `aktif` olarak gösterilecektir.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717145741.png)

### Adım 3: Uygulama Detaylarını İnceleyin

3.1.`Grafana` uygulamasına tıkladığınızda, Hizmetlerini ve İş Yüklerini  `Kaynak Durumu` sayfasında, Çevresel Değişkenler ve Uygulama Şablonu bilgilerinde görebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150124.png)

3.2. Daha sonra bu hizmeti NodePort aracılığıyla küme dışında göstereceğiz. Servisi girin örn. `grafana-l47bmc`, ardından ** Diğer → İnternet Erişimini Düzenle ** seçeneğine tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150338.png)

3.3. Açılır pencereden `NodePort` öğesini seçin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150427.png)

3.4. Bu nedenle bir Node Bağlantı Noktası üretecektir, örneğin, bu hizmete `<$NodeIP>:<$NodePort>` kullanarak erişebileceğimiz bir `31126` portu.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717150540.png)

### Adım 4: Grafana Servisine Erişim

Bu noktada `${Node IP}:${NODEPORT}` üzerinden Nginx servisine erişebilirsiniz. Ör: Grafana yönetim paneline erişmek için `http://192.168.0.88:31126`, ya da **Gitmek için Tıklayın** butonuna tıklayabilirsiniz.

4.1. İşlem öncesinde grafana'nın secret'ından hesap adı ve şifreyi öğrenmeniz gerektiğini unutmayın. **Yapılandırma Merkezi → Secrets** seçeneğine gidin, **grafana-l47bmc (Type: Default)** seçeneğine tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152250.png)

4.2. Secret detaylarını görüntülemek için düğmeyi tıklayın, ardından **admin-user** ve **admin-password** değerlerini kopyalayıp yapıştırın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152352.png)

4.3. Grafana giriş sayfasını açın, ** admin ** hesabıyla oturum açın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152831.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152929.png)

## Sonraki Adım

Eğitim 7 - [Dağıtım için Horizontal Pod Autoscaler Oluşuturulması](hpa.md).
