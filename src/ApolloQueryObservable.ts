import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { $$observable } from 'rxjs/symbol/observable';
import { Operator } from 'rxjs/Operator';
import { ApolloQueryResult } from 'apollo-client';
import { ObservableQuery } from 'apollo-client/ObservableQuery';

import { ObservableQueryRef } from './utils/ObservableQuery';

export class ApolloQueryObservable<T> extends Observable<T> {
  constructor(
    public apollo: ObservableQueryRef | ObservableQuery,
    subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void
  ) {
    super(null);

    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  public lift<T, R>(operator: Operator<T, R>): Observable<R> {
    const observable = new ApolloQueryObservable<R>(this.apollo);

    observable.source = this;
    observable.operator = operator;

    return observable;
  }

  // apollo-specific methods

  public refetch(variables?: any): Promise<ApolloQueryResult> {
    return this.getObservableQuery().refetch(variables);
  }

  public stopPolling(): void {
    return this.getObservableQuery().stopPolling();
  }

  public startPolling(p: number): void {
    return this.getObservableQuery().startPolling(p);
  }

  public fetchMore(options: any): Promise<any> {
    return this.getObservableQuery().fetchMore(options);
  }

  // where magic happens

  public _subscribe(subscriber: Subscriber<T>) {
    // XXX Allows to use operators on top of the RxObservableQuery
    // if source is defined then some mutation has been used
    // allows to use "lifting" chain
    if (this.source) {
      return this.source['_subscribe'](subscriber);
    }

    const obs = this.getObservableQuery();
    return obs[$$observable]().subscribe(subscriber);
  }

  private getObservableQuery(): ObservableQuery {
    if (this.apollo instanceof ObservableQueryRef) {
      return this.apollo.getRef();
    }

    return this.apollo;
  }
}
