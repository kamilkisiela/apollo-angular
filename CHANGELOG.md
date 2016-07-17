# Change log

### vNEXT

- Passing all the options of mutation in `Apollo` decorator [PR #39](https://github.com/apollostack/angular2-apollo/pull/39)
- Added support for `apollo-client` breaking change that moves methods to query's observable ([PR #40](https://github.com/apollostack/angular2-apollo/pull/40))
- Replaced `lodash` with subpackages, removed `graphql-tag` from dependencies, moved `apollo-client` and `@angular/core` to peerDependecies ([PR #44](https://github.com/apollostack/angular2-apollo/pull/44))

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
