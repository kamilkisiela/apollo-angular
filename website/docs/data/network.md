---
title: Network layer
description: How to interact with your GraphQL API
---

Apollo Angular comes with two kinds of network layer based on Angular's `HttpClient`.

# Http Link

An Apollo Link to allow sending a single http request per operation. It's based on Angular's `HttpClient`.

Why not `@apollo/client/link/http`? You get SSR for free, ability to use Http Interceptors and easier testing.

## Usage

```typescript
import {HttpLink} from 'apollo-angular/http';
import {APOLLO_OPTIONS} from 'apollo-angular';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          // other options
          link: httpLink.create({uri: '/graphql'}),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

## HttpClient

The HTTP Link relies on having `HttpClient` (from `@angular/common/http`)
present in your application.

## Options

HTTP Link takes an object with some options on it to customize the behavior of
the link. If your server supports it, the HTTP link can also send over metadata
about the request in the extensions field. To enable this, pass
`includeExtensions` as true. If you would like to use persisted queries or just
not to send a query, disable `includeQuery`.

| name              | value             | default    | required |
| ----------------- | ----------------- | ---------- | -------- |
| uri               | string / function | `/graphql` | false    |
| includeExtensions | boolean           | `false`    | false    |
| includeQuery      | boolean           | `true`     | false    |
| headers           | HttpHeaders       | `none`     | false    |
| withCredentials   | boolean           | `none`     | false    |
| method            | string            | `POST`     | false    |

## Context

The HTTP Link uses the `headers` field on the context to allow passing headers
to the HTTP request. It also supports the `withCredentials` field for defining
credentials policy for request. These options will override the same key if
passed when creating the the link. If some setting is different than the one in
Options, this one will be used.

| name              | value       | default         | required |
| ----------------- | ----------- | --------------- | -------- |
| uri               | string      | `as in options` | false    |
| includeExtensions | boolean     | `as in options` | false    |
| includeQuery      | boolean     | `as in options` | false    |
| headers           | HttpHeaders | none            | false    |
| withCredentials   | boolean     | `as in options` | false    |
| method            | string      | `as in options` | false    |
| useMultipart      | boolean     | `as in options` | false    |

```typescript
import {HttpLink} from 'apollo-link/http';
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import {HttpClientModule} from '@angular/common/http';

@NgModules({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          link: httpLink.create({uri: '/graphql'}),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}

// a query with apollo-angular
// somewhere in Component
apollo.query({
  query: MY_QUERY,
  context: {
    // example of setting the headers with context per operation
    headers: new HttpHeaders().set('X-Custom-Header', 'custom-value'),
  },
});
```

### Uri as function

```typescript
@NgModules({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          link: httpLink.create({
            uri(operation) {
              return operation.operationName === 'login' ? '/auth' : '/graphq';
            },
          }),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

### File upload

In order to upload a file, you need to turn on `useMultipart` flag:

```typescript
apollo.query({
  query: MY_QUERY,
  context: {
    useMultipart: true,
  },
});
```

### Middleware

```typescript
import {ApolloLink} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';

@NgModules({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const http = httpLink.create({uri: '/graphql'});
        const middleware = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: new HttpHeaders().set(
              'Authorization',
              localStorage.getItem('token') || null,
            ),
          });
          return forward(operation);
        });

        const link = middleware.concat(http);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

### Afterware (error)

```typescript
import {ApolloLink} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {onError} from '@apollo/client/link/error';

import {Auth} from './auth.service';

@NgModules({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        const http = httpLink.create({uri: '/graphql'});
        const error = onError(({networkError}) => {
          if (networkError.status === 401) {
            auth.logout();
          }
        });

        const link = error.concat(http);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

# Http Batching Link

An Apollo Link to combine multiple GraphQL operations into single HTTP request.

## Usage

```typescript
import {HttpBatchLink} from 'apollo-angular/http';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpBatchLink) {
        return {
          // other options
          link: httpLink.create({uri: '/graphql'}),
        };
      },
      deps: [HttpBatchLink],
    },
  ],
})
class AppModule {}
```

## HttpClient

The HTTP Link relies on having `HttpClient` (from `@angular/common/http`)
present in your application.

## Options

Accepts the same options as `HttpLink`.

## BatchOptions

The batching options indicate how operations are batched together.

| name          | value    | default | required |
| ------------- | -------- | ------- | -------- |
| batchInterval | number   | 10      | false    |
| batchMax      | number   | 10      | false    |
| batchKey      | Function | -       | false    |

- `batchInterval` - the maximum time a batch will wait before automatically being sent over the network
- `batchMax` - the size of batches
- `batchKey` a function that accepts an operation and returns a string key, which uniquely names the batch the operation belongs to, defaults to returning the same string.

> NOTICE: `batchKey` by default batches together requests with the same uri and the same options. Since options from an operation's context overwrites those from a link you could end up with few differents keys and what it means, few separate requests.

## Context

Works in the same way as in `HttpLink`.

To skip batching you can set `skipBatching: true` in operation's context.

> NOTICE: `skipBatching` works only with the default `batchKey`. To create custom one you should check if `skipBatching` is set in context and generate a random `batchKey` for that operation.
