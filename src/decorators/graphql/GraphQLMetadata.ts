import { makeDecorator } from '@angular/core/src/util/decorators';

import { Definition } from './interfaces';

class GraphQLMetadata {
  constructor(
    public definitions: Map<string, Definition>
  ) {}
}

export const GraphQLMetadataFactory = makeDecorator(GraphQLMetadata);