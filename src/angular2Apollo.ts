import ApolloClient from 'apollo-client';

import {
  Provider,
  provide,
  OpaqueToken,
  Injectable,
  Inject,
} from 'angular2/core';

export const angularApolloClient = new OpaqueToken('AngularApolloClient');
export const defaultApolloClient = (client: ApolloClient): Provider => {
  return provide(angularApolloClient, {
    useValue: client,
  });
};

@Injectable()
export class Angular2Apollo {
  constructor(
    @Inject(angularApolloClient) private client: any
  ) {

  }

  public watchQuery(query) {
    return this.client.watchQuery(query);
  }
}
