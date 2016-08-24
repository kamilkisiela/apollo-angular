import { parseArguments } from '../../../src/decorators/graphql/arguments';

import gql from 'graphql-tag';

const queryName = 'allHeroes';
const query = gql`
  query ${queryName} {
    heroes {
      name
    }
  }
`;
const query2Name = 'allPeople';
const query2 = gql`
  query ${query2Name} {
    people {
      name
    }
  }
`;
const options = {
  variables: {
    foo: 'foo',
  },
};

const opts1 = {
  query,
};

const opts2 = {
  query: query2,
  variables: options.variables,
};

describe('Arguments', () => {
  it('should handle: Document', () => {
    const def = parseArguments(query).get(queryName);

    expect(def.options).toBeUndefined();
    expect(def.doc).toBe(query);
    expect(def.kind).toBe('query');
  });

  it('should handle: Document, Options', () => {
    const def = parseArguments(query, options).get(queryName);

    expect(def.options).toEqual(options);
    expect(def.doc).toBe(query);
    expect(def.kind).toBe('query');
  });

  it('should handle: Document, Document ...', () => {
    const defs = parseArguments(query, query2);
    const def1 = defs.get(queryName);
    const def2 = defs.get(query2Name);

    expect(def1.options).toBeUndefined();
    expect(def1.doc).toBe(query);
    expect(def1.kind).toBe('query');

    expect(def2.options).toBeUndefined();
    expect(def2.doc).toBe(query2);
    expect(def2.kind).toBe('query');
  });

  it('should handle: [Document, Document ...]', () => {
    const defs = parseArguments([query, query2]);
    const def1 = defs.get(queryName);
    const def2 = defs.get(query2Name);

    expect(def1.options).toBeUndefined();
    expect(def1.doc).toBe(query);
    expect(def1.kind).toBe('query');

    expect(def2.options).toBeUndefined();
    expect(def2.doc).toBe(query2);
    expect(def2.kind).toBe('query');
  });

  it('should handle: Options', () => {
    const def = parseArguments(opts1).get(queryName);

    expect(def.options).toBeUndefined();
    expect(def.doc).toBe(query);
    expect(def.kind).toBe('query');
  });

  it('should handle: Options, Options ...', () => {
    const defs = parseArguments(opts1, opts2);
    const def1 = defs.get(queryName);
    const def2 = defs.get(query2Name);

    expect(def1.options).toBeUndefined();
    expect(def1.doc).toBe(query);
    expect(def1.kind).toBe('query');

    expect(def2.options.variables).toEqual(options.variables);
    expect(def2.doc).toBe(query2);
    expect(def2.kind).toBe('query');
  });

  it('should handle: [Options, Options ...]', () => {
    const defs = parseArguments([opts1, opts2]);

    const def1 = defs.get(queryName);
    const def2 = defs.get(query2Name);

    expect(def1.options).toBeUndefined();
    expect(def1.doc).toBe(query);
    expect(def1.kind).toBe('query');

    expect(def2.options.variables).toEqual(options.variables);
    expect(def2.doc).toBe(query2);
    expect(def2.kind).toBe('query');
  });
});
