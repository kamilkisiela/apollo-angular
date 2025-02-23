import { from, Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import type {
  ApolloQueryResult,
  FetchMoreQueryOptions,
  MaybeMasked,
  ObservableQuery,
  OperationVariables,
  SubscribeToMoreOptions,
  TypedDocumentNode,
  Unmasked,
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

export class QueryRef<TData, TVariables extends OperationVariables = EmptyObject> {
  public readonly valueChanges: Observable<ApolloQueryResult<TData>>;
  public readonly queryId: ObservableQuery<TData, TVariables>['queryId'];

  constructor(
    private readonly obsQuery: ObservableQuery<TData, TVariables>,
    ngZone: NgZone,
    options: WatchQueryOptions<TVariables, TData>,
  ) {
    const wrapped = wrapWithZone(from(fixObservable(this.obsQuery)), ngZone);

    this.valueChanges = options.useInitialLoading
      ? wrapped.pipe(useInitialLoading(this.obsQuery))
      : wrapped;
    this.queryId = this.obsQuery.queryId;
  }

  // ObservableQuery's methods

  public get options(): ObservableQuery<TData, TVariables>['options'] {
    return this.obsQuery.options;
  }

  public get variables(): ObservableQuery<TData, TVariables>['variables'] {
    return this.obsQuery.variables;
  }

  public result(): ReturnType<ObservableQuery<TData, TVariables>['result']> {
    return this.obsQuery.result();
  }

  public getCurrentResult(): ReturnType<ObservableQuery<TData, TVariables>['getCurrentResult']> {
    return this.obsQuery.getCurrentResult();
  }

  public getLastResult(): ReturnType<ObservableQuery<TData, TVariables>['getLastResult']> {
    return this.obsQuery.getLastResult();
  }

  public getLastError(): ReturnType<ObservableQuery<TData, TVariables>['getLastError']> {
    return this.obsQuery.getLastError();
  }

  public resetLastResults(): ReturnType<ObservableQuery<TData, TVariables>['resetLastResults']> {
    return this.obsQuery.resetLastResults();
  }

  public refetch(
    variables?: Parameters<ObservableQuery<TData, TVariables>['refetch']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['refetch']> {
    return this.obsQuery.refetch(variables);
  }

  public fetchMore<TFetchData = TData, TFetchVars extends OperationVariables = TVariables>(
    fetchMoreOptions: FetchMoreQueryOptions<TFetchVars, TFetchData> & {
      updateQuery?: (
        previousQueryResult: Unmasked<TData>,
        options: {
          fetchMoreResult: Unmasked<TFetchData>;
          variables: TFetchVars;
        },
      ) => Unmasked<TData>;
    },
  ): Promise<ApolloQueryResult<MaybeMasked<TFetchData>>> {
    return this.obsQuery.fetchMore(fetchMoreOptions);
  }

  public subscribeToMore<
    TSubscriptionData = TData,
    TSubscriptionVariables extends OperationVariables = TVariables,
  >(
    options: SubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData, TVariables>,
  ): ReturnType<ObservableQuery<TData, TVariables>['subscribeToMore']> {
    return this.obsQuery.subscribeToMore(options);
  }

  public updateQuery(
    mapFn: Parameters<ObservableQuery<TData, TVariables>['updateQuery']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['updateQuery']> {
    return this.obsQuery.updateQuery(mapFn);
  }

  public stopPolling(): ReturnType<ObservableQuery<TData, TVariables>['stopPolling']> {
    return this.obsQuery.stopPolling();
  }

  public startPolling(
    pollInterval: Parameters<ObservableQuery<TData, TVariables>['startPolling']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['startPolling']> {
    return this.obsQuery.startPolling(pollInterval);
  }

  public setOptions(
    opts: Parameters<ObservableQuery<TData, TVariables>['setOptions']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['setOptions']> {
    return this.obsQuery.setOptions(opts);
  }

  public setVariables(
    variables: Parameters<ObservableQuery<TData, TVariables>['setVariables']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['setVariables']> {
    return this.obsQuery.setVariables(variables);
  }
}
