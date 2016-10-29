---
title: Server Side Rendering
---


Apollo provides two techniques to allow your applications to load quickly, avoiding unnecessary delays to users:

 - Store rehydration, which allows your initial set of queries to return data immediately without a server roundtrip.
 - Server side rendering, which renders the initial HTML view on the server before sending it to the client.

You can use one or both of these techniques to provide a better user experience.

<h2 id="store-rehydration">Store rehydration</h2>

For applications that can perform some queries on the server prior to rendering the UI on the client, Apollo allows for setting the initial state of data. This is sometimes called rehydration, since the data is "dehydrated" when it is serialized and included in the initial HTML payload.

For example, a typical approach is to include a script tag that looks something like:

```html
<script>
  // The contents of { ... } could be the result of client.store.getState(),
  // or synthetically generated to look similar
  window.__APOLLO_STATE__ = { ... };
</script>
```

You can then rehydrate the client using the initial state passed from the server:
```js
const client = new ApolloClient({
  initialState: window.__APOLLO_STATE__,
});
```

We'll see below how you can generate both the HTML and the Apollo store's state using Node and [Angular Universal](https://github.com/angular/universal).

If you are using Redux externally to Apollo, and already have store rehydration, you should pass the store state into the [`Store` constructor](http://redux.js.org/docs/basics/Store.html).

Then, when the client runs the first set of queries, the data will be returned instantly because it is already in the store!

If you are using [`forceFetch`](cache-updates.html#forceFetch) on some of the initial queries, you can pass the `ssrForceFetchDelay` option to skip force fetching during initialization, so that even those queries run using the cache:

```js
const client = new ApolloClient({
  initialState: window.__APOLLO_STATE__,
  ssrForceFetchDelay: 100,
});
```

<h2 id="server-rendering">Server-side rendering</h2>

You can render you entire Angular-based Apollo application on a Node server using [Angular Universal](https://github.com/angular/universal).

No changes are required to client queries to support this, so your Apollo-based Angular UI should support SSR out of the box.

<h3 id="server-initialization">Server initialization</h3>

In order to render your application on the server, you need to handle a HTTP request (using a server like Express with defined routes for your in-app routing that require HTML5 pushState), and then render your application to a string to pass back on the response.

We'll see how to take your component tree and turn it into a string in the next section, but you'll need to be a little careful in how you construct your Apollo Client instance on the server to ensure everything works there as well:

1. When [creating an Apollo Client instance](initialization.html) on the server, you'll need to set up you network interface to connect to the API server correctly. This might look different to how you do it on the client, since you'll probably have to use an absolute URL to the server if you were using a relative URL on the client.

2. Since you only want to fetch each query result once, pass the `ssrMode: true` option to the Apollo Client constructor to avoid repeated force-fetching.

3. You need to ensure that you create a new client or store instance for each request, rather than re-using the same client for multiple requests. Otherwise the UI will be getting stale data and you'll have problems with [authentication](auth.html).

<h2 id="example">An Example</h2>

Here's [a complete working example](https://github.com/kamilkisiela/universal-starter-apollo) of how would it look like once you put that all together.

It's a *starter kit*, so you can use it to start working with *Server-side Rendering* and *Apollo*.
