const versions = require('./versions.json');

const allDocHomesPaths = [
  '/docs/',
  ...versions.slice(1).map((version) => `/docs/${version}/`),
];

module.exports = {
  title: 'Apollo Angular - GraphQL Client by The Guild',
  tagline: 'GraphQL Client for Angular Framework',

  url: 'https://apollo-angular.com',
  baseUrl: '/',
  favicon: 'img/logo/favicon.png',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',

  organizationName: 'kamilkisiela',
  projectName: 'apollo-angular',

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    hideableSidebar: true,
    image: 'img/cover.png',
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like Apollo Angular, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/kamilkisiela/apollo-angular">GitHub</a>! ⭐️',
      backgroundColor: 'var(--ifm-color-secondary)',
      textColor: 'var(--ifm-color-black)',
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: 'Apollo Angular',
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
        },
        {
          to: 'docs',
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
          position: 'right',
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
              to: 'docs',
            },
            {
              label: 'Fetching',
              to: 'docs/data/queries',
            },
            {
              label: 'Local State',
              to: 'docs/local-state/management',
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
    gtag: {
      trackingID: 'UA-125180910-5',
    },
  },
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap',
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects: (path) => {
          // redirect to /docs from /docs/index,
          // as index has been made the home doc
          if (allDocHomesPaths.includes(path)) {
            return [`${path}/index`];
          }
        },
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
  ],
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        debug: true,
        docs: {
          path: 'docs',
          include: ['**/*.md', '**/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/kamilkisiela/apollo-angular/edit/master/website/',
          lastVersion: 'current',
          versions: {
            current: {
              label: `v2`,
            },
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
};
