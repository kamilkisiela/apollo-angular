import { Document } from 'graphql';

import { Options } from './interfaces';

import cloneDeep = require('lodash.clonedeep');

export interface Definition {
  operation: string;
  doc: Document;
  options?: Options;
}

export class DefinitionsMap {
  private map: Map<string, Definition> = new Map<string, Definition>();

  public get(name: string): Definition {
    return this.map.get(name);
  }

  public default(): Definition {
    if (this.map.size === 1) {
      return Array.from(this.map.values())[0];
    }

    return;
  }

  public add(doc: Document | Options, options?: Options): void {
    if ((doc as Document).kind) {
      return this.addDocument(doc as Document, options);
    }

    if ((doc as Options).query || (doc as Options).mutation) {
      return this.addOptions(doc as Options);
    }
  }

  private addDocument(doc: Document, options?: Options): void {
    const name: string = this.getName(doc);
    const def: Definition = {
      doc,
      options: cloneDeep(options),
      operation: this.isQuery(doc) ? 'query' : 'mutation',
    };

    this.map.set(name, def);
  }

  private addOptions(options: Options): void {
    let doc: Document;
    let opts: Options = cloneDeep(options);

    if (options.query) {
      doc = options.query;
      delete opts.query;
    }

    if (options.mutation) {
      doc = options.mutation;
      delete opts.mutation;
    }

    return this.addDocument(doc, Object.keys(opts).length === 0 ? undefined : opts);
  }

  private getName(doc: Document): string {
    return doc.definitions[0]['name'].value;
  }

  private isQuery(doc: Document): boolean {
    return doc.definitions[0]['operation'] === 'query';
  }
}
