---
title: Updating the Store
---

Apollo performs two important core tasks: Executing queries and mutations, and caching the results.

Thanks to Apollo's store design, it's possible for the results of a query or mutation to update your UI in all the right places. In many cases it's possible for that to happen automatically, whereas in others you need to help the client out a little in doing so.

<h2 id="normalization">Normalization with `dataIdFromObject`</h2>

Apollo does result caching based on two things:

1. The shape of GraphQL queries and their results.
1. The identities of the objects returned from the server.

Flattening out the cache based on object identity is referred to as cache normalization. You can read about our caching model in detail in our blog post, ["GraphQL Concepts Visualized"](https://medium.com/apollo-stack/the-concepts-of-graphql-bc68bd819be3).

By default, Apollo identifies objects based on two properties: The `__typename` and an ID field, either `id` or `_id`. The client automatically adds the `__typename` field to your queries, so you just have to make sure to fetch the `id` field if you have one.

```ts
// This result
{
  __typename: 'Person',
  id: '1234',
  name: 'Jonas',
}

// Will get the following ID
'Person:1234'
```

You can also specify a custom function to generate IDs from each object, and supply it as the `dataIdFromObject` in the [`InMemoryCache`](../basics/caching.md#normalization) options, if you want to specify how Apollo will identify and de-duplicate the objects returned from the server.

```ts
import { InMemoryCache } from 'apollo-cache-inmemory';

// If your database has unique IDs across all types of objects, you can use
// a very simple function!
const cache = new InMemoryCache({
  dataIdFromObject: o => o.id
});
```

These IDs allow Apollo Client to reactively tell all queries that fetched a particular object about updates to that part of the store.

If you want to get the dataIdFromObjectFunction (for instance when using the [`readFragment` function](../basics/caching.md#readfragment)), you can import it from the InMemoryCache package;
```js
import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
const person = {
  __typename: 'Person',
  id: '1234',
};

defaultDataIdFromObject(person); // 'Person:1234'
```

<h3 id="automatic-updates">Automatic store updates</h3>

Let's look at a case where just using the cache normalization results in the correct update to our store. Let's say we do the following query:

```graphql
{
  post(id: '5') {
    id
    score
  }
}
```

Then, we do the following mutation:

```graphql
mutation {
  upvotePost(id: '5') {
    id
    score
  }
}
```

If the `id` field on both results matches up, then the `score` field everywhere in our UI will be updated automatically! One nice way to take advantage of this property as much as possible is to make your mutation results have all of the data necessary to update the queries previously fetched. A simple trick for this is to use [fragments](fragments.html) to share fields between the query and the mutation that affects it.

<h2 id="after-mutations">Updating after a mutation</h2>

In some cases, just using `dataIdFromObject` is not enough for your application UI to update correctly. For example, if you want to add something to a list of objects without refetching the entire list, or if there are some objects that to which you can't assign an object identifier, Apollo Client cannot update existing queries for you. Read on to learn about the other tools at your disposal.

<h3 id="refetchQueries">`refetchQueries`</h3>

`refetchQueries` is the simplest way of updating the cache. With `refetchQueries` you can specify one or more queries that you want to run after a mutation is completed in order to refetch the parts of the store that may have been affected by the mutation:

```ts
@Component({ ... })
class AppComponent {
  addComment() {
    this.apollo.mutate({
      ..., // insert comment mutation
      refetchQueries: [{
        query: gql`
          query updateCache($repoName: String!) {
            entry(repoFullName: $repoName) {
              id
              comments {
                postedBy {
                  login
                  html_url
                }
                createdAt
                content
              }
            }
          }
        `,
        variables: { repoName: 'apollographql/apollo-client' },
      }]
    }).subscribe();
  }
}
```

A very common way of using `refetchQueries` is to import queries defined for other components to make sure that those components will be updated:

```ts
import RepoCommentsQuery from '../queries/RepoCommentsQuery';

@Component({ ... })
class AppComponent {
  addComment() {
    this.apollo.mutate({
      //... insert comment mutation
      refetchQueries: [{
        query: RepoCommentsQuery,
        variables: { repoFullName: 'apollographql/apollo-client' },
      }],
    }).subscribe();
  }
}
```


<h3 id="directAccess">`update`</h3>

Using `update` gives you full control over the cache, allowing you to make changes to your data model in response to a mutation in any way you like. `update` is the recommended way of updating the cache after a query.

```ts
import CommentAppQuery from '../queries/CommentAppQuery';

const SUBMIT_COMMENT_MUTATION = gql`
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
class AppComponent {
  submit({ repoFullName, commentContent }) {
    this.apollo.mutate({
      variables: { repoFullName, commentContent },

      update: (store, { data: { submitComment } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: CommentAppQuery });
        // Add our comment from the mutation to the end.
        data.comments.push(submitComment);
        // Write our data back to the cache.
        store.writeQuery({ query: CommentAppQuery, data });
      },
    }).subscribe();
  }
}
```

<h3 id="updateQueries">`updateQueries`</h3>

**NOTE: We recommend using the more flexible `update` API instead of `updateQueries`. The `updateQueries` API may be deprecated in the future.**

As its name suggests, `updateQueries` lets you update your UI based on the result of a mutation. To re-emphasize: most of the time, your UI will update automatically based on mutation results, as long as the object IDs in the result match up with the IDs you already have in your store. See the [`normalization`](#normalization) documentation above for more information about how to take advantage of this feature.

However, if you are removing or adding items to a list with a mutation or can't assign object identifiers to the relevant objects, you'll have to use `updateQueries` to make sure that your UI reflects the change correctly.

We'll take the comments page within GitHunt as our example. When we submit a new comment, the "submit" button fires a mutation which adds a new comment to the "list" of the comments held on the server. In reality, the server doesn't know there's a list--it just knows that something is added to the `comments` table in SQL--so the server can't really tell us exactly where to put the result. The original query that fetched the comments for the list also doesn't know about this new comment yet, so Apollo can't automatically add it to the list for us.

In this case, we can use `updateQueries` to make sure that query result is updated, which will also update Apollo's normalized store to make everything remain consistent.

If you're familiar with Redux, think of the `updateQueries` option as a reducer, except instead of updating the store directly we're updating the query result shape, which means we don't have to worry about how the store internals work.

```ts
const SUBMIT_COMMENT_MUTATION = gql`
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
class AppComponent {
  submit({ repoFullName, commentContent }) {
    this.apollo.mutate({
      // options
      variables: { repoFullName, commentContent },

      updateQueries: {
        Comment: (prev, { mutationResult }) => {
          const newComment = mutationResult.data.submitComment;

          return pushComment(prev, newComment);
        }
      }
    }).subscribe()
  }
}
```

If we were to look carefully at the server schema, we'd see that the mutation actually returns information about the single new comment that was added. It does not refetch the whole list of comments. This makes a lot of sense: if we have a thousand comments on a page, we don't want to refetch all of them if we add a single new comment.

The comments page itself is rendered with the following query:

```ts
const COMMENT_QUERY = gql`
  query Comment($repoName: String!) {
    currentUser {
      login
      html_url
    }

    entry(repoFullName: $repoName) {
      id
      postedBy {
        login
        html_url
      }
      createdAt
      comments {
        postedBy {
          login
          html_url
        }
        createdAt
        content
      }
      repository {
        full_name
        html_url
        description
        open_issues_count
        stargazers_count
      }
    }
  }`;
```

Now, we have to incorporate the newly added comment returned by the mutation into the information that was already returned by the `COMMENT_QUERY` that was fired when the page was loaded. We accomplish this through `updateQueries`. Zooming in on that portion of the code:

```ts
@Component({ ... })
class AppComponent {
  submit() {
    this.apollo.mutate({
      // ...
      updateQueries: {
        Comment: (prev, { mutationResult }) => {
          const newComment = mutationResult.data.submitComment;
          return pushComment(prev, newComment);
        },
      },
    })
  }
}
```

Fundamentally, `updateQueries` is a map going from the name of a query (in our case, `Comment`) to a function that receives the previous result that this query received as well as the result returned by the mutation. In our case, the mutation returns information about the new comment. This function should then incorporate the mutation result into a new object containing the result previously received by the query (`prev`) and return that new object.

Note that the function must not alter the `prev` object (because `prev` is compared with the new object returned to see what changes the function made and hence what prop updates are needed).

In our `updateQueries` function for the `Comment` query, we're doing something really simple: just adding the comment we just submitted to the list of comments that the query asks for. We're doing that using the `pushComment` function to add the comment to the list.

Once the mutation fires and the result arrives from the server (or, a result is provided through optimistic UI), our `updateQueries` function for the `Comment` query will be called and the `Comment` query will be updated accordingly. Our UI will update with the new information!

<h2 id="fetchMore">Incremental loading: `fetchMore`</h2>

`fetchMore` can be used to update the result of a query based on the data returned by another query. Most often, it is used to handle infinite-scroll pagination or other situations where you are loading more data when you already have some.

In our GitHunt example, we have a paginated feed that displays a list of GitHub repositories. When we hit the "Load More" button, we don't want Apollo Client to throw away the repository information it has already loaded. Instead, it should just append the newly loaded repositories to the list that Apollo Client already has in the store. With this update, our UI component should re-render and show us all of the available repositories.

Let's see how to do that with the `fetchMore` method on a query:

```ts
import { QueryRef } from 'apollo-angular';

const FeedQuery = gql`
  query Feed($type: FeedType!, $offset: Int, $limit: Int) {
    # ...
  }
`;

@Component({ ... })
class AppComponent {
  feed: any[];
  feedQuery: QueryRef<any>;

  loadMore() {
    return this.feedQuery.fetchMore({
      variables: {
        offset: this.feed.length
      },

      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult; }

        return Object.assign({}, previousResult, {
          feed: [...previousResult.feed, ...fetchMoreResult.feed],
        });
      }
    });
  }
}
```

We are creating the `loadMore` method to do the following:

```ts
return this.feedQuery.fetchMore({
  variables: {
    offset: this.feed.length,
  },
  updateQuery: (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult.data) { return prev; }
    return Object.assign({}, prev, {
      feed: [...prev.feed, ...fetchMoreResult.feed],
    });
  },
});
```

The `fetchMore` method takes a map of `variables` to be sent with the new query. Here, we're setting the offset to `feed.length` so that we fetch items that aren't already displayed on the feed. This variable map is merged with the one that's been specified for the query associated with the component. This means that other variables, e.g. the `limit` variable, will have the same value as they do within the component query.

It can also take a `query` named argument, which can be a GraphQL document containing a query that will be fetched in order to fetch more information.

When we call `QueryRef.fetchMore`, Apollo will fire the `fetchMore` query and use the logic in the `updateQuery` option to incorporate that into the original result. The named argument `updateQuery` should be a function that takes the previous result of the query associated with your component and the information returned by the `fetchMore` query and return a combination of the two.

Here, the `fetchMore` query is the same as the query associated with the component. Our `updateQuery` takes the new feed items returned and just appends them onto the feed items that we'd asked for previously. With this, the UI will update and the feed will contain the next page of items!

Although `fetchMore` is often used for pagination, there are many other cases in which it is applicable. For example, suppose you have a list of items (say, a collaborative todo list) and you have a way to fetch items that have been updated after a certain time. Then, you don't have to refetch the whole todo list to get updates: you can just incorporate the newly added items with `fetchMore`, as long as your `updateQuery` function correctly merges the new results.


<h2 id="cacheRedirect">Cache redirects with `cacheRedirects`</h2>

In some cases, a query requests data that already exists in the client store under a different key. A very common example of this is when your UI has a list view and a detail view that both use the same data. The list view might run the following query:

```graphql
query ListView {
  books {
    id
    title
    abstract
  }
}
```

When a specific book is selected, the detail view displays an individual item using this query:

```graphql
query DetailView {
  book(id: $id) {
    id
    title
    abstract
  }
}
```

> Note: The data returned by the list query has to include all the data the specific query needs. If the specific book query fetches a field that the list query doesn't return Apollo Client cannot return the data from the cache.

We know that the data is most likely already in the client cache, but because it's requested with a different query, Apollo Client doesn't know that. In order to tell Apollo Client where to look for the data, we can define custom resolvers:

```
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      book: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Book', id: args.id })
    },
  },
});
```

> Note: This'll also work with custom `dataIdFromObject` methods as long as you use the same one.

Apollo Client will use the ID returned by the custom resolver to look up the item in its cache. `getCacheKey` is passed inside the third argument to the resolver to generate the key of the object based on its `__typename` and `id`.

To figure out what you should put in the `__typename` property run one of the queries in GraphiQL and get the `__typename` field:

```graphql
query ListView {
  books {
    __typename
  }
}

# or

query DetailView {
  book(id: $id) {
    __typename
  }
}
```

The value that's returned (the name of your type) is what you need to put into the `__typename` property.

It is also possible to return a list of IDs:

```ts
cacheRedirects: {
  Query: {
    books: (_, args, { getCacheKey }) =>
      args.ids.map(id =>
        getCacheKey({ __typename: 'Book', id: id }))
  },
},
```
