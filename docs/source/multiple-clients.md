---
title: Multiple clients
order: 14
---

With `apollo-angular` it's possible to use multiple instances of ApolloClient in your application.

<h2 id="providing-clients">Providing clients</h2>

You're already familiar with the way provide an instance of ApolloClient to the `ApolloModule`.
Instead of using a function that returns just one client, change it to return a key-value object, where a key is a unique name of a client and put that client as a value.

```ts
export function provideClients() {
  return {
    default: client,
    extra: extraClient,
  };
}

ApolloModule.forRoot(provideClients);
```

As you can see, we defined two clients that are now available to your application.

Important thing to know is if you want to define a default client, simply use `default` as a name.


<h2 id="using-apollo">Using Apollo</h2>

Since we have our clients available in an app, now is the time to see how to use them.

If a client is defined as the default, you can directly use all methods of the `Apollo` service. 

About named clients, simply use the method called `use(name: string)`.

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
