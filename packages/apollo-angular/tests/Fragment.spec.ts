import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Apollo, Fragment, gql } from '../src';

const fragment = gql`
  fragment ItemFragment on Item {
    id
    text
  }
`;

@Injectable()
export class ItemFragment extends Fragment {
  public document = fragment;
}

describe('Fragment', () => {
  let apolloMock: Apollo & { watchFragment: jest.Mock };
  let items: ItemFragment;

  function createApollo() {
    apolloMock = {
      watchFragment: jest.fn(),
      use(name: string) {
        if (name === 'default') {
          return apolloMock;
        }
      },
    } as any;

    return apolloMock;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Apollo,
          useFactory: createApollo,
        },
        ItemFragment,
      ],
    });
    items = TestBed.inject(ItemFragment);
  });

  test('should have fragment document defined', () => {
    expect(items.document).toEqual(fragment);
  });

  test('should use watchFragment under the hood', () => {
    apolloMock.watchFragment.mockReturnValue('FragmentResult');

    const result = items.watch();

    expect(apolloMock.watchFragment).toHaveBeenCalled();
    expect(result).toEqual('FragmentResult');
  });

  test('should pass variables to Apollo.watchFragment', () => {
    items.watch({ foo: 1 });

    expect(apolloMock.watchFragment).toHaveBeenCalled();
    expect(apolloMock.watchFragment.mock.calls[0][0]).toMatchObject({
      variables: { foo: 1 },
    });
  });

  test('should pass options to Apollo.watchQuery', () => {
    items.watch(
      {},
      { from: 'Item:1', optimistic: true, canonizeResults: true, fragmentName: 'ItemFragment' },
    );

    expect(apolloMock.watchFragment).toHaveBeenCalled();
    expect(apolloMock.watchFragment.mock.calls[0][0]).toMatchObject({
      variables: {},
      from: 'Item:1',
      fragmentName: 'ItemFragment',
      canonizeResults: true,
      optimistic: true,
    });
  });
});
