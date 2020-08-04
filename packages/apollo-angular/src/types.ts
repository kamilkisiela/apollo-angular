import {
  WatchQueryOptions as CoreWatchQueryOptions,
  QueryOptions as CoreQueryOptions,
  MutationOptions as CoreMutationOptions,
  SubscriptionOptions as CoreSubscriptionOptions,
  ApolloClientOptions,
} from '@apollo/client/core';
import {ExecutionResult, DocumentNode} from 'graphql';
import {TypedDocumentNode} from '@graphql-typed-document-node/core';

export type EmptyObject = {
  [key: string]: any;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WatchQueryOptionsAlone<TVariables, TQuery = EmptyObject>
  extends Omit<WatchQueryOptions<TVariables, TQuery>, 'query' | 'variables'> {}

export interface QueryOptionsAlone<TVariables>
  extends Omit<CoreQueryOptions<TVariables>, 'query' | 'variables'> {}

export interface MutationOptionsAlone<TData, TVariables>
  extends Omit<
    CoreMutationOptions<TData, TVariables>,
    'mutation' | 'variables'
  > {}

export interface SubscriptionOptionsAlone<TVariables>
  extends Omit<CoreSubscriptionOptions<TVariables>, 'query' | 'variables'> {}

export interface WatchQueryOptions<TVariables, TData>
  extends CoreWatchQueryOptions<TVariables> {
  /**
   * Observable starts with `{ loading: true }`.
   * There's a big chance the next major version will enable that by default.
   *
   * Disabled by default
   */
  useInitialLoading?: boolean;
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
}

export interface MutationOptions<TData, TVariables>
  extends MutationOptionsAlone<TData, TVariables> {
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
}

export interface SubscriptionOptions<TData, TVariables>
  extends SubscriptionOptionsAlone<TVariables> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
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
