import {
  Observable,
} from 'rxjs/Observable';

import {
  Operator,
} from 'rxjs/Operator';

import {
  Subscriber,
} from 'rxjs/Subscriber';

import {
  Subscription,
} from 'rxjs/Subscription';

export class ApolloQueryObservable<T> extends Observable<T> {
  constructor(public apollo: any, subscribe?: <R>(subscriber: Subscriber<R>) => Subscription | Function | void) {
    super(subscribe);
  }

  public lift<T, R>(operator: Operator<T, R>): Observable<R> {
    const observable = new ApolloQueryObservable<R>(this.apollo);

    observable.source = this;
    observable.operator = operator;

    return observable;
  }

  public refetch(variables?: any): Promise<any> {
    return this.apollo.refetch(variables);
  }

  public stopPolling(): void {
    return this.apollo.stopPolling();
  }

  public startPolling(p: number): void {
    return this.apollo.startPolling(p);
  }
}
