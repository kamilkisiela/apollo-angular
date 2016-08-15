import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { Operator } from 'rxjs/Operator';
import { ApolloQueryResult } from 'apollo-client';

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

  public refetch(variables?: any): Promise<ApolloQueryResult> {
    return this.apollo.refetch(variables);
  }

  public stopPolling(): void {
    return this.apollo.stopPolling();
  }

  public startPolling(p: number): void {
    return this.apollo.startPolling(p);
  }

  public fetchMore(options: any): Promise<any> {
    return this.apollo.fetchMore(options);
  }
}
