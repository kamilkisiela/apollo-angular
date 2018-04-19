import {observeOn} from 'rxjs/operators';
import {Observable, Subscription, queueScheduler, Scheduler} from 'rxjs';

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

export class ZoneScheduler extends Scheduler {
  public schedule(...args: any[]): Subscription {
    return <Subscription>Zone.current.run(() => {
      return queueScheduler.schedule.apply(queueScheduler, args);
    });
  }
}

export function wrapWithZone<T>(obs: Observable<T>): Observable<T> {
  return obs.pipe(observeOn(new ZoneScheduler()));
}
