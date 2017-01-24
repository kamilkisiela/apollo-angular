import { Injectable, Provider } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloClient, ApolloQueryResult, WatchQueryOptions, MutationOptions, SubscriptionOptions } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FragmentDefinitionNode } from 'graphql';

import { ApolloQueryObservable } from './ApolloQueryObservable';
import { APOLLO_CONFIG } from './tokens';
import { ApolloConfig } from './types';

export interface DeprecatedWatchQueryOptions extends WatchQueryOptions {
  fragments?: FragmentDefinitionNode[];
}

@Injectable()
export class ApolloBase {
  constructor(
    private client: ApolloClient,
  ) {}

  public watchQuery<T>(options: DeprecatedWatchQueryOptions): ApolloQueryObservable<ApolloQueryResult<T>> {
    return new ApolloQueryObservable(rxify(this.client.watchQuery)(options));
  }

  public query<T>(options: DeprecatedWatchQueryOptions): Observable<ApolloQueryResult<T>> {
    return fromPromise(this.client.query(options));
  }

  public mutate<T>(options: MutationOptions): Observable<ApolloQueryResult<T>> {
    return fromPromise(this.client.mutate(options));
  }

  public subscribe(options: SubscriptionOptions): Observable<any> {
    return from(this.client.subscribe(options));
  }

  public getClient(): ApolloClient {
    return this.client;
  }
}

@Injectable()
export class Apollo extends ApolloBase {
  // XXX: We assume user has a polyfill for Map (just like Angular does)
  private apolloMap: Map<string, ApolloBase> = new Map<string, ApolloBase>();

  constructor(config: ApolloConfig) {
    super(config['default']);

    for (const name in config) {
      if (typeof name === 'string' && name !== 'default') {
        this.apolloMap.set(name, new ApolloBase(config[name]));
      }
    }
  }

  public default(): ApolloBase {
    return this;
  }

  public use(name: string): ApolloBase {
    if (name === 'default') {
      return this.default();
    }
    return this.apolloMap.get(name);
  }
}

export const provideApollo: Provider = {
  provide: Apollo,
  useFactory: createApollo,
  deps: [APOLLO_CONFIG],
};

export function createApollo(apolloConfig: ApolloConfig): Angular2Apollo {
  return new Apollo(apolloConfig);
}
