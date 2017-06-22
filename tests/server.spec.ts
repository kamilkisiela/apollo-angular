import './_common';

import { Observable } from 'rxjs/Observable';

import { turnIntoMacrotask } from '../src/server';

const zone = global['Zone'];

describe('server', () => {
  describe('turnIntoMacrotask', () => {
    test('should create macroTask after subscribing', (done: jest.DoneCallback) => {
      const wrapped = turnIntoMacrotask(new Observable(() => {
        //
      }), 'fooTask');
      const testZone = zone.current.fork({name: 'test'});

      testZone.run(() => {
        expect(testZone._zoneDelegate._taskCounts.macroTask).toEqual(0);

        wrapped.subscribe(() => {
          //
        });

        expect(testZone._zoneDelegate._taskCounts.macroTask).toEqual(1);
        done();
      });
    });

    test('should cancel task with a proper result', (done: jest.DoneCallback) => {
      const wrapped = turnIntoMacrotask(new Observable((observer) => {
        setTimeout(() => {
          observer.next('foo');
          observer.complete();
        }, 50);
      }), 'fooTask');
      const testZone = zone.current.fork({name: 'test'});

      testZone.run(() => {
        expect(testZone._zoneDelegate._taskCounts.macroTask).toEqual(0);

        wrapped.subscribe({
          next(result) {
            setTimeout(() => {
              expect(testZone._zoneDelegate._taskCounts.macroTask).toEqual(0);
              expect(result).toEqual('foo');

              done();
            });
          },
        });
      });
    });

    test('should cancel task with a proper error', (done: jest.DoneCallback) => {
      const wrapped = turnIntoMacrotask(new Observable((observer) => {
        setTimeout(() => {
          observer.error('foo');
        }, 50);
      }), 'fooTask');
      const testZone = zone.current.fork({name: 'test'});

      testZone.run(() => {
        expect(testZone._zoneDelegate._taskCounts.macroTask).toEqual(0);

        wrapped.subscribe({
          error(error) {
            setTimeout(() => {
              expect(testZone._zoneDelegate._taskCounts.macroTask).toEqual(0);
              expect(error).toEqual('foo');

              done();
            });
          },
        });
      });
    });
  });
});
