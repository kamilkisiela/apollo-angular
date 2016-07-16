import ApolloClient from 'apollo-client';

import {
  GraphQLResult,
} from 'graphql';

import {
  isEqual,
  forIn,
  assign,
} from 'lodash';

export interface ApolloOptions {
  client: ApolloClient;
  queries?: (component?: any) => any;
  mutations?: (component?: any) => any;
}

interface ApolloHandleOptions extends ApolloOptions {
  component: any;
}

class ApolloHandle {
  private lastQueryVariables: Object = {};
  private queryHandles: Object = {};
  private querySubscriptions: Object = {};

  private component;
  private client;
  private queries;
  private mutations;


  public constructor({
    component,
    client,
    queries,
    mutations,
  }: ApolloHandleOptions) {
    this.component = component;
    this.client = client;
    this.queries = queries;
    this.mutations = mutations;
  }

  public handleQueries(): void {
    if (!this.queries) {
      return;
    }

    forIn(this.queries(this.component), (options, queryName: string) => {
      if (this.hasVariablesChanged(queryName, options.variables)) {
        this.createQuery(queryName, options);
      }
    });
  }

  public handleMutations(): void {
    if (!this.mutations) {
      return;
    }

    forIn(this.mutations(this.component), (method: Function, mutationName: string) => {
      this.createMutation(mutationName, method);
    });
  }

  public unsubscribe(queryName?: string): void {
    const allQueries = this.getAllQueriesSubs();

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

  private setQuery(name, handle): void {
    this.queryHandles[name] = handle;
  }

  private getQuery(name) {
    return this.queryHandles[name];
  }

  private setQuerySub(name, sub): void {
    this.querySubscriptions[name] = sub;
  }

  private getQuerySub(name) {
    return this.querySubscriptions[name];
  }

  private getAllQueriesSubs() {
    return this.querySubscriptions;
  }

  /**
   * Saves variables so they can be used in futher comparasion
   * @param {string} queryName Query's name
   * @param {any}    variables used variables
   */
  private saveVariables(queryName: string, variables: any): void {
    this.lastQueryVariables[queryName] = variables;
  }

  /**
   * Compares current variables with previous ones.
   * @param  {string}  queryName Query's name
   * @param  {any}     variables current variables
   * @return {boolean}           comparasion result
   */
  private hasVariablesChanged(queryName: string, variables: any): boolean {
    return !(
      this.lastQueryVariables.hasOwnProperty(queryName)
      && isEqual(this.lastQueryVariables[queryName], variables)
    );
  }

  private hasDataChanged(queryName: string, data: any): boolean {
    let changed = false;

    forIn(data, (value, key) => {
      if (!isEqual(this.component[queryName][key], value)) {
        changed = true;
        return;
      }
    });

    return changed;
  }

  private createQuery(queryName: string, options: any) {
    // save variables so they can be used in futher comparasion
    this.saveVariables(queryName, options.variables);
    // assign to component's context
    this.subscribe(queryName, this.client.watchQuery(options));
  }

  private createMutation(mutationName: string, method: Function) {
    // assign to component's context
    this.component[mutationName] = (...args): Promise<GraphQLResult> => {
      const options = method.apply(this.client, args);

      return this.client.mutate(options);
    };
  }

  // XXX https://github.com/apollostack/apollo-client/pull/362
  private backcompat(queryName: string, method: string, args?) {
    if (this.getQuerySub(queryName)[method]) {
      return this.getQuerySub(queryName)[method](...args);
    }

    return this.getQuery(queryName)[method](...args);
  }

  private subscribe(queryName: string, obs: any) {
    this.component[queryName] = {
      errors: null,
      loading: true,
    };

    const setQuery = ({ errors, data = {} }: any) => {
      const changed = this.hasDataChanged(queryName, data);

      assign(this.component[queryName], {
        errors,
        loading: false,
        unsubscribe: () => this.getQuerySub(queryName).unsubscribe(),
        refetch: (...args) => this.backcompat(queryName, 'refetch', args),
        stopPolling: () => this.backcompat(queryName, 'stopPolling'),
        startPolling: (...args) => this.backcompat(queryName, 'startPolling', args),
      }, changed ? data : {});
    };

    // we don't want to have multiple subscriptions
    this.unsubscribe(queryName);

    this.setQuery(queryName, obs);

    this.setQuerySub(queryName, obs.subscribe({
      next: setQuery,
      error(errors) {
        setQuery({ errors });
      },
    }));
  }
}

export function Apollo({
  client,
  queries,
  mutations,
}: ApolloOptions) {
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
        if (!this[apolloProp]) {
          this[apolloProp] = new ApolloHandle({
            component: this,
            client,
            queries,
            mutations,
          });
        }

        this[apolloProp].handleQueries();
        this[apolloProp].handleMutations();
      },
      /**
       * Detect and act upon changes that Angular can or won't detect on its own.
       * Called every change detection run.
       */
      ngDoCheck() {
        this[apolloProp].handleQueries();
        this[apolloProp].handleMutations();
      },
      /**
       * Stop all of watchQuery subscriptions
       */
      ngOnDestroy() {
        this[apolloProp].unsubscribe();
      },
    };

    // attach hooks
    forIn(hooks, (hook, name) => {
      wrapPrototype(name, hook);
    });

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
