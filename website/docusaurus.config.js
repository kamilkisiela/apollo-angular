module.exports = {
  title: 'Apollo Angular',
  tagline: 'Use GraphQL with Angular',

  url: 'https://apollo-angular.com',
  baseUrl: '/',
  favicon: 'img/favicon/favicon.png',

  organizationName: 'kamilkisiela',
  projectName: 'apollo-angular',

  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: true,
    // image: 'img/github/app-action.jpg',
    announcementBar: {
      id: 'support_us',
      content:
        '⭐ If you like Apollo Angular give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/kamilkisiela/apollo-angular/">GitHub</a> ⭐',
      backgroundColor: '#292d3e',
      textColor: '#bfc7d5',
    },
    navbar: {
      title: 'Apollo Angular',
      logo: {
        alt: 'Apollo Angular Logo',
        src: 'img/just-logo.svg',
      },
      links: [
        {
          to: '/docs/',
          activeBasePath: '/docs',
          label: 'Documentation',
          position: 'right',
        },
        {
          href: 'https://github.com/kamilkisiela/apollo-angular',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Kamil Kisiela. All rights reserved.`,
      logo: {
        alt: 'Apollo Angular Logo',
        src: 'img/logo-white.svg',
      },
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
              to: 'docs/recipes/simple-example',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: 'Apollo Angular',
              to: 'docs/essentials/diff',
            },
            {
              label: 'GitHub Application',
              to: 'docs/recipes/github',
            },
            {
              label: 'GitHub Action',
              to: 'docs/recipes/action',
            },
            {
              label: 'Continous Integration',
              to: 'docs/recipes/ci',
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
              href: 'https://github.com/the-guild-org/Stack',
            },
            {
              label: 'Mailing List',
              href: 'https://upscri.be/19qjhi',
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
              href: 'https://medium.com/the-guild',
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
    //   indexName: 'graphql-inspector',
    //   algoliaOptions: {},
    // },
  },
  // scripts: [
  //   {
  //     src: '/js/scroll-to.js',
  //     async: true,
  //     defer: true,
  //   },
  //   {
  //     src: '/js/drift.js',
  //     async: true,
  //     defer: true,
  //   },
  // ],
  stylesheets: ['https://fonts.googleapis.com/css?family=Lato:300,400,700,900'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          include: ['**/*.md', '**/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/kamilkisiela/apollo-angular/edit/master/website/',
        },
        theme: {
          // customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          cacheTime: 600 * 1001, // 600 sec - cache purge period
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
};
