import { OpaqueToken, Injectable, Inject } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloClient, ApolloQueryResult, WatchQueryOptions, MutationOptions, SubscriptionOptions } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FragmentDefinitionNode } from 'graphql';

import { ApolloQueryObservable } from './ApolloQueryObservable';

export interface DeprecatedWatchQueryOptions extends WatchQueryOptions {
  fragments?: FragmentDefinitionNode[];
}

export const ApolloClientWrapper = new OpaqueToken('ApolloClientWrapper');
export const ApolloClientInstance = new OpaqueToken('ApolloClientInstance');

@Injectable()
export class Angular2Apollo {
  constructor(
    @Inject(ApolloClientInstance) private client: ApolloClient,
  ) {}

  public watchQuery(options: DeprecatedWatchQueryOptions): ApolloQueryObservable<ApolloQueryResult> {
    return new ApolloQueryObservable(rxify(this.client.watchQuery)(options));
  }

  public query(options: DeprecatedWatchQueryOptions): Observable<ApolloQueryResult> {
    return fromPromise(this.client.query(options));
  }

  public mutate(options: MutationOptions): Observable<ApolloQueryResult> {
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
