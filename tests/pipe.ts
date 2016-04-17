import {it, describe, expect, beforeEach, inject} from 'angular2/testing';
import {ApolloQueryPipe} from '../src/pipe';

describe('ApolloQueryPipe', () => {
  let pipe: ApolloQueryPipe;

  beforeEach(() => {
    pipe = new ApolloQueryPipe();
  });

  it('should capitalize all words in a string', () => {
    const object = {
      data: {
        foo: 'bar'
      }
    };
    const result = pipe.transform(object, ['foo']);

    expect(result).toEqual(object.data.foo);
  });
});
