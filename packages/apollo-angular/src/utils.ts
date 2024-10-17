import type { SchedulerAction, SchedulerLike, Subscription } from 'rxjs';
import { Observable, observable, queueScheduler } from 'rxjs';
import { map, observeOn, startWith } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import type {
  Observable as AObservable,
  ApolloQueryResult,
  FetchResult,
  ObservableQuery,
} from '@apollo/client/core/index.js';
import { MutationResult } from './types';

export function fromPromise<T>(promiseFn: () => Promise<T>): Observable<T> {
  return new Observable<T>(subscriber => {
    promiseFn().then(
      result => {
        if (!subscriber.closed) {
          subscriber.next(result);
          subscriber.complete();
        }
      },
      error => {
        if (!subscriber.closed) {
          subscriber.error(error);
        }
      },
    );

    return () => subscriber.unsubscribe();
  });
}

export function useMutationLoading<T>(source: Observable<FetchResult<T>>, enabled: boolean) {
  if (!enabled) {
    return source.pipe(
      map<FetchResult<T>, MutationResult<T>>(result => ({
        ...result,
        loading: false,
      })),
    );
  }

  return source.pipe(
    startWith<MutationResult<T>>({
      loading: true,
    }),
    map<MutationResult<T>, MutationResult<T>>(result => ({
      ...result,
      loading: !!result.loading,
    })),
  );
}

export class ZoneScheduler implements SchedulerLike {
  constructor(private readonly zone: NgZone) {}

  public now = Date.now ? Date.now : () => +new Date();

  public schedule<T>(
    work: (this: SchedulerAction<T>, state?: T) => void,
    delay: number = 0,
    state?: T,
  ): Subscription {
    return this.zone.run(() => queueScheduler.schedule(work, delay, state)) as Subscription;
  }
}

// XXX: Apollo's QueryObservable is not compatible with RxJS
// TODO: remove it in one of future releases
// https://github.com/ReactiveX/rxjs/blob/9fb0ce9e09c865920cf37915cc675e3b3a75050b/src/internal/util/subscribeTo.ts#L32
export function fixObservable<T>(obs: ObservableQuery<T>): Observable<ApolloQueryResult<T>>;
export function fixObservable<T>(obs: AObservable<T>): Observable<T>;
export function fixObservable<T>(
  obs: AObservable<T> | ObservableQuery<T>,
): Observable<ApolloQueryResult<T>> | Observable<T> {
  (obs as any)[observable] = () => obs;
  return obs as any;
}

export function wrapWithZone<T>(obs: Observable<T>, ngZone: NgZone): Observable<T> {
  return obs.pipe(observeOn(new ZoneScheduler(ngZone)));
}
