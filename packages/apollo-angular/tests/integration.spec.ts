import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { InMemoryCache } from '@apollo/client/core';
import { mockSingleLink } from '@apollo/client/testing';
import { Apollo, provideApollo } from '../src';

describe('Integration', () => {
  describe('default', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideApollo(() => {
            return {
              link: mockSingleLink(),
              cache: new InMemoryCache(),
            };
          }),
        ],
      });
    });

    test('apollo should be initialized', () => {
      const apollo = TestBed.inject(Apollo);
      expect(() => apollo.client).not.toThrow();
    });
  });
});
