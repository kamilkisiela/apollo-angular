import gql from 'apollo-client/gql'

import {
  Document,
} from 'graphql';

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
