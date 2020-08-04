import {NgZone} from '@angular/core';
import {
  ApolloQueryResult,
  ObservableQuery,
  ApolloError,
  FetchMoreQueryOptions,
  FetchMoreOptions,
  SubscribeToMoreOptions,
  UpdateQueryOptions,
} from '@apollo/client/core';
import {Observable, from} from 'rxjs';

import {wrapWithZone, fixObservable} from './utils';
import {WatchQueryOptions, EmptyObject} from './types';
import {startWith} from 'rxjs/operators';

export class QueryRef<T, V = EmptyObject> {
  public valueChanges: Observable<ApolloQueryResult<T>>;
  public options: ObservableQuery<T, V>['options'];
  public queryId: ObservableQuery<T, V>['queryId'];
  public variables: V;

  constructor(
    private obsQuery: ObservableQuery<T, V>,
    ngZone: NgZone,
    options: WatchQueryOptions<V>,
  ) {
    const wrapped = wrapWithZone(from(fixObservable(this.obsQuery)), ngZone);

    this.valueChanges = options.useInitialLoading
      ? wrapped.pipe(
          startWith({
            ...this.obsQuery.getCurrentResult(),
            error: undefined,
            partial: undefined,
            stale: true,
          }),
        )
      : wrapped;
    this.queryId = this.obsQuery.queryId;
  }

  // ObservableQuery's methods

  public result(): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.result();
  }

  public getLastResult(): ApolloQueryResult<T> {
    return this.obsQuery.getLastResult();
  }

  public getLastError(): ApolloError {
    return this.obsQuery.getLastError();
  }

  public resetLastResults(): void {
    return this.obsQuery.resetLastResults();
  }

  public refetch(variables?: V): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.refetch(variables);
  }

  public fetchMore<K extends keyof V>(
    fetchMoreOptions: FetchMoreQueryOptions<V, K> & FetchMoreOptions<T, V>,
  ): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.fetchMore(fetchMoreOptions);
  }

  public subscribeToMore<MT = any, MV = EmptyObject>(
    options: SubscribeToMoreOptions<T, MV, MT>,
  ): () => void {
    // XXX: there's a bug in apollo-client typings
    // it should not inherit types from ObservableQuery
    return this.obsQuery.subscribeToMore(options as any);
  }
  public updateQuery(
    mapFn: (previousQueryResult: T, options: UpdateQueryOptions<V>) => T,
  ): void {
    return this.obsQuery.updateQuery(mapFn);
  }

  public stopPolling(): void {
    return this.obsQuery.stopPolling();
  }

  public startPolling(pollInterval: number): void {
    return this.obsQuery.startPolling(pollInterval);
  }

  public setOptions(opts: any) {
    return this.obsQuery.setOptions(opts);
  }

  public setVariables(variables: V) {
    return this.obsQuery.setVariables(variables);
  }
}
