import './_common';

import {
  NgModule,
  Component,
  destroyPlatform,
  getPlatform,
  Inject,
  ApplicationRef,
  CompilerFactory,
  OnInit,
} from '@angular/core';
import {
  ServerModule,
  renderModule,
  renderModuleFactory,
  INITIAL_CONFIG,
  PlatformState,
  platformDynamicServer,
} from '@angular/platform-server';
import { async, TestBed, getTestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import {
  ServerTestingModule,
  platformServerTesting,
} from '@angular/platform-server/testing';
import { BrowserModule, ɵgetDOM } from '@angular/platform-browser';
import { ApolloClient } from 'apollo-client';
import { filter } from 'rxjs/operator/filter';
import { first } from 'rxjs/operator/first';
import { toPromise } from 'rxjs/operator/toPromise';

import gql from 'graphql-tag';

import 'rxjs/add/operator/take';

import { ApolloModule, Apollo, APOLLO_PROVIDERS, provideClientMap } from '../src';
import { mockClient, mockClientWithSub } from './_mocks';
import { subscribeAndCount } from './_utils';

describe('integration', () => {
  beforeEach(() => {
    if (getPlatform()) {
      destroyPlatform();
    }
  });

  describe('render', () => {
    let doc: string;
    let called: boolean;

    // Mock GraphQL endpoint
    const query = gql`
      query websiteInfo {
        website {
          status
        }
      }
    `;
    const data = {
      website: {
        status: 'online',
      },
    };
    const client = mockClient({
      request: { query },
      result: { data },
      delay: 500,
    });
    function provideClient(): ApolloClient {
      return client;
    }

    @Component({
      selector: 'app',
      template: 'Website: {{text}}',
    })
    class AsyncServerApp {
      public text = '';

      constructor(@Inject(Apollo) private apollo: Apollo) {}

      public ngOnInit() {
        this.apollo.query<any>({ query })
          .take(1)
          .subscribe(result => {
            this.text = result.data.website.status;
          });
      }
    }

    @NgModule({
      declarations: [AsyncServerApp],
      imports: [
        BrowserModule.withServerTransition({ appId: 'async-server' }),
        ServerModule,
        ApolloModule.withClient(provideClient),
      ],
      bootstrap: [AsyncServerApp],
    })
    class AsyncServerModule {
    }

    beforeEach(() => {
      doc = '<html><head></head><body><app></app></body></html>';
      called = false;
    });

    afterEach(() => {
      expect(called).toBe(true);
    });

    // XXX: Skip till we fix SSR
    test.skip('using long form should work', async(() => {
      const platform =
        platformDynamicServer([{
          provide: INITIAL_CONFIG,
          useValue: {
            document: doc,
          },
        }]);

      platform.bootstrapModule(AsyncServerModule)
        .then((moduleRef) => {
          const applicationRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
          return toPromise.call(first.call(
            filter.call(applicationRef.isStable, (isStable: boolean) => isStable)));
        })
        .then(() => {
          const str = platform.injector.get(PlatformState).renderToString();
          expect(clearNgVersion(str)).toMatchSnapshot();
          platform.destroy();
          called = true;
        });
    }));

    // XXX: Skip till we fix SSR
    test.skip('using renderModule should work', async(() => {
      renderModule(AsyncServerModule, { document: doc }).then(output => {
        expect(clearNgVersion(output)).toMatchSnapshot();
        called = true;
      });
    }));

    // XXX: Skip till we fix SSR
    test.skip('using renderModuleFactory should work', async(() => {
      const platform =
      platformDynamicServer([{
        provide: INITIAL_CONFIG,
        useValue: {
          document: doc,
        },
      }]);
      const compilerFactory: CompilerFactory = platform.injector.get(CompilerFactory, null);
      const moduleFactory = compilerFactory
        .createCompiler()
        .compileModuleSync(AsyncServerModule);

      renderModuleFactory(moduleFactory, { document: doc }).then(output => {
        expect(clearNgVersion(output)).toMatchSnapshot();
        called = true;
      });
    }));
  });

  describe('subscriptions', () => {
    test('should update the UI', (done: jest.DoneCallback) => {
      const query = gql`
        query heroes {
          allHeroes {
            id
            name
          }
        }
      `;
      const querySub = gql`
        subscription addedHero {
          addedHero {
            id
            name
          }
        }
      `;

      const data = { allHeroes: [{ id: 1, name: 'Foo' }] };
      const dataSub = { addedHero: { id: 2, name: 'Bar' } };

      const client = mockClientWithSub([{
        request: { query: querySub },
        results: [{ result: dataSub as any }],
        id: 1,
      }], [{
        request: { query },
        result: { data },
      }]);

      @Component({
        selector: 'app-heroes',
        template: '<ul><li *ngFor="let hero of heroes">{{hero.name}}</li></ul>',
      })
      class HeroesComponent implements OnInit {
        public heroes: any[] = [];

        constructor(@Inject(Apollo) private apollo: Apollo) {}

        public ngOnInit() {
          const obs = this.apollo.watchQuery<any>({ query });

          subscribeAndCount<any>(done, obs, (handleCount, result) => {
            this.heroes = result.data.allHeroes;

            if (handleCount === 1) {
              this.pushNewHero();
            } else if (handleCount === 2) {
              setTimeout(() => {
                expect(getHTML()).toMatchSnapshot();
                done();
              }, 200);
            }
          });

          this.apollo.subscribe({ query: querySub }).subscribe(result => {
            obs.updateQuery((prev) => {
              const allHeroes = [...prev.allHeroes, result.addedHero];

              return { ...prev, allHeroes: allHeroes };
            });
          });
        }

        private pushNewHero() {
          client['networkInterface'].fireResult(1);
        }
      }

      getTestBed().initTestEnvironment(
        ServerTestingModule,
        platformServerTesting(),
      );

      getTestBed().configureTestingModule({
        declarations: [HeroesComponent],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          APOLLO_PROVIDERS,
          provideClientMap(() => client),
        ],
      });

      const fixture = TestBed.createComponent(HeroesComponent);

      function getHTML(): string {
        return clearHTML(ɵgetDOM().getInnerHTML(fixture.nativeElement).trim());
      }
    });
  });
});

function clearNgVersion(html: string): string {
  return html.replace(/ng-version=\"[^"]+\"/, '');
}

function clearHTML(html: string): string {
  return html.replace(/\<\!--[^>]+--\>/, '');
}


