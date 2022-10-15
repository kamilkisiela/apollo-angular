import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  redirects: () =>
    Object.entries({
      '/docs/2.0/:slug*': '/v2/:slug*', // Redirect /docs/2.0/... to /v2/...
      '/docs/2.0/caching': '/v2/caching/configuration',
      '/docs/2.0/data': '/v2/data/queries',
      '/docs/2.0/local-state': '/v2/local-state/management',
      '/docs/2.0/development-and-testing': '/v2/development-and-testing/using-typescript',
      '/docs/2.0/performance': '/v2/performance/improving-performance',
      '/docs/2.0/recipes': '/v2/recipes/simple-example',
      '/docs/2.0/migration': '/v2/migration',
      '/docs/1.0/:slug*': '/v1/:slug*', // Redirect /docs/1.0/... to /v1/...
      '/docs/1.0/basics': '/v1/basics/setup',
      '/docs/1.0/features': '/v1/features/error-handling',
      '/docs/1.0/guides': '/v1/guides/state-management',
      '/docs/1.0/recipes': '/v1/recipes/simple-example',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
