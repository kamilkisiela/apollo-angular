import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ApolloQueryResult } from 'apollo-client';

export function subscribeAndCount<T>(done: jest.DoneCallback, observable: Observable<any>,
    cb: (handleCount: number, result: ApolloQueryResult<T>) => any): Subscription {
  let handleCount = 0;
  const subscription = observable.subscribe({
    next: result => {
      try {
        handleCount++;
        cb(handleCount, result);
      } catch (e) {
        // Wrap in a `setImmediate` so that we will unsubscribe on the next
        // tick so that we can make sure that the `subscription` has a chance
        // to be defined.
        setImmediate(() => {
          subscription.unsubscribe();
          done.fail(e);
        });
      }
    },
    error: done.fail,
  });
  return subscription;
};
