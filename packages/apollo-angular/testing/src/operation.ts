import { ExecutionResult, GraphQLError } from 'graphql';
import { Observer } from 'rxjs';
import { ApolloError, FetchResult, Operation as LinkOperation } from '@apollo/client/core';

function isApolloError(error: unknown): error is ApolloError {
  return !!error && error.hasOwnProperty('graphQLErrors');
}

export type Operation = LinkOperation & {
  clientName: string;
};

export class TestOperation<T = { [key: string]: any }> {
  constructor(
    public readonly operation: Operation,
    private readonly observer: Observer<FetchResult<T>>,
  ) {}

  public flush(result: ExecutionResult<T> | ApolloError): void {
    if (isApolloError(result)) {
      this.observer.error(result);
    } else {
      const fetchResult = result ? { ...result } : result;
      this.observer.next(fetchResult);
      this.observer.complete();
    }
  }

  public flushData(data: T | null): void {
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
