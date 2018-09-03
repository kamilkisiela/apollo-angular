import {
  WatchQueryOptions as CoreWatchQueryOptions,
  QueryOptions as CoreQueryOptions,
  MutationOptions as CoreMutationOptions,
  SubscriptionOptions as CoreSubscriptionOptions,
} from 'apollo-client';
import {ExecutionResult} from 'graphql';

export type R = Record<string, any>;

export type TypedVariables<T> = {
  variables?: T;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WatchQueryOptions
  extends Omit<CoreWatchQueryOptions, 'query' | 'variables'> {}

export interface QueryOptions
  extends Omit<CoreQueryOptions, 'query' | 'variables'> {}

export interface MutationOptions
  extends Omit<CoreMutationOptions, 'mutation' | 'variables'> {}

export interface SubscriptionOptions
  extends Omit<CoreSubscriptionOptions, 'query' | 'variables'> {}

export interface SubscriptionResult<T> extends ExecutionResult {
  data?: T;
}
