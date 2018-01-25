import {NormalizedCacheObject} from 'apollo-cache-inmemory';

export interface CacheState extends NormalizedCacheObject {}
export interface State {
  apollo: CacheState;
}
