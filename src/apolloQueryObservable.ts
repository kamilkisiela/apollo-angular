import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { Operator } from 'rxjs/Operator';
import { $$observable } from 'rxjs/symbol/observable';

import { FetchMoreOptions } from 'apollo-client/ObservableQuery';
import { FetchMoreQueryOptions } from 'apollo-client/watchQueryOptions';

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

  // apollo-specific methods

  public refetch(variables?: any): Promise<any> {
    return this.apollo.refetch(variables);
  }

  public stopPolling(): void {
    return this.apollo.stopPolling();
  }

  public startPolling(p: number): void {
    return this.apollo.startPolling(p);
  }

  public fetchMore(options: FetchMoreQueryOptions & FetchMoreOptions): Promise<any> {
    return this.apollo.fetchMore(options);
  }

  // where magic happens

  protected _subscribe(subscriber: Subscriber<T>) {
    const apollo = this.apollo;
    return apollo[$$observable]().subscribe(subscriber);
  }
}
