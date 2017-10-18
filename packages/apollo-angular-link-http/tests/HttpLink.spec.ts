import {setupAngular} from './_setup';

import gql from 'graphql-tag';

import {TestBed, inject, async} from '@angular/core/testing';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {execute} from 'apollo-link';

import {HttpLink} from '../src/HttpLink';

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

          execute(link, op).subscribe(() => {
            //
          });

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

          execute(link, op).subscribe(() => {
            //
          });

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

          execute(link, op).subscribe(() => {
            //
          });

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

          execute(link, op).subscribe(() => {
            //
          });

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

          execute(link, op).subscribe(() => {
            //
          });

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

          execute(link, op).subscribe(() => {
            //
          });

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

          execute(link, op).subscribe(() => {
            //
          });

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
    'should prioritize context',
    async(
      inject(
        [HttpLink, HttpTestingController],
        (httpLink: HttpLink, httpBackend: HttpTestingController) => {
          const link = httpLink.create({
            uri: 'graphql',
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
            context: {
              withCredentials: false,
              headers: new HttpHeaders().set('X-Custom-Header', 'bar'),
            },
          };

          execute(link, op).subscribe(() => {
            //
          });

          httpBackend.match(req => {
            expect(req.withCredentials).toBe(false);
            expect(req.headers.get('X-Custom-Header')).toBe('bar');
            return true;
          });
        },
      ),
    ),
  );
});
