---
title: Migration Guide
description: Updating your app to Apollo Client 2.0 and Angular Apollo 1.0
---

<h2 id="why" title="Why the 2.0">Why the 2.0</h2>

#### Apollo Client

The 2.0 version of ApolloClient provides a more customizable experience with GraphQL. It prioritizes features like custom execution chains (using Apollo Link) and custom stores while providing powerful defaults. It is an overall minor change to the API so you shouldn't have to change very much code in your current app at all!

#### Apollo Angular

The 1.0 version of Angular integration provides a better experience of using it in Angular. Thanks to changes to the API and the new way we create Apollo it is now possible to use it with anything from Angular's Dependency Injection.

<h3 id="goals" title="Goals">Goals</h3>

#### Apollo Client

The `2.*` version of Apollo Client builds on the original principles of the project. For reference, those goals are:

1. **Incrementally adoptable**, so that you can drop it into an existing JavaScript app and start using GraphQL for just part of your UI.
1. **Universally compatible**, so that Apollo works with any build setup, any GraphQL server, and any GraphQL schema.
1. **Simple to get started with**, you can start loading data right away and learn about advanced features later.
1. **Inspectable and understandable**, so that you can have great developer tools to understand exactly what is happening in your app.
1. **Built for interactive apps**, so your users can make changes and see them reflected in the UI immediately.
1. **Small and flexible**, so you don't get stuff you don't need
1. **Community driven**, Apollo is driven by the community and serves a variety of use cases. Everything is planned and developed in the open.

Based on feedback from a wide variety of users, the `2.*` version doubles down on being incrementally adoptable and flexible by allowing much stronger extension points. Customization of the client (i.e. data store, execution chain, etc) is a primary feature in the revised API. This version also take steps to reduce the overall size of the default client by 200% and provide the foundations for Apollo powering more of the application experience from development to production with client side state management.

The goal of the `2.0` launch is not to provide all of the new features that have been asked to be built in. Instead, the 2.0 makes a few key changes to both management of the code base (lerna / small modules) and the changes necessary to support custom stores and links **fully**. Apollo Client 2.0 is the jumping off point for user-land driven innovation (custom stores, custom links) and internal refactor (moving query manager into links, breaking apart the store / links into packages, etc).

#### Apollo Angular

The goal of the `1.0` launch is to improve the experience of using it in Angular.


<h2 id="install" title="Installation">Installation</h2>

One of the largest changes with the new version is the breaking apart of the monolith `apollo-client` package into a few small, but isolated modules. This gives way more flexibility, but does require more packages to install.

To get started with the 2.0, you will change your imports from either `apollo-angular`, or just `apollo-client` to use the new packages. A typical upgrade looks like this:

**Before**

```ts
import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
```

**After**

```ts
import { ApolloClient } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
```

<h3 id="basic" title="Basic updates">Basic updates</h3>

A simple usage of Apollo Client upgrading to the 2.0 would look like this:

**Before**

```ts
import { NgModule } from '@angular/core';
import { ApolloModule } from 'apollo-angular';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:3000' }),
});

function provideClient() {
  return client;
}

@NgModule({
  imports: [
    // ... other modules
    ApolloModule.forRoot(provideClient)
  ]
})
class AppModule {}
```

**After**

```js
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';

@NgModule({
  imports: [
    // ... other modules
    HttpClientModule,
    HttpLinkModule,
    ApolloModule
  ]
})
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: 'http://localhost:3000' }),
      cache: new InMemoryCache()
    });
  }
}
```

This is the **most important part** of migrating to 2.0.
Two things to be explained.

#### Apollo.create

We decided to move creation of Apollo Client closer to Angular Framework.
You no longer provide an instance of `ApolloClient` to `ApolloModule`.
Now it is being created when application bootstraps.

Thanks to the new way of configuring Apollo, it gains the access to Angular's Dependency Injection.

Just take the same options as you would normally use in ApolloClient's constructor and use them in `Apollo.create` method.

#### HttpLink

Apollo Client 2.0 by introducing Links has opened up the way to decide how to request data.
While designing 1.0 version of Apollo Angular we took advantage of both, ApolloLink library and new approach of configuring Apollo, and created a Link to fetch data through Angular's `HttpClient`.

Why we recommend it?

Besides many benefits of using `HttpClient` (i.e. interceptors) you get the Server-Side Rendering for free. It also allows to use it in `NativeScript`, without any additional work.

Why is that possible?

By using `HttpClient` in `HttpLink` and thanks to DI, the HttpLink does not care about which NgModule provides `HttpClient` to an application since the API of `HttpClient` is always the same.


<h3 id="full" title="Custom Configuration">Custom configuration</h3>

Since everything was baked into the 1.0, custom configuration of the parts, like the network interface or cache, all were done on the constructor. With the 2.0, this is broken up slightly, and uneccessary configurations were removed. The following code snippet shows every possible option with the previous version and how to use it with the 2.0:

**Before**

```ts
import ApolloClient, { createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://api.example.com/'
  }),
  initialState: window.__APOLLO_CLIENT__,
  dataIdFromObject: () => // custom idGetter,
  ssrMode: true,
  ssrForceFetchDelay: 100,
  addTypename: true,
  customResolvers: {},
  connectToDevTools: true,
  queryDeduplication: true,
  fragmentMatcher: new FragmentMatcher()
})
```

**After**

```ts
import { Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-angular-link-http';

class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const link = httpLink.create({
      uri: 'http://api.example.com/'
    });

    const cache = new InMemoryCache({
      dataIdFromObject: () => // custom idGetter,
      addTypename: true,
      cacheResolvers: {},
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: yourData
      }),
    });

    apollo.create({
      link,
      // use restore on the cache instead of initialState
      cache: cache.restore(window.__APOLLO_CLIENT__),
      ssrMode: true,
      ssrForceFetchDelay: 100,
      connectToDevTools: true,
      queryDeduplication: true,
    });
  }
}
```

*Note* If you were using `customResolvers`, the name of that has been changed to be `cacheResolvers` to be more descriptive of what it does. `customResolvers` will still be supported throughout the 2.0 though to be backwards compatible and ease the upgrade path.

<h2 id="ssr" title="Cache extraction">Cache extraction</h2>

If you have previously used `getInitialState` for SSR, that API has been moved to the cache itself instead of on the client. You can read more about the recipe for server side rendering [here](./recipes/server-side-rendering.html). The upgrade path looks like this:

**Before**

```ts
import { ApolloClient } from 'apollo-client';

const client = new ApolloClient();

// fetch queries

const state = client.getInitialState();
```

**After**

```ts
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-angular-link-http';

class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const link = httpLink.create();
    const cache = new InMemoryCache();

    apollo.create({
      link,
      cache
    });

    const state = cache.extract();
  }
}
```

<h2 id="middleware" title="Network Middleware">Network Middleware and Afterware</h2>

If you previously used `use` or `useAfter` on the networkInterface from the 1.0 of Apollo Client, you will need to update to use Apollo Links as the new way to handle `*wares` in the 2.0. Apollo Link provides a lot more power for `*ware` features and more information is available [here](/docs/link). A few examples of migrating custom `*ware` methods to Apollo Links are shown below:

#### Middleware

**Before**

```ts
import { createNetworkInterface } from 'apollo-client';

const networkInterface = createNetworkInterface({ uri: '/graphql' });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    req.options.headers['authorization'] = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    next();
  }
}]);
```

**After**

```ts
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-angular-link-http';

class AppModule {
  constructor(httpLink: HttpLink) {
    const http = httpLink.create({ uri: '/graphql' });

    const middleware = setContext(() => ({
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token') || null)
    }));

    // use with Apollo.create()
    const link = middleware.concat(http);
  }
}
```

#### Afterware (error handling)

**Before**

```ts
import { createNetworkInterface } from 'apollo-client';
import { logout } from './logout';

const networkInterface = createNetworkInterface({ uri: '/graphql' });

networkInterface.useAfter([{
  applyAfterware({ response }, next) {
    if (response.status === 401) {
      logout();
    }
    next();
  }
}]);
```

**After**

```ts
import { HttpLink } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error';

import { logout } from './logout';

class AppModule {
  constructor(httpLink: HttpLink) {
    const http = httpLink.create({ uri: '/graphql' });

    const error = onError(({ networkError, graphQLErrors }) => {
      if (networkError.statusCode === 401) {
        logout();
      }
    })

    // use with Apollo.create()
    const link = error.concat(http);
  }
}
```

#### Afterware (data manipulation)

**Before**

```ts
import { createNetworkInterface } from 'apollo-client';

const networkInterface = createNetworkInterface({ uri: '/graphql' });

networkInterface.useAfter([{
  applyAfterware({ response }, next) {
    if (response.data.user.lastLoginDate) {
      response.data.user.lastLoginDate = new Date(response.data.user.lastLoginDate)
    }
    next();
  }
}]);
```

**After**

```ts
import { ApolloLink } from 'apollo-link';
import { httpLink } from 'apollo-angular-link-http';

class AppModule {
  constructor(httpLink: HttpLink) {
    const http = httpLink.create({ uri: '/graphql' });
    const addDates = new ApolloLink((operation, forward) => {
      return forward(operation).map((response) => {
        if (response.data.user.lastLoginDate) {
          response.data.user.lastLoginDate = new Date(response.data.user.lastLoginDate)
        }
        return response;
      })
    });

    // use with Apollo.create()
    const link = addDates.concat(http);
  }
}
```

For more information on using Apollo Links, check out the [link docs!](/docs/link);

<h2 id="redux" title="Redux">Replacing Redux</h2>

The 2.0 moves away from using Redux as the caching layer in favor of Apollo maintaining its own store through the provided `cache` passed when creating a client. This allows the new version to be more flexible around how data is cached, and opens the storage of data to many new avenues and view integrations. If you were previously using the Redux integration to do something like logging, you can now use an Apollo Link to log whenever a request is sent to the server. For example:

```js
import { ApolloLink } from 'apollo-link';

const logger = new ApolloLink((operation, forward) => {
  console.log(operation.operationName);
  return forward(operation).map((result) => {
    console.log(`received result from ${operation.operationName}`);
    return result;
  })
});
```

Ultimately we think the move off Redux will open the door for more powerful cache implementations and further performance gains. If you were using the Redux integration for other uses, please reach out or open an issue so we can help find a solution with the 2.0!

<h2 id="reducers" title="Query Reducers">Query Reducers</h2>
Query reducers have been finally removed in the 2.0, instead we recommend using the more flexible [`update`](../features/cache-updates.html#directAccess) API instead of reducer.


<h2 id="observable-variables" title="Observable variables">Observable variables</h2>

Apollo 2.0 doesn't ([currently](https://github.com/apollographql/apollo-angular/issues/425)) support passing observables as query variables. For now you can work around this by using `switchMap` on the observable:

***Before***

```js
this.apollo.watchQuery({
    query: 'foo',
    variables: { id: id$ },
  })
    .valueChanges
    .subscribe((foo) => {
      this.foo = foo;
    });
```


***After***

```js
id$
  .switchMap((id) => {
    return this.apollo.watchQuery({
      query: 'foo',
      variables: { id: id },
    })
      .valueChanges;
  })
    .subscribe((foo) => {
      this.foo = foo;
    });
```
