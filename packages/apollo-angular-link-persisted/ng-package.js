const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ng.apolloLink.persisted',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: [
    'apollo-link-context',
    'apollo-link-persisted-queries',
  ],
};
