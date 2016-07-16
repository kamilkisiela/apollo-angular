import gql from 'graphql-tag';

import {
  Apollo,
} from '../../src';

import {
  Lifecycle,
} from '../_helpers';

import {
  mockClient,
} from '../_mocks';

const query = gql`
  query heroes {
    allHeroes(first: 1) {
      heroes {
        name
      }
    }
  }
`;


describe('Apollo - decorator - queries()', () => {
  it('should set queries with ngOnInit', () => {
    const component = createComponent(mockClient());
    // before ngOnInit
    expect(component.data).toEqual(undefined);
    // call
    component.ngOnInit();
    // after
    expect(component.data).not.toEqual(undefined);
  });

  it('should mark as loading at startup', () => {
    expect(getInitState().data).toEqual(jasmine.objectContaining({
      loading: true,
    }));
  });

  it('should contain errors set to null at startup', () => {
    expect(getInitState().data).toEqual(jasmine.objectContaining({
      errors: null,
    }));
  });

  it('should rebuil queries on ngDoCheck', () => {
    const calls = new Counter;
    const queries = () => {
      calls.tick();

      return {
        data: { query },
      };
    };
    const data = {
      allHeroes: {
        heroes: [{ name: 'Mr Foo' }],
      },
    };

    const component = request({
      queries,
      requests: [ {
        request: { query },
        result: { data },
      } ],
    });

    component.ngOnInit();
    expect(calls.get()).toEqual(1);

    component.ngDoCheck();
    expect(calls.get()).toEqual(2);

    component.ngDoCheck();
    expect(calls.get()).toEqual(3);
  });

  it('should rebuild query only when variables have changed', () => {
    const variables1 = { name: 1 };
    const variables2 = { name: 2 };
    const queries = (state) => {
      return {
        data: {
          query,
          variables: { name: state.name },
        },
      };
    };
    const data = {
      allHeroes: {
        heroes: [{ name: 'Mr Foo' }],
      },
    };

    const client = mockClient({
      request: { query, variables: variables1 },
      result: { data },
    }, {
      request: { query, variables: variables2 },
      result: { data },
    });

    const spy = spyOn(client, 'watchQuery').and.callThrough();

    const component = request({
      queries,
      client,
    });
    component.name = variables1.name;

    component.ngOnInit();
    expect(spy.calls.count()).toEqual(1);

    component.ngDoCheck();
    expect(spy.calls.count()).toEqual(1);

    component.name = variables2.name;
    component.ngDoCheck();
    expect(spy.calls.count()).toEqual(2);
  });

  it('should NOT rebuild query if its variables have not changed', () => {
    const variablesA = { id: 0 };
    const variablesB1 = { name: 1 };
    const variablesB2 = { name: 2 };
    const queries = (state) => {
      return {
        dataA: {
          query,
          variables: { name: state.id },
        },
        dataB: {
          query,
          variables: { name: state.name },
        },
      };
    };
    const data = {
      allHeroes: {
        heroes: [{ name: 'Mr Foo' }],
      },
    };

    const client = mockClient({
      request: { query, variables: variablesB1 },
      result: { data },
    }, {
      request: { query, variables: variablesB2 },
      result: { data },
    });

    const spy = spyOn(client, 'watchQuery').and.callThrough();

    const component = request({
      queries,
      client,
    });
    component.name = variablesB1.name;
    component.id = variablesA.id;

    component.ngOnInit();
    // should call for two queries
    expect(spy.calls.count()).toEqual(2);

    component.ngDoCheck();
    // should not call again because there are no changes
    expect(spy.calls.count()).toEqual(2);

    component.name = variablesB2.name;
    component.ngDoCheck();
    // should call just one because only name property has changed
    expect(spy.calls.count()).toEqual(3);
  });

  describe('result object', () => {
    const queries = (state) => {
      return { data: { query } };
    };
    const data = {
      allHeroes: {
        heroes: [{ name: 'Mr Foo' }],
      },
    };
    let client;
    let component;

    beforeEach(() => {
      client = mockClient({
        request: { query },
        result: { data },
      });
      component = request({queries, client});
    });

    it('should be able to refetch', (done) => {
      component.ngOnInit();

      setTimeout(() => {
        expect(typeof component.data.refetch).toEqual('function');

        const spy = spyOn(component.__apolloHandle.getQuery('data'), 'refetch')
          .and.returnValue('promise');

        expect(component.data.refetch('variables')).toBe('promise');
        expect(spy).toHaveBeenCalledWith('variables');

        done();
      }, 200);
    });

    it('should be able to unsubscribe', (done) => {
      component.ngOnInit();

      setTimeout(() => {
        expect(typeof component.data.unsubscribe).toEqual('function');

        const spy = spyOn(component.__apolloHandle.getQuerySub('data'), 'unsubscribe');
        component.data.unsubscribe();

        expect(spy).toHaveBeenCalled();
        done();
      }, 200);
    });

    it('should be able to start polling', (done) => {
      component.ngOnInit();

      setTimeout(() => {
        expect(typeof component.data.startPolling).toEqual('function');

        const spy = spyOn(component.__apolloHandle.getQuery('data'), 'startPolling');
        component.data.startPolling(1234);

        expect(spy).toHaveBeenCalledWith(1234);
        done();
      }, 200);
    });

    it('should be able to stop polling', (done) => {
      component.ngOnInit();

      setTimeout(() => {
        expect(typeof component.data.stopPolling).toEqual('function');

        const spy = spyOn(component.__apolloHandle.getQuery('data'), 'stopPolling');
        component.data.stopPolling();

        expect(spy).toHaveBeenCalled();
        done();
      }, 200);
    });
  });

  it('should unsubscribe all queries on ngOnDestroy', (done) => {
    const queries = (state) => {
      return {
        dataA: { query },
        dataB: { query },
      };
    };
    const data = {
      allHeroes: {
        heroes: [{ name: 'Mr Foo' }],
      },
    };

    const client = mockClient({
      request: { query },
      result: { data },
    });

    const unsubscribe = jasmine.createSpy('unsubscribe');
    spyOn(client, 'watchQuery').and.returnValue({
      subscribe() {
        return { unsubscribe };
      },
    });

    const component = request({
      queries,
      client,
    });

    component.ngOnInit();

    setTimeout(() => {
      // destroy component
      component.ngOnDestroy();

      // for two queries
      expect(unsubscribe.calls.count()).toEqual(2);

      done();
    }, 200);
  });

  it('should refetch data with new variables', (done) => {
    const variables1 = { name: 'foo' };
    const variables2 = { name: 'bar' };
    const queries = (state) => {
      return {
        data: {
          query,
          variables: { name: state.name },
        },
      };
    };
    const data1 = {
      allHeroes: {
        heroes: [{ name: 'Mr Foo' }],
      },
    };
    const data2 = {
      allHeroes: {
        heroes: [{ name: 'Mr Bar' }],
      },
    };

    const client = mockClient({
      request: { query, variables: variables1 },
      result: { data: data1 },
    }, {
      request: { query, variables: variables2 },
      result: { data: data2 },
    });

    const component = request({
      queries,
      client,
    });
    component.name = variables1.name;

    component.ngOnInit();

    setTimeout(() => {
      // should receive proper data
      expect(component.data.allHeroes).toEqual(data1.allHeroes);

      // do refetch with new variables
      component.data.refetch(variables2).then(() => {
        // should contain new data
        expect(component.data.allHeroes).toEqual(data2.allHeroes);
        done();
      });
    }, 200);
  });

  function request(options?: any) {
    if (!options.client) {
      options.client = mockClient(...options.requests);
    }

    return createComponent(options.client, options.queries);
  }

  function createComponent(client, queries?) {
    if (!queries) {
      queries = () => {
        return {
          data: {
            query: gql`
              query GetHeroes {
                heroes {
                  name
                }
              }
            `,
          },
        };
      };
    }

    @Apollo({
      client,
      queries,
    })
    class Foo extends Lifecycle {
      public data: any;
      public dataA: any;
      public dataB: any;
      public name: any;
      public id: any;
    }

    return new Foo;
  }

  function getInitState() {
    const component = request({});
    component.ngOnInit();
    return component;
  }

  class Counter {
    public value: number = 0;

    public tick(): void {
      this.value++;
    }

    public get(): number {
      return this.value;
    }
  }
});
