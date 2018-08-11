import {Store, select} from '@ngrx/store';
import {
  NormalizedCache,
  StoreObject,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import {take} from 'rxjs/operators';

import {State} from './types';
import {Set, Delete, Clear, Replace} from './actions';

export class NgrxNormalizedCache implements NormalizedCache {
  constructor(private store: Store<State>, private stateKey: string) {}

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
    this.store.dispatch<Replace>(new Replace(newData));
  }

  private selectAll(): NormalizedCacheObject {
    let selected: NormalizedCacheObject = {};

    this.store
      .pipe(
        select(this.cacheSelector()),
        take(1),
      )
      .subscribe((cacheObject: NormalizedCacheObject) => {
        selected = cacheObject;
      });

    return selected;
  }

  private select(dataId?: string): StoreObject {
    let selected: StoreObject;

    this.store
      .pipe(
        select(this.cacheSelector()),
        take(1),
      )
      .subscribe((result: NormalizedCacheObject) => {
        selected = result[dataId] && result[dataId];
      });

    return selected;
  }

  private cacheSelector() {
    const stateKey = this.stateKey;
    return (state: any) => state[stateKey];
  }

  public toObject(): NormalizedCacheObject {
    return this.selectAll();
  }
}
