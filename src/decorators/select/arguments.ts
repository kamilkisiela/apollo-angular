import { Selector } from './selector';
import { isObject } from './utils';

import isArray = require('lodash.isarray');

export function parseArguments(...args): Selector {
  const selector = new Selector();

  args.forEach(arg => {
    if (typeof arg === 'string') {
      // docName
      throwIfDefined(selector, 'docName', 'query');
      selector.docName = arg;
    } else if (isArray(arg)) {
      // mapTo
      throwIfDefined(selector, 'mapTo');
      selector.mapTo = arg;
    } else if (isObject(arg)) {
      // options
      throwIfDefined(selector, 'options');

      if (typeof arg.query !== 'undefined') {
        throw new Error('query defined in options');
      }
      if (typeof arg.mutation !== 'undefined') {
        throw new Error('mutation defined in options');
      }

      selector.options = arg;
    } else {
      throw new Error('Invalid arguments of select decorator');
    }
  });

  return selector;
}

function throwIfDefined(selector: Selector, propName: string, displayName?: string): void {
  if (selector[propName]) {
    throw new Error(`${displayName || propName} name already defined`);
  }
}
