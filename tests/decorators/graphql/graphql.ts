import { graphql } from '../../../src/decorators/graphql';

import gql from 'graphql-tag';

const queryName = 'allHeroes';
const query = gql`
  query ${queryName} {
    heroes {
      name
    }
  }
`;

describe('graphql', () => {
  it('should set GraphQLMetadata', () => {
    @graphql(query)
    class Foo {}

    const foo = new Foo();
    const defs = Reflect.getMetadata('annotations', foo.constructor)[0].definitions;
    const def = defs.get(queryName);

    expect(def.doc).toBe(query);
    expect(def.options).toBeUndefined();
    expect(def.operation).toBe('query');
  });

  it('should prepend a wrapper of the original constructor', () => {
    @graphql(query)
    class Foo {
      constructor(foo: string) {
        //
      }
    }

    const params = Reflect.getMetadata('design:paramtypes', Foo);

    expect(params[0].name).toBe('Angular2Apollo');
    expect(params[1].name).toBe('String');
  });

  it('should leave the original design:paramtypes', () => {
    @graphql(query)
    class Foo {
      constructor(foo: string) {
        //
      }
    }

    const foo = new Foo('foo');
    const params = Reflect.getMetadata('design:paramtypes', foo.constructor);

    expect(params[0].name).toBe('String');
  });
});
