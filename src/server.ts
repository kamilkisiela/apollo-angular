import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

let _serverMode: boolean = false;
let _serverModeLocked: boolean = false;

export function lockAsServer(): void {
  _serverModeLocked = true;
  _serverMode = true;
}

export function lockAsBrowser(): void {
  _serverModeLocked = true;
  _serverMode = false;
}

export function unlockAll(): void {
  _serverModeLocked = false;
  _serverMode = false;
}

export function isServer(): boolean {
  if (_serverModeLocked === true) {
    return _serverMode;
  }

  return !(typeof window !== 'undefined' && window.document);
}

export function turnIntoMacrotask<T>(source: Observable<T>, taskName: string): Observable<T> {
  const obs = new Observable<T>((observer) => {
    const zone = global['Zone'];
    let task: any = null;
    let scheduled: boolean = false;
    let sub: Subscription = null;
    let savedResult: any = null;
    let savedError: any = null;


    const scheduleTask = (_task: any) => {
      task = _task;
      scheduled = true;

      sub = source.subscribe(
        (res) => savedResult = res,
        (err) => {
          if (!scheduled) {
            throw new Error('invoke twice');
          }
          savedError = err;
          scheduled = false;
          task.invoke();
        },
        () => {
          if (!scheduled) {
            throw new Error('invoke twice');
          }
          scheduled = false;
          task.invoke();
        });
    };

    const cancelTask = (_task: any) => {
      if (!scheduled) {
        return;
      }
      scheduled = false;

      if (sub) {
        sub.unsubscribe();
        sub = null;
      }
    };

    const onComplete = () => {
      if (savedError !== null) {
        observer.error(savedError);
      } else {
        observer.next(savedResult);
        observer.complete();
      }
    };

    const _task = zone.current.scheduleMacroTask(taskName, onComplete, {}, () => null, cancelTask);
    scheduleTask(_task);

    return () => {
      if (scheduled && task) {
        task.zone.cancelTask(task);
        scheduled = false;
      }
      if (sub) {
        sub.unsubscribe();
        sub = null;
      }
    };
  });

  return obs;
}
