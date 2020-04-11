# Change log

### vNEXT

### v1.10.0

- Bump version ranges for GraphQL and Apollo Link

### v1.9.0

- Fix deep import of graphql `print`

### v1.8.0

- Sync with common@1.8.0

### v1.7.0

- Support Angular 8

### v1.6.0

- Supports file upload (set `useMultipart: true` in operation's context)

### v1.5.0

- Allow to define `uri` through a function [PR #1084](https://github.com/apollographql/apollo-angular/pull/1084)

### v1.4.0

- Angular 7 [PR #913](https://github.com/apollographql/apollo-angular/pull/913)

### v1.3.1

- Bump `apollo-angular-link-http-common` to 1.3.0

### v1.3.0

- Supports `graphql` v14

### v1.2.0

- Uses `ng-packagr`

### v1.1.1

### v1.1.0

- Expose `response: HttpResponse` object in context ([PR #476](https://github.com/apollographql/apollo-angular/pull/476))
- Adds `sideEffects: false` (webpack) ([PR #580](https://github.com/apollographql/apollo-angular/pull/580))
- Supports Angular 6 and RxJS 6 ([PR #580](https://github.com/apollographql/apollo-angular/pull/580))

### v1.0.3

- Fix return type of `request` method ([PR #570](https://github.com/apollographql/apollo-angular/pull/570))

### v1.0.2

- Update `graphql` dependency to `^0.12.3`
- Allow not to send query
  ([PR #416](https://github.com/apollographql/apollo-angular/pull/416))
- Use same options in both, context and global
  ([PR #416](https://github.com/apollographql/apollo-angular/pull/416))

### v1.0.1

- Serialize variables and extensions when using params
  ([PR #402](https://github.com/apollographql/apollo-angular/pull/402))
- Replace `Array.includes` with `Array.indexOf`. Many browsers does not support
  it. ([PR #410](https://github.com/apollographql/apollo-angular/pull/410))

### v1.0.0

Initial release. We didn't track changes before this version.
