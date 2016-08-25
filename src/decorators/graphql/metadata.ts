import { makeDecorator } from '@angular/core/src/util/decorators';

import { DefinitionsMap } from './definitions';

export class GraphQLMetadata {
  constructor(
    public definitions: DefinitionsMap
  ) {}
}

export const GraphQLMetadataFactory: (d: DefinitionsMap) => any = makeDecorator(GraphQLMetadata);

export function getGraphQLMetadata(target): GraphQLMetadata {
  const annotations = Reflect.getMetadata('annotations', target.constructor) || [];
  return annotations.filter(an => an instanceof GraphQLMetadata)[0];
}
