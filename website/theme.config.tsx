/* eslint-disable react-hooks/rules-of-hooks */
/* eslint sort-keys: error */
import { AngularLogo, defineConfig, Giscus, useTheme } from '@theguild/components';
import { useRouter } from 'next/router';

const SITE_NAME = 'Apollo Angular';

export default defineConfig({
  docsRepositoryBase: 'https://github.com/kamilkisiela/apollo-angular/tree/master/website',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={`${SITE_NAME}: documentation`} />
      <meta name="og:title" content={`${SITE_NAME}: documentation`} />
    </>
  ),
  logo: (
    <>
      <AngularLogo className="mr-1.5 h-9 w-9" />
      <div>
        <h1 className="md:text-md text-sm font-medium">{SITE_NAME}</h1>
        <h2 className="hidden text-xs sm:block">GraphQL Client for Angular Framework</h2>
      </div>
    </>
  ),
  main: {
    extraContent() {
      const { resolvedTheme } = useTheme();
      const { route } = useRouter();

      if (route === '/') {
        return null;
      }
      return (
        <Giscus
          // ensure giscus is reloaded when client side route is changed
          key={route}
          repo="kamilkisiela/apollo-angular"
          repoId="MDEwOlJlcG9zaXRvcnk1NjM1NjcwNg=="
          category="Docs Discussions"
          categoryId="DIC_kwDOA1vvYs4CSDSL"
          mapping="pathname"
          theme={resolvedTheme}
        />
      );
    },
  },
  titleSuffix: ` – ${SITE_NAME}`,
});
