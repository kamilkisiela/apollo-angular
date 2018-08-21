---
title: Query, Mutation, Subscription services
description: Additional API to use GraphQL in Angular
---

If you're familiar with the library, you already know the Apollo service.
It is a regular Angular service, pretty much the only one you need to use.

The API is straightforward, `query` and `watchQuery` methods for Queries, `mutate` and `subscribe` accordingly for Mutations and Subscriptions. There is more than that but if you don't do anything advanced that's all you really need.

We decided to introduce a new approach of working with GraphQL in Angular.

There are now 3 new APIs: `Query`, `Mutation` and `Subscription`. Each of them allows to define the shape of a result & variables.
The only thing you need to do is to set the document property. That’s it, you use it as a regular Angular service.

In this approach GraphQL Documents are first-class citizens, you think about the query, for example, as a main subject.

## Query

To get started with the new API, let's see how you define queries with it.

You create a service and extend it with a `Query` class from `apollo-angular`. Only thing you need to set is a `document` property.

```ts
import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class AllPostsGQL extends Query {
  document = gql`
    query allPosts {
      posts {
        id
        title
        votes
        author {
          id
          firstName
          lastName
        }
      }
    }
  `;
}
```

We have now a ready to use GraphQL Query that takes advantage of `Apollo` service under the hood.

### Basic example

Let's see how to actually use it in a component:

```ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import a service
import { Post, AllPostsGQL } from './graphql';

@Component({...})
export class ListComponent implements OnInit {
  posts: Observable<Post[]>;

  // inject it
  constructor(private allPostsGQL: AllPostsGQL) {}

  ngOnInit() {
    // use it!
    this.posts = this.allPostsGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.posts)
      );
  }
}
```

### Example with variables

```ts
@Component({...})
export class ListComponent implements OnInit {

  // ...

  ngOnInit() {
    // variables as first argument
    // options as second
    this.posts = this.allPostsGQL.watch({
      first: 10
    }, {
      fetchPolicy: 'network-only'
    })
      .valueChanges
      .pipe(
        map(result => result.data.posts)
      );
  }
}
```

### API of Query

`Query` class has two methods:

- `watch(variables?, options?)` - it's the same as `Apollo.watchQuery` except it accepts variables as a first argument and regular options as the second one
- `fetch(variables?, options?)` - same as `Apollo.query`, it fetches data once.

## Mutation

You create a service and extend it with a `Mutation` class from `apollo-angular`. Only thing you need to set is a `document` property.

```ts
import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class UpvotePostGQL extends Mutation {
  document = gql`
    mutation upvotePost($postId: Int!) {
      upvotePost(postId: $postId) {
        id
        votes
      }
    }
  `;
}
```

We have now a ready to use GraphQL Mutation.

### Basic example

Let's see how to actually use it in a component:

```ts
import {Component, Input} from '@angular/core';
import {UpvotePostGQL} from './graphql';

@Component({
  selector: 'app-upvoter',
  template: `
    <button (click)="upvote()">
      Upvote
    </button>
  `,
})
export class UpvoterComponent {
  @Input()
  postId: number;

  constructor(private upvotePostGQL: UpvotePostGQL) {}

  upvote() {
    this.upvotePostGQL
      .mutate({
        postId: this.postId,
      })
      .subscribe();
  }
}
```

### API of Mutation

`Mutation` class has only one method:

- `mutate(variables?, options?)` - it's the same as `Apollo.mutate` except it accepts variables as a first argument and regular options as the second one.

## Subscription

You create a service and extend it with a `Subscription` class from `apollo-angular`. Only thing you need to set is a `document` property.

```ts
import {Injectable} from '@angular/core';
import {Subscription} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class NewPostGQL extends Subscription {
  document = gql`
    subscription newPost {
      newPost {
        id
        title
      }
    }
  `;
}
```

We have now a ready to use GraphQL Subscription.

### Basic example

Let's see how to actually use it in a component:

```ts
import {Component, Input} from '@angular/core';
import {NewPostGQL} from './graphql';

@Component({ ... })
export class AcitivityComponent {
  constructor(newPostGQL: NewPostGQL) {
    this.lastPost = newPostGQL.subscribe();
  }
}
```

### API of Subscription

`Subscription` class has only one method:

- `subscribe(variables?, options?, extraOptions?)` - it's the same as `Apollo.subscribe` except its first argument expect variables.
