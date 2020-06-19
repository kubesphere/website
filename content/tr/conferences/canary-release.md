---
title: 'Istio ile Kubernetes'te Mikroservis Uygulamasının Canary Sürümünü Yönetme'

author: 'xxx'
---
Istio’nun hizmet ağı, dağıtımın ölçeklendirilmesinden tamamen bağımsız olarak trafik dağıtımını yönetebilmesi sayesinde Canary Sürümünün hazırlanması ve canlıya alınmasını gerçekleştirmek için daha basit ve işlevsel bir yol sağlar. Kullanıcıların servislerin yeni versiyonunu, ilk önce küçük bir kullanıcı trafiği üzerinden test ederek sunmalarını sağlar. Ardından her şey yolunda giderse, eski sürümü aşamalı olarak kaldırırken yeni sürümü daha çok kullanıcı için aktif eder. KubeSphere, Istio'ya dayalı olarak Blue-Green dağıtım, Canary sürümü ve trafik aynalama gibi üç farklı grayscale stratejisi sunar. KubeSphere, kaynak kodunu değiştirmeden greyscale, trafik yönetimi, izleme, trafik izleme ve diğer hizmet ağı özelliklerini gerçekleştirebilir.

## Bookinfo Uygulaması nedir?

Bookinfo uygulaması dört ayrı mikro hizmete bölünmüştür (İnceleme mikro hizmetinin 3 sürümü vardır):

- ürün sayfası. Ürün sayfası mikro hizmeti, ayrıntıları doldurur ve sayfayı doldurmak için mikro hizmetleri inceler.
- ayrıntılar. Ayrıntılar mikro hizmeti, kitap bilgilerini içerir.
- yorumlar. Yorumlar mikro servisi, kitap değerlendirmeleri içerir. Ayrıca derecelendirme mikro hizmetini uygular.
- derecelendirme. Derecelendirme mikro servisi, kitap incelemesine eşlik eden kitap sıralaması bilgilerini içerir.

Uygulamanın uçtan uca mimarisi aşağıda gösterilmiştir. Daha fazla detay için inceleyin: [Bookinfo Application](https://istio.io/docs/examples/bookinfo/)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718152533.png)

## Amaç

Bu eğitimde, KubeSphere'de Istio kullanarak Canary sürümü, izleme ve trafik izlemeyi göstermek için kullanılan dört ayrı mikro hizmetten oluşan bir Bookinfo örnek uygulaması dağıtacağız.

## Gereklilikler

- [Eğitim 1] (admin-quick-start.md) içindeki tüm adımları tamamlayın.
- İzleme özelliğini etkinleştirmek için ** Uygulama Yönetişimi ** 'ni açmanız gerekir. (** Proje Ayarları → İnternet Erişimi → Ağ Geçidini Düzenle → Aç ** 'ı seçin)

## Uygulama

### Adım 1: Bookinfo Uygulamasının Dağıtımı

1.1. `Proje-üye` hesabı ile oturum açın ve“ demo-projeye ”girin, ** Uygulama ** 'ya gidin, ** Yeni Uygulama Dağıt **' a tıklayın ve ardından ** Örnek uygulama dağıtın Bookinfo ** 'yu seçin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718154143.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718154251.png)

1.2. Açılır pencerede ** Oluştur ** 'u tıklayın, böylece Bookinfo uygulaması başarıyla konuşlandırılır. Uygulama bileşenleri bu sayfada, route ve ana bilgisayar adı ile birlikte listelenmiştir.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718154424.png)

1.3. Daha sonra, Bookinfo ana sayfasına ** Ziyaret etmek için tıklayın ** düğmesini kullanarak aşağıdaki ekran görüntündeki gibi erişebilirsiniz. Özet sayfasına girmek için ** Normal kullanıcı ** seçeneğini tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161448.png)

1.4. Bu noktada yalnızca Kitap İnceleme bölümünde yıldız olmadan ** - Reviewer1 ** ve ** - Reviewer2 ** ifadelerini gösterdiğine dikkat edin, bu bölümün başlangıç durumudur.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161819.png)

### Adım 2: Değerlendirme servisi için Canary Sürümü oluşturmak

2.1. KubeSphere konsoluna geri dönün, **Grayscale Sürümü** 'nü ve ** Canary Sürümü Görevi** 'ni seçin, ardından ** Canary Sürümü** 'nü seçin ve ** Görev Oluştur **' u tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162152.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162308.png)

2.2. Temel bilgileri girin, ör. `canary-sürümü`, ** Next ** 'i tıklayın ve Canary servisi olarak ** reviews **' ı seçin, sonra ** Next ** 'i tıklayın. 


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162550.png)

2.3. Enter `v2` as **Grayscale Release Version Number** and fill in the new image blank with `kubesphere/examples-bookinfo-reviews-v2:1.13.0` (i.e. Modify v1 to v2), then click **Next**.

`v2`yi ** Grayscale Sürüm Numarası ** olarak girin ve yeni imaj boşluğunu `kubesphere/samples-bookinfo-reviews-v2:1.13.0` (yani v1'den v2'ye değiştirin) ile doldurun ve ardından ** İleri **'yi tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162840.png)

2.4. The canary release supports **Forward by traffic ratio** and **Forward by request content**, in this tutorial we choose adjust the traffic ratio to manage traffic distribution between v1 and v2. Drag the slider to adjust v2 takes up 30% traffic, and v2 takes up 70%.

Canary sürümü ** Trafik oranına göre ilet ** ve ** Talep içeriğine göre ilet ** özelliklerini destekler. Bu eğitimde v1 ve v2 arasındaki trafik dağılımını yönetmek için trafik oranını ayarlamayı seçiyoruz. Trafiğin %30'u V1, %70'i ise v2 olacak şekilde butonu kaydırın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718163639.png)

2.5. Yapılandırmayı tamamladığınızda ** Oluştur ** 'u tıklayın, ardından ``canary-sürümü``'nün başarıyla oluşturulduğunu görebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718164216.png)

### Adım 3: Canary Sürümünü Doğrulayın

Bookinfo web sitesini tekrar ziyaret ettiğinizde ve tarayıcınızı tekrar tekrar yenilediğinizde, Bookinfo incelemeleri bölümünün sırasıyla yaklaşık %30 ve %70 oranında rasgele bir oranda v1 ve v2 arasında değişeceğini görebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/bookinfo-canary.gif)

### Adım 4: Trafik Topolojisi Grafiğini İnceleyin

4.1. SSH İstemcinize bağlanın, her 0.5 saniyede bir bookinfo uygulamasına erişimi simüle etmek ve gerçek trafiği tanıtmak için aşağıdaki komutu kullanın.

```
$ curl http://productpage.demo-project.192.168.0.88.nip.io:32565/productpage?u=normal

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0< 74  5183   74  3842    0     0  73957      0 --:--:-- --:--:-- --:--:-- 73884<!DOCTYPE html>
   ···
```

4.2. Trafik yönetimi şemasından, farklı mikro hizmetler arasındaki servis çağırma bağımlılıkları ve performansını kolayca görebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170256.png)

4.3. İnceleme kartına tıkladığınızda, ** Başarı oranı **, ** Trafik ** ve ** Süre ** 'nin gerçek zamanlı verileri de dahil olmak üzere trafik izleme grafiği çıkacaktır.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170727.png)

### Adım 5: Takip Detaylarını İnceleyin

KubeSphere, mikro hizmet tabanlı dağıtık uygulamaların izlenmesi ve sorunlarının giderilmesi için kullanılan [Jaeger] (https://www.jaegertracing.io/) tabanlı dağıtık izleme özelliği sağlar.

5.1. ** İzleme ** sekmesini seçin, bir isteğin tüm aşamalarını, dahili çağrılarını ve her aşamadaki süreyi açıkça görebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718171052.png)

5.2. Herhangi bir öğeye tıkladığınızda, ilgili isteğin hangi makine (veya konteyner) tarafından işlendiğiyle ilgili tüm ayrıntıları görebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718173117.png)

### Adım 6: Tüm Trafiği Yönetin 

6.1. Daha önce belirtildiği gibi, Canary versiyonu (v2) yayınlandığında, Canary versiyonuna trafiğin %70'ini göndermek için kullanılabilir. Yayıncılar yeni sürümü çevrimiçi olarak test edebilir ve kullanıcı geri bildirimleri toplayabilir.

**Grayscale Release** sekmesine geçin ve `canary-release`'i tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181326.png)

6.2. ** ··· ** seçeneğini tıklayın ve `reviews-v2`'de **Devral**'ı seçin. Ardından trafiğin %100'ü yeni sürüme (v2) gönderilir.

> Not: İşlem sırasında bir hata olursa, iptal edebilir ve önceki sürüme (v1) geri dönebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181413.png)

6.3. Open the bookinfo page again and refresh the browsers several times, we can find that it only shows the v2 (ratings with black stars) in reviews module. 

Bookinfo sayfasını tekrar açın ve tarayıcınızı birkaç kez yenileyin, inceleme modülünde yalnızca v2 (siyah yıldızlarla derecelendirme) görülecektir.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718235627.png)

### Adım 7: Eski Versiyonu Kaldırmak

Yeni sürüm v2 tamamen çevrimiçi olup tüm trafiği üstüne aldığında, test sonuçlarının ve çevrimiçi kullanıcıların geri bildirimlerinin doğru olduğu onaylanır. Ardından eski sürümü kaldırabilir ve v1'in kaynaklarını silebilirsiniz.

**Job Offline** butonuna tıklayarak eski versiyonu kaldırın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001803.png)

> Uyarı: Bileşenin belirli bir sürümünü kaldırırsanız, ilişkili iş yükleri ve istio ile ilgili yapılandırma kaynakları aynı anda kaldırılacaksa, v1, v2 ile değiştirilir.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001945.png)
