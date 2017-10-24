---
title: Mutations
order: 11
---

In addition to fetching data using queries, Apollo also handles GraphQL mutations. Mutations are identical to queries in syntax, the only difference being that you use the keyword `mutation` instead of `query` to indicate that the operation is used to change the dataset behind the schema.

```ts
mutation {
  submitRepository(repoFullName: "apollographql/apollo-client") {
    id
    repoName
  }
}
```

GraphQL mutations consist of two parts:

1. The mutation name with arguments (`submitRepository`), which represents the actual operation to be done on the server
2. The fields you want back from the result of the mutation to update the client (`id` and `repoName`)

The result of the above mutation might be:

```json
{
  "data": {
    "submitRepository": {
      "id": "123",
      "repoName": "apollographql/apollo-client"
    }
  }
}
```

When we use mutations in Apollo, the result is typically integrated into the cache automatically [based on the id of the result](cache-updates.html#dataIdFromObject), which in turn updates UI automatically, so we don't explicitly handle the results ourselves. In order for the client to correctly do this, we need to ensure we select the correct fields (as in all the fields that we care about that may have changed).

<h2 id="basics">Basic Mutations</h2>

Using `Apollo` it easy to call mutation. You can simply use `mutate` method.

```ts
import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const submitRepository = gql`
  mutation submitRepository {
    submitRepository(repoFullName: "apollographql/apollo-client") {
      createdAt
    }
  }
`;

@Component({ ... })
class NewEntryComponent {
  constructor(private apollo: Apollo) {}

  newRepository() {
    this.apollo.mutate({
      mutation: submitRepository
    });
  }
}
```

<h3 id="calling-mutations">Calling mutations</h3>

Most mutations will require arguments in the form of query variables, and you may wish to provide other options to [ApolloClient#mutate](/core/apollo-client-api.html#mutate). You can directly pass options to `mutate` when you call it in the wrapped component:

```ts
import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const submitRepository = gql`
  mutation submitRepository($repoFullName: String!) {
    submitRepository(repoFullName: $repoFullName) {
      createdAt
    }
  }
`;

@Component({ ... })
class NewEntryComponent {
  constructor(private apollo: Apollo) {}

  newRepository() {
    this.apollo.mutate({
      mutation: submitRepository,
      variables: {
        repoFullName: 'apollographql/apollo-client'
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }
}
```

As you can see, `mutate` method returns an `Observable` that resolves with `ApolloQueryResult`. It is the same result we get when we fetch queries.

However, typically you'd want to keep the concern of understanding the mutation's structure out of your presentational component. The best way to do this is to use a service to bind your mutate function:

```ts
import {Component, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
class SubmitRepositoryService {
  mutation = gql`
      mutation submitRepository($repoFullName: String!) {
        submitRepository(repoFullName: $repoFullName) {
          createdAt
        }
  }`;

  constructor(private apollo: Apollo) {
  }

  submitRepository(repoFullName: string) {
    return this.apollo.mutate({
      mutation: this.mutation,
      variables: {
        repoFullName: repoFullName
      }
    });
  }
}


@Component({ ... })
class NewEntryComponent {
  constructor(private submitRepoService: SubmitRepositoryService) {
  }

  newRepository() {
    this.submitRepoService.submitRepository('apollographql/apollo-client')
      .subscribe(({ data }) => {
        console.log('got data', data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
  }
}

```
> Note that in general you shouldn't attempt to use the results from the mutation callback directly, instead you can rely on Apollo's id-based cache updating to take care of it for you, or if necessary passing a [`updateQueries`](cache-updates.html#updateQueries) callback to update the result of relevant queries with your mutation results.

<h2 id="optimistic-ui">Optimistic UI</h2>

Sometimes your client code can easily predict the result of the mutation, if it succeeds, even before the server responds with the result. For instance, in GitHunt, when a user comments on a repository, we want to show the new comment in context immediately, without waiting on the latency of a round trip to the server, giving the user the experience of a snappy UI. This is what we call [Optimistic UI](http://info.meteor.com/blog/optimistic-ui-with-meteor-latency-compensation). This is possible if the client can predict an *Optimistic Response* for the mutation.

Apollo Client gives you a way to specify the `optimisticResponse` option, that will be used to update active queries immediately, in the same way that the server's mutation response will. Once the actual mutation response returns, the optimistic part will be thrown away and replaced with the real result.

```ts
import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const submitComment = gql`
  mutation submitComment($repoFullName: String!, $commentContent: String!) {
    submitComment(repoFullName: $repoFullName, commentContent: $commentContent) {
      postedBy {
        login
        html_url
      }
      createdAt
      content
    }
  }
`;

@Component({ ... })
class CommentPageComponent {
  currentUser: User;

  constructor(private apollo: Apollo) {}

  submit({ repoFullName, commentContent }) {
    this.apollo.mutate({
      mutation: submitComment,
      variables: { repoFullName, commentContent },
      optimisticResponse: {
        __typename: 'Mutation',
        submitComment: {
          __typename: 'Comment',
          postedBy: this.currentUser,
          createdAt: +new Date,
          content: commentContent,
        },
      },
    }).subscribe();
  }
}
```

For the example above, it is easy to construct an optimistic response, since we know the shape of the new comment and can approximately predict the created date. The optimistic response doesn't have to be exactly correct because it will always will be replaced with the real result from the server, but it should be close enough to make users feel like there is no delay.

> As this comment is *new* and not visible in the UI before the mutation, it won't appear automatically on the screen as a result of the mutation. You can use [`updateQueries`](cache-updates.html#updateQueries) to make it appear in this case (and this is what we do in GitHunt).

<h2 id="mutation-results">Designing mutation results</h2>

When people talk about GraphQL, they often focus on the data fetching side of things, because that's where GraphQL brings the most value. Mutations can be pretty nice if done well, but the principles of designing good mutations, and especially good mutation result types, are not yet well-understood in the open source community. So when you are working with mutations it might often feel like you need to make a lot of application-specific decisions.

In GraphQL, mutations can return any type, and that type can be queried just like a regular GraphQL query. So the question is - what type should a particular mutation return?

In GraphQL itself, there isn't any specification about how this is supposed to work. In most cases, the data available from a mutation result should be the server developer's best guess of the data a client would need to understand what happened on the server. For example, a mutation that creates a new comment on a blog post might return the comment itself. A mutation that reorders an array might need to return the new array.
