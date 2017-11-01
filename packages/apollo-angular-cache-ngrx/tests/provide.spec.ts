import {setupAngular} from './_setup';

import {TestBed, inject, async} from '@angular/core/testing';
import {StoreModule, createFeatureSelector} from '@ngrx/store';
import gql, {disableFragmentWarnings} from 'graphql-tag';

import {
  NgrxCache,
  NgrxCacheRootModule,
  NgrxCacheFeatureModule,
  NgrxCacheModule,
  cacheReducer,
  CacheState,
} from '../src';

disableFragmentWarnings();

const defaultOptions = {addTypename: false};

describe('Provide', () => {
  beforeAll(() => setupAngular());

  /*beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgrxCacheRootModule],
    });
  });*/

  const makeTest = (text: string, testFn: (cache: NgrxCache) => void) => {
    test(text, async(inject([NgrxCache], testFn)));
  };

  const simpleRead = (options?: any) =>
    makeTest('will read some data from the store', cache => {
      const proxy = cache
        .create({
          ...defaultOptions,
          ...options,
        })
        .restore({
          ROOT_QUERY: {
            a: 1,
            b: 2,
            c: 3,
          },
        });
      expect(
        proxy.readQuery({
          query: gql`
            {
              a
            }
          `,
        }),
      ).toMatchObject({a: 1});
      expect(
        proxy.readQuery({
          query: gql`
            {
              b
              c
            }
          `,
        }),
      ).toMatchObject({b: 2, c: 3});
      expect(
        proxy.readQuery({
          query: gql`
            {
              a
              b
              c
            }
          `,
        }),
      ).toMatchObject({a: 1, b: 2, c: 3});
    });

  describe('three ways of providing Cache', () => {
    describe('by RootModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [NgrxCacheRootModule],
        });
      });

      simpleRead();
    });

    describe('by FeatureModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [StoreModule.forRoot({}), NgrxCacheFeatureModule],
        });
      });

      simpleRead();
    });

    describe('by reducer', () => {
      describe('with root', () => {
        type State = {apollo: CacheState};

        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [
              StoreModule.forRoot<State>({
                apollo: cacheReducer,
              }),
              NgrxCacheModule,
            ],
          });
        });

        simpleRead({
          selector: (state: State) => state.apollo,
        });
      });
      describe('with feature', () => {
        type State = {apollo: CacheState};

        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [
              StoreModule.forRoot({}),
              StoreModule.forFeature<State>('graphql', {
                apollo: cacheReducer,
              }),
              NgrxCacheModule,
            ],
          });
        });

        simpleRead({
          selector: (state: any) =>
            createFeatureSelector<State>('graphql')(state).apollo,
        });
      });
    });
  });
});
