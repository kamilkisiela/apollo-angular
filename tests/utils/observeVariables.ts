import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switch';

import { observeVariables } from '../../src/utils/observeVariables';

describe('observeVariables', () => {
  it('should be able to subscribe to all Subjects', (done) => {
    const variables = {
      foo: new Subject(),
      bar: new Subject(),
    };

    observeVariables(variables).subscribe(values => {
      expect(values).toEqual({
        foo: 'fooV',
        bar: 'barV',
      });
      done();
    });

    variables.foo.next('fooV');
    variables.bar.next('barV');
  });

  it('should be able to handle no Subjects', (done) => {
    const variables = {
      foo: 'fooV',
      bar: 'barV',
    };

    observeVariables(variables).subscribe(values => {
      expect(values).toEqual({
        foo: 'fooV',
        bar: 'barV',
      });
      done();
    });
  });

  it('should be able to handle values mixed with Subjects and undefined', (done) => {
    const variables = {
      foo: 'fooV',
      bar: new Subject(),
      baz: undefined,
    };

    observeVariables(variables).subscribe(values => {
      expect(values).toEqual({
        foo: 'fooV',
        bar: 'barV',
        baz: undefined,
      });
      done();
    });

    variables.bar.next('barV');
  });
});
