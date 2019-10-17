# HTTP Link

[![npm version](https://badge.fury.io/js/apollo-angular-link-http.svg)](https://badge.fury.io/js/apollo-angular-link-http)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](https://www.apollographql.com/slack)

## Purpose

An Apollo Link to allow sending a single http request per operation.

## Installation

`npm install apollo-angular-link-http --save`

## Usage

```ts
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';

@NgModule({
  imports: [HttpLinkModule],
})
class AppModule {
  constructor(httpLink: HttpLink) {
    const link = httpLink.create({uri: '/graphql'});
  }
}
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

```js
import {HttpLinkModule, HttpLink} from 'apollo-link-http';
import {ApolloModule, Apollo} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpClientModule} from '@angular/common/http';

@NgModules({
  imports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
class AppModule {
  constructor(apollo: Apollo, httpLink: httpLink) {
    apollo.create({
      link: httpLink.create({uri: '/graphql'}),
      cache: new InMemoryCache(),
    });
  }
}

// a query with apollo-angular
apollo.query({
  query: MY_QUERY,
  context: {
    // example of setting the headers with context per operation
    headers: new HttpHeaders().set('X-Custom-Header', 'custom-value'),
  },
});
```

### Uri as function

```ts
@NgModules({
  imports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
class AppModule {
  constructor(apollo: Apollo, httpLink: httpLink) {
    apollo.create({
      link: httpLink.create({
        uri(operation) {
          return operation.operationName === 'login' ? '/auth' : '/graphq';
        },
      }),
      cache: new InMemoryCache(),
    });
  }
}
```

### File upload

In order to upload a file, you need to turn on `useMultipart` flag:

```ts
apollo.query({
  query: MY_QUERY,
  context: {
    useMultipart: true
  },
});
```

### Middleware

```ts
import {ApolloLink} from 'apollo-link';
import {HttpLink} from 'apollo-angular-link-http';

class AppModule {
  constructor(httpLink: HttpLink) {
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
  }
}
```

### Afterware (error)

```js
import {ApolloLink} from 'apollo-link';
import {HttpLink} from 'apollo-angular-link-http';
import {onError} from 'apollo-link-error';

import {Auth} from './auth.service';

class AppModule {
  constructor(httpLink: HttpLink, auth: Auth) {
    const http = httpLink.create({uri: '/graphql'});
    const error = onError(({networkError}) => {
      if (networkError.status === 401) {
        auth.logout();
      }
    });

    const link = error.concat(http);
  }
}
```
