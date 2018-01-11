import {
  ApolloQueryResult,
  ObservableQuery,
  ApolloError,
  FetchMoreQueryOptions,
  FetchMoreOptions,
  SubscribeToMoreOptions,
  UpdateQueryOptions,
} from 'apollo-client';
import {ApolloCurrentResult} from 'apollo-client/core/ObservableQuery';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';

import {wrapWithZone} from './utils';
import {R} from './types';

export class QueryRef<T, V = R> {
  public valueChanges: Observable<ApolloQueryResult<T>>;

  constructor(private obsQuery: ObservableQuery<T>) {
    this.valueChanges = wrapWithZone(from(this.obsQuery));
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

  public fetchMore(
    fetchMoreOptions: FetchMoreQueryOptions & FetchMoreOptions,
  ): Promise<ApolloQueryResult<T>> {
    return this.obsQuery.fetchMore(fetchMoreOptions);
  }

  public subscribeToMore(options: SubscribeToMoreOptions): () => void {
    return this.obsQuery.subscribeToMore(options);
  }
  public updateQuery(
    mapFn: (previousQueryResult: any, options: UpdateQueryOptions) => any,
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
