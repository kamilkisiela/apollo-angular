import { parseArguments } from '../../../src/decorators/select/arguments';

import gql from 'graphql-tag';

const queryName = 'allHeroes';
const query = gql`
  query ${queryName} {
    heroes {
      name
    }
  }
`;
const options = {
  variables: {
    foo: 'foo',
  },
};
const mapTo = ['heroes'];

describe('Arguments', () => {
  it('should be able to handle no arguments', () => {
    const selector = parseArguments();

    expect(selector.docName).toBeUndefined();
    expect(selector.options).toBeUndefined();
    expect(selector.mapTo).toBeUndefined();
  });

  it('should handle: queryName', () => {
    const selector = parseArguments(queryName);

    expect(selector.docName).toBe(queryName);
    expect(selector.options).toBeUndefined();
    expect(selector.mapTo).toBeUndefined();
  });

  it('should handle: queryName, options', () => {
    const selector = parseArguments(queryName, options);

    expect(selector.docName).toBe(queryName);
    expect(selector.options).toEqual(options);
    expect(selector.mapTo).toBeUndefined();
  });

  it('should handle: queryName, mapTo', () => {
    const selector = parseArguments(queryName, mapTo);

    expect(selector.docName).toBe(queryName);
    expect(selector.options).toBeUndefined();
    expect(selector.mapTo).toEqual(mapTo);
  });

  it('should handle: queryName, options, mapTo', () => {
    const selector = parseArguments(queryName, options, mapTo);

    expect(selector.docName).toBe(queryName);
    expect(selector.options).toEqual(options);
    expect(selector.mapTo).toEqual(mapTo);
  });

  it('should handle: mapTo', () => {
    const selector = parseArguments(mapTo);

    expect(selector.docName).toBeUndefined();
    expect(selector.options).toBeUndefined();
    expect(selector.mapTo).toEqual(mapTo);
  });

  it('should handle: options', () => {
    const selector = parseArguments(options);

    expect(selector.docName).toBeUndefined();
    expect(selector.options).toEqual(options);
    expect(selector.mapTo).toBeUndefined();
  });

  it('should throw an error on invalid arguments', () => {
    expect(() => {
      parseArguments(123);
    }).toThrowError(/arguments/);

    expect(() => {
      parseArguments('foo', 'bar');
    }).toThrowError(/query/);

    expect(() => {
      parseArguments([], []);
    }).toThrowError(/mapTo/);

    expect(() => {
      parseArguments({}, {});
    }).toThrowError(/options/);
  });

  it('should throw an error when query or mutation is available in options', () => {
    expect(() => {
      parseArguments({ query });
    }).toThrowError(/query/);

    expect(() => {
      parseArguments({ mutation: query });
    }).toThrowError(/mutation/);
  });
});
