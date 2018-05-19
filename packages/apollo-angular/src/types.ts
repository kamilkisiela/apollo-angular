import {WatchQueryOptions} from 'apollo-client';

export type R = Record<string, any>;

export type TypedVariables<T> = {
  variables?: T;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type StringLiteralDiff<T extends string, U extends string> = ({
  [P in T]: P
} &
  {[P in U]: never} & {[x: string]: never})[T];
export type Omit<T, K extends keyof T> = Pick<T, StringLiteralDiff<keyof T, K>>;

export interface QueryOptions
  extends Omit<WatchQueryOptions, 'query' | 'variables'> {}
