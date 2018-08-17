const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ng.apolloBoost',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: [
    'apollo-cache-inmemory',
    'apollo-angular',
    'apollo-client',
    'apollo-angular-link-http',
    'apollo-link',
    'apollo-link-error',
    'apollo-link-state',
    'graphql-tag',
  ],
};
