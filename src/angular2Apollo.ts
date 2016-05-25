/// <reference path="../typings/main.d.ts" />

import ApolloClient from 'apollo-client';

import {
  Provider,
  provide,
  OpaqueToken,
  Injectable,
  Inject,
} from '@angular/core';

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

  public watchQuery(options) {
    return this.client.watchQuery(options);
  }

  public mutate(options) {
    return this.client.mutate(options);
  }
}
