/// <reference path="../typings/main.d.ts" />

import ApolloClient from 'apollo-client';

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
  if (!(client instanceof ApolloClient)) {
    throw new Error('Client must be a ApolloClient instance');
  }

  const { watchQuery } = client;

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
        const component = this;
        handleQueries(component, (key, { query, variables }) => {
          assign(component, key, { query, variables });
        });
      },
      /**
       * Detect and act upon changes that Angular can or won't detect on its own.
       * Called every change detection run.
       */
      ngDoCheck() {
        // use component's context
        const component = this;
        handleQueries(component, (queryName, { query, variables }) => {
          // check if query needs to be rerun
          if (!equalVariablesOf(queryName, variables)) {
            assign(component, queryName, { query, variables });
          }
        });
      },
    };

    // attach hooks
    forIn(hooks, (hook, name) => {
      wrapPrototype(name, hook);
    });

    /**
     * Gets the result of the `queries` method
     * from decorator's options with component's context to compile variables.
     *
     * Then goes through all defined queries and calls a `touch` function.
     *
     * @param  {any}      component   Component's context
     * @param  {Function} touch       Receives name and options
     */
    function handleQueries(component: any, touch: Function) {
      forIn(queries(component), (opts: any, queryName: string) => {
        touch(queryName, opts);
      });
    }

    /**
     * Assings WatchQueryHandle to component
     *
     * @param  {any}    component   Component's context
     * @param  {string} queryName   Query's name
     * @param  {Object} options     Query's options
     */
    function assign(component: any, queryName: string, { query, variables }) {
      // save variables so they can be used in futher comparasion
      lastQueryVariables[queryName] = variables;
      // assign to component's context
      component[queryName] = watchQuery({ query, variables });
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
     * @param  {string}   name [description]
     * @param  {Function} func [description]
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
