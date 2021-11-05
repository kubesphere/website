---
title: 'Kubernetes client-go 源码分析 - Indexer & ThreadSafeStore'
tag: 'Kubernetes'
keywords: 'Kubernetes, client-go, Indexer, ThreadSafeStore'
description: 'Indexer 主要依赖于 ThreadSafeStore 实现，是 client-go 提供的一种缓存机制，通过检索本地缓存可以有效降低 apiserver 的压力，本文详细解读了 Indexer 和对应的 ThreadSafeStore 的实现。'
createTime: '2021-10-26'
author: 'Daniel Hu'
snapshot: 'https://pek3b.qingstor.com/kubesphere-community/images/kubernetes-client-go-cover.png'
---

## 概述

>  源码版本信息
>
>  - Project: kubernetes
>  - Branch: master
>  - Last commit id: d25d741c
>  - Date: 2021-09-26

自定义控制器涉及到的 client-go 组件整体工作流程，大致如下图：

![](https://pek3b.qingstor.com/kubesphere-community/images/kubernetes-client-go.png)

Indexer 主要依赖于 ThreadSafeStore 实现，是 client-go 提供的一种缓存机制，通过检索本地缓存可以有效降低 apiserver 的压力，今天我们来详细看下 Indexer 和对应的 ThreadSafeStore 的实现。

![](https://pek3b.qingstor.com/kubesphere-community/images/threadsafemap.png)

## Indexer 接口

Indexer 接口主要是在 Store 接口的基础上拓展了对象的检索功能：

- **client-go/tools/cache/index.go:35**

```go
type Indexer interface {
   Store
   Index(indexName string, obj interface{}) ([]interface{}, error) // 根据索引名和给定的对象返回符合条件的所有对象
   IndexKeys(indexName, indexedValue string) ([]string, error)     // 根据索引名和索引值返回符合条件的所有对象的 key
   ListIndexFuncValues(indexName string) []string                  // 列出索引函数计算出来的所有索引值
   ByIndex(indexName, indexedValue string) ([]interface{}, error)  // 根据索引名和索引值返回符合条件的所有对象
   GetIndexers() Indexers                     // 获取所有的 Indexers，对应 map[string]IndexFunc 类型
   AddIndexers(newIndexers Indexers) error    // 这个方法要在数据加入存储前调用，添加更多的索引方法，默认只通过 namespace 检索
}
```

Indexer 的默认实现是 cache：

```go
type cache struct {
   cacheStorage ThreadSafeStore
   keyFunc KeyFunc
}
```

cache 对应两个方法体实现完全一样的 New 函数：

```go
func NewStore(keyFunc KeyFunc) Store {
   return &cache{
      cacheStorage: NewThreadSafeStore(Indexers{}, Indices{}),
      keyFunc:      keyFunc,
   }
}

func NewIndexer(keyFunc KeyFunc, indexers Indexers) Indexer {
   return &cache{
      cacheStorage: NewThreadSafeStore(indexers, Indices{}),
      keyFunc:      keyFunc,
   }
}
```

这里涉及到两个类型：

- KeyFunc
- ThreadSafeStore

我们先看一下 Indexer 的 `Add()`、`Update()` 等方法是怎么实现的：

```go
func (c *cache) Add(obj interface{}) error {
   key, err := c.keyFunc(obj)
   if err != nil {
      return KeyError{obj, err}
   }
   c.cacheStorage.Add(key, obj)
   return nil
}

func (c *cache) Update(obj interface{}) error {
   key, err := c.keyFunc(obj)
   if err != nil {
      return KeyError{obj, err}
   }
   c.cacheStorage.Update(key, obj)
   return nil
}
```

可以看到这里的逻辑就是调用 `keyFunc()` 方法获取 key，然后调用 `cacheStorage.Xxx()` 方法完成对应增删改查过程。KeyFunc 类型是这样定义的：

```go
type KeyFunc func(obj interface{}) (string, error)
```

也就是给一个对象，返回一个字符串类型的 key。KeyFunc 的一个默认实现如下：

```go
func MetaNamespaceKeyFunc(obj interface{}) (string, error) {
	if key, ok := obj.(ExplicitKey); ok {
		return string(key), nil
	}
	meta, err := meta.Accessor(obj)
	if err != nil {
		return "", fmt.Errorf("object has no meta: %v", err)
	}
	if len(meta.GetNamespace()) > 0 {
		return meta.GetNamespace() + "/" + meta.GetName(), nil
	}
	return meta.GetName(), nil
}
```

可以看到一般情况下返回值是 `<namespace><name>` ，如果 namespace 为空则直接返回 name。类似的还有一个叫做 **IndexFunc** 的类型，定义如下：

```go
type IndexFunc func(obj interface{}) ([]string, error)
```

这是给一个对象生成 Index 用的，一个通用实现如下，直接返回对象的 namespace 字段作为 Index：

```go
func MetaNamespaceIndexFunc(obj interface{}) ([]string, error) {
   meta, err := meta.Accessor(obj)
   if err != nil {
      return []string{""}, fmt.Errorf("object has no meta: %v", err)
   }
   return []string{meta.GetNamespace()}, nil
}
```

下面我们直接来看 cacheStorage 是如果实现增删改查的。

## ThreadSafeStore

ThreadSafeStore 是 Indexer 的核心逻辑所在，Indexer 的多数方法是直接调用内部 cacheStorage 属性的方法实现的，同样先看接口定义：

- **client-go/tools/cache/thread_safe_store.go:41**

```go
type ThreadSafeStore interface {
   Add(key string, obj interface{})
   Update(key string, obj interface{})
   Delete(key string)
   Get(key string) (item interface{}, exists bool)
   List() []interface{}
   ListKeys() []string
   Replace(map[string]interface{}, string)
   Index(indexName string, obj interface{}) ([]interface{}, error)
   IndexKeys(indexName, indexKey string) ([]string, error)
   ListIndexFuncValues(name string) []string
   ByIndex(indexName, indexKey string) ([]interface{}, error)
   GetIndexers() Indexers
   AddIndexers(newIndexers Indexers) error
   Resync() error // 过期了，没有具体代码逻辑
}
```

对应实现：

```go
type threadSafeMap struct {
   lock  sync.RWMutex
   items map[string]interface{}
   indexers Indexers
   indices Indices
}
```

这里的 Indexers 和 Indices 是：

```go
type Index map[string]sets.String
type Indexers map[string]IndexFunc
type Indices map[string]Index
```

对照图片理解一下这几个字段的关系：Indexers 里存的是 Index 函数 map，一个典型的实现是字符串 namespace 作为 key，IndexFunc 类型的实现 `MetaNamespaceIndexFunc` 函数作为 value，也就是我们希望通过 namespace 来检索时，通过 Indexers 可以拿到对应的计算 Index 的函数，接着拿着这个函数，把对象穿进去，就可以计算出这个对象对应的 key，在这里也就是具体的 namespace 值，比如 default、kube-system 这种。然后在 Indices 里存的也是一个 map，key 是上面计算出来的 default 这种 namespace 值，value 是一个 set，而 set 表示的是这个 default namespace 下的一些具体 pod 的 `<namespace>/<name>` 这类字符串。最后拿着这种 key，就可以在 items 里检索到对应的对象了。

![](https://pek3b.qingstor.com/kubesphere-community/images/threadsafemap.png)

## threadSafeMap.Xxx()

比如 `Add()` 方法代码如下：

```go
func (c *threadSafeMap) Add(key string, obj interface{}) {
   c.lock.Lock()
   defer c.lock.Unlock()
   oldObject := c.items[key] // c.items 是 map[string]interface{} 类型
   c.items[key] = obj // 在 items map 里添加这个对象
   c.updateIndices(oldObject, obj, key) // 下面分析
}
```
可以看到更复杂的逻辑在 updateIndices 方法里，我们继续来看：

- **client-go/tools/cache/thread_safe_store.go:256**

```go
func (c *threadSafeMap) updateIndices(oldObj interface{}, newObj interface{}, key string) {
   // 添加场景这里是 nil，如果是更新，就需要删除旧对象的索引了
   if oldObj != nil {
      c.deleteFromIndices(oldObj, key) // 删除操作后面具体看
   }
  for name, indexFunc := range c.indexers { // 从 Indexers 里拿到索引函数，比如 "namespace":MetaNamespaceIndexFunc
      indexValues, err := indexFunc(newObj) // 通过 MetaNamespaceIndexFunc 计算得到 namespace，比如 "default"
      if err != nil {
         panic(fmt.Errorf("unable to calculate an index entry for key %q on index %q: %v", key, name, err))
      }
      index := c.indices[name] // 拿到一个 Index，对应类型 map[string]sets.String
      if index == nil {
         index = Index{}
         c.indices[name] = index // 如果 map 不存在则初始化一个
      }

      for _, indexValue := range indexValues { // "default"
         set := index[indexValue] // 检索 "default" 下的 set，对应一个集合，多个 pod 信息
         if set == nil {
            set = sets.String{}
            index[indexValue] = set // 如果为空则初始化一个
         }
         set.Insert(key) // key 也就是类似 "default/pod_1" 这样的字符串，保存到 set 里，也就完成了 key + obj 的 Add 过程
      }
   }
}
```

上面还提到了一个 *deleteFromIndices* 方法，前半段和上面逻辑上类似的，最后拿到 set 后不同于上面的 Insert 过程，这里调用了一个 Delete。

```go
func (c *threadSafeMap) deleteFromIndices(obj interface{}, key string) {
   for name, indexFunc := range c.indexers {
      indexValues, err := indexFunc(obj)
      if err != nil {
         panic(fmt.Errorf("unable to calculate an index entry for key %q on index %q: %v", key, name, err))
      }

      index := c.indices[name]
      if index == nil {
         continue
      }
      for _, indexValue := range indexValues {
         set := index[indexValue]
         if set != nil {
            set.Delete(key) // set 中删除这个 key
            if len(set) == 0 {
               delete(index, indexValue)
            }
         }
      }
   }
}
```

## Index() 等实现

最后看几个具体方法等实现

### Index() 方法

来看一下 `Index()` 方法的实现，`Index()` 方法的作用是给定一个 obj 和 indexName，比如 pod1和 "namespace"，然后返回 pod1 所在 namespace 下的所有 pod。

- **client-go/tools/cache/thread_safe_store.go:141**

```go
func (c *threadSafeMap) Index(indexName string, obj interface{}) ([]interface{}, error) {
   c.lock.RLock()
   defer c.lock.RUnlock()

   indexFunc := c.indexers[indexName] // 提取索引函数，比如通过 "namespace" 提取到 MetaNamespaceIndexFunc
   if indexFunc == nil {
      return nil, fmt.Errorf("Index with name %s does not exist", indexName)
   }

   indexedValues, err := indexFunc(obj) // 对象丢进去拿到索引值，比如 "default"
   if err != nil {
      return nil, err
   }
   index := c.indices[indexName] // indexName 例如 "namespace"，这里可以查到 Index

   var storeKeySet sets.String
   if len(indexedValues) == 1 {
      // 多数情况对应索引值为1到场景，比如用 namespace 时，值就是唯一的
      storeKeySet = index[indexedValues[0]]
   } else {
      // 对应不为1场景
      storeKeySet = sets.String{}
      for _, indexedValue := range indexedValues {
         for key := range index[indexedValue] {
            storeKeySet.Insert(key)
         }
      }
   }

   list := make([]interface{}, 0, storeKeySet.Len())
   // storeKey 也就是 "default/pod_1" 这种字符串，通过其就可以到 items map 里提取需要的 obj 了
   for storeKey := range storeKeySet {
      list = append(list, c.items[storeKey])
   }
   return list, nil
}
```

### `ByIndex()` 方法

相比 `Index()`，这个函数要简单的多，直接传递 indexedValue，也就不需要通过 obj 去计算 key 了，例如 indexName == namespace & indexValue == default 就是直接检索 default 下的资源对象。

```go
func (c *threadSafeMap) ByIndex(indexName, indexedValue string) ([]interface{}, error) {
   c.lock.RLock()
   defer c.lock.RUnlock()

   indexFunc := c.indexers[indexName]
   if indexFunc == nil {
      return nil, fmt.Errorf("Index with name %s does not exist", indexName)
   }

   index := c.indices[indexName]

   set := index[indexedValue]
   list := make([]interface{}, 0, set.Len())
   for key := range set {
      list = append(list, c.items[key])
   }

   return list, nil
}
```

### IndexKeys() 方法

和上面返回 obj 列表不同，这里只返回 key 列表，就是 []string{"default/pod_1"} 这种数据

```go
func (c *threadSafeMap) IndexKeys(indexName, indexedValue string) ([]string, error) {
   c.lock.RLock()
   defer c.lock.RUnlock()

   indexFunc := c.indexers[indexName]
   if indexFunc == nil {
      return nil, fmt.Errorf("Index with name %s does not exist", indexName)
   }

   index := c.indices[indexName]

   set := index[indexedValue]
   return set.List(), nil
}
```

### Replace() 方法

`Replace()` 的实现简单粗暴，给一个新 items map，直接替换到 threadSafeMap.items 中，然后重建索引。

```go
func (c *threadSafeMap) Replace(items map[string]interface{}, resourceVersion string) {
   c.lock.Lock()
   defer c.lock.Unlock()
   c.items = items

   // rebuild any index
   c.indices = Indices{}
   for key, item := range c.items {
      c.updateIndices(nil, item, key)
   }
}
```

