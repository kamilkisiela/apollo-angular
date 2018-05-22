# Change log

### vNEXT

### v1.1.0

* Expose `response: HttpResponse` object in context ([PR #476](https://github.com/apollographql/apollo-angular/pull/476))
* Adds `sideEffects: false` (webpack) ([PR #580](https://github.com/apollographql/apollo-angular/pull/580))
* Supports Angular 6 and RxJS 6 ([PR #580](https://github.com/apollographql/apollo-angular/pull/580))

### v1.0.3

* Fix return type of `request` method ([PR #570](https://github.com/apollographql/apollo-angular/pull/570))

### v1.0.2

* Update `graphql` dependency to `^0.12.3`
* Allow not to send query
  ([PR #416](https://github.com/apollographql/apollo-angular/pull/416))
* Use same options in both, context and global
  ([PR #416](https://github.com/apollographql/apollo-angular/pull/416))

### v1.0.1

* Serialize variables and extensions when using params
  ([PR #402](https://github.com/apollographql/apollo-angular/pull/402))
* Replace `Array.includes` with `Array.indexOf`. Many browsers does not support
  it. ([PR #410](https://github.com/apollographql/apollo-angular/pull/410))

### v1.0.0

Initial release. We didn't track changes before this version.
