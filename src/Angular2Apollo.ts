import { Injectable, Inject } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloClient, ApolloQueryResult, WatchQueryOptions, MutationOptions, SubscriptionOptions } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FragmentDefinitionNode } from 'graphql';

import { APOLLO_CLIENT_INSTANCE } from './tokens';
import { ApolloQueryObservable } from './ApolloQueryObservable';

export interface DeprecatedWatchQueryOptions extends WatchQueryOptions {
  fragments?: FragmentDefinitionNode[];
}

@Injectable()
export class Angular2Apollo {
  constructor(
    @Inject(APOLLO_CLIENT_INSTANCE) private client: ApolloClient,
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
    // XXX Try to remove it soon
    if (typeof this.client.subscribe === 'undefined') {
      throw new Error(`Your version of ApolloClient doesn't support subscriptions`);
    }

    return from(this.client.subscribe(options));
  }

  public getClient(): ApolloClient {
    return this.client;
  }
}
