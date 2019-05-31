import {NgZone} from '@angular/core';
import {
  ApolloQueryResult,
  ObservableQuery,
  ApolloError,
  FetchMoreQueryOptions,
  FetchMoreOptions,
  SubscribeToMoreOptions,
  UpdateQueryOptions,
  ApolloCurrentResult,
} from 'apollo-client';
import {Observable, from} from 'rxjs';

import {wrapWithZone, fixObservable} from './utils';
import {R} from './types';

export class QueryRef<T, V = R> {
  public valueChanges: Observable<ApolloQueryResult<T>>;
  public options: ObservableQuery<T, V>['options'];
  public queryId: ObservableQuery<T, V>['queryId'];
  public variables: V;

  constructor(private obsQuery: ObservableQuery<T, V>, ngZone: NgZone) {
    this.valueChanges = wrapWithZone(
      from(fixObservable(this.obsQuery)),
      ngZone,
    );
    this.queryId = this.obsQuery.queryId;
  }

  // ObservableQuery's methods

  public result(): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.result();
  }

  public currentResult(): ApolloCurrentResult<T> {
    return this.obsQuery.currentResult();
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

  public subscribeToMore<MT = any, MV = R>(
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

  public setOptions(opts: any): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.setOptions(opts);
  }

  public setVariables(
    variables: V,
    tryFetch: boolean = false,
    fetchResults = true,
  ): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.setVariables(variables, tryFetch, fetchResults);
  }
}
