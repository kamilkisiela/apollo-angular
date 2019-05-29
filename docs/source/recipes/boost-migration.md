---
title: Apollo Angular Boost migration
description: Learn how to set up Apollo Angular manually without Apollo Angular Boost
---

Apollo Angular Boost is a great way to get started with Apollo Angular quickly, but there are some advanced features it doesn't support out of the box. If you'd like to use subscriptions, swap out the Apollo cache, or add an existing Apollo Link to your network stack that isn't already included, you will have to set Apollo Angular up manually.

We're working on an eject feature (maybe Angular's schematic) for Apollo Angular Boost that will make migration easier in the future, but for now, let's walk through how to migrate off of Apollo Boost.

## Basic migration

If you're not using any configuration options on Apollo Angular Boost, migration should be relatively simple. All you will have to change is the file where you initialize Apollo.

### Before

Here's what client initialization looks like with Apollo Angular Boost:

```ts
import { HttpClientModule } from "@angular/common/http";
import { ApolloBoostModule, ApolloBoost } from "apollo-angular-boost";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloBoostModule
  ],
  ...
})
export class AppModule {
  constructor(boost: ApolloBoost) {
    boost.create({
      uri: "https://o5x5jzoo7z.sse.codesandbox.io/graphql"
    })
  }
}
```

### After

To create a basic client with the same defaults as Apollo Angular Boost, first you need to install some packages:

```bash
npm install --save \
apollo-angular \
apollo-angular-link-http \
apollo-client \
apollo-cache-inmemory \
graphql-tag \
graphql
```

- apollo-client - core functionality for Apollo ecosystem
- apollo-angular - Angular integration
- apollo-cache-inmemory - basic, most popular cache
- apollo-angular-link-http - allows to make requests through Angular's HttpClient
- graphql-tag - a small utility to parse strings into GraphQL Documents
- graphql - base functionality for everything

To complete the process, you'll need to manually attach your `cache` and `link` to the client:

```ts
import {ApolloModule, Apollo} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  ...
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
          if (graphQLErrors)
            graphQLErrors.map(({message, locations, path}) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        httpLink.create({
          uri: 'https://o5x5jzoo7z.sse.codesandbox.io/graphql',
          withCredentials: true,
        }),
      ]),
      cache: new InMemoryCache(),
    });
  }
}
```

The `InMemoryCache` is our recommended cache implementation for Apollo Client. The `HttpLink` is an Apollo Link that sends HTTP requests through Angular's HttpClient. Your network stack can be made up of one or more links, which you can chain together to create a customizable network stack. Learn more in our [network layer](/basics/network-layer/) guide or the [Apollo Link](https://www.apollographql.com/docs/link/) docs.

## Advanced migration

If you are using configuration options on Apollo Angular Boost, your migration path will vary depending on which ones you use.

Type your configuration options object as ApolloClientOptions so you can use IntelliSense features on your editor.
```ts
export function createApollo(httpLink: HttpLink) {
  return {
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        ...
      }),
      httpLink.create({
        uri: aux.env.graphql
      }),
    ]),
    resolvers,
    typeDefs
  } as ApolloClientOptions<any>;
}
```

We will try to step by step eject each configuration.

### uri and HttpOptions

Basically, you merge `uri` property with an object passed as `httpOptions`:

```ts
{
  uri: 'http://example.api',
  httpOptions: {
    withCredentials: true
  }
}
```

Become:

```ts
{
  uri: 'http://example.api',
  withCredentials: true
}
```

This one, you put to `HttpLink.create()`.

### clientState

You can pass all the proprieties of the object to `apollo-link-state` by also including ApolloCache.
```ts
{
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      ...
    ]),
    resolvers,
    typeDefs
  }
```

### onError

Similar as in clientState, you use the config in `apollo-link-error`.

### cacheRedirects

Whatever you have here, just pass it to `apollo-cache-inmemory`.

## Summary

That's it! If something is hard to think about or understand feel free to open an issue, we will help you and by doing this you will help others!
