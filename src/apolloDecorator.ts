import ApolloClient from 'apollo-client';

import {
  assign,
} from 'lodash';

import {
  GraphQLResult,
} from 'graphql';

import {
  isEqual,
  noop,
  forIn,
} from 'lodash';

export interface ApolloOptions {
  client: ApolloClient;
  queries?: Function;
  mutations?: Function;
}

class ApolloHandle {
  private lastQueryVariables: Object = {};
  private queryHandles: Object = {};

  public setQuery(name, handle): void {
    this.queryHandles[name] = handle;
  }

  public getQuery(name) {
    return this.queryHandles[name];
  }

  public getAllQueries() {
    return this.queryHandles;
  }

  /**
   * Saves variables so they can be used in futher comparasion
   * @param {string} queryName Query's name
   * @param {any}    variables used variables
   */
  public saveVariables(queryName: string, variables: any): void {
    this.lastQueryVariables[queryName] = variables;
  }

  /**
   * Compares current variables with previous ones.
   * @param  {string}  name      Query's name
   * @param  {any}     variables current variables
   * @return {boolean}           comparasion result
   */
  public shouldRebuildQuery(name: string, variables: any): boolean {
    return !(
      this.lastQueryVariables.hasOwnProperty(name)
      && isEqual(this.lastQueryVariables[name], variables)
    );
  }
}

export function Apollo({
  client,
  queries,
  mutations,
}: ApolloOptions) {
  const { watchQuery, mutate } = client;
  // noop by default
  queries = queries || noop;
  mutations = mutations || noop;

  const apolloProp = '__apolloHandle';

  return (sourceTarget: any) => {
    const target = sourceTarget;

    const oldHooks = {};
    const hooks = {
      /**
       * Initialize the component
       * after Angular initializes the data-bound input properties.
       */
      ngOnInit() {
        init(this);
        // use component's context
        handleQueries(this);
        handleMutations(this);
      },
      /**
       * Detect and act upon changes that Angular can or won't detect on its own.
       * Called every change detection run.
       */
      ngDoCheck() {
        // use component's context
        handleQueries(this);
        handleMutations(this);
      },
      /**
       * Stop all of watchQuery subscriptions
       */
      ngOnDestroy() {
        unsubscribe(this);
      },
    };

    // attach hooks
    forIn(hooks, (hook, name) => {
      wrapPrototype(name, hook);
    });

    function init(component: any) {
      if (!component[apolloProp]) {
        component[apolloProp] = new ApolloHandle;
      }
    }

    function handleQueries(component: any) {
      forIn(queries(component), (options, queryName: string) => {
        if (getApollo(component).shouldRebuildQuery(queryName, options.variables)) {
          createQuery(component, queryName, options);
        }
      });
    }

    function handleMutations(component: any) {
      forIn(mutations(component), (method: Function, mutationName: string) => {
        createMutation(component, mutationName, method);
      });
    }

    /**
     * Assings WatchQueryHandle to the component
     *
     * @param  {any}    component   Component's context
     * @param  {string} queryName   Query's name
     * @param  {Object} options     Query's options
     */
    function createQuery(component: any, queryName: string, options) {
      // save variables so they can be used in futher comparasion
      getApollo(component).saveVariables(queryName, options.variables);
      // assign to component's context
      subscribe(component, queryName, watchQuery(options));
    }

    /**
     * Assings wrapper of mutation to the component
     *
     * @param  {any}      component    Component's context
     * @param  {string}   mutationName Mutation's name
     * @param  {Function} method       Method returning mutation options
     * @return {Promise}               Mutation result
     */
    function createMutation(component: any, mutationName: string, method: Function) {
      // assign to component's context
      component[mutationName] = (...args): Promise<GraphQLResult> => {
        const { mutation, variables } = method.apply(client, args);

        return mutate({ mutation, variables });
      };
    }

    function subscribe(component: any, queryName: string, obs: any) {
      component[queryName] = {
        errors: null,
        loading: true,
      };

      const setQuery = ({ errors, data = {} }: any) => {
        component[queryName] = assign({
          errors,
          loading: false,
          unsubscribe() {
            return getApollo(component).getQuery(queryName).unsubscribe();
          },
          refetch(...args) {
            return getApollo(component).getQuery(queryName).refetch(...args);
          },
          stopPolling() {
            return getApollo(component).getQuery(queryName).stopPolling();
          },
          startPolling(...args) {
            return getApollo(component).getQuery(queryName).startPolling(...args);
          },
        }, data);
      };

      // we don't want to have multiple subscriptions
      unsubscribe(component, queryName);

      getApollo(component).setQuery(queryName, obs.subscribe({
        next: setQuery,
        error(errors) {
          setQuery({ errors });
        },
      }));
    };

    function unsubscribe(component: any, queryName?: string) {
      const apollo = getApollo(component);
      const allQueries = apollo.getAllQueries();

      if (allQueries) {
        if (queryName) {
          const single = allQueries[queryName];
          // just one
          if (single) {
            single.unsubscribe();
          }
        } else {
          // loop through all
          for (const name in allQueries) {
            if (allQueries.hasOwnProperty(name)) {
              allQueries[name].unsubscribe();
            }
          }
        }
      }
    }

    function getApollo(component: any) {
      return component[apolloProp];
    }

    /**
     * Creates a new prototype method which is a wrapper function
     * that calls new function before old one.
     *
     * @param  {string}   name
     * @param  {Function} func
     */
    function wrapPrototype(name: string, func: Function) {
      oldHooks[name] = sourceTarget.prototype[name];
      // create a wrapper
      target.prototype[name] = function(...args) {
        // to call a new prototype method
        func.apply(this, args);

        // call the old prototype method
        if (oldHooks[name]) {
          oldHooks[name].apply(this, args);
        }
      };
    }

    // return decorated target
    return target;
  };
}
