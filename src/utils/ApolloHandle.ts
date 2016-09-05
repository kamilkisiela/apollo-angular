import { ApolloQueryResult } from 'apollo-client';
import { ApolloError } from 'apollo-client/errors';

import ApolloClient from 'apollo-client';
import forIn = require('lodash.forin');
import isEqual = require('lodash.isequal');
import assign = require('lodash.assign');

export interface ApolloQuery {
  errors: ApolloError;
  loading: boolean;
  refetch: (variables?: any) => Promise<ApolloQueryResult>;
  fetchMore: (options: any) => Promise<any>;
  stopPolling: () => void;
  startPolling: (pollInterval: number) => void;
  unsubscribe: () => void;
}

export interface ApolloOptions {
  client: ApolloClient;
  queries?: (component?: any) => any;
  mutations?: (component?: any) => any;
}

export interface ApolloHandleOptions extends ApolloOptions {
  component: any;
}

export class ApolloHandle {
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
        if (this.getQuery(queryName)) {
          this.reuseQuery(queryName, options);
        } else {
          this.createQuery(queryName, options);
        }
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
    this.component[mutationName] = (...args): Promise<ApolloQueryResult> => {
      const options = method.apply(this.client, args);

      return this.client.mutate(options);
    };
  }

  // XXX https://github.com/apollostack/apollo-client/pull/362
  private backcompat(queryName: string, method: string, ...args) {
    if (this.getQuerySub(queryName)[method]) {
      return this.getQuerySub(queryName)[method](...args);
    }

    return this.getQuery(queryName)[method](...args);
  }

  private missingCompat(queryName: string, method: string, ...args) {
    if (!this.getQuery(queryName)[method]) {
      throw new Error(`Your version of the ApolloClient does not support '${method}'. Try to update.`);
    }

    return this.getQuery(queryName)[method](...args);
  }

  private subscribe(queryName: string, obs: any) {
    this.component[queryName] = {
      errors: null,
      loading: true,
      unsubscribe: () => this.getQuerySub(queryName).unsubscribe(),
      refetch: (...args) => this.backcompat(queryName, 'refetch', ...args),
      stopPolling: () => this.backcompat(queryName, 'stopPolling'),
      startPolling: (...args) => this.backcompat(queryName, 'startPolling', ...args),
      fetchMore: (...args) => this.missingCompat(queryName, 'fetchMore', ...args),
    };

    const setQuery = ({ errors, loading, data = {} }: any) => {
      const changed = this.hasDataChanged(queryName, data);

      assign(this.component[queryName], {
        errors,
        // XXX backwards compatibility of loading property
        loading: !!loading,
      }, changed ? data : {});
    };

    // we don't want to have multiple subscriptions
    this.unsubscribe(queryName);

    this.setQuery(queryName, obs);

    this.setQuerySub(queryName, this.getQuery(queryName).subscribe({
      next: setQuery,
      error(errors) {
        setQuery({ errors });
      },
    }));
  }

  private reuseQuery(queryName, { variables }) {
    // save variables so they can be used in futher comparasion
    this.saveVariables(queryName, variables);
    // refetch query
    this.backcompat(queryName, 'refetch', variables);
  }
}
