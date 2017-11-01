import {Store} from '@ngrx/store';
import {
  NormalizedCache,
  StoreObject,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import {take} from 'rxjs/operator/take';

import {adapter} from './reducer';
import {
  State,
  Dictionary,
  StoreRecord,
  NgrxCacheOptions,
  CacheSelector,
} from './types';
import {Set, Delete, Clear, Replace} from './actions';

export class NgrxNormalizedCache implements NormalizedCache {
  private cacheSelector: CacheSelector;

  constructor(private store: Store<State>, private options: NgrxCacheOptions) {
    this.cacheSelector = this.options.selector;
  }

  public get(dataId: string): StoreObject {
    return this.select(dataId);
  }

  public set(dataId: string, value: StoreObject): void {
    this.store.dispatch<Set>(
      new Set({
        id: dataId,
        value,
      }),
    );
  }
  public delete(dataId: string): void {
    this.store.dispatch<Delete>(new Delete({id: dataId}));
  }

  public clear(): void {
    this.store.dispatch<Clear>(new Clear());
  }

  public replace(newData: NormalizedCacheObject): void {
    const array = Object.keys(newData).map(id => ({
      id,
      value: newData[id],
    }));
    this.store.dispatch<Replace>(new Replace(array));
  }

  private selectAll(): NormalizedCacheObject {
    let selected: NormalizedCacheObject = {};

    take
      .call(
        this.store.select(
          adapter.getSelectors<State>(this.cacheSelector).selectEntities,
        ),
        1,
      )
      .subscribe((result: Dictionary<StoreRecord>) => {
        Object.keys(result).forEach(
          id => (selected[id] = result[id] && result[id].value),
        );
      });

    return selected;
  }

  private select(dataId?: string): StoreObject {
    let selected: StoreObject;

    take
      .call(
        this.store.select(
          adapter.getSelectors<State>(this.cacheSelector).selectEntities,
        ),
        1,
      )
      .subscribe((result: Dictionary<StoreRecord>) => {
        selected = result[dataId] && result[dataId].value;
      });

    return selected;
  }

  public toObject(): NormalizedCacheObject {
    return this.selectAll();
  }
}
