import './_common';

import { ReflectiveInjector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { RxObservableQuery } from 'apollo-client-rxjs';

import { mockClient } from './_mocks';
import { APOLLO_PROVIDERS, defaultApolloClient } from '../src/index';
import { Apollo } from '../src/Apollo';
import { CLIENT_MAP, CLIENT_MAP_WRAPPER } from '../src/tokens';

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

const data2 = {
  allHeroes: {
    heroes: [{ name: 'Mrs Foo' }, { name: 'Mrs Bar' }],
  },
};

const data3 = {
  allHeroes: {
    heroes: [{ name: 'Mr Bar' }],
  },
};

describe('angular2Apollo', () => {
  let client;

  beforeEach(() => {
    client = mockClient({
      request: { query },
      result: { data },
    }, {
      request: { query, variables: { foo: 'Foo' } },
      result: { data: data2 },
    }, {
      request: { query, variables: { foo: 'Bar' } },
      result: { data: data3 },
    }, {
      request: { query, variables: { foo: 'Foo', bar: 'Bar' } },
      result: { data: data2 },
    }, {
      request: { query, variables: { foo: 'Foo', bar: 'Baz' } },
      result: { data: data3 },
    });
  });

  describe('Angular2Apollo', () => {
    let apollo;

    beforeEach(() => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(() => client), APOLLO_PROVIDERS]);
      apollo = injector.get(Apollo);
    });

    describe('getClient()', () => {
      it('should return an instance of ApolloClient', () => {
        expect(apollo.getClient()).toBe(client);
      });
    });

    describe('watchQuery()', () => {
      it('should be called with the same options', () => {
        const options = { query };

        spyOn(client, 'watchQuery').and.callThrough();

        apollo.watchQuery(options);

        expect(client.watchQuery).toHaveBeenCalledWith(options);
      });

      it('should be able to use obserable variable', (done: jest.DoneCallback) => {
        const variables = {
          foo: new Subject(),
        };
        // XXX forceFetch? see https://github.com/apollostack/apollo-client/issues/535
        const options = { query, variables, forceFetch: true };
        let calls = 0;

        apollo
          .watchQuery(options)
          .map(result => result.data)
          .subscribe((result) => {
            calls++;
            if (calls === 1) {
              expect(result).toEqual(data2);
            } else if (calls === 2) {
              expect(result).toEqual(data3);
              done();
            }
          });

        variables.foo.next('Foo');

        setTimeout(() => {
          variables.foo.next('Bar');
        }, 200);
      });

      it('should be able to use obserable variables', (done: jest.DoneCallback) => {
        const variables = {
          foo: new Subject(),
          bar: new Subject(),
        };
        // XXX forceFetch? see https://github.com/apollostack/apollo-client/issues/535
        const options = { query, variables, forceFetch: true };
        let calls = 0;

        apollo
          .watchQuery(options)
          .map(result => result.data)
          .subscribe((result) => {
            calls++;
            if (calls === 1) {
              expect(result).toEqual(data2);
            } else if (calls === 2) {
              expect(result).toEqual(data3);
              done();
            }
          });

        variables.foo.next('Foo');
        variables.bar.next('Bar');

        setTimeout(() => {
          variables.bar.next('Baz');
        }, 200);
      });

      it('should be able to refetch', (done: jest.DoneCallback) => {
        const variables = { foo: 'foo' };
        const options = { query, variables, returnPartialData: true };

        const obs = apollo
          .watchQuery(options);

        obs.subscribe(() => {
          //
        });

        obs.refetch({ foo: 'Bar' }).then(result => {
          expect(result.data).toEqual(data3);
          done();
        });
      });

      describe('result', () => {
        it('should return the ApolloQueryObserable when no variables', () => {
          const obs = apollo.watchQuery({ query });
          expect(obs instanceof RxObservableQuery).toEqual(true);
        });

        it('should return the ApolloQueryObserable when variables', () => {
          const variables = {
            foo: new Subject(),
          };
          const obs = apollo.watchQuery({ query, variables });
          expect(obs instanceof RxObservableQuery).toEqual(true);
        });
      });
    });

    describe('query()', () => {
      it('should be called with the same options', (done: jest.DoneCallback) => {
        const options = {query: '', variables: {}};
        const promise = new Promise((resolve) => {
          resolve('query');
        });

        spyOn(client, 'query').and.returnValue(promise);

        const result = apollo.query(options);

        expect(client.query).toHaveBeenCalledWith(options);

        result.subscribe(r => {
          expect(r).toEqual('query');
          done();
        });
      });
    });

    describe('mutate()', () => {
      it('should be called with the same options', (done: jest.DoneCallback) => {
        const options = {mutation: '', variables: {}};
        const promise = new Promise((resolve) => {
          resolve('mutation');
        });

        spyOn(client, 'mutate').and.returnValue(promise);

        const result = apollo.mutate(options);

        expect(client.mutate).toHaveBeenCalledWith(options);

        result.subscribe(r => {
          expect(r).toEqual('mutation');
          done();
        });
      });
    });

    describe('subscribe', () => {
      it('should be called with the same options and return Observable', (done: jest.DoneCallback) => {
        const options = {query: '', variables: {}};

        spyOn(client, 'subscribe').and.returnValue(['subscription']);

        const obs = apollo.subscribe(options);

        expect(client.subscribe).toHaveBeenCalledWith(options);

        obs.subscribe({
          next(result) {
            expect(result).toBe('subscription');
            done();
          },
          error() {
            done.fail('should not be called');
          },
        });
      });
    });
  });

  describe('defaultApolloClient', () => {

    function getClient() {
      return client;
    }

    it('should set a CLIENT_MAP_WRAPPER', () => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(getClient)]);
      expect(injector.get(CLIENT_MAP_WRAPPER)).toBe(getClient);
    });

    it('should set a CLIENT_MAP', () => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(getClient)]);
      expect(injector.get(CLIENT_MAP)).toBe(client);
    });
  });
});
