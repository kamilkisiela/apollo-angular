# HTTP Link

[![npm version](https://badge.fury.io/js/apollo-angular-link-http-batch.svg)](https://badge.fury.io/js/apollo-angular-link-http-batch)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollodata.com/#slack)

## Purpose

An Apollo Link to combine multiple GraphQL operations into single HTTP request.

## Installation

`npm install apollo-angular-link-http-batch --save`

## Usage

```ts
import {
  HttpBatchLinkModule,
  HttpBatchLink,
} from 'apollo-angular-link-http-batch';

@NgModule({
  imports: [HttpBatchLinkModule],
})
class AppModule {
  constructor(httpLink: HttpBatchLink) {
    const link = httpLink.create({uri: '/graphql'});
  }
}
```

## HttpClient

The HTTP Link relies on having `HttpClient` (from `@angular/common/http`)
present in your application.

## Options

Accepts the same options as `apollo-angular-link-http`.

## BatchOptions

The batching options indicate how operations are batched together.

| name          | value    | default | required |
| ------------- | -------- | ------- | -------- |
| batchInterval | number   | 10      | false    |
| batchMax      | number   | 10      | false    |
| batchKey      | Function | -       | false    |

* `batchInterval` - the maximum time a batch will wait before automatically being sent over the network
* `batchMax` - the size of batches
* `batchKey` a function that accepts an operation and returns a string key, which uniquely names the batch the operation belongs to, defaults to returning the same string.

> NOTICE: `batchKey` by default batches together requests with the same uri and the same options. Since options from an operation's context overwrites those from a link you could end up with few differents keys and what it means, few separate requests.

## Context

Works in the same way as in `apollo-angular-link-http`.

To skip batching you can set `skipBatching: true` in operation's context.

> NOTICE: `skipBatching` works only with the default `batchKey`. To create custom one you should check if `skipBatching` is set in context and generate a random `batchKey` for that operation.
