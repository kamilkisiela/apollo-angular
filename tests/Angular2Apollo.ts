import { Provider, ReflectiveInjector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { RxObservableQuery } from 'apollo-client-rxjs';

import { mockClient } from './_mocks';
import { APOLLO_PROVIDERS } from '../src/index';
import { Angular2Apollo, defaultApolloClient, angularApolloClient } from '../src/Angular2Apollo';

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
    let angular2Apollo;

    beforeEach(() => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(client), APOLLO_PROVIDERS]);
      angular2Apollo = injector.get(Angular2Apollo);
    });

    describe('watchQuery()', () => {
      it('should be called with the same options', () => {
        const options = { query };

        spyOn(client, 'watchQuery').and.callThrough();

        angular2Apollo.watchQuery(options);

        expect(client.watchQuery).toHaveBeenCalledWith(options);
      });

      it('should be able to use obserable variable', (done) => {
        const variables = {
          foo: new Subject(),
        };
        // XXX forceFetch? see https://github.com/apollostack/apollo-client/issues/535
        const options = { query, variables, forceFetch: true };
        let calls = 0;

        angular2Apollo
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

      it('should be able to use obserable variables', (done) => {
        const variables = {
          foo: new Subject(),
          bar: new Subject(),
        };
        // XXX forceFetch? see https://github.com/apollostack/apollo-client/issues/535
        const options = { query, variables, forceFetch: true };
        let calls = 0;

        angular2Apollo
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

      it('should be able to refetch', (done) => {
        const variables = { foo: 'foo' };
        const options = { query, variables };

        const obs = angular2Apollo
          .watchQuery(options);

        obs.subscribe(() => {});

        obs.refetch({ foo: 'Bar' }).then(result => {
          expect(result.data).toEqual(data3);
          done();
        });
      });

      describe('result', () => {
        it('should return the ApolloQueryObserable when no variables', () => {
          const obs = angular2Apollo.watchQuery({ query });
          expect(obs instanceof RxObservableQuery).toEqual(true);
        });

        it('should return the ApolloQueryObserable when variables', () => {
          const variables = {
            foo: new Subject(),
          };
          const obs = angular2Apollo.watchQuery({ query, variables });
          expect(obs instanceof RxObservableQuery).toEqual(true);
        });
      });
    });

    describe('query()', () => {
      it('should be called with the same options', () => {
        const options = {query: '', variables: {}};

        spyOn(client, 'query').and.returnValue('query');

        const result = angular2Apollo.query(options);

        expect(client.query).toHaveBeenCalledWith(options);
        expect(result).toEqual('query');
      });
    });

    describe('mutate()', () => {
      it('should be called with the same options', () => {
        const options = {mutation: '', variables: {}};

        spyOn(client, 'mutate').and.returnValue('mutate');

        const result = angular2Apollo.mutate(options);

        expect(client.mutate).toHaveBeenCalledWith(options);
        expect(result).toEqual('mutate');
      });
    });
  });

  describe('defaultApolloClient', () => {
    it('should create a provider', () => {
      const provider = defaultApolloClient(client);
      expect(provider instanceof Provider).toBe(true);
    });

    it('should set a AngularApolloClient', () => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(client)]);
      expect(injector.get(angularApolloClient)).toBe(client);
    });
  });
});
