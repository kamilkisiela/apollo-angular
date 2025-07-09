/* eslint sort-keys: error */
import { defineConfig, PRODUCTS } from '@theguild/components';

export default defineConfig({
  docsRepositoryBase: 'https://github.com/Ecodev/apollo-angular/tree/master/website',
  main({ children }) {
    return <>{children}</>;
  },
  websiteName: 'Apollo Angular',
  description: 'A fully-featured GraphQL client for Angular',
  logo: PRODUCTS.ANGULAR.logo({ className: 'w-8' }),
});
