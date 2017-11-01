import {StoreObject, ApolloReducerConfig} from 'apollo-cache-inmemory';
import {EntityState} from '@ngrx/entity';

export type CacheSelector = (state: any) => CacheState;

export type NgrxCacheOptions = {
  selector?: CacheSelector;
  storeFactory?: never;
} & ApolloReducerConfig;

export interface StoreRecord {
  id: string;
  value: StoreObject;
}
export interface CacheState extends EntityState<StoreRecord> {}
export interface State {
  cache: CacheState;
}
export type Dictionary<T> = {
  [id: string]: T;
};
