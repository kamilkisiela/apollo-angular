import {ApolloError} from 'apollo-client';
import {Operation as LinkOperation, FetchResult} from 'apollo-link';
import {GraphQLError, ExecutionResult} from 'graphql';
import {ExecutionResultDataDefault} from 'graphql/execution/execute';
import {Observer} from 'rxjs';

const isApolloError = (err: any): err is ApolloError =>
  err && err.hasOwnProperty('graphQLErrors');

export type Operation = LinkOperation & {
  clientName: string;
};

export class TestOperation {
  constructor(
    public operation: Operation,
    private observer: Observer<FetchResult>,
  ) {}

  public flush(result: ExecutionResult | ApolloError): void {
    if (isApolloError(result)) {
      this.observer.error(result);
    } else {
      this.observer.next(result as FetchResult);
      this.observer.complete();
    }
  }

  public flushData(data: ExecutionResultDataDefault | null): void {
    this.flush({
      data,
    })
  }

  public networkError(error: Error): void {
    const apolloError = new ApolloError({
      networkError: error,
    });

    this.flush(apolloError);
  }

  public graphqlErrors(errors: GraphQLError[]): void {
    this.flush({
      errors,
    });
  }
}
