import React from 'react';
import { ThemeProvider, Header, FooterExtended } from '@theguild/components';

// Default implementation, that you can customize
function Root({ children }) {
  return (
    <ThemeProvider>
      <Header activeLink={'/open-source'} accentColor="var(--ifm-color-primary)" />
      {children}
      <FooterExtended resources={[
        {
          children: 'Introduction',
          title: 'Get started',
          href: '/docs',
        },
        {
          children: 'Fetching',
          title: 'Learn about Fetching',
          href: '/docs/data/queries',
        },
        {
          children: 'Local State',
          title: 'Learn about Local State',
          href: '/docs/local-state/management',
        },
      ]}/>
    </ThemeProvider>
  );
}

export default Root;
