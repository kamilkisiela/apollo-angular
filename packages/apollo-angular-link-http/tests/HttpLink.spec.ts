import {setupAngular} from './_setup';

import gql from 'graphql-tag';

import {TestBed, inject, async} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
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
            next: result => expect(result).toEqual({data}),
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
    'should include extensions on demand',
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
});
