---
title: KubeSphere | Açık Kaynak Container Platformu
description: KubeSphere, kurumsal/bireysel uygulama geliştirme ve dağıtımı için Kubernetes tabanlı açık kaynaklı bir konteyner platformudur.

css: scss/index-tr.scss

section1:
  title: KubeSphere Container Platform
  topic: Hibrit Bulut İçin Tasarlandı
  content: KubeSphere, Kubernetes çekirdeğini kullanan, üçüncü taraf uygulamalar için sorunsuz entegrasyon sunmayı amaçlayan açık kaynak kodlu container platformudur.
  btnContent1: Kubernetes Üzerinde Kurulum
  btnContent2: Linux Üzerinde Kurulum

section2:
  title: Tek Platform Onlarca Çözüm
  content: KubeSphere, yığın otomatik BT operasyonuna ve modern DevOps iş akışlarına sahip multi-tenant kurumsal sınıf bir konteyner platformudur. Ayrıca işletmelerin Kubernetes stratejisi için gereken en yaygın işlevleri içeren daha sağlam ve zengin özellikli bir platform oluşturmalarına yardımcı olan geliştirici dostu web kullanıcı arayüzü sağlar.
  children:
    - name: Açık Kaynak
      icon: /images/home/open-source.svg
      content: 100% açık kaynaklı kendisini topluluğa adamış CNCF sertifikalı Kubernetes platform

    - name: Kolay Kurulum
      icon: /images/home/easy-to-run.svg
      content: Kubernetes cluster veya Linux serverlara kurulabilir, çevrimiçi ve air-gapped kurulum destekler

    - name: Öne Çıkaran Özellikler
      icon: /images/home/feature-rich.svg
      content: Tek platformda DevOps, service mesh, multi-tenancy, storage and network yönetimi sunar

    - name: Modüler & Tak-Çıkar
      icon: /images/home/modular-pluggable.svg
      content: Tüm modüller tak-çıkar yapıya uygun olarak geliştirilmiştir, kolayca yönetilebilir

section3:
  title: Farklı Ekiplere Faydaları
  content: Farklı ekiplerin birbirine entegre olarak çalışmasını sağlar. Geliştiriciler web konsolda tek tıkla kodunu dağıtabilir, Operasyon ekibi için merkezi gözlemlenebilirlik ve güçlü DevOps stratejisine uygun ortamı sunar, Altyapı ekibinin esnek ağ ve çözüm çözümleriyle Kubernetes cluster kurmasına ve korumasına yardımcı olur.
  children:
    - name: Altyapı Takımı
      content: Otomatik kurulum, ölçekleme ve yükseltme işlemlerini zahmetsiz gerçekleştirin
      icon: /images/home/7.svg
      children:
        - content: Kullanımınızı geliştirir ve altyapı maaliyetlerinizi azaltır
        - content: Tek arayüzde multi-cluster container platformu kontrolü sağlayın
        - content: Kusursuz güvenlik geliştirmeleri sağlar, birden çok depolama ve ağ çözümünü destekler
        - content: Tamamen güvenilir, sertifikalı bir Kubernetes platformu ve uygulama dağıtımı sunar

    - name: Geliştiriciler
      content: Kodunuza odaklanın, brakın gerisini KubeSphere halletsin
      icon: /images/home/74.png
      children:
        - content: Smooth kullanıcı deneyimi ile karmaşıklığın önüne gerçer
        - content: Her uygulama ortamına uyarlanmış toolkit ve dağıtım otomasyonu sağlar
        - content: Kullanıma hazır log kaydı, monitoring ve multi-tenant yapı, geliştirme verimliliğini artırır
        - content: Uygulama yaşam döngüsü yönetimini destekleyerek pazara giriş süresini hızlandırın

    - name: Operasyon Takımı
      content: Tek tıkla kurumsal seviye container platformu kurun
      icon: /images/home/71.svg
      children:
        - content: Altyapıdan uygulamalara merkezi günlük log kaydı, monitoring ve uyarı servisleri
        - content: Kolaylaştırılmış dağıtım, test, sürüm, yükseltme ve ölçeklendirme
        - content: Bulut uygulamaları için Kubernetes'i iyi izleyin, yönlendirin ve optimize edin
        - content: Farklı kullanıcıların alışkanlıkları için optimize edilmiş, kullanımı kolay web konsolu ve grafik paneli

section4:
  title: Öne Çıkan Özellikler
  content: Açık kaynaklı bir ürün kullanmak ve bu ürünün kurumunuza uygun olmasını istiyorsanız doğru yerdesiniz
  children:
    - name: Kolay Provizyon
      icon: /images/home/provisioning-kubernetes.svg
      content: Kubernetes ya da herhangi bir altyapıya, kolayca deploy edin, GPU node desteği mevcuttur

    - name: K8s Kaynak Yönetimi
      icon: /images/home/k-8-s-resource-management.svg
      content: Güçlü gözlemlenebilirlik ile web console kullanarak kaynaklarınızı kolayca yönetin

    - name: Multi-tenant Yönetim
      icon: /images/home/multi-tenant-management.svg
      content: Kullanıcı yetkilendirmesi, alt hesaplar oluşturulması, LDAP desteği ile muteşem çözüm

  features:
    - name: Uygulama Mağazası
      icon: /images/home/store.svg
      content: Helm tabanlı uygulamalar için uygulama deposu sağlayın ve uygulama yaşam döngüsünü zahmetsiz sağlayın
      color: grape

    - name: Service Mesh (Istio Tabanlı)
      icon: /images/home/service.svg
      content: Ayrıntılı trafik yönetimi ve gözlemlenebilirliği arayüzü kullanarak kontrol altında tutun
      color: red

    - name: Zengin Gözlemlenebilirlik
      icon: /images/home/rich.svg
      content: Çok boyutlu monitoring grafikleri, multi-tenant log dosyaları, uyarılar ve bildirimler
      color: green

    - name: DevOps Modülü
      icon: /images/home/dev-ops.svg
      content: Jenkins temelli kullanıma hazır CI / CD ve S2I ve B2I dahil otomatik workflow araçları sunar
      color: orange

    - name: Birden Fazla Storage Çözümü
      icon: /images/home/multiple.svg
      content: GlusterFS, CephRBD, NFS, LocalPV çözümlerini destekler, birden çok depolama alanı desteği sunar
      color: grape

    - name: Birden Fazla Network Çözümü
      icon: /images/home/network.svg
      content: Calico ve Flannel destekler, Porter LB desteği vardır
      color: green

    - name: Multi-cluster Yönetimi
      icon: /images/home/management.svg
      content: Uygulamaları birden çok cluster ve bulut sağlayıcıya dağıtın ve olağanüstü durum kurtarma için hazırlıklı olun
      color: orange

section5:
  title: KubeSphere ile Cloud Native Çözümler
  frontEnd:
    title: Front-End
    project: KubeSphere Web Konsol
    children:
      - icon: /images/home/kube-design.jpg
      - icon: /images/home/koa.jpg
      - icon: /images/home/react.png

  backEnd:
    title: Back end （REST API）
    project: KubeSphere Back Sistem
    group:
      - name: API Sunucusu
      - name: API Geçiş Kapısı
      - name: Kontroller Yönetimi
      - name: Hesap Yönetimi

section6:
  title: KubeSphere'i Tercih Edenler
  content: Müşteri senaryoları, daha ayrıntılı kullanıcı senaryoları ve bulut yerel dönüşüm hikayelerini sizler için listeledik. </br> Çeşitli işletme ve kuruluşlar araştırma, üretim ve ticari ürünler için KubeSphere Container Platform'u kullanıyor.
  children:
    - icon: /images/home/section6-anchnet.jpg
    - icon: /images/home/section6-aviation-industry-corporation-of-china.jpg
    - icon: /images/home/section6-aqara.jpg
    - icon: /images/home/section6-bank-of-beijing.jpg
    - icon: /images/home/section6-benlai.jpg
    - icon: /images/home/section6-china-taiping.jpg
    - icon: /images/home/section6-changqing-youtian.jpg
    - icon: /images/home/section6-cmft.jpg
    - icon: /images/home/section6-extreme-vision.jpg
    - icon: /images/home/section6-guizhou-water-investment.jpg
    - icon: /images/home/section6-huaxia-bank.jpg
    - icon: /images/home/section6-inaccel.jpg
    - icon: /images/home/section6-maxnerva.jpg
    - icon: /images/home/section6-picc.jpg
    - icon: /images/home/section6-powersmart.jpg
    - icon: /images/home/section6-sina.jpg
    - icon: /images/home/section6-sichuan-airlines.jpg
    - icon: /images/home/section6-sinopharm.jpg
    - icon: /images/home/section6-softtek.jpg
    - icon: /images/home/section6-spd-silicon-valley-bank.jpg
    - icon: /images/home/section6-vng.jpg
    - icon: /images/home/section6-webank.jpg
    - icon: /images/home/section6-wisdom-world.jpg
    - icon: /images/home/section6-yiliu.jpg
    - icon: /images/home/section6-zking-insurance.jpg
  btnContent: Müşteri Senaryoları
  btnLink:
  link:
  linkContent: Logonuzun burada yer almasını ister misiniz? Hemen istek gönderin. →
  image: /images/home/certification.png
---
