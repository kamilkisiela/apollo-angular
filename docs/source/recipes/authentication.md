---
title: Authentication
---

Unless all of the data you are loading is completely public, your app has some sort of users, accounts and permissions systems. If different users have different permissions in your application, then you need a way to tell the server which user is associated with each request.

Apollo Client uses the ultra flexible [Apollo Link](/docs/link) that includes several options for authentication.

## Cookie

If your app is browser based and you are using cookies for login and session management with a backend, it is very easy to tell your network interface to send the cookie along with every request.

```ts
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const link = httpLink.create({
      uri: '/graphql',
      withCredentials: true
    });

    apollo.create({
      link,
      // other options like cache
    });
  }
}
```

`withCredentials` is simply passed to the [`HttpClient`](https://angular.io/api/common/http/HttpClient) used by the `HttpLink` when sending the query.

Note: the backend must also allow credentials from the requested origin. e.g. if using the popular 'cors' package from npm in node.js.

## Header

Another common way to identify yourself when using HTTP is to send along an authorization header. Apollo Links make creating middlewares that lets you modify requests before they are sent to the server. It's easy to add an `Authorization` header to every HTTP request. In this example, we'll pull the login token from `localStorage` every time a request is sent:

```js
import { HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink, HttpLink
  ) {
    const http = httpLink.create({uri: '/graphql'});

    const auth = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('token');
      // return the headers to the context so httpLink can read them
      // in this example we assume headers property exists
      // and it is an instance of HttpHeaders
      if (!token) {
        return {};
      } else {
        return {
          headers: headers.append('Authorization', `Bearer ${token}`)
        };
      }
    });

    apollo.create({
      link: auth.concat(http),
      // other options like cache
    });
  }
}
```

The server can use that header to authenticate the user and attach it to the GraphQL execution context, so resolvers can modify their behavior based on a user's role and permissions.

### Waiting for a refreshed token

In the case that you need to a refresh a token, for example when using the [adal.js](https://github.com/AzureAD/azure-activedirectory-library-for-js) library, you can use an observable wrapped in a promise to wait for a new token:

```ts
const auth = setContext(async(_, { headers }) => {
  // Grab token if there is one in storage or hasn't expired
  let token = this.auth.getCachedAccessToken();
  
  if (!token) {
    // An observable to fetch a new token
    // Converted .toPromise()
    await this.auth.acquireToken().toPromise();
    
    // Set new token to the response (adal puts the new token in storage when fetched)
    token = this.auth.getCachedAccessToken();
  }
  // Return the headers as usual
  return {
    headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
  };
});
```

<h2 id="login-logout">Reset store on logout</h2>

Since Apollo caches all of your query results, it's important to get rid of them when the login state changes.

The easiest way to ensure that the UI and store state reflects the current user's permissions is to call `Apollo.getClient().resetStore()` after your login or logout process has completed. This will cause the store to be cleared and all active queries to be refetched.

Another option is to reload the page, which will have a similar effect.

```ts
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      login
      avatar_url
    }
  }
`;

@Injectable()
class AuthService {
  apollo: Apollo;

  logout() {
    // some app logic

    // reset the store after that
    this.apollo.getClient().resetStore();
  }
}

@Component({
  template: `
    <ng-template *ngIf="loggedIn">
      <user-card [user]="user"></user-card>
      <button (click)="logout()">Logout</button>
    </ng-template>

    <button *ngIf="!loggedIn" (click)="goToLoginPage()">Go SignIn</button>
  `
})
class ProfileComponent {
  apollo: Apollo;
  auth: Auth;
  user: any;
  loggedIn: boolean;

  ngOnInit() {
    this.apollo.query({
      query: PROFILE_QUERY,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      this.user = data.currentUser;
    });
  }

  logout() {
    this.loggedIn = false;
    this.auth.logout();
  }
}
```
