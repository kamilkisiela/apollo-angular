/// <reference path="../typings/main.d.ts" />

import ApolloClient from 'apollo-client';

import {
  GraphQLResult,
} from 'graphql';

import {
  isEqual,
  noop,
  forIn,
} from 'lodash';

export declare interface ApolloOptionsQueries {
  context: any;
};

export declare interface ApolloOptionsMutations {
  context: any;
};

export declare interface ApolloOptions {
  client: ApolloClient;
  queries?(opts: ApolloOptionsQueries): any;
  mutations?(opts: ApolloOptionsMutations): any;
};

export function Apollo({
  client,
  queries,
  mutations,
}: ApolloOptions) {
  const { watchQuery, mutate } = client;

  // noop by default
  queries = queries || noop;
  mutations = mutations || noop;

  // holds latest values to track changes
  const lastQueryVariables = {};

  return (sourceTarget: any) => {
    const target = sourceTarget;

    const oldHooks = {};
    const hooks = {
      /**
       * Initialize the component
       * after Angular initializes the data-bound input properties.
       */
      ngOnInit() {
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
    };

    // attach hooks
    forIn(hooks, (hook, name) => {
      wrapPrototype(name, hook);
    });

    function handleQueries(component: any) {
      forIn(queries(component), ({ query, variables }, queryName: string) => {
        if (!equalVariablesOf(queryName, variables)) {
          createQuery(component, queryName, { query, variables });
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
    function createQuery(component: any, queryName: string, { query, variables }) {
      // save variables so they can be used in futher comparasion
      lastQueryVariables[queryName] = variables;
      // assign to component's context
      component[queryName] = watchQuery({ query, variables });
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

    /**
     * Compares current variables with previous ones.
     *
     * @param  {string}  queryName  Query's name
     * @param  {any}     variables  current variables
     * @return {boolean}            comparasion result
     */
    function equalVariablesOf(queryName: string, variables: any): boolean {
      return isEqual(lastQueryVariables[queryName], variables);
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
