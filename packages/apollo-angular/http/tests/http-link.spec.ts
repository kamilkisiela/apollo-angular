import { print, stripIgnoredCharacters } from 'graphql';
import { mergeMap } from 'rxjs/operators';
import {
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
  provideHttpClient,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApolloLink, execute, FetchResult, gql, InMemoryCache } from '@apollo/client/core';
import { Apollo } from '../../src';
import { HttpLink } from '../src/http-link';

const noop = () => {
  //
};

describe('HttpLink', () => {
  let httpLink: HttpLink;
  let httpBackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpLink, Apollo],
    });
    httpLink = TestBed.inject(HttpLink);
    httpBackend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  test('should use HttpClient', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };
    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, op).subscribe({
      next: result => expect(result).toEqual({ data }),
      error: () => {
        throw new Error('Should not be here');
      },
    });

    httpBackend.expectOne('graphql').flush({ data });
  });

  test('should handle uri as function', () => {
    const link = httpLink.create({ uri: () => 'custom' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };
    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, op).subscribe({
      next: result => expect(result).toEqual({ data }),
      error: () => {
        throw new Error('Should not be here');
      },
    });

    httpBackend.expectOne('custom').flush({ data });
  });

  test('should use /graphql by default', () => {
    const link = httpLink.create({});
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };
    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, op).subscribe({
      next: result => expect(result).toEqual({ data }),
      error: () => {
        throw new Error('Should not be here');
      },
    });

    httpBackend.expectOne('graphql').flush({ data });
  });

  test('should send it as JSON with right body and headers', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.operationName).toBe(op.operationName);
      expect(req.reportProgress).toBe(false);
      expect(req.responseType).toBe('json');
      expect(req.detectContentTypeHeader()).toBe('application/json');
      return true;
    });
  });

  test('should use POST by default', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.operationName).toBe(op.operationName);
      expect(req.detectContentTypeHeader()).toBe('application/json');
      return true;
    });
  });

  test('should be able to specify any method', () => {
    const link = httpLink.create({
      uri: 'graphql',
      method: 'GET',
      includeExtensions: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: { up: 'dog' },
      extensions: { what: 'what' },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('GET');
      expect(req.params.get('variables')).toBe(JSON.stringify(op.variables));
      expect(req.params.get('extensions')).toBe(JSON.stringify(op.extensions));
      expect(req.params.get('operationName')).toBe(op.operationName);
      return true;
    });
  });

  test('custom operation printer', () => {
    const link = httpLink.create({
      uri: 'graphql',
      method: 'GET',
      includeQuery: true,
      operationPrinter(doc) {
        return stripIgnoredCharacters(print(doc));
      },
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: { up: 'dog' },
      extensions: { what: 'what' },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('GET');
      expect(req.urlWithParams).not.toEqual(
        'graphql?operationName=heroes&variables=%7B%22up%22:%22dog%22%7D&query=query%20heroes%20%7B%0A%20%20heroes%20%7B%0A%20%20%20%20name%0A%20%20%7D%0A%7D%0A',
      );
      expect(req.urlWithParams).toEqual(
        'graphql?operationName=heroes&variables=%7B%22up%22:%22dog%22%7D&query=query%20heroes%7Bheroes%7Bname%7D%7D',
      );
      return true;
    });
  });

  test('should include extensions if allowed', () => {
    const link = httpLink.create({
      uri: 'graphql',
      includeExtensions: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      extensions: {
        fooExt: true,
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.extensions.fooExt).toBe(true);
      return true;
    });
  });

  test('should not include extensions if not allowed', () => {
    const link = httpLink.create({
      uri: 'graphql',
      includeExtensions: false,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      extensions: {
        fooExt: true,
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.extensions).toBeUndefined();
      return true;
    });
  });

  test('should support withCredentials', () => {
    const link = httpLink.create({
      uri: 'graphql',
      withCredentials: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.withCredentials).toBe(true);
      return true;
    });
  });

  test('should support headers from constructor options', () => {
    const link = httpLink.create({
      uri: 'graphql',
      headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('X-Custom-Header')).toBe('foo');
      return true;
    });
  });

  test('should support headers from context', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('X-Custom-Header')).toBe('foo');
      return true;
    });
  });

  test('should use clientAwareness from context in headers', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const clientAwareness = {
      name: 'iOS',
      version: '1.0.0',
    };
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        clientAwareness,
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('apollographql-client-name')).toBe(clientAwareness.name);
      expect(req.headers.get('apollographql-client-version')).toBe(clientAwareness.version);
      return true;
    });
  });

  test('should merge headers from context and constructor options', () => {
    const link = httpLink.create({
      uri: 'graphql',
      headers: new HttpHeaders().set('X-Custom-Foo', 'foo'),
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('X-Custom-Bar', 'bar'),
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('X-Custom-Foo')).toBe('foo');
      expect(req.headers.get('X-Custom-Bar')).toBe('bar');
      return true;
    });
  });

  test('should support dynamic uri based on context.uri', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        uri: 'gql',
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.expectOne('gql');
  });

  test('should prioritize context', () => {
    const link = httpLink.create({
      uri: 'graphql',
      method: 'GET',
      includeExtensions: false,
      includeQuery: true,
      withCredentials: true,
      headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      extensions: {
        foo: 'bar',
      },
      context: {
        uri: 'external-graphql',
        method: 'POST',
        includeExtensions: true,
        includeQuery: false,
        withCredentials: false,
        headers: new HttpHeaders().set('X-Custom-Header', 'bar'),
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.url).toBe('external-graphql');
      expect(req.method).toBe('POST');
      expect(req.withCredentials).toBe(false);
      expect(req.body.extensions).toBeDefined();
      expect(req.body.query).not.toBeDefined();
      expect(req.headers.get('X-Custom-Header')).toBe('bar');
      return true;
    });
  });

  test('allows for not sending the query with the request', () => {
    const middleware = new ApolloLink((op, forward) => {
      op.setContext({
        includeQuery: false,
        includeExtensions: true,
      });

      op.extensions.persistedQuery = { hash: '1234' };

      return forward(op);
    });

    const link = middleware.concat(
      httpLink.create({
        uri: 'graphql',
      }),
    );

    execute(link, {
      query: gql`
        query heroes($first: Int!) {
          heroes(first: $first) {
            name
          }
        }
      `,
      variables: {
        first: 5,
      },
    }).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.query).not.toBeDefined();
      expect(req.body.extensions).toEqual({
        persistedQuery: { hash: '1234' },
      });
      return true;
    });
  });

  test('should set response in context', (done: jest.DoneCallback) => {
    const afterware = new ApolloLink((op, forward) => {
      return forward(op).map(response => {
        const context = op.getContext();

        expect(context.response).toBeDefined();
        done();

        return response;
      });
    });
    const link = afterware.concat(
      httpLink.create({
        uri: 'graphql',
      }),
    );

    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
    }).subscribe(noop);

    httpBackend.expectOne('graphql').flush({ data });
  });

  test('should work with mergeMap', done => {
    const apollo = TestBed.inject(Apollo);

    const op1 = {
      query: gql`
        mutation first {
          foo
        }
      `,
    };
    const data1 = {
      foo: true,
    };
    const op2 = {
      query: gql`
        mutation second {
          bar
        }
      `,
    };
    const data2 = {
      bar: true,
    };

    apollo.create({
      link: httpLink.create({
        uri: 'graphql',
      }),
      cache: new InMemoryCache(),
    });

    const m1 = apollo.mutate({
      mutation: op1.query,
    });

    const m2 = apollo.mutate({
      mutation: op2.query,
    });

    m1.pipe(
      mergeMap(() => {
        setTimeout(() => {
          // Resolve second mutation
          httpBackend
            .expectOne(req => req.body.operationName === 'second')
            .flush({
              data: data2,
            });
        });

        return m2;
      }),
    ).subscribe({
      next(result) {
        expect(result.data).toMatchObject(data2);
        done();
      },
      error(error) {
        done.fail(error);
      },
    });

    // Resolve first mutation
    httpBackend
      .expectOne(req => req.body.operationName === 'first')
      .flush({
        data: data1,
      });
  });

  test('should be able to useGETForQueries', () => {
    const link = httpLink.create({
      uri: 'graphql',
      useGETForQueries: true,
      includeExtensions: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: { up: 'dog' },
      extensions: { what: 'what' },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('GET');
      expect(req.params.get('variables')).toBe(JSON.stringify(op.variables));
      expect(req.params.get('extensions')).toBe(JSON.stringify(op.extensions));
      expect(req.params.get('operationName')).toBe(op.operationName);
      return true;
    });
  });

  test('useGETForQueries should use GET only for queries :)', () => {
    const link = httpLink.create({
      uri: 'graphql',
      useGETForQueries: true,
    });
    const op = {
      query: gql`
        mutation addRandomHero {
          addRandomHero {
            name
          }
        }
      `,
      operationName: 'addRandomHero',
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.operationName).toBe(op.operationName);
      return true;
    });
  });

  test('commas between arguments should not be removed', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        query heroes($first: Int!, $limit: Int!) {
          heroes(first: $first, limit: $limit) {
            name
          }
        }
      `,
      operationName: 'heroes',
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.query).toMatch(',');
      expect(req.body.operationName).toBe(op.operationName);
      return true;
    });
  });

  test('commas between arguments should not be removed in Mutations', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        mutation addRandomHero($name: String!, $level: Int!) {
          addRandomHero(name: $name, level: $level) {
            name
          }
        }
      `,
      operationName: 'addRandomHero',
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.query).toMatch(',');
      expect(req.body.operationName).toBe(op.operationName);
      return true;
    });
  });

  test('should cancel XHR when unsubscribing', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };

    execute(link, op)
      .subscribe({
        next: () => {
          throw new Error('Should not be here');
        },
        error: () => {
          throw new Error('Should not be here');
        },
      })
      .unsubscribe();

    expect(httpBackend.expectOne('graphql').cancelled).toBe(true);
  });
  describe('response types', () => {
    const query = gql`
      query heroes {
        heroes {
          name
        }
      }
    `;

    test('should handle arraybuffer response type', done => {
      const link = httpLink.create({
        uri: 'graphql',
      });

      execute(link, {
        query,
        context: {
          observe: 'body',
          responseType: 'arraybuffer',
        },
      }).subscribe({
        next: result => {
          expect(result).toBeInstanceOf(ArrayBuffer);
          done();
        },
        error: done.fail,
      });

      const req = httpBackend.expectOne('graphql');
      expect(req.request.responseType).toBe('arraybuffer');
      const buffer = new ArrayBuffer(8);
      req.flush(buffer);
    });

    test('should handle different observe options', done => {
      const link = httpLink.create({ uri: 'graphql' });
      const data = { heroes: [{ name: 'Superman' }] };

      let progressReceived = false;
      let responseReceived = false;

      execute(link, {
        query,
        context: {
          observe: 'events',
          reportProgress: true,
        },
      }).subscribe({
        next: (result: FetchResult) => {
          if (result.extensions?.httpEvent) {
            const event = result.extensions.httpEvent;
            if (event.type === HttpEventType.DownloadProgress) {
              expect(event.loaded).toBe(50);
              expect(event.total).toBe(100);
              progressReceived = true;
            }
          } else {
            expect(result.data).toEqual(data);
            responseReceived = true;
          }

          if (progressReceived && responseReceived) {
            done();
          }
        },
        error: done.fail,
      });

      const req = httpBackend.expectOne('graphql');
      expect(req.request.reportProgress).toBe(true);

      // Send progress event
      req.event({
        type: HttpEventType.DownloadProgress,
        loaded: 50,
        total: 100,
      } as HttpEvent<any>);

      // Send final response
      req.flush({ data });
    });

    test('should handle text response type', done => {
      const link = httpLink.create({
        uri: 'graphql',
      });

      execute(link, {
        query,
        context: {
          observe: 'body',
          responseType: 'text',
        },
      }).subscribe({
        next: result => {
          expect(typeof result).toBe('string');
          expect(result).toBe('{"data":{"heroes":[{"name":"Superman"}]}}');
          done();
        },
        error: done.fail,
      });

      const req = httpBackend.expectOne('graphql');
      expect(req.request.responseType).toBe('text');
      req.flush('{"data":{"heroes":[{"name":"Superman"}]}}');
    });

    test('should handle blob response type', done => {
      const link = httpLink.create({
        uri: 'graphql',
      });

      execute(link, {
        query,
        context: {
          responseType: 'blob',
          observe: 'response', // Changed to 'response' to get the full HttpResponse
        },
      }).subscribe({
        next: (response: any) => {
          // We should receive an HttpResponse with a Blob body
          expect(response).toBeInstanceOf(HttpResponse);
          expect(response.body).toBeInstanceOf(Blob);
          done();
        },
        error: done.fail,
      });

      const req = httpBackend.expectOne('graphql');
      expect(req.request.responseType).toBe('blob');

      // Create the response with a proper Blob
      const blob = new Blob(['{"data":{"heroes":[{"name":"Superman"}]}}'], {
        type: 'application/json',
      });

      // Send response as HttpResponse
      req.flush(blob, {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
        statusText: 'OK',
      });
    });

    test('should handle blob response type with body observe', done => {
      const link = httpLink.create({
        uri: 'graphql',
      });

      execute(link, {
        query,
        context: {
          responseType: 'blob',
          observe: 'body',
        },
      }).subscribe({
        next: (result: any) => {
          // When observing body, we should get the Blob directly
          expect(result).toBeInstanceOf(Blob);

          // We can even read the blob to verify its contents
          const reader = new FileReader();
          reader.onload = () => {
            const content = JSON.parse(reader.result as string);
            expect(content.data.heroes[0].name).toBe('Superman');
            done();
          };
          reader.readAsText(result);
        },
        error: done.fail,
      });

      const req = httpBackend.expectOne('graphql');
      expect(req.request.responseType).toBe('blob');

      const blob = new Blob(['{"data":{"heroes":[{"name":"Superman"}]}}'], {
        type: 'application/json',
      });
      req.flush(blob);
    });

    test('should store response in context', done => {
      const link = httpLink.create({ uri: 'graphql' });
      const afterware = new ApolloLink((operation, forward) => {
        return forward(operation).map(result => {
          const context = operation.getContext();
          expect(context.response).toBeDefined();
          if (context.response instanceof HttpResponse) {
            expect(context.response.body).toBeDefined();
          }
          return result;
        });
      });

      const composedLink = afterware.concat(link);
      const data = { heroes: [{ name: 'Superman' }] };

      execute(composedLink, { query }).subscribe({
        next: () => done(),
        error: done.fail,
      });

      httpBackend.expectOne('graphql').flush({ data });
    });

    test('should handle network errors', done => {
      const link = httpLink.create({ uri: 'graphql' });
      const networkError = new ErrorEvent('network error');

      execute(link, { query }).subscribe({
        next: () => done.fail('Should not emit next'),
        error: error => {
          expect(error).toBeDefined();
          done();
        },
      });

      httpBackend.expectOne('graphql').error(networkError);
    });
  });

  describe('HttpLink error handling', () => {
    test('should properly format GraphQL errors', done => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
      };

      execute(link, op).subscribe({
        next: (result: FetchResult) => {
          expect(result.errors).toBeDefined();
          expect(result.errors![0]).toHaveProperty('message');
          expect(result.errors![0]).toHaveProperty('extensions');
          done();
        },
        error: done.fail,
      });

      httpBackend.expectOne('graphql').flush({
        errors: [
          {
            message: 'GraphQL error',
            extensions: { code: 'ERROR_CODE' },
          },
        ],
      });
    });
  });
});
