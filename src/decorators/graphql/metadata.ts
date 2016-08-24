import { makeDecorator } from '@angular/core/src/util/decorators';

import { DefinitionsMap } from './definitions';

class GraphQLMetadata {
  constructor(
    public definitions: DefinitionsMap
  ) {}
}

export const GraphQLMetadataFactory = makeDecorator(GraphQLMetadata);