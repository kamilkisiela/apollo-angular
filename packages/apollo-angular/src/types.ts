import {
  WatchQueryOptions as CoreWatchQueryOptions,
  QueryOptions as CoreQueryOptions,
  MutationOptions as CoreMutationOptions,
  SubscriptionOptions as CoreSubscriptionOptions,
  ApolloClientOptions,
} from '@apollo/client/core';
import {ExecutionResult} from 'graphql';

export type EmptyObject = {
  [key: string]: any;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WatchQueryOptionsAlone<TVariables>
  extends Omit<WatchQueryOptions<TVariables>, 'query' | 'variables'> {}

export interface QueryOptionsAlone<TVariables>
  extends Omit<CoreQueryOptions<TVariables>, 'query' | 'variables'> {}

export interface MutationOptionsAlone<TData, TVariables>
  extends Omit<
    CoreMutationOptions<TData, TVariables>,
    'mutation' | 'variables'
  > {}

export interface SubscriptionOptionsAlone<TVariables>
  extends Omit<CoreSubscriptionOptions<TVariables>, 'query' | 'variables'> {}

export interface WatchQueryOptions<TVariables>
  extends CoreWatchQueryOptions<TVariables> {
  /**
   * Observable starts with `{ loading: true }`.
   * There's a big chance the next major version will enable that by default.
   *
   * Disabled by default
   */
  useInitialLoading?: boolean;
}

export interface SubscriptionResult<TData> extends ExecutionResult {
  data?: TData;
}

export type NamedOptions = Record<string, ApolloClientOptions<any>>;

export type Flags = {
  /**
   * Observable starts with `{ loading: true }`.
   * There's a big chance the next major version will enable that by default.
   *
   * Disabled by default
   */
  useInitialLoading?: boolean;
};
