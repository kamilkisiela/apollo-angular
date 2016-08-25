import { graphql } from '../../../src/decorators/graphql';
import { select } from '../../../src/decorators/select';
import { getSelectedProps } from '../../../src/decorators/select/metadata';
import { GraphQLSelectMetadata } from '../../../src/decorators/select/metadata';
import * as args from '../../../src/decorators/select/arguments';

import gql from 'graphql-tag';

const queryName = 'allHeroes';
const query = gql`
  query ${queryName} {
    heroes {
      name
    }
  }
`;

/*describe('select', () => {
  it('should call parseArguments properly', () => {
    const spy = spyOn(args, 'parseArguments').and.callThrough();
    const mapTo = ['foo', 'bar'];

    @graphql(query)
    class Foo {
      @select(mapTo) public bar: any;
    }

    expect(spy).toHaveBeenCalledWith(mapTo);
  });

  it('should set GraphQLSelectMetadata based on the result of parseArguments', () => {
    const mapTo = ['foo'];
    // check if it sets same value as the result of parseArguments
    spyOn(args, 'parseArguments').and.returnValue({mapTo});

    @graphql(query)
    class Foo {
      @select() public bar: any;
    }

    const foo = new Foo();
    const metadata = getSelectedProps(foo)['bar'];

    expect(metadata instanceof GraphQLSelectMetadata).toBe(true);
    expect(metadata.selector.mapTo).toEqual(mapTo);
  });
});*/
