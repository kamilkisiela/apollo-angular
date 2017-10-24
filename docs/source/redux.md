---
title: Integrating with Redux
---


By default, Apollo Client creates its own internal Redux store to manage queries and their results. If you are already using Redux for the rest of your app, you can have the client integrate with your existing store instead.

This will let you better track the different events that happen in your app, and how your client and server side data changes interleave. It will also make using tools like the [Redux Dev Tools](https://github.com/zalmoxisus/redux-devtools-extension) more natural.

> Note: this guide focuses on the integration with [ng2-redux](https://github.com/angular-redux/ng2-redux). An integration with [ngrx/store](https://github.com/ngrx/store) is [theoretically possible](https://github.com/apollographql/apollo-client/issues/593#issuecomment-257047413) though too.

<h2 id="creating-a-store">Creating a store</h2>

If you want to use your own store, you'll need to pass in reducer and middleware from your Apollo Client instance into NgRedux.

```js
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { Action, combineReducers, applyMiddleware } from 'redux';

import { ApolloClient } from 'apollo-client';

import { todoReducer, userReducer } from './reducers';

const client = new ApolloClient();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private store: NgRedux<any>,
    devTools: DevToolsExtension,
  ) {
    const rootReducer = combineReducers({
      todos: todoReducer,
      users: userReducer,
      apollo: client.reducer() as any,
    });

    let enhancers = [
      applyMiddleware(client.middleware()),
    ];

    if (devTools.isEnabled()) {
      enhancers.push(devTools.enhancer());
    }

    store.configureStore(
      rootReducer,
      { /* initial state */ },
      [ /* epics */ ],
      enhancers
    );
  }
}
```

If you'd like to use a different root key for the client reducer (rather than apollo), use the reduxRootSelector: selector option when creating the client:

```js
const client = new ApolloClient({
  reduxRootSelector: state => state.differentKey,
});

const store = createStore(
  combineReducers({
    differentKey: client.reducer(),
  })
);
```
