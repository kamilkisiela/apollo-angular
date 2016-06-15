import gql from 'apollo-client/gql';

import {
  Apollo,
} from '../../src';

import {
  Lifecycle,
} from '../_helpers';

import {
  mockClient,
} from '../_mocks';

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
    const query = gql`
      query GetHeroes {
        heroes {
          name
        }
      }
    `;
    const calls = new Counter;
    const queries = () => {
      calls.tick();

      return {
        data: { query },
      };
    };
    const data = { heroes: { name: 'Mr Foo' } };

    const component = request({
      queries,
      requests: [ {
        request: { query },
        result: { data },
      }, ],
    });

    component.ngOnInit();
    expect(calls.get()).toEqual(1);

    component.ngDoCheck();
    expect(calls.get()).toEqual(2);

    component.ngDoCheck();
    expect(calls.get()).toEqual(3);
  });

  it('should rebuild query only when variables have changed', () => {
    const query = gql`
      query GetHeroes {
        heroes {
          name
        }
      }
    `;
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
    const data = { heroes: { name: 'Mr Foo' } };

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
    const query = gql`
      query GetHeroes {
        heroes {
          name
        }
      }
    `;
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
    const data = { heroes: { name: 'Mr Foo' } };

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

  it('should has refetch method in result object', () => {
    const component = request({});
    component.ngOnInit();

    setTimeout(() => {
      expect(typeof component.data.refetch).toEqual('function');
    }, 0);
  });

  it('should has unsubscribe method in result object', () => {
    const component = request({});
    component.ngOnInit();

    setTimeout(() => {
      expect(typeof component.data.unsubscribe).toEqual('function');
    }, 0);
  });

  it('should has startPolling method in result object', () => {
    const component = request({});
    component.ngOnInit();

    setTimeout(() => {
      expect(typeof component.data.startPolling).toEqual('function');
    }, 0);
  });

  it('should has stopPolling method in result object', () => {
    const component = request({});
    component.ngOnInit();

    setTimeout(() => {
      expect(typeof component.data.startPolling).toEqual('function');
    }, 0);
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
