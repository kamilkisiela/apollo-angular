import { ApolloQueryResult } from 'apollo-client';

import { Angular2Apollo } from '../../Angular2Apollo';
import { ApolloQueryObservable } from '../../ApolloQueryObservable';
import { getGraphQLMetadata } from '../graphql/metadata';
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
        const def = definitions.get(selector.docName);
        let propValue: ApolloQueryObservable<ApolloQueryResult> | ((options: Options) => Promise<ApolloQueryResult>);

        if (!def) {
          throw new Error('Definition is missing');
        }

        const mergedOptions: Options = assign(
          {},
          cloneDeep(def.options),
          cloneDeep(selector.options)
        );

        if (def.operation === 'query') {
          // QUERY
          mergedOptions.query = def.doc;
          propValue = apollo.watchQuery(mergedOptions);

          if (selector.mapTo) {
            propValue = (propValue as any).map(result => pathToValue(result.data, selector.mapTo));
          }
        } else {
          // MUTATION
          mergedOptions.mutation = def.doc;
          propValue = (opts: Options) => {
            let options = cloneDeep(mergedOptions);

            if (opts) {
              delete opts.mutation;
              options = assign(options, opts);
            }

            return apollo.mutate(options);
          };
        }

        Object.defineProperty(target, prop, {
          value: propValue,
          writable: true, // important
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
