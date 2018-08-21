import {setupAngular} from './_setup';

import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';

import {Apollo, ApolloBoostModule, APOLLO_BOOST_CONFIG} from '../src';

describe('Integration', () => {
  beforeAll(() => setupAngular());

  describe('default', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, ApolloBoostModule],
        providers: [
          {
            provide: APOLLO_BOOST_CONFIG,
            useValue: {
              uri: '/graphql',
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
