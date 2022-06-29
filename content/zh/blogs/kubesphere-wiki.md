---
title: '在 KubeSphere 部署 Wiki 系统 wiki.js 并启用中文全文检索'
tag: 'KubeSphere'
keywords: 'KubeSphere, wiki, wiki.js, Kubernetes, 云原生'
description: ' Wiki 写作、分享、权限管理功能还是有的，胜在 UI 设计很漂亮，能满足小团队的基本知识管理需求。以下工作是在 KubeSphere 3.2.1 + Helm 3 已经部署好的情况下进行的。'
createTime: '2022-06-24'
author: 'scwang18'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubesphere-wiki-cover.png'
---

## 背景

wiki.js 是优秀的开源 Wiki 系统，相较于 xwiki ，功能目前性上比 xwiki 不够完善，但也在不断进步。 Wiki 写作、分享、权限管理功能还是有的，胜在 UI 设计很漂亮，能满足小团队的基本知识管理需求。

以下工作是在 KubeSphere 3.2.1 + Helm 3 已经部署好的情况下进行的。

部署 KubeSphere 的方法官网有很详细的文档介绍，这里不再赘叙。
https://kubesphere.com.cn/docs/installing-on-linux/introduction/multioverview/

## 准备 storageclass

我们使用 OpenEBS 作为存储，OpenEBS 默认安装的 Local StorageSlass 在 Pod 销毁后自动删除，不适合用于我的 MySQL 存储，我们在 Local StorageClass 基础上稍作修改，创建新的 StorageClass，允许 Pod 销毁后，PV 内容继续保留，手动决定怎么处理。

```yaml
apiVersion: v1
items:
- apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    annotations:
      cas.openebs.io/config: |
        - name: StorageType
          value: "hostpath"
        - name: BasePath
          value: "/var/openebs/localretain/"
      openebs.io/cas-type: local
      storageclass.beta.kubernetes.io/is-default-class: "false"
      storageclass.kubesphere.io/supported-access-modes: '["ReadWriteOnce"]'
    name: localretain
  provisioner: openebs.io/local
  reclaimPolicy: Retain
  volumeBindingMode: WaitForFirstConsumer
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

## 部署 PostgreSQL 数据库

我们团队其他项目中也需要使用 PostgreSQL, 为了提高 PostgreSQL 数据库的利用率和统一管理，我们独立部署 PostgreSQL，并在安装 wiki.js 时，配置为使用外部数据库。

### 准备用户名密码配置

我们使用 Secret 保存 PostgreSQL 用户密码等敏感信息。

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: postgres-prod
data:
  POSTGRES_PASSWORD: xxxx
type: Opaque
```
以上 POSTGRES_PASSWORD 自行准备，为 base64 编码的数据。

### 准备数据库初始化脚本

使用 ConfigMap 保存数据库初始化脚本，在 数据库创建时，将 ConfigMap 中的数据库初始化脚本挂载到 /docker-entrypoint-initdb.d, 容器初始化时会自动执行该脚本。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: wikijs-postgres-init
data:
  init.sql: |-
    CREATE DATABASE wikijs;
    CREATE USER wikijs with password 'xxxx';
    GRANT CONNECT ON DATABASE wikijs to wikijs;
    GRANT USAGE ON SCHEMA public TO wikijs;
    GRANT SELECT,update,INSERT,delete ON ALL TABLES IN SCHEMA public TO wikijs;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO wikijs;
    
```

以上 wikijs 用户的密码自行准备，明文保存。

### 准备存储

我们使用 KubeSphere 默认安装的 OpenEBS 来提供存储服务。可以通过创建 PVC 来提供持久化存储。

这里声明一个 10G 的 PVC。

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: postgres-prod-data
  finalizers:
    - kubernetes.io/pvc-protection
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: localretain
  volumeMode: Filesystem
```

### 部署 PostgreSQL 数据库

在前面的步骤准备好各种配置信息和存储后，就可以开始部署 PostgreSQL 服务了。

我们的 Kubernetes 没有配置存储阵列，使用的是 OpenEBS 作为存储，采用 Deployment 方式部署 PostgreSQL。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: postgres-prod
  name: postgres-prod
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres-prod
  template:
    metadata:
      labels:
        app: postgres-prod
    spec:
      containers:
        - name: db
          imagePullPolicy: IfNotPresent
          image: 'abcfy2/zhparser:12-alpine'
          ports:
            - name: tcp-5432
              protocol: TCP
              containerPort: 5432
          envFrom:
          - secretRef:
              name: postgres-prod
          volumeMounts:
            - name: postgres-prod-data
              readOnly: false
              mountPath: /var/lib/postgresql/data
            - name: wikijs-postgres-init
              readOnly: true
              mountPath: /docker-entrypoint-initdb.d
      volumes:
        - name: postgres-prod-data
          persistentVolumeClaim:
            claimName: postgres-prod-data
        - name: wikijs-postgres-init
          configMap:
            name: wikijs-postgres-init
```

### 创建供其他 Pod 访问的 Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-prod
spec:
  selector:
    app: postgres-prod
  ports:
    - protocol: TCP
      port: 5432
      targetPort: tcp-5432
```

### 完成 PostgreSQL 部署

测试略


## 部署 wiki.js

### 准备用户名密码配置

我们使用 Secret 保存 wiki.js 用于连接数据库的用户名密码等敏感信息。


```yaml
apiVersion: v1
kind: Secret
metadata:
  name: wikijs
data:
  DB_USER: d2lraWpz
  DB_PASS: xxxx
type: Opaque

```
以上 DB_PASS 自行准备，为 base64 编码的数据。

### 准备数据库连接配置

我们使用 ConfigMap 保存 wiki.js 的数据库连接信息。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: wikijs
data:
  DB_TYPE: postgres
  DB_HOST: postgres-prod.infra
  DB_PORT: "5432"
  DB_NAME: wikijs
  HA_ACTIVE: "true"

```

### 创建数据库用户和数据库

如果 PostgreSQL 数据库里没有创建 wikijs 用户和数据 ，需要手工完成一下工作：

通过『数据库工具』连接 PostgreSQL 数据库，执行一下 SQL 语句，完成数据库和用户的创建、授权。

```yaml
CREATE DATABASE wikijs;
CREATE USER wikijs with password 'xxxx';
GRANT CONNECT ON DATABASE wikijs to wikijs;
GRANT USAGE ON SCHEMA public TO wikijs;
GRANT SELECT,update,INSERT,delete ON ALL TABLES IN SCHEMA public TO wikijs;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO wikijs;
```

以上 wikijs 的密码自行修改。

### 准备 wiki.js 的 yaml 部署文件

采用 Deployment 方式 部署 wiki.js 的 yaml 文件如下：

```yaml
# wikijs-deploy.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: wikijs
  name: wikijs
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wikijs
  template:
    metadata:
      labels:
        app: wikijs
    spec:
      containers:
        - name: wikijs
          image: 'requarks/wiki:2'
          ports:
            - name: http-3000
              protocol: TCP
              containerPort: 3000
          envFrom:
          - secretRef:
              name: wikijs
          - configMapRef:
              name: wikijs


```

### 创建集群内访问 wiki.js 的 Service

```yaml
# wikijs-svc.yaml

apiVersion: v1
kind: Service
metadata:
  name: wikijs
spec:
  selector:
    app: wikijs
  ports:
    - protocol: TCP
      port: 3000
      targetPort: http-3000
```

### 创建集群外访问的 Ingress

```yaml
# wikijs-ing.yaml

kind: Ingress
apiVersion: networking.k8s.io/v1
metadata:
  name: wikijs
spec:
  ingressClassName: nginx
  rules:
    - host: wiki.xxxx.cn
      http:
        paths:
          - path: /
            pathType: ImplementationSpecific
            backend:
              service:
                name: wikijs
                port:
                  number: 3000

```

以上 host 域名需要自行配置。

### 执行部署

```bash
$ kubectl apply -f wikijs-deploy.yaml
$ kubectl apply -f wikijs-svc.yaml
$ kubectl apply -f wikijs-ing.yaml
```

## 配置 wiki.js 支持中文全文检索

wiki.js 的全文检索支持基于 PostgreSQL 的检索，也支持 Elasticsearch 等，相对来说, PostgreSQL 比较轻量级，本项目中，我们使用 PostgreSQL 的全文检索。

但是，因为 PostgreSQL 不支持中文分词，需要额外安装插件并配置启用中文分词，下面描述了为 wiki.js 启动基于 PostgreSQL 数据库中文分词的全文检索。

### 授予 wikijs 用户临时超管权限

通过数据库管理工具登录有超管权限的 PostgreSQL 用户，临时授予 wiki.js 用户临时超管权限，便于启动中文分词功能。

```sql
ALTER USER wikijs WITH SUPERUSER;
```

### 启用数据库的中文分词能力

使用数据库管理工具登录 PostgreSQL 数据库的 wikijs 用户，执行以下命令，启动数据库的中文分词功能。

```sql
CREATE EXTENSION pg_trgm;

CREATE EXTENSION zhparser;
CREATE TEXT SEARCH CONFIGURATION pg_catalog.chinese_zh (PARSER = zhparser);
ALTER TEXT SEARCH CONFIGURATION chinese_zh ADD MAPPING FOR n,v,a,i,e,l WITH simple;

-- 忽略标点影响
ALTER ROLE wikijs SET zhparser.punctuation_ignore = ON;
-- 短词复合
ALTER ROLE wikijs SET zhparser.multi_short = ON;

-- 测试一下
select ts_debug('chinese_zh', '青春是最美好的年岁，青春是最灿烂的日子。每一个人的青春都无比宝贵，宝贵的青春只有与奋斗为伴才最闪光、最出彩。');
```

### 取消 wikijs 用户的临时超管权限

登录 PostgreSQL 数据库 wikijs 用户，取消 wikijs 用户的超管权限。

```sql
ALTER USER wikijs WITH NOSUPERUSER;
```

### 创建支持中文分词的配置 ConfigMap

```yaml
# zh-parse.yaml

kind: ConfigMap
apiVersion: v1
metadata:
  name: wikijs-zhparser
data:
  definition.yml: |-
    key: postgres
    title: Database - PostgreSQL
    description: Advanced PostgreSQL-based search engine.
    author: requarks.io
    logo: https://static.requarks.io/logo/postgresql.svg
    website: https://www.requarks.io/
    isAvailable: true
    props:
      dictLanguage:
        type: String
        title: Dictionary Language
        hint: Language to use when creating and querying text search vectors.
        default: english
        enum:
          - simple
          - danish
          - dutch
          - english
          - finnish
          - french
          - german
          - hungarian
          - italian
          - norwegian
          - portuguese
          - romanian
          - russian
          - spanish
          - swedish
          - turkish
          - chinese_zh
        order: 1
  engine.js: |-
    const tsquery = require('pg-tsquery')()
    const stream = require('stream')
    const Promise = require('bluebird')
    const pipeline = Promise.promisify(stream.pipeline)

    /* global WIKI */

    module.exports = {
      async activate() {
        if (WIKI.config.db.type !== 'postgres') {
          throw new WIKI.Error.SearchActivationFailed('Must use PostgreSQL database to activate this engine!')
        }
      },
      async deactivate() {
        WIKI.logger.info(`(SEARCH/POSTGRES) Dropping index tables...`)
        await WIKI.models.knex.schema.dropTable('pagesWords')
        await WIKI.models.knex.schema.dropTable('pagesVector')
        WIKI.logger.info(`(SEARCH/POSTGRES) Index tables have been dropped.`)
      },
      /**
       * INIT
       */
      async init() {
        WIKI.logger.info(`(SEARCH/POSTGRES) Initializing...`)

        // -> Create Search Index
        const indexExists = await WIKI.models.knex.schema.hasTable('pagesVector')
        if (!indexExists) {
          WIKI.logger.info(`(SEARCH/POSTGRES) Creating Pages Vector table...`)
          await WIKI.models.knex.schema.createTable('pagesVector', table => {
            table.increments()
            table.string('path')
            table.string('locale')
            table.string('title')
            table.string('description')
            table.specificType('tokens', 'TSVECTOR')
            table.text('content')
          })
        }
        // -> Create Words Index
        const wordsExists = await WIKI.models.knex.schema.hasTable('pagesWords')
        if (!wordsExists) {
          WIKI.logger.info(`(SEARCH/POSTGRES) Creating Words Suggestion Index...`)
          await WIKI.models.knex.raw(`
            CREATE TABLE "pagesWords" AS SELECT word FROM ts_stat(
              'SELECT to_tsvector(''simple'', "title") || to_tsvector(''simple'', "description") || to_tsvector(''simple'', "content") FROM "pagesVector"'
            )`)
          await WIKI.models.knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm')
          await WIKI.models.knex.raw(`CREATE INDEX "pageWords_idx" ON "pagesWords" USING GIN (word gin_trgm_ops)`)
        }

        WIKI.logger.info(`(SEARCH/POSTGRES) Initialization completed.`)
      },
      /**
       * QUERY
       *
       * @param {String} q Query
       * @param {Object} opts Additional options
       */
      async query(q, opts) {
        try {
          let suggestions = []
          let qry = `
            SELECT id, path, locale, title, description
            FROM "pagesVector", to_tsquery(?,?) query
            WHERE (query @@ "tokens" OR path ILIKE ?)
          `
          let qryEnd = `ORDER BY ts_rank(tokens, query) DESC`
          let qryParams = [this.config.dictLanguage, tsquery(q), `%${q.toLowerCase()}%`]

          if (opts.locale) {
            qry = `${qry} AND locale = ?`
            qryParams.push(opts.locale)
          }
          if (opts.path) {
            qry = `${qry} AND path ILIKE ?`
            qryParams.push(`%${opts.path}`)
          }
          const results = await WIKI.models.knex.raw(`
            ${qry}
            ${qryEnd}
          `, qryParams)
          if (results.rows.length < 5) {
            const suggestResults = await WIKI.models.knex.raw(`SELECT word, word <-> ? AS rank FROM "pagesWords" WHERE similarity(word, ?) > 0.2 ORDER BY rank LIMIT 5;`, [q, q])
            suggestions = suggestResults.rows.map(r => r.word)
          }
          return {
            results: results.rows,
            suggestions,
            totalHits: results.rows.length
          }
        } catch (err) {
          WIKI.logger.warn('Search Engine Error:')
          WIKI.logger.warn(err)
        }
      },
      /**
       * CREATE
       *
       * @param {Object} page Page to create
       */
      async created(page) {
        await WIKI.models.knex.raw(`
          INSERT INTO "pagesVector" (path, locale, title, description, "tokens") VALUES (
            ?, ?, ?, ?, (setweight(to_tsvector('${this.config.dictLanguage}', ?), 'A') || setweight(to_tsvector('${this.config.dictLanguage}', ?), 'B') || setweight(to_tsvector('${this.config.dictLanguage}', ?), 'C'))
          )
        `, [page.path, page.localeCode, page.title, page.description, page.title, page.description, page.safeContent])
      },
      /**
       * UPDATE
       *
       * @param {Object} page Page to update
       */
      async updated(page) {
        await WIKI.models.knex.raw(`
          UPDATE "pagesVector" SET
            title = ?,
            description = ?,
            tokens = (setweight(to_tsvector('${this.config.dictLanguage}', ?), 'A') ||
            setweight(to_tsvector('${this.config.dictLanguage}', ?), 'B') ||
            setweight(to_tsvector('${this.config.dictLanguage}', ?), 'C'))
          WHERE path = ? AND locale = ?
        `, [page.title, page.description, page.title, page.description, page.safeContent, page.path, page.localeCode])
      },
      /**
       * DELETE
       *
       * @param {Object} page Page to delete
       */
      async deleted(page) {
        await WIKI.models.knex('pagesVector').where({
          locale: page.localeCode,
          path: page.path
        }).del().limit(1)
      },
      /**
       * RENAME
       *
       * @param {Object} page Page to rename
       */
      async renamed(page) {
        await WIKI.models.knex('pagesVector').where({
          locale: page.localeCode,
          path: page.path
        }).update({
          locale: page.destinationLocaleCode,
          path: page.destinationPath
        })
      },
      /**
       * REBUILD INDEX
       */
      async rebuild() {
        WIKI.logger.info(`(SEARCH/POSTGRES) Rebuilding Index...`)
        await WIKI.models.knex('pagesVector').truncate()
        await WIKI.models.knex('pagesWords').truncate()

        await pipeline(
          WIKI.models.knex.column('path', 'localeCode', 'title', 'description', 'render').select().from('pages').where({
            isPublished: true,
            isPrivate: false
          }).stream(),
          new stream.Transform({
            objectMode: true,
            transform: async (page, enc, cb) => {
              const content = WIKI.models.pages.cleanHTML(page.render)
              await WIKI.models.knex.raw(`
                INSERT INTO "pagesVector" (path, locale, title, description, "tokens", content) VALUES (
                  ?, ?, ?, ?, (setweight(to_tsvector('${this.config.dictLanguage}', ?), 'A') || setweight(to_tsvector('${this.config.dictLanguage}', ?), 'B') || setweight(to_tsvector('${this.config.dictLanguage}', ?), 'C')), ?
                )
              `, [page.path, page.localeCode, page.title, page.description, page.title, page.description, content,content])
              cb()
            }
          })
        )

        await WIKI.models.knex.raw(`
          INSERT INTO "pagesWords" (word)
            SELECT word FROM ts_stat(
              'SELECT to_tsvector(''simple'', "title") || to_tsvector(''simple'', "description") || to_tsvector(''simple'', "content") FROM "pagesVector"'
            )
          `)

        WIKI.logger.info(`(SEARCH/POSTGRES) Index rebuilt successfully.`)
      }
    }

```

### 更新 wikijs 的 Deployment

wiki.js 的基于 PostgreSQL 的全文检索引擎配置位于 /wiki/server/modules/search/postgres ，我们将前面配置的 ConfigMap 加载到这个目录。

```yaml
# wikijs-zh.yaml

kind: Deployment
apiVersion: apps/v1
metadata:
  name: wikijs
  labels:
    app: wikijs
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wikijs
  template:
    metadata:
      labels:
        app: wikijs
    spec:
      volumes:
        - name: volume-dysh4f
          configMap:
            name: wikijs-zhparser
            defaultMode: 420
      containers:
        - name: wikijs
          image: 'requarks/wiki:2'
          ports:
            - name: http-3000
              containerPort: 3000
              protocol: TCP
          envFrom:
            - secretRef:
                name: wikijs
            - configMapRef:
                name: wikijs
          volumeMounts:
            - name: volume-dysh4f
              readOnly: true
              mountPath: /wiki/server/modules/search/postgres

```

### 配置 wiki.js ，启用基于 PostgreSQL 的全文检索

1. 重新 apply 新的 Delployment 文件后
```bash
$ kubectl apply -f zh-parse.yaml
$ kubectl apply -f wikijs-zh.yaml
```
2. 打开 wiki.js 管理
3. 点击搜索引擎
4. 选择 Database - PostgreSQL
5. 在 Dictionary Language 的下拉菜单里选择 chinese_zh。
6. 点击应用，并重建索引。
7. 完成配置。

## 总结

本文介绍的 wiki.js 部署方式支持中文全文检索的支持，集成了 PostgreSQL 和 zhparser 中文分词插件。

相对于标准的 wiki.js 安装部署过程，主要做了以下配置：

1. PostgreSQL 镜像采用了 abcfy2/zhparser:12-alpine ，这个镜像自带 zhparser 中文分词插件。
2. wiki.js 镜像外挂了 ConfigMap ，用于修改原 Docker 镜像里关于 PostgreSQL 搜索引擎配置的信息，以支持 chinese_zh 选项。


