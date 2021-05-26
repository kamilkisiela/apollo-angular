import {
  WatchQueryOptions as CoreWatchQueryOptions,
  QueryOptions as CoreQueryOptions,
  MutationOptions as CoreMutationOptions,
  SubscriptionOptions as CoreSubscriptionOptions,
  ApolloClientOptions,
} from '@apollo/client/core';
import {TypedDocumentNode} from '@graphql-typed-document-node/core';
import {ExecutionResult} from 'graphql';

export type EmptyObject = {
  [key: string]: any;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ResultOf<T extends TypedDocumentNode> = T extends TypedDocumentNode<
  infer R
>
  ? R
  : never;

export type VariablesOf<
  T extends TypedDocumentNode
> = T extends TypedDocumentNode<any, infer V> ? V : never;

export interface WatchQueryOptionsAlone<TVariables, TData>
  extends Omit<WatchQueryOptions<TVariables, TData>, 'query' | 'variables'> {}

export interface QueryOptionsAlone<TVariables, TData>
  extends Omit<CoreQueryOptions<TVariables, TData>, 'query' | 'variables'> {}

export interface MutationOptionsAlone<TData, TVariables>
  extends Omit<
    CoreMutationOptions<TData, TVariables>,
    'mutation' | 'variables'
  > {}

export interface SubscriptionOptionsAlone<TVariables, TData>
  extends Omit<
    CoreSubscriptionOptions<TVariables, TData>,
    'query' | 'variables'
  > {}

export interface WatchQueryOptions<TVariables, TData>
  extends CoreWatchQueryOptions<TVariables, TData> {
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
