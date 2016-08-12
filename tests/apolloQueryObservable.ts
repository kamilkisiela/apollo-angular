import {
  ApolloQueryObservable,
} from '../src/apolloQueryObservable';

import {
  mockClient,
} from './_mocks';

import gql from 'graphql-tag';

import 'rxjs/add/operator/map';

const query = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;
const data = {
  allHeroes: {
    heroes: [{ name: 'Mr Foo' }, { name: 'Mr Bar' }],
  },
};

describe('ApolloQueryObservable', () => {
  let obsApollo;
  let obsQuery;
  let client;

  beforeEach(() => {
    client = mockClient({
      request: { query },
      result: { data },
    });
    obsApollo = client.watchQuery({ query });
    obsQuery = new ApolloQueryObservable(obsApollo);
  });

  describe('regular', () => {
    it('should be able to subscribe', () => {
      expect(() => {
        obsQuery.subscribe({
          next() {},
        });
      }).not.toThrow();
    });

    it('should be able to receive data', (done) => {
      obsQuery.subscribe({
        next(result) {
          expect(result.data).toEqual(data);
          done();
        }
      });
    });

    it('should be able to receive an error', (done) => {
      obsQuery.subscribe({
        next() {},
      });

      obsQuery.subscribe({
        error(error) {
          expect(error instanceof Error).toBe(true);
          done();
        },
      })
    });

    it('should be able to use a operator', (done) => {
      obsQuery.map(result => result.data).subscribe({
        next(result) {
          expect(result).toEqual(data);
          done();
        },
      });
    });
  });

  describe('apollo-specific', () => {
    it('should be able to refech', () => {
      spyOn(obsApollo, 'refetch').and.returnValue('promise');

      const arg = 'foo';
      const result = obsQuery.refetch(arg);

      expect(obsApollo.refetch).toHaveBeenCalledWith(arg);
      expect(result).toBe('promise');
    });

    it('should be able to startPolling', () => {
      spyOn(obsApollo, 'startPolling');

      const arg = 200;
      obsQuery.startPolling(arg);

      expect(obsApollo.startPolling).toHaveBeenCalledWith(arg);
    });

    it('should be able to stopPolling', () => {
      spyOn(obsApollo, 'stopPolling');

      obsQuery.stopPolling();

      expect(obsApollo.stopPolling).toHaveBeenCalled();
    });

    it('should be able to fetchMore', () => {
      spyOn(obsApollo, 'fetchMore');

      const arg = 200;
      obsQuery.fetchMore(arg);

      expect(obsApollo.fetchMore).toHaveBeenCalledWith(arg);
    });
  });
});
