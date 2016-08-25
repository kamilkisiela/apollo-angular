import { makePropDecorator } from '@angular/core/src/util/decorators';

import { Selector } from './selector';

export class GraphQLSelectMetadata {
  constructor(
    public selector: Selector
  ) {}
}

export const GraphQLSelectMetadataFactory: (s: Selector) => any = makePropDecorator(GraphQLSelectMetadata);

export interface PropsSelectMetadata {
  [propName: string]: GraphQLSelectMetadata;
}

export function getSelectedProps(target): PropsSelectMetadata | Object {
  const propMetadata = Reflect.getMetadata('propMetadata', target.constructor) || [];
  const filtered: PropsSelectMetadata = {};

  for (const propName in propMetadata) {
    if (propMetadata.hasOwnProperty(propName)) {
      const metadata = propMetadata[propName]
        .filter(m => m instanceof GraphQLSelectMetadata);

      if (metadata.length > 0) {
        filtered[propName] = metadata[0];
      }
    }
  }


  return filtered;
}
