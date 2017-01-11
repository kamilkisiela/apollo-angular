import { NetworkInterface, BatchedNetworkInterface, Request } from 'apollo-client/lib/src/transport/networkInterface';
import { ApolloClient } from 'apollo-client';
import { ExecutionResult, DocumentNode } from 'graphql';
import { print } from 'graphql-tag/printer';

export function mockNetworkInterface(
  ...mockedResponses: MockedResponse[],
): NetworkInterface {
  return new MockNetworkInterface(...mockedResponses);
}

export function mockBatchedNetworkInterface(
    ...mockedResponses: MockedResponse[],
): BatchedNetworkInterface {
  return new MockBatchedNetworkInterface(...mockedResponses);
}

export interface ParsedRequest {
  variables?: Object;
  query?: DocumentNode;
  debugName?: string;
}

export interface MockedResponse {
  request: ParsedRequest;
  result?: ExecutionResult;
  error?: Error;
  delay?: number;
}

export class MockNetworkInterface implements NetworkInterface {
  private mockedResponsesByKey: { [key: string]: MockedResponse[] } = {};

  constructor(...mockedResponses: MockedResponse[]) {
    mockedResponses.forEach((mockedResponse) => {
      this.addMockedReponse(mockedResponse);
    });
  }

  public addMockedReponse(mockedResponse: MockedResponse) {
    const key = requestToKey(mockedResponse.request);
    let mockedResponses = this.mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this.mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(mockedResponse);
  }

  public query(request: Request) {
    return new Promise((resolve, reject) => {
      const parsedRequest: ParsedRequest = {
        query: request.query,
        variables: request.variables,
        debugName: request.debugName,
      };

      const key = requestToKey(parsedRequest);
      const responses = this.mockedResponsesByKey[key];
      if (!responses || responses.length === 0) {
        throw new Error(`No more mocked responses for the query: ${print(request.query)}, variables: ${JSON.stringify(request.variables)}`);
      }

      const { result, error, delay } = responses.shift();

      if (!result && !error) {
        throw new Error(`Mocked response should contain either result or error: ${key}`);
      }

      setTimeout(() => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }, delay ? delay : 0);
    });
  }
}
export class MockBatchedNetworkInterface
extends MockNetworkInterface implements BatchedNetworkInterface {
  public batchQuery(requests: Request[]): Promise<ExecutionResult[]> {
    const resultPromises: Promise<ExecutionResult>[] = [];
    requests.forEach((request) => {
      resultPromises.push(this.query(request));
    });
    return Promise.all(resultPromises);
  }
}
function requestToKey(request: ParsedRequest): string {
  const queryString = request.query && print(request.query);
  return JSON.stringify({
    variables: request.variables,
    debugName: request.debugName,
    query: queryString,
  });
}

export function mockClient(...args): ApolloClient {
  const networkInterface = mockNetworkInterface(...args);

  return new ApolloClient({
    networkInterface,
    addTypename: false,
  });
}
