import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApolloLink, InMemoryCache, NetworkStatus } from '@apollo/client/core';
import { mockSingleLink } from '@apollo/client/testing';
import { Apollo, ApolloBase } from '../src/apollo';
import { gql } from '../src/gql';
import { ZoneScheduler } from '../src/utils';

function mockApollo(link: ApolloLink, _ngZone: NgZone) {
  const apollo = new Apollo(_ngZone);

  apollo.create({
    link,
    cache: new InMemoryCache(),
  });

  return apollo;
}

describe('Apollo', () => {
  let ngZone: NgZone;
  let testBed: TestBed;

  beforeEach(() => {
    testBed = TestBed.configureTestingModule({
      providers: [Apollo],
    });

    ngZone = {
      run: (cb: () => unknown) => cb(),
      runOutsideAngular: (cb: () => unknown) => cb(),
    } as any;
  });

  describe('default()', () => {
    test('should return the default client', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      expect(apollo.default() instanceof ApolloBase).toBe(true);
      expect(apollo.default().client).toBeDefined();
    });
  });

  describe('use()', () => {
    test('should use a named client', () => {
      const apollo = new Apollo(ngZone);

      apollo.create(
        {
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        },
        'extra',
      );

      expect(apollo.use('extra') instanceof ApolloBase).toBe(true);
      expect(apollo.use('extra').client).toBeDefined();
    });
  });

  describe('watchQuery()', () => {
    test('should be called with the same options', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.client;
      const options = {
        query: gql`
          {
            test
          }
        `,
      };

      client.watchQuery = vi.fn().mockReturnValue(new Observable());
      apollo.watchQuery(options);

      expect(client.watchQuery).toBeCalledWith(options);
    });

    test('should be able to refetch', () =>
      new Promise<void>(done => {
        expect.assertions(3);
        const query = gql`
          query refetch($first: Int) {
            heroes(first: $first) {
              name
              __typename
            }
          }
        `;

        const data1 = { heroes: [{ name: 'Foo', __typename: 'Hero' }] };
        const variables1 = { first: 0 };

        const data2 = { heroes: [{ name: 'Bar', __typename: 'Hero' }] };
        const variables2 = { first: 1 };

        const link = mockSingleLink(
          {
            request: { query, variables: variables1 },
            result: { data: data1 },
          },
          {
            request: { query, variables: variables2 },
            result: { data: data2 },
          },
        );

        const apollo = mockApollo(link, ngZone);
        const options = { query, variables: variables1 };
        const obs = apollo.watchQuery(options);

        let calls = 0;

        obs.valueChanges.subscribe({
          next: ({ data }) => {
            calls++;

            try {
              if (calls === 1) {
                expect(data).toMatchObject(data1);
              } else if (calls === 2) {
                expect(data).toMatchObject(data2);
                done();
              } else if (calls > 2) {
                throw new Error('Called third time');
              }
            } catch (e: any) {
              throw e;
            }
          },
          error: err => {
            throw err;
          },
        });

        setTimeout(() => {
          obs.refetch(variables2).then(({ data }) => {
            try {
              expect(data).toMatchObject(data2);
            } catch (e: any) {
              throw e;
            }
          });
        });
      }));
  });

  describe('query()', () => {
    test('should be called with the same options', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        const options = { query: 'gql' } as any;
        client.query = vi.fn().mockReturnValue(Promise.resolve('query'));

        const obs = apollo.query(options);

        obs.subscribe({
          next(r) {
            expect(r).toEqual('query');
            expect(client.query).toBeCalledWith(options);
            done();
          },
          error() {
            throw 'should not be called';
          },
        });
      }));

    test('should not reuse options map', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        client.query = vi.fn<any, any>(options => {
          if (options.used) {
            throw new Error('options was reused');
          }

          options.used = true;

          return Promise.resolve('query');
        });

        const obs = apollo.query({} as any);
        const error = vi.fn(done.fail);

        obs.subscribe({
          complete: () => {
            expect(client.query).toBeCalled();

            obs.subscribe({
              error,
              complete: () => {
                expect(error).not.toHaveBeenCalled();
                done();
              },
            });
          },
        });
      }));

    test('should not be called without subscribing to it', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        client.query = vi.fn().mockReturnValue(Promise.resolve('query'));

        const obs = apollo.query({} as any);

        expect(client.query).not.toHaveBeenCalled();

        obs.subscribe({
          complete: () => {
            expect(client.query).toHaveBeenCalled();
            done();
          },
        });
      }));

    test('should NOT useInitialLoading by default', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = testBed.inject(Apollo);
        const query = gql`
          query heroes {
            heroes {
              name
              __typename
            }
          }
        `;
        const data = {
          heroes: [
            {
              name: 'Superman',
              __typename: 'Hero',
            },
          ],
        };

        // create
        apollo.create<any>({
          link: mockSingleLink({ request: { query }, result: { data } }),
          cache: new InMemoryCache(),
        });

        // query
        apollo
          .query<any>({
            query,
          })
          .subscribe({
            next: result => {
              expect(result.loading).toBe(false);
              expect(result.data).toMatchObject(data);
              setTimeout(() => {
                return done();
              }, 3000);
            },
            error: e => {
              throw e;
            },
          });
      }));
  });

  describe('mutate()', () => {
    test('should be called with the same options', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        const options = {
          mutation: gql`
            mutation setFoo($foo: String!) {
              setFoo(foo: $foo) {
                foo
              }
            }
          `,
          variables: {
            foo: 'test',
          },
        };
        client.mutate = vi.fn().mockReturnValue(
          Promise.resolve({
            data: 'mutation',
          }),
        );

        const obs = apollo.mutate<any, { foo: string }>(options);

        obs.subscribe({
          next(r) {
            expect(r.data).toEqual('mutation');
            expect(client.mutate).toBeCalledWith(options);
            done();
          },
          error() {
            throw 'should not be called';
          },
        });
      }));

    test('should not reuse options map', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        client.mutate = vi.fn<any, any>(options => {
          if (options.used) {
            throw new Error('options was reused');
          }

          options.used = true;

          return Promise.resolve('mutation');
        });

        const obs = apollo.mutate({} as any);
        const error = vi.fn(done.fail);

        obs.subscribe({
          complete: () => {
            expect(client.mutate).toBeCalled();

            obs.subscribe({
              error,
              complete: () => {
                expect(error).not.toHaveBeenCalled();
                done();
              },
            });
          },
        });
      }));

    test('should not be called without subscribing to it', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        client.mutate = vi.fn().mockReturnValue(Promise.resolve('mutation'));

        const obs = apollo.mutate({} as any);

        expect(client.mutate).not.toHaveBeenCalled();

        obs.subscribe({
          complete: () => {
            expect(client.mutate).toHaveBeenCalled();
            done();
          },
        });
      }));

    test('should work with mergeMap', () =>
      new Promise<void>(done => {
        expect.assertions(1);
        const apollo = new Apollo(ngZone);

        const op1 = {
          query: gql`
            mutation first {
              foo
            }
          `,
        };
        const data1 = {
          foo: true,
        };
        const op2 = {
          query: gql`
            mutation second {
              bar
            }
          `,
        };
        const data2 = {
          bar: true,
        };

        apollo.create({
          link: mockSingleLink(
            {
              request: op1,
              result: { data: data1 },
            },
            {
              request: op2,
              result: { data: data2 },
            },
          ),
          cache: new InMemoryCache(),
        });

        const m1 = apollo.mutate({
          mutation: op1.query,
        });

        const m2 = apollo.mutate({
          mutation: op2.query,
        });

        m1.pipe(mergeMap(() => m2)).subscribe({
          next(result) {
            expect(result.data).toMatchObject(data2);
            done();
          },
          error(error) {
            throw error;
          },
        });
      }));

    test('should NOT useMutationLoading by default', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = testBed.inject(Apollo);
        const query = gql`
          mutation addRandomHero {
            addRandomHero {
              name
              __typename
            }
          }
        `;
        const data = {
          addRandomHero: {
            name: 'Superman',
            __typename: 'Hero',
          },
        };

        // create
        apollo.create<any>({
          link: mockSingleLink({ request: { query }, result: { data } }),
          cache: new InMemoryCache(),
        });

        // mutation
        apollo
          .mutate<any>({
            mutation: query,
          })
          .subscribe({
            next: result => {
              expect(result.loading).toBe(false);
              expect(result.data).toMatchObject(data);
              setTimeout(() => {
                return done();
              }, 3000);
            },
            error: e => {
              throw e;
            },
          });
      }));

    test('should useMutationLoading on demand', () =>
      new Promise<void>(done => {
        expect.assertions(3);
        const apollo = testBed.inject(Apollo);
        const query = gql`
          mutation addRandomHero {
            addRandomHero {
              name
              __typename
            }
          }
        `;
        const data = {
          addRandomHero: {
            name: 'Superman',
            __typename: 'Hero',
          },
        };

        let alreadyCalled = false;

        // create
        apollo.create<any>({
          link: mockSingleLink({ request: { query }, result: { data } }),
          cache: new InMemoryCache(),
        });

        // mutation
        apollo
          .mutate<any>({
            mutation: query,
            useMutationLoading: true,
          })
          .subscribe({
            next: result => {
              if (alreadyCalled) {
                expect(result.loading).toBe(false);
                expect(result.data).toMatchObject(data);
                setTimeout(() => {
                  return done();
                }, 3000);
              } else {
                expect(result.loading).toBe(true);
                alreadyCalled = true;
              }
            },
            error: e => {
              throw e;
            },
          });
      }));
  });

  describe('subscribe', () => {
    test('should be called with the same options and return Observable', () =>
      new Promise<void>(done => {
        expect.assertions(2);
        const apollo = new Apollo(ngZone);

        apollo.create({
          link: mockSingleLink(),
          cache: new InMemoryCache(),
        });

        const client = apollo.client;

        client.subscribe = vi.fn().mockReturnValue(
          of({
            data: 'subscription',
          }),
        );

        const options = { query: 'gql' } as any;
        const obs = apollo.subscribe(options);

        expect(client.subscribe).toBeCalledWith(options);

        obs.subscribe({
          next(result) {
            expect(result.data).toBe('subscription');
            done();
          },
          error() {
            throw 'should not be called';
          },
        });
      }));

    // @TODO: Get schedule instance from newer RxJS observable
    test.skip('should run inside Zone', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.client;
      const options = { query: 'gql' } as any;

      client.subscribe = vi.fn().mockReturnValue(['subscription']);

      const obs = apollo.subscribe(options);
      const scheduler = (obs as any).operator.scheduler;

      expect(scheduler instanceof ZoneScheduler).toEqual(true);
    });

    test('should run outside Zone if useZone equals false', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.client;
      const options = { query: 'gql' } as any;

      client.subscribe = vi.fn().mockReturnValue(['subscription']);

      const obs = apollo.subscribe(options, { useZone: false });
      const operator = (obs as any).operator;

      expect(operator).toBeUndefined();
    });
  });

  describe('watchFragment', () => {
    test('should be called with the same options', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.client;

      const fragment = gql`
        fragment ItemFragment on Item {
          id
          text
        }
      `;

      const from = 'Item:1';

      const options = {
        fragment,
        from,
      };

      client.watchFragment = vi.fn().mockReturnValue(new Observable());
      apollo.watchFragment(options);

      expect(client.watchFragment).toBeCalledWith(options);
    });
  });

  describe('query updates', () => {
    test('should update a query after mutation', () =>
      new Promise<void>(done => {
        expect.assertions(3);
        const query = gql`
          query heroes {
            allHeroes {
              name
              __typename
            }
          }
        `;
        const mutation = gql`
          mutation addHero($name: String!) {
            addHero(name: $name) {
              name
              __typename
            }
          }
        `;
        const variables = { name: 'Bar' };
        // tslint:disable:variable-name
        const __typename = 'Hero';

        const FooHero = { name: 'Foo', __typename };
        const BarHero = { name: 'Bar', __typename };

        const data1 = { allHeroes: [FooHero] };
        const dataMutation = { addHero: BarHero };
        const data2 = { allHeroes: [FooHero, BarHero] };

        const link = mockSingleLink(
          {
            request: { query },
            result: { data: data1 },
          },
          {
            request: { query: mutation, variables },
            result: { data: dataMutation },
          },
        );
        const apollo = mockApollo(link, ngZone);

        const obs = apollo.watchQuery({ query });

        let calls = 0;
        obs.valueChanges.subscribe(({ data }) => {
          calls++;

          if (calls === 1) {
            expect(data).toMatchObject(data1);

            apollo
              .mutate<any>({
                mutation,
                variables,
                updateQueries: {
                  heroes: (prev: any, { mutationResult }: any) => {
                    return {
                      allHeroes: [...prev.allHeroes, mutationResult.data.addHero],
                    };
                  },
                },
              })
              .subscribe({
                next: result => {
                  expect(result.data.addHero).toMatchObject(BarHero);
                },
                error(error) {
                  throw error.message;
                },
              });
          } else if (calls === 2) {
            expect(data).toMatchObject(data2);
            done();
          }
        });
      }));

    test('should update a query with Optimistic Response after mutation', () =>
      new Promise<void>(done => {
        expect.assertions(3);
        const query = gql`
          query heroes {
            allHeroes {
              id
              name
              __typename
            }
          }
        `;
        const mutation = gql`
          mutation addHero($name: String!) {
            addHero(name: $name) {
              id
              name
              __typename
            }
          }
        `;
        const variables = { name: 'Bar' };
        const __typename = 'Hero';

        const FooHero = { id: 1, name: 'Foo', __typename };
        const BarHero = { id: 2, name: 'Bar', __typename };
        const OptimisticHero = { id: null, name: 'Temp', __typename };

        const data1 = { allHeroes: [FooHero] };
        const dataMutation = { addHero: BarHero };
        const data2 = { allHeroes: [FooHero, OptimisticHero] };
        const data3 = { allHeroes: [FooHero, BarHero] };

        const link = mockSingleLink(
          {
            request: { query },
            result: { data: data1 },
          },
          {
            request: { query: mutation, variables },
            result: { data: dataMutation },
          },
        );
        const apollo = mockApollo(link, ngZone);

        const obs = apollo.watchQuery({ query });

        let calls = 0;
        obs.valueChanges.subscribe(({ data }) => {
          calls++;

          if (calls === 1) {
            expect(data).toMatchObject(data1);

            apollo
              .mutate<any>({
                mutation,
                variables,
                optimisticResponse: {
                  addHero: OptimisticHero,
                },
                updateQueries: {
                  heroes: (prev: any, { mutationResult }: any) => {
                    return {
                      allHeroes: [...prev.allHeroes, mutationResult.data.addHero],
                    };
                  },
                },
              })
              .subscribe({
                error(error) {
                  throw error.message;
                },
              });
          } else if (calls === 2) {
            expect(data).toMatchObject(data2);
          } else if (calls === 3) {
            expect(data).toMatchObject(data3);
            done();
          }
        });
      }));
  });

  test('should use HttpClient', () =>
    new Promise<void>(done => {
      expect.assertions(1);
      const apollo = testBed.inject(Apollo);
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
              __typename
            }
          }
        `,
        variables: {},
      };
      const data = {
        heroes: [
          {
            name: 'Superman',
            __typename: 'Hero',
          },
        ],
      };

      // create
      apollo.create<any>({
        link: mockSingleLink({ request: op, result: { data } }),
        cache: new InMemoryCache(),
      });

      // query
      apollo.query<any>(op).subscribe({
        next: result => {
          expect(result.data).toMatchObject(data);
          done();
        },
        error: e => {
          throw e;
        },
      });
    }));

  test('should useInitialLoading', () =>
    new Promise<void>(done => {
      expect.assertions(3);
      const apollo = testBed.inject(Apollo);
      const query = gql`
        query heroes {
          heroes {
            name
            __typename
          }
        }
      `;
      const data = {
        heroes: [
          {
            name: 'Superman',
            __typename: 'Hero',
          },
        ],
      };

      let alreadyCalled = false;

      // create
      apollo.create<any>({
        link: mockSingleLink({ request: { query }, result: { data } }),
        cache: new InMemoryCache(),
      });

      // query
      apollo
        .watchQuery<any>({
          query,
          useInitialLoading: true,
        })
        .valueChanges.subscribe({
          next: result => {
            if (alreadyCalled) {
              expect(result.data).toMatchObject(data);
              setTimeout(() => {
                return done();
              }, 3000);
            } else {
              expect(result.loading).toBe(true);
              expect(result.networkStatus).toBe(NetworkStatus.loading);
              alreadyCalled = true;
            }
          },
          error: e => {
            throw e;
          },
        });
    }));

  test('useInitialLoading should emit false once when data is already available', () =>
    new Promise<void>(done => {
      expect.assertions(4);
      const apollo = testBed.inject(Apollo);
      const query = gql`
        query heroes {
          heroes {
            name
            __typename
          }
        }
      `;
      const data = {
        heroes: [
          {
            name: 'Superman',
            __typename: 'Hero',
          },
        ],
      };

      let calls = 0;

      const cache = new InMemoryCache();

      cache.writeQuery({
        query: query,
        data,
      });

      // create
      apollo.create<any>({
        link: mockSingleLink({ request: { query }, result: { data } }),
        cache,
      });

      // query
      apollo
        .watchQuery<any>({
          query,
          notifyOnNetworkStatusChange: true,
          useInitialLoading: true,
        })
        .valueChanges.subscribe({
          next: result => {
            calls++;

            if (calls === 1) {
              setTimeout(() => {
                expect(calls).toEqual(1);
                expect(result.loading).toEqual(false);
                expect(result.networkStatus).toEqual(NetworkStatus.ready);
                expect(result.data).toEqual(data);
                return done();
              }, 3000);
            }
          },
          error: e => {
            throw e;
          },
        });
    }));

  test('should emit cached result only once', () =>
    new Promise<void>(done => {
      expect.assertions(3);
      const apollo = testBed.inject(Apollo);
      const query = gql`
        query heroes {
          heroes {
            name
            __typename
          }
        }
      `;
      const data = {
        heroes: [
          {
            name: 'Superman',
            __typename: 'Hero',
          },
        ],
      };

      let calls = 0;

      const cache = new InMemoryCache();

      cache.writeQuery({
        query: query,
        data,
      });

      // create
      apollo.create<any>({
        link: mockSingleLink({ request: { query }, result: { data } }),
        cache,
      });

      // query
      apollo
        .watchQuery<any>({
          query,
        })
        .valueChanges.subscribe({
          next: result => {
            calls++;

            if (calls === 1) {
              setTimeout(() => {
                expect(calls).toEqual(1);
                expect(result.loading).toEqual(false);
                expect(result.data).toEqual(data);
                return done();
              }, 3000);
            }
          },
          error: e => {
            throw e;
          },
        });
    }));

  test('should create default client with named options', () => {
    const apollo = new Apollo(ngZone, undefined, {
      default: {
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      },
      test: {
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      },
    });

    expect(apollo.client).toBeDefined();
    expect(apollo.use('test').client).toBeDefined();
  });

  test('should remove default client', () => {
    const apollo = mockApollo(mockSingleLink(), ngZone);

    expect(apollo.client).toBeDefined();

    apollo.removeClient();

    expect(() => apollo.client).toThrow('Client has not been defined yet');
  });

  test('should remove named client', () => {
    const apollo = mockApollo(mockSingleLink(), ngZone);

    apollo.createNamed('test', {
      link: mockSingleLink(),
      cache: new InMemoryCache(),
    });

    expect(apollo.client).toBeDefined();
    expect(apollo.use('test').client).toBeDefined();

    apollo.removeClient('test');

    expect(apollo.client).toBeDefined();
    expect(apollo.use('test')).toBeUndefined();
  });
});
