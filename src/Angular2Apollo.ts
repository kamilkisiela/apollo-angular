import { Provider, provide, OpaqueToken, Injectable, Inject } from '@angular/core';

import { ApolloQueryObservable } from './ApolloQueryObservable';
import { ObservableQueryRef } from './utils/ObservableQuery';
import { observeVariables } from './utils/observeVariables';

import ApolloClient from 'apollo-client';
import assign = require('lodash.assign');
import omit = require('lodash.omit');

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

  public watchQuery(options): ApolloQueryObservable<any> {
    const apolloRef = new ObservableQueryRef();
    if (typeof options.variables === 'object') {
      const varObs = observeVariables(options.variables);

      return new ApolloQueryObservable(apolloRef, subscriber => {
        const sub = varObs.switchMap(newVariables => {
          const cleanOptions = omit(options, 'variables');
          const newOptions = assign(cleanOptions, { variables: newVariables });

          apolloRef.apollo = this.client.watchQuery(newOptions);

          return apolloRef.apollo;
        }).subscribe(subscriber);

        return () => sub.unsubscribe();
      });
    }

    apolloRef.apollo = this.client.watchQuery(options);
    return new ApolloQueryObservable(apolloRef, subscriber => {
        return apolloRef.apollo.subscribe(subscriber).unsubscribe;
    })
  }

  public query(options) {
    return this.client.query(options);
  }

  public mutate(options) {
    return this.client.mutate(options);
  }
}
