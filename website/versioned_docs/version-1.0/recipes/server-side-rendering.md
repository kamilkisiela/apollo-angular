---
title: Server Side Rendering
---

Apollo provides two techniques to allow your applications to load quickly, avoiding unnecessary delays to users:

- Store rehydration, which allows your initial set of queries to return data immediately without a server roundtrip.
- Server side rendering, which renders the initial HTML view on the server before sending it to the client.

You can use one or both of these techniques to provide a better user experience.

#### Creating a client

Before we dive more into SSR, let's create an example to work on.

```ts
// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

@NgModule({
  imports: [
    // ...
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  // ...
})
class AppModule {
  cache: InMemoryCache;

  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    this.cache = new InMemoryCache();

    apollo.create({
      link: httpLink.create({ uri: '/graphql' }),
      cache: this.cache,
    });
  }
}
```

## Server-side rendering

You can render your entire Angular-based Apollo application on a Node server the same way as you would normally do with an Angular app.

No changes are required to client queries to support this, so your Apollo-based Angular UI should support SSR out of the box.

> SSR works out of the box when using `HttpLink` from `apollo-angular-link-http` because it uses Angular's `HttpClient` internally.
> This would't be that easy with `apollo-link-http`. That non-angular Link uses Fetch API which would have to schedule a macroTask (Zone.js) so Angular could wait for the request to finish.

## Store rehydration

For applications that can perform some queries on the server prior to rendering the UI on the client, Apollo allows for setting the initial state of data. This is sometimes called rehydration, since the data is "dehydrated" when it is serialized and included in the initial HTML payload.

For example, a typical approach is to use `TransferState` and `BrowserTransferStateModule` so you can then rehydrate the client using the initial state passed from the server:

```ts
// Angular
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule, TransferState, makeStateKey } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
  imports: [
    // ...
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  // ...
})
class AppModule {
  cache: InMemoryCache;

  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    private readonly transferState: TransferState,
  ) {
    this.cache = new InMemoryCache();

    apollo.create({
      link: httpLink.create({ uri: '/graphql' }),
      cache: this.cache,
    });

    const isBrowser = this.transferState.hasKey<any>(STATE_KEY);

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  onServer() {
    this.transferState.onSerialize(STATE_KEY, () => {
      return this.cache.extract();
    });
  }

  onBrowser() {
    const state = this.transferState.get<any>(STATE_KEY, null);

    this.cache.restore(state);
  }
}
```

Adding store rehydration to your app is straightforward since Angular itself has a mechanism to transfer data from server to client.

Let's explain step by step how we implemented store rehydration in the example.

First, we imported `BrowserTransferStateModule` from `@angular/platform-browser`:

```ts
import { BrowserTransferStateModule } from '@angular/platform-browser';

@NgModule({ ... })
class AppModule {}
```

Then we created a `STATE_KEY` which allows to attach data to it:

```ts
import { makeStateKey } from '@angular/platform-browser';

const STATE_KEY = makeStateKey<any>('apollo.state');
```

Now we can implement some logic by using `TransferState`:

```ts
import { TransferState } from '@angular/platform-browser';

@NgModule({ ... })
class AppModule {
  // ...
  constructor(
    // ...
    private readonly transferState: TransferState
  ) {
    // ...

    const isBrowser = this.transferState.hasKey<any>(STATE_KEY);

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }
}
```

About `isBrowser`, `this.transferState.hasKey<any>(STATE_KEY)` will return a value only if it runs within a browser, on the client side.

Here is an interesting part, the actual store rehydration.

```ts
@NgModule({ ... })
class AppModule {
  onServer() {
    this.transferState.onSerialize(STATE_KEY, () =>
      this.cache.extract()
    );
  }

  onBrowser() {
    const state = this.transferState.get<any>(STATE_KEY, null);

    this.cache.restore(state);
  }
}
```

In `onServer` we extract data from cache when TransferState says it is ready to save and serialize data.
In `OnBrowser` we do opposite thing, we receive transfered data to restore cache.

Super easy and clean!

With all this when the client runs the first set of queries, the data will be returned instantly because it is already in the store!

If you are using `forceFetch` on some of the initial queries, you can pass the `ssrForceFetchDelay` option to skip force fetching during initialization, so that even those queries run using the cache:

```ts
// to use it create two Apollo Clients
const cache = new InMemoryCache();

// one for client side
apollo.create({
  cache: cache.restore(window.__APOLLO_STATE__),
  link,
  ssrForceFetchDelay: 100,
});

// and second one for server
apollo.create({
  cache,
  link,
});
```

## Http Caching

As you know, `HttpLink` from `apollo-angular-link-http` package uses Angular's `HttpClient` to make requests. Thanks to that and `@nguniversal/common` it is super easy to make SSR working without even writing a single line of code.

`TransferHttpCacheModule`, which is a part of `@nguniversal/common`, intercepts `HttpClient` requests on the server and store the response in the `TransferState` key-value store. This is transferred to the client, which then uses it to respond to the same `HttpClient` requests on the client.

Here you can see how simple is that:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// SSR
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

@NgModule({
  imports: [
    // ...
    BrowserModule,
    TransferHttpCacheModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  // ...
})
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: '/graphql' }),
      cache: new InMemoryCache(),
    });
  }
}
```

## Best Practices

You saw how to use Server-Side Rendering and Store Rehydration in your application, but you will need to be a little careful in how you create Apollo on the server to ensure everything works there as well:

1. When [creating Apollo](../basics/setup.md) (`Apollo.create`) on the server, you'll need to set up your HttpLink to connect to the API server correctly. This might look different to how you do it on the client, since you'll probably have to use an absolute URL to the server if you were using a relative URL on the client.

1. Since you only want to fetch each query result once, pass the `ssrMode: true` option to the `Apollo.create` to avoid repeated force-fetching.

1. You need to ensure that you create a new client or store instance for each request, rather than re-using the same client for multiple requests. Otherwise the UI will be getting stale data and you'll have problems with [authentication](./authentication.md).

## Example

You can [take a look](https://github.com/kamilkisiela/apollo-angular-ssr) on a simple example with the implementation we talked about.
