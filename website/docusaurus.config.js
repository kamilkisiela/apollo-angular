module.exports = {
  title: 'Apollo Angular',
  tagline:
    'GraphQL Client for Angular Framework',

  url: 'https://apollo-angular.com',
  baseUrl: '/',
  favicon: 'img/logo/favicon.png',
  onBrokenLinks: 'throw',

  organizationName: 'kamilkisiela',
  projectName: 'apollo-angular',

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    sidebarCollapsible: true,
    image: 'img/cover.png',
    navbar: {
      title: 'Apollo Angular',
      items: [
        {
          to: 'docs/index',
          activeBasePath: 'docs',
          label: 'API & Documentation',
          position: 'right',
        },
        {
          href: 'https://github.com/kamilkisiela/apollo-angular',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://the-guild.dev/contact',
          label: 'Support',
          position: 'right'
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Kamil Kisiela. All rights reserved.`,
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/index',
            },
            {
              label: 'Basics',
              to: 'docs/basics/setup',
            },
            {
              label: 'Features',
              to: 'docs/features/error-handling',
            },
            {
              label: 'Guides',
              to: 'docs/guides/state-management',
            },
            {
              label: 'Recipes',
              to: 'docs/recipes/query-splitting',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/xud7bH9',
            },
            {
              label: 'Other projects',
              href: 'https://the-guild.dev/open-source',
            },
            {
              label: 'About us',
              href: 'https://the-guild.dev',
            },
            {
              label: 'Community Meetings',
              href: 'https://github.com/the-guild-org/community-meetings',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              href: 'https://the-guild.dev/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/kamilkisiela/apollo-angular',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/kamilkisiela',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/the-guild-software',
            },
          ],
        },
      ],
    },
    googleAnalytics: {
      trackingID: 'UA-125180910-5',
    },
    // algolia: {
    //   apiKey: 'c81d6a17b6d40971f230c0d79b03ff23',
    //   indexName: 'apollo-angular',
    //   algoliaOptions: {},
    // },
  },
  scripts: [
    'https://the-guild.dev/static/banner.js',
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap',
  ],
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        docs: {
          path: 'docs',
          include: ['**/*.md', '**/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/kamilkisiela/apollo-angular/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          cacheTime: 600 * 1001, // 600 sec - cache purge period
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ]
};
