import ApolloClient from 'apollo-client';

import {
  Provider,
  provide,
  OpaqueToken,
  Injectable,
  Inject,
} from '@angular/core';

import {
  ApolloQueryObservable,
} from './apolloQueryObservable';

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

  public watchQuery(options): ApolloQueryObservable<any> {
    return new ApolloQueryObservable(this.client.watchQuery(options));
  }

  public query(options) {
    return this.client.query(options);
  }

  public mutate(options) {
    return this.client.mutate(options);
  }
}
