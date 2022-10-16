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

      '/docs/1.0/basics/:slug*': '/v1/basics/:slug*',
      '/docs/1.0/features/:slug*': '/v1/features/:slug*',
      '/docs/1.0/guides/:slug*': '/v1/guides/:slug*',
      '/docs/1.0/recipes/:slug*': '/v1/recipes/:slug*',

      '/docs/2.0/caching/:slug*': '/v2/caching/:slug*',
      '/docs/2.0/data/:slug*': '/v2/data/:slug*',
      '/docs/2.0/local-state/:slug*': '/v2/local-state/:slug*',
      '/docs/2.0/development-and-testing/:slug*': '/v2/development-and-testing/:slug*',
      '/docs/2.0/performance/:slug*': '/v2/performance/:slug*',
      '/docs/2.0/recipes/:slug*': '/v2/recipes/:slug*',
      '/docs/2.0/migration/:slug*': '/v2/migration/:slug*',

      '/v1/guides': '/v1/guides/state-management',
      '/v1/features': '/v1/features/error-handling',
      '/v1/basics': '/v1/guides/state-management',
      '/v1/recipes': '/v1/recipes/simple-example',
      '/v2/caching': '/v2/caching/configuration',
      '/v2/data': '/v2/data/queries',
      '/v2/local-state': '/v2/local-state/management',
      '/v2/development-and-testing': '/v2/development-and-testing/using-typescript',
      '/v2/performance': '/v2/performance/improving-performance',
      '/v2/recipes': '/v2/recipes/simple-example',
      '/v2/migration': '/v2/migration',
      '/docs/2.0': '/v2', // Redirect direct to path
      '/docs/1.0': '/v1', // Redirect direct to path
      '/docs/basics/:slug*': '/docs/data/:slug*',
      '/docs/1.0/features/cache-updates': '/v1/features/caching',
      '/docs/data': '/docs/data/queries',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
