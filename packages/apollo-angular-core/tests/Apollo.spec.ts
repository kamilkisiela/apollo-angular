import './_common';

import gql from 'graphql-tag';

import {TestBed, inject, async} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import InMemoryCache, {NormalizedCache} from 'apollo-cache-inmemory';

import {Apollo, ApolloBase} from '../src/Apollo';
import {MockLink} from './mocks/MockLink';

describe('Apollo', () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Apollo],
    });
  });

  describe('default()', () => {
    test('should return the default client', () => {
      const apollo = new Apollo();

      apollo.create({} as any)

      expect(apollo.default() instanceof ApolloBase).toBe(true);
      expect(apollo.default().getClient()).toBeDefined();
    });
  });

  describe('use()', () => {
    test('should use a named client', () => {
      const apollo = new Apollo();

      apollo.create({} as any, 'extra');

      expect(apollo.use('extra') instanceof ApolloBase).toBe(true);
      expect(apollo.use('extra').getClient()).toBeDefined();
    });
  });

  test(
    'should use HttpClient',
    async(
      inject([Apollo], (apollo: Apollo) => {
        const op = {
          query: gql`
            query heroes {
              heroes {
                name
                __typename
              }
            }
          `,
          operationName: 'heroes',
          variables: {},
        };
        const data = {
          heroes: [
            {
              name: 'Superman',
              __typename: 'Hero',
            },
          ],
        };

        // create
        apollo.create<NormalizedCache>({
          link: new MockLink([{request: op, result: {data}}]),
          cache: new InMemoryCache(),
        });

        // query
        apollo.query<any>(op).subscribe({
          next: result => {
            const hero = result.data.heroes[0];
            expect(hero.name).toEqual(data.heroes[0].name);
          },
          error: error => {
            console.error(error);
            throw new Error('Should not be here');
          },
        });
      })
    )
  );
});
