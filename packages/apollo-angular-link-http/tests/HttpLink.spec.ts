import {setupAngular} from './_setup';

import gql from 'graphql-tag';

import {TestBed, inject, async} from '@angular/core/testing';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {execute, ApolloLink} from 'apollo-link';

import {HttpLink} from '../src/HttpLink';

const noop = () => {
  //
};

describe('HttpLink', () => {
  beforeAll(() => setupAngular());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [HttpLink],
    });
  });

  afterEach(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      backend.verify();
    }),
  );

  test(
    'should use HttpClient',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
          const link = httpLink.create({uri: 'graphql'});
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
            heroes: [{name: 'Superman'}],
          };

          execute(link, op).subscribe({
            next: (result: any) => expect(result).toEqual({data}),
            error: () => {
              throw new Error('Should not be here');
            },
          });

          httpBackend.expectOne('graphql').flush({data});
        },
      ),
    ),
  );

  test(
    'should send it as JSON with right body and headers',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
          const link = httpLink.create({uri: 'graphql'});
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
        },
      ),
    ),
  );

  test(
    'should use POST by default',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
          const link = httpLink.create({uri: 'graphql'});
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
        },
      ),
    ),
  );

  test(
    'should be able to specify any method',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
            variables: {up: 'dog'},
            extensions: {what: 'what'},
          };

          execute(link, op).subscribe(noop);

          httpBackend.match(req => {
            expect(req.method).toBe('GET');
            expect(req.params.get('variables')).toBe(
              JSON.stringify(op.variables),
            );
            expect(req.params.get('extensions')).toBe(
              JSON.stringify(op.extensions),
            );
            expect(req.params.get('operationName')).toBe(op.operationName);
            return true;
          });
        },
      ),
    ),
  );

  test(
    'should include extensions if allowed',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should not include extensions if not allowed',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should support withCredentials',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should support headers from contructor options',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should support headers from context',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should merge headers from context and contructor options',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should support dynamic uri based on context.uri',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'should prioritize context',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
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
        },
      ),
    ),
  );

  test(
    'allows for not sending the query with the request',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
          const middleware = new ApolloLink((op, forward) => {
            op.setContext({
              includeQuery: false,
              includeExtensions: true,
            });

            op.extensions.persistedQuery = {hash: '1234'};

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
              persistedQuery: {hash: '1234'},
            });
            return true;
          });
        },
      ),
    ),
  );
});
