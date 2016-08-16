import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/observable/combineLatest';

export function observeVariables(variables?: Object): Observable<Object> {
  const keys = Object.keys(variables);

  return Observable.create((observer: Observer<any>) => {
    Observable.combineLatest(mapVariablesToObservables(variables))
      .subscribe((values) => {
        const resultVariables = {};

        values.forEach((value, i) => {
          const key = keys[i];
          resultVariables[key] = value;
        });

        observer.next(resultVariables);
      });
  });
};

function mapVariablesToObservables(variables?: Object) {
  return Object.keys(variables)
    .map(key => getVariableToObservable(variables[key]));
}

function getVariableToObservable(variable: any | Observable<any>) {
  if (variable instanceof Observable) {
    return variable;
  } else if (typeof variable !== 'undefined') {
    return new Observable<any>(subscriber => {
      subscriber.next(variable);
    });
  } else {
    return new Observable<any>(subscriber => {
      subscriber.next(undefined);
    });
  }
}
