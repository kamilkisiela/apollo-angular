# Change log

### vNext

### v2.6.0

- Support TypedDocumentNode

### v2.5.0

- Support Angular 12

### v2.4.0

- Fix: Use let in Apollo constructor due to firefox bug [#1632](https://github.com/kamilkisiela/apollo-angular/pull/1632)
- Adds `operationPrinter` option to replace operation printing logic in `HttpLink` and `HttpBatchLink` [#1637](https://github.com/kamilkisiela/apollo-angular/pull/1637)

### v2.3.0

- `830da182` build: Allows zone.js v11 [#1629](https://github.com/kamilkisiela/apollo-angular/pull/1629)
- `136663f0` docs: Update queries.md [#1616](https://github.com/kamilkisiela/apollo-angular/pull/1616)

### v2.2.0

- `b152d53` Added Angular 11 peer dependency [#1615](https://github.com/kamilkisiela/apollo-angular/pull/1615)
- `d179a66` docs: Integrated documentation changes [#1590](https://github.com/kamilkisiela/apollo-angular/pull/1590)
- `5d938a3` Update README.md [#1598](https://github.com/kamilkisiela/apollo-angular/pull/1598)
- `60b8445` fix: test data modification [#1596](https://github.com/kamilkisiela/apollo-angular/pull/1596)

### v2.1.0

- Move `apollo-angular-link-persisted` to `apollo-angular/persisted-queries` (support Apollo Client 3.0)
- Support `clientAwareness` (`apollographql-client-name` and `apollographql-client-version` headers) in `HttpLink` and `HttpBatchLink`

### v2.0.4

- Fix v2 migration: default export (`ApolloClient`) of `apollo-client`
- Use TypeScript to parse JSON files (supports comments in JSON)

### v2.0.3

- Use JSON.parse to parse `package.json` file in v2 migration

### v2.0.2

- Fix duplicated imports in v2 migration

### v2.0.1

- Fix missing migration code

### v2.0.0

Migration from v1.0 to v2.0:

    ng update apollo-angular

List of breaking changes and a migration strategy available on our ["Migration Guide"](https://apollo-angular.com/docs/migration).

Changes:

- Support Apollo Client 3.0 (use `@apollo/client/core`)
- `Http`, `HttpBatch` and `Headers` links are now part of apollo-angular: `apollo-angular/http` and `apollo-angular/headers`
- Re-export `gql` of `graphql-tag` (`import { gql } from 'apollo-angular'`)
- Add `flushData` method to `TestingOperation` ([PR #1474](https://github.com/kamilkisiela/apollo-angular/pull/1474) by [@fetis](https://github.com/fetis))
- Remove `apollo-angular-boost` and `apollo-angular-cache-ngrx`

### v1.10.0

- Support Angular 10

### v1.9.1

- Fix an issue with TypeScript prior v3.5 - private get accessor [#1491](https://github.com/kamilkisiela/apollo-angular/issues/1491)

### v1.9.0

- Bump version ranges for GraphQL and Apollo Link

### v1.8.0

- Introduces `APOLLO_NAMED_OPTIONS` token. Allows to create named Apollo clients using Dependency Injection ([PR #1365](https://github.com/kamilkisiela/apollo-angular/pull/1365))
- Allow to test named Apollo client ([PR #1365](https://github.com/kamilkisiela/apollo-angular/pull/1365))

### v1.7.0

- Fixed type definition for subscribe [PR #1290](https://github.com/kamilkisiela/apollo-angular/pull/1290)
- Fix global scope naming for UMD build [PR #1305](https://github.com/kamilkisiela/apollo-angular/pull/1305)
- Introduce useInitialLoading in watch [PR #1306](https://github.com/kamilkisiela/apollo-angular/pull/1306)

### v1.6.0

- Angular 8 [PR #1206](https://github.com/kamilkisiela/apollo-angular/pull/1206)
- Bumps packages in schematics

### v1.5.0

- Use more generic types and make everything more strict [PR #885](https://github.com/kamilkisiela/apollo-angular/pull/885)
- Angular 7 [PR #913](https://github.com/kamilkisiela/apollo-angular/pull/913)

### v1.4.1

- schematics: bump dependencies

### v1.4.0

- Support named clients in Query, Mutatio and Subscription classes [PR #799](https://github.com/kamilkisiela/apollo-angular/pull/799)

### v1.3.0

- Make `Subscription` generic [PR #778](https://github.com/kamilkisiela/apollo-angular/pull/778)
- Schematics (`ng add apollo-angular`) [PR #779](https://github.com/kamilkisiela/apollo-angular/pull/779), [PR #780](https://github.com/kamilkisiela/apollo-angular/pull/780)
- Allow to use a custom ApolloCache while testing [PR #786](https://github.com/kamilkisiela/apollo-angular/pull/786)

### v1.2.0

- Expose `queryId` in `QueryRef` [PR #733](https://github.com/kamilkisiela/apollo-angular/pull/733)
- Introduce `Query`, `Mutation`, `Subscription` services [PR #622](https://github.com/kamilkisiela/apollo-angular/pull/622)
- Angular 6.1 is now required (because of TypeScript 2.8)
- TypeScript 2.8 is now required (because of Omit type)
- Apollo Client ^2.3.4 is now required (versions before are not compatible because of the change in apollo-client)

### v1.1.2

### v1.1.1

- Fix typescript compilation errors caused by recent Apollo Client
  interface changes. [Issue #659](https://github.com/kamilkisiela/apollo-angular/issues/659) [PR #660](https://github.com/kamilkisiela/apollo-angular/pull/660)

### v1.1.0

- Introduces `ExtraSubscriptionOptions`. Allows to run `Apollo.subscribe` outside
  the Zone ([PR #488](https://github.com/kamilkisiela/apollo-angular/pull/488))
- Introduces `apollo-angular/testing` tools ([PR #592](https://github.com/kamilkisiela/apollo-angular/pull/592))
- Introduces `APOLLO_OPTIONS` token. Allows to create Apollo using Dependency Injection ([PR #607](https://github.com/kamilkisiela/apollo-angular/pull/607))
- Adds `sideEffects: false` (webpack) ([PR #580](https://github.com/kamilkisiela/apollo-angular/pull/580))
- Supports Angular 6 and RxJS 6 ([PR #580](https://github.com/kamilkisiela/apollo-angular/pull/580))

### v1.0.1

- Brings typed variables to `QueryRef`

### v1.0.0

- Supports **ApolloClient 2.0**
- Supports ApolloLinks and ApolloCache
- Supports **Angular v5**
- Possible to combine Apollo with anything from Angular's Dependency Injection
- Supports **NativeScript**
- Simpler and less error prone API for watching queries thanks to `QueryRef`
- More AoT friendly
- Brings back Server-Side Rendering
- Allows to type the operation variables

**BREAKING CHANGES:** - [see Migration](https://apollo-angular.com/docs/1.0/migration)

- Drops `apollo-client-rxjs` (thanks to `QueryRef`)
- Replaces`ApolloQueryObservable` with `QueryRef`
- Introduces new API for defining multiple clients (`Apollo.create`,
  `Apollo.createDefault`, `Apollo.createNamed`)
- No longer exposes `ClientMap`, `ClientMapWrapper`, `ClientWrapper`
- Removes 'variables as Observables' feature

### v0.13.3

- Don't reuse options object for mutate and query
  ([PR #356](https://github.com/kamilkisiela/apollo-angular/pull/356))

### v0.13.2

- Use `InjectionToken`, instead of deprecated `OpaqueToken`
  ([PR #358](https://github.com/kamilkisiela/apollo-angular/pull/358))
- Expose `ClientMap`, `ClientMapWrapper`, `ClientWrapper`
  ([PR #360](https://github.com/kamilkisiela/apollo-angular/pull/360))
- Allow to install the library directly from git (NPM v5+ required)
  ([PR #362](https://github.com/kamilkisiela/apollo-angular/pull/362))
- Fix AoT issue in Angular 5 **(added InjectDecorator on ClientMap in Apollo)**
  ([PR #365](https://github.com/kamilkisiela/apollo-angular/pull/365))

### v0.13.1

- Update dependencies
  ([PR #347](https://github.com/kamilkisiela/apollo-angular/pull/304))
- **Potential breaking change:** Run a GraphQL Operation on subscribe, applies
  to `mutate()` and `query()`
  ([PR #304](https://github.com/kamilkisiela/apollo-angular/pull/304))

### v0.13.0

- Run `subscribe`, `mutate` and `query` within a Zone
  ([PR #297](https://github.com/kamilkisiela/apollo-angular/pull/297))

### v0.12.0

- Support `apollo-client@1.0.0-rc.2`
  ([PR #290](https://github.com/kamilkisiela/apollo-angular/pull/290))
- Support `jsnext:main`
  ([PR #277](https://github.com/kamilkisiela/apollo-angular/pull/277))

### v0.11.0

- Remove `DeprecatedWatchQueryOptions` and use `WatchQueryOptions`
  ([PR #274](https://github.com/kamilkisiela/apollo-angular/pull/274))

**After updating to**
([`apollo-client-rxjs@0.5.0`](https://github.com/kamilkisiela/apollo-client-rxjs/blob/master/CHANGELOG.md#v050))

- Add `result()`, `currentResult()`, `variables`, `setOptions`, `setVariables`
  to `ApolloQueryObservable`
- **BREAKING CHANGE:** `ApolloQueryObservable` shares now a generic type with
  `ApolloQueryResult`

**Before:**

```ts
class AppComponent {
  users: ApolloQueryObservable<ApolloQueryResult<{}>>;
}
```

**Now:**

```ts
class AppComponent {
  users: ApolloQueryObservable<{}>;
}
```

Behaves the same as the `ObservableQuery` of `apollo-client`.

### v0.10.0

- **BRAKING CHANGE** Change name of the service to `Apollo`, instead of
  `Angular2Apollo`
  ([PR #262](https://github.com/kamilkisiela/apollo-angular/pull/262))
- Introduce multiple clients
  ([PR #263](https://github.com/kamilkisiela/apollo-angular/pull/263))

### v0.9.0

- Support `apollo-client@0.8.0`
  ([PR #206](https://github.com/kamilkisiela/apollo-angular/pull/206))
- Support `es6` modules and `tree-shaking`
  ([PR #151](https://github.com/kamilkisiela/apollo-angular/pull/151),
  [PR #206](https://github.com/kamilkisiela/apollo-angular/pull/206))
- Make our `Ahead-of-Time` compilation compatible with Angular 2.3+
  ([PR #189](https://github.com/kamilkisiela/apollo-angular/pull/189),
  [PR #195](https://github.com/kamilkisiela/apollo-angular/pull/195))
- Added `getClient()` that exposes an instance of ApolloClient
  ([PR #203](https://github.com/kamilkisiela/apollo-angular/pull/203))
- **BREAKING CHANGE** The way to provide an instance of ApolloClient has
  changed, [see how](https://github.com/apollographql/angular2-docs/pull/23)
- **BREAKING CHANGE** Change the name of the package. Use `apollo-angular`
  instead of `angular2-apollo`, which is now deprecated

### v0.8.0

- Made `mutate()` and `query()` methods to return `Observable` instead of
  `Promise`
  ([PR #140](https://github.com/kamilkisiela/apollo-angular/pull/140))
- Use types of options (for `watchQuery`, `query`, `mutate`) (
  [PR #145](https://github.com/kamilkisiela/apollo-angular/pull/145),
  [PR #146](https://github.com/kamilkisiela/apollo-angular/pull/146),
  [PR #148](https://github.com/kamilkisiela/apollo-angular/pull/148) )

### v0.7.0

- Added support for **Ahead of Time** compilation
  ([PR #124](https://github.com/kamilkisiela/apollo-angular/pull/124))

### v0.6.0

- Added support for ApolloClient `v0.5.X` ([PR #])
- Added `subscribeToMore` function
  ([PR](https://github.com/kamilkisiela/apollo-client-rxjs/pull/5))
- **BREAKING CHANGE** No no longer support ApolloClient `v0.4.X`
- **BREAKING CHANGE** Removed `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** Removed `ApolloQueryPipe` (use `SelectPipe` instead)

### v0.5.0

- Added `subscribe` method to `Angular2Apollo` service
  ([PR #113](https://github.com/kamilkisiela/apollo-angular/pull/113))
- Added `updateQuery` to `ApolloQueryObservable`
  ([PR #113](https://github.com/kamilkisiela/apollo-angular/pull/113))
- **Deprecated** `ApolloQueryPipe` (use `SelectPipe` instead)
- **Deprecated** `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** No longer support for ApolloClient v0.3.X

### v0.4.6

- Moved to Angular 2 final and updated RxJS to the latest version
  ([PR #96](https://github.com/kamilkisiela/apollo-angular/pull/96))

### v0.4.5

- Moved to Angular2 RC6
  ([PR #81](https://github.com/kamilkisiela/apollo-angular/pull/81))
- Added `fetchMore` to the `ApolloQuery` interface
  ([PR #82](https://github.com/kamilkisiela/apollo-angular/pull/82))
  ([Issue #80](https://github.com/kamilkisiela/apollo-angular/issues/80))

### v0.4.4

- Fixed format of arguments in backward compatible methods
  ([PR #74](https://github.com/kamilkisiela/apollo-angular/pull/74))
- Made queries reusable (use refetch on new variables)
  ([PR #74](https://github.com/kamilkisiela/apollo-angular/pull/74))
- Used
  [`apollo-client-rxjs`](https://github.com/kamilkisiela/apollo-client-rxjs)
  ([PR #72](https://github.com/kamilkisiela/apollo-angular/pull/72))
- Fixed an issue that prevents from subscribing to `ApolloQueryObservable`
  ([PR #71](https://github.com/kamilkisiela/apollo-angular/pull/71))
- Added `SelectPipe` and deprecated `ApolloQueryPipe`
  ([PR #78](https://github.com/kamilkisiela/apollo-angular/pull/78))

### v0.4.3

- Added `ApolloModule` (with RC5 of Angular2 comes NgModules)
  ([PR #63](https://github.com/kamilkisiela/apollo-angular/pull/63))
- Added ability to use query variables as observables. With this, the query can
  be automatically re-run when those obserables emit new values.
  ([PR #64](https://github.com/kamilkisiela/apollo-angular/pull/64))

### v0.4.2

- Added `fetchMore` support
  ([PR #58](https://github.com/kamilkisiela/apollo-angular/pull/58))
- Exposed `ApolloQueryObservable` in the index module
  ([PR #54](https://github.com/kamilkisiela/apollo-angular/pull/54))
- Added support for getting `loading` state from ApolloQueryResult
  [Issue #36](https://github.com/kamilkisiela/apollo-angular/issues/36)
  ([PR #43](https://github.com/kamilkisiela/apollo-angular/pull/43))
- Fixed `ApolloQueryObservable` incompatibility with `Rx.Observable`
  ([PR #59](https://github.com/kamilkisiela/apollo-angular/pull/59))

### v0.4.1

- Added `ApolloQueryObservable` to support `Rx.Observable` in
  `Angular2Apollo.watchQuery` method
  ([PR #52](https://github.com/kamilkisiela/apollo-angular/pull/52))
- Added `query` method to `Angular2Apollo` service
  ([PR #51](https://github.com/kamilkisiela/apollo-angular/pull/51))

### v0.4.0

- Passing all the options of mutation in `Apollo` decorator
  [PR #39](https://github.com/kamilkisiela/apollo-angular/pull/39)
- Added support for `apollo-client` breaking change that moves methods to
  query's observable
  ([PR #40](https://github.com/kamilkisiela/apollo-angular/pull/40))
- Replaced `lodash` with subpackages, removed `graphql-tag` from dependencies,
  moved `apollo-client` and `@angular/core` to peerDependecies
  ([PR #44](https://github.com/kamilkisiela/apollo-angular/pull/44))
- Added `ApolloQuery` interface
  ([PR #45](https://github.com/kamilkisiela/apollo-angular/pull/45))

### v0.3.0

- Added SSR support
- Left `lodash` as the only one dependency and `@angular/core` with
  `apollo-client` as peerDependecies
  ([PR #29](https://github.com/kamilkisiela/apollo-angular/pull/29))
- Fixed missing data in reused component
  ([PR #30](https://github.com/kamilkisiela/apollo-angular/pull/30))
- Fixed overwriting query data with the same value on every poll interval
  ([PR #34](https://github.com/kamilkisiela/apollo-angular/pull/34))

### v0.2.0

- Added polling, refetching and access to unsubscribe method
  ([PR #19](https://github.com/kamilkisiela/apollo-angular/pull/19))
- Added `forceFetch`, `returnPartialData` and `pollInterval` support
  ([PR #19](https://github.com/kamilkisiela/apollo-angular/pull/19))
- Added `errors` and `loading` to the query's result object
  ([PR #19](https://github.com/kamilkisiela/apollo-angular/pull/19))
- Added both results from decorator and service support for `ApolloQueryPipe`
  ([PR #27](https://github.com/kamilkisiela/apollo-angular/pull/27))
- Fixed issue with not setting a query with not defined variables
  ([PR #19](https://github.com/kamilkisiela/apollo-angular/pull/19))

### v0.1.0

- Added Angular2 RC1 and ApolloClient 0.3.X support
  ([PR #16](https://github.com/kamilkisiela/apollo-angular/pull/16),
  [PR #17](https://github.com/kamilkisiela/apollo-angular/pull/17))

### v0.0.2

- Added `@Apollo` decorator
  ([99fed6e](https://github.com/kamilkisiela/apollo-angular/commit/99fed6e),
  [9f0107e](https://github.com/kamilkisiela/apollo-angular/commit/9f0107e))

### v0.0.1

Initial release. We didn't track changes before this version.
