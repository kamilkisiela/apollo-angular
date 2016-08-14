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

  public refetch(variables?: any): Promise<ApolloQueryResult> {
    return this.apollo.refetch(variables);
  }

  public stopPolling(): void {
    return this.apollo.stopPolling();
  }

  public startPolling(p: number): void {
    return this.apollo.startPolling(p);
  }

  public fetchMore(options: any): Promise<any> {
    return this.apollo.fetchMore(options);
  }
}
