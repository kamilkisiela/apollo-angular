import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { ApolloClient, ApolloLink, InMemoryCache, ObservableQuery } from '@apollo/client/core';
import { mockSingleLink } from '@apollo/client/testing';
import { gql } from '../src/gql';
import { QueryRef } from '../src/query-ref';

const createClient = (link: ApolloLink) =>
  new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

type Result = {
  heroes: { name: string }[];
};

type Variables = {
  foo?: number;
};

const heroesOperation = {
  query: gql<Result, Variables>`
    query allHeroes {
      heroes {
        name
        __typename
      }
    }
  `,
  variables: {},
  operationName: 'allHeroes',
};

// tslint:disable:variable-name
const __typename = 'Hero';

const Superman = {
  name: 'Superman',
  __typename,
};
const Batman = {
  name: 'Batman',
  __typename,
};

describe('QueryRef', () => {
  let ngZone: NgZone;
  let client: ApolloClient<any>;
  let obsQuery: ObservableQuery<Result, Variables>;

  beforeEach(() => {
    ngZone = { run: jest.fn(cb => cb()) } as any;
    const mockedLink = mockSingleLink(
      {
        request: heroesOperation,
        result: { data: { heroes: [Superman] } },
      },
      {
        request: heroesOperation,
        result: { data: { heroes: [Superman, Batman] } },
      },
    );

    client = createClient(mockedLink);
    obsQuery = client.watchQuery(heroesOperation);
  });

  function createQueryRef(obsQuery: ObservableQuery<Result>): QueryRef<Result, Variables> {
    return new QueryRef(obsQuery, ngZone, { query: heroesOperation.query });
  }

  test('should listen to changes', done => {
    const queryRef = createQueryRef(obsQuery);
    queryRef.valueChanges.subscribe({
      next: result => {
        expect(result.data).toBeDefined();
        done();
      },
      error: e => {
        done.fail(e);
      },
    });
  });

  test('should be able to call refetch', () => {
    const mockCallback = jest.fn();
    obsQuery.refetch = mockCallback;

    const queryRef = createQueryRef(obsQuery);
    queryRef.refetch();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able refetch and receive new results', done => {
    let calls = 0;

    const queryRef = createQueryRef(obsQuery);
    queryRef.valueChanges.subscribe({
      next: result => {
        calls++;

        expect(result.data).toBeDefined();

        if (calls === 2) {
          done();
        }
      },
      error: e => {
        done.fail(e);
      },
      complete: () => {
        done.fail('Should not be here');
      },
    });

    setTimeout(() => {
      queryRef.refetch();
    }, 200);
  });

  test('should be able refetch and receive new results after using rxjs operator', done => {
    let calls = 0;
    const queryRef = createQueryRef(obsQuery);
    const obs = queryRef.valueChanges;

    obs.pipe(map(result => result.data)).subscribe({
      next: result => {
        calls++;

        if (calls === 1) {
          expect(result.heroes.length).toBe(1);
        } else if (calls === 2) {
          expect(result.heroes.length).toBe(2);

          done();
        }
      },
      error: e => {
        done.fail(e);
      },
      complete: () => {
        done.fail('Should not be here');
      },
    });

    setTimeout(() => {
      queryRef.refetch();
    }, 200);
  });

  test('should be able to call updateQuery()', () => {
    const mockCallback = jest.fn();
    const mapFn = () => undefined;
    obsQuery.updateQuery = mockCallback;

    const queryRef = createQueryRef(obsQuery);
    queryRef.updateQuery(mapFn);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(mapFn);
  });

  test('should be able to call result()', () => {
    const mockCallback = jest.fn();
    obsQuery.result = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.result();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call getCurrentResult() and get updated results', done => {
    let calls = 0;
    const queryRef = createQueryRef(obsQuery);
    const obs = queryRef.valueChanges;

    obs.pipe(map(result => result.data)).subscribe({
      next: result => {
        calls++;
        const currentResult = queryRef.getCurrentResult();
        expect(currentResult.data.heroes.length).toBe(result.heroes.length);

        if (calls === 2) {
          done();
        }
      },
      error: e => {
        done.fail(e);
      },
      complete: () => {
        done.fail('Should not be here');
      },
    });

    setTimeout(() => {
      queryRef.refetch();
    }, 200);
  });

  test('should be able to call getLastResult()', () => {
    const mockCallback = jest.fn();
    obsQuery.getLastResult = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.getLastResult();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call getLastError()', () => {
    const mockCallback = jest.fn();
    obsQuery.getLastError = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.getLastError();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call resetLastResults()', () => {
    const mockCallback = jest.fn();
    obsQuery.resetLastResults = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.resetLastResults();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call fetchMore()', () => {
    const mockCallback = jest.fn();
    const opts = { variables: { foo: 1 } };
    obsQuery.fetchMore = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.fetchMore(opts);

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(opts);
  });

  test('should be able to call subscribeToMore()', () => {
    const mockCallback = jest.fn();
    const opts = { document: heroesOperation.query };
    obsQuery.subscribeToMore = mockCallback;

    const queryRef = createQueryRef(obsQuery);
    queryRef.subscribeToMore(opts);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(opts);
  });

  test('should be able to call stopPolling()', () => {
    const mockCallback = jest.fn();
    obsQuery.stopPolling = mockCallback;

    const queryRef = createQueryRef(obsQuery);
    queryRef.stopPolling();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call startPolling()', () => {
    const mockCallback = jest.fn();
    obsQuery.startPolling = mockCallback;

    const queryRef = createQueryRef(obsQuery);
    queryRef.startPolling(3000);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(3000);
  });

  test('should be able to call setOptions()', () => {
    const mockCallback = jest.fn();
    const opts = {};
    obsQuery.setOptions = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.setOptions(opts);

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(opts);
  });

  test('should be able to call setVariables()', () => {
    const mockCallback = jest.fn();
    const variables = {};
    obsQuery.setVariables = mockCallback.mockReturnValue('expected');

    const queryRef = createQueryRef(obsQuery);
    const result = queryRef.setVariables(variables);

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(variables);
  });

  test('should handle multiple subscribers', done => {
    const queryRef = createQueryRef(obsQuery);
    const obsFirst = queryRef.valueChanges;
    const obsSecond = queryRef.valueChanges;

    let calls = {
      first: 0,
      second: 0,
    };

    const subFirst = obsFirst.subscribe({
      next: result => {
        calls.first++;

        expect(result.data).toBeDefined();
      },
      error: e => {
        done.fail(e);
      },
      complete: () => {
        done.fail('Should not be here');
      },
    });

    const subSecond = obsSecond.subscribe({
      next: result => {
        calls.second++;

        expect(result.data).toBeDefined();

        setTimeout(() => {
          subSecond.unsubscribe();
          // tslint:disable:no-use-before-declare
          check();
        });
      },
      error: e => {
        done.fail(e);
      },
      complete: () => {
        if (calls.second !== 1) {
          done.fail('Should be called only after first call');
        }
      },
    });

    const check = () => {
      expect(calls.first).toBe(1);
      expect(calls.second).toBe(1);

      expect(subFirst.closed).toBe(false);
      expect(subSecond.closed).toBe(true);

      done();
    };
  });

  test('should unsubscribe', done => {
    const queryRef = createQueryRef(obsQuery);
    const obs = queryRef.valueChanges;
    const id = queryRef.queryId;

    const sub = obs.subscribe(() => {
      //
    });

    expect(client['queryManager'].queries.get(id)).toBeDefined();

    setTimeout(() => {
      sub.unsubscribe();
      expect(client['queryManager'].queries.get(id)).toBeUndefined();
      done();
    });
  });

  test('should unsubscribe based on rxjs operators', done => {
    const gate = new Subject<void>();
    const queryRef = createQueryRef(obsQuery);
    const obs = queryRef.valueChanges.pipe(takeUntil(gate));
    const id = queryRef.queryId;

    obs.subscribe(() => {
      //
    });

    expect(client['queryManager'].queries.get(id)).toBeDefined();

    gate.next();

    expect(client['queryManager'].queries.get(id)).toBeUndefined();
    done();
  });
});
