---
title: "page1"


css: "scss/conferences.scss"

viewDetail: Ayrıntıları İnceleyin

list:
  - name: KubeCon
    content: KUBECON_DESC
    icon: images/conferences/kubecon.svg
    bg: images/conferences/kubecon-bg.svg
    children:
      - name: 'Alt Kullanıcı Yönetimi: Hesap oluşturma, Kullanıcı Rolleri, Çalışma Alanları, Projeler ve DevOps Projeleri'
        summary: Bu rehberde, küme yöneticisi olarak, çalışma alanlarının, rollerin, kullanıcı hesaplarının nasıl oluşturulacağını ve yeni kullanıcıların nasıl davet edileceğini öğrenebilirsiniz. 
        author: xxx
        link: admin-quick-start
        image:

      - name: Istio ile Kubernetes üzerindeki bir mikroservis uygulamasının Canary sürümününün yönetilmesi
        summary: Istio’nun hizmet ağı, dağıtım aşamasındaki ölçeklendirmeden tamamen bağımsız olarak trafiğin dağıtılmasını sağlar...
        author: xxx
        link: canary-release
        image:

      - name: Uygulama Şablonu ile Grafana’nın Kubernetes'te Dağıtımı
        summary: Bu eğitimde, Grafana uygulamasının OpenPitrix tarafından desteklenen RadoreKube uygulama mağazasından şablonlar kullanarak hızlı bir şekilde nasıl dağıtılacağını öğrenebilirsiniz. 
        author: xxx
        link: app-template
        image:

  - name: QCon Uluslararası Yazılım Geliştirme Konferansı
    content: QCON_DESC
    icon: images/conferences/qcon.svg
    bg: images/conferences/qcon-bg.svg
    children:
      - name: Kubernetes üzerinde Spring Boot App dağıtımı için CI/CD Pipeline oluşturulması
        summary: Bu eğitimde bir DevOps projesinde Spring Boot örneği dağıtmı amacıyla CI/CD Pipeline'nnin nasıl oluşturulacağını öğrenebilirsiniz.
        author: xxx
        link: cicd-jenkinsfile
        image:

      - name: Dağıtım için Horizontal Pod Autoscaler oluşturulması
        summary: Horizontal Pod Autoscaler, dağıtım aşamasında CPU ya da hafıza kullanımına bağlı olarak kullanılacak pod sayısının otomatik olarak ölçeklendirilmesini sağlar.
        author: xxx
        link: hpa
        image:
---