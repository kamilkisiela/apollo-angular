import 'reflect-metadata';
import { Document } from 'graphql';
import gql from 'graphql-tag';
import { graphql, wrapPrototype, assignInput, GraphqlInput } from '../src/graphql';
import { Angular2Apollo } from '../src';

const query: Document = gql`
  query getBar {
    bar {
      name
    }
  }
`;

describe('wrapPrototype', () => {
  it('should replace with a new method and keep the old one', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    class Foo {
      public bar() {
        spy1();
      }
    }

    wrapPrototype(Foo)('bar', function() {
      spy2();
    });

    (new Foo()).bar();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});

describe('assignInput', () => {
  it('should assign a input', () => {
    const spy = jest.fn();
    const input: GraphqlInput = { query };

    /* tslint:disable:variable-name */
    class Foo {
      public __apollo = {
        watchQuery(options) {
          spy(options);
        },
      } as Angular2Apollo;
    }

    const foo = new Foo;

    assignInput(foo)(input);

    expect(spy).toHaveBeenCalledWith({
      query: input['query'],
    });
  });
});

describe('graphql', () => {
  let spyWatchQuery: jest.Mock<any>;
  let spyConstructor: jest.Mock<any>;
  let foo: any;
  const input: GraphqlInput = {
      query,
    };

  beforeEach(() => {
    spyWatchQuery = jest.fn();
    spyConstructor = jest.fn();

    const mock = {
        watchQuery(options) {
          spyWatchQuery(options);
          return options;
        },
    };

    @graphql([input])
    class Foo {
      public getBar: any;
      public ngOnInit: Function;
      constructor(...args: any[]) {
        spyConstructor(...args);
      }
    }

    foo = new Foo(mock);

    foo.ngOnInit();
  });

  it('should not include Angular2Apollo in the constructor', () => {
    expect(spyConstructor).toHaveBeenCalledWith();
  });
});

describe(`graphql - query`, () => {
  let spyWatchQuery;

  const mock = {
    watchQuery(options) {
      spyWatchQuery(options);
      return options;
    },
  };

  beforeEach(() => {
    spyWatchQuery = jest.fn();
  });

  const createInstance = (decoratorConfig) => {
    @graphql(decoratorConfig)
    class Foo {
      public ngOnInit: Function;

      /* tslint:disable:no-empty */
      constructor(...args: any[]) {

      }
    }

    return new Foo(mock);
  };

  it('should execute watchQuery with the correct properties', () => {
    let input = [{
      query,
    }];
    let foo = createInstance(input);
    foo.ngOnInit();

    expect(spyWatchQuery).toBeCalledWith({query});
  });
});
