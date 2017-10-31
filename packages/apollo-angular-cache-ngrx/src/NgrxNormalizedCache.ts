import {Store, createFeatureSelector} from '@ngrx/store';
import {
  NormalizedCache,
  StoreObject,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';

import {featureName} from './const';
import {adapter} from './reducer';
import {State} from './types';
import {Set, Delete, Clear, Replace} from './actions';

const selectCache = (state: State) =>
  createFeatureSelector<State>(featureName)(state).cache;

export class NgrxNormalizedCache implements NormalizedCache {
  constructor(private store: Store<State>) {}

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

    this.store
      .select(adapter.getSelectors<State>(selectCache).selectEntities)
      .subscribe(result => {
        Object.keys(result).forEach(id => (selected[id] = result[id].value));
      });

    return selected;
  }

  private select(dataId?: string): StoreObject {
    let selected: StoreObject;

    this.store
      .select(adapter.getSelectors<State>(selectCache).selectEntities)
      .subscribe(result => {
        selected = result[dataId].value;
      });

    return selected;
  }

  public toObject(): NormalizedCacheObject {
    return this.selectAll();
  }
}
