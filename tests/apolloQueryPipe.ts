import {ApolloQueryPipe} from '../src/apolloQueryPipe';

describe('ApolloQueryPipe', () => {
  let pipe: ApolloQueryPipe;

  beforeEach(() => {
    pipe = new ApolloQueryPipe();
  });

  it('should return nothing if first argument is not an object', () => {
    expect(pipe.transform('test')).toBeUndefined();
  });

  it('should return nothing on empty object', () => {
    expect(pipe.transform({})).toBeUndefined();
  });

  it('should return nothing on empty data', () => {
    expect(pipe.transform({
      data: {},
    })).toBeUndefined();
  });

  it('should use the first property of data if name is not defined', () => {
    expect(pipe.transform({
      data: {
        foo: 'foo',
        bar: 'bar',
      },
    })).toEqual('foo');
  });

  it('should use a property where key matches name', () => {
    expect(pipe.transform({
      data: {
        foo: 'foo',
        bar: 'bar',
      },
    }, 'bar')).toEqual('bar');
  });
});
