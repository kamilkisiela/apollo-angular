import { Provider, provide, OpaqueToken, Injectable, Inject } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloQueryResult } from 'apollo-client';

import { ApolloQueryObservable } from './ApolloQueryObservable';

import ApolloClient from 'apollo-client';

import 'rxjs/add/operator/switchMap';

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
  ) {}

  public watchQuery(options): ApolloQueryObservable<ApolloQueryResult> {
    return new ApolloQueryObservable(rxify(this.client.watchQuery)(options));
  }

  public query(options) {
    return this.client.query(options);
  }

  public mutate(options) {
    return this.client.mutate(options);
  }
}
