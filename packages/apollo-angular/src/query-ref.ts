import { from, Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import type {
  ApolloQueryResult,
  ObservableQuery,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client/core';
import { NetworkStatus } from '@apollo/client/core';
import { EmptyObject, WatchQueryOptions } from './types';
import { fixObservable, wrapWithZone } from './utils';

function useInitialLoading<T, V extends OperationVariables>(obsQuery: ObservableQuery<T, V>) {
  return function useInitialLoadingOperator<T>(source: Observable<T>): Observable<T> {
    return new Observable(function useInitialLoadingSubscription(subscriber) {
      const currentResult = obsQuery.getCurrentResult();
      const { loading, errors, error, partial, data } = currentResult;
      const { partialRefetch, fetchPolicy } = obsQuery.options;

      const hasError = errors || error;

      if (
        partialRefetch &&
        partial &&
        (!data || Object.keys(data).length === 0) &&
        fetchPolicy !== 'cache-only' &&
        !loading &&
        !hasError
      ) {
        subscriber.next({
          ...currentResult,
          loading: true,
          networkStatus: NetworkStatus.loading,
        } as any);
      }

      return source.subscribe(subscriber);
    });
  };
}

export type QueryRefFromDocument<T extends TypedDocumentNode> =
  T extends TypedDocumentNode<infer R, infer V> ? QueryRef<R, V & OperationVariables> : never;

export class QueryRef<TData, TVariables extends OperationVariables = EmptyObject>
  implements
    Pick<
      ObservableQuery<TData, TVariables>,
      | 'queryId'
      | 'options'
      | 'variables'
      | 'result'
      | 'getCurrentResult'
      | 'getLastResult'
      | 'getLastError'
      | 'resetLastResults'
      | 'refetch'
      | 'fetchMore'
      | 'subscribeToMore'
      | 'updateQuery'
      | 'stopPolling'
      | 'startPolling'
      | 'setOptions'
      | 'setVariables'
    >
{
  public readonly valueChanges: Observable<ApolloQueryResult<TData>>;

  // Types flow straight from ObservableQuery
  public readonly queryId;
  public readonly result;
  public readonly getCurrentResult;
  public readonly getLastResult;
  public readonly getLastError;
  public readonly resetLastResults;
  public readonly refetch;
  public readonly fetchMore;
  public readonly subscribeToMore;
  public readonly updateQuery;
  public readonly stopPolling;
  public readonly startPolling;
  public readonly setOptions;
  public readonly setVariables;

  constructor(
    private readonly query: ObservableQuery<TData, TVariables>,
    ngZone: NgZone,
    options: WatchQueryOptions<TVariables, TData>,
  ) {
    const wrapped = wrapWithZone(from(fixObservable(this.query)), ngZone);

    this.valueChanges = options.useInitialLoading
      ? wrapped.pipe(useInitialLoading(this.query))
      : wrapped;
    this.queryId = this.query.queryId;

    // ObservableQuery's methods
    this.result = this.query.result.bind(this.query);
    this.getCurrentResult = this.query.getCurrentResult.bind(this.query);
    this.getLastResult = this.query.getLastResult.bind(this.query);
    this.getLastError = this.query.getLastError.bind(this.query);
    this.resetLastResults = this.query.resetLastResults.bind(this.query);
    this.refetch = this.query.refetch.bind(this.query);
    this.fetchMore = this.query.fetchMore.bind(this.query);
    this.subscribeToMore = this.query.subscribeToMore.bind(this.query);
    this.updateQuery = this.query.updateQuery.bind(this.query);
    this.stopPolling = this.query.stopPolling.bind(this.query);
    this.startPolling = this.query.startPolling.bind(this.query);
    this.setOptions = this.query.setOptions.bind(this.query);
    this.setVariables = this.query.setVariables.bind(this.query);
  }

  public get options() {
    return this.query.options;
  }

  public get variables() {
    return this.query.variables;
  }
}
