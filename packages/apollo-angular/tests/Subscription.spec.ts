import {setupAngular} from './_setup';

import {Injectable} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';
import gql from 'graphql-tag';

import {Subscription, Apollo} from '../src';

const query = gql`
  query heroes {
    allHeroes {
      name
    }
  }
`;

@Injectable()
export class HeroesSubscription extends Subscription {
  public document = query;
}

describe('Subscription', () => {
  let apolloMock: Apollo & {subscribe: jest.Mock};
  let heroes: HeroesSubscription;

  function createApollo() {
    apolloMock = {
      subscribe: jest.fn(),
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
        HeroesSubscription,
      ],
    });
  });

  beforeEach(inject([HeroesSubscription], (_heroes: HeroesSubscription) => {
    heroes = _heroes;
  }));

  test('should have document defined', () => {
    expect(heroes.document).toEqual(query);
  });

  test('should use subscribe under the hood', () => {
    apolloMock.subscribe.mockReturnValue('FetchResult');

    const result = heroes.subscribe();

    expect(apolloMock.subscribe).toBeCalled();
    expect(result).toEqual('FetchResult');
  });

  test('should pass variables to Apollo.subscribe', () => {
    heroes.subscribe({foo: 1});

    expect(apolloMock.subscribe).toBeCalled();
    expect(apolloMock.subscribe.mock.calls[0][0]).toMatchObject({
      variables: {foo: 1},
    });
  });

  test('should pass options to Apollo.subscribe', () => {
    heroes.subscribe({}, {fetchPolicy: 'network-only'});

    expect(apolloMock.subscribe).toBeCalled();
    expect(apolloMock.subscribe.mock.calls[0][0]).toMatchObject({
      fetchPolicy: 'network-only',
    });
  });

  test('should not overwrite query when options object is provided', () => {
    heroes.subscribe({}, {query: 'asd', fetchPolicy: 'cache-first'} as any);

    expect(apolloMock.subscribe).toBeCalled();
    expect(apolloMock.subscribe.mock.calls[0][0]).toMatchObject({
      query,
      fetchPolicy: 'cache-first',
    });
  });
});
