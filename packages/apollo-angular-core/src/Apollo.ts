import {Injectable} from '@angular/core';
import {
  ApolloClient,
  WatchQueryOptions,
  MutationOptions,
  ApolloQueryResult,
  SubscriptionOptions,
} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';

import {Watcher} from './Watcher';
import {ApolloOptions} from './types';
import {fromPromise} from './utils';

@Injectable()
export class Apollo {
  private client: ApolloClient<any>;

  public create<TCacheShape>(options: ApolloOptions): void {
    if (this.client) {
      throw new Error('Apollo has been already created');
    }

    this.client = new ApolloClient<TCacheShape>({...options} as any);
  }

  public watchQuery<T>(
    options: WatchQueryOptions
  ): Watcher<T> {
    this.beforeEach();

    return new Watcher<T>(this.client.watchQuery<T>({...options}));
  }

  public query<T>(
    options: WatchQueryOptions
  ): Observable<ApolloQueryResult<T>> {
    this.beforeEach();

    return fromPromise<ApolloQueryResult<T>>(() =>
      this.client.query<T>({...options})
    );
  }

  public mutate<T>(options: MutationOptions): Observable<FetchResult<T>> {
    this.beforeEach();

    return fromPromise<FetchResult<T>>(() => this.client.mutate<T>({...options}));
  }

  public subscribe(options: SubscriptionOptions): Observable<any> {
    this.beforeEach();

    return from(this.client.subscribe({...options}));
  }

  public getClient() {
    this.beforeEach();

    return this.client;
  }

  private beforeEach(): void {
    this.checkInstance();
  }

  private checkInstance(): void {
    if (!this.client) {
      throw new Error('Apollo has not been created yet');
    }
  }
}
