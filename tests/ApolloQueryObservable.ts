import { ApolloQueryObservable } from '../src/ApolloQueryObservable';
import { ObservableQueryRef } from '../src/utils/ObservableQuery';
import { mockClient } from './_mocks';

import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';

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
  let apolloRef: ObservableQueryRef;
  let obsApollo;
  let obsQuery: ApolloQueryObservable<any>;
  let client: ApolloClient;

  beforeEach(() => {
    client = mockClient({
      request: { query },
      result: { data },
    });
    apolloRef = new ObservableQueryRef();
    obsApollo = client.watchQuery({ query });
    apolloRef.apollo = obsApollo;
    obsQuery = new ApolloQueryObservable(apolloRef, subscriber => {
      const sub = obsApollo.subscribe(subscriber);
      return () => sub.unsubscribe();
    });
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
