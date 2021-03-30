import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {InMemoryCache} from '@apollo/client/core';
import {mockSingleLink} from '@apollo/client/testing';

import {ApolloModule, Apollo, APOLLO_OPTIONS} from '../src';

describe('Integration', () => {
  describe('default', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ApolloModule, HttpClientModule],
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
