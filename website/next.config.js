import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  output: 'export',
  redirects: () =>
    Object.entries({
      '/docs/features/subscriptions.html': '/docs/data/subscriptions',

      '/docs/basics/:slug*': '/docs/data/:slug',

      '/docs/features/developer-tooling': '/docs/development-and-testing/developer-tools',
      '/docs/features/developer-tooling.html': '/docs/development-and-testing/developer-tools',
      '/docs/features/multiple-clients.html': '/docs/recipes/multiple-clients',
      '/docs/features/optimistic-ui.html': '/docs/performance/optimistic-ui',
      '/docs/recipes/pagination.html': '/docs/data/pagination',
      '/docs/recipes/prefetching.html': '/docs',
      '/docs/recipes/prefetching': '/docs',
      '/docs/recipes/server-side-rendering.html': '/docs/performance/server-side-rendering',
      '/docs/features/static-typing.html': '/docs',
      '/docs/features/caching.html': '/docs',
      '/docs/features/cache-updates': '/docs',
      '/docs/features/subscriptions': '/docs/data/subscriptions',
      '/docs/features/cache-updates.html': '/docs',
      '/docs/features/fragments.html': '/docs/data/fragments',
      '/docs/guides/testing.html': '/docs/development-and-testing/testing',
      '/docs/guides/testing': '/docs/development-and-testing/testing',
      '/docs/data': '/docs/data/queries',
      '/docs/caching': '/docs/caching/configuration',
      '/docs/local-state': '/docs/local-state/management',
      '/docs/development-and-testing': '/docs/development-and-testing/using-typescript',
      '/docs/performance': '/docs/performance/improving-performance',
      '/docs/features/error-handling': '/docs/data/error-handling',
      '/docs/guides/tools-and-packages': '/docs/development-and-testing/developer-tools',
      '/docs/basics/network-layer': '/docs/data/network',
      '/docs/guides/state-management': '/docs/local-state/management',
      '/docs/basics/caching': '/docs/caching/configuration',

      '/docs/features/optimistic-ui': '/docs/performance/optimistic-ui',
      '/docs/recipes/query-splitting': '/docs/data/queries',
      '/docs/features/static-typing': '/docs',
      '/docs/basics/mutations': '/docs/data/mutations',
      '/docs/recipes/pagination': '/docs/data/pagination',
      '/docs/basics/queries': '/docs/data/queries',
      '/docs/recipes/meteor': '/docs',
      '/docs/recipes/server-side-rendering': '/docs/performance/server-side-rendering',
      '/docs/features/multiple-clients': '/docs/recipes/multiple-clients',

      '/docs/features/fragments': '/docs/data/fragments',
      '/get-started': '/docs/get-started',
      '/docs/data/setup#using-dependency-injection': '/docs/data/queries',
      '/docs/data/setup.html#using-dependency-injection': '/docs/data/queries',
      '/docs/data/setup': '/docs/data/queries',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
