import './_common';

import { ReflectiveInjector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { RxObservableQuery } from 'apollo-client-rxjs';
import { ApolloClient } from 'apollo-client';

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

// Mutation

const dataMutation = {
  addHero: { name: 'Mr Baz' },
};

const dataAfterMutation = {
  allHeroes: {
    heroes: [...data.allHeroes.heroes, dataMutation.addHero],
  },
};

const mutation = gql`
  mutation addHero($name: String!) {
    addHero(name: $name) {
      name
    }
  }
`;

// Optimistic

const mutationOptimistic = gql`
  mutation addHeroOptimistic($name: String!) {
    addHero(name: $name) {
      id
      name
    }
  }
`;

const queryOptimistic = gql`
  query heroesOptimistic {
    allHeroes {
      heroes {
        id
        name
      }
    }
  }
`;

const dataOptimistic = {
  allHeroes: {
    heroes: [{ id: 1, name: 'Mr Foo' }, { id: 2, name: 'Mr Bar' }],
  },
};

const dataMutationOptimistic = {
  addHero: { id: 3, name: 'Mr Baz' },
};

const dataAfterMutationOptimistic = {
  allHeroes: {
    heroes: [ ...dataOptimistic.allHeroes.heroes, dataMutationOptimistic.addHero ],
  },
};

describe('Apollo', () => {
  let defaultClient: ApolloClient;
  let extraClient: ApolloClient;

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
  }, {
    request: { query: mutation, variables: { name: 'Mr Baz' } },
    result: { data: dataMutation },
  }, {
    request: { query: queryOptimistic },
    result: { data: dataOptimistic },
  }, {
    request: { query: mutationOptimistic, variables: { name: 'Mr Baz' }, delay: 200 },
    result: { data: dataMutationOptimistic },
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

        spyOn(defaultClient, 'query').and.returnValue(Promise.resolve('query'));

        const result = apollo.query(options as any);

        result.subscribe({
          next(r) {
            expect(r).toEqual('query');
            expect(defaultClient.query).toHaveBeenCalledWith(options);
            done();
          },
          error() {
            done.fail('should not be called');
          },
        });
      });

      it('should not be called without subscribing to it', (done: jest.DoneCallback) => {
        spyOn(defaultClient, 'query').and.returnValue(Promise.resolve('query'));

        const result = apollo.query({} as any);

        expect(defaultClient.query).not.toHaveBeenCalled();

        result.subscribe({
          complete: () => {
            expect(defaultClient.query).toHaveBeenCalled();
            done();
          },
        });
      });
    });

    describe('mutate()', () => {
      it('should be called with the same options', (done: jest.DoneCallback) => {
        const options = {mutation: '', variables: {}};

        spyOn(defaultClient, 'mutate').and.returnValue(Promise.resolve('mutation'));

        const result = apollo.mutate(options as any);

        result.subscribe({
          next(r) {
            expect(r).toEqual('mutation');
            expect(defaultClient.mutate).toHaveBeenCalledWith(options);
            done();
          },
          error() {
            done.fail('should not be called');
          },
        });
      });

      it('should not be called without subscribing to it', (done: jest.DoneCallback) => {
        spyOn(defaultClient, 'mutate').and.returnValue(Promise.resolve('mutation'));

        const result = apollo.mutate({} as any);

        expect(defaultClient.mutate).not.toHaveBeenCalled();

        result.subscribe({
          complete: () => {
            expect(defaultClient.mutate).toHaveBeenCalled();
            done();
          },
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

    describe('query updates', () => {
      it('should update a query after mutation', (done: jest.DoneCallback) => {
        const obs = apollo.watchQuery({ query, fetchPolicy: 'network-only' });

        subscribeAndCount(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data).toEqual(data);
          } else if (handleCount === 2) {
            expect(result.data).toEqual(dataAfterMutation);
            done();
          }
        });

        setTimeout(() => {
          apollo.mutate<{addHero: Hero}>({
            mutation,
            variables: { name: 'Mr Baz' },
            updateQueries: {
              heroes: (prev: any, { mutationResult }: any) => {
                return {
                  allHeroes: {
                    heroes: [...prev.allHeroes.heroes, mutationResult.data.addHero],
                  },
                };
              },
            },
          }).subscribe({
            error(error) {
              done.fail(error);
            },
          });
        }, 200);
      });

      it('should update a query with Optimistic Response after mutation', (done: jest.DoneCallback) => {
        const obs = apollo.watchQuery({ query: queryOptimistic, fetchPolicy: 'network-only' });

        subscribeAndCount(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data).toEqual(dataOptimistic);
          } else if (handleCount === 2) {
            expect(result.data).toEqual({
              allHeroes: {
                heroes: [...dataOptimistic.allHeroes.heroes, { id: 3, name: 'Mr Temporary' }],
              },
            });
          } else if (handleCount === 3) {
            expect(result.data).toEqual(dataAfterMutationOptimistic);
            done();
          }
        });

        setTimeout(() => {
          apollo.mutate<{addHero: Hero}>({
            mutation: mutationOptimistic,
            variables: { name: 'Mr Baz' },
            optimisticResponse: {
              addHero: {
                id: 3,
                name: 'Mr Temporary',
              },
            },
            updateQueries: {
              heroesOptimistic: (prev: any, { mutationResult }: any) => {
                return {
                  allHeroes: {
                    heroes: [...prev.allHeroes.heroes, mutationResult.data.addHero],
                  },
                };
              },
            },
          }).subscribe({
            error(error) {
              done.fail(error);
            },
          });
        }, 200);
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
