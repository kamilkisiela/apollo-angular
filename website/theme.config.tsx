/* eslint sort-keys: error */
import { AngularLogo, defineConfig } from '@theguild/components';

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
  titleSuffix: ` – ${SITE_NAME}`,
});
