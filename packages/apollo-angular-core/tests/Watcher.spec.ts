import { ObservableQuery } from 'apollo-client';
import { map } from 'rxjs/operator/map';

import ApolloClient from 'apollo-client';
import InMemoryCache from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {Watcher} from '../src/Watcher';
import {MockLink} from './mocks/MockLink';

const createClient = (link: MockLink) => new ApolloClient({
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

describe('Watcher', () => {
  let client: ApolloClient<any>;
  let obsQuery: ObservableQuery<any>;
  let watcher: Watcher<any>;

  beforeEach(() => {
    const mockedLink = new MockLink([{
      request: heroesOperation,
      result: { data: { heroes: [Superman] } }
    }, {
      request: heroesOperation,
      result: { data: { heroes: [Superman, Batman] } }
    }]);

    client = createClient(mockedLink);
    obsQuery = client.watchQuery(heroesOperation);
    watcher = new Watcher<any>(obsQuery);
  });

  test('should listen to changes', (done) => {
    watcher.valueChanges().subscribe({
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

    watcher.refetch();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able refetch and receive new results', (done) => {
    let calls = 0;

    watcher.valueChanges().subscribe({
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
      watcher.refetch();
    }, 200);
  });

  test('should be able refetch and receive new results after using rxjs operator', (done) => {
    let calls = 0;
    const obs = watcher.valueChanges();

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
      watcher.refetch();
    }, 200);
  });

  test('should be able to update a query', () => {
    const mockCallback = jest.fn();
    const mapFn: any = () => {};
    obsQuery.updateQuery = mockCallback;

    watcher.updateQuery(mapFn);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(mapFn);
  });
});
