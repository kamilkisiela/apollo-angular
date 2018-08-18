---
title: Local state management
description: Learn how to store your local data in Apollo Angular
---

We've learned how to manage remote data from our GraphQL server with Apollo Angular, but what should we do with our local data? We want to be able to access boolean flags and device API results from multiple components in our app, but don't want to maintain a separate NGRX or Redux store. Ideally, we would like the Apollo cache to be the single source of truth for all data in our client application.

That's where `apollo-link-state`, our solution for managing local data in Apollo Client, comes in. `apollo-link-state` allows you to store your local data inside the Apollo cache alongside your remote data. To access your local data, just query it with GraphQL. You can even request local and server data within the same query!

In this section, you'll learn how to simplify local state management in your app with `apollo-link-state`. We'll build client-side resolvers to help us execute local queries and mutations. You'll also learn how to query and update the cache with the `@client` directive. Let's jump right in!

<h2 id="setup">Setting up</h2>

`apollo-link-state` is already included in Apollo Angular Boost, so you don't have to install it. It's configurable on the `clientState` property on the Apollo Boost constructor:

```js
import { ApolloBoost } from 'apollo-boost';
import {defaults, resolvers} from './resolvers';

@NgModule({
  ...
})
export class AppModule {
  constructor(boost: ApolloBoost) {
    boost.create({
      uri: `https://nx9zvp49q7.lp.gql.zone/graphql`,
      clientState: {
        defaults,
        resolvers,
        typeDefs,
      },
    })
  }
}
```

The three options you can pass to `clientState` are:

<dl>
  <dt>[`defaults`](#defaults.html): Object</dt>
  <dd>The initial data you want to write to the Apollo cache when the client is initialized</dd>
  <dt>[`resolvers`](#resolvers.html): Object</dt>
  <dd>A map of functions that your GraphQL queries and mutations call in order to read and write to the cache</dd>
  <dt>[`typeDefs`](#schema.html): string | Array<string></dt>
  <dd>A string representing your client-side schema written in [Schema Definition Language](/docs/graphql-tools/generate-schema.html#schema-language). This schema is not used for validation (yet!), but is used for introspection in Apollo DevTools</dd>
</dl>

None of these options are required. If you don't specify anything, you will still be able to use the `@client` directive to query the cache.

If you'd like a deep dive into the `clientState` config properties, we recommend checking out the [`apollo-link-state` docs](/docs/link/links/state.html). Otherwise, get ready to learn about these properties gradually as we build queries and mutations for local data.

> If you’d like to follow along, please open our [example app](https://stackblitz.com/edit/apollo-angular-local-state) on StackBlitz. Since this example lives in the apollo-link-state repository.

<h2 id="mutations">Updating local data</h2>

There are two ways to perform mutations in `apollo-link-state`. The first way is directly writing to the cache by calling `cache.writeData` within a component. Direct writes are great for one-off mutations that don't depend on the data that's currently in the cache, such as writing a single value. The second way is creating a component with a GraphQL mutation that calls a client-side resolver. We recommend using resolvers if your mutation depends on existing values in the cache, such as adding an item to a list or toggling a boolean. You can think of direct writes like dispatching an action in NGRX, whereas resolvers offer a bit more structure like NGRX. Let's learn about both ways below!

<h3 id="direct-writes">Direct writes</h3>

Direct writes to the cache do not require a GraphQL mutation or a resolver function. They access your Apollo Client instance directly by using the `Apollo.getClient()` method. We recommend using this strategy for simple writes, such as writing a string, or one-off writes. It's important to note that direct writes are not implemented as GraphQL mutations under the hood, so you shouldn't include them in your schema. They also do not validate that the data you're writing to the cache is in the shape of valid GraphQL data. If either of these features are important to you, you should opt for a resolver instead.

Here's what a direct write looks like in our Blog app:

```ts
import {Component, OnInit, Input} from '@angular/core';
import {Apollo} from 'apollo-angular-boost';

@Component({
  selector: 'filter-link',
  template: `
    <button (click)="setFilter()" [disabled]="visibilityFilter === filter">
      <ng-content></ng-content>
    </button>
  `,
})
export class FilterLinkComponent implements OnInit {
  @Input()
  filter: string;

  constructor(private apollo: Apollo) {}

  setFilter() {
    this.apollo.getClient().writeData({
      data: {visibilityFilter: this.filter},
    });
  }
}
```

We got Apollo Client instance through `Apollo.getClient()` method.
From the client instance, you can directly call `client.writeData` and pass in the data you'd like to write to the cache.

What if we want to immediately subscribe to the data we just wrote to the cache? Let's create an `active` property on the link that marks the link's filter as active if it's the same as the current `visibilityFilter` in the cache. To immediately subscribe to a client-side mutation, use `Apollo.watchQuery` in a component.

```ts
import {Component, OnInit, Input} from '@angular/core';
import {gql, Apollo} from 'apollo-angular-boost';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const GET_VISIBILITY_FILTER = gql`
  {
    visibilityFilter @client
  }
`;

@Component({
  selector: 'filter-link',
  template: `
    <button (click)="setFilter()" [disabled]="visibilityFilter === filter">
      <ng-content></ng-content>
    </button>
  `,
})
export class FilterLinkComponent implements OnInit {
  @Input()
  filter: string;
  visibilityFilter: Observable<string>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.visibilityFilter = this.apollo
      .watchQuery({
        query: GET_VISIBILITY_FILTER,
      })
      .valueChanges.pipe(
        map(result => result.data && result.data.visibilityFilter),
      );
  }

  // ...
}
```

You'll notice in our query that we have an `@client` directive next to our `visibilityFilter` field. This tells Apollo Client's network stack to fetch the query from the cache instead of sending it to our GraphQL server. Once you call `client.writeData`, the query result will automatically update. All cache writes and reads are synchronous, so you don't have to worry about loading state.

<h3 id="resolvers">Resolvers</h3>

If you'd like to implement your local state update as a GraphQL mutation, then you'll need to specify a function in your resolver map. The resolver map is an object with resolver functions for each GraphQL object type. You can think of a GraphQL query or mutation as a tree of function calls for each field. These function calls resolve to data or another function call.

The signature of a resolver function is the exact same as resolver functions on the server built with [`graphql-tools`](/docs/graphql-tools/resolvers.html#Resolver-function-signature). Let's quickly recap the four parameters of a resolver function:

```js
fieldName: (obj, args, context, info) => result;
```

1. `obj`: The object containing the result returned from the resolver on the parent field or the `ROOT_QUERY` object in the case of a top-level query or mutation. Don't worry about this one too much for `apollo-link-state`.
2. `args`: An object containing all of the arguments passed into the field. For example, if you called a mutation with `updateNetworkStatus(isConnected: true)`, the `args` object would be `{ isConnected: true }`.
3. `context`: The context object, which is shared between your React components and your Apollo Client network stack. The most important thing to note here is that we've added the Apollo cache to the context for you, so you can manipulate the cache with `readQuery`, `writeQuery`, `readFragment`, `writeFragment`, and `writeData`. Learn more about those methods [here](../advanced/caching.html#direct).
4. `info`: Information about the execution state of the query. You will probably never have to use this one.

Let's take a look at an example of a resolver where we toggle a todo's completed status:

```ts
export const resolvers = {
  Mutation: {
    toggleTodo: (_, variables, {cache, getCacheKey}) => {
      const id = getCacheKey({__typename: 'TodoItem', id: variables.id});
      const fragment = gql`
        fragment completeTodo on TodoItem {
          completed
        }
      `;
      const todo = cache.readFragment({fragment, id});
      const data = {...todo, completed: !todo.completed};
      cache.writeData({id, data});
      return null;
    },
  },
};
```

In order to toggle the todo's completed status, we first need to query the cache to find out what the todo's current completed status is. We do this by reading a fragment from the cache with `cache.readFragment`. This function takes a fragment and an id, which corresponds to the todo item's cache key. We get the cache key by calling the `getCacheKey` that's on the context and passing in the item's `__typename` and `id`.

Once we read the fragment, we toggle the todo's completed status and write the updated data back to the cache. Since we don't plan on using the mutation's return result in our UI, we return null since all GraphQL types are nullable by default.

Let's learn how to trigger our `toggleTodo` mutation from our component:

```ts
import {Component, Input} from '@angular/core';
import {gql, Apollo} from 'apollo-angular-boost';

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: Int!) {
    toggleTodo(id: $id) @client
  }
`;

@Component({
  selector: 'todo',
  template: `
    <li
      *ngIf="task"
      (click)="toggle()"
      [ngStyle]="{'textDecoration': task.completed ? 'line-through' : 'none' }"
    >
      {{task.text}}
    </li>
  `,
})
export class TodoComponent {
  @Input()
  task: any;

  constructor(private apollo: Apollo) {}

  toggle() {
    this.apollo
      .mutate({
        mutation: TOGGLE_TODO,
        variables: {
          id: this.task.id,
        },
      })
      .subscribe();
  }
}
```

First, we create a GraphQL mutation that takes the todo's id we want to toggle as its only argument. We indicate that this is a local mutation by marking the field with a `@client` directive. This will tell `apollo-link-state` to call our `toggleTodo` mutation resolver in order to resolve the field. Then, we define `Apollo.mutate` in the component just as we would for a remote mutation. Finally, call in your GraphQL mutation in your component and trigger it from within the UI.

If you'd like to see an example of a local mutation adding a todo to a list, check out the `TodoList` component in the [StackBlitz](https://stackblitz.com/edit/apollo-angular-local-state?file=src%2Fapp%2Ftodo-list.component.ts).

<h2 id="queries">Querying local data</h2>

Querying the Apollo cache is similar to querying your GraphQL server. The only difference is that you add a `@client` directive on your local fields to indicate they should be resolved from the cache. Let's look at an example:

```ts
import {Component, OnInit} from '@angular/core';
import {gql, Apollo} from 'apollo-angular-boost';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const GET_TODOS = gql`
  {
    todos @client {
      id
      completed
      text
    }
    visibilityFilter @client
  }
`;

@Component({
  selector: 'todo-list',
  template: `
    <ul>
      <todo *ngFor="let task of todos | async" [task]="task"></todo>
    </ul>
  `,
})
export class TodoListComponent implements OnInit {
  todos: Observable<any[]>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.todos = this.apollo
      .watchQuery({
        query: GET_TODOS,
      })
      .valueChanges.pipe(
        map(({data}) =>
          this.getVisibleTodos(data.todos, data.visibilityFilter),
        ),
      );
  }

  private getVisibleTodos(todos, filter) {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
      default:
        throw new Error('Unknown filter: ' + filter);
    }
  }
}
```

First, we create our GraphQL query and add `@client` directives to `todos` and `visibilityFilter`. Then, we pass the query to `Apollo.watchQuery` and assign it to a component's property. Reading from the Apollo cache is synchronous, so you won't have to worry about tracking loading state.

Since the query runs as soon as the component is mounted, what do we do if there are no todos in the cache? We need to write an initial state to the cache before the query is run to prevent it from erroring out. That's where defaults come in!

<h3 id="defaults">Defaults</h3>

Your `defaults` object represents the initial state that you would like to write to the cache. It's important to provide defaults for your client-side queries, otherwise they could potentially error out if a mutation hasn't occurred before they run. The shape of your initial state should match how you plan to query it in your application.

```js
const defaults = {
  todos: [],
  visibilityFilter: 'SHOW_ALL',
};
```

Your defaults are written to the cache upon initialization of `apollo-link-state` before any operations have occurred. We also write them to the cache again if you reset the Apollo cache.

<h2 id="schema">Client-side schema</h2>

You can optionally pass a client-side schema to the `typeDefs` config property. This schema is not used for validation like it is on the server because the `graphql-js` modules for schema validation would dramatically increase your bundle size. Instead, your client-side schema is used for introspection in Apollo DevTools, where you can explore your schema in GraphiQL.

Your schema should be written in [Schema Definition Language](/docs/graphql-tools/generate-schema.html#schema-language). Let's view our schema for our todo app:

```js
const typeDefs = `
  type Todo {
    id: Int!
    text: String!
    completed: Boolean!
  }

  type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
  }

  type Query {
    visibilityFilter: String
    todos: [Todo]
  }
`;
```

If you open up Apollo DevTools and click on the `GraphiQL` tab, you'll be able to explore your client schema in the "Docs" section. This app doesn't have a remote schema, but if it did, you would be able to see your local queries and mutations alongside your remote ones. That's the cool part about `apollo-link-state` - it enables you to use GraphQL as a single, unified interface for all of your app's data.

![GraphiQL Console](../assets/client-schema.png)

<h2 id="combine-data">Combining local and remote data</h2>

What’s really cool about using a `@client` directive to specify client-side only fields is that you can actually combine local and remote data in one query.

<h2 id="next-steps">Next steps</h2>

Managing your local data with Apollo Client can simplify your state management code since the Apollo cache is your single source of truth for all data in your application. If you'd like to learn more about `apollo-link-state`, check out:

- [`apollo-link-state` docs](/docs/link/links/state.html): Dive deeper into the concepts we just learned, such as resolvers and mixed queries, by taking a look at the `apollo-link-state` docs.
- [The future of state management](https://blog.apollographql.com/the-future-of-state-management-dd410864cae2): Read about our vision for the future of state management with GraphQL in the `apollo-link-state` announcement post.
