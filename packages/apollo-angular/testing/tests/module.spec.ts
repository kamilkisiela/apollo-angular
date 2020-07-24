import {setupAngular} from './_setup';
import {Apollo} from 'apollo-angular';
import {TestBed} from '@angular/core/testing';
import {InMemoryCache, ApolloReducerConfig} from '@apollo/client/core';

import {ApolloTestingModule, APOLLO_TESTING_CACHE} from '../src';

describe('ApolloTestingModule', () => {
  beforeAll(() => setupAngular());

  test('should provide a default ApolloCache', () => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });

    const apollo: Apollo = TestBed.get(Apollo);
    const cache = apollo.getClient().cache as InMemoryCache;
    const config: ApolloReducerConfig = (cache as any).config;

    expect(cache).toBeInstanceOf(InMemoryCache);
    expect(config.addTypename).toBe(false);
  });

  test('should allow to use custom ApolloCache', () => {
    const cache = new InMemoryCache({addTypename: true});

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: cache,
        },
      ],
    });

    const apollo: Apollo = TestBed.get(Apollo);

    expect(apollo.getClient().cache).toBe(cache);
  });
});
