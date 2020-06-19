---
title: 'Alt Kullanıcı Yönetimi: Hesap Oluşturma, Roller, Çalışma Alanları, Projeler ve DevOps Projeleri'
author: 'xxx'
date: '2019-06-24'
---

## Amaç

Bu rehberde, bir küme yöneticisi olarak, çalışma alanlarının, rollerin ve kullanıcı hesaplarının nasıl oluşturulacağını öğrenecek ve ardından yeni kullanıcıları projelerini ve DevOps projelerini oluşturmak için çalışma alanına davet edeceksiniz. Bu uygulama, yeni başlayanların alt kullanıcı yönetimi tanımasına yardımcı olmayı amaçlar.

## Gereklilikler

- KubeSphere'i yüklemeniz gereklidir.  [install KubeSphere](https://kubesphere.io/en/install).
- Varsayılan yönetici hesabına sahip olmanız gereklidir.

## Uygulama

and there are common built-in roles existed in these orgnizations within each level. Genel olarak, Küme, Çalışma Alanı, Proje ve DevOps Projesi'nin hiyerarşi ilişkisi aşağıdaki grafikte gösterilmektedir. Her düzeyde ortak yerleşik roller bulunmaktadır.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716231511.png)

### Küme Yöneticisi

Küme-yöneticisi rolü, diğer kullanıcılar için hesaplar oluşturabilir ve bunlara faklı roller atayabilir. Küme düzeyinde üç ortak rol vardır, ayrıca yeni rollerin özelleştirilmesi de desteklenir.

| Hazır Roller     | Sorumluluklar                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| küme-yöneticisi      | Küme içindeki tüm ayrıcalıklara sahip olun ve tüm kaynakları                                      |
| çalışma alanı-yöneticisi | Çalışma alanı yöneticileri, tüm kaynakları projeleri, DevOps projelerini, üyeleri ve rolleri yönetebilir.|
| küme-üyesi    | Küme içindeki üye kullanıcılar, çalışma alanına davet edilene kadar yetkiye sahip değildir. |

#### Adım 1: Rollerin ve hesapların oluşturulması

İlk olarak, yeni bir rol (kullanıcı-yönetici) oluşturacağız, bu role hesap yönetimi ve rol yönetimi yetkisi vereceğiz, ardından bir hesap oluşturacağız ve kullanıcı-yönetici rolünü bu hesaba vereceğiz.

| Hesap Adı  | Küme Rolü | Sorumluluk                    |
| ------------ | ------------ | --------------------------------- |
| kullanıcı-yönetici | kullanıcı-yönetici | Küme hesaplarını ve rollerini yönet |

1.1 Başlamak için KubeSphere'e `admin` hesabı ile giriş yapın, **Platform ** 'u tıklayın ve ardından **Platform Rolleri** sayfasına gidin, **Oluştur** 'u tıklatarak tüm hesapları ve rolleri yönetmek için kullanılan bir rol oluşturun.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112614.png)

1.2. Rolün temel bilgilerini ve yetki ayarlarını girin, ör. `İsim: kullanıcı yöneticisi`.

1.3. **Hesap Yönetimi** ve **Rol Yönetimi** için tüm kutuları işaretleyin ve ardından **Oluştur** 'u tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112826.png)

1.4. Click **Platform**, then navigate to **Accounts** page and click **Create** to create an account.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112945.png)

1.5. Temel bilgileri girin, rolü olarak `kullanıcı-yönetici`'yi seçin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716113050.png)

1.6. Oturumu kapatın ve `kullanıcı-yönetici` hesabıyla oturum açın, ardından **Hesap** 'a gidin ve aşağıdaki tabloya göre 4 hesap oluşturun. Bu 4 hesabı oluşturmak için lütfen yukarıdaki adımlara başvurun.

| Hesap Adı    | Küme Rolü     | Sorumluluk                                                                                                                                                                                    |
| --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ws-yönetici     | çalışma alanı-yönetici | Çalışma alanı oluşturun ve yönetin                                                                                                                                                                 |
| ws-yönetici        | küme-üye    | Belirtilen çalışma alanı altındaki tüm kaynakları yönetme <br> (Bu örnek, yeni üyeleri çalışma alanına katılmaya davet etmek için kullanılır.)                                                                       |
| proje-admin   | cluster-regular    | Normal veya DevOps projeleri oluşturun ve yönetin, yeni üyeler davet edin.                                                                                                                                  |
| project-üye | cluster-üye    | Üye kullanıcı projeye ve DevOps projesine proje yöneticisi tarafından davet edilir.<br> Belli bir hesap altında iş yükleri, iş planları ve diğer kaynakları oluşturmak için bu hesap kullanılır.  |

1.7. Adım 1.6 'da oluşturulan 4 hesabı doğrulayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716114245.png)

### Çalışma Alanı Yöneticisi

#### Adım 2: Çalışma Alanı Oluşturmak

Çalışma alanı alt kullanıcı mekanizmasının temelidir. Aaynı zamanda projelerin ve DevOps proje yönetiminin temel birimidir.

2.1. Birinci adımda oluşturduğumuz ``ws-yönetici'' ile oturum açın, ardından **Çalışma Alanı** 'nı tıklayın ve **Çalışma Alanı Oluştur** 'u seçin. demo-çalışma alanı olarak adlandırın ve Çalışma Alanı Yöneticisi olarak ``ws-admin``i atayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130007.png)

2.2. Demo-çalışma alanı oluşturulduktan sonra, oturumu kapatın ve `ws-admin` ile giriş yapın. Ardından **Çalışma Alanını Görüntüle** 'yi tıklatın, **Çalışma Alanı Yönetimi → Üye Yönetimi**' ni seçin ve **Üyeyi Davet Et** 'i tıklatın. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130330.png)

2.3. IHem 'project-admin` hem de' project-normal`i davet edin ve onlara 'workpace-normal' erişimi verin, kaydetmek için **OK** düğmesini tıklatın. Bu adımla birlikte demo-çalışma alanında 3 üye olması gereklidir.

| Kullanıcı Adı       | Çalışma Alanındaki Rolü | Sorumluluk                                                                                                                       |
| --------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ws-yönetici | çalışma alanı-yönetici | Çalışma alanı altındaki tüm kaynakları yönetme <br> (Bu hesap, çalışma alanına yeni üyeler davet etmek için kullanılır.) |
| proje-yönetici | çalışma alanı-üye | Proje oluşturma ve yönetme, DevOps projeleri ve yeni üyeleri katılmaya davet etme |
| proje-üye | çalışma alanı görüntüleyici | Proje yöneticisi tarafından projeye ve DevOps projesine katılmaya davet edilecektir. <br> Bu hesabı iş yükleri, iş planları vb. oluşturmak için kullanılır. |


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130517.png)

### Proje ve DevOps Yöneticisi

#### Adım 3: Proje Oluşturmak

3.1. Birinci adımda oluşturduğumuz ``proje-yönetici'' hesabı ile oturum açın, ardından **Oluştur** 'u tıklayın ve **Bir kaynak projesi oluştur**' u seçin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716131852.png)

3.2. `demo-proje` olarak adlandırın ve gelişmiş ayarları varsayılan değerler olarak saklayın, ardından **Oluştur** 'u tıklayın.

3.3. **Proje Ayarları → Proje Üyeleri** seçeneğini seçin ve **Üyeyi Davet Et** seçeneğini tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132750.png)

3.4. Bu projeye "proje-üye" davet edin ve bu kullanıcıyı **operatör** özelliği verin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132840.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132920.png)

#### Adım 4: Ağ Geçidini Ayarlama

Bir rota oluşturmadan önce, bu proje için bir ağ geçidini etkinleştirmeniz gerekir.

4.1. Burada hala "proje-yönetici" hesabını kullanıyoruz. **Proje Ayarları → Internet Erişimi** 'ni seçin ve **Ağ Geçidini Ayarla** 'yı tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134430.png)

4.2. Erişim yöntemini `NodePort` olarak ayarlayın ve `Kaydet` seçeneğine tıklayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134742.png)

4.3. Artık Ağ Geçidi Adresini (192.168.0.88), http ve https'nin NodePort'unu görebiliyoruz.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134849.png)

#### Adım 5: DevOps Projesi Oluşturma

5.1. Bu adımda **Projeler** 'e tıklayın ve ``Proje Oluştur`` düğmesine tıklayın, ardından **Bir DevOps projesi oluştur**' u seçin.

5.2. Temel bilgileri girin, ör. "demo-devops", ardından **Oluştur** düğmesine tıklayın, "demo-devops" sayfasına atlayacaktır.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716133420.png)

5.3. Benzer şekilde, **Proje Yönetimi → Proje Üyeleri** 'ne gidin, ardından **Üye Davet Et**' i tıklayın ve iş planı, kimlik bilgileri vb. oluşturmak için kullanılan 'maintainer' rolünü ``proje-üye`` hesabına tanımlayın.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716133626.png)

<!-- ## Sonraki Adım 

Eğitim 2 - [Uygulamanızı yayınlayın: Ingress ve servis oluşturun ](ingress-demo.md). -->
