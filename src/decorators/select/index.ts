import { ApolloQueryResult } from 'apollo-client';

import { Angular2Apollo } from '../../Angular2Apollo';
import { ApolloQueryObservable } from '../../ApolloQueryObservable';
import { getGraphQLMetadata } from '../graphql/metadata';
import { Definition } from '../graphql/definitions';
import { Options } from '../graphql/interfaces';
import { getSelectedProps, GraphQLSelectMetadataFactory } from './metadata';
import { parseArguments } from './arguments';
import { Selector } from './selector';
import { pathToValue } from './utils';

import cloneDeep = require('lodash.clonedeep');
import assign = require('lodash.assign');

import 'rxjs/add/operator/map';

export function defineProperties(apollo: Angular2Apollo) {
  return (target) => {
    const props = getSelectedProps(target);
    const metadata = getGraphQLMetadata(target);

    if (!metadata) {
      return;
    }

    const definitions = metadata.definitions;

    for (const prop in props) {
      if (props.hasOwnProperty(prop)) {
        const selector: Selector = props[prop].selector;
        const definition = definitions.get(selector.docName);

        if (!definition) {
          throw new Error('Definition is missing');
        }

        const options: Options = assign(
          {},
          cloneDeep(definition.options),  // options from the graphql decorator
          cloneDeep(selector.options)     // options from the select decorator
        );

        Object.defineProperty(target, prop, {
          value: createValue(options, definition, selector, apollo),
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }
  };
}

export function select(...args) {
  return (target, name: string) => {
    const selector: Selector = parseArguments(...args);

    if (!selector.docName) {
      selector.docName = name;
    }

    GraphQLSelectMetadataFactory(selector)(target, name);
  };
}

function createValue(
  options: Options, 
  definition: Definition,
  selector: Selector,
  apollo: Angular2Apollo
) {
  if (definition.operation === 'query') {
    // QUERY
    options.query = definition.doc;
    const watch = apollo.watchQuery(options);
      
    if (selector.mapTo) {
      return (watch as any).map(result => pathToValue(result.data, selector.mapTo));
    }

    return watch;
  } else {
    // MUTATION
    options.mutation = definition.doc;
  
    return (customOptions: Options) => {
      if (customOptions) {
        delete customOptions.mutation;
        return apollo.mutate(assign(options, cloneDeep(customOptions)));
      }

      return apollo.mutate(options);
    };
  } 
}