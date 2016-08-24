import { Pipe } from '@angular/core';

import { ApolloQueryPipe } from './ApolloQueryPipe';

@Pipe({
  name: 'select',
})
export class SelectPipe extends ApolloQueryPipe {}
