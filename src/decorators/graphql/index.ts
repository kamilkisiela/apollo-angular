import { Angular2Apollo } from '../../Angular2Apollo';
import { parseArguments } from './arguments';
import { Definition } from './definitions';
import { Options } from './interfaces';
import { GraphQLMetadataFactory, getGraphQLMetadata } from './metadata';
import { replaceConstructor } from './utils';
import { defineProperties as definePropertiesFromSelect } from '../select';
import { getSelectedProps } from '../select/metadata';

import cloneDeep = require('lodash.clonedeep');
import assign = require('lodash.assign');

export function graphql(...args) {
  // 

  return (target: any) => {
    const definitions = parseArguments(...args);
    const params = Reflect.getMetadata('design:paramtypes', target);

    // set definitions
    GraphQLMetadataFactory(definitions)(target);

    // wrap constructor
    const wrapped = replaceConstructor(target, function(apollo, ...injects) {
      const selected = getSelectedProps(this);

      if (Object.keys(selected).length > 0) {
        definePropertiesFromSelect(apollo)(this);
      } else {
        defineProperties(apollo)(this);
      }

      target.apply(this, injects);
    });

    // set metadata with the list of new params
    Reflect.defineMetadata('design:paramtypes', [Angular2Apollo, ...params], wrapped);

    return wrapped;
  };
}

export function defineProperties(apollo: Angular2Apollo) {
  return (target) => {
    const metadata = getGraphQLMetadata(target);

    if (!metadata) {
      return;
    }

    const definitions = metadata.definitions;

    definitions.forEach((def, prop) => {
      Object.defineProperty(target, prop, {
          value: createValue(def, apollo),
          writable: true,
          enumerable: true,
          configurable: true,
        });
    });
  };
}

function createValue(
  definition: Definition,
  apollo: Angular2Apollo
): any {
  const options: Options = assign({}, cloneDeep(definition.options));

  if (definition.operation === 'query') {
    // QUERY
    options.query = definition.doc;

    return apollo.watchQuery(options);
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
