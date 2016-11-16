import { Document } from 'graphql';
import * as replaceConstructor from 'replace-constructor';
import { Angular2Apollo } from './Angular2Apollo';
import * as _ from 'lodash';
import {DeprecatedWatchQueryOptions} from 'apollo-client/core/watchQueryOptions';

export type CommonInput = {
  name?: string;
  fragments?: any;
}

export type QueryInput = {
  query: Document;
  options?: (options: any) => Object;
}

export type MutationInput = {
  mutation: Document;
}

export type SubscriptionInput = {
  subscription: Document;
}

export type GraphqlInput = (QueryInput | MutationInput | SubscriptionInput) & CommonInput;

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

function isQueryInput(input: any): input is QueryInput {
  return (<QueryInput>input).query !== undefined;
}

function isMutationInput(input: any): input is MutationInput {
  return (<MutationInput>input).mutation !== undefined;
}

function isSubscriptionInput(input: any): input is SubscriptionInput {
  return (<SubscriptionInput>input).subscription !== undefined;
}

export function assignInput(context: ContextWithApollo): (input: GraphqlInput) => void {
  return (input: GraphqlInput): void => {
    let value: any;
    let name: string = input.name;
    let nameDocument: any;

    if (isQueryInput(input)) {
      value = context.__apollo.watchQuery(inputToOptions(input, context));
      nameDocument = input.query;
    } else if (isMutationInput(input)) {
      value = ({ variables, optimisticResponse, updateQueries }) => {
        return context.__apollo.mutate({
          mutation: input.mutation,
          variables: variables,
          optimisticResponse: optimisticResponse,
          updateQueries: updateQueries,
        });
      };

      nameDocument = input.mutation;
    }  else if (isSubscriptionInput(input)) {
      nameDocument = input.subscription;
    }

    if (!name || name === '') {
      name = getNameOfDocument(nameDocument);
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

export function inputToOptions(input: GraphqlInput, context: ContextWithApollo): DeprecatedWatchQueryOptions {
  let result: any = {};

  if (input.fragments) {
    result.fragments = input.fragments;
  }

  if (isQueryInput(input) && input.query) {
    // for now it's just a query without any options
    result.query = input['query'];
  }

  if (isQueryInput(input) && input.options) {
    let options: any;

    if (_.isFunction(input.options)) {
      options = input.options(context);
    } else if (_.isObject(input['options'])) {
      options = input.options;
    }

    result = Object.assign(result, options);
  }

  return result;
}

export function getNameOfDocument(doc: Document): string {
  return doc.definitions[0]['name'].value;
}
