import {Apollo} from 'apollo-angular';
import {TestBed} from '@angular/core/testing';
import {InMemoryCache, ApolloReducerConfig, gql} from '@apollo/client/core';

import {
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
} from '../src';

describe('ApolloTestingModule', () => {
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

  test('should not modify test data', (done) => {
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

    const testData = [
      {
        id: '1',
        name: 'Spiderman',
      },
      {
        id: '2',
        name: 'Batman',
      },
    ];
    const testGqlData = {
      data: {
        heroes: testData,
      },
    };

    apollo
      .query({
        query: testQuery,
      })
      .subscribe((result: any) => {
        expect(result.data.heroes[0].name).toBe('Spiderman');
        done();
      });

    backend.expectOne('allHeroes').flush(testGqlData);
    expect(testGqlData.data.heroes).toEqual(testData);
  });
});
