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

      '/docs/1.0/basics/:path*': '/v1/basics/:path*',
      '/docs/1.0/features/:path*': '/v1/features/:path*',
      '/docs/1.0/guides/:path*': '/v1/guides/:path*',
      '/docs/1.0/recipes/:path*': '/v1/recipes/:path*',

      '/docs/2.0/caching/:path*': '/v2/caching/:path*',
      '/docs/2.0/data/:path*': '/v2/data/:path*',
      '/docs/2.0/local-state/:path*': '/v2/local-state/:path*',
      '/docs/2.0/development-and-testing/:path*': '/v2/development-and-testing/:path*',
      '/docs/2.0/performance/:path*': '/v2/performance/:path*',
      '/docs/2.0/recipes/:path*': '/v2/recipes/:path*',
      '/docs/2.0/migration/:path*': '/v2/migration/:path*',

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
