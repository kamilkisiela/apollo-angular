import {setupAngular} from './_setup';

import {TestBed, inject, async} from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import gql, {disableFragmentWarnings} from 'graphql-tag';

import {NgrxCache, NgrxCacheModule, apolloReducer, CacheState} from '../src';

disableFragmentWarnings();

const defaultOptions = {addTypename: false};

describe('Provide', () => {
  beforeAll(() => setupAngular());

  const makeTest = (text: string, testFn: (cache: NgrxCache) => void) => {
    test(text, async(inject([NgrxCache], testFn)));
  };

  const simpleRead = () =>
    makeTest('will read some data from the store', cache => {
      const proxy = cache
        .create({
          ...defaultOptions,
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

  describe('two ways of providing Cache', () => {
    describe('with default stateKey', () => {
      type State = {apollo: CacheState};

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot<State>({
              apollo: apolloReducer,
            }),
            NgrxCacheModule,
          ],
        });
      });

      simpleRead();
    });
    describe('with custom stateKey', () => {
      type State = {myApollo: CacheState};

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot<State>({
              myApollo: apolloReducer,
            }),
            NgrxCacheModule.forRoot('myApollo'),
          ],
        });
      });

      simpleRead();
    });
  });
});
