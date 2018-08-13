import {setupAngular} from './_setup';

import {Injectable} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';
import gql from 'graphql-tag';

import {Mutation, Apollo} from '../src';

const mutation = gql`
  mutation addHero($name: String) {
    addHero(name: $name) {
      name
    }
  }
`;

@Injectable()
export class AddHeroMutation extends Mutation {
  public document = mutation;
}

describe('Mutation', () => {
  let apolloMock: Apollo & {mutate: jest.Mock};
  let addHero: AddHeroMutation;

  function createApollo() {
    apolloMock = {
      mutate: jest.fn(),
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
        AddHeroMutation,
      ],
    });
  });

  beforeEach(inject([AddHeroMutation], (_addHero: AddHeroMutation) => {
    addHero = _addHero;
  }));

  test('should have document defined', () => {
    expect(addHero.document).toEqual(mutation);
  });

  test('should use watchQuery under the hood', () => {
    apolloMock.mutate.mockReturnValue('FetchResult');

    const result = addHero.mutate();

    expect(apolloMock.mutate).toBeCalled();
    expect(result).toEqual('FetchResult');
  });

  test('should pass variables to Apollo.mutate', () => {
    addHero.mutate({foo: 1});

    expect(apolloMock.mutate).toBeCalled();
    expect(apolloMock.mutate.mock.calls[0][0]).toMatchObject({
      variables: {foo: 1},
    });
  });

  test('should pass options to Apollo.mutate', () => {
    addHero.mutate({}, {fetchPolicy: 'network-only'});

    expect(apolloMock.mutate).toBeCalled();
    expect(apolloMock.mutate.mock.calls[0][0]).toMatchObject({
      fetchPolicy: 'network-only',
    });
  });

  test('should not overwrite query when options object is provided', () => {
    addHero.mutate({}, {query: 'asd', fetchPolicy: 'cache-first'} as any);

    expect(apolloMock.mutate).toBeCalled();
    expect(apolloMock.mutate.mock.calls[0][0]).toMatchObject({
      mutation,
      fetchPolicy: 'cache-first',
    });
  });
});
