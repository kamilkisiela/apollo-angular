# Change log

### vNEXT

- **Potential breaking change:** Run a GraphQL Operation on subscribe, applies to `mutate()` and `query()` ([PR #304](https://github.com/apollographql/apollo-angular/pull/304))

### v0.13.0

- Run `subscribe`, `mutate` and `query` within a Zone ([PR #297](https://github.com/apollographql/apollo-angular/pull/297))

### v0.12.0

- Support `apollo-client@1.0.0-rc.2` ([PR #290](https://github.com/apollographql/apollo-angular/pull/290))
- Support `jsnext:main` ([PR #277](https://github.com/apollographql/apollo-angular/pull/277))

### v0.11.0

- Remove `DeprecatedWatchQueryOptions` and use `WatchQueryOptions` ([PR #274](https://github.com/apollographql/apollo-angular/pull/274))

**After updating to**  ([`apollo-client-rxjs@0.5.0`](https://github.com/kamilkisiela/apollo-client-rxjs/blob/master/CHANGELOG.md#v050))

- Add `result()`, `currentResult()`, `variables`, `setOptions`, `setVariables` to `ApolloQueryObservable`
- **BREAKING CHANGE:** `ApolloQueryObservable` shares now a generic type with `ApolloQueryResult`

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

- **BRAKING CHANGE** Change name of the service to `Apollo`, instead of `Angular2Apollo` ([PR #262](https://github.com/apollographql/apollo-angular/pull/262))
- Introduce multiple clients ([PR #263](https://github.com/apollographql/apollo-angular/pull/263))

### v0.9.0

- Support `apollo-client@0.8.0` ([PR #206](https://github.com/apollographql/apollo-angular/pull/206))
- Support `es6` modules and `tree-shaking` ([PR #151](https://github.com/apollographql/apollo-angular/pull/151), [PR #206](https://github.com/apollographql/apollo-angular/pull/206))
- Make our `Ahead-of-Time` compilation compatible with Angular 2.3+ ([PR #189](https://github.com/apollographql/apollo-angular/pull/189), [PR #195](https://github.com/apollographql/apollo-angular/pull/195))
- Added `getClient()` that exposes an instance of ApolloClient ([PR #203](https://github.com/apollographql/apollo-angular/pull/203))
- **BREAKING CHANGE** The way to provide an instance of ApolloClient has changed, [see how](https://github.com/apollographql/angular2-docs/pull/23)
- **BREAKING CHANGE** Change the name of the package. Use `apollo-angular` instead of `angular2-apollo`, which is now deprecated

### v0.8.0

- Made `mutate()` and `query()` methods to return `Observable` instead of `Promise` ([PR #140](https://github.com/apollographql/apollo-angular/pull/140))
- Use types of options (for `watchQuery`, `query`, `mutate`) (
[PR #145](https://github.com/apollographql/apollo-angular/pull/145),
[PR #146](https://github.com/apollographql/apollo-angular/pull/146),
[PR #148](https://github.com/apollographql/apollo-angular/pull/148)
)

### v0.7.0

- Added support for **Ahead of Time** compilation ([PR #124](https://github.com/apollographql/apollo-angular/pull/124))


### v0.6.0

- Added support for ApolloClient `v0.5.X` ([PR #])
- Added `subscribeToMore` function ([PR](https://github.com/kamilkisiela/apollo-client-rxjs/pull/5))
- **BREAKING CHANGE** No no longer support ApolloClient `v0.4.X`
- **BREAKING CHANGE** Removed `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** Removed `ApolloQueryPipe` (use `SelectPipe` instead)

### v0.5.0

- Added `subscribe` method to `Angular2Apollo` service ([PR #113](https://github.com/apollographql/apollo-angular/pull/113))
- Added `updateQuery` to `ApolloQueryObservable` ([PR #113](https://github.com/apollographql/apollo-angular/pull/113))
- **Deprecated** `ApolloQueryPipe` (use `SelectPipe` instead)
- **Deprecated** `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** No longer support for ApolloClient v0.3.X

### v0.4.6

- Moved to Angular 2 final and updated RxJS to the latest version ([PR #96](https://github.com/apollographql/apollo-angular/pull/96))

### v0.4.5

- Moved to Angular2 RC6 ([PR #81](https://github.com/apollographql/apollo-angular/pull/81))
- Added `fetchMore` to the `ApolloQuery` interface ([PR #82](https://github.com/apollographql/apollo-angular/pull/82)) ([Issue #80](https://github.com/apollographql/apollo-angular/issues/80))

### v0.4.4

- Fixed format of arguments in backward compatible methods ([PR #74](https://github.com/apollographql/apollo-angular/pull/74))
- Made queries reusable (use refetch on new variables) ([PR #74](https://github.com/apollographql/apollo-angular/pull/74))
- Used [`apollo-client-rxjs`](https://github.com/kamilkisiela/apollo-client-rxjs) ([PR #72](https://github.com/apollographql/apollo-angular/pull/72))
- Fixed an issue that prevents from subscribing to `ApolloQueryObservable` ([PR #71](https://github.com/apollographql/apollo-angular/pull/71))
- Added `SelectPipe` and deprecated `ApolloQueryPipe` ([PR #78](https://github.com/apollographql/apollo-angular/pull/78))

### v0.4.3

- Added `ApolloModule` (with RC5 of Angular2 comes NgModules) ([PR #63](https://github.com/apollographql/apollo-angular/pull/63))
- Added ability to use query variables as observables. With this, the query can be automatically re-run when those obserables emit new values. ([PR #64](https://github.com/apollographql/apollo-angular/pull/64))

### v0.4.2

- Added `fetchMore` support ([PR #58](https://github.com/apollographql/apollo-angular/pull/58))
- Exposed `ApolloQueryObservable` in the index module ([PR #54](https://github.com/apollographql/apollo-angular/pull/54))
- Added support for getting `loading` state from ApolloQueryResult [Issue #36](https://github.com/apollographql/apollo-angular/issues/36) ([PR #43](https://github.com/apollographql/apollo-angular/pull/43))
- Fixed `ApolloQueryObservable` incompatibility with `Rx.Observable` ([PR #59](https://github.com/apollographql/apollo-angular/pull/59))

### v0.4.1

- Added `ApolloQueryObservable` to support `Rx.Observable` in `Angular2Apollo.watchQuery` method ([PR #52](https://github.com/apollographql/apollo-angular/pull/52))
- Added `query` method to `Angular2Apollo` service ([PR #51](https://github.com/apollographql/apollo-angular/pull/51))

### v0.4.0

- Passing all the options of mutation in `Apollo` decorator [PR #39](https://github.com/apollographql/apollo-angular/pull/39)
- Added support for `apollo-client` breaking change that moves methods to query's observable ([PR #40](https://github.com/apollographql/apollo-angular/pull/40))
- Replaced `lodash` with subpackages, removed `graphql-tag` from dependencies, moved `apollo-client` and `@angular/core` to peerDependecies ([PR #44](https://github.com/apollographql/apollo-angular/pull/44))
- Added `ApolloQuery` interface ([PR #45](https://github.com/apollographql/apollo-angular/pull/45))

### v0.3.0

- Added SSR support
- Left `lodash` as the only one dependency and `@angular/core` with `apollo-client` as peerDependecies ([PR #29](https://github.com/apollographql/apollo-angular/pull/29))
- Fixed missing data in reused component ([PR #30](https://github.com/apollographql/apollo-angular/pull/30))
- Fixed overwriting query data with the same value on every poll interval ([PR #34](https://github.com/apollographql/apollo-angular/pull/34))

### v0.2.0

- Added polling, refetching and access to unsubscribe method ([PR #19](https://github.com/apollographql/apollo-angular/pull/19))
- Added `forceFetch`, `returnPartialData` and `pollInterval` support ([PR #19](https://github.com/apollographql/apollo-angular/pull/19))
- Added `errors` and `loading` to the query's result object ([PR #19](https://github.com/apollographql/apollo-angular/pull/19))
- Added both results from decorator and service support for `ApolloQueryPipe` ([PR #27](https://github.com/apollographql/apollo-angular/pull/27))
- Fixed issue with not setting a query with not defined variables ([PR #19](https://github.com/apollographql/apollo-angular/pull/19))

### v0.1.0

- Added Angular2 RC1 and ApolloClient 0.3.X support ([PR #16](https://github.com/apollographql/apollo-angular/pull/16), [PR #17](https://github.com/apollographql/apollo-angular/pull/17))

### v0.0.2

- Added `@Apollo` decorator ([99fed6e](https://github.com/apollographql/apollo-angular/commit/99fed6e), [9f0107e](https://github.com/apollographql/apollo-angular/commit/9f0107e))


### v0.0.1

Initial release. We didn't track changes before this version.
