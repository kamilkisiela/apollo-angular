import './_common';

import { ReflectiveInjector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { RxObservableQuery } from 'apollo-client-rxjs';

import { mockClient } from './_mocks';
import { subscribeAndCount } from './_utils';
import { APOLLO_PROVIDERS, defaultApolloClient, provideClientMap } from '../src/index';
import { Apollo, ApolloBase } from '../src/Apollo';
import { CLIENT_MAP, CLIENT_MAP_WRAPPER } from '../src/tokens';

import gql from 'graphql-tag';

import 'rxjs/add/operator/map';

interface Hero {
  name: string;
}

interface AllHeroesQueryResult {
  allHeroes: {
    heroes: Hero[];
  };
}

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

describe('Apollo', () => {
  let defaultClient;
  let extraClient;

  const clientSettings = [{
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
  }];

  beforeEach(() => {
    defaultClient = mockClient(...clientSettings);
    extraClient = mockClient(...clientSettings);
  });

  describe('service', () => {
    let apollo: Apollo;

    beforeEach(() => {
      const injector = ReflectiveInjector.resolveAndCreate([provideClientMap(() => ({
        default: defaultClient,
        extra: extraClient,
      })), APOLLO_PROVIDERS]);
      apollo = injector.get(Apollo);
    });

    describe('default()', () => {
      it('should return the default client', () => {
        expect(apollo.default() instanceof ApolloBase).toBe(true);
        expect(apollo.default().getClient()).toBe(defaultClient);
      });
    });

    describe('use()', () => {
      it('should use a named client', () => {
        expect(apollo.use('extra') instanceof ApolloBase).toBe(true);
        expect(apollo.use('extra').getClient()).toBe(extraClient);
      });
    });

    describe('getClient()', () => {
      it('should return an instance of ApolloClient', () => {
        expect(apollo.getClient()).toBe(defaultClient);
      });
    });

    describe('watchQuery()', () => {
      it('should be called with the same options', () => {
        const options = { query };

        spyOn(defaultClient, 'watchQuery').and.callThrough();

        apollo.watchQuery(options);

        expect(defaultClient.watchQuery).toHaveBeenCalledWith(options);
      });

      it('should be able to use obserable variable', (done: jest.DoneCallback) => {
        const variables = {
          foo: new Subject(),
        };
        const options = { query, variables, fetchPolicy: 'network-only' };

        const obs = apollo
          .watchQuery<AllHeroesQueryResult>(options as any);

        subscribeAndCount<AllHeroesQueryResult>(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data.allHeroes.heroes).toEqual(data2.allHeroes.heroes);
          } else if (handleCount === 2) {
            expect(result.data.allHeroes.heroes).toEqual(data3.allHeroes.heroes);
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
        const options = { query, variables, fetchPolicy: 'network-only' };

        const obs = apollo
          .watchQuery<AllHeroesQueryResult>(options as any);

        subscribeAndCount<AllHeroesQueryResult>(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data.allHeroes.heroes).toEqual(data2.allHeroes.heroes);
          } else if (handleCount === 2) {
            expect(result.data.allHeroes.heroes).toEqual(data3.allHeroes.heroes);
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
        const options = { query, variables };

        const obs = apollo
          .watchQuery<AllHeroesQueryResult>(options);

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
          const obs = apollo.watchQuery<AllHeroesQueryResult>({ query });
          expect(obs instanceof RxObservableQuery).toEqual(true);
        });

        it('should return the ApolloQueryObserable when variables', () => {
          const variables = {
            foo: new Subject(),
          };
          const obs = apollo.watchQuery<AllHeroesQueryResult>({ query, variables });
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

        spyOn(defaultClient, 'query').and.returnValue(promise);

        const result = apollo.query(options as any);

        expect(defaultClient.query).toHaveBeenCalledWith(options);

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

        spyOn(defaultClient, 'mutate').and.returnValue(promise);

        const result = apollo.mutate(options as any);

        expect(defaultClient.mutate).toHaveBeenCalledWith(options);

        result.subscribe(r => {
          expect(r).toEqual('mutation');
          done();
        });
      });
    });

    describe('subscribe', () => {
      it('should be called with the same options and return Observable', (done: jest.DoneCallback) => {
        const options = {query: '', variables: {}};

        spyOn(defaultClient, 'subscribe').and.returnValue(['subscription']);

        const obs = apollo.subscribe(options as any);

        expect(defaultClient.subscribe).toHaveBeenCalledWith(options);

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
      return defaultClient;
    }

    it('should set a CLIENT_MAP_WRAPPER', () => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(getClient)]);
      expect(injector.get(CLIENT_MAP_WRAPPER)).toBe(getClient);
    });

    it('should set a CLIENT_MAP', () => {
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(getClient)]);
      expect(injector.get(CLIENT_MAP)).toEqual({default: defaultClient});
    });
  });

  describe('provideClientMap', () => {
    function getClients() {
      return {
        default: defaultClient,
        extra: extraClient,
      };
    }

    it('should set a CLIENT_MAP_WRAPPER', () => {
      const injector = ReflectiveInjector.resolveAndCreate([provideClientMap(getClients)]);
      expect(injector.get(CLIENT_MAP_WRAPPER)).toBe(getClients);
    });

    it('should set a CLIENT_MAP', () => {
      const injector = ReflectiveInjector.resolveAndCreate([provideClientMap(getClients)]);
      expect(injector.get(CLIENT_MAP)).toEqual({
        default: defaultClient,
        extra: extraClient,
      });
    });
  });
});
