import {
  Apollo,
} from '../../src';

import {
  exampleQuery,
} from '../_helpers';

import {
  mockClient,
} from '../_mocks';

describe('Apollo - decorator - common', () => {
  it('should save already existing prototype', () => {
    const onInitSpy = jasmine.createSpy('onInitSpy');
    const onCheckSpy = jasmine.createSpy('onCheckSpy');

    @Apollo({
      client: mockClient(),
      queries: () => ({
        foo: {
          query: exampleQuery,
        },
      }),
    })
    class Foo {
      public ngOnInit() {
        onInitSpy();
      }
      public ngDoCheck() {
        onCheckSpy();
      }
    }

    const decorated = new Foo;
    decorated.ngOnInit();
    decorated.ngDoCheck();

    expect(onInitSpy).toHaveBeenCalled();
    expect(onCheckSpy).toHaveBeenCalled();
  });
});
