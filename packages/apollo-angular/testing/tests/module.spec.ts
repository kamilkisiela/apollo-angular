import {setupAngular} from './_setup';
import {Apollo} from 'apollo-angular';
import {TestBed} from '@angular/core/testing';
import {InMemoryCache, ApolloReducerConfig, gql} from '@apollo/client/core';

import {
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
} from '../src';

describe('ApolloTestingModule', () => {
  beforeAll(() => setupAngular());

  test('should provide a default ApolloCache', () => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });

    const apollo = TestBed.inject(Apollo);
    const cache = apollo.client.cache as InMemoryCache;
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

    const apollo = TestBed.inject(Apollo);

    expect(apollo.client.cache).toBe(cache);
  });

  test.only('should not modify test data', (done) => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });

    const apollo = TestBed.inject(Apollo);
    const backend = TestBed.inject(ApolloTestingController);

    const testQuery = gql`
      query allHeroes {
        heroes {
          name
        }
      }
    `;

    const testGqlData = {
      data: {
        heroes: [
          {
            id: '1',
            name: 'Spiderman',
          },
          {
            id: '2',
            name: 'Batman',
          },
        ],
      },
    };

    apollo
      .query({
        query: testQuery,
      })
      .subscribe((result: any) => {
        console.log(JSON.stringify(result.data));
        done();
      });

    console.log('before', JSON.stringify(testGqlData));

    backend.expectOne('allHeroes').flush(testGqlData);

    // you'll get an exception here
    // backend.expectOne('allHeroes').flush(Object.freeze(testGqlData));

    console.log('after', JSON.stringify(testGqlData));
  });
});
