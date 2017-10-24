import './_common';

import { ReflectiveInjector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { RxObservableQuery } from 'apollo-client-rxjs';
import { ApolloClient } from 'apollo-client';

import { mockClient, mockApollo } from './_mocks';
import { subscribeAndCount, createApollo } from './_utils';
import { defaultApolloClient, provideClientMap } from '../src/index';
import { ApolloBase } from '../src/Apollo';
import { CLIENT_MAP, CLIENT_MAP_WRAPPER } from '../src/tokens';

import gql from 'graphql-tag';

import 'rxjs/add/operator/map';

describe('Apollo', () => {
  describe('service', () => {
    describe('default()', () => {
      test('should return the default client', () => {
        const client = new ApolloClient();
        const apollo = createApollo({default: client});

        expect(apollo.default() instanceof ApolloBase).toBe(true);
        expect(apollo.default().getClient()).toBe(client);
      });
    });

    describe('use()', () => {
      test('should use a named client', () => {
        const defaultClient = new ApolloClient();
        const extraClient = new ApolloClient();
        const apollo = createApollo({default: defaultClient, extra: extraClient});

        expect(apollo.use('extra') instanceof ApolloBase).toBe(true);
        expect(apollo.use('extra').getClient()).toBe(extraClient);
      });
    });

    describe('getClient()', () => {
      test('should return an instance of ApolloClient', () => {
        const client = new ApolloClient();
        const apollo = createApollo({default: client});
        expect(apollo.getClient()).toBe(client);
      });
    });

    describe('watchQuery()', () => {
      test('should be called with the same options', () => {
        const client = new ApolloClient();
        const apollo = createApollo({default: client});

        const options = { query: 'gql' } as any;
        client.watchQuery = jest.fn();
        apollo.watchQuery(options);

        expect(client.watchQuery).toBeCalledWith(options);
      });

      test('should be able to use obserable variable', (done: jest.DoneCallback) => {
        const query = gql`query heroes($first: Int) {
          allHeroes(first: $first) { name }
        }`;

        const data1 = { allHeroes: [ { name: 'Foo' } ] };
        const variables1 = { first: 0 };

        const data2 = { allHeroes: [ { name: 'Bar' } ] };
        const variables2 = { first: 1 };


        const apollo = mockApollo({
          request: { query, variables: variables1 },
          result: { data: data1 },
        }, {
          request: { query, variables: variables2 },
          result: { data: data2 },
        });

        const first = new Subject();
        const options = { query, variables: { first } };

        const obs = apollo.watchQuery(options as any);

        subscribeAndCount(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data).toEqual(data1);
          } else if (handleCount === 2) {
            expect(result.data).toEqual(data2);
            done();
          }
        });

        first.next(0);

        setTimeout(() => {
          first.next(1);
        }, 200);
      });

      test('should be able to use obserable variables', (done: jest.DoneCallback) => {
        const query = gql`query heroes($first: Int, $order: String) {
          allHeroes(first: $first, order: $order) { name }
        }`;

        const data1 = { allHeroes: [ { name: 'Foo' } ] };
        const variables1 = { first: 0, order: 'ASC' };

        const data2 = { allHeroes: [ { name: 'Bar' } ] };
        const variables2 = { first: 1, order: 'ASC' };


        const apollo = mockApollo({
          request: { query, variables: variables1 },
          result: { data: data1 },
        }, {
          request: { query, variables: variables2 },
          result: { data: data2 },
        });

        const first = new Subject();
        const order = new Subject();
        const options = { query, variables: { first, order } };

        const obs = apollo.watchQuery<any>(options as any);

        subscribeAndCount<any>(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data).toEqual(data1);
          } else if (handleCount === 2) {
            expect(result.data).toEqual(data2);
            done();
          }
        });

        first.next(0);
        order.next('ASC');

        setTimeout(() => {
          first.next(1);
        }, 200);
      });

      test('should be able to refetch', (done: jest.DoneCallback) => {
        const query = gql`query heroes($first: Int) {
          allHeroes(first: $first) { name }
        }`;

        const data1 = { allHeroes: [ { name: 'Foo' } ] };
        const variables1 = { first: 0 };

        const data2 = { allHeroes: [ { name: 'Bar' } ] };
        const variables2 = { first: 1 };


        const apollo = mockApollo({
          request: { query, variables: variables1 },
          result: { data: data1 },
        }, {
          request: { query, variables: variables2 },
          result: { data: data2 },
        });

        const options = { query, variables: variables1 };
        const obs = apollo.watchQuery(options);

        obs.subscribe(({data}) => {
          expect(data).toEqual(data1);
        });

        obs.refetch(variables2).then(({data}) => {
          expect(data).toEqual(data2);
          done();
        });
      });

      test('should receive a new result on refetch', (done: jest.DoneCallback) => {
        const query = gql`query heroes($first: Int) {
          allHeroes(first: $first) { name }
        }`;

        const data1 = { allHeroes: [ { name: 'Foo' } ] };
        const variables1 = { first: 0 };

        const data2 = { allHeroes: [ { name: 'Bar' } ] };
        const variables2 = { first: 1 };


        const apollo = mockApollo({
          request: { query, variables: variables1 },
          result: { data: data1 },
        }, {
          request: { query, variables: variables2 },
          result: { data: data2 },
        });
        const obs = apollo.watchQuery<any>({ query, variables: variables1 });

        subscribeAndCount(done, obs, (handleCount, result) => {
          if (handleCount === 1) {
            expect(result.data).toEqual(data1);
            obs.refetch(variables2);
          } else if (handleCount === 3) { // 3 because there is an intermediate loading state
            expect(result.data).toEqual(data2);
            done();
          }
        });
      });

      describe('result', () => {
        test('should return the ApolloQueryObserable when no variables', () => {
          const apollo = mockApollo();
          const query = gql`query heroes {
            allHeroes { name }
          }`;
          const obs = apollo.watchQuery({ query });

          expect(obs instanceof RxObservableQuery).toEqual(true);
        });

        test('should return the ApolloQueryObserable when variables', () => {
          const apollo = mockApollo();
          const query = gql`query heroes {
            allHeroes { name }
          }`;
          const variables = {
            foo: new Subject(),
          };
          const obs = apollo.watchQuery({ query, variables });

          expect(obs instanceof RxObservableQuery).toEqual(true);
        });
      });
    });

    describe('query()', () => {
      test('should be called with the same options', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        const options = { query: 'gql' } as any;
        client.query = jest.fn().mockReturnValue(Promise.resolve('query'));

        const obs = apollo.query(options);

        obs.subscribe({
          next(r) {
            expect(r).toEqual('query');
            expect(client.query).toBeCalledWith(options);
            done();
          },
          error() {
            done.fail('should not be called');
          },
        });
      });

      test('should not be called without subscribing to it', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        client.query = jest.fn().mockReturnValue(Promise.resolve('query'));

        const obs = apollo.query({} as any);

        expect(client.query).not.toBeCalled();

        obs.subscribe({
          complete: () => {
            expect(client.query).toBeCalled();
            done();
          },
        });
      });

      test('should not reuse options map', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        client.query = jest.fn(options => {
          if (options.used) {
            throw new Error('options was reused');
          }

          options.used = true;

          return Promise.resolve('query');
        });

        const obs = apollo.query({} as any);
        const error = jest.fn(done.fail);

        obs.subscribe({
          complete: () => {
            expect(client.query).toBeCalled();

            obs.subscribe({
              error,
              complete: () => {
                expect(error).not.toBeCalled();
                done();
              },
            });
          },
        });
      });
    });

    describe('mutate()', () => {
      test('should be called with the same options', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        const options = { mutation: 'gql' } as any;
        client.mutate = jest.fn().mockReturnValue(Promise.resolve('mutation'));

        const obs = apollo.mutate(options);

        obs.subscribe({
          next(r) {
            expect(r).toEqual('mutation');
            expect(client.mutate).toBeCalledWith(options);
            done();
          },
          error() {
            done.fail('should not be called');
          },
        });
      });

      test('should not be called without subscribing to it', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        client.mutate = jest.fn().mockReturnValue(Promise.resolve('mutation'));

        const obs = apollo.mutate({} as any);

        expect(client.mutate).not.toBeCalled();

        obs.subscribe({
          complete: () => {
            expect(client.mutate).toBeCalled();
            done();
          },
        });
      });

      test('should not reuse options map', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        client.mutate = jest.fn(options => {
          if (options.used) {
            throw new Error('options was reused');
          }

          options.used = true;

          return Promise.resolve('mutation');
        });

        const obs = apollo.mutate({} as any);
        const error = jest.fn(done.fail);

        obs.subscribe({
          complete: () => {
            expect(client.mutate).toBeCalled();

            obs.subscribe({
              error,
              complete: () => {
                expect(error).not.toBeCalled();
                done();
              },
            });
          },
        });
      });
    });

    describe('subscribe', () => {
      test('should be called with the same options and return Observable', (done: jest.DoneCallback) => {
        const client = {} as ApolloClient;
        const apollo = createApollo({default: client});

        client.subscribe = jest.fn().mockReturnValue(['subscription']);

        const options = { query: 'gql' } as any;
        const obs = apollo.subscribe(options);

        expect(client.subscribe).toBeCalledWith(options);

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
      test('should update a query after mutation', (done: jest.DoneCallback) => {
        const query = gql`query heroes {
          allHeroes { name }
        }`;
        const mutation = gql`mutation addHero($name: String!) {
          addHero(name: $name) {
            name
          }
        }`;
        const variables = { name: 'Bar' };

        const data1 = { allHeroes: [ { name: 'Foo' } ] };
        const dataMutation = { addHero: { name: 'Bar' } };
        const data2 = { allHeroes: [ { name: 'Foo' }, { name: 'Bar' } ] };


        const apollo = mockApollo({
          request: { query },
          result: { data: data1 },
        }, {
          request: { query: mutation, variables },
          result: { data: dataMutation },
        });

        const obs = apollo.watchQuery({ query });

        subscribeAndCount(done, obs, (handleCount, {data}) => {
          if (handleCount === 1) {
            expect(data).toEqual(data1);

            apollo.mutate<any>({
              mutation,
              variables,
              updateQueries: {
                heroes: (prev: any, { mutationResult }: any) => {
                  return {
                    allHeroes: [...prev.allHeroes, mutationResult.data.addHero],
                  };
                },
              },
            }).subscribe({
              error(error) {
                done.fail(error.message);
              },
            });
          } else if (handleCount === 2) {
            expect(data).toEqual(data2);
            done();
          }
        });
      });

      test('should update a query with Optimistic Response after mutation', (done: jest.DoneCallback) => {
        const query = gql`query heroes {
          allHeroes {
            id
            name
          }
        }`;
        const mutation = gql`mutation addHero($name: String!) {
          addHero(name: $name) {
            id
            name
          }
        }`;
        const variables = { name: 'Bar' };

        const data1 = { allHeroes: [ { id: 1, name: 'Foo' } ] };
        const dataMutation = { addHero: { id: 2, name: 'Bar' } };
        const data2 = { allHeroes: [ { id: 1, name: 'Foo' }, { id: null, name: 'Temp' } ] };
        const data3 = { allHeroes: [ { id: 1, name: 'Foo' }, { id: 2, name: 'Bar' } ] };


        const apollo = mockApollo({
          request: { query },
          result: { data: data1 },
        }, {
          request: { query: mutation, variables },
          result: { data: dataMutation },
        });

        const obs = apollo.watchQuery({ query });

        subscribeAndCount(done, obs, (handleCount, {data}) => {
          if (handleCount === 1) {
            expect(data).toEqual(data1);

            apollo.mutate<any>({
              mutation,
              variables,
              optimisticResponse: {
                addHero: {
                  id: null,
                  name: 'Temp',
                },
              },
              updateQueries: {
                heroes: (prev: any, { mutationResult }: any) => {
                  return {
                    allHeroes: [...prev.allHeroes, mutationResult.data.addHero],
                  };
                },
              },
            }).subscribe({
              error(error) {
                done.fail(error.message);
              },
            });
          } else if (handleCount === 2) {
            expect(data).toEqual(data2);
          } else if (handleCount === 3) {
            expect(data).toEqual(data3);
            done();
          }
        });
      });
    });
  });

  describe('defaultApolloClient', () => {

    test('should set a CLIENT_MAP_WRAPPER', () => {
      const client = mockClient();
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(getClient)]);

      expect(injector.get(CLIENT_MAP_WRAPPER)).toBe(getClient);

      function getClient() {
        return client;
      }
    });

    test('should set a CLIENT_MAP', () => {
      const client = mockClient();
      const injector = ReflectiveInjector.resolveAndCreate([defaultApolloClient(getClient)]);

      expect(injector.get(CLIENT_MAP)).toEqual({default: client});

      function getClient() {
        return client;
      }
    });
  });

  describe('provideClientMap', () => {
    test('should set a CLIENT_MAP_WRAPPER', () => {
      const defaultClient = mockClient();
      const extraClient = mockClient();

      const injector = ReflectiveInjector.resolveAndCreate([provideClientMap(getClients)]);
      const clientMapWrapper = injector.get(CLIENT_MAP_WRAPPER);

      expect(clientMapWrapper).toBe(getClients);

      function getClients() {
        return {
          default: defaultClient,
          extra: extraClient,
        };
      }
    });

    test('should set a CLIENT_MAP', () => {
      const defaultClient = mockClient();
      const extraClient = mockClient();

      const injector = ReflectiveInjector.resolveAndCreate([provideClientMap(getClients)]);
      const clientMap = injector.get(CLIENT_MAP);

      expect(clientMap).toEqual({
        default: defaultClient,
        extra: extraClient,
      });

      function getClients() {
        return {
          default: defaultClient,
          extra: extraClient,
        };
      }
    });
  });
});
