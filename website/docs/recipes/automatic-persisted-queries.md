---
title: Automatic Persisted Queries
---

Unlike REST APIs that use a fixed URL to load data, GraphQL provides a rich query language that can be used to express the shape of application data requirements. This is a marvelous advancement in technology, but it comes at a cost: GraphQL query strings are often much longer than REST URLS — in some cases by many kilobytes.

In practice we've seen GraphQL query sizes ranging well above 10 KB just for the query text. This is significant overhead when compared with a simple URL of 50-100 characters. When paired with the fact that the uplink speed from the client is typically the most bandwidth-constrained part of the chain, large queries can become bottlenecks for client performance.

Automatic Persisted Queries solves this problem by sending a generated ID instead of the query text as the request.

Read more about [Automatic Persisted Queries](https://blog.apollographql.com/improve-graphql-performance-with-automatic-persisted-queries-c31d27b8e6ea).

## How it works

1. When the client makes a query, it will optimistically send a short (64-byte) cryptographic hash instead of the full query text.
2. If the backend recognizes the hash, it will retrieve the full text of the query and execute it.
3. If the backend doesn't recogize the hash, it will ask the client to send the hash and the query text to it can store them mapped together for future lookups. During this request, the backend will also fulfill the data request.

## Installation

    npm install apollo-angular --save

If you do not already have a SHA-256 based hashing function available in your application, you will need to install one separately. For example:

    npm install crypto-hash --save

This link doesn't include a SHA-256 hash function by default, to avoid forcing one as a dependency. Developers should pick the most appropriate SHA-256 function (sync or async) for their needs/environment.

## Usage

Use `createPersistedQueryLink` function and put it before `HttpLink` in the link chain.

```typescript
import {HttpLink} from 'apollo-angular/http'; // or batch link
import {createPersistedQueryLink} from 'apollo-angular/persisted-queries';
import { sha256 } from 'crypto-hash';

@NgModule({
  imports: [],
})
class AppModule {
  constructor(httpLink: HttpLink) {
    const link = createPersistedQueryLink({
      sha256
    }).concat(
      httpLink.create({uri: '/graphql'}),
    );
  }
}
```

Thats it! Now your client will start sending query signatures instead of the full text resulting in improved network performance

- [Check Options](https://www.apollographql.com/docs/react/api/link/persisted-queries/#options)
- [Read about protocol](https://www.apollographql.com/docs/react/api/link/persisted-queries/#protocol)
- [Build time generation](https://www.apollographql.com/docs/react/api/link/persisted-queries/#build-time-generation)
- [Learn more about Automatic Persisted Querys](https://www.apollographql.com/docs/react/api/link/persisted-queries/#gatsby-focus-wrapper)

## More

This library is just a simple wrapper of [`@apollo/client/link/persisted-queries`](https://github.com/apollographql/apollo-client/tree/main/src/link/persisted-queries) to make it work in Angular with `apollo-angular/http` (also with batch link). Thanks to that you can use any options, any functionality that the original package provides.
