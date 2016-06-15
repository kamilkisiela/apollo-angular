import {
  Apollo,
} from '../../src';

import {
  Lifecycle,
} from '../_helpers';

import {
  mockClient,
} from '../_mocks';

describe('Apollo - decorator - mutations()', () => {
  let spyMutate;
  let client;

  beforeEach(() => {
    client = mockClient();
    spyMutate = spyOn(client, 'mutate')
      .and
      .returnValue('mutate');
  });

  it('should set mutations on ngOnInit', () => {
    const mutations = () => ({
      foo: () => ({
        mutation: 'mutation',
      }),
    });

    @Apollo({
      client,
      mutations,
    })
    class Foo extends Lifecycle {
      public foo: Function;
    }

    const decorated = new Foo;

    decorated.ngOnInit();

    // check
    expect(decorated.foo).toEqual(jasmine.any(Function));
  });

  it('should set new mutations on every ngDoCheck', () => {
    const mutations = () => ({
      foo: () => ({
        mutation: 'mutation',
      }),
    });

    @Apollo({
      client,
      mutations,
    })
    class Foo extends Lifecycle {
      public foo: Function;
    }

    const decorated = new Foo;

    // init
    decorated.ngOnInit();
    const previous = decorated.foo;

    // change
    decorated.ngDoCheck();
    const current = decorated.foo;

    // check
    expect(current).not.toBe(previous);
  });

  it('should set new component context on every ngDoCheck', () => {
    const mutations = (component) => ({
      foo: () => ({
        mutation: 'mutation',
        variables: {
          foobar: component.foobar,
        },
      }),
    });

    @Apollo({
      client,
      mutations,
    })
    class Foo extends Lifecycle {
      public foo: Function;
      public foobar: string = 'first';
    }

    const decorated = new Foo;

    // init
    decorated.ngOnInit();
    decorated.foo();
    expect(spyMutate).toHaveBeenCalledWith({
      mutation: 'mutation',
      variables: {
        foobar: 'first',
      },
    });

    // change
    decorated.foobar = 'second';
    decorated.ngDoCheck();
    decorated.foo();
    expect(spyMutate).toHaveBeenCalledWith({
      mutation: 'mutation',
      variables: {
        foobar: 'second',
      },
    });
  });
});
