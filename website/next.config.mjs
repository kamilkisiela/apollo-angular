import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  redirects: () =>
    Object.entries({
      '/docs/basics/mutations.html': '/docs/data/mutations',
      '/docs/1.0/basics/setup': '/v1',
      '/docs/basics/setup.html': '/docs/get-started',
      '/docs/1.0/features/cache-updates': 'v1/basics/setup',
      '/docs/1.0/basics/caching': '/v1/basics/queries',
      '/docs/features/cache-updates': '/docs/caching/configuration',
      '/docs/Roboto-Regular.ttf': '/docs',
      '/docs/basics/queries.html': '/docs/data/queries',
      '/docs/1.0/basics/network-layer': '/v1/basics/network-layer',
      '/docs/1.0/basics/local-state': '/v1/basics/local-state',
      '/docs/1.0/features/error-handling': '/v1/features/error-handling',
      '/docs/1.0/recipes/authentication': '/v1/recipes/authentication',
      '/docs/2.0/caching/advanced-topics': '/v2/caching/advanced-topics',
      '/docs/2.0/caching/field-behavior': '/v2/caching/field-behavior',
      '/docs/1.0/basics/mutations': '/v1/basics/mutations',
      '/docs/2.0/data/queries': '/v2/data/queries',
      '/docs/1.0/features/static-typing': '/v1/features/static-typing',
      '/docs/1.0/guides/testing': '/v1/guides/testing',
      '/docs/1.0/recipes/server-side-rendering': '/v1/recipes/server-side-rendering',
      '/docs/guides/testing.html': '/docs',
      '/docs/1.0/features/caching': '/v1/features/caching',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
