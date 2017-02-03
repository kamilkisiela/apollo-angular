import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { Injectable, NgModule } from '@angular/core';
import { Apollo, ApolloModule, APOLLO_DIRECTIVES } from 'apollo-angular';
import { ConfigService } from './config.service';

import 'whatwg-fetch';

@Injectable()
export class Client {
  public client: ApolloClient;
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

export function ApolloFactory(client: Client) {
  return new Apollo({ 'default': client.client });
}

@NgModule({
  providers: [Client, {
    provide: ApolloModule,
    useFactory: ApolloFactory,
    deps: [Client]
  }]
})

export class ConfiguredApolloModule { }
