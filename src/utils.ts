import { observeOn } from 'rxjs/operator/observeOn';
import { queue } from 'rxjs/scheduler/queue';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

export function wrapWithZone<T>(obs: Observable<T>): Observable<T> {
  return observeOn.call(obs, new ZoneScheduler(Zone.current));
}

export class ZoneScheduler {
  constructor(private zone: Zone) {}

  public schedule(...args): Subscription {
    return <Subscription> this.zone.run(() => queue.schedule.apply(queue, args));
  }
}

