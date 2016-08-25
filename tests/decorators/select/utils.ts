import { pathToValue } from '../../../src/decorators/select/utils';

const obj = {
  foo: {
    bar: {
      baz: true,
    },
  },
  bar: {},
  baz: false,
};

describe('pathToValue', () => {
  it('should return proper values', () => {
    const tests = [{
      value: pathToValue(obj, ['foo']),
      equal: obj.foo,
    }, {
      value: pathToValue(obj, ['foo', 'bar']),
      equal: obj.foo.bar,
    }, {
      value: pathToValue(obj, ['foo', 'bar', 'baz']),
      equal: obj.foo.bar.baz,
    }, {
      value: pathToValue(obj, ['bar', 'baz']),
      equal: undefined,
    }, {
      value: pathToValue(obj, ['missing']),
      equal: undefined,
    }, {
      value: pathToValue(obj, []),
      equal: obj,
    }];

    tests.forEach(({ value, equal }) => {
      expect(value).toEqual(equal);
    });
  });

  it('should throw an error if tries to get a property from non-Object value', () => { 
    const paths = [
      ['missing', 'bar'],
      ['bar', 'baz', 'foo'],
      ['baz', 'bar'],
    ];

    paths.forEach(path => {
      expect(() => {
        pathToValue(obj, path);
      }).toThrowError(/path/);
    });
  });
});
