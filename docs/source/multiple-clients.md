---
title: Multiple clients
order: 14
---

With `apollo-angular` it's possible to use multiple instances of ApolloClient in your application.

<h2 id="providing-clients">Providing clients</h2>

It's simple! Make function to return an object where each key is a name and put instance of ApolloClient as a value.

```ts
export function provideClients() {
  return {
    default: client,
    extra: extraClient,
  };
}

ApolloModule.forRoot(provideClients);
```

If you want to define a default client, simply use `default` as a name.


<h2 id="using-apollo">Using Apollo</h2>

Since we have our clients defined, now's time to see how to use them.

```ts
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Component({...})
export class AppComponent implements OnInit {
  feed: any;

  constructor(
    private apollo: Apollo
  ) {}

  ngOnInit() {
    // use default
    this.feed = this.apollo.watchQuery({...});

    // use extra client
    this.feed = this.apollo.use('extra').watchQuery({...});
  }
}
```
