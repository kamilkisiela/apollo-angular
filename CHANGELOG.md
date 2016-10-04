# Change log

### v0.5.0

- Added `subscribe` method to `Angular2Apollo` service ([PR #113](https://github.com/apollostack/angular2-apollo/pull/113))
- Added `updateQuery` to `ApolloQueryObservable` ([PR #113](https://github.com/apollostack/angular2-apollo/pull/113))
- **Deprecated** `ApolloQueryPipe` (use `SelectPipe` instead)
- **Deprecated** `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** No longer support for ApolloClient v0.3.X

### v0.4.6

- Moved to Angular 2 final and updated RxJS to the latest version ([PR #96](https://github.com/apollostack/angular2-apollo/pull/96))

### v0.4.5

- Moved to Angular2 RC6 ([PR #81](https://github.com/apollostack/angular2-apollo/pull/81))
- Added `fetchMore` to the `ApolloQuery` interface ([PR #82](https://github.com/apollostack/angular2-apollo/pull/82)) ([Issue #80](https://github.com/apollostack/angular2-apollo/issues/80))

### v0.4.4

- Fixed format of arguments in backward compatible methods ([PR #74](https://github.com/apollostack/angular2-apollo/pull/74))
- Made queries reusable (use refetch on new variables) ([PR #74](https://github.com/apollostack/angular2-apollo/pull/74))
- Used [`apollo-client-rxjs`](https://github.com/kamilkisiela/apollo-client-rxjs) ([PR #72](https://github.com/apollostack/angular2-apollo/pull/72))
- Fixed an issue that prevents from subscribing to `ApolloQueryObservable` ([PR #71](https://github.com/apollostack/angular2-apollo/pull/71))
- Added `SelectPipe` and deprecated `ApolloQueryPipe` ([PR #78](https://github.com/apollostack/angular2-apollo/pull/78))

### v0.4.3

- Added `ApolloModule` (with RC5 of Angular2 comes NgModules) ([PR #63](https://github.com/apollostack/angular2-apollo/pull/63))
- Added ability to use query variables as observables. With this, the query can be automatically re-run when those obserables emit new values. ([PR #64](https://github.com/apollostack/angular2-apollo/pull/64))

### v0.4.2

- Added `fetchMore` support ([PR #58](https://github.com/apollostack/angular2-apollo/pull/58))
- Exposed `ApolloQueryObservable` in the index module ([PR #54](https://github.com/apollostack/angular2-apollo/pull/54))
- Added support for getting `loading` state from ApolloQueryResult [Issue #36](https://github.com/apollostack/angular2-apollo/issues/36) ([PR #43](https://github.com/apollostack/angular2-apollo/pull/43))
- Fixed `ApolloQueryObservable` incompatibility with `Rx.Observable` ([PR #59](https://github.com/apollostack/angular2-apollo/pull/59))

### v0.4.1

- Added `ApolloQueryObservable` to support `Rx.Observable` in `Angular2Apollo.watchQuery` method ([PR #52](https://github.com/apollostack/angular2-apollo/pull/52))
- Added `query` method to `Angular2Apollo` service ([PR #51](https://github.com/apollostack/angular2-apollo/pull/51))

### v0.4.0

- Passing all the options of mutation in `Apollo` decorator [PR #39](https://github.com/apollostack/angular2-apollo/pull/39)
- Added support for `apollo-client` breaking change that moves methods to query's observable ([PR #40](https://github.com/apollostack/angular2-apollo/pull/40))
- Replaced `lodash` with subpackages, removed `graphql-tag` from dependencies, moved `apollo-client` and `@angular/core` to peerDependecies ([PR #44](https://github.com/apollostack/angular2-apollo/pull/44))
- Added `ApolloQuery` interface ([PR #45](https://github.com/apollostack/angular2-apollo/pull/45))

### v0.3.0

- Added SSR support
- Left `lodash` as the only one dependency and `@angular/core` with `apollo-client` as peerDependecies ([PR #29](https://github.com/apollostack/angular2-apollo/pull/29))
- Fixed missing data in reused component ([PR #30](https://github.com/apollostack/angular2-apollo/pull/30))
- Fixed overwriting query data with the same value on every poll interval ([PR #34](https://github.com/apollostack/angular2-apollo/pull/34))

### v0.2.0

- Added polling, refetching and access to unsubscribe method ([PR #19](https://github.com/apollostack/angular2-apollo/pull/19))
- Added `forceFetch`, `returnPartialData` and `pollInterval` support ([PR #19](https://github.com/apollostack/angular2-apollo/pull/19))
- Added `errors` and `loading` to the query's result object ([PR #19](https://github.com/apollostack/angular2-apollo/pull/19))
- Added both results from decorator and service support for `ApolloQueryPipe` ([PR #27](https://github.com/apollostack/angular2-apollo/pull/27))
- Fixed issue with not setting a query with not defined variables ([PR #19](https://github.com/apollostack/angular2-apollo/pull/19))

### v0.1.0

- Added Angular2 RC1 and ApolloClient 0.3.X support ([PR #16](https://github.com/apollostack/angular2-apollo/pull/16), [PR #17](https://github.com/apollostack/angular2-apollo/pull/17))

### v0.0.2

- Added `@Apollo` decorator ([99fed6e](https://github.com/apollostack/angular2-apollo/commit/99fed6e), [9f0107e](https://github.com/apollostack/angular2-apollo/commit/9f0107e))


### v0.0.1

Initial release. We didn't track changes before this version.
