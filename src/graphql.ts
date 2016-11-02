import { Document } from 'graphql';

import * as replaceConstructor from 'replace-constructor';

import { Angular2Apollo } from './Angular2Apollo';

export type CommonInput = {
  name?: string;
  options?: (options: any) => Object;
}

export type QueryInput = {
  query: Document;
}

export type MutationInput = {
  mutation: Document;
}

export type GraphqlInput = (QueryInput | MutationInput) & CommonInput;



/**
 * ```ts
 * @Component({ selector: 'app', template: 'Hello' })
 * @graphql([{ query: gql``, name: 'users' }])
 * class AppComponent {
 *   users: ApolloQueryObservable<any>;
 * }
 * ```
 */
export function graphql(
  input: GraphqlInput[]
): (target: any) => any {

  return (target: any) => {

    // get current parameters
    const injects = Reflect.getMetadata('design:paramtypes', target);

    // replace a constructor to get the access to Angular2Apollo service
    const wrapped = replaceConstructor(target, function(apollo: Angular2Apollo, ...injs) {
      Object.defineProperty(this, '__apollo', {
        value: apollo,
        enumerable: true,
        configurable: true,
      });

      // call the old constructor
      target.apply(this, injs);
    });

    // define new parameters by prepending Angular2Apollo
    Reflect.defineMetadata('design:paramtypes', [Angular2Apollo, ...injects], wrapped);

    wrapPrototype(wrapped)('ngOnInit', function() {
      input.forEach(assignInput(this));
    });

    return wrapped;
  };
}




export type ContextWithApollo = {
  __apollo: Angular2Apollo;
}

export function assignInput(context: ContextWithApollo): (input: GraphqlInput) => void {
  return (input: GraphqlInput): void => {
    let value: any;
    let name: string = input.name;

    // check if query
    if (input['query']) {
      value = context.__apollo.watchQuery(inputToOptions(input));

      if (!name) {
        name = getNameOfDocument(input['query']);
      }
    }

    Object.defineProperty(context, name, {
      value,
      enumerable: true,
      configurable: true,
    });
  };
}

export function wrapPrototype(target: any) {
  const oldHooks = {};

  return (name: string, func: Function) => {
    oldHooks[name] = target.prototype[name];
    // create a wrapper
    target.prototype[name] = function(...args) {
      // to call a new prototype method
      func.apply(this, args);

      // call the old prototype method
      if (oldHooks[name]) {
        oldHooks[name].apply(this, args);
      }
    };
  };
}

export function inputToOptions(input: GraphqlInput): Object {
  if (input['query']) {
    // for now it's just a query without any options
    return {
      query: input['query'],
    };
  }
}

export function getNameOfDocument(doc: Document): string {
  return doc.definitions[0]['name'].value;
}

