const {umdModuleIds} = require('../../ng-package');

module.exports = {
  dest: 'build',
  lib: {
    entryFile: 'src/index.ts',
    flatModuleFile: 'ng.apolloLink.http',
    umdModuleIds,
  },
  whitelistedNonPeerDependencies: ['apollo-angular-link-http-common'],
};
