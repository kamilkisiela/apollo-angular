import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { Injectable, NgModule } from '@angular/core';
import { Angular2Apollo, ApolloModule } from 'angular2-apollo';
import { ConfigService } from './config.service';

import 'whatwg-fetch';

@Injectable()
export class Client {
  client: ApolloClient;
  private networkInterface: any;

  constructor(private config: ConfigService) {
    this.networkInterface = createNetworkInterface({
      uri: this.config.getGraphQLUrl(),
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

export function ApolloFactory (gqlClient: Client) {
  return new Angular2Apollo(gqlClient.client);
}

@NgModule({
  providers: [Client, {
    provide: Angular2Apollo,
    useFactory: ApolloFactory,
    deps: [Client]
 }]
})

export class MyApolloModule {}
