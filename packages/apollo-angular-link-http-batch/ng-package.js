const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ngApolloLinkHttpBatch',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: [
    'apollo-link',
    'apollo-link-batch',
    'apollo-angular-link-http-common',
  ],
};
