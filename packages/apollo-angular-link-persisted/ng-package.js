const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ngApolloLinkPersisted',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: [
    'apollo-link-context',
    'apollo-link-persisted-queries',
  ],
};
