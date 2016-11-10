---
title: Queries
order: 10
---

To fetch data from the server in a GraphQL system, we use GraphQL queries (you can read about the structure of GraphQL queries in detail at [graphql.org](http://graphql.org/docs/queries/)).

<h2 id="basics">Basic Queries</h2>

When we are using a basic query we can use the `Angular2Apollo.watchQuery` method in a very simple way. We simply need to parse our query into a GraphQL document using the `graphql-tag` library.

For instance, in GitHunt, we want to display the current user (if logged in) in the `Profile` component:

```ts
import { Component, OnInit } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

// We use the gql tag to parse our query string into a query document
const CurrentUserForProfile = gql`
  query CurrentUserForProfile {
    currentUser {
      login
      avatar_url
    }
  }
`;

@Component({ ... })
class ProfileComponent implements OnInit {
  loading: boolean;
  currentUser: any;

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit() {
    this.apollo.watchQuery({
      query: CurrentUserForProfile
    }).subscribe(({data}) => {
      this.loading = data.loading;
      this.currentUser = data.currentUser;
    });
  }
}
```

The service's `watchQuery` method returns and `Observable` of the query result ([`ApolloQueryResult`][ApolloQueryResult]). We can see that result object contains `loading`, a Boolean indicating if the query is "in-flight", and (once the query has completed) `data` object with `currentUser`, the field we've picked out in `CurrentUserForProfile`.

We can expect the `data.currentUser` to change as the logged-in-ness of the client and what it knows about the current user changes over time. That information is stored in Apollo Client's cache, and you can read more about techniques to bring the cache up to date with the server in the [article on the subject](cache-updates.html).

It's also possible to fetch data only once. The `query` method of `Angular2Apollo` service returns an `Observable` that resolves also with [`ApolloQueryResult`][ApolloQueryResult].

To be more specific, `watchQuery` method returns an Observable called `ApolloQueryObservable`. It extends the actual `Observable` from `rxjs` package. The only difference is that our observable contains all the methods specific to Apollo, for example `refetch`.

<h2 id="options">Providing `options`</h2>

`watchQuery` and `query` methods expect one argument, an object with options. If you want to configure the query, you can provide any available option in the same object where the `query` key lives.

Those options will be passed to [`ApolloClient.watchQuery`][ApolloClient.watchQuery]. If your query takes variables, this is the place to pass them in: 

```ts
// Suppose our profile query took an avatar size
const CurrentUserForProfile = gql`
  query CurrentUserForProfile($avatarSize: Int!) {
    currentUser {
      login
      avatar_url(avatarSize: $avatarSize)
    }
  }
`;

class ProfileComponent {
  ngOnInit() {
    this.data = this.apollo.watchQuery({
      query: CurrentUserForProfile,
      variables: {
        avatarSize: 100
      }
    });
  }
}
```

<h2 id="observable-variables">Observable variables</h2>

Instead of using just primitive values inside `options.variables`, you can specify an observable. This way `watchQuery` method will wait for all the variables for being provided before it will do anything.

```ts
import { Subject } from 'rxjs/Subject';

// Suppose our profile query took an avatar size
const CurrentUserForProfile = gql`
  query CurrentUserForProfile($avatarSize: Int!) {
    currentUser {
      login
      avatar_url(avatarSize: $avatarSize)
    }
  }
`;

class ProfileComponent {
  avatarSize: Subject<number> = new Subject<number>();

  ngOnInit() {
    this.data = this.apollo.watchQuery({
      query: CurrentUserForProfile,
      variables: {
        avatarSize: this.avatarSize
      }
    });

    // nothing happens
    // watchQuery waits for the first emitted value

    setTimeout(() => {
      // query runs
      this.displayBig();
    }, 1000);
  }

  displayBig() {
    this.avatarSize.next(300);
  }

  displaySmall() {
    this.avatarSize.next(50);
  }
}
```

<h2 id="select-pipe">Using with AsyncPipe</h2>

In Angular, the simplest way of displaying data that comes from Observable is to put `AsyncPipe` on top of the property inside the UI. 
You can also achieve this with Apollo.

An observable returned by `watchQuery` method holds the actual result under the `data` field, so you can't directly access one of the properties of that object.

This is why we created `SelectPipe`. The only argument it receives is the name of property you want to get from `data`.

```ts
import { Component, OnInit } from '@angular/core';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import gql from 'graphql-tag';

const FeedQuery = gql`
  query Feed {
    currentUser {
      login
    }
    feed {
      createdAt
      score
    }
  }
`;

@Component({
  template: `
    <ul *ngFor="let entry of data | async | select: 'feed'">
      Score: {{entry.score}}
    </ul>
  `
})
class FeedComponent implements OnInit {
  data: ApolloQueryObservable<any>;

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({ query: FeedQuery });
  }
}
```

The result of the query has this structure:

```json
{
  "data": {
    "currentUser": { ... },
    "feed": [ ... ]
  }
}
```

Without using `SelectPipe` you would get the whole object instead of only the `data.feed`.

<h2 id="rxjs">Using with RxJS</h2>

`Angular2Apollo` is compatible with RxJS. It means that an observable called `ApolloQueryObservable`, returned by `watchQuery` method can be used with operators.

What's really interesting, because of this you can avoid using `SelectPipe`:

```ts
import { Component, OnInit } from '@angular/core';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import gql from 'graphql-tag';

import 'rxjs/add/operator/map';

const FeedQuery = gql`
  query Feed {
    currentUser {
      login
    }
    feed {
      createdAt
      score
    }
  }
`;

@Component({
  template: `
    <ul *ngFor="let entry of data | async">
      Score: {{entry.score}}
    </ul>
  `
})
class FeedComponent implements OnInit {
  data: ApolloQueryObservable<any>;

  constructor(private apollo: Angular2Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({ query: FeedQuery })
      .map(({data}) => data.feed);
  }
}
```

[ApolloQueryResult]: /core/apollo-client-api.html#ApolloQueryResult
[ApolloClient.watchQuery]: /core/apollo-client-api.html#ApolloClient.watchQuery
