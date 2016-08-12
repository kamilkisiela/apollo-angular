import {
  ObservableQuery,
} from 'apollo-client/ObservableQuery';

import {
  ApolloQueryResult,
} from 'apollo-client';

export interface IObservableQuery {
  refetch: (variables?: any) => Promise<ApolloQueryResult>;
  fetchMore: (options: any) => Promise<any>;
  stopPolling: () => void;
  startPolling: (p: number) => void;
}

export class ObservableQueryRef implements IObservableQuery {
  public apollo: ObservableQuery;

  public refetch(variables) {
    return this.apollo.refetch(variables);
  }

  public stopPolling() {
    return this.apollo.stopPolling();
  }

  public startPolling(p) {
    return this.apollo.startPolling(p);
  }

  public fetchMore(options) {
    return this.apollo.fetchMore(options);
  }
}
