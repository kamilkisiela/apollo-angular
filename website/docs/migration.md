---
title: Migration Guide
description: Updating your app to Angular Apollo 2.0 and Apollo Client 3.0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

- Apollo Client is now distributed as the `@apollo/client` package (previous versions are distributed as `apollo-client`).
- The `@apollo/client` package includes both core logic and GraphQL request handling, which previously required installing separate packages.
- ‼️ The `@apollo/client` includes React-specific code so it's very important to use `@apollo/client/core` instead.
- Apollo's cache (`InMemoryCache`) is more flexible and performant. It now supports garbage collection, storage of both normalized and non-normalized data, and the customization of cached data with new `TypePolicy` and `FieldPolicy` APIs.
- The `apollo-angular` includes now GraphQL request handling (`apollo-angular/http`), which previously required installing separate packages.
- New Apollo Angular no longer supports the `SelectPipe`.

## Update with Angular Schematics

Apollo Angular comes with set of migration schematics:

    ng update apollo-angular

> Important! Migration doesn't cover all use-cases and NgModules like `HttpLinkModule` have to be deleted manually. To improve the migration script, please open issues and PRs!

## Installation

To get started with the v2.0, you will change your imports to use the two packages. A typical upgrade looks like this:

<Tabs
defaultValue="before"
values={[
{label: 'Before', value: 'before'},
{label: 'After', value: 'after'},
{label: 'Diff', value: 'diff'},
]}>
<TabItem value="before">

```typescript
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {HttpLink} from 'apollo-angular-link-http';
```

  </TabItem>
  <TabItem value="after">

```typescript
import {ApolloClient, InMemoryCache} from '@apollo/client/core';
import {Apollo, gql} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
```

  </TabItem>
  <TabItem value="diff">

```diff
-import {ApolloClient} from 'apollo-client';
-import {InMemoryCache} from 'apollo-cache-inmemory';
+import {ApolloClient, InMemoryCache} from '@apollo/client/core';
-import {Apollo} from 'apollo-angular';
-import gql from 'graphql-tag';
+import {Apollo, gql} from 'apollo-angular';
-import {HttpLink} from 'apollo-angular-link-http';
+import {HttpLink} from 'apollo-angular/http';
```

  </TabItem>
</Tabs>

## Basic updates

A simple usage of Apollo Angular upgrading to the 2.0 would look like this:

<Tabs
defaultValue="before"
values={[
{label: 'Before', value: 'before'},
{label: 'After', value: 'after'},
{label: 'Diff', value: 'diff'},
]}>
<TabItem value="before">

```typescript
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

@NgModule({
  imports: [
    // ... other modules
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

  </TabItem>
  <TabItem value="after">

```typescript
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';

@NgModule({
  imports: [
    // ... other modules
    HttpClientModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

  </TabItem>
  <TabItem value="diff">

```diff language="typescript"
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
-import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
+import {HttpLink} from 'apollo-angular/http';
-import {InMemoryCache} from 'apollo-cache-inmemory';
+import {InMemoryCache} from '@apollo/client/core';


@NgModule({
  imports: [
    // ... other modules
    HttpClientModule,
    ApolloModule,
-   HttpLinkModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:3000',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
class AppModule {}
```

  </TabItem>
</Tabs>

What's different?

- `apollo-angular-link-http` and `apollo-angular-link-http-batch` are now available under `apollo-angular/http`
- No `HttpLinkModule`
- `apollo-client`, `apollo-link` and `apollo-cache-inmemory` are now under `@apollo/client/core`
- Use `@apollo/client/core` instead of `@apollo/client` because the latter includes React-related code.

This is the **most important part** of migrating to 2.0.

Few things to be explained.

### No SelectPipe

There are two reasons behind dropping `SelectPipe`. We haven't seen any big applications using the pipe and the logic there is very simple to recreate.

```typescript
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'select',
})
export class SelectPipe implements PipeTransform {
  public transform(obj: any, name: string = '') {
    if (name !== '') {
      return obj?.data?.[name];
    }
  }
}
```

### HttpLink and HttpBatchLink

The previous version of Apollo Angular (v1.0) setup had two extra packages: `apollo-angular-link-http` and `apollo-angular-link-http-batch`.

Now it's just one: `apollo-angular/http`.

### Apollo Links

The separate `apollo-link-*` packages, that were previously maintained in the https://github.com/apollographql/apollo-link repo, have been merged into the Apollo Client project. These links now have their own nested `@apollo/client/link/*` entry points. Imports should be updated as follows:

- `apollo-angular-link-persisted` is now `apollo-angular/persisted-queries`
- `apollo-link-context` is now `@apollo/client/link/context`
- `apollo-link-error` is now `@apollo/client/link/error`
- `apollo-link-retry` is now `@apollo/client/link/retry`
- `apollo-link-schema` is now `@apollo/client/link/schema`
- `apollo-link-ws` is now `@apollo/client/link/ws`

### graphql-tag

The `apollo-angular` package includes `graphql-tag` as a dependency and re-exports `gql`. To simplify your dependencies, we recommend importing `gql` from `apollo-angular` and removing all `graphql-tag` dependencies.

```typescript
import {gql} from 'apollo-angular';
```

### Using apollo-utilities without the rest of Apollo Client

The `apollo-utilities` package has been removed, but you can access the utilities themselves from the `@apollo/client/utilities` entry point:

```typescript
import {isReference, isInlineFragment} from '@apollo/client/utilities';
```

### Using apollo-cache and/or apollo-cache-inmemory without the rest of Apollo Client

The `apollo-cache` and `apollo-cache-inmemory` packages have been removed, but if you're interested in using Apollo Client's cache by itself, you can access their contents with the `@apollo/client/cache` entry point:

```typescript
import {ApolloCache, InMemoryCache} from '@apollo/client/cache';
```

### Breaking cache changes

The following cache changes are not backward compatible. Take them into consideration before you upgrade to Apollo Client 3.0.

- By default, the `InMemoryCache` no longer merges the fields of two objects unless those objects have the same unique identifier and that identifier is present in both objects. Additionally, the values of fields with the same name are no longer merged recursively by default. You can define a custom `merge` function for a field to handle both of these changes for a particular field. You can read more about these changes in [Merging non-normalized objects](./caching/field-behavior.md#merging-non-normalized-objects). ([PR #5603](https://github.com/apollographql/apollo-client/pull/5603)).
- All cache results are now frozen/immutable, as promised in the [Apollo Client 2.6 blog post](https://blog.apollographql.com/whats-new-in-apollo-client-2-6-b3acf28ecad1) ([PR #5153](https://github.com/apollographql/apollo-client/pull/5153)).
- `FragmentMatcher`, `HeuristicFragmentMatcher`, and `IntrospectionFragmentMatcher` have all been removed. We recommend using the `InMemoryCache`'s `possibleTypes` option instead. For more information, see [Defining possibleTypes manually](./data/fragments.md#defining-possibletypes-manually) ([PR #5073](https://github.com/apollographql/apollo-client/pull/5073)).
- The internal representation of normalized data in the cache has changed. If you’re using `apollo-cache-inmemory`'s public API, then these changes shouldn't impact you. If you are manipulating cached data directly instead, review [PR #5146](https://github.com/apollographql/apollo-client/pull/5146) for details.
- `(client/cache).writeData` have been fully removed. `(client/cache).writeQuery`, `(client/cache).writeFragment`, and/or `cache.modify` can be used to update the cache.

<Tabs
defaultValue="before"
values={[
{label: 'Before', value: 'before'},
{label: 'After', value: 'after'},
]}>
<TabItem value="before">

```typescript
client.writeData({
  data: {
    cartItems: [],
  },
});
```

  </TabItem>
  <TabItem value="after">

```typescript
client.writeQuery({
  query: gql`
    query GetCartItems {
      cartItems
    }
  `,
  data: {
    cartItems: [],
  },
});
```

  </TabItem>
</Tabs>

For more details around why writeData has been removed, see [PR #5923](https://github.com/apollographql/apollo-client/pull/5923).
