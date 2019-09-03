import {
  WatchQueryOptions as CoreWatchQueryOptions,
  QueryOptions as CoreQueryOptions,
  MutationOptions as CoreMutationOptions,
  SubscriptionOptions as CoreSubscriptionOptions,
} from 'apollo-client';
import {ExecutionResult} from 'graphql';

export type R = {
  [key: string]: any;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WatchQueryOptionsAlone<V>
  extends Omit<CoreWatchQueryOptions<V>, 'query' | 'variables'> {}

export interface QueryOptionsAlone<V>
  extends Omit<CoreQueryOptions<V>, 'query' | 'variables'> {}

export interface MutationOptionsAlone<T, V>
  extends Omit<CoreMutationOptions<T, V>, 'mutation' | 'variables'> {}

export interface SubscriptionOptionsAlone<V>
  extends Omit<CoreSubscriptionOptions<V>, 'query' | 'variables'> {}

export interface WatchQueryOptions<V> extends CoreWatchQueryOptions<V> {
  useInitialLoading?: boolean;
}

export interface SubscriptionResult<T> extends ExecutionResult {
  data?: T;
}
