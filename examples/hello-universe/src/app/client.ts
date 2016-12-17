import {
  ApolloClient,
  createNetworkInterface
} from 'apollo-client';

import {
  Injectable,
  NgModule
} from '@angular/core';

import { Angular2Apollo, ApolloModule } from 'angular2-apollo';

@Injectable()
class GraphqlClient {
  private networkInterface: any;
  private client: ApolloClient;
  // you can inject other services here - e.g. url address, headers setup...
  constructor() {
    this.networkInterface = createNetworkInterface({
      uri: '/graphql',
      opts: {
        credentials: 'same-origin',
      },
    });
    this.networkInterface.use([{
      applyMiddleware(req, next) {
        req.options.headers = req.options.headers; // you can change headers here
        next();
      }
    }]);
    this.client = new ApolloClient({
      networkInterface: this.networkInterface
    });
  }
}

// @NgModule({
//   providers: [GraphqlClient, {
//     provide: Angular2Apollo, {
//       useFactory: (graphqlClient) => {
//         return new Angular2Apollo (graphqlClient.client);
//       },
//       deps: [GraphqlClient]
//     }
//   }],
//   imports: [ApolloModule],
//   exports: [ApolloModule]
// })
@NgModule({
  providers: [GraphqlClient, {
    provide: Angular2Apollo,
    useFactory: (gqlClient) => {
      return new Angular2Apollo(gqlClient.client);
    },
    deps: [GraphqlClient]
 }],
  imports: [ApolloModule],
  exports: [ApolloModule]
})

export class MyApolloClient {}
