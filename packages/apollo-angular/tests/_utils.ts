import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ApolloQueryResult} from 'apollo-client';
import {ReflectiveInjector} from '@angular/core';

import {Apollo, provideClientMap} from '../src/Apollo';
import {APOLLO_PROVIDERS} from '../src/ApolloModule';
import {ClientMap} from '../src/types';

export function subscribeAndCount<T>(
  done: jest.DoneCallback,
  observable: Observable<any>,
  cb: (handleCount: number, result: ApolloQueryResult<T>) => any
): Subscription {
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
          done.fail(e.message);
        });
      }
    },
    error: e => done.fail(e.message),
  });
  return subscription;
}

export function createApollo(clientMap: ClientMap): Apollo {
  const injector = ReflectiveInjector.resolveAndCreate([
    provideClientMap(() => clientMap),
    APOLLO_PROVIDERS,
  ]);
  return injector.get(Apollo);
}
