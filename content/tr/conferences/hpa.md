---
title: 'Dağıtım için Horizontal Pod Autoscaler Oluşturulması'

author: 'xxx'
---

Horizontal Pod Autoscaler, bir dağıtımdaki Pod sayısını gözlemlenen CPU veya Bellek kullanımına göre otomatik olarak ölçeklendirir. Denetleyici, bir dağıtımdaki kopya sayısını, gözlemlenen ortalama CPU kullanımını kullanıcı tarafından belirtilen hedef değerle eşleştirecek şekilde periyodik olarak ayarlar.

## HPA nasıl çalışır?

Horizontal Pod Autoscaler (HPA), denetleyici yöneticisinin HPA eşitleme süresi ile (15 saniye varsayılan değeriyle) tarafından denetlenen belli bir zaman aralığında, bir kontrol döngüsü olarak uygulanır. HPA tarafından hedeflenen her bir Pod'un metrikleri (CPU gibi), kaynak metrikleri API'sından alınır.

Daha fazla detay için: [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716214909.png)

## Amaç

Bu doküman, HPA-örnek dağıtımı için HPA yapılandırma örneğini içerir.

HPA-örnek uygulamasına sonsuz bir sorgu döngüsü göndermek ve otomatik ölçeklendirme işlevi ile HPA Prensibini göstermek için bir dağıtım oluşturacağız.

## Gereklilikler

- Bir çalışma alanı ve proje oluşturmanız gereklidir. Henüz oluşturmadıysanız [Eğitim 1]'i (admin-quick-start.md) inceleyin.
- `Proje-üye` ile oturum açmanız ve ilgili projeye girmeniz gerekir.

## Uygulama

### Adım 1: Dağıtım oluşturulması

1.1. `Demo proje` 'ye girin, ardından ** İşyükü → Dağıtımlar ** 'ı seçin ve ** Dağıtım Oluştur ** düğmesine tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716215848.png)

1.2. Açılır pencerede temel bilgileri girin. Örneğin. `Ad:hpa-örnek`, ardından tamamladığınızda ** İleri ** düğmesini tıklayın.

### Adım 2: HPA'nın ayarlanması

2.1. ** Horizontal Pod Autoscaling** 'i seçin ve tabloyu aşağıdaki gibi doldurun:
- Min Kopya Sayısı: 2
- Max Kopya Sayısı: 10
- CPU talep hedefi(%): 50 (Hedeflenen CPU kullanım yüzdesini ifade eder.)

Sonrasında **Konteyner Ekle** butonuna tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716220122.png)

2.2. Pod Şablonunu aşağıdaki değerlere göre doldurun. Ardından **Kaydet** butonuna tıklayın.

- Imaj: `mirrorgooglecontainers/hpa-example`
- Servis Ayarları
  - Ad: port
  - port: 80 (Varsayılan TCP protokolü)

![Add a Container](https://pek3b.qingstor.com/kubesphere-docs/png/20190321234139.png)

2.3. Birim ve Etiket Ayarları'nı atlayın. **Oluştur** butonuna tıklayın. Böylece HPA-örnek dağıtımı başarıyla oluşturuldu.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221028.png)

### Adım 3: Servis oluşturulması

3.1. Soldaki menüden ** Ağ ve Servisler → Servisler ** 'i seçin, ardından ** Servis Oluştur ** düğmesine tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221110.png)

3.2. Temel bilgileri girin, ör. `name: hpa-example`, ardından ** İleri ** 'yi tıklayın.

3.3. Hizmet Ayarları için ilk baştaki `Sanal IP: Kümenin dahili IP'sinden servise erişin` öğesini seçin.

3.4. Seçim alanında ** İş Yükünü Belirle ** 'yi tıklatın ve back-end iş yükü olarak `hpa-örneği` 'ni seçin. Ardından ** Kaydet ** 'i seçin Port boşluklarını doldurun.

- Ports:
  - Ad: port
  - Protokol: TCP
  - Port: 80
  - Hedef port: 80

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221536.png)

Oluşturmayı tamamlamak için ** İleri → Oluştur ** 'u tıklayın. Artık hpa-example hizmeti başarıyla oluşturuldu.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221828.png)

### Adım 4: Yük üreticinin oluşturulması

4.1. Mevcut projede, ** İş Yükü → Dağıtımlar ** 'a gidin. ** Oluştur ** düğmesini tıklayın ve açılır pencerede temel bilgileri girin, ör. `Ad : yük-üretici`. İşiniz bittiğinde ** İleri ** düğmesini tıklayın.

4.2. ** Konteyner Ekle ** düğmesine tıklayın ve Pod şablonunu aşağıdaki gibi doldurun:

- Imaj: busybox
- Ekranı aşağı kaydırın ve **Start command** a tıklayın, aşağıdaki parametre ve komutları yazın:

```
# Commands
sh
-c

# Parameters (Not: http servis adresi şu formatta girilmelidir: http://{$service name}.{$project name}.svc.cluster.local)
while true; do wget -q -O- http://hpa-example.demo-project.svc.cluster.local; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222521.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222549.png)

İşlemi tamamladığınızda **Kaydet** butonuna ve ardından **İleri** butonuna tıklayın.

4.3. İşlemi tamamlamak için **İleri → Oluştur** butonlaırna tıklayın.

So far, we've created 2 deployments (i.e. hpa-example and load-generator) and 1 service (i.e. hpa-example).

Böylece 2 adet dağıtım (yani hpa-örnek ve yük üretici) ve 1 adet hizmet (yani hpa-örnek) oluşturduk.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222833.png)

### Adım 5: HPA'nın doğrulanması

5.1. `Hpa-örnek`'e tıklayın ve değişiklikleri inceleyin. Lütfen HPA durumuna, CPU kullanımına ve Pod izleme grafiklerine dikkat edin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322010021.png)

### Step 6: Auto Scale özelliğinin doğrulanması

6.1. Tüm yük oluşturucu Pod'ları başarıyla oluşturulduğunda ve aşağıda gösterildiği gibi hpa-örnek hizmetine erişmeye başladığında, sayfa yenilendikten sonra CPU kullanımı önemli ölçüde artar. Görüldüğü gibi `%722`'ye yükselmekle birlikte istenen replika ve güncel replika sayıları da `10/10`'a yükseliyor.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716223104.png)

> Not: Şu anda Horizontal Pod Autoscaler çalıştığından, yük oluşturucu döngüsel olarak hpa-örnek hizmetinden, CPU kullanımını hızlı bir şekilde arttırmasını talep eder. HPA çalışmaya başladıktan sonra, çok sayıda isteği idare edebilmek için hizmetin back-end tarafının hızla artmasını sağlar. Ayrıca HPA'nın çalışma prensibini gösteren CPU kullanım artışları ile hpa-örneği kopyaları artmaya devam eder.

6.2. İzleme grafiğinde, oluşturduğumuz ilk Pod'un CPU kullanımının önemli bir artış eğilimi gösterdiği görülebilir. HPA çalışmaya başladığında, CPU kullanımında önemli bir azalma eğilimi vardır, sakinleşme eğilimindedir. Buna göre, yeni oluşturulan Pod'larda CPU kullanımı artıyor.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716223415.png)

### Adım 7: Yük üretiminin durdurulması

7.1. ** İşyükü → Dağıtımlar ** 'a yönlendirin ve yük artışını durdurmak için ``yük-üretici``'yi silin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225225.png)

7.2. `Hpa-example`'in durumunu tekrar inceleyin, mevcut CPU kullanımının birkaç dakika içinde yavaş yavaş %10'a düştüğünü göreceksiniz, netice olarak HPA dağıtım kopyalarını 1'e (başlangıç değeri) düşürecektir. İzleme eğrisinin yansıttığı eğilim, HPA'nın çalışma prensibini daha iyi anlamamıza da yardımcı olabilir;

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716230725.png)

7.3. Kullanıcının dağıtım izleme grafiğini denetlemesini, CPU kullanımını ve Ağ gelen/giden trendlerini görmesini sağlar, sadece HPA örneğiyle eşleşir.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716230333.png)

## Modify HPA Özelliklerinin değiştirilmesi

HPA ayarlarını değiştirmeniz gerekirse, dağıtıma tıklayıp ** Diğer → Yatay Bölme Otomatik Ölçeklendiricisi **'ni seçebilirsiniz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225918.png)

## HPA'nın iptal edilmesi

Bu dağıtımda HPA'ya ihtiyaç duymuyorsanız sağ taraftaki **···** butonuna tıklayın ve **İptal** seçeneğini seçin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225953.png)

## Sonraki Adım

Eğitim 8 - [Source-to-Image: Build Reproducible Images from Source Code](s2i.md).
