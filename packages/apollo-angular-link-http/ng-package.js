const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ngApolloLinkHttp',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: ['apollo-angular-link-http-common', 'extract-files'],
};
