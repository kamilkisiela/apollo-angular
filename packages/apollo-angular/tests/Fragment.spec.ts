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

describe('Subscription', () => {
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

    const result = items.watchFragment();

    expect(apolloMock.watchFragment).toBeCalled();
    expect(result).toEqual('FragmentResult');
  });
});
