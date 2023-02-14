import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { InMemoryCache } from '@apollo/client/core';
import { mockSingleLink } from '@apollo/client/testing';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from '../src';

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

    test('apollo should be initialized', () => {
      const apollo = TestBed.inject(Apollo);
      expect(() => apollo.client).not.toThrow();
    });
  });
});
