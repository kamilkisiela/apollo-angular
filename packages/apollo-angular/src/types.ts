export type R = Record<string, any>;

export type TypedVariables<T> = {
  variables?: T;
};

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}
