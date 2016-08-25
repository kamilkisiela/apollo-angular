import { Angular2Apollo } from '../../Angular2Apollo';
import { parseArguments } from './arguments';
import { GraphQLMetadataFactory } from './metadata';
import { replaceConstructor } from './utils';
import { defineProperties } from '../select';

export function graphql(...args) {
  // 

  return (target: any) => {
    const definitions = parseArguments(...args);
    const params = Reflect.getMetadata('design:paramtypes', target);

    // set definitions
    GraphQLMetadataFactory(definitions)(target);

    // wrap constructor
    const wrapped = replaceConstructor(target, function(apollo, ...injects) {
      defineProperties(apollo)(this);

      target.apply(this, injects);
    });

    // set metadata with the list of new params
    Reflect.defineMetadata('design:paramtypes', [Angular2Apollo, ...params], wrapped);

    return wrapped;
  };
}