import './_setup';

import {Pipe} from '@angular/core';

import {SelectPipe} from '../src/SelectPipe';

describe('SelectPipe', () => {
  let pipe;
  const pipeMetadata: Pipe = Reflect.getMetadata('annotations', SelectPipe)[0];

  beforeEach(() => {
    pipe = new SelectPipe();
  });

  test('should return nothing if name is empty', () => {
    expect(pipe.transform({foo: 'bar'}, '')).toBe(undefined);
  });

  test('should return nothing if object is empty', () => {
    expect(pipe.transform({}, 'foo')).toBe(undefined);
  });

  test('should return nothing if object is missing', () => {
    expect(pipe.transform(undefined, 'foo')).toBe(undefined);
  });

  test('should return nothing if nothing has been found', () => {
    expect(pipe.transform({foo: 'bar'}, 'baz')).toBe(undefined);
  });

  test('should be looking inside data property', () => {
    const result = {
      data: {foo: 'bar'},
    };

    expect(pipe.transform(result, 'foo')).toEqual(result.data.foo);
  });

  test('should be named select', () => {
    expect(pipeMetadata.name).toBe('select');
  });

  test('should be pure', () => {
    expect(pipeMetadata.pure).toBe(true);
  });
});
