import './_common';

import gql from 'graphql-tag';

import { TestBed, inject, async } from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import InMemoryCache, { NormalizedCache } from 'apollo-cache-inmemory';

import { Apollo } from '../src/Apollo';
import { MockLink } from './MockLink';

describe('Apollo', () => {
  beforeEach(() => {
    TestBed.initTestEnvironment( BrowserDynamicTestingModule, platformBrowserDynamicTesting() );
    TestBed.configureTestingModule({
      providers: [
        Apollo,
      ],
    });
  });

  it('should use HttpClient', async(inject([Apollo], (apollo: Apollo) => {
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
        heroes: [{
          name: 'Superman',
          __typename: 'Hero'
        }],
      };

      // create
      apollo.create<NormalizedCache>({
        link: new MockLink([
          { request: op, result: { data } }
        ]),
        cache: new InMemoryCache()
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
    })));
});
