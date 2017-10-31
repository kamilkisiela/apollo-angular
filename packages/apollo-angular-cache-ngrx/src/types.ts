import {StoreObject} from 'apollo-cache-inmemory';
import {EntityState} from '@ngrx/entity';

export interface StoreRecord {
  id: string;
  value: StoreObject;
}
export interface CacheState extends EntityState<StoreRecord> {}
export interface State {
  cache: CacheState;
}
