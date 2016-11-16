import {Document, FragmentDefinition} from 'graphql';
import {Angular2Apollo} from './Angular2Apollo';
import {MutationOptions, MutationBehavior, MutationQueryReducersMap} from 'apollo-client';
import * as replaceConstructor from 'replace-constructor';
import * as _ from 'lodash';

export type CommonInput = {
  name?: string;
} & OptionsObject

export type OptionsMethod = (options: any) => Object;

export type WithVariables = {
  variables?: any;
}

export type OptionsObject = WithVariables & {
  fragments?: any[];
}

export type QueryInput = {
  query: Document;
  options?: OptionsMethod | (OptionsObject & WithVariables);
}

export type MutationInput = MutationOptions;

export type MutationExecutionInput = {
  variables?: Object;
  resultBehaviors?: MutationBehavior[];
  fragments?: FragmentDefinition[];
  optimisticResponse?: Object;
  updateQueries?: MutationQueryReducersMap;
  refetchQueries?: string[];
};

export type SubscriptionInput = {
  subscription: Document;
}

export type GraphqlInput = (QueryInput | MutationInput | SubscriptionInput) & CommonInput;

export type ContextWithApollo = {
  __apollo: Angular2Apollo;
}

function isQueryInput(input: any): input is QueryInput {
  return (input as QueryInput).query !== undefined;
}

function isMutationInput(input: any): input is MutationInput {
  return (input as MutationInput).mutation !== undefined;
}

function isSubscriptionInput(input: any): input is SubscriptionInput {
  return (input as SubscriptionInput).subscription !== undefined;
}

/**
 * ```ts
 * @Component({ selector: 'app', template: 'Hello' })
 * @graphql([{ query: gql``, name: 'users' }])
 * class AppComponent {
 *   users: ApolloQueryObservable<any>;
 * }
 * ```
 */
export function graphql(input: GraphqlInput[]): (target: any) => any {
  return (target: any) => {
    // get current parameters
    const injects = Reflect.getMetadata('design:paramtypes', target);

    // replace a constructor to get the access to Angular2Apollo service
    const wrapped = replaceConstructor(target, function (apollo: Angular2Apollo, ...injs) {
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

    wrapPrototype(wrapped)('ngOnInit', function () {
      input.forEach(assignInput(this));
    });

    return wrapped;
  };
}

export function assignInput(context: ContextWithApollo): (input: GraphqlInput) => void {
  return (input: GraphqlInput): void => {
    let value: any;
    let name: string = input.name;
    let nameDocument: any;

    let inputOptions = inputToOptions(input, context);

    if (isQueryInput(input)) {
      value = context.__apollo.watchQuery(inputOptions);
      nameDocument = input.query;
    } else if (isMutationInput(input)) {
      value = (mutationArguments: MutationExecutionInput = {}) => {
        return context.__apollo.mutate(Object.assign(mutationArguments, inputOptions));
      };

      nameDocument = input.mutation;
    } else if (isSubscriptionInput(input)) {
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
    target.prototype[name] = function (...args) {
      // to call a new prototype method
      func.apply(this, args);

      // call the old prototype method
      if (oldHooks[name]) {
        oldHooks[name].apply(this, args);
      }
    };
  };
}

const buildCommonOptions = (input: CommonInput, context: ContextWithApollo) => {
  let result: any = {};

  if (input.fragments) {
    result.fragments = input.fragments;
  }

  if (isQueryInput(input) && input.options) {
    let options: any;

    if (_.isFunction(input.options)) {
      options = input.options(context);
    } else if (_.isObject(input.options)) {
      options = input.options;
    }

    result = Object.assign(result, options);
  }

  return result;
};

export function inputToOptions(input: GraphqlInput, context: ContextWithApollo): any {
  let common = buildCommonOptions(input, context);

  return Object.assign({}, common, _.omit(input, 'name', 'options'));
}

export function getNameOfDocument(doc: Document): string {
  return doc.definitions[0]['name'].value;
}
