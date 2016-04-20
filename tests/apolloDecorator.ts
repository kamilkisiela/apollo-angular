import ApolloClient from 'apollo-client';

import {
  Apollo,
} from '../src/apolloDecorator';

class Lifecycle {
  public ngOnInit: Function;
  public ngDoCheck: Function;
}

describe('Apollo - decorator', () => {
  const client = new ApolloClient();

  describe('queries()', () => {
    let spyWatchQuery;

    beforeEach(() => {
      spyWatchQuery = spyOn(client, 'watchQuery')
        .and
        .returnValue('watchQuery');
    });

    it('should set queries on ngOnInit', () => {
      const queries = (component) => ({
        foo: {
          query: 'fooQuery',
          variables: {
            foobar: component.foobar,
          },
        },
      });

      @Apollo({
        client,
        queries,
      })
      class Foo extends Lifecycle {
        public foo: any;
        public foobar: any;
      }

      const decorated = new Foo;

      decorated.foobar = 'foobar';
      decorated.ngOnInit();

      // check
      expect(spyWatchQuery).toHaveBeenCalledWith(queries({
        foobar: 'foobar',
      }).foo);
      expect(decorated.foo).toEqual('watchQuery');
    });

    it('should set new query when variables changed', () => {
      const queries = (component) => ({
        foo: {
          query: 'fooQuery',
          variables: {
            foobar: component.foobar,
          },
        },
      });

      @Apollo({
        client,
        queries,
      })
      class Foo extends Lifecycle {
        public foo: any;
        public foobar: any;
      }

      // call
      const decorated = new Foo;
      decorated.foobar = 'first';
      decorated.ngOnInit();

      decorated.foobar = 'changed';
      decorated.ngDoCheck();

      // check
      expect(spyWatchQuery).toHaveBeenCalledWith(queries({
        foobar: 'changed',
      }).foo);
      expect(decorated.foo).toEqual('watchQuery');
    });

    it('should NOT set new query when variables have not changed', () => {
      const queries = (component) => ({
        foo: {
          query: 'fooQuery',
          variables: {
            foobar: component.foobar,
          },
        },
        baz: {
          query: 'bazQuery',
          variables: {
            bazbar: component.bazbar,
          },
        },
      });

      @Apollo({
        client,
        queries,
      })
      class Foo extends Lifecycle {
        public foo: any;
        public foobar: any;
        public baz: any;
        public bazbar: any;
      }

      // init
      const decorated = new Foo;
      decorated.foobar = 'foobar';
      decorated.bazbar = 'bazbar';
      decorated.ngOnInit();

      // change
      decorated.bazbar = 'changed';
      decorated.ngDoCheck();

      // check
      expect(spyWatchQuery.calls.count()).toBe(3);
      expect(spyWatchQuery).toHaveBeenCalledWith(queries({
        bazbar: 'changed',
      }).baz);
      expect(decorated.baz).toEqual('watchQuery');
    });
  });

  describe('mutations()', () => {
    let spyMutate;

    beforeEach(() => {
      spyMutate = spyOn(client, 'mutate')
        .and
        .returnValue('mutate');
    });

    it('should set mutations on ngOnInit', () => {
      const mutations = () => ({
        foo: () => ({
          mutation: 'mutation',
        }),
      });

      @Apollo({
        client,
        mutations,
      })
      class Foo extends Lifecycle {
        public foo: Function;
      }

      const decorated = new Foo;

      decorated.ngOnInit();

      // check
      expect(decorated.foo).toEqual(jasmine.any(Function));
    });

    it('should set new mutations on every ngDoCheck', () => {
      const mutations = () => ({
        foo: () => ({
          mutation: 'mutation',
        }),
      });

      @Apollo({
        client,
        mutations,
      })
      class Foo extends Lifecycle {
        public foo: Function;
      }

      const decorated = new Foo;

      // init
      decorated.ngOnInit();
      const previous = decorated.foo;

      // change
      decorated.ngDoCheck();
      const current = decorated.foo;

      // check
      expect(current).not.toBe(previous);
    });

    it('should set new component context on every ngDoCheck', () => {
      const mutations = (component) => ({
        foo: () => ({
          mutation: 'mutation',
          variables: {
            foobar: component.foobar,
          },
        }),
      });

      @Apollo({
        client,
        mutations,
      })
      class Foo extends Lifecycle {
        public foo: Function;
        public foobar: string = 'first';
      }

      const decorated = new Foo;

      // init
      decorated.ngOnInit();
      decorated.foo();
      expect(spyMutate).toHaveBeenCalledWith({
        mutation: 'mutation',
        variables: {
          foobar: 'first',
        },
      });

      // change
      decorated.foobar = 'second';
      decorated.ngDoCheck();
      decorated.foo();
      expect(spyMutate).toHaveBeenCalledWith({
        mutation: 'mutation',
        variables: {
          foobar: 'second',
        },
      });
    });
  });
});
