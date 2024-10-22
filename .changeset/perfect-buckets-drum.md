---
'apollo-angular': major
---

added a `complete()` method for `TestOperation` object to cancel subscriptions after `flush()`  

BREAKING CHANGE: subscription observables must be manually completed by the `complete()` method. 