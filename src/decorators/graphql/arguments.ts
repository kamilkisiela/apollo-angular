import { Document } from 'graphql';

import { Options } from './interfaces';
import { DefinitionsMap } from './definitions';

import isArray = require('lodash.isarray');

export function parseArguments(...args): DefinitionsMap {
  // [any, any ...]
  if (isArray(args[0])) {
    if (isDocument(args[0][0])) {
      // [Document, Document ...]
      return asMultipleDocuments(args[0]);
    }

    if (isOptions(args[0][0])) {
      // [Options, Options ...]
      return asMultipleOptions(args[0]);
    }
  }

  // Document - as the first argument
  if (isDocument(args[0])) {
    if (isDocument(args[1])) {
      // Document, Document ...
      return asMultipleDocuments(args);
    } else if (args.length === 1 || (args.length === 2 && isOptions(args[1]))) {
      // Document, Options?
      return asSingleDocument(args[0], args[1]);
    }
  }

  // Options - as the first argument
  if (isOptions(args[0])) {
    if (isOptions(args[1])) {
      // Options, Options ...
      return asMultipleOptions(args);
    } else if (args.length === 1) {
      // Options
      return asSingleOptions(args[0]);
    }
  }

  throw new Error('Invalid arguments of graphql decorator');
}

// parsers

function asSingleDocument(doc: Document, options?: Options): DefinitionsMap {
  const definitions: DefinitionsMap = new DefinitionsMap();
  definitions.add(doc, options);

  return definitions;
}

function asMultipleDocuments(docs: Document[]): DefinitionsMap {
  const definitions: DefinitionsMap = new DefinitionsMap();

  docs.forEach(doc => {
    definitions.add(doc);
  });

  return definitions;
}

function asSingleOptions(options: Options): DefinitionsMap {
  const definitions: DefinitionsMap = new DefinitionsMap();

  definitions.add(options);

  return definitions;
}

function asMultipleOptions(options: Options[]): DefinitionsMap {
  const definitions: DefinitionsMap = new DefinitionsMap();

  options.forEach(opts => {
    definitions.add(opts);
  });

  return definitions;
}

function isDocument(doc: any): boolean {
  return !!(doc || {} as Document).kind;
}

function isOptions(options: any): boolean {
  return typeof options !== 'undefined' && !isDocument(options);
}