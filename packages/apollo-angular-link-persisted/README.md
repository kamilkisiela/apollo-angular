# Automatic Persisted Queries

[![npm version](https://badge.fury.io/js/apollo-angular-link-persisted.svg)](https://badge.fury.io/js/apollo-angular-link-persisted)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollodata.com/#slack)

## Purpose

An Apollo Link that allows to use Automatic Persisted Queries with `apollo-angular-link-http`.

Read more about [Automatic Persisted Queries](https://blog.apollographql.com/improve-graphql-performance-with-automatic-persisted-queries-c31d27b8e6ea).

## How it works

1.  When the client makes a query, it will optimistically send a short (64-byte) cryptographic hash instead of the full query text.
2.  If the backend recognizes the hash, it will retrieve the full text of the query and execute it.
3.  If the backend doesn't recogize the hash, it will ask the client to send the hash and the query text to it can store them mapped together for future lookups. During this request, the backend will also fulfill the data request.

## Installation

`npm install apollo-angular-link-persisted --save`

## Usage

Use `createPersistedQueryLink` function and put it before `HttpLink` in the link chain.

```ts
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http'; // or batch link
import {createPersistedQueryLink} from 'apollo-angular-link-persisted';

@NgModule({
  imports: [HttpLinkModule],
})
class AppModule {
  constructor(httpLink: HttpLink) {
    const link = createPersistedQueryLink().concat(
      httpLink.create({uri: '/graphql'}),
    );
  }
}
```

## More

This library is just a simple wrapper of [`apollo-link-persisted-queries`](https://github.com/apollographql/apollo-link-persisted-queries) to make it work in Angular with `apollo-angular-link-http` (also with batch link). Thanks to that you can use any options, any functionality that the original package provides.

You're curious how to use it with Apollo Engine? What are the available options and how Automatic Persisted Queries works?

Visit [`apollo-link-persisted-queries`](https://github.com/apollographql/apollo-link-persisted-queries) repository!
