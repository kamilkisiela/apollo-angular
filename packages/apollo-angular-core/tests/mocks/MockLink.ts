import {
  ApolloLink,
  Operation,
  Observable,
  RequestHandler,
  NextLink,
} from 'apollo-link';
import {ExecutionResult, DocumentNode, print} from 'graphql';

export interface ParsedRequest {
  variables?: Object;
  query?: DocumentNode;
  operationName?: string;
}

export interface MockedResponse {
  request: ParsedRequest;
  result?: ExecutionResult;
  error?: Error;
  delay?: number;
}

export class MockLink extends ApolloLink {
  public requester: RequestHandler;

  private mockedResponsesByKey: Record<string, MockedResponse[]> = {};

  constructor(mockedResponses: MockedResponse[]) {
    super();

    mockedResponses.forEach(mockedResponse => {
      this.addMockedResponse(mockedResponse);
    });

    this.requester = new ApolloLink(
      operation =>
        new Observable(observer => {
          const {result, error, delay} = this.getResponse(operation);

          setTimeout(() => {
            if (error) {
              observer.error(error);
            } else {
              observer.next(result);
              observer.complete();
            }
          }, delay ? delay : 0);

          return () => {};
        })
    ).request;
  }

  public addMockedResponse(mockedResponse: MockedResponse) {
    const key = requestToKey(mockedResponse.request);
    let mockedResponses = this.mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this.mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(mockedResponse);
  }

  public request(op: Operation): Observable<ExecutionResult> | null {
    return this.requester(op);
  }

  private getResponse(request: any): MockedResponse {
    const parsedRequest: ParsedRequest = {
      query: request.query,
      variables: request.variables,
      operationName: request.operationName,
    };

    const key = requestToKey(parsedRequest);
    const responses = this.mockedResponsesByKey[key];
    if (!responses || responses.length === 0) {
      throw new Error(
        `No more mocked responses for the query: ${print(
          request.query
        )}, variables: ${JSON.stringify(request.variables)}`
      );
    }

    const {result, error, delay} = responses.shift()!;

    if (!result && !error) {
      throw new Error(
        `Mocked response should contain either result or error: ${key}`
      );
    }

    return {
      request: parsedRequest,
      result,
      error,
      delay,
    };
  }
}

function requestToKey(request: ParsedRequest): string {
  const queryString = request.query && print(request.query);

  return JSON.stringify({
    variables: request.variables || {},
    operationName: request.operationName,
    query: queryString,
  });
}
