---
title: Controlling the Store
order: 13
---

Apollo performs two important core tasks: executing queries and mutations, and caching the results.

Thanks to Apollo's store, it's possible for the results of a query or mutation to alter to your UI in all the relevant places. In many cases it's possible for that to happen automatically, whereas in others you need to help the client out a little in doing so.

<h2 id="dataIdFromObject">Using `dataIdFromObject`</h2>

Apollo's store is [constructed](http://dev.apollodata.com/core/how-it-works.html#normalize) one object at time, based on an ID generated from each object returned by your queries.

By default, Apollo cannot determine the IDs to use for object except through the position that they take in queries. However, if you specify a function to generate an ID from each object, and supply it as the `dataIdFromObject` in the [`ApolloClient` constructor](initialization.html#creating-client), you can create an unique ID for each "real" object.

```ts
import { ApolloClient } from 'apollo-client';

// If your database has unique IDs across all types of objects, you can use
// a very simple function!
// Remember: You'll need to ensure that you select IDs in every query
const client = new ApolloClient({
  dataIdFromObject: o => o.id
});

// If the IDs are only unique per type (this is typical if an ID is just an
// ID out of a database table), you can use the `__typename` field to scope it.
// This is a GraphQL field that's automatically available, but you do need
// to query for it also.
const client = new ApolloClient({
  dataIdFromObject: o => `${o.__typename}-${o.id},`
});
```

These IDs allow Apollo Client to reactively tell your queries about updates when new information becomes available.

In some cases, just using `dataIdFromObject` is not enough for your application UI to get these updates, as such ID-based updates can only affect documents that are already matching a given query.

For example, if you want to add something to a list of objects without refetching the entire list, or if there are some objects that you can't assign an object identifier to, Apollo Client cannot update existing queries for you. In those cases you have to use `fetchMore` in order to make sure that the queries on your page are updated with the right information and your UI updates correctly.

<h2 id="fetchMore">Using `fetchMore`</h2>

`fetchMore` can be used to manually update the result of one query based on the data returned by another query. Most often, it is used to handle pagination. In our GitHunt example, we have a paginated feed that displays a list of GitHub respositories. When we hit the "Load More" button, we don't want Apollo Client to throw away the repository information it has already loaded. Instead, it should just append the newly loaded repositories to the list of repositories that Apollo Client already has in the store. With this update, our UI component should re-render and show us all of the available repositories.

This is possible with `fetchMore`. The `fetchMore` method allows us to fetch another query and incorporate that query's result into the result that our component query previously received. We can see it in action within the [GitHunt](https://github.com/apollographql/githunt-angular) code:

```javascript
const feedQuery = gql`
  query Feed($type: FeedType!, $offset: Int, $limit: Int) {
    // ...
  }`;

class FeedComponent implements OnInit {
  type: Subject<string> = new Subject<string>();
  offset: number = 0;
  itemsPerPage: number = 10;
  feedObs: ApolloQueryObservable<any>;

  ngOnInit() {
    this.feedObs = this.apollo.watchQuery({
      query: feedQuery,
      variables: {
        type: this.type,
        offset: this.offset,
        limit: this.itemsPerPage,
      },
      forceFetch: true,
    });
  }

  fetchMore() {
    this.feedObs.fetchMore({
      variables: {
        offset: this.offset + this.itemsPerPage,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev; }
        return Object.assign({}, prev, {
          feed: [...prev.feed, ...fetchMoreResult.feed],
        });
      },
    });
    this.offset += this.itemsPerPage;
  }
}
```

The `fetchMore` method takes a map of `variables` to be sent with the new query. Here, we're setting the new offset so that we fetch items that aren't already displayed on the feed. This variable map is merged with the one that's been specified for the query associated with the component. This means that other variables, e.g. the `limit` variable, will have the same value as they do within the component query.

It can also take a `query` named argument, which can be a GraphQL document containing a query that will be fetched in order to fetch more information; we refer to this as the `fetchMore` query. By default, the `fetchMore` query is the query associated with the component, i.e. the `feedQuery` in this case.

When we call `fetchMore`, Apollo Client will fire the `fetchMore` query and it needs to know how to incorporate the result of the query into the information the component is asking for. This is accomplished through `updateQuery`. The named argument `updateQuery` should be a function that takes the previous result of the query associated with your component (i.e. `feedQuery` in this case) and the information returned by the `fetchMore` query and combine the two.

Here, the `fetchMore` query is the same as the query associated with the component. Our `updateQuery` takes the new feed items returned and just appends them onto the feed items that we'd asked for previously. With this, the UI will update and the feed will contain the next page of items!

Although `fetchMore` is often used for pagination, there are many other cases in which it is applicable. For example, suppose you have a list of items (say, a collaborative todo list) and you have a query that fetches items that have been added to the list later. Then, you don't have to refetch the whole todo list: you can just incorporate the newly added items with `fetchMore` and specifying the `updateQuery` function correctly.

<h2 id="updateQueries">Using `updateQueries`</h2>

Just as `fetchMore` allows you to update your UI according to the result of a query, `updateQueries` lets you update your UI based on the result of a mutation. To re-emphasize: most of the time, your UI should just update automatically based on the result of a mutation as long as modified fields of objects and the object identifiers of modified objects are returned with the mutation (see the [`dataIdFromObject`](#dataIdFromObject) documentation above for more information).

However, if you are removing or adding items to a list with a mutation or can't assign object identifiers to some of your objects, you'll have to use `updateQueries` to make sure that your UI reflects the change correctly.

We'll take the comments page within GitHunt as our example. When we submit a new comment, the "submit" button fires a mutation which adds a new comment to the "list" of the comments held on the server. As the original query that fetched the comments for the list couldn't know about this comment, Apollo can't automatically add it to the list for us. So we'll use `updateQueries` to

We expose this mutation through a function prop that the `CommentsPage` component can call. This is what the code looks like:

```ts
const submitCommentMutation = gql`
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

class CommentsPageComponent {
  apollo: Apollo;
  currentUser: any;

  submit({ repoFullName, commentContent }) {
    this.apollo.mutate({
      mutation: submitCommentMutation,
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
        updateQueries: {
          Comment: (prev, { mutationResult }) => {
            if (!mutationResult.data) { return prev; }
            const newComments = mutationResult.data.submitComment;

            return Object.assign({}, prev, {
              entry: {
                comments: {}
              },
            });

            const newComment = mutationResult.data.submitComment;
            return update(prev, {
              entry: {
                comments: {
                  $unshift: [newComment],
                },
              },
            });
          },
        },
    }).subscribe();
  }
}
```

If we were to look carefully at the server schema, we'd see that the mutation actually returns information about the single new comment that was added; it doesn't refetch the whole list of comments. This makes a lot of sense: if we have a thousand comments on a page, we don't want to refetch each of them if we add a single new comment.

The comments page itself is rendered with the following query:

```ts
const commentQuery = gql`
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
  }
`;
```

Now, we have to incorporate the newly added comment returned by the mutation into the information that was already returned by the `commentQuery` that was fired when the page was loaded. We accomplish this through `updateQueries`. Zooming in on that portion of the code:

```ts
{
  //...
  updateQueries: {
    Comment: (prev, { mutationResult }) => {
      const newComment = mutationResult.data.submitComment;
      const prevComments = prev.entry.comments;

      return {
        entry: Object.assign(prev.entry, {
          comments: [newComment, ...prevComments]
        })
      };
    },
  },
}
```

Fundamentally, `updateQueries` is a map going from the name of a query (in our case, `Comment`) to a function that receives the previous result that this query received as well as the result returned by the mutation. In our case, the mutation returns information about the new comment. This function should then incorporate the mutation result into the result previously received by the query and return the combined result.

In our `updateQueries` function for the `Comment` query, we're doing something really simple: just adding the comment we just submitted to the list of comments that the query asks for.

Once the mutation fires and the result arrives from the server (or, a result is provided through optimistic UI), our `updateQueries` function for the `Comment` query will be called and the `Comment` query will be updated accordingly. These changes in the result will be mapped to component's property and our UI will update as well with the new information!
