import {setupAngular} from './_setup';

import {TestBed, inject, async} from '@angular/core/testing';
import gql, {disableFragmentWarnings} from 'graphql-tag';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {NgrxCache, NgrxCacheModule} from '../src';

disableFragmentWarnings();

const defaultOptions = {addTypename: false};

describe('Cache', () => {
  beforeAll(() => setupAngular());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgrxCacheModule.forRoot()],
    });
  });

  const makeTest = (text: string, testFn: (cache: NgrxCache) => void) => {
    test(text, async(inject([NgrxCache], testFn)));
  };

  describe('readQuery', () => {
    makeTest('will read some data from the store', cache => {
      const proxy = cache.create(defaultOptions).restore({
        ROOT_QUERY: {
          a: 1,
          b: 2,
          c: 3,
        },
      });
      expect(
        proxy.readQuery({
          query: gql`
            {
              a
            }
          `,
        }),
      ).toMatchObject({a: 1});
      expect(
        proxy.readQuery({
          query: gql`
            {
              b
              c
            }
          `,
        }),
      ).toMatchObject({b: 2, c: 3});
      expect(
        proxy.readQuery({
          query: gql`
            {
              a
              b
              c
            }
          `,
        }),
      ).toMatchObject({a: 1, b: 2, c: 3});
    });

    makeTest('will read some data from the store', cache => {
      const proxy = cache.create(defaultOptions).restore({
        ROOT_QUERY: {
          a: 1,
          b: 2,
          c: 3,
          d: {
            type: 'id',
            id: 'foo',
            generated: false,
          },
        },
        foo: {
          e: 4,
          f: 5,
          g: 6,
          h: {
            type: 'id',
            id: 'bar',
            generated: false,
          },
        },
        bar: {
          i: 7,
          j: 8,
          k: 9,
        },
      });

      expect(
        proxy.readQuery({
          query: gql`
            {
              a
              d {
                e
              }
            }
          `,
        }),
      ).toMatchObject({a: 1, d: {e: 4}});
      expect(
        proxy.readQuery({
          query: gql`
            {
              a
              d {
                e
                h {
                  i
                }
              }
            }
          `,
        }),
      ).toMatchObject({a: 1, d: {e: 4, h: {i: 7}}});
      expect(
        proxy.readQuery({
          query: gql`
            {
              a
              b
              c
              d {
                e
                f
                g
                h {
                  i
                  j
                  k
                }
              }
            }
          `,
        }),
      ).toMatchObject({
        a: 1,
        b: 2,
        c: 3,
        d: {e: 4, f: 5, g: 6, h: {i: 7, j: 8, k: 9}},
      });
    });

    makeTest('will read some data from the store with variables', cache => {
      const proxy = cache.create(defaultOptions).restore({
        ROOT_QUERY: {
          'field({"literal":true,"value":42})': 1,
          'field({"literal":false,"value":42})': 2,
        },
      });

      expect(
        proxy.readQuery({
          query: gql`
            query($literal: Boolean, $value: Int) {
              a: field(literal: true, value: 42)
              b: field(literal: $literal, value: $value)
            }
          `,
          variables: {
            literal: false,
            value: 42,
          },
        }),
      ).toMatchObject({a: 1, b: 2});
    });

    makeTest(
      'will read some data from the store with null variables',
      cache => {
        const proxy = cache.create(defaultOptions).restore({
          ROOT_QUERY: {
            'field({"literal":false,"value":null})': 1,
          },
        });

        expect(
          proxy.readQuery({
            query: gql`
              query($literal: Boolean, $value: Int) {
                a: field(literal: $literal, value: $value)
              }
            `,
            variables: {
              literal: false,
              value: null,
            },
          }),
        ).toMatchObject({a: 1});
      },
    );
  });

  describe('readFragment', () => {
    makeTest('will throw an error when there is no fragment', cache => {
      const proxy = cache.create(defaultOptions);

      expect(() => {
        proxy.readFragment({
          id: 'x',
          fragment: gql`
            query {
              a
              b
              c
            }
          `,
        });
      }).toThrowError(
        'Found a query operation. No operations are allowed when using a fragment as a query. Only fragments are allowed.',
      );
      expect(() => {
        proxy.readFragment({
          id: 'x',
          fragment: gql`
            schema {
              query: Query
            }
          `,
        });
      }).toThrowError(
        'Found 0 fragments. `fragmentName` must be provided when there is not exactly 1 fragment.',
      );
    });

    makeTest(
      'will throw an error when there is more than one fragment but no fragment name',
      cache => {
        const proxy = cache.create(defaultOptions);

        expect(() => {
          proxy.readFragment({
            id: 'x',
            fragment: gql`
              fragment a on A {
                a
              }

              fragment b on B {
                b
              }
            `,
          });
        }).toThrowError(
          'Found 2 fragments. `fragmentName` must be provided when there is not exactly 1 fragment.',
        );
        expect(() => {
          proxy.readFragment({
            id: 'x',
            fragment: gql`
              fragment a on A {
                a
              }

              fragment b on B {
                b
              }

              fragment c on C {
                c
              }
            `,
          });
        }).toThrowError(
          'Found 3 fragments. `fragmentName` must be provided when there is not exactly 1 fragment.',
        );
      },
    );

    makeTest(
      'will read some deeply nested data from the store at any id',
      cache => {
        const proxy = cache.create(defaultOptions).restore({
          ROOT_QUERY: {
            __typename: 'Type1',
            a: 1,
            b: 2,
            c: 3,
            d: {
              type: 'id',
              id: 'foo',
              generated: false,
            },
          },
          foo: {
            __typename: 'Foo',
            e: 4,
            f: 5,
            g: 6,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            __typename: 'Bar',
            i: 7,
            j: 8,
            k: 9,
          },
        });

        expect(
          proxy.readFragment({
            id: 'foo',
            fragment: gql`
              fragment fragmentFoo on Foo {
                e
                h {
                  i
                }
              }
            `,
          }),
        ).toMatchObject({e: 4, h: {i: 7}});
        expect(
          proxy.readFragment({
            id: 'foo',
            fragment: gql`
              fragment fragmentFoo on Foo {
                e
                f
                g
                h {
                  i
                  j
                  k
                }
              }
            `,
          }),
        ).toMatchObject({e: 4, f: 5, g: 6, h: {i: 7, j: 8, k: 9}});
        expect(
          proxy.readFragment({
            id: 'bar',
            fragment: gql`
              fragment fragmentBar on Bar {
                i
              }
            `,
          }),
        ).toMatchObject({i: 7});
        expect(
          proxy.readFragment({
            id: 'bar',
            fragment: gql`
              fragment fragmentBar on Bar {
                i
                j
                k
              }
            `,
          }),
        ).toMatchObject({i: 7, j: 8, k: 9});
        expect(
          proxy.readFragment({
            id: 'foo',
            fragment: gql`
              fragment fragmentFoo on Foo {
                e
                f
                g
                h {
                  i
                  j
                  k
                }
              }

              fragment fragmentBar on Bar {
                i
                j
                k
              }
            `,
            fragmentName: 'fragmentFoo',
          }),
        ).toMatchObject({e: 4, f: 5, g: 6, h: {i: 7, j: 8, k: 9}});
        expect(
          proxy.readFragment({
            id: 'bar',
            fragment: gql`
              fragment fragmentFoo on Foo {
                e
                f
                g
                h {
                  i
                  j
                  k
                }
              }

              fragment fragmentBar on Bar {
                i
                j
                k
              }
            `,
            fragmentName: 'fragmentBar',
          }),
        ).toMatchObject({i: 7, j: 8, k: 9});
      },
    );

    makeTest('will read some data from the store with variables', cache => {
      const proxy = cache.create(defaultOptions).restore({
        foo: {
          __typename: 'Foo',
          'field({"literal":true,"value":42})': 1,
          'field({"literal":false,"value":42})': 2,
        },
      });

      expect(
        proxy.readFragment({
          id: 'foo',
          fragment: gql`
            fragment foo on Foo {
              a: field(literal: true, value: 42)
              b: field(literal: $literal, value: $value)
            }
          `,
          variables: {
            literal: false,
            value: 42,
          },
        }),
      ).toMatchObject({a: 1, b: 2});
    });

    describe('will return null when an id that can’t be found is provided', () => {
      makeTest('on empty cache', cache => {
        const client = cache.create(defaultOptions);

        expect(
          client.readFragment({
            id: 'foo',
            fragment: gql`
              fragment fooFragment on Foo {
                a
                b
                c
              }
            `,
          }),
        ).toEqual(null);
      });
      makeTest('when it does not match any fragment', cache => {
        const client = cache.create(defaultOptions).restore({
          bar: {__typename: 'Bar', a: 1, b: 2, c: 3},
        });

        expect(
          client.readFragment({
            id: 'foo',
            fragment: gql`
              fragment fooFragment on Foo {
                a
                b
                c
              }
            `,
          }),
        ).toEqual(null);
      });
      makeTest('should work correctly', cache => {
        const client = cache.create(defaultOptions).restore({
          foo: {__typename: 'Foo', a: 1, b: 2, c: 3},
        });

        expect(
          client.readFragment({
            id: 'foo',
            fragment: gql`
              fragment fooFragment on Foo {
                a
                b
                c
              }
            `,
          }),
        ).toMatchObject({a: 1, b: 2, c: 3});
      });
    });
  });

  describe('writeQuery', () => {
    makeTest('will write some data to the store', cache => {
      const proxy = cache.create(defaultOptions);

      proxy.writeQuery({
        data: {a: 1},
        query: gql`
          {
            a
          }
        `,
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          a: 1,
        },
      });

      proxy.writeQuery({
        data: {b: 2, c: 3},
        query: gql`
          {
            b
            c
          }
        `,
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          a: 1,
          b: 2,
          c: 3,
        },
      });

      proxy.writeQuery({
        data: {a: 4, b: 5, c: 6},
        query: gql`
          {
            a
            b
            c
          }
        `,
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          a: 4,
          b: 5,
          c: 6,
        },
      });
    });

    makeTest('will write some deeply nested data to the store', cache => {
      const proxy = cache.create(defaultOptions);

      proxy.writeQuery({
        data: {a: 1, d: {e: 4}},
        query: gql`
          {
            a
            d {
              e
            }
          }
        `,
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          a: 1,
          d: {
            type: 'id',
            id: '$ROOT_QUERY.d',
            generated: true,
          },
        },
        '$ROOT_QUERY.d': {
          e: 4,
        },
      });

      proxy.writeQuery({
        data: {a: 1, d: {h: {i: 7}}},
        query: gql`
          {
            a
            d {
              h {
                i
              }
            }
          }
        `,
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          a: 1,
          d: {
            type: 'id',
            id: '$ROOT_QUERY.d',
            generated: true,
          },
        },
        '$ROOT_QUERY.d': {
          e: 4,
          h: {
            type: 'id',
            id: '$ROOT_QUERY.d.h',
            generated: true,
          },
        },
        '$ROOT_QUERY.d.h': {
          i: 7,
        },
      });

      proxy.writeQuery({
        data: {
          a: 1,
          b: 2,
          c: 3,
          d: {e: 4, f: 5, g: 6, h: {i: 7, j: 8, k: 9}},
        },
        query: gql`
          {
            a
            b
            c
            d {
              e
              f
              g
              h {
                i
                j
                k
              }
            }
          }
        `,
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          a: 1,
          b: 2,
          c: 3,
          d: {
            type: 'id',
            id: '$ROOT_QUERY.d',
            generated: true,
          },
        },
        '$ROOT_QUERY.d': {
          e: 4,
          f: 5,
          g: 6,
          h: {
            type: 'id',
            id: '$ROOT_QUERY.d.h',
            generated: true,
          },
        },
        '$ROOT_QUERY.d.h': {
          i: 7,
          j: 8,
          k: 9,
        },
      });
    });

    makeTest('will write some data to the store with variables', cache => {
      const proxy = cache.create(defaultOptions);

      proxy.writeQuery({
        data: {
          a: 1,
          b: 2,
        },
        query: gql`
          query($literal: Boolean, $value: Int) {
            a: field(literal: true, value: 42)
            b: field(literal: $literal, value: $value)
          }
        `,
        variables: {
          literal: false,
          value: 42,
        },
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        ROOT_QUERY: {
          'field({"literal":true,"value":42})': 1,
          'field({"literal":false,"value":42})': 2,
        },
      });
    });
    makeTest(
      'will write some data to the store with variables where some are null',
      cache => {
        const proxy = cache.create(defaultOptions);

        proxy.writeQuery({
          data: {
            a: 1,
            b: 2,
          },
          query: gql`
            query($literal: Boolean, $value: Int) {
              a: field(literal: true, value: 42)
              b: field(literal: $literal, value: $value)
            }
          `,
          variables: {
            literal: false,
            value: null,
          },
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          ROOT_QUERY: {
            'field({"literal":true,"value":42})': 1,
            'field({"literal":false,"value":null})': 2,
          },
        });
      },
    );
  });

  describe('writeFragment', () => {
    makeTest('will throw an error when there is no fragment', cache => {
      const proxy = cache.create(defaultOptions);

      expect(() => {
        proxy.writeFragment({
          data: {},
          id: 'x',
          fragment: gql`
            query {
              a
              b
              c
            }
          `,
        });
      }).toThrowError(
        'Found a query operation. No operations are allowed when using a fragment as a query. Only fragments are allowed.',
      );
      expect(() => {
        proxy.writeFragment({
          data: {},
          id: 'x',
          fragment: gql`
            schema {
              query: Query
            }
          `,
        });
      }).toThrowError(
        'Found 0 fragments. `fragmentName` must be provided when there is not exactly 1 fragment.',
      );
    });

    makeTest(
      'will throw an error when there is more than one fragment but no fragment name',
      cache => {
        const proxy = cache.create(defaultOptions);

        expect(() => {
          proxy.writeFragment({
            data: {},
            id: 'x',
            fragment: gql`
              fragment a on A {
                a
              }

              fragment b on B {
                b
              }
            `,
          });
        }).toThrowError(
          'Found 2 fragments. `fragmentName` must be provided when there is not exactly 1 fragment.',
        );
        expect(() => {
          proxy.writeFragment({
            data: {},
            id: 'x',
            fragment: gql`
              fragment a on A {
                a
              }

              fragment b on B {
                b
              }

              fragment c on C {
                c
              }
            `,
          });
        }).toThrowError(
          'Found 3 fragments. `fragmentName` must be provided when there is not exactly 1 fragment.',
        );
      },
    );

    makeTest(
      'will write some deeply nested data into the store at any id',
      cache => {
        const proxy = cache.create({
          dataIdFromObject: (o: any) => o.id,
          addTypename: false,
        });

        proxy.writeFragment({
          data: {__typename: 'Foo', e: 4, h: {id: 'bar', i: 7}},
          id: 'foo',
          fragment: gql`
            fragment fragmentFoo on Foo {
              e
              h {
                i
              }
            }
          `,
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          foo: {
            e: 4,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            i: 7,
          },
        });
        proxy.writeFragment({
          data: {__typename: 'Foo', f: 5, g: 6, h: {id: 'bar', j: 8, k: 9}},
          id: 'foo',
          fragment: gql`
            fragment fragmentFoo on Foo {
              f
              g
              h {
                j
                k
              }
            }
          `,
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          foo: {
            e: 4,
            f: 5,
            g: 6,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            i: 7,
            j: 8,
            k: 9,
          },
        });

        proxy.writeFragment({
          data: {i: 10, __typename: 'Bar'},
          id: 'bar',
          fragment: gql`
            fragment fragmentBar on Bar {
              i
            }
          `,
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          foo: {
            e: 4,
            f: 5,
            g: 6,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            i: 10,
            j: 8,
            k: 9,
          },
        });

        proxy.writeFragment({
          data: {j: 11, k: 12, __typename: 'Bar'},
          id: 'bar',
          fragment: gql`
            fragment fragmentBar on Bar {
              j
              k
            }
          `,
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          foo: {
            e: 4,
            f: 5,
            g: 6,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            i: 10,
            j: 11,
            k: 12,
          },
        });

        proxy.writeFragment({
          data: {
            __typename: 'Foo',
            e: 4,
            f: 5,
            g: 6,
            h: {__typename: 'Bar', id: 'bar', i: 7, j: 8, k: 9},
          },
          id: 'foo',
          fragment: gql`
            fragment fooFragment on Foo {
              e
              f
              g
              h {
                i
                j
                k
              }
            }

            fragment barFragment on Bar {
              i
              j
              k
            }
          `,
          fragmentName: 'fooFragment',
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          foo: {
            e: 4,
            f: 5,
            g: 6,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            i: 7,
            j: 8,
            k: 9,
          },
        });

        proxy.writeFragment({
          data: {__typename: 'Bar', i: 10, j: 11, k: 12},
          id: 'bar',
          fragment: gql`
            fragment fooFragment on Foo {
              e
              f
              g
              h {
                i
                j
                k
              }
            }

            fragment barFragment on Bar {
              i
              j
              k
            }
          `,
          fragmentName: 'barFragment',
        });

        expect((proxy as InMemoryCache).extract()).toMatchObject({
          foo: {
            e: 4,
            f: 5,
            g: 6,
            h: {
              type: 'id',
              id: 'bar',
              generated: false,
            },
          },
          bar: {
            i: 10,
            j: 11,
            k: 12,
          },
        });
      },
    );
    makeTest('writes data that can be read back', cache => {
      const proxy = cache.create({
        addTypename: true,
      });
      const readWriteFragment = gql`
        fragment aFragment on query {
          getSomething {
            id
          }
        }
      `;
      const data = {
        __typename: 'query',
        getSomething: {id: '123', __typename: 'Something'},
      };
      proxy.writeFragment({
        data,
        id: 'query',
        fragment: readWriteFragment,
      });

      const result = proxy.readFragment({
        fragment: readWriteFragment,
        id: 'query',
      });
      expect(result).toMatchObject(data);
    });

    makeTest('will write some data to the store with variables', cache => {
      const proxy = cache.create({
        addTypename: true,
      });

      proxy.writeFragment({
        data: {
          a: 1,
          b: 2,
          __typename: 'Foo',
        },
        id: 'foo',
        fragment: gql`
          fragment foo on Foo {
            a: field(literal: true, value: 42)
            b: field(literal: $literal, value: $value)
          }
        `,
        variables: {
          literal: false,
          value: 42,
        },
      });

      expect((proxy as InMemoryCache).extract()).toMatchObject({
        foo: {
          __typename: 'Foo',
          'field({"literal":true,"value":42})': 1,
          'field({"literal":false,"value":42})': 2,
        },
      });
    });
  });

  describe('performTransaction', () => {
    makeTest('will not broadcast mid-transaction', cache => {
      const proxy = cache.create(defaultOptions);

      let numBroadcasts = 0;

      const query = gql`
        {
          a
        }
      `;

      proxy.watch({
        query,
        optimistic: false,
        callback: () => {
          numBroadcasts++;
        },
      });

      expect(numBroadcasts).toEqual(0);

      proxy.performTransaction(p => {
        p.writeQuery({
          data: {a: 1},
          query,
        });

        expect(numBroadcasts).toEqual(0);

        p.writeQuery({
          data: {a: 4, b: 5, c: 6},
          query: gql`
            {
              a
              b
              c
            }
          `,
        });

        expect(numBroadcasts).toEqual(0);
      });

      expect(numBroadcasts).toEqual(1);
    });
  });

  describe('performOptimisticTransaction', () => {
    makeTest('will only broadcast once', cache => {
      const proxy = cache.create(defaultOptions);

      let numBroadcasts = 0;

      const query = gql`
        {
          a
        }
      `;

      proxy.watch({
        query,
        optimistic: true,
        callback: () => {
          numBroadcasts++;
        },
      });

      expect(numBroadcasts).toEqual(0);

      proxy.recordOptimisticTransaction(p => {
        p.writeQuery({
          data: {a: 1},
          query,
        });

        expect(numBroadcasts).toEqual(0);

        p.writeQuery({
          data: {a: 4, b: 5, c: 6},
          query: gql`
            {
              a
              b
              c
            }
          `,
        });

        expect(numBroadcasts).toEqual(0);
      }, '1');

      expect(numBroadcasts).toEqual(1);
    });
  });

  describe('reset', () => {
    makeTest('make sure it clears cache', cache => {
      const proxy = cache.create(defaultOptions).restore({
        ROOT_QUERY: {
          a: 1,
          b: 2,
          c: 3,
        },
      });

      expect(proxy.extract()).toMatchObject({
        ROOT_QUERY: {
          a: 1,
          b: 2,
          c: 3,
        },
      });

      proxy.reset();

      expect(proxy.extract()).toEqual({});
    });
  });
});
