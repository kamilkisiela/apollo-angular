import { Document } from 'graphql';

import gql from 'graphql-tag';

export class Lifecycle {
  public ngOnInit() {};
  public ngDoCheck() {};
  public ngOnDestroy() {};
}

export const exampleQuery: Document = gql`
  query Examples {
    allExamples {
      name
    }
  }
`;
