import {setupAngular} from './_setup';

import gql from 'graphql-tag';

import {NgZone} from '@angular/core';
import {TestBed, TestBedStatic, inject, async} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {ApolloLink, InMemoryCache, NetworkStatus} from '@apollo/client/core';

import {Apollo, ApolloBase} from '../src/apollo';
import {ZoneScheduler} from '../src/utils';
import {mockSingleLink} from './mocks/mockLinks';

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
  let testBed: TestBedStatic;
  beforeAll(() => setupAngular());

  beforeEach(() => {
    testBed = TestBed.configureTestingModule({
      providers: [Apollo],
    });

    ngZone = {
      run: jest.fn((cb) => cb()),
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
      expect(apollo.default().getClient()).toBeDefined();
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
      expect(apollo.use('extra').getClient()).toBeDefined();
    });
  });

  describe('watchQuery()', () => {
    test('should be called with the same options', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();
      const options = {query: 'gql'} as any;

      client.watchQuery = jest.fn().mockReturnValue(new Observable());
      apollo.watchQuery(options);

      expect(client.watchQuery).toBeCalledWith(options);
    });

    test('should be able to refetch', (done: jest.DoneCallback) => {
      expect.assertions(3);
      const query = gql`
        query refetch($first: Int) {
          heroes(first: $first) {
            name
            __typename
          }
        }
      `;

      const data1 = {heroes: [{name: 'Foo', __typename: 'Hero'}]};
      const variables1 = {first: 0};

      const data2 = {heroes: [{name: 'Bar', __typename: 'Hero'}]};
      const variables2 = {first: 1};

      const link = mockSingleLink(
        {
          request: {query, variables: variables1},
          result: {data: data1},
        },
        {
          request: {query, variables: variables2},
          result: {data: data2},
        },
      );

      const apollo = mockApollo(link, ngZone);
      const options = {query, variables: variables1};
      const obs = apollo.watchQuery(options);

      let calls = 0;

      obs.valueChanges.subscribe({
        next: ({data}: any) => {
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
          } catch (e) {
            done.fail(e);
          }
        },
        error: (err) => {
          done.fail(err);
        },
      });

      setTimeout(() => {
        obs.refetch(variables2).then(({data}) => {
          try {
            expect(data).toMatchObject(data2);
          } catch (e) {
            done.fail(e);
          }
        });
      });
    });
  });

  describe('query()', () => {
    test('should be called with the same options', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

      const options = {query: 'gql'} as any;
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

    test('should not reuse options map', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

      client.query = jest.fn<any, any>((options) => {
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

    test('should not be called without subscribing to it', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

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
  });

  describe('mutate()', () => {
    test('should be called with the same options', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

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
      client.mutate = jest.fn().mockReturnValue(Promise.resolve('mutation'));

      const obs = apollo.mutate<any, {foo: string}>(options);

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

    test('should not reuse options map', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

      client.mutate = jest.fn<any, any>((options) => {
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

    test('should not be called without subscribing to it', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

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

    test('should work with mergeMap', (done) => {
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
        boo: true,
      };

      apollo.create({
        link: mockSingleLink(
          {
            request: op1,
            result: {data: data1},
          },
          {
            request: op2,
            result: {data: data2},
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
          done.fail(error);
        },
      });
    });
  });

  describe('subscribe', () => {
    test('should be called with the same options and return Observable', (done: jest.DoneCallback) => {
      expect.assertions(2);
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();

      client.subscribe = jest.fn().mockReturnValue(of('subscription'));

      const options = {query: 'gql'} as any;
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

    test('should run inside Zone', () => {
      const apollo = new Apollo(ngZone);

      apollo.create({
        link: mockSingleLink(),
        cache: new InMemoryCache(),
      });

      const client = apollo.getClient();
      const options = {query: 'gql'} as any;

      client.subscribe = jest.fn().mockReturnValue(['subscription']);

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

      const client = apollo.getClient();
      const options = {query: 'gql'} as any;

      client.subscribe = jest.fn().mockReturnValue(['subscription']);

      const obs = apollo.subscribe(options, {useZone: false});
      const operator = (obs as any).operator;

      expect(operator).toBeUndefined();
    });
  });

  describe('query updates', () => {
    test('should update a query after mutation', (done: jest.DoneCallback) => {
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
      const variables = {name: 'Bar'};
      // tslint:disable:variable-name
      const __typename = 'Hero';

      const FooHero = {name: 'Foo', __typename};
      const BarHero = {name: 'Bar', __typename};

      const data1 = {allHeroes: [FooHero]};
      const dataMutation = {addHero: BarHero};
      const data2 = {allHeroes: [FooHero, BarHero]};

      const link = mockSingleLink(
        {
          request: {query},
          result: {data: data1},
        },
        {
          request: {query: mutation, variables},
          result: {data: dataMutation},
        },
      );
      const apollo = mockApollo(link, ngZone);

      const obs = apollo.watchQuery({query});

      let calls = 0;
      obs.valueChanges.subscribe(({data}) => {
        calls++;

        if (calls === 1) {
          expect(data).toMatchObject(data1);

          apollo
            .mutate<any>({
              mutation,
              variables,
              updateQueries: {
                heroes: (prev: any, {mutationResult}: any) => {
                  return {
                    allHeroes: [...prev.allHeroes, mutationResult.data.addHero],
                  };
                },
              },
            })
            .subscribe({
              next: (result) => {
                expect(result.data.addHero).toMatchObject(BarHero);
              },
              error(error) {
                done.fail(error.message);
              },
            });
        } else if (calls === 2) {
          expect(data).toMatchObject(data2);
          done();
        }
      });
    });

    test('should update a query with Optimistic Response after mutation', (done: jest.DoneCallback) => {
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
      const variables = {name: 'Bar'};
      const __typename = 'Hero';

      const FooHero = {id: 1, name: 'Foo', __typename};
      const BarHero = {id: 2, name: 'Bar', __typename};
      const OptimisticHero: any = {id: null, name: 'Temp', __typename};

      const data1 = {allHeroes: [FooHero]};
      const dataMutation = {addHero: BarHero};
      const data2 = {allHeroes: [FooHero, OptimisticHero]};
      const data3 = {allHeroes: [FooHero, BarHero]};

      const link = mockSingleLink(
        {
          request: {query},
          result: {data: data1},
        },
        {
          request: {query: mutation, variables},
          result: {data: dataMutation},
        },
      );
      const apollo = mockApollo(link, ngZone);

      const obs = apollo.watchQuery({query});

      let calls = 0;
      obs.valueChanges.subscribe(({data}) => {
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
                heroes: (prev: any, {mutationResult}: any) => {
                  return {
                    allHeroes: [...prev.allHeroes, mutationResult.data.addHero],
                  };
                },
              },
            })
            .subscribe({
              error(error) {
                done.fail(error.message);
              },
            });
        } else if (calls === 2) {
          expect(data).toMatchObject(data2);
        } else if (calls === 3) {
          expect(data).toMatchObject(data3);
          done();
        }
      });
    });
  });

  test('should use HttpClient', async(
    inject([Apollo], (apollo: Apollo) => {
      expect.assertions(1);
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
        link: mockSingleLink({request: op, result: {data}}),
        cache: new InMemoryCache(),
      });

      // query
      apollo.query<any>(op).subscribe({
        next: (result) => {
          expect(result.data).toMatchObject(data);
        },
        error: (e) => {
          throw new Error(e);
        },
      });
    }),
  ));

  test('should useInitialLoading', async (done) => {
    expect.assertions(3);
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
      useInitialLoading: true,
    };
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
      link: mockSingleLink({request: op, result: {data}}),
      cache: new InMemoryCache(),
    });

    // query
    apollo.watchQuery<any>(op).valueChanges.subscribe({
      next: (result) => {
        if (alreadyCalled) {
          expect(result.data).toMatchObject(data);
          done();
        } else {
          expect(result.loading).toBe(true);
          expect(result.networkStatus).toBe(NetworkStatus.loading);
          alreadyCalled = true;
        }
      },
      error: (e) => {
        done.fail(e);
      },
    });
  });

  test('should remove default client', () => {
    const apollo = mockApollo(mockSingleLink(), ngZone);

    expect(apollo.getClient()).toBeDefined();

    apollo.removeClient();

    expect(apollo.getClient()).toBeUndefined();
  });

  test('should remove named client', () => {
    const apollo = mockApollo(mockSingleLink(), ngZone);

    apollo.createNamed('test', {
      link: mockSingleLink(),
      cache: new InMemoryCache(),
    });

    expect(apollo.getClient()).toBeDefined();
    expect(apollo.use('test').getClient()).toBeDefined();

    apollo.removeClient('test');

    expect(apollo.getClient()).toBeDefined();
    expect(apollo.use('test')).toBeUndefined();
  });
});
