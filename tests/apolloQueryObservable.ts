import {
  Observable,
} from 'rxjs/Observable';

import {
  ApolloQueryObservable,
} from '../src/apolloQueryObservable';

import 'rxjs/add/operator/map';

class ObservableQuery<T> extends Observable<T> {
  refetch(v?: any) {}
  stopPolling() {}
  startPolling(n?: any) {}
}

describe('ApolloQueryObservable', () => {
  it('should be able to call refetch()', () => {
    const obs = new ObservableQuery();
    const res = new ApolloQueryObservable(obs);
    const variables = { foo: true };

    spyOn(obs, 'refetch').and.returnValue('refetch');

    expect(res.refetch(variables)).toEqual('refetch');
    expect(obs.refetch).toHaveBeenCalledWith(variables);
  });

  it('should be able to call stopPolling()', () => {
    const obs = new ObservableQuery();
    const res = new ApolloQueryObservable(obs);

    spyOn(obs, 'stopPolling').and.returnValue('stopPolling');

    expect(res.stopPolling()).toEqual('stopPolling');
    expect(obs.stopPolling).toHaveBeenCalled();
  });

  it('should be able to call custom method after operator', () => {
    const obs = new ObservableQuery();
    spyOn(obs, 'refetch').and.returnValue('refetch');

    const res = new ApolloQueryObservable(obs).map((i) => i);


    expect(res['refetch']()).toEqual('refetch');
    expect(obs.refetch).toHaveBeenCalled();
  });
});
