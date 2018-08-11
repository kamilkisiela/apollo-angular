import {setupAngular} from './_setup';

import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {mockSingleLink} from './mocks/mockLinks';

import {Apollo, ApolloModule, APOLLO_OPTIONS} from '../src';

describe('Integration', () => {
  beforeAll(() => setupAngular());

  describe('default', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, ApolloModule],
        providers: [
          {
            provide: APOLLO_OPTIONS,
            useFactory: () => {
              return {
                link: mockSingleLink(),
                cache: new InMemoryCache(),
              };
            },
          },
        ],
      });
    });

    test('apollo should be initialzed', (done: jest.DoneCallback) => {
      inject([Apollo], (apollo: Apollo) => {
        expect(() => {
          apollo.getClient();
        }).not.toThrow();
        done();
      })();
    });
  });
});
