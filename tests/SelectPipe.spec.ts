import './_common';

import { Pipe } from '@angular/core';

import { SelectPipe } from '../src';

describe('SelectPipe', () => {
  let pipe;
  const pipeMetadata: Pipe = Reflect.getMetadata('annotations', SelectPipe)[0];

  beforeEach(() => {
    pipe = new SelectPipe();
  });

  it('should return nothing if name is empty', () => {
    expect(pipe.transform({ foo: 'bar' }, '')).toBe(undefined);
  });

  it('should return nothing if object is empty', () => {
    expect(pipe.transform({}, 'foo')).toBe(undefined);
  });

  it('should return nothing if object is missing', () => {
    expect(pipe.transform(undefined, 'foo')).toBe(undefined);
  });

  it('should return nothing if nothing has been found', () => {
    expect(pipe.transform({ foo: 'bar' }, 'baz')).toBe(undefined);
  });

  it('should be looking directly on object if the result comes from Apollo decorator', () => {
    const result = { foo: 'bar' };

    expect(pipe.transform(result, 'foo')).toEqual(result.foo);
  });

  it('should be looking inside data property iif the result comes fromf Angular2Apollo', () => {
    const result = {
      data: { foo: 'bar' },
    };

    expect(pipe.transform(result, 'foo')).toEqual(result.data.foo);
  });

  it('should be named select', () => {
    expect(pipeMetadata.name).toBe('select');
  });

  it('should be pure', () => {
    expect(pipeMetadata.pure).toBe(true);
  });
});
