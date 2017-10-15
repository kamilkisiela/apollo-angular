import { ObservableQuery } from 'apollo-client';
import { map } from 'rxjs/operator/map';
import {ApolloLink} from 'apollo-link';

import ApolloClient from 'apollo-client';
import InMemoryCache from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {QueryRef} from '../src/QueryRef';
import {mockSingleLink} from './mocks/mockLinks';

const createClient = (link: ApolloLink) => new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const heroesOperation = {
  query: gql`
    query allHeroes {
      heroes {
        name
        __typename
      }
    }
  `,
  variables: {},
  operationName: 'allHeroes'
};

const __typename = 'Hero';

const Superman = {
  name: 'Superman',
  __typename
};
const Batman = {
  name: 'Batman',
  __typename
};

const heroesResult = {
  heroes: [Superman]
};

describe('QueryRef', () => {
  let client: ApolloClient<any>;
  let obsQuery: ObservableQuery<any>;
  let queryRef: QueryRef<any>;

  beforeEach(() => {
    const mockedLink = mockSingleLink({
      request: heroesOperation,
      result: { data: { heroes: [Superman] } }
    }, {
      request: heroesOperation,
      result: { data: { heroes: [Superman, Batman] } }
    });

    client = createClient(mockedLink);
    obsQuery = client.watchQuery(heroesOperation);
    queryRef = new QueryRef<any>(obsQuery);
  });

  test('should listen to changes', (done) => {
    queryRef.valueChanges().subscribe({
      next: result => {
        expect(result.data).toBeDefined();
        done();
      },
      error: err => {
        console.error(err);
        done.fail('Should not be here');
      }
    });
  });

  test('should be able to call refetch', () => {
    const mockCallback = jest.fn();
    obsQuery.refetch = mockCallback;

    queryRef.refetch();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able refetch and receive new results', (done) => {
    let calls = 0;

    queryRef.valueChanges().subscribe({
      next: result => {
        calls++;

        expect(result.data).toBeDefined();

        if (calls === 2) {
          done();
        }
      },
      error: err => {
        console.error(err);
        done.fail('Should not be here');
      },
      complete: () => {
        done.fail('Should not be here');
      }
    });

    setTimeout(() => {
      queryRef.refetch();
    }, 200);
  });

  test('should be able refetch and receive new results after using rxjs operator', (done) => {
    let calls = 0;
    const obs = queryRef.valueChanges();

    map.call(obs, (result) => result.data).subscribe({
      next: result => {
        calls++;

        if (calls === 1) {
          expect(result.heroes.length).toBe(1);
        } else if (calls === 2) {
          expect(result.heroes.length).toBe(2);

          done();
        }
      },
      error: err => {
        console.error(err);
        done.fail('Should not be here');
      },
      complete: () => {
        done.fail('Should not be here');
      }
    });

    setTimeout(() => {
      queryRef.refetch();
    }, 200);
  });

  test('should be able to update a query', () => {
    const mockCallback = jest.fn();
    const mapFn: any = () => {};
    obsQuery.updateQuery = mockCallback;

    queryRef.updateQuery(mapFn);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(mapFn);
  });

  test('should handle multiple subscribers', () => {
    const obsFirst = queryRef.valueChanges();
    const obsSecond = queryRef.valueChanges();

    let calls = {
      first: 0,
      second: 0
    };

    const subFirst = queryRef.valueChanges().subscribe({
      next: result => {
        calls.first++;

        expect(result.data).toBeDefined();
      },
      error: err => {
        console.error(err);
        done.fail('Should not be here');
      },
      complete: () => {
        done.fail('Should not be here');
      }
    });

    const subSecond = queryRef.valueChanges().subscribe({
      next: result => {
        calls.second++;

        expect(result.data).toBeDefined();

        if (calls.second === 2) {
          setTimeout(() => {
            check();
          });
        }
      },
      error: err => {
        console.error(err);
        done.fail('Should not be here');
      },
      complete: () => {
        if (calls.second !== 2) {
          done.fail('Should be called only after second call');
        }
      }
    });

    const check = () => {
      expect(calls.first).toBe(2);
      expect(calls.second).toBe(2);

      expect(subFirst.closed).toBe(false);
      expect(subSecond.closed).toBe(true);

      done();
    };
  });
});
