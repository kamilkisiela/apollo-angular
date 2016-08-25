import { defineProperties } from '../../../src/decorators/select';
import { Angular2Apollo } from '../../../src/Angular2Apollo'

import './utils';
import './arguments';
import './select';

/*describe('defineProperties', () => {
  let client: Angular2Apollo;

  beforeEach(() => {
    client = {
      watchQuery() {},
      mutate() {},
    } as any;
    
    spyOn(client, 'watchQuery').and.returnValue('watchQuery');
    spyOn(client, 'mutate').and.returnValue('mutate');
  });

  it('should', () => {
    @graphql(query)
    class Foo {

    }
  });
});*/