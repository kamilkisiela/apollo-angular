import { filter, first } from 'rxjs/operators';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ApplicationRef,
  Component,
  destroyPlatform,
  getPlatform,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  INITIAL_CONFIG,
  PlatformState,
  renderModule,
  platformServer,
  ServerModule,
} from '@angular/platform-server';
import { execute, gql } from '@apollo/client/core';
import { HttpLink } from '../src/http-link';

describe.skip('integration', () => {
  let doc: string;

  beforeEach(() => {
    if (getPlatform()) {
      destroyPlatform();
    }
    doc = '<html><head></head><body><app></app></body></html>';
  });

  describe('render', () => {
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

    @Component({
      selector: 'app',
      template: 'Website: {{text}}',
    })
    class AsyncServerApp {
      public text = 'online';

      constructor(private httpLink: HttpLink, private httpBackend: HttpTestingController) {}

      public ngOnInit() {
        execute(this.httpLink.create({ uri: 'graphql', method: 'GET' }), {
          query,
        }).subscribe((result: any) => {
          this.text = result.data.website.status;
        });

        this.httpBackend
          .match(
            req => req.url === 'graphql' && req.params.get('operationName') === 'websiteInfo',
          )[0]
          .flush({ data });
      }
    }

    @NgModule({
      declarations: [AsyncServerApp],
      imports: [
        BrowserModule.withServerTransition({ appId: 'async-server' }),
        ServerModule,
        HttpClientTestingModule,
      ],
      providers: [HttpLink],
      bootstrap: [AsyncServerApp],
    })
    class AsyncServerModule {}

    test('using long form should work', async () => {
      const platform = platformServer([
        {
          provide: INITIAL_CONFIG,
          useValue: {
            document: doc,
          },
        },
      ]);
      const moduleRef = await platform.bootstrapModule(AsyncServerModule);
      const applicationRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
      await applicationRef.isStable
        .pipe(
          filter((isStable: boolean) => isStable),
          first(),
        )
        .toPromise();
      const str = platform.injector.get(PlatformState).renderToString();

      expect(clearNgVersion(str)).toMatchSnapshot();
      platform.destroy();
    });

    test('using renderModule should work', async () => {
      const output = await renderModule(AsyncServerModule, { document: doc });
      expect(clearNgVersion(output)).toMatchSnapshot();
    });
  });
});

function clearNgVersion(html: string): string {
  return html.replace(/ng-version=\"[^"]+\"/, '');
}
