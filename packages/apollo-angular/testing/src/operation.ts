import {
  ApolloError,
  Operation as LinkOperation,
  FetchResult,
} from '@apollo/client/core';
import {GraphQLError, ExecutionResult} from 'graphql';
import {Observer} from 'rxjs';

const isApolloError = (err: any): err is ApolloError =>
  err && err.hasOwnProperty('graphQLErrors');

export type Operation = LinkOperation & {
  clientName: string;
};

export class TestOperation<T = {[key: string]: any}> {
  constructor(
    public operation: Operation,
    private observer: Observer<FetchResult<T>>,
  ) {}

  public flush(result: ExecutionResult | ApolloError): void {
    if (isApolloError(result)) {
      this.observer.error(result);
    } else {
      const fetchResult = result ? {...result} : result;
      this.observer.next(fetchResult as any);
      this.observer.complete();
    }
  }

  public flushData(data: {[key: string]: any} | null): void {
    this.flush({
      data,
    });
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
