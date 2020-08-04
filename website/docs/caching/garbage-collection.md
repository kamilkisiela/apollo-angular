---
title: Garbage collection and cache eviction
sidebar_title: Garbage collection
---

Apollo Client 3 enables you to selectively remove cached data that is no longer useful. The default garbage collection strategy of the `gc` method is suitable for most applications, but the `evict` method provides more fine-grained control for applications that require it.

> You call these methods directly on the `InMemoryCache` object, not on the `ApolloClient` object.

Please read the ["Garbage collection and cache eviction"](https://www.apollographql.com/docs/react/caching/garbage-collection/) chapter on Apollo Client documentation.
