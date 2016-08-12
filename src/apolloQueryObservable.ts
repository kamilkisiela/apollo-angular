import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { Operator } from 'rxjs/Operator';

import { ObservableQueryRef, IObservableQuery } from './utils/observableQuery';

export class ApolloQueryObservable<T> extends Observable<T> implements IObservableQuery  {
  constructor(public apollo: ObservableQueryRef, subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void) {
    super(subscribe);
  }

  public lift<T, R>(operator: Operator<T, R>): Observable<R> {
    const observable = new ApolloQueryObservable<R>(this.apollo);

    observable.source = this;
    observable.operator = operator;

    return observable;
  }

  // apollo-specific methods

  public refetch(variables) {
    return this.apollo.refetch(variables);
  }

  public stopPolling() {
    return this.apollo.stopPolling();
  }

  public startPolling(p) {
    return this.apollo.startPolling(p);
  }

  public fetchMore(options) {
    return this.apollo.fetchMore(options);
  }
}
