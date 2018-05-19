import {setupAngular} from './_setup';

import {Injectable} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';
import gql from 'graphql-tag';

import {Query, Apollo} from '../src';

const query = gql`
  query heroes {
    allHeroes {
      name
    }
  }
`;

@Injectable()
export class HeroesQuery extends Query {
  public document = query;
}

describe('Query', () => {
  let apolloMock: Apollo & {watchQuery: jest.Mock};
  let heroesQuery: HeroesQuery;

  function createApollo() {
    apolloMock = {
      watchQuery: jest.fn(),
    } as any;

    return apolloMock;
  }

  beforeAll(() => setupAngular());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Apollo,
          useFactory: createApollo,
        },
        HeroesQuery,
      ],
    });
  });

  beforeEach(
    inject([HeroesQuery], (_heroesQuery: HeroesQuery) => {
      heroesQuery = _heroesQuery;
    }),
  );

  test('should have document defined', () => {
    expect(heroesQuery.document).toEqual(query);
  });

  test('should use watchQuery under the hood', () => {
    apolloMock.watchQuery.mockReturnValue('QueryRef');

    const result = heroesQuery.query();

    expect(apolloMock.watchQuery).toBeCalled();
    expect(result).toEqual('QueryRef');
  });

  test('should pass variables to Apollo.watchQuery', () => {
    heroesQuery.query({foo: 1});

    expect(apolloMock.watchQuery).toBeCalled();
    expect(apolloMock.watchQuery.mock.calls[0][0]).toMatchObject({
      variables: {foo: 1},
    });
  });

  test('should pass options to Apollo.watchQuery', () => {
    heroesQuery.query({}, {fetchPolicy: 'network-only'});

    expect(apolloMock.watchQuery).toBeCalled();
    expect(apolloMock.watchQuery.mock.calls[0][0]).toMatchObject({
      fetchPolicy: 'network-only',
    });
  });

  test('should not overwrite query when options object is provided', () => {
    heroesQuery.query({}, {query: 'asd', fetchPolicy: 'cache-first'} as any);

    expect(apolloMock.watchQuery).toBeCalled();
    expect(apolloMock.watchQuery.mock.calls[0][0]).toMatchObject({
      query,
      fetchPolicy: 'cache-first',
    });
  });
});
